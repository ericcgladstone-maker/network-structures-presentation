/* Draft-5 pages added before and inside the case: 01 intro (why I think in networks), 02 network (what a network is),
   06 content (structure and content). Field coordinates: 1768 × 800. Type floor: explanatory text ≥ 23 px.
   Page order is set in beats-order.js. */
window.BEATS = window.BEATS || [];
(function () {
  var B = window.BEATS;
  var KICK = 'Organizational research · Networks and coordination';
  var MINT = '#6FD8BE';
  var halo = 'paint-order:stroke;stroke:#071A2B;stroke-width:6px';
  function svg(pg, U, id) { var s = U.el('svg', { id: id, width: 1768, height: 800, viewBox: '0 0 1768 800', role: 'img' }, pg); U.defs(s); return s; }

  // =========================================================================
  // 01 · intro — Eric first; separate people with ordinary attributes; relationships make the system visible
  // =========================================================================
  var PEOPLE = [['Engineer', 'remote'], ['Analyst', 'office'], ['Manager', 'hybrid'], ['Designer', 'office'], ['Engineer', 'hybrid'],
    ['Sales lead', 'remote'], ['Analyst', 'hybrid'], ['Engineer', 'office'], ['Support', 'remote']];
  // structured positions: two clusters and one person who links them
  var STRUCT = [[930, 150], [1050, 90], [1110, 230], [960, 300], [1260, 360], [1450, 140], [1580, 90], [1620, 240], [1470, 300]];
  var TIES = [[0, 1], [0, 2], [1, 2], [0, 3], [2, 3], [1, 3], [5, 6], [5, 7], [6, 7], [5, 8], [7, 8], [2, 4], [4, 8]];
  B.push({
    id: 'intro', noHeader: true, kicker: '',
    phases: [{ p: 0 }, { p: 1, say: 'Relationships add another class' }, { p: 2 }, { p: 2, say: 'An employee with relatively few contacts' }, { p: 3 }],
    desc: ['Eric Gladstone. Nine people, each described only by ordinary attributes.', 'Relationships added among the same people: the group becomes a structure.',
      'Information moves inside each cluster and only rarely across.', 'One person with few contacts links the two clusters.', 'Relationships as part of the object of analysis.'],
    source: 'Sources: Wasserman & Faust 1994; Borgatti, Mehra, Brass & Labianca 2009; Burt 1992; Brass et al. 2004',
    build: function (pg, U, NL) {
      var self = this;
      var div = document.createElement('div');
      div.style.cssText = 'position:absolute;left:0;top:-150px;width:720px';
      div.innerHTML = '<p class="op__over" style="font-size:23px">' + KICK + '</p>' +
        '<h1 class="op__title">Contemporary network structures in organizations</h1>' +
        '<p class="op__name">Eric Gladstone</p><p class="op__id" style="font-size:23px">Organizational behavior · social networks · collective behavior · computational social science</p>' +
        '<p class="op__prem">What changes when relationships become part of the explanation?</p>';
      pg.appendChild(div);
      var s = svg(pg, U, 'sv-intro');
      this.grid = PEOPLE.map(function (p, k) { return [930 + (k % 3) * 300, -40 + Math.floor(k / 3) * 190]; });
      this.eg = U.el('g', { class: 'ph' }, s);
      this.ties = TIES.map(function (t) { return U.line(self.eg, STRUCT[t[0]], STRUCT[t[1]], 'r-comm edge', 0, 0, { 'stroke-width': 2.4 }); });
      this.host = U.el('g', null, s);
      this.nodes = PEOPLE.map(function (p, k) {
        var g = U.el('g', { style: 'transition:transform 1.4s cubic-bezier(.4,0,.2,1)' }, s);
        U.el('circle', { r: 16, class: 'nd', 'stroke-width': 2.6 }, g);
        var at = U.el('g', { class: 'ph' }, g);
        U.text(at, 0, 48, p[0], 'lab lab--sm', { 'text-anchor': 'middle', style: halo });
        U.text(at, 0, 76, p[1], 'lab lab--sm', { 'text-anchor': 'middle', style: halo });
        g.__at = at; return g;
      });
      this.cap = U.text(s, 930, 540, '', 'lab lab--sm');
      this.bridgeLab = U.el('g', { class: 'ph' }, s);
      U.text(this.bridgeLab, STRUCT[4][0], STRUCT[4][1] + 60, 'few contacts · links two groups', 'lab lab--sm', { 'text-anchor': 'middle', style: halo + ';fill:' + MINT });
    },
    phase: function (k, U) {
      var self = this;
      this.nodes.forEach(function (g, j) {
        var p = k === 0 ? self.grid[j] : STRUCT[j];
        g.style.transform = 'translate(' + p[0] + 'px,' + p[1] + 'px)';
        U.cls(g.__at, 'is-on', k === 0);
        var c = g.querySelector('circle'); U.cls(c, 'is-hi', k >= 3 && j === 4);
      });
      U.cls(this.eg, 'is-on', k >= 1);
      U.cls(this.bridgeLab, 'is-on', k >= 3);
      this.cap.textContent = ['The same people, described by attributes', 'The same people, connected', 'Information travels along the ties', 'A consequential position with few ties', 'Relationships are part of the system'][k];
      // flows: mostly local; occasionally across the one bridge
      var local = [[0, 1], [2, 3], [5, 6], [7, 8], [1, 2], [6, 7]], across = [[3, 2, 4, 8, 5]];
      var send = function (j) {
        var path = j % 5 === 4 ? across[0] : local[j % local.length];
        U.token(self.host, path.map(function (x) { return STRUCT[x]; }), { dur: path.length > 2 ? 2600 : 900 });
      };
      if (k >= 2) { if (U.STILL) send(4); else { var j = 0; U.every(function () { send(j++); }, 700, 300); } }
    },
  });

  // =========================================================================
  // 02 · network — nodes, ties, dyad, triad and closure, a bridge, structure; direction, weight, time; tie vs flow
  // =========================================================================
  var N = [[330, 330], [520, 220], [520, 450], [800, 330], [1080, 330], [1270, 210], [1270, 450]];
  var E = { d01: [0, 1], d02: [0, 2], d12: [1, 2], d13: [1, 3], d34: [3, 4], d45: [4, 5], d46: [4, 6], d56: [5, 6] };
  var NET_STEPS = [
    // [visible ties, visible nodes, term, definition]
    [[], [0], 'Node', 'an entity we study: a person, team, project, document…'],
    [['d01'], [0, 1], 'Tie', 'a defined relationship between two nodes'],
    [['d01'], [0, 1], 'Dyad', 'two nodes and the relationship between them'],
    [['d01', 'd02'], [0, 1, 2], 'Triad', 'a third node: local structure begins to matter'],
    [['d01', 'd02', 'd12'], [0, 1, 2], 'Closure', 'two of my contacts also know one another'],
    [['d01', 'd02', 'd12', 'd13', 'd34', 'd45', 'd46', 'd56'], [0, 1, 2, 3, 4, 5, 6], 'Bridge', 'a tie spanning weakly connected regions; its ends can be brokerage positions'],
    [['d01', 'd02', 'd12', 'd13', 'd34', 'd45', 'd46', 'd56'], [0, 1, 2, 3, 4, 5, 6], 'Structure', 'local patterns add up to groups, paths and bottlenecks'],
    [['d01', 'd02', 'd12', 'd13', 'd34', 'd45', 'd46', 'd56'], [0, 1, 2, 3, 4, 5, 6], 'Directed', 'A seeks advice from B'],
    [['d01', 'd02', 'd12', 'd13', 'd34', 'd45', 'd46', 'd56'], [0, 1, 2, 3, 4, 5, 6], 'Weighted', 'repeated communication: a stronger tie'],
    [['d01', 'd02', 'd12', 'd13', 'd34', 'd45', 'd46', 'd56'], [0, 1, 2, 3, 4, 5, 6], 'Over time', 'ties persist or disappear'],
    [['d01', 'd02', 'd12', 'd13', 'd34', 'd45', 'd46', 'd56'], [0, 1, 2, 3, 4, 5, 6], 'Tie ≠ flow', 'the tie is the route; a message is what travels'],
    [['d01', 'd02', 'd12', 'd13', 'd34', 'd45', 'd46', 'd56'], [0, 1, 2, 3, 4, 5, 6], 'Position', 'produced partly by everyone else’s ties'],
  ];
  B.push({
    id: 'network', kicker: KICK,
    lensKey: 'Object', lens: ['A generic network', 'seven nodes held in place'],
    phases: [{ p: 0 }, { p: 0, say: 'A tie represents a relationship' }, { p: 1, say: 'A pair and their relationship' }, { p: 1, say: 'Add a third person' }, { p: 1, say: 'If my two contacts' },
      { p: 1, say: 'Repeat these local configurations' }, { p: 1, say: 'A path is a sequence' }, { p: 2, say: 'A relationship can be directed' }, { p: 2, say: 'It can be weighted' },
      { p: 2, say: 'It can persist or disappear' }, { p: 2, say: 'And a tie should be distinguished' }, { p: 4 }],
    desc: NET_STEPS.map(function (x) { return x[2] + ': ' + x[3] + '.'; }),
    source: 'Sources: Wasserman & Faust 1994; Borgatti, Mehra, Brass & Labianca 2009 · foundational concepts (Managing Social & Organizational Networks, 2017)',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-net'), self = this;
      this.edges = {}; var eg = U.el('g', null, s);
      Object.keys(E).forEach(function (k) {
        var a = N[E[k][0]], b = N[E[k][1]];
        self.edges[k] = U.line(eg, a, b, 'r-comm edge', 0, 0, { 'stroke-width': 3, style: 'transition:opacity .5s,stroke-width .5s' });
      });
      this.arrow = U.line(eg, N[0], N[1], 'r-adv edge', 0, 22, { 'marker-end': 'url(#ar-adv-sv-net)', 'stroke-width': 3.2 });
      this.host = U.el('g', null, s);
      this.nodes = N.map(function (p, k) { return U.el('circle', { cx: p[0], cy: p[1], r: 20, class: 'nd', 'stroke-width': 3, style: 'transition:opacity .5s' }, s); });
      // marks attached to the element each term names
      var mk = function (x, y, t) { var g = U.el('g', { class: 'ph' }, s); U.text(g, x, y, t, 'tag', { 'text-anchor': 'middle', style: halo }); return g; };
      this.m = {
        node: mk(N[0][0], N[0][1] - 40, 'Node'),
        tie: mk((N[0][0] + N[1][0]) / 2 - 40, (N[0][1] + N[1][1]) / 2 - 22, 'Tie'),
        dyad: U.el('g', { class: 'ph' }, s),
        triad: mk(470, 560, 'Triad'),
        closure: mk(600, 340, 'Closure'),
        bridge: mk(N[3][0], N[3][1] - 44, 'Bridge'),
      };
      // dyad: a bracket parallel to the tie, ticks pointing back at the pair, and its label
      (function () {
        var a = N[0], b = N[1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy), nx = dy / L, ny = -dx / L, ux = dx / L, uy = dy / L;
        var o = 46, t = 14, p0 = [a[0] + ux * 6 + nx * o, a[1] + uy * 6 + ny * o], p1 = [b[0] - ux * 6 + nx * o, b[1] - uy * 6 + ny * o];
        U.el('path', { d: 'M' + (p0[0] - nx * t) + ',' + (p0[1] - ny * t) + ' L' + p0[0] + ',' + p0[1] + ' L' + p1[0] + ',' + p1[1] + ' L' + (p1[0] - nx * t) + ',' + (p1[1] - ny * t), fill: 'none', stroke: MINT, 'stroke-width': 2.5 }, self.m.dyad);
        U.text(self.m.dyad, (p0[0] + p1[0]) / 2 + nx * 34, (p0[1] + p1[1]) / 2 + ny * 34 + 8, 'Dyad', 'tag', { 'text-anchor': 'middle', style: halo });
      })();
      this.term = U.text(s, 0, 700, '', 'num num--md', { style: 'fill:' + MINT });
      this.def = U.text(s, 0, 748, '', 'cap cap--sm');
      this.posLab = U.el('g', { class: 'ph' }, s);
      U.el('circle', { cx: N[3][0], cy: N[3][1], r: 34, fill: 'none', stroke: MINT, 'stroke-width': 2.5 }, this.posLab);
    },
    phase: function (k, U) {
      var st = NET_STEPS[k], self = this;
      Object.keys(this.edges).forEach(function (key) {
        var l = self.edges[key], on = st[0].indexOf(key) >= 0;
        l.style.opacity = on ? '' : 0;
        l.setAttribute('class', 'r-comm edge'); l.style.strokeWidth = '';
        l.style.strokeDasharray = '';
      });
      this.nodes.forEach(function (c, j) { c.style.opacity = st[1].indexOf(j) >= 0 ? '' : 0; c.classList.remove('is-hi'); });
      if (k === 1 || k === 2) { this.edges.d01.setAttribute('class', 'rt is-hi edge'); }
      if (k === 4) { this.edges.d12.setAttribute('class', 'rt is-hi edge'); }
      if (k === 5) { this.nodes[3].classList.add('is-hi'); this.edges.d13.setAttribute('class', 'rt is-hi edge'); this.edges.d34.setAttribute('class', 'rt is-hi edge'); }
      this.arrow.style.opacity = k >= 7 ? 1 : 0; if (k >= 7) this.edges.d01.style.opacity = 0;
      if (k >= 8) this.edges.d45.style.strokeWidth = k === 8 ? '10' : '7';
      if (k === 9) { this.edges.d02.style.strokeDasharray = '4 8'; this.edges.d02.style.opacity = 0.35; }
      U.cls(this.m.node, 'is-on', k === 0); U.cls(this.m.tie, 'is-on', k === 1); U.cls(this.m.dyad, 'is-on', k === 2);
      U.cls(this.m.triad, 'is-on', k === 3); U.cls(this.m.closure, 'is-on', k === 4); U.cls(this.m.bridge, 'is-on', k === 5 || k === 6);
      U.cls(this.posLab, 'is-on', k === 11);
      this.term.textContent = st[2]; this.def.textContent = st[3];
      if (k === 10) {
        var path = [N[0], N[1], N[3], N[4], N[5]];
        [['d01', 1], ['d13', 1], ['d34', 1], ['d45', 1]].forEach(function (x) { self.edges[x[0]].setAttribute('class', 'rt is-hi edge'); });
        if (U.STILL) U.token(this.host, path, { parkAt: 0.5 }); else U.every(function () { U.token(self.host, path, { dur: 2400 }); }, 2600, 200);
      }
      if (k === 11) this.nodes[3].classList.add('is-hi');
    },
  });

  // =========================================================================
  // 06 · content — one synthetic message event: its relational record and its content; what each content measure looks at
  // =========================================================================
  // tone: negative (coral) → neutral (grey) → positive (mint)
  function toneColor(v) {
    var c0 = [238, 140, 114], c1 = [138, 155, 168], c2 = [111, 216, 190], t = Math.max(-1, Math.min(1, v / 0.3));
    var a = t < 0 ? c1 : c1, b = t < 0 ? c0 : c2, u = Math.abs(t);
    return 'rgb(' + a.map(function (x, q) { return Math.round(x + (b[q] - x) * u); }).join(',') + ')';
  }
  window.toneColor = toneColor;
  // a generic network that teaches content networks (no Northline labels; illustrative values only)
  function contentNet(root, U) {
    var g = U.el('g', { class: 'ph' }, root), CX = 90, CY = 30;
    var N = [[150, 200], [300, 110], [330, 300], [180, 420], [420, 200], [690, 160], [820, 300], [700, 440], [560, 330]];
    var grp = [0, 0, 0, 0, 0, 1, 1, 1, 1];
    var nodeTone = [0.18, 0.12, -0.24, 0.15, 0.1, 0.05, -0.04, 0.02, 0.14];
    var E = [[0, 1, 0.2], [0, 3, 0.16], [1, 4, -0.12], [1, 2, -0.2], [2, 3, -0.26], [2, 4, -0.22], [0, 2, -0.18], [4, 8, 0.1], [8, 5, -0.24], [5, 6, 0.04], [6, 7, -0.02], [5, 7, 0.08], [8, 7, 0.06], [3, 4, 0.12]];
    var hulls = U.el('g', null, g);
    [[0, 0.06], [1, 0.02]].forEach(function (x) {
      var ks = grp.map(function (q, k) { return q === x[0] ? k : -1; }).filter(function (k) { return k >= 0; });
      var cx = ks.reduce(function (a, k) { return a + N[k][0]; }, 0) / ks.length, cy = ks.reduce(function (a, k) { return a + N[k][1]; }, 0) / ks.length;
      U.el('ellipse', { cx: CX + cx, cy: CY + cy, rx: x[0] ? 200 : 230, ry: 210, fill: x[0] ? 'rgb(150,160,170)' : 'rgb(200,150,140)', 'fill-opacity': 0.1, stroke: '#ffffff30', 'stroke-dasharray': '6 6' }, hulls);
      U.text(hulls, CX + cx, CY + cy + 250, x[0] ? 'mean valence: near neutral' : 'mean valence: slightly negative', 'lab lab--sm', { 'text-anchor': 'middle' });
    });
    var eg = U.el('g', null, g), lines = E.map(function (e) {
      return U.el('line', { x1: CX + N[e[0]][0], y1: CY + N[e[0]][1], x2: CX + N[e[1]][0], y2: CY + N[e[1]][1], stroke: '#6FA79B', 'stroke-width': 3, 'stroke-linecap': 'round' }, eg);
    });
    // a public channel for the audience state
    var ch = U.el('g', null, g);
    U.el('rect', { x: CX + 470, y: CY + 520, width: 230, height: 50, rx: 6, class: 'box' }, ch);
    U.text(ch, CX + 585, CY + 553, 'team channel', 'lab lab--sm', { 'text-anchor': 'middle' });
    var post = U.el('line', { x1: CX + N[4][0], y1: CY + N[4][1], x2: CX + 585, y2: CY + 520, stroke: toneColor(0.2), 'stroke-width': 3, 'stroke-dasharray': '8 6' }, ch);
    // topics for the topic-network state
    var tp = U.el('g', null, g), TP = [['Release planning', 160], ['Quality problems', 470], ['Hiring', 760]];
    var use = [[0, 1], [3, 1], [4, 0], [5, 1], [7, 1], [6, 2], [1, 0], [8, 0]];
    var tl = use.map(function (u) { return U.el('line', { x1: CX + N[u[0]][0], y1: CY + N[u[0]][1], x2: CX + TP[u[1]][1], y2: CY + 640, class: 'r-prj edge' }, tp); });
    TP.forEach(function (t) { U.el('rect', { x: CX + t[1] - 9, y: CY + 631, width: 18, height: 18, rx: 2, class: 'box box--hi' }, tp); U.text(tp, CX + t[1], CY + 680, t[0], 'lab lab--sm', { 'text-anchor': 'middle' }); });
    // semantic network: concepts as nodes, linked by co-occurrence (illustrative)
    var sem = U.el('g', null, g);
    var SC = [['handoff', 300, 150], ['release', 560, 120], ['deadline', 760, 260], ['test run', 420, 330], ['owner', 200, 380], ['review', 640, 450], ['staging', 330, 520]];
    [[0, 1, 4], [0, 3, 3], [1, 2, 3], [3, 2, 2], [0, 4, 2], [4, 5, 2], [2, 5, 3], [3, 6, 2], [1, 6, 1]].forEach(function (e) {
      U.el('line', { x1: CX + SC[e[0]][1], y1: CY + SC[e[0]][2], x2: CX + SC[e[1]][1], y2: CY + SC[e[1]][2], stroke: '#7FA7C9', 'stroke-width': 1 + e[2] * 1.2, opacity: 0.8 }, sem);
    });
    SC.forEach(function (c) { U.el('rect', { x: CX + c[1] - 10, y: CY + c[2] - 10, width: 20, height: 20, rx: 2, class: 'box box--hi' }, sem); U.text(sem, CX + c[1], CY + c[2] + 44, c[0], 'lab lab--sm', { 'text-anchor': 'middle', style: halo }); });
    // style rings
    var rings = U.el('g', null, g);
    N.forEach(function (p, k) { U.el('circle', { cx: CX + p[0], cy: CY + p[1], r: 30, fill: 'none', stroke: '#C6D3DE', 'stroke-width': [1.5, 4, 2.5, 3, 1.5, 4, 2, 3, 1.5][k], 'stroke-dasharray': k % 3 ? '3 4' : '' }, rings); });
    var nodes = N.map(function (p) { return U.el('circle', { cx: CX + p[0], cy: CY + p[1], r: 20, class: 'nd', 'stroke-width': 3 }, g); });
    // right-hand annotations, one block per state
    var A = function () { return U.el('g', { transform: 'translate(1080,70)' }, g); };
    var notes = [A(), A(), A(), A(), A(), A(), A(), A()];
    var lines2 = function (gr, y, arr, cls) { arr.forEach(function (t, j) { U.text(gr, 0, y + j * 40, t, cls || 'cap cap--sm'); }); };
    var plain = A(); U.text(plain, 0, 0, 'What moves along a tie', 'lab lab--hi'); lines2(plain, 50, ['the tie is the route;', 'the messages carry tone, style', 'and subject matter, and each', 'can be measured and attached', 'to the network']);
    U.text(notes[0], 0, 0, 'Tone on ties', 'lab lab--hi'); lines2(notes[0], 50, ['each tie: the mean valence of the', 'messages exchanged along it']);
    U.text(notes[1], 0, 0, 'Tone on people', 'lab lab--hi'); lines2(notes[1], 50, ['thick tie: below-zero dyadic valence', 'between two positive senders', 'coral node: a sender-level valence', 'pattern across partners', '', 'whose tone is it? the sender, the', 'recipient, or the dyad']);
    U.text(notes[2], 0, 0, 'Group tone', 'lab lab--hi'); lines2(notes[2], 50, ['average expressed valence within', 'a group; similarity along ties can', 'reflect influence, selection, or', 'shared exposure']);
    U.text(notes[3], 0, 0, 'Audience', 'lab lab--hi'); lines2(notes[3], 50, ['same person · different audience:', 'private exchange and public', 'team channel']);
    U.text(notes[4], 0, 0, 'Style and personality', 'lab lab--hi'); lines2(notes[4], 50, ['rings: illustrative language-based', 'trait estimates · substantial', 'individual error', 'highlighted tie: style matching,', 'similarity at one moment']);
    U.text(notes[5], 0, 0, 'Person ↔ topic affiliation', 'lab lab--hi'); lines2(notes[5], 50, ['who is talking about what;', 'shared problems without shared ties']);
    U.text(notes[6], 0, 0, 'Semantic network', 'lab lab--hi'); lines2(notes[6], 50, ['concepts are the nodes, linked when', 'they co-occur in the text: how', 'ideas are organized']);
    U.text(notes[7], 0, 0, 'What each layer describes', 'lab lab--hi');
    lines2(notes[7], 50, ['person–topic network → associations', '    between people and subjects', 'tone layer → expressed evaluative', '    valence, for one audience and channel', 'trait estimate → error-prone, per', '    person; scores suppressed', 'unit for diagnosis → tie, interface, group']);
    // tone legend
    var lg = U.el('g', { transform: 'translate(1080,560)' }, g);
    [-0.3, -0.15, 0, 0.15, 0.3].forEach(function (v, j) { U.el('rect', { x: j * 56, y: 0, width: 54, height: 14, rx: 2, fill: toneColor(v) }, lg); });
    U.text(lg, 0, 46, 'negative', 'lab lab--sm'); U.text(lg, 280, 46, 'positive', 'lab lab--sm', { 'text-anchor': 'end' });
    U.text(lg, 0, 84, 'illustrative values', 'lab lab--sm');
    return {
      show: function (j, U) {
        U.cls(g, 'is-on', j >= -1); if (j < -1) return;
        notes.forEach(function (n, q) { n.style.display = q === j ? '' : 'none'; }); plain.style.display = j === -1 ? '' : 'none';
        lg.style.display = j >= 0 && j <= 3 ? '' : 'none';
        hulls.style.display = j === 2 ? '' : 'none';
        ch.style.display = j === 3 ? '' : 'none';
        tp.style.display = j === 5 ? '' : 'none';
        sem.style.display = j === 6 ? '' : 'none';
        eg.style.opacity = j === 6 ? 0.06 : ''; nodes.forEach(function (c) { c.style.opacity = j === 6 ? 0.08 : ''; });
        rings.style.display = j === 4 ? '' : 'none';
        lines.forEach(function (l, q) {
          var e = E[q], col = j >= 0 && j <= 3 ? toneColor(e[2]) : '#6FA79B';
          l.setAttribute('stroke', col); l.style.opacity = j === 5 ? 0.2 : j === 3 ? (e[0] === 4 || e[1] === 4 ? 1 : 0.2) : j === 4 ? (q === 7 ? 1 : 0.3) : 1;
          l.setAttribute('stroke-width', j === 4 && q === 7 ? 7 : j === 1 && q === 8 ? 6 : 3);
        });
        nodes.forEach(function (c, q) { c.style.fill = j >= 1 && j <= 3 ? toneColor(nodeTone[q]) : ''; c.style.fillOpacity = j >= 1 && j <= 3 ? 0.9 : ''; });
      },
    };
  }
  // =========================================================================
  // 03 · flows — what flows through the ties: tone, audience, style and topics on a generic network
  // =========================================================================
  B.push({
    id: 'flows', kicker: KICK,
    lensKey: 'Concept', lens: ['A generic network', 'illustrative values'],
    phases: [{ p: 0 }, { p: 1 }, { p: 1, say: 'A node can summarize' }, { p: 2 }, { p: 3 }, { p: 4 }, { p: 4, say: 'Ideas create another family' }, { p: 4, say: 'A semantic or concept network' }, { p: 5 }],
    desc: ['A generic network: the ties are routes; messages move along them.', 'Each tie colored by the tone of the messages along it.', 'Each node colored by the sender’s typical valence: a sender-level pattern differs from one below-zero dyad.',
      'Group tone: two groups shaded by their average tone.', 'Audience: one person’s private messages beside the same person’s post to a public channel.',
      'Style on people (illustrative language-based estimates) and style matching on a tie.', 'Person ↔ topic affiliation: people linked to the topics they discuss.', 'A semantic network: concepts as nodes, linked by co-occurrence in the text.', 'What each representation describes, and the appropriate unit.'],
    source: 'Sources: Kenny & La Voie 1984; Kenny 1994; George 1990; Barsade 2002; Goffman 1959; Marwick & boyd 2011; Pennebaker & King 1999; Park et al. 2015; Ireland & Pennebaker 2010; Carley 1993',
    build: function (pg, U) { this.net = contentNet(svg(pg, U, 'sv-flows'), U); },
    phase: function (k, U) { this.net.show(k - 1, U); },
  });

  var MEASURES = [['topic', 'Topic', 'what the text concerns'], ['sentiment', 'Sentiment', 'evaluative polarity'], ['affect', 'Affect', 'emotional tone'],
    ['uncertainty', 'Uncertainty', 'hedging and epistemic stance'], ['semantic', 'Semantic', 'similarity, novelty, change']];
  B.push({
    id: 'content', kicker: KICK,
    lensKey: 'Example', lens: ['One synthetic Northline message', 'deadline week 4', 'Implementation (Central) → Service Operations'],
    phases: [{ p: 0 }, { p: 0, say: 'The message itself contains language' }, { p: 1, say: 'Topic measures ask' }, { p: 1, say: 'Sentiment usually estimates' },
      { p: 1, say: 'Affect measures try' }, { p: 1, say: 'Uncertainty measures can identify' }, { p: 1, say: 'Semantic representations' }, { p: 2 }, { p: 3 }, { p: 4 }],
    desc: ['One synthetic message event: its relational record (sender, recipient, week, channel, reply).', 'The same event’s content: the synthetic message text.',
      'Topic: what the text concerns.', 'Sentiment: evaluative words in the text.', 'Affect: emotional tone.', 'Uncertainty: hedging language.', 'Semantic representations: similarity, novelty, change.',
      'Each cue is not a conclusion.', 'Northline’s aggregate uncertainty and negative-affect features around the same interface.', 'Content governance.'],
    source: 'Synthetic, template-generated text (data/generate-content-examples.js) · Sources: Grimmer & Stewart 2013; Tausczik & Pennebaker 2010; Mohammad & Turney 2013; Liu 2012; Hyland 1998; Blei, Ng & Jordan 2003',
    build: function (pg, U, NL) {
      var root = svg(pg, U, 'sv-content'), s = U.el('g', null, root), self = this, C = (window.NLC || { examples: [] }).examples[0], O = NL.overload;
      this.C = C;
      if (!C) return;
      var unitName = function (u) { return u === 'IMPL-Central' ? 'Implementation (Central)' : u === 'SVC' ? 'Service Operations' : u; };
      // left: the relational record
      var L = U.el('g', { transform: 'translate(0,64)' }, s);
      U.text(L, 0, 0, 'Relational record', 'lab lab--hi');
      U.el('circle', { cx: 150, cy: 110, r: 22, class: 'nd fCS', 'stroke-width': 3 }, L);
      U.el('circle', { cx: 470, cy: 110, r: 22, class: 'nd fOP', 'stroke-width': 3 }, L);
      U.line(L, [150, 110], [470, 110], 'r-comm edge', 24, 30, { 'marker-end': 'url(#ar-mint-sv-content)', 'stroke-width': 3 });
      U.text(L, 150, 172, 'sender', 'lab', { 'text-anchor': 'middle' }); U.text(L, 470, 172, 'recipient', 'lab', { 'text-anchor': 'middle' });
      U.text(L, 150, 204, unitName(C.event.senderUnit), 'lab lab--sm', { 'text-anchor': 'middle' }); U.text(L, 470, 204, unitName(C.event.recipientUnit), 'lab lab--sm', { 'text-anchor': 'middle' });
      [['time', 'week ' + C.event.week + ' · a deadline week'], ['channel', C.event.channel], ['reply', 'answered; ' + C.event.repliesThatWeek + ' replies that week']].forEach(function (x, j) {
        U.text(L, 0, 290 + j * 44, x[0], 'lab'); U.text(L, 150, 290 + j * 44, x[1], 'cap cap--sm');
      });
      // right: the same event's content
      var R = U.el('g', { class: 'ph', transform: 'translate(640,64)' }, s); this.R = R;
      U.text(R, 0, 0, 'Content · synthetic text', 'lab lab--hi');
      this.cueLab = U.el('g', { class: 'ph' }, R);
      U.text(this.cueLab, 1120, 0, 'Synthetic teaching cues · no person-level score', 'lab lab--sm', { 'text-anchor': 'end', style: 'fill:' + MINT });
      U.el('rect', { x: 0, y: 30, width: 1120, height: 230, rx: 4, class: 'box' }, R);
      var cueOf = function (w) {
        var t = w.toLowerCase().replace(/[.,?']/g, ''), c = C.cues, out = [];
        if (c.topic.split(' ').indexOf(t) >= 0 || (t === 'settlement')) out.push('topic');
        if (c.sentiment.negative.concat(c.sentiment.positive).some(function (x) { return x.toLowerCase() === t; })) out.push('sentiment');
        if (c.affect.some(function (x) { return x.toLowerCase() === t; })) out.push('affect');
        if (c.uncertainty.some(function (x) { return x.toLowerCase().split(' ').indexOf(t) >= 0; })) out.push('uncertainty');
        return out;
      };
      var words = C.body.split(' '), lines = [], cur = [];
      words.forEach(function (w) { if ((cur.join(' ') + ' ' + w).length > 62) { lines.push(cur); cur = []; } cur.push(w); }); lines.push(cur);
      this.wordEls = [];
      lines.forEach(function (ln, j) {
        var t = U.text(R, 30, 84 + j * 44, '', 'cap');
        ln.forEach(function (w, i) { var sp = U.el('tspan', null, t); sp.textContent = (i ? ' ' : '') + w; sp.__cues = cueOf(w); self.wordEls.push(sp); });
      });
      // measure chips
      this.chips = MEASURES.map(function (m, j) {
        var g = U.el('g', { class: 'ph', transform: 'translate(' + (640 + (j % 3) * 380) + ',' + (380 + Math.floor(j / 3) * 96) + ')' }, s);
        U.el('rect', { x: 0, y: -40, width: 360, height: 84, rx: 4, class: 'box' }, g);
        U.text(g, 16, -10, m[1], 'lab lab--hi'); U.text(g, 16, 28, m[2], 'lab lab--sm');
        g.__id = m[0]; g.__box = g.querySelector('rect'); return g;
      });
      // interpretation limits
      var lim = U.el('g', { class: 'ph', transform: 'translate(0,560)' }, s); this.lim = lim;
      U.text(lim, 0, 0, 'A cue is not a conclusion', 'lab lab--hi');
      ['negative sentiment ≠ a poor relationship', 'uncertainty language ≠ stress', 'topic ≠ why the topic appeared'].forEach(function (x, j) { U.text(lim, 0, 44 + j * 40, x, 'cap cap--sm'); });
      // Northline's aggregate features around the same interface (used later on the overload page)
      var ag = U.el('g', { class: 'ph', transform: 'translate(640,560)' }, s); this.ag = ag;
      U.text(ag, 0, 0, 'Weekly averages for this interface', 'lab lab--hi');
      var tx = O.text;
      var spark = function (y, arr, name) {
        var xs = function (j) { return j * 38; }, ys = function (v) { return y + 50 - (v - 0.05) / 0.4 * 50; };
        U.el('path', { d: arr.map(function (v, j) { return (j ? 'L' : 'M') + xs(j) + ',' + ys(v).toFixed(1); }).join(' '), class: 'spark', stroke: MINT }, ag);
        U.text(ag, 470, y + 36, name, 'lab lab--sm');
      };
      spark(24, tx.weeklyUncertainty, 'uncertainty, by week'); spark(104, tx.weeklyNegative, 'negative affect, by week');
      U.text(ag, 0, 240, 'peaks fall in the deadline weeks; used on the overload page', 'lab lab--sm');
      var gov = U.el('g', { class: 'ph', transform: 'translate(640,560)' }, s); this.gov = gov;
      U.text(gov, 0, 0, 'Content governance', 'lab lab--hi');
      ['defined research purpose', 'employee and legal governance', 'restricted access · retention rules', 'proportional to the question'].forEach(function (x, j) { U.text(gov, 0, 44 + j * 40, x, 'cap cap--sm'); });
    },
    phase: function (k, U) {
      if (!this.C) return;
      U.cls(this.R, 'is-on', k >= 1);
      var active = k >= 2 && k <= 6 ? MEASURES[k - 2][0] : null;
      this.chips.forEach(function (g, j) { U.cls(g, 'is-on', k >= j + 2 && k <= 7); g.__box.setAttribute('class', 'box' + (g.__id === active ? ' box--hi' : '')); g.style.opacity = k >= 2 && k <= 6 && g.__id !== active ? 0.55 : ''; });
      this.wordEls.forEach(function (sp) { var on = active && sp.__cues.indexOf(active) >= 0; sp.style.fill = on ? MINT : ''; sp.style.textDecoration = on ? 'underline' : ''; });
      U.cls(this.cueLab, 'is-on', k >= 2 && k <= 6);
      U.cls(this.lim, 'is-on', k >= 7); U.cls(this.ag, 'is-on', k === 8); U.cls(this.gov, 'is-on', k >= 9);
      this.lim.style.opacity = k >= 8 ? 0.6 : '';
    },
  });
})();
