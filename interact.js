// Input: dragging from the palette, moving and resizing nodes, drawing arrows, zoom, keys.
(function () {
  const A = window.AWSDATA, S = window.S, R = window.R;
  const viewport = document.getElementById('viewport'), stage = document.getElementById('stage'),
        palette = document.getElementById('palette-list'), tip = document.getElementById('mode-tip');
  const I = window.I = {};
  const ZOOMS = [0.4, 0.5, 0.6, 0.75, 0.9, 1, 1.25, 1.5];

  const refresh = () => { R.render(); if (window.P) window.P.renderPanel(); };
  I.refresh = refresh;

  const toWorld = (cx, cy) => {
    const r = stage.getBoundingClientRect();
    return { x: (cx - r.left) / S.zoom, y: (cy - r.top) / S.zoom };
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const reparentAll = () => { for (let i = 0; i < 2; i++) S.nodes.forEach(A.reparent); };

  function place(kind, type, cx, cy) {
    const n = A.makeNode(kind, type, 0, 0);
    n.x = clamp(cx - n.w / 2, 0, S.world.w - n.w);
    n.y = clamp(cy - (kind === 'cont' ? 30 : n.h / 2), 0, S.world.h - n.h);
    S.nodes.push(n);
    if (kind === 'cont') reparentAll(); else A.reparent(n);
    S.sel = { type: 'node', id: n.id };
    refresh();
  }

  // ---------- Palette drag ----------
  let drag = null;
  palette.addEventListener('pointerdown', e => {
    const item = e.target.closest('.pitem'); if (!item || e.button > 0) return;
    drag = { kind: item.dataset.kind, type: item.dataset.type, item, sx: e.clientX, sy: e.clientY, ghost: null };
    item.setPointerCapture(e.pointerId);
  });
  palette.addEventListener('pointermove', e => {
    if (!drag) return;
    if (!drag.ghost && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) {
      const g = drag.item.cloneNode(true); g.classList.add('ghost'); g.style.width = drag.item.offsetWidth + 'px';
      document.body.append(g); drag.ghost = g;
    }
    if (drag.ghost) { drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px'; }
  });
  palette.addEventListener('pointerup', e => {
    if (!drag) return;
    const d = drag; drag = null;
    if (d.ghost) {
      d.ghost.remove();
      const r = viewport.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        const p = toWorld(e.clientX, e.clientY); place(d.kind, d.type, p.x, p.y);
      }
    } else addAtCentre(d.kind, d.type);
  });
  palette.addEventListener('pointercancel', () => { if (drag && drag.ghost) drag.ghost.remove(); drag = null; });
  palette.addEventListener('keydown', e => {
    const item = e.target.closest && e.target.closest('.pitem');
    if (item && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); addAtCentre(item.dataset.kind, item.dataset.type); }
  });
  let nudge = 0;
  function addAtCentre(kind, type) {
    const r = viewport.getBoundingClientRect();
    const p = toWorld(r.left + r.width / 2, r.top + r.height / 2);
    nudge = (nudge + 1) % 6;
    place(kind, type, p.x + nudge * 18, p.y + nudge * 18);
  }

  // ---------- Canvas pointer handling ----------
  let move = null;
  viewport.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    const linkEl = e.target.closest('[data-link]');
    if (linkEl && linkEl.dataset.link && S.tool === 'select') {
      S.sel = { type: 'link', id: linkEl.dataset.link }; refresh(); return;
    }
    const nodeEl = e.target.closest('.node');
    if (!nodeEl) { S.sel = null; S.connectSrc = null; setTip(); refresh(); return; }
    const n = A.byId(nodeEl.dataset.id); if (!n) return;

    if (S.tool === 'connect') {
      if (n.kind !== 'svc') return;
      if (!S.connectSrc) { S.connectSrc = n.id; S.sel = { type: 'node', id: n.id }; }
      else {
        const l = A.addLink(S.connectSrc, n.id);
        S.connectSrc = null;
        if (l) S.sel = { type: 'link', id: l.id };
      }
      setTip(); refresh(); return;
    }

    S.sel = { type: 'node', id: n.id };
    const resizing = e.target.classList.contains('resize');
    const group = resizing ? [] : [n, ...A.descendants(n.id)];
    const p = toWorld(e.clientX, e.clientY);
    move = { n, resizing, p0: p, start: group.map(g => ({ g, x: g.x, y: g.y })), w: n.w, h: n.h, moved: false };
    nodeEl.setPointerCapture(e.pointerId);
    refresh();
  });

  viewport.addEventListener('pointermove', e => {
    if (S.connectSrc) drawPending(e);
    if (!move) return;
    const p = toWorld(e.clientX, e.clientY), dx = p.x - move.p0.x, dy = p.y - move.p0.y;
    if (!move.moved && Math.hypot(dx, dy) < 2) return;
    move.moved = true;
    if (move.resizing) {
      move.n.w = Math.max(120, Math.round((move.w + dx) / 10) * 10);
      move.n.h = Math.max(90, Math.round((move.h + dy) / 10) * 10);
    } else {
      move.start.forEach(s => {
        s.g.x = clamp(Math.round((s.x + dx) / 10) * 10, 0, S.world.w - s.g.w);
        s.g.y = clamp(Math.round((s.y + dy) / 10) * 10, 0, S.world.h - s.g.h);
      });
    }
    R.render();
  });

  const end = () => {
    if (!move) return;
    if (move.moved) { if (move.n.kind === 'cont') reparentAll(); else A.reparent(move.n); }
    move = null; refresh();
  };
  viewport.addEventListener('pointerup', end);
  viewport.addEventListener('pointercancel', end);

  function drawPending(e) {
    const src = A.byId(S.connectSrc), path = document.getElementById('pending-link');
    if (!src || !path) return;
    const p = toWorld(e.clientX, e.clientY), s = R.edgePoint(src, p.x, p.y);
    path.setAttribute('d', 'M' + s.x + ',' + s.y + ' L' + p.x + ',' + p.y);
  }

  // ---------- Tools ----------
  function setTip() {
    if (S.tool !== 'connect') { tip.hidden = true; return; }
    tip.hidden = false;
    tip.textContent = S.connectSrc ? 'Now click the service to connect to. Esc cancels.' : 'Connect mode: click the first service.';
  }
  I.setTool = t => { S.tool = t; S.connectSrc = null; setTip(); refresh(); };
  document.getElementById('btn-select').onclick = () => I.setTool('select');
  document.getElementById('btn-connect').onclick = () => I.setTool(S.tool === 'connect' ? 'select' : 'connect');

  const zoomBy = dir => {
    let i = ZOOMS.findIndex(z => Math.abs(z - S.zoom) < 0.001); if (i < 0) i = 5;
    S.zoom = ZOOMS[clamp(i + dir, 0, ZOOMS.length - 1)]; R.render();
  };
  document.getElementById('btn-zoom-in').onclick = () => zoomBy(1);
  document.getElementById('btn-zoom-out').onclick = () => zoomBy(-1);

  I.deleteSelection = function () {
    if (!S.sel) return;
    if (S.sel.type === 'node') A.removeNode(S.sel.id);
    else S.links = S.links.filter(l => l.id !== S.sel.id);
    S.sel = null; refresh();
  };

  document.addEventListener('keydown', e => {
    const t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT');
    if (typing) return;
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); I.deleteSelection(); }
    else if (e.key === 'Escape') { S.connectSrc = null; if (S.tool === 'connect') S.tool = 'select'; else S.sel = null; setTip(); refresh(); }
    else if (e.key === 'c' || e.key === 'C') I.setTool(S.tool === 'connect' ? 'select' : 'connect');
    else if (e.key === 'v' || e.key === 'V') I.setTool('select');
  });
})();
