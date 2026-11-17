// Model: nodes (services and containers), links (arrows), and selection.
(function () {
  const CAT = Object.fromEntries(window.AWS_CATEGORIES.map(c => [c.id, c]));
  const SVC = Object.fromEntries(window.AWS_SERVICES.map(s => [s.id, s]));
  const CONT = Object.fromEntries(window.AWS_CONTAINERS.map(c => [c.id, c]));
  const SVC_W = 112, SVC_H = 100;

  const S = window.S = {
    nodes: [], links: [], sel: null, tool: 'select', zoom: 1, connectSrc: null, seq: 1,
    world: { w: 4000, h: 3000 }
  };
  const A = window.AWSDATA = { CAT, SVC, CONT, SVC_W, SVC_H };

  A.def = n => n.kind === 'cont' ? CONT[n.type] : SVC[n.type];
  A.color = n => n.kind === 'cont' ? CONT[n.type].color : CAT[SVC[n.type].cat].color;
  A.byId = id => S.nodes.find(n => n.id === id);
  A.uid = p => p + (S.seq++);

  A.defaultProps = def => {
    const p = {};
    (def.options || []).forEach(o => { p[o.key] = o.default; });
    return p;
  };

  A.makeNode = function (kind, type, x, y) {
    const def = kind === 'cont' ? CONT[type] : SVC[type];
    const n = { id: A.uid('n'), kind, type, x, y, parent: null, label: '', props: A.defaultProps(def) };
    n.w = kind === 'cont' ? def.w : SVC_W;
    n.h = kind === 'cont' ? def.h : SVC_H;
    return n;
  };

  A.center = n => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });

  A.descendants = function (id) {
    const out = [];
    const walk = pid => S.nodes.forEach(n => { if (n.parent === pid) { out.push(n); walk(n.id); } });
    walk(id);
    return out;
  };

  A.depth = function (n) {
    let d = 0, p = n.parent;
    while (p) { d++; p = (A.byId(p) || {}).parent; }
    return d;
  };

  // Smallest container under the point that may hold this node.
  A.containerAt = function (node, px, py) {
    const skip = new Set([node.id, ...A.descendants(node.id).map(d => d.id)]);
    const allowed = node.kind === 'cont' ? CONT[node.type].parents.filter(Boolean) : null;
    let best = null;
    S.nodes.forEach(c => {
      if (c.kind !== 'cont' || skip.has(c.id)) return;
      if (allowed && !allowed.includes(c.type)) return;
      if (px < c.x || py < c.y || px > c.x + c.w || py > c.y + c.h) return;
      if (!best || c.w * c.h < best.w * best.h) best = c;
    });
    return best;
  };

  A.reparent = function (node) {
    const c = A.center(node);
    const host = A.containerAt(node, c.x, c.y);
    node.parent = host ? host.id : null;
  };

  A.removeNode = function (id) {
    const n = A.byId(id);
    if (!n) return;
    S.nodes.forEach(k => { if (k.parent === id) k.parent = n.parent; });
    S.nodes = S.nodes.filter(k => k.id !== id);
    S.links = S.links.filter(l => l.from !== id && l.to !== id);
  };

  A.addLink = function (from, to) {
    if (from === to) return null;
    if (S.links.some(l => l.from === from && l.to === to)) return null;
    const l = { id: A.uid('l'), from, to, label: '', dashed: false };
    S.links.push(l);
    return l;
  };

  // Short text shown under a service: custom label or its name.
  A.title = n => n.label || (n.kind === 'cont' ? containerTitle(n) : SVC[n.type].name.replace(/^(Amazon|AWS) /, ''));
  function containerTitle(n) {
    const d = CONT[n.type], p = n.props;
    if (n.type === 'c-region') return 'Region · ' + p.name;
    if (n.type === 'c-az') return 'AZ · ' + p.name;
    if (n.type === 'c-vpc') return 'VPC · ' + p.cidr;
    if (n.type === 'c-account') return 'Account · ' + p.env;
    return d.name;
  }

  // Up to two short chips summarising the key settings on a service.
  A.chips = function (n) {
    const def = SVC[n.type], tg = [], sel = [];
    (def.options || []).forEach(o => {
      const v = n.props[o.key];
      if (o.type === 'toggle' && v && /Multi-AZ|multiple AZ|Spans|Global|Cross-region|Spot|Provisioned conc|Versioning|replica|WAF|DAX|Cluster/i.test(o.label))
        tg.push({ t: o.label.replace(/ \(.*\)/, '').replace(/^Part of an /, '').replace(/^Spans multiple AZs$/, 'Multi-AZ'), on: true });
      if (o.type === 'select' && /purchase|capacity|class|type|policy|launch|mode|engine|tier/i.test(o.key))
        sel.push({ t: String(v).replace(/ \(.*\)/, ''), on: false });
    });
    return tg.concat(sel).slice(0, 2);
  };

  A.clear = function () { S.nodes = []; S.links = []; S.sel = null; S.connectSrc = null; };
  A.serialize = brief => JSON.stringify({ v: 1, brief, nodes: S.nodes, links: S.links, seq: S.seq }, null, 2);
  A.load = function (json) {
    const d = JSON.parse(json);
    if (!d || !Array.isArray(d.nodes) || !Array.isArray(d.links)) throw new Error('Not a design file');
    const ok = d.nodes.filter(n => (n.kind === 'cont' ? CONT[n.type] : SVC[n.type]));
    const ids = new Set(ok.map(n => n.id));
    S.nodes = ok;
    S.links = d.links.filter(l => ids.has(l.from) && ids.has(l.to));
    S.seq = d.seq || 1000; S.sel = null; S.connectSrc = null;
    return d.brief || '';
  };
})();
