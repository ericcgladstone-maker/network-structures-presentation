/* Team-level organization view, shared by several beats.
   302 teams (every Northline employee belongs to one) drawn two ways:
     formal      the org chart: function columns, department boxes, orthogonal lines
     relational  positions from a force layout of working ties between teams
   The same team keeps the same mark in both, so the move preserves identity.
   Edges: team pairs joined by ≥ 2 working ties (NL.teamGraph.threshold). */
window.OrgView = function (U, NL, parent, box, opts) {
  opts = opts || {};
  var V = NL.views, teams = V.teams;
  var g = U.el('g', { class: 'org' }, parent);
  function fitter(pts, b) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    pts.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    var s = Math.min((b[2] - b[0]) / (x1 - x0), (b[3] - b[1]) / (y1 - y0));
    var ox = b[0] + ((b[2] - b[0]) - s * (x1 - x0)) / 2, oy = b[1] + ((b[3] - b[1]) - s * (y1 - y0)) / 2;
    return { s: s, f: function (p) { return [ox + (p[0] - x0) * s, oy + (p[1] - y0) * s]; } };
  }
  // formal extents include department boxes and function heads
  var fpts = teams.map(function (t) { return t.f; });
  V.deptBoxes.forEach(function (d) { fpts.push([d.x, d.y - 40]); fpts.push([d.x + d.w, d.y + d.h]); });
  V.fnHeads.forEach(function (h) { fpts.push([h.x, h.y - 30]); });
  fpts.push([960, 60]);
  var FB = fitter(fpts, box), RB = fitter(teams.map(function (t) { return t.r; }), opts.rbox || box);
  var F = teams.map(function (t) { return FB.f(t.f); }), R = teams.map(function (t) { return RB.f(t.r); });
  var s = FB.s;

  // ---- formal layer -----------------------------------------------------------
  var formal = U.el('g', { class: 'formal' }, g);
  var top = FB.f([960, 60]);
  var ceo = U.el('g', null, formal);
  U.el('circle', { cx: top[0], cy: top[1], r: 7, class: 'nd' }, ceo);
  if (!opts.compact) U.text(ceo, top[0] + 16, top[1] + 7, 'CEO', 'lab');
  var headY = FB.f([0, V.fnHeads[0].y])[1];
  var busY = (top[1] + headY) / 2;
  var hx = V.fnHeads.map(function (h) { return FB.f([h.x, h.y])[0]; });
  U.el('path', { d: 'M' + top[0] + ',' + (top[1] + 7) + ' V' + busY + ' M' + hx[0] + ',' + busY + ' H' + hx[hx.length - 1], class: 'fm' }, formal);
  V.fnHeads.forEach(function (h, k) {
    var p = FB.f([h.x, h.y]);
    U.el('path', { d: 'M' + p[0] + ',' + busY + ' V' + (p[1] - 7), class: 'fm' }, formal);
    U.el('circle', { cx: p[0], cy: p[1], r: 6, class: 'nd ' + U.fnClass(h.fn) }, formal);
    var nm = U.FN_NAME[h.fn];
    if (!opts.compact) U.text(formal, p[0], p[1] - 20, nm.replace('Product & Engineering', 'Product & Eng.').replace('Sales & Customer', 'Sales & Cust.'), 'lab lab--t2', { 'text-anchor': 'middle' });
    // spine down the column to department boxes
    var ds = V.deptBoxes.filter(function (d) { return d.fn === h.fn; });
    var lastBox = ds[ds.length - 1], bx = FB.f([lastBox.x, lastBox.y]);
    var spineX = FB.f([ds[0].x, 0])[0] - 5 * s;
    U.el('path', { d: 'M' + p[0] + ',' + (p[1] + 6) + ' V' + (p[1] + 22 * s) + ' H' + spineX + ' V' + (bx[1] + 12 * s), class: 'fm' }, formal);
    ds.forEach(function (d) {
      var a = FB.f([d.x, d.y]);
      U.el('path', { d: 'M' + spineX + ',' + (a[1] + 12 * s) + ' H' + a[0], class: 'fm' }, formal);
    });
  });
  var boxes = U.el('g', { class: 'fboxes' }, formal);
  V.deptBoxes.forEach(function (d) {
    var a = FB.f([d.x, d.y]);
    U.el('rect', { x: a[0], y: a[1], width: d.w * s, height: d.h * s, class: 'fm-box', rx: 3 }, boxes);
    if (!opts.compact && opts.deptNames) {
      var nm = U.DEPT[d.dept].name.replace(' (Legacy A)', ' · A').replace(' (Legacy B)', ' · B');
      var maxc = Math.floor(d.w * s / 7.4);
      if (nm.length > maxc) nm = nm.slice(0, maxc - 1) + '…';
      U.text(boxes, a[0] + 6, a[1] + 15 * s + 3, nm, 'lab', { style: 'font-size:' + Math.max(10, 12 * s).toFixed(1) + 'px;letter-spacing:.06em' });
    }
  });

  // ---- relational edges ---------------------------------------------------------
  var eg = U.el('g', { class: 'edges' }, g);
  var edges = V.teamEdges.map(function (e) {
    var ln = U.el('line', { class: 'rt edge', 'stroke-width': Math.min(3, 0.6 + e[2] * 0.12).toFixed(2) }, eg);
    ln.__e = e; return ln;
  });
  function placeEdges(P) {
    edges.forEach(function (ln) {
      var a = P[ln.__e[0]], b = P[ln.__e[1]];
      ln.setAttribute('x1', a[0].toFixed(1)); ln.setAttribute('y1', a[1].toFixed(1));
      ln.setAttribute('x2', b[0].toFixed(1)); ln.setAttribute('y2', b[1].toFixed(1));
    });
  }

  // ---- team marks ---------------------------------------------------------------
  var ng = U.el('g', { class: 'teams' }, g);
  var rad = function (t) { return Math.max(3.2, Math.sqrt(t.size) * 1.45 * Math.max(0.75, Math.min(1.2, s))); };
  var marks = teams.map(function (t, k) {
    var m = U.el('g', { class: 'tm', style: 'transition:opacity .6s' }, ng);
    var c = U.el('circle', { r: rad(t), class: 'nd ' + U.fnClass(t.fn), 'fill-opacity': 0.45 }, m);
    c.classList.add('fill');
    m.__c = c; m.__k = k;
    return m;
  });
  var layout = null, tween = null;
  function place(P) { marks.forEach(function (m, k) { m.style.transform = 'translate(' + P[k][0].toFixed(1) + 'px,' + P[k][1].toFixed(1) + 'px)'; }); }

  var api = {
    g: g, formal: formal, edges: edges, marks: marks, F: F, R: R, scale: s,
    pos: function () { return layout === 'r' ? R : F; },
    // move between layouts: teams and the ties between them travel together
    // (one tween drives both), so no edge is ever drawn at a stale position
    layout: function (which, animate) {
      if (which === layout) return;
      var P = which === 'r' ? R : F, P0 = layout === 'r' ? R : F;
      if (tween) { cancelAnimationFrame(tween); tween = null; }
      if (!animate || U.STILL || layout === null) { place(P); placeEdges(P); layout = which; return; }
      layout = which;
      var t0 = performance.now(), D = 1600;
      var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
      var step = function (now) {
        var f = Math.min(1, (now - t0) / D), e = ease(f);
        var Q = P.map(function (p, k) { return [P0[k][0] + (p[0] - P0[k][0]) * e, P0[k][1] + (p[1] - P0[k][1]) * e]; });
        place(Q); placeEdges(Q);
        tween = f < 1 ? requestAnimationFrame(step) : null;
      };
      tween = requestAnimationFrame(step);
    },
    edgesOn: function (on, op) { eg.style.opacity = on ? (op == null ? '' : op) : 0; },
    formalOn: function (op) { formal.style.transition = 'opacity .6s'; formal.style.opacity = op; },
    boxesOn: function (op) { boxes.style.opacity = op; },
    team: function (id) { return teams.findIndex(function (t) { return t.id === id; }); },
    centroid: function (ks, which) {
      var P = which === 'f' ? F : R, x = 0, y = 0;
      ks.forEach(function (k) { x += P[k][0]; y += P[k][1]; });
      return [x / ks.length, y / ks.length];
    },
    reset: function () {
      marks.forEach(function (m) { m.classList.remove('is-dim'); m.__c.classList.remove('is-hi', 'is-ring', 'is-warm', 'ln1', 'ln2', 'ln3'); m.__c.style.stroke = ''; m.__c.style.strokeWidth = ''; m.__c.setAttribute('fill-opacity', 0.45); });
      edges.forEach(function (ln) { ln.classList.remove('is-hi', 'is-dim', 'is-warm', 'is-gone', 'is-new'); });
    },
  };
  api.layout('f', false);
  return api;
};

/* Fixed grouped layout for the measurement group (beats 04 and 17): the focal
   employee's team on one ring, the most-tied team on a second, others on an arc. */
window.OrgView.groupLayout = function (V, box) {
  var tD = V.people[V.D].team, cnt = {};
  V.people.forEach(function (p) { if (p.team !== tD) cnt[p.team] = (cnt[p.team] || 0) + 1; });
  var t2 = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a] || (a < b ? -1 : 1); })[0];
  var gA = [], gB = [], gC = [];
  V.people.forEach(function (p, k) { (p.team === tD ? gA : p.team === t2 ? gB : gC).push(k); });
  var P = [], sx = box[2] / 1020, sy = box[3] / 700;
  var ringAt = function (arr, cx, cy, r) { arr.forEach(function (k, j) { var a = -Math.PI / 2 + j * 2 * Math.PI / arr.length; P[k] = [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }); };
  ringAt(gA, 260, 470, 175); ringAt(gB, 760, 470, 175);
  gC.forEach(function (k, j) { var a = Math.PI + (j + 0.5) * Math.PI / gC.length; P[k] = [510 + 470 * Math.cos(a), 250 + 190 * Math.sin(a)]; });
  return P.map(function (p) { return [box[0] + p[0] * sx, box[1] + (p[1] - 40) * sy]; });
};
/* Named communities (from the computed community table), used for labels. */
window.OrgView.namedCommunities = function (NL) {
  var C = NL.communities, V = NL.views, out = [];
  var ks = function (c) { var o = []; V.teams.forEach(function (t, k) { if (t.c === c) o.push(k); }); return o; };
  out.push({ c: C.deliveryCommunity.id, name: 'Delivery community', sub: 'Product · Client Solutions · Operations' });
  var impl = C.splitDepartments.find(function (d) { return d.dept === 'IMPL'; });
  (impl ? impl.communities : []).forEach(function (c) {
    var row = C.table.find(function (r) { return r.id === c; }) || { byUnit: {} };
    out.push({ c: c, name: (row.byUnit['IMPL-East'] || 0) >= (row.byUnit['IMPL-Central'] || 0) ? 'Implementation · East' : 'Implementation · Central', sub: '' });
  });
  C.table.forEach(function (r) {
    var a = (r.byUnit.LAENG || 0) + (r.byUnit.LACI || 0), b = (r.byUnit.LBENG || 0) + (r.byUnit.LBACC || 0);
    if (a / r.size >= 0.8) out.push({ c: r.id, name: 'Legacy A', sub: r.byUnit.LACI ? 'customer integration' : 'engineering' });
    if (b / r.size >= 0.8) out.push({ c: r.id, name: 'Legacy B', sub: r.byUnit.LBACC > (r.byUnit.LBENG || 0) ? 'account services' : 'engineering' });
  });
  out.forEach(function (o) { o.ks = ks(o.c); });
  return out.filter(function (o) { return o.ks.length; });
};
/* Place labels above cluster centroids; nudge apart so none overlap. */
window.OrgView.labels = function (U, ov, parent, groups, which) {
  var P = which === 'f' ? ov.F : ov.R, placed = [];
  groups.forEach(function (gp) {
    var c = ov.centroid(gp.ks, which), top = Infinity;
    gp.ks.forEach(function (k) { top = Math.min(top, P[k][1]); });
    var x = c[0], y = Math.max(top - 10, c[1] - 46), w = gp.name.length * 14.5 + 24;
    for (var tries = 0; tries < 30; tries++) {
      var hit = placed.some(function (b) { return Math.abs(b.x - x) < (b.w + w) / 2 && Math.abs(b.y - y) < 56; });
      if (!hit) break; y -= 28;
    }
    placed.push({ x: x, y: y, w: w });
    var g = gp.g = U.el('g', null, parent);
    U.text(g, x, y - (gp.sub ? 30 : 0), gp.name, 'tag', { 'text-anchor': 'middle', style: 'paint-order:stroke;stroke:#071A2B;stroke-width:6px' });
    if (gp.sub) U.text(g, x, y, gp.sub, 'lab lab--sm', { 'text-anchor': 'middle', style: 'paint-order:stroke;stroke:#071A2B;stroke-width:6px' });
    gp.labelAt = [x, y];
  });
};
