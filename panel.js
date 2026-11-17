// Properties panel: settings for the selected service, container or arrow.
(function () {
  const A = window.AWSDATA, S = window.S;
  const root = document.getElementById('props');
  const P = window.P = {};
  const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  function textField(label, value, placeholder, onInput, listId, listItems) {
    const f = h('div', 'field'), id = 'f' + Math.random().toString(36).slice(2, 8);
    const l = h('label', '', label); l.htmlFor = id;
    const i = h('input'); i.type = 'text'; i.id = id; i.value = value; i.placeholder = placeholder || '';
    i.addEventListener('input', () => onInput(i.value));
    f.append(l, i);
    if (listItems) {
      i.setAttribute('list', listId);
      const dl = h('datalist'); dl.id = listId;
      listItems.forEach(v => { const o = h('option'); o.value = v; dl.append(o); });
      f.append(dl);
    }
    return f;
  }

  function optionControl(n, o) {
    if (o.type === 'toggle') {
      const row = h('label', 'switch'), cb = h('input'); cb.type = 'checkbox'; cb.checked = !!n.props[o.key];
      cb.addEventListener('change', () => { n.props[o.key] = cb.checked; window.R.render(); });
      row.append(h('span', '', o.label), cb);
      return row;
    }
    const f = h('div', 'field'), id = 'f' + Math.random().toString(36).slice(2, 8);
    const l = h('label', '', o.label); l.htmlFor = id;
    const s = h('select'); s.id = id;
    o.choices.forEach(c => { const op = h('option', '', c); op.value = c; if (c === n.props[o.key]) op.selected = true; s.append(op); });
    s.addEventListener('change', () => { n.props[o.key] = s.value; window.R.render(); });
    f.append(l, s);
    return f;
  }

  function help() {
    const d = h('div', 'help');
    d.append(h('h2', '', 'Properties'));
    d.append(h('p', '', 'Select something on the canvas to change its settings.'));
    const ul = h('ul');
    [
      'Drag items from the left onto the canvas. Containers nest: Region, VPC, AZ, subnet.',
      'Drop a service inside a subnet and it joins that subnet. Moving a container moves what is inside it.',
      'Use Connect (or press C) and click two services to draw an arrow.',
      'Press Delete to remove the selected item. Esc deselects.'
    ].forEach(t => ul.append(h('li', '', t)));
    d.append(ul);
    return d;
  }

  P.renderPanel = function () {
    // Don't rebuild while a control inside is focused (it would drop focus mid-typing).
    const ae = document.activeElement;
    if (ae && root.contains(ae) && ae.tagName === 'INPUT' && ae.type === 'text' && P.keep) return;
    root.textContent = '';
    if (!S.sel) { root.append(help()); return; }

    if (S.sel.type === 'link') {
      const l = S.links.find(k => k.id === S.sel.id); if (!l) { root.append(help()); return; }
      const a = A.byId(l.from), b = A.byId(l.to);
      root.append(h('h2', '', 'Arrow'), h('p', 'sub', A.title(a) + '  →  ' + A.title(b)));
      root.append(textField('Label', l.label, 'e.g. HTTPS, SQL, async', v => { l.label = v; window.R.renderLinks(); }, 'link-labels',
        ['HTTPS', 'HTTP', 'SQL', 'Reads', 'Writes', 'Replication', 'Async', 'Events', 'Messages', 'Private link', 'VPN', 'Backup']));
      const row = h('label', 'switch'), cb = h('input'); cb.type = 'checkbox'; cb.checked = l.dashed;
      cb.addEventListener('change', () => { l.dashed = cb.checked; window.R.renderLinks(); });
      row.append(h('span', '', 'Dashed (async or optional path)'), cb); root.append(row);
      const rev = h('button', '', 'Reverse direction'); rev.style.marginTop = '12px'; rev.style.width = '100%';
      rev.onclick = () => { const t = l.from; l.from = l.to; l.to = t; window.I.refresh(); };
      root.append(rev);
      const del = h('button', 'danger', 'Delete arrow'); del.onclick = () => window.I.deleteSelection(); root.append(del);
      return;
    }

    const n = A.byId(S.sel.id); if (!n) { root.append(help()); return; }
    const def = A.def(n), color = A.color(n);
    const head = h('div', 'head'), badge = h('span', 'badge', def.abbr); badge.style.background = color;
    const t = h('div'); t.append(h('h2', '', def.name), h('p', 'sub', n.kind === 'cont' ? 'Container' : window.AWSDATA.CAT[def.cat].name));
    head.append(badge, t); root.append(head);
    if (def.tip) root.append(h('div', 'tip', def.tip));

    P.keep = true;
    root.append(textField('Label on diagram', n.label, 'e.g. Web tier', v => { n.label = v; window.R.render(); }));
    P.keep = false;
    const opts = def.options || [];
    if (opts.length) { const hd = h('div', 'lbl', 'Settings'); hd.style.cssText = 'font-size:12px;font-weight:600;color:var(--muted);margin:4px 0 2px'; root.append(hd); }
    opts.forEach(o => root.append(optionControl(n, o)));
    if (!opts.length) root.append(h('p', 'sub', 'No settings for this one. Use the label and arrows to show how it fits in.'));
    const del = h('button', 'danger', 'Delete ' + (n.kind === 'cont' ? 'container' : 'service'));
    del.onclick = () => window.I.deleteSelection(); root.append(del);
  };
})();
