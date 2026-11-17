// Drawing: palette, nodes, arrows.
(function () {
  const { CAT, SVC, CONT, SVC_W, SVC_H } = window.AWSDATA, A = window.AWSDATA, S = window.S;
  const NS = 'http://www.w3.org/2000/svg';
  const world = document.getElementById('world'), stage = document.getElementById('stage'),
        linksSvg = document.getElementById('links'), palette = document.getElementById('palette-list');
  const els = new Map();
  const R = window.R = {};

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const svg = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

  // ---------- Palette ----------
  R.renderPalette = function (q) {
    q = (q || '').trim().toLowerCase();
    palette.textContent = '';
    const match = (name, extra) => !q || name.toLowerCase().includes(q) || (extra || '').toLowerCase().includes(q);

    const groups = [];
    groups.push({ id: 'structure', name: 'Network structure', color: '#5c6b7a',
      items: window.AWS_CONTAINERS.filter(c => match(c.name)).map(c => ({ kind: 'cont', type: c.id, name: c.name, abbr: c.abbr, color: c.color })) });
    window.AWS_CATEGORIES.forEach(cat => {
      const items = window.AWS_SERVICES.filter(s => s.cat === cat.id && match(s.name, s.abbr))
        .map(s => ({ kind: 'svc', type: s.id, name: s.name.replace(/^(Amazon|AWS) /, ''), abbr: s.abbr, color: cat.color }));
      groups.push({ id: cat.id, name: cat.name, color: cat.color, items });
    });

    groups.forEach((g, i) => {
      if (!g.items.length) return;
      const d = el('details', 'group');
      d.open = !!q || i < 2;
      const sm = el('summary'); sm.append(el('span', '', g.name), el('span', 'count', String(g.items.length)));
      d.append(sm);
      const grid = el('div', 'items');
      g.items.forEach(it => {
        const p = el('div', 'pitem' + (it.kind === 'cont' ? ' container' : ''));
        p.dataset.kind = it.kind; p.dataset.type = it.type; p.title = it.name;
        p.tabIndex = 0;
        const b = el('span', 'badge', it.abbr); b.style.background = it.color;
        p.append(b, el('span', 'nm', it.name));
        grid.append(p);
      });
      d.append(grid); palette.append(d);
    });
    if (!palette.children.length) palette.append(el('p', 'palette-sub', 'No services match "' + q + '".'));
  };

  // ---------- Nodes ----------
  function build(n) {
    const e = el('div', 'node ' + n.kind);
    e.dataset.id = n.id;
    if (n.kind === 'svc') {
      e.append(el('div', 'badge'), el('div', 'label'), el('div', 'chips'));
    } else {
      e.append(el('div', 'tab'), el('div', 'resize'));
    }
    world.append(e); els.set(n.id, e);
    return e;
  }

  function update(n, e) {
    e.style.left = n.x + 'px'; e.style.top = n.y + 'px';
    e.classList.toggle('selected', !!(S.sel && S.sel.type === 'node' && S.sel.id === n.id));
    e.classList.toggle('connect-src', S.connectSrc === n.id);
    const color = A.color(n);
    if (n.kind === 'svc') {
      const b = e.children[0]; b.textContent = SVC[n.type].abbr; b.style.background = color;
      e.children[1].textContent = A.title(n);
      const chips = e.children[2]; chips.textContent = '';
      A.chips(n).forEach(c => chips.append(el('span', 'chip' + (c.on ? ' on' : ''), c.t)));
      e.title = SVC[n.type].name;
    } else {
      e.style.width = n.w + 'px'; e.style.height = n.h + 'px';
      e.style.borderColor = color; e.style.color = color;
      e.style.background = 'color-mix(in srgb, ' + color + ' 7%, transparent)';
      e.style.borderStyle = n.type === 'c-az' || n.type === 'c-edge' ? 'dashed' : 'solid';
      e.style.zIndex = 10 + A.depth(n) * 10;
      const tab = e.children[0]; tab.textContent = A.title(n); tab.style.background = color;
    }
  }

  R.render = function () {
    const live = new Set();
    S.nodes.forEach(n => { live.add(n.id); update(n, els.get(n.id) || build(n)); });
    els.forEach((e, id) => { if (!live.has(id)) { e.remove(); els.delete(id); } });
    R.renderLinks();
    document.getElementById('empty').hidden = S.nodes.length > 0;
    document.getElementById('viewport').classList.toggle('connecting', S.tool === 'connect');
    document.getElementById('btn-select').classList.toggle('active', S.tool === 'select');
    document.getElementById('btn-connect').classList.toggle('active', S.tool === 'connect');
    applyZoom();
  };

  function applyZoom() {
    world.style.transform = 'scale(' + S.zoom + ')';
    stage.style.width = S.world.w * S.zoom + 'px';
    stage.style.height = S.world.h * S.zoom + 'px';
    document.getElementById('zoom-label').textContent = Math.round(S.zoom * 100) + '%';
  }

  // ---------- Arrows ----------
  // Point where a line from the node's centre toward (tx,ty) leaves its box.
  R.edgePoint = function (n, tx, ty) {
    const c = A.center(n), dx = tx - c.x, dy = ty - c.y;
    if (!dx && !dy) return c;
    const sx = dx ? (n.w / 2) / Math.abs(dx) : Infinity, sy = dy ? (n.h / 2) / Math.abs(dy) : Infinity;
    const t = Math.min(sx, sy);
    return { x: c.x + dx * t, y: c.y + dy * t };
  };

  R.linkGeometry = function (l) {
    const a = A.byId(l.from), b = A.byId(l.to);
    if (!a || !b) return null;
    const ca = A.center(a), cb = A.center(b);
    let ox = 0, oy = 0;
    if (S.links.some(k => k.from === l.to && k.to === l.from)) {
      const len = Math.hypot(cb.x - ca.x, cb.y - ca.y) || 1;
      ox = -(cb.y - ca.y) / len * 7; oy = (cb.x - ca.x) / len * 7;
    }
    const p1 = R.edgePoint(a, cb.x + ox, cb.y + oy), p2 = R.edgePoint(b, ca.x + ox, ca.y + oy);
    return { x1: p1.x + ox, y1: p1.y + oy, x2: p2.x + ox, y2: p2.y + oy };
  };

  R.renderLinks = function () {
    linksSvg.textContent = '';
    const defs = svg('defs', {});
    const mk = (id, cls) => {
      const m = svg('marker', { id, viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '9', markerHeight: '9', orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' });
      m.append(svg('path', { d: 'M0,0 L10,5 L0,10 z', class: cls, style: 'fill:' + (cls === 'sel' ? 'var(--accent)' : 'var(--fg)') }));
      return m;
    };
    defs.append(mk('arrow', ''), mk('arrow-sel', 'sel'));
    linksSvg.append(defs);
    S.links.forEach(l => {
      const g = R.linkGeometry(l); if (!g) return;
      const selected = S.sel && S.sel.type === 'link' && S.sel.id === l.id;
      const d = 'M' + g.x1 + ',' + g.y1 + ' L' + g.x2 + ',' + g.y2;
      const grp = svg('g', { 'data-link': l.id });
      grp.append(svg('path', { d, class: 'hit', 'data-link': l.id }));
      grp.append(svg('path', { d, class: 'line' + (l.dashed ? ' dashed' : '') + (selected ? ' sel' : ''), 'marker-end': 'url(#' + (selected ? 'arrow-sel' : 'arrow') + ')' }));
      if (l.label) {
        const t = svg('text', { x: (g.x1 + g.x2) / 2, y: (g.y1 + g.y2) / 2 - 5 });
        t.textContent = l.label; grp.append(t);
      }
      linksSvg.append(grp);
    });
    const p = svg('path', { class: 'pending', id: 'pending-link', d: '' });
    linksSvg.append(p);
  };

  R.el = id => els.get(id);
})();
