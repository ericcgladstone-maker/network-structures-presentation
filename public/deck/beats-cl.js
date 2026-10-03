/* Beat 14: the content layer. The overloaded interface's working network with synthetic message tone,
   style and topics laid over it (data/generate-content-layer.js → metrics.json contentLayer).
   Field coordinates: 1768 × 800. */
window.BEATS = window.BEATS || [];
(function () {
  var B = window.BEATS;
  var KICK = 'Organizational research · Networks and coordination';
  var MINT = '#6FD8BE';
  var halo = 'paint-order:stroke;stroke:#071A2B;stroke-width:6px';
  function svg(pg, U, id) { var s = U.el('svg', { id: id, width: 1768, height: 800, viewBox: '0 0 1768 800', role: 'img' }, pg); U.defs(s); return s; }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function tone(v) { return window.toneColor(v); }
  function sgn(v) { return (v < 0 ? '−' : '') + Math.abs(v).toFixed(2); }

  B.push({
    id: 'content-layer', kicker: KICK,
    lensKey: 'Relation', lens: ['Recurring working ties', 'synthetic message tone, −1 to +1', '12 weeks'],
    phases: [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }, { p: 5 }, { p: 6 }, { p: 7 }, { p: 8 }, { p: 9 }],
    desc: ['The overloaded interface: Implementation (Central) and Service Operations employees, broker B and five of B’s contacts; each working tie colored by message tone.',
      'Across Northline: ties measured, the share below zero, the busiest quarter, and the frequency–tone correlation.',
      'Whose tone is it? Sender, recipient and relationship shares, estimated across all pairs; no person’s score shown.',
      'Two patterns, reported as counts: a cross-partner negative-tone pattern, and positive writers with one below-zero dyad.',
      'Audience: private messages and public channel posts, ordinary and deadline weeks, on the interface and elsewhere.',
      'Mean message valence by detected community: a descriptive aggregate, not a shared mood.',
      'Dispositions in aggregate: how many top-quarter flags are correct, against chance.',
      'Language style matching by tie strength, and within versus across communities.',
      'Pool ↔ topic affiliation: both legacy data-expert pools discuss the Pipeline rebuild; one working tie between them.',
      'What the content layer can and cannot establish.'],
    source: 'Synthetic features (data/generate-content-layer.js) · Sources: Kenny & La Voie 1984; Kenny 1994; Granovetter 1973; Marsden & Campbell 1984; George 1990; Barsade 2002; Park et al. 2015; Ireland & Pennebaker 2010; Carley 1993; Labianca & Brass 2006',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-cl'), self = this, V = NL.views.cl, CL = NL.contentLayer;
      this.V = V; this.CL = CL;
      var OX = 30, OY = 70;
      U.text(s, 0, 24, 'The overloaded interface: ' + V.n + ' employees and their recurring working ties', 'lab lab--sm', { style: halo });
      var net = U.el('g', { transform: 'translate(' + OX + ',' + OY + ')' }, s); this.net = net;
      var eg = U.el('g', null, net);
      var maxM = Math.max.apply(null, V.edges.map(function (e) { return e[3]; }));
      this.lines = V.edges.map(function (e) {
        var a = V.pos[e[0]], b = V.pos[e[1]];
        var l = U.el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'stroke-linecap': 'round' }, eg);
        l.__t = e[2]; l.__m = e[3]; l.__w = 1.2 + 4.5 * Math.sqrt(e[3] / maxM);
        var ua = V.people[e[0]].unit, ub = V.people[e[1]].unit; l.__in = ua === ub && (ua === 'IMPL-Central' || ua === 'SVC'); return l;
      });
      this.rings = V.people.map(function (p, k) {
        var P = V.pos[k]; return U.el('circle', { cx: P[0], cy: P[1], r: 13 + Math.max(0, p.est[1]) * 7, fill: 'none', stroke: '#C6D3DE', 'stroke-width': 2, class: 'ph' }, net);
      });
      this.nodes = V.people.map(function (p, k) {
        var P = V.pos[k]; return U.el('circle', { cx: P[0], cy: P[1], r: k === V.B ? 12 : 9, class: 'nd ' + U.fnClass(p.fn), 'stroke-width': 2.5 }, net);
      });
      var bp = V.pos[V.B]; U.text(net, bp[0], bp[1] - 22, 'B', 'tag', { 'text-anchor': 'middle', style: halo });
      // unit labels at the centroid of each side
      [['IMPL-Central', 'Implementation (Central)'], ['SVC', 'Service Operations']].forEach(function (u) {
        var ks = V.people.map(function (p, k) { return p.unit === u[0] ? k : -1; }).filter(function (k) { return k >= 0; });
        var x = ks.reduce(function (a, k) { return a + V.pos[k][0]; }, 0) / ks.length, y = Math.max.apply(null, ks.map(function (k) { return V.pos[k][1]; }));
        U.text(net, x, y + 48, u[1], 'lab lab--sm', { 'text-anchor': 'middle', style: halo });
      });
      // tone legend
      var lg = U.el('g', { transform: 'translate(' + OX + ',760)' }, s); this.lg = lg;
      [-0.3, -0.15, 0, 0.15, 0.3].forEach(function (v, j) { U.el('rect', { x: j * 56, y: -14, width: 54, height: 14, rx: 2, fill: tone(v) }, lg); });
      U.text(lg, 300, 0, 'tone: negative → positive · ties within one unit drawn faint', 'lab lab--sm');
      // right-hand panels
      var RX = 1000, panel = function () { return U.el('g', { class: 'ph', transform: 'translate(' + RX + ',70)' }, s); };
      var T = CL.ties, SR = CL.srm, PE = CL.people, AU = CL.audience, CM = CL.communities, DI = CL.dispositions, ST = CL.style, TO = CL.topics;
      this.p = [];
      // 0: what is drawn
      var p0 = panel(); U.text(p0, 0, 0, 'Tone on ties', 'lab lab--hi');
      U.lines(p0, 0, 50, ['each line: the average tone of the', 'synthetic messages exchanged along', 'that working tie over 12 weeks'], 'cap cap--sm', 40);
      this.p.push(p0);
      // 1: Northline-wide tie statistics
      var p1 = panel(); U.text(p1, 0, 0, 'Across Northline', 'lab lab--hi');
      [[fmt(T.measured), 'working ties with at least ' + T.minMessages + ' messages'], [T.strainedPct + '%', 'average below zero'], [T.busyStrainedPct + '%', 'of the busiest quarter average below zero'], [String(T.freqToneR), 'correlation of frequency and tone']].forEach(function (r, j) {
        U.text(p1, 0, 74 + j * 92, r[0], 'num num--md'); U.text(p1, 0, 74 + j * 92 + 36, r[1], 'cap cap--sm');
      });
      this.p.push(p1);
      // 2: decomposition
      var p2 = panel(); U.text(p2, 0, 0, 'Whose tone is it?', 'lab lab--hi');
      U.text(p2, 0, 40, fmt(SR.pairs) + ' directed pairs', 'lab lab--sm');
      var segs = [[SR.actorPct, 'sender', MINT], [SR.partnerPct, 'recipient', '#9FB2C1'], [SR.relationshipPct, 'relationship + noise', '#5E7384']], x0 = 0;
      segs.forEach(function (sg, j) {
        var w = sg[0] / 100 * 680;
        U.el('rect', { x: x0, y: 80, width: Math.max(2, w - 3), height: 34, rx: 3, fill: sg[2] }, p2);
        U.text(p2, 0, 180 + j * 44, sg[0] + '%  ' + sg[1], 'cap cap--sm', j === 0 ? { style: 'fill:' + MINT } : null);
        x0 += w;
      });
      U.lines(p2, 0, 340, ['estimated across all pairs;', 'no person’s score is shown'], 'lab lab--sm', 30, { style: 'fill:' + MINT });
      this.p.push(p2);
      // 3: kinds of people
      var p3 = panel(); U.text(p3, 0, 0, 'Two patterns, as counts', 'lab lab--hi');
      U.text(p3, 0, 80, String(PE.consistentlyNegative), 'num num--md');
      U.lines(p3, 0, 120, ['cross-partner negative-tone pattern:', 'below zero with two-thirds of', 'regular partners'], 'cap cap--sm', 36);
      U.text(p3, 0, 280, String(PE.oneStrainedTie), 'num num--md');
      U.lines(p3, 0, 320, ['positive overall, exactly one', 'below-zero dyad'], 'cap cap--sm', 36);
      U.lines(p3, 0, 440, ['reported as counts by team and', 'interface, never as named lists'], 'cap cap--sm', 36, { style: 'fill:' + MINT });
      this.p.push(p3);
      // 4: audience slope chart
      var p4 = panel(); U.text(p4, 0, 0, 'Audience: ordinary → deadline weeks', 'lab lab--hi');
      U.lines(p4, 0, 40, ['person-matched · descriptive channel comparison', 'audience and content differ across channels'], 'lab lab--sm', 28, { style: 'fill:' + MINT });
      var ax = function (v) { return 470 - (v + 0.25) / 0.5 * 360; };
      U.text(p4, 260, 520, 'ordinary', 'lab lab--sm', { 'text-anchor': 'middle' }); U.text(p4, 520, 520, 'deadline', 'lab lab--sm', { 'text-anchor': 'middle' });
      U.el('line', { x1: 230, y1: ax(0), x2: 560, y2: ax(0), stroke: '#ffffff30', 'stroke-dasharray': '4 6' }, p4);
      U.text(p4, 220, ax(0) + 6, '0', 'lab lab--sm', { 'text-anchor': 'end' });
      var rows = [[AU.samePrivateOther, AU.samePrivateDeadline, 'interface · private', tone(-0.3)], [AU.hotPublicOther, AU.hotPublicDeadline, 'interface · public', MINT], [AU.orgPrivateOther, AU.orgPrivateDeadline, 'rest · private', '#9FB2C1'], [AU.orgPublicOther, AU.orgPublicDeadline, 'rest · public', '#5E7384']];
      // label positions pushed apart so close values never overprint
      var spread = function (ys) { var o = ys.map(function (y, j) { return [y, j]; }).sort(function (a, b) { return a[0] - b[0]; }), out = []; o.forEach(function (x, q) { var y = q ? Math.max(x[0], out[o[q - 1][1]] + 30) : x[0]; out[x[1]] = y; }); return out; };
      var yl = spread(rows.map(function (r) { return ax(r[0]); })), yr = spread(rows.map(function (r) { return ax(r[1]); }));
      rows.forEach(function (r, j) {
        U.el('line', { x1: 260, y1: ax(r[0]), x2: 520, y2: ax(r[1]), stroke: r[3], 'stroke-width': 3 }, p4);
        [[260, r[0]], [520, r[1]]].forEach(function (q) { U.el('circle', { cx: q[0], cy: ax(q[1]), r: 7, fill: r[3] }, p4); });
        U.text(p4, 540, yr[j] + 6, sgn(r[1]), 'lab lab--sm');
        U.text(p4, 240, yl[j] + 6, r[2] + '  ' + sgn(r[0]), 'lab lab--sm', { 'text-anchor': 'end' });
      });
      U.text(p4, 0, 580, 'interface: the same ' + AU.people + ' employees · ' + fmt(AU.samePrivateMessages) + ' private messages, ' + fmt(AU.samePublicPosts) + ' public posts', 'lab lab--sm');
      this.p.push(p4);
      // 5: community tone strip
      var p5 = panel(); U.text(p5, 0, 0, 'Mean message valence by detected community', 'lab lab--hi');
      U.lines(p5, 0, 40, [CM.measured + ' communities with 20+ employees', 'descriptive aggregate · shared mood not measured'], 'lab lab--sm', 28);
      var cx = function (v) { return (v - 0.05) / 0.13 * 660; };
      U.el('line', { x1: 0, y1: 160, x2: 660, y2: 160, stroke: '#ffffff40' }, p5);
      CM.tones.forEach(function (c, j) { U.el('circle', { cx: cx(c.tone), cy: 160 + ((j % 3) - 1) * 16, r: 8, fill: tone(c.tone - 0.12), 'fill-opacity': 0.9 }, p5); });
      var dn = function (u) { var d = NL.departments.filter(function (x) { return x.id === u; })[0]; return d ? d.name : u; };
      U.lines(p5, cx(CM.lowest.tone), 230, [sgn(CM.lowest.tone), dn(CM.lowest.topUnit)], 'lab lab--sm', 30);
      U.lines(p5, cx(CM.highest.tone), 230, [sgn(CM.highest.tone), dn(CM.highest.topUnit)], 'lab lab--sm', 30, { 'text-anchor': 'end' });
      this.p.push(p5);
      // 6: dispositions
      var p6 = panel(); U.text(p6, 0, 0, 'Dispositions: language-based estimates', 'lab lab--hi');
      U.lines(p6, 0, 50, ['shown in aggregate only: no person', 'on the network carries a score'], 'lab lab--sm', 30);
      U.text(p6, 0, 150, 'correlation with latent values', 'lab lab--sm');
      U.text(p6, 0, 196, DI.estimateR.map(function (r) { return r.toFixed(2); }).join(' · '), 'num num--md');
      U.text(p6, 0, 280, 'flagged in the top quarter', 'lab lab--sm');
      U.el('rect', { x: 0, y: 300, width: 600, height: 30, rx: 3, class: 'bar bar--mu' }, p6);
      U.el('rect', { x: 0, y: 300, width: 600 * DI.topQuartileNeuroticismCorrect / DI.topQuartileNeuroticismFlagged - 3, height: 30, rx: 3, class: 'bar bar--hi' }, p6);
      var cx6 = 600 * DI.chanceCorrect / DI.topQuartileNeuroticismFlagged;
      U.el('line', { x1: cx6, y1: 290, x2: cx6, y2: 340, stroke: '#F2C94C', 'stroke-width': 3 }, p6);
      U.text(p6, cx6, 362, 'chance: ' + DI.chanceCorrect, 'lab lab--sm', { 'text-anchor': 'middle', style: 'fill:#F2C94C' });
      U.text(p6, 0, 420, fmt(DI.topQuartileNeuroticismCorrect) + ' of ' + fmt(DI.topQuartileNeuroticismFlagged) + ' actually in the top quarter', 'cap cap--sm', { style: 'fill:' + MINT });
      U.text(p6, 0, 460, 'most individual flags are wrong', 'cap cap--sm');
      this.p.push(p6);
      // 7: style matching
      var p7 = panel(); U.text(p7, 0, 0, 'Language style matching', 'lab lab--hi');
      U.lines(p7, 0, 40, ['0 = no match · 1 = identical style', 'synthetic association, by construction'], 'lab lab--sm', 28);
      var sx = function (v) { return v * 640; };
      [['weakest ties', ST.byStrength[0]], ['middle', ST.byStrength[1]], ['strongest ties', ST.byStrength[2]], ['within communities', ST.withinCommunity], ['across communities', ST.acrossCommunity]].forEach(function (r, j) {
        var y = 100 + j * 70 + (j >= 3 ? 30 : 0);
        U.el('rect', { x: 0, y: y, width: sx(r[1]), height: 22, rx: 3, class: j === 2 || j === 3 ? 'bar bar--hi' : 'bar bar--mu' }, p7);
        U.text(p7, 0, y + 52, r[0] + ' · ' + r[1].toFixed(2), 'lab lab--sm');
      });
      this.p.push(p7);
      // 8: topics and the legacy pools
      var p8 = panel(); U.text(p8, 0, 0, 'Pool ↔ topic affiliation · legacy data experts', 'lab lab--hi');
      var pools = [[60, 'Legacy A', TO.expertsA, TO.pipelineShareA], [520, 'Legacy B', TO.expertsB, TO.pipelineShareB]];
      pools.forEach(function (q) {
        U.text(p8, q[0] + 60, 90, q[1] + ' · ' + q[2] + ' experts', 'lab lab--sm', { 'text-anchor': 'middle' });
        U.text(p8, q[0] + 60, 122, q[3] + '% of their mentions', 'lab lab--sm', { 'text-anchor': 'middle', style: 'fill:' + MINT });
        U.el('line', { x1: q[0] + 60, y1: 246, x2: 350, y2: 390, stroke: MINT, 'stroke-width': 6 }, p8);
        U.el('circle', { cx: q[0] + 60, cy: 200, r: 46, class: 'nd fill fPE', 'fill-opacity': 0.3 }, p8);
      });
      U.el('line', { x1: 166, y1: 200, x2: 534, y2: 200, stroke: '#6FA79B', 'stroke-width': 1.5 }, p8);
      U.text(p8, 350, 188, TO.abTies + ' working tie', 'lab lab--sm', { 'text-anchor': 'middle' });
      U.el('rect', { x: 336, y: 390, width: 28, height: 28, rx: 3, class: 'box box--hi' }, p8);
      U.text(p8, 350, 460, 'Pipeline rebuild', 'cap cap--sm', { 'text-anchor': 'middle', style: 'fill:' + MINT });
      U.text(p8, 350, 498, TO.pipelineShareOrg + '% of mentions across Northline', 'lab lab--sm', { 'text-anchor': 'middle' });
      this.p.push(p8);
      // 9: limits
      var p9 = panel(); U.text(p9, 0, 0, 'What the layer can carry', 'lab lab--hi');
      ['engineered synthetic features', 'real use: validate for population,', '    language and channel', 'purpose must justify intrusiveness', 'unit: ties, interfaces, groups', 'content: what moves through the', '    structure, not only where it is'].forEach(function (t, j) { U.text(p9, 0, 60 + j * 44, t, 'cap cap--sm'); });
      this.p.push(p9);
    },
    phase: function (k, U) {
      var V = this.V;
      this.p.forEach(function (g, j) { U.cls(g, 'is-on', j === k); });
      this.net.style.opacity = k === 8 ? 0.15 : '';
      var colorNodes = false;
      this.lines.forEach(function (l) {
        var has = l.__t != null;
        l.setAttribute('stroke', has ? tone(l.__t) : '#5E7384');
        l.setAttribute('stroke-width', k === 1 ? l.__w : has ? 2.6 : 1);
        l.style.opacity = (k === 1 ? (has && l.__t < 0 ? 1 : 0.35) : has ? 0.9 : 0.3) * (l.__in ? 0.22 : 1);
      });
      this.nodes.forEach(function (c, j) {
        var p = V.people[j];
        c.style.fill = colorNodes && p.tone != null ? tone(p.tone) : ''; c.style.fillOpacity = colorNodes ? 0.95 : '';
        c.style.opacity = '';
      });
      this.rings.forEach(function (r, j) {
        var p = V.people[j];
        var on = false;
        U.cls(r, 'is-on', on);
        r.setAttribute('r', k === 6 ? 13 + Math.max(0, p.est[1]) * 7 : 17);
        r.setAttribute('stroke-dasharray', k === 3 && p.one ? '4 4' : '');
        r.setAttribute('stroke', k === 3 ? (p.cons ? tone(-0.3) : MINT) : '#C6D3DE');
      });
      this.lg.style.display = k <= 3 || k === 9 ? '' : 'none';
    },
  });
})();
