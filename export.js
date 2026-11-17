// PNG export (always light theme, white background) and JSON save/open.
(function () {
  const A = window.AWSDATA, S = window.S, R = window.R;
  const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', MONO = 'ui-monospace, Menlo, Consolas, monospace';
  const X = window.X = {};

  const rgba = (hex, a) => {
    const v = parseInt(hex.slice(1), 16);
    return 'rgba(' + (v >> 16) + ',' + ((v >> 8) & 255) + ',' + (v & 255) + ',' + a + ')';
  };
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function wrap(ctx, text, maxW, maxLines) {
    const words = String(text).split(/\s+/), lines = []; let cur = '';
    words.forEach(w => {
      const t = cur ? cur + ' ' + w : w;
      if (ctx.measureText(t).width <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,2}$/, '…'); }
    return lines;
  }

  X.png = function () {
    if (!S.nodes.length) return false;
    const pad = 40, scale = 2;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    S.nodes.forEach(n => { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + n.w); y1 = Math.max(y1, n.y + n.h); });
    const W = x1 - x0 + pad * 2, H = y1 - y0 + pad * 2;
    const cv = document.createElement('canvas'); cv.width = W * scale; cv.height = H * scale;
    const ctx = cv.getContext('2d');
    ctx.scale(scale, scale); ctx.translate(pad - x0, pad - y0);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x0 - pad, y0 - pad, W, H);

    // Containers, outermost first.
    S.nodes.filter(n => n.kind === 'cont').sort((a, b) => A.depth(a) - A.depth(b)).forEach(n => {
      const c = A.color(n);
      rr(ctx, n.x, n.y, n.w, n.h, 8); ctx.fillStyle = rgba(c, 0.07); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = c; ctx.setLineDash(n.type === 'c-az' || n.type === 'c-edge' ? [7, 5] : []); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = '600 11px ' + FONT; const title = A.title(n), tw = Math.min(ctx.measureText(title).width + 18, n.w - 8);
      ctx.fillStyle = c; rr(ctx, n.x, n.y, tw, 22, 6); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(title, n.x + 9, n.y + 11, tw - 14);
    });

    // Arrows.
    S.links.forEach(l => {
      const g = R.linkGeometry(l); if (!g) return;
      ctx.strokeStyle = '#1b2330'; ctx.fillStyle = '#1b2330'; ctx.lineWidth = 1.8; ctx.setLineDash(l.dashed ? [6, 4] : []);
      const ang = Math.atan2(g.y2 - g.y1, g.x2 - g.x1), hx = g.x2 - Math.cos(ang) * 8, hy = g.y2 - Math.sin(ang) * 8;
      ctx.beginPath(); ctx.moveTo(g.x1, g.y1); ctx.lineTo(hx, hy); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(g.x2, g.y2);
      ctx.lineTo(g.x2 - Math.cos(ang - 0.4) * 10, g.y2 - Math.sin(ang - 0.4) * 10);
      ctx.lineTo(g.x2 - Math.cos(ang + 0.4) * 10, g.y2 - Math.sin(ang + 0.4) * 10); ctx.closePath(); ctx.fill();
      if (l.label) {
        ctx.font = '11px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        const mx = (g.x1 + g.x2) / 2, my = (g.y1 + g.y2) / 2 - 5;
        ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.lineJoin = 'round'; ctx.strokeText(l.label, mx, my);
        ctx.fillStyle = '#1b2330'; ctx.fillText(l.label, mx, my);
      }
    });

    // Services.
    S.nodes.filter(n => n.kind === 'svc').forEach(n => {
      const c = A.color(n), def = A.def(n);
      ctx.save(); ctx.shadowColor = 'rgba(20,30,50,.18)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
      rr(ctx, n.x, n.y, n.w, n.h, 10); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
      ctx.lineWidth = 1.5; ctx.strokeStyle = '#d9dde5'; rr(ctx, n.x, n.y, n.w, n.h, 10); ctx.stroke();
      const bx = n.x + n.w / 2 - 19, by = n.y + 8;
      ctx.fillStyle = c; rr(ctx, bx, by, 38, 38, 8); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '700 12px ' + MONO; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(def.abbr, n.x + n.w / 2, by + 19, 34);
      ctx.fillStyle = '#1b2330'; ctx.font = '11px ' + FONT; ctx.textBaseline = 'alphabetic';
      const lines = wrap(ctx, A.title(n), n.w - 12, 2);
      lines.forEach((t, i) => ctx.fillText(t, n.x + n.w / 2, n.y + 58 + i * 12));
      const chips = A.chips(n);
      if (chips.length) {
        ctx.font = '600 9px ' + MONO;
        const ws = chips.map(k => Math.min(ctx.measureText(k.t).width + 6, 51)), total = ws.reduce((a, b) => a + b, 0) + (chips.length - 1) * 3;
        let cx = n.x + (n.w - total) / 2;
        chips.forEach((k, i) => {
          ctx.fillStyle = k.on ? rgba('#2b59d9', 0.15) : '#eef0f4'; rr(ctx, cx, n.y + 79, ws[i], 13, 3); ctx.fill();
          ctx.fillStyle = k.on ? '#2b59d9' : '#5d6879'; ctx.textAlign = 'left'; ctx.fillText(k.t, cx + 3, n.y + 88.5, ws[i] - 4); cx += ws[i] + 3;
        });
      }
    });

    cv.toBlob(b => download(b, 'architecture.png'), 'image/png');
    return true;
  };

  function download(blob, name) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  X.saveJson = brief => download(new Blob([A.serialize(brief)], { type: 'application/json' }), 'design.json');
})();
