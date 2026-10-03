/* Beats 07–12: centrality, expertise, vulnerability, overload, access, dynamics.
   Field coordinates: 1768 × 800. Type floor (draft 2): explanatory text ≥ 22 px in the 1920 deck. */
window.BEATS = window.BEATS || [];
(function () {
  var B = window.BEATS;
  var KICK = 'Organizational research · Networks and coordination';
  function svg(pg, U, id) { var s = U.el('svg', { id: id, width: 1768, height: 800, viewBox: '0 0 1768 800', role: 'img' }, pg); U.defs(s); return s; }
  var halo = 'paint-order:stroke;stroke:#071A2B;stroke-width:6px';
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function ordinal(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function adj(n, edges) { var a = []; for (var i = 0; i < n; i++) a.push([]); edges.forEach(function (e) { a[e[0]].push(e[1]); a[e[1]].push(e[0]); }); return a; }
  function bfsPath(A, s, t, blocked) {
    var prev = {}, seen = {}, q = [s]; seen[s] = 1;
    for (var h = 0; h < q.length; h++) { var v = q[h]; if (v === t) break; A[v].forEach(function (w) { if (!seen[w] && !(blocked && blocked[w])) { seen[w] = 1; prev[w] = v; q.push(w); } }); }
    if (!seen[t]) return null;
    var p = [t]; while (p[p.length - 1] !== s) p.push(prev[p[p.length - 1]]);
    return p.reverse();
  }
  // count a number from a to b (dp decimals) over ms, after delay; final value when still
  function countTo(U, el, a, b, ms, delay, dp, fmtFn) {
    var f = fmtFn || function (v) { return dp ? v.toFixed(dp) : fmt(Math.round(v)); };
    if (U.STILL) { el.textContent = f(b); return; }
    el.textContent = f(a);
    var n = 30;
    for (var i = 1; i <= n; i++) (function (i) { U.later(function () { var x = i / n, e = 1 - Math.pow(1 - x, 3); el.textContent = f(a + (b - a) * e); }, delay + ms * i / n); })(i);
  }
  var unitName = function (U, u) { if (u === 'IMPL-East') return 'Implementation · East'; if (u === 'IMPL-Central') return 'Implementation · Central'; return (U.DEPT[u] ? U.DEPT[u].name : u).replace(' (Legacy A)', ' · A').replace(' (Legacy B)', ' · B'); };

  // =========================================================================
  // 07 · centrality — A and B introduced together; then A's local hub, B's cross-function ties, the two measures
  // =========================================================================
  B.push({
    id: 'centrality', kicker: KICK,
    lensKey: 'Relation', lens: ['Working network: recurring collaboration + advice', '12 weeks', 'two employees'],
    phases: [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }, { p: 6 }, { p: 7 }],
    desc: ['Employees A and B: two synthetic Northline employees, each shown with all of their direct ties; colour = function.', 'Employee A: 72 direct ties, 89% inside the 440-person Implementation department.',
      'Employee B: 25 direct ties reaching four functions; routes move through B.', 'Degree and brokerage computed for both over all 3,200 employees.',
      'Centrality is a family: degree, betweenness, closeness, eigenvector.', 'B spans a structural hole between groups with few direct connections.', 'Each relation supports its own centrality; for cross-functional coordination, brokerage in the working network.'],
    source: 'Sources: Freeman 1978/79; Burt 1992, 2004; Borgatti 2005; Valente et al. 2008; Obstfeld 2005 · brokerage = share of cross-function shortest paths (Brandes 2001)',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-cen'), self = this, VA = NL.views.b6A, VB = NL.views.b6B, PA = NL.personas;
      U.text(s, 0, 16, 'Two synthetic Northline employees, each with all of their direct ties', 'lab lab--sm');
      // left: A's ego network
      var La = U.el('g', { class: 'ph-dim', transform: 'translate(60,34) scale(0.66)' }, s); this.La = La;
      VA.edges.forEach(function (e) { U.line(La, VA.pos[e[0]], VA.pos[e[1]], 'r-comm edge', 0, 0, { opacity: 0.3 }); });
      VA.people.forEach(function (p, k) { U.el('circle', { cx: VA.pos[k][0], cy: VA.pos[k][1], r: k === VA.center ? 16 : 7, class: 'nd ' + U.fnClass(p.fn) + (k === VA.center ? ' is-hi' : '') }, La); });
      var ca = VA.pos[VA.center];
      U.text(La, ca[0], ca[1] - 30, 'A', 'tag', { 'text-anchor': 'middle', style: 'font-size:36px;' + halo });
      // right: B's ego network, all 25 ties
      var Lb = U.el('g', { class: 'ph-dim', transform: 'translate(900,34) scale(0.66)' }, s); this.Lb = Lb;
      this.bA = adj(VB.people.length, VB.edges); this.bP = VB.pos; this.bC = VB.center;
      VB.edges.forEach(function (e) { if (e[0] !== VB.center && e[1] !== VB.center) U.line(Lb, VB.pos[e[0]], VB.pos[e[1]], 'r-comm edge', 0, 0, { opacity: 0.35 }); });
      this.bTies = U.el('g', null, Lb);
      VB.edges.forEach(function (e) { if (e[0] === VB.center || e[1] === VB.center) U.line(self.bTies, VB.pos[e[0]], VB.pos[e[1]], 'r-comm edge', 0, 0, { opacity: 0.55 }); });
      VB.people.forEach(function (p, k) { U.el('circle', { cx: VB.pos[k][0], cy: VB.pos[k][1], r: k === VB.center ? 16 : 9, class: 'nd ' + U.fnClass(p.fn) + (k === VB.center ? ' is-hi' : '') }, Lb); });
      var cb = VB.pos[VB.center];
      U.text(Lb, cb[0], cb[1] - 32, 'B', 'tag', { 'text-anchor': 'middle', style: 'font-size:36px;' + halo });
      // the functions B's ties reach, labelled at the centroid of B's neighbours in each function
      var nb = {}; VB.edges.forEach(function (e) { var o = e[0] === VB.center ? e[1] : e[1] === VB.center ? e[0] : -1; if (o >= 0) (nb[VB.people[o].fn] = nb[VB.people[o].fn] || []).push(o); });
      this.fnLab = U.el('g', { class: 'ph' }, Lb);
      Object.keys(nb).forEach(function (f) {
        var x = 0, y = 0; nb[f].forEach(function (k) { x += VB.pos[k][0]; y += VB.pos[k][1]; }); x /= nb[f].length; y /= nb[f].length;
        var dx = x - cb[0], dy = y - cb[1], d = Math.hypot(dx, dy) || 1;
        U.text(self.fnLab, x + dx / d * 90, y + dy / d * 70 + 8, U.FN_NAME[f] + ' · ' + nb[f].length, 'lab', { 'text-anchor': 'middle', style: 'font-size:36px;' + halo });
      });
      this.host = U.el('g', null, Lb);
      // captions
      var capA = U.el('g', { class: 'ph', transform: 'translate(40,478)' }, s); this.capA = capA;
      U.text(capA, 0, 0, 'A · ' + PA.A.degree + ' direct ties', 'cap');
      U.text(capA, 0, 36, PA.A.tiesInsideDeptPct + '% inside the ' + PA.A.deptSize + '-person Implementation department', 'lab lab--sm');
      var capB = U.el('g', { class: 'ph', transform: 'translate(900,478)' }, s); this.capB = capB;
      U.text(capB, 0, 0, 'B · ' + PA.B.degree + ' direct ties', 'cap');
      U.text(capB, 0, 36, 'reaching ' + PA.B.functionsReached + ' functions', 'lab lab--sm');
      // metric panel
      var M = U.el('g', { class: 'ph', transform: 'translate(40,576)' }, s); this.M = M;
      var bars = function (g, a, b, fa, fb) {
        U.text(g, 0, 90, 'A', 'lab'); U.el('rect', { x: 36, y: 74, width: Math.max(4, fa * 540), height: 14, rx: 3, class: 'bar bar--mu' }, g); U.text(g, 50 + Math.max(4, fa * 540), 90, a, 'lab lab--t2');
        U.text(g, 0, 132, 'B', 'lab'); U.el('rect', { x: 36, y: 116, width: Math.max(4, fb * 540), height: 14, rx: 3, class: 'bar bar--hi' }, g); U.text(g, 50 + Math.max(4, fb * 540), 132, b, 'lab lab--t2');
      };
      U.text(M, 0, 0, 'Degree', 'lab lab--hi'); U.text(M, 0, 36, 'how many direct ties', 'lab lab--sm');
      var dmax = Math.max(PA.A.degree, PA.B.degree);
      bars(M, String(PA.A.degree), String(PA.B.degree), PA.A.degree / dmax, PA.B.degree / dmax);
      var M2 = U.el('g', { transform: 'translate(860,0)' }, M);
      U.text(M2, 0, 0, 'Brokerage', 'lab lab--hi'); U.text(M2, 0, 36, 'share of cross-function shortest paths that pass through the person', 'lab lab--sm');
      var bmax = Math.max(PA.A.crossFnBrokeragePct3, PA.B.crossFnBrokeragePct3);
      bars(M2, PA.A.crossFnBrokeragePct3 + '%', PA.B.crossFnBrokeragePct3 + '%', PA.A.crossFnBrokeragePct3 / bmax, PA.B.crossFnBrokeragePct3 / bmax);
      U.text(M, 0, 170, 'Both computed over all ' + fmt(NL.org.employees) + ' employees in the working network.', 'lab lab--sm');
      var FAM = U.el('g', { class: 'ph', transform: 'translate(40,576)' }, s); this.FAM = FAM;
      U.text(FAM, 0, 0, 'Centrality is a family of measures', 'lab lab--hi');
      [['Degree', 'direct connection'], ['Betweenness', 'intermediary position'], ['Closeness', 'nearness to everyone else'], ['Eigenvector', 'ties to well-connected nodes']].forEach(function (x, j) {
        U.el('rect', { x: j * 420, y: 30, width: 400, height: 96, rx: 3, class: 'box' + (j === 1 ? ' box--hi' : '') }, FAM);
        U.text(FAM, j * 420 + 18, 70, x[0], 'cap cap--sm'); U.text(FAM, j * 420 + 18, 104, x[1], 'lab lab--sm');
      });
      U.text(FAM, 0, 176, 'The right measure follows the mechanism: here, brokerage across functions.', 'lab lab--sm');
      this.SH = U.el('g', { class: 'ph' }, Lb);
      U.text(this.SH, cb[0], cb[1] + 70, 'spans a structural hole', 'lab', { 'text-anchor': 'middle', style: 'font-size:36px;' + halo + ';fill:#6FD8BE' });
      U.legend(s, 0, 796, NL.functions.map(function (f) { return { kind: 'node', cls: 'f' + f.id, label: f.name.replace('Product & Engineering', 'Product & Eng.').replace('Sales & Customer', 'Sales & Cust.').replace('Client Solutions', 'Client Sol.') }; }));
      var R = U.el('g', { class: 'ph', transform: 'translate(40,576)' }, s); this.R = R;
      U.text(R, 0, 0, 'The same employees rank differently on another relation', 'lab lab--hi');
      this.rbox = ['Advice', 'Expertise reliance', 'Communication', 'Coordination', 'Trust'].map(function (x, j) {
        var b = U.el('rect', { x: j * 340, y: 30, width: 320, height: 56, rx: 3, class: 'box' }, R);
        U.text(R, j * 340 + 18, 67, x, 'cap cap--sm');
        return b;
      });
      var Q = U.el('g', { class: 'ph' }, R); this.Q = Q;
      U.text(Q, 0, 150, 'Northline’s problem is cross-functional coordination:', 'cap', { style: 'fill:#6FD8BE' });
      U.text(Q, 0, 192, 'brokerage in the working network is the relevant measure here.', 'cap cap--sm');
    },
    phase: function (k, U) {
      var self = this;
      U.cls(this.La, 'is-dim', k === 2 || k === 5); U.cls(this.Lb, 'is-dim', k === 1);
      U.cls(this.capA, 'is-on', k >= 1 && k <= 2); U.cls(this.capB, 'is-on', k === 2);
      U.cls(this.fnLab, 'is-on', k === 2); U.cls(this.SH, 'is-on', k === 5); U.cls(this.FAM, 'is-on', k === 4);
      this.bTies.querySelectorAll('line').forEach(function (l) { l.setAttribute('class', k === 2 ? 'rt is-hi edge' : 'r-comm edge'); l.style.opacity = k === 2 ? '' : 0.55; });
      U.cls(this.M, 'is-on', k === 3); U.cls(this.R, 'is-on', k >= 6); U.cls(this.Q, 'is-on', k >= 6);
      this.rbox.forEach(function (b, j) { U.cls(b, 'box--hi', k >= 6 && j === 3); });
      var nb = []; for (var i = 0; i < this.bP.length; i++) if (i !== this.bC) nb.push(i);
      var route = function (j) {
        // a shortest route between two of B's neighbours in different functions, through B
        var a = nb[j % nb.length], b = nb[(j * 7 + 3) % nb.length];
        var p = bfsPath(self.bA, a, b); if (p && p.indexOf(self.bC) > 0) U.token(self.host, p.map(function (x) { return self.bP[x]; }), { dur: 2200 });
        else U.token(self.host, [self.bP[a], self.bP[self.bC], self.bP[b]], { dur: 2200 });
      };
      if (k === 2 || k === 3 || k === 5) { if (U.STILL) route(0); else { var j = 0; U.every(function () { route(j++); }, 900, 200); } }
    },
  });

  // =========================================================================
  // 08 · expertise — people ↔ capabilities; common skills, the rare domain and S, then H vs S, the legacy pools, reliance
  // =========================================================================
  B.push({
    id: 'expertise', kicker: KICK,
    lensKey: 'Relations', lens: ['Employee ↔ skill (HRIS + project history)', 'expertise reliance (survey)'],
    phases: [{ p: 0 }, { p: 1 }, { p: 1, say: 'The synthetic Settlement engine' }, { p: 2 }, { p: 4 }, { p: 5 }, { p: 6 }],
    desc: ['A two-mode (bipartite) network: synthetic Northline employees (left column) tied to skills and domains (right column).', 'Broadly held skills: data pipelines, event streaming, cloud infrastructure, API design, data migration.',
      'The rare Settlement engine domain: three holders; specialist S is the only expert-level holder.', 'Employee H (6,835 messages) against specialist S (1,430 messages; named by 13 colleagues).',
      'Projection: two employees who share a skill become tied in the employee-only graph; capability overlap, with access measured separately.',
      'Legacy A and Legacy B experts, bracketed: both hold data-integration skills; one working tie between the pools.', 'Expertise-reliance ties: who knows who knows what.'],
    source: 'Sources: Wegner 1987; Borgatti & Cross 2003; Ren & Argote 2011; Lewis & Herndon 2011 · ledger rows 22–24',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-exp'), self = this, V = NL.views.b7, PA = NL.personas, LG = NL.cohesion.legacy;
      var n = V.people.length, top = 64, gap = Math.min(27, 640 / n), PX = 900, SX = 1330;
      var rank = function (k) { var p = V.people[k]; if (k === V.H) return 0; if (k === V.S) return 1; if (p.legacy === 'A') return 2; if (p.legacy === 'B') return 3; return 4; };
      var ord = V.people.map(function (p, k) { return k; }).sort(function (a, b) { return rank(a) - rank(b) || a - b; });
      this.pp = []; ord.forEach(function (k, j) { self.pp[k] = [PX, top + j * gap + (j ? 16 : 0)]; });
      this.sp = V.skills.map(function (sk, j) { return [SX, 70 + j * (640 / V.skills.length)]; });
      this.V = V;
      U.text(s, PX, 18, 'Employees', 'lab lab--hi', { 'text-anchor': 'middle' }); U.text(s, SX + 24, 18, 'Skills / domains', 'lab lab--hi');
      U.text(s, (PX + SX) / 2, 18, 'holds →', 'lab lab--sm', { 'text-anchor': 'middle' });
      var COMMON = { 'Data pipelines': 1, 'Event streaming': 1, 'Cloud infrastructure': 1, 'API design': 1, 'Data migration': 1 };
      var bi = U.el('g', null, s); this.bi = bi;
      this.ties = [];
      V.people.forEach(function (p, k) {
        p.skills.forEach(function (x) {
          var sk = V.skills[x[0]];
          var path = U.el('path', { d: 'M' + (self.pp[k][0] + 12) + ',' + self.pp[k][1] + ' C' + (PX + 220) + ',' + self.pp[k][1] + ' ' + (PX + 220) + ',' + self.sp[x[0]][1] + ' ' + (SX - 12) + ',' + self.sp[x[0]][1], class: 'r-skill edge', 'stroke-width': 1 + x[1] * 0.6, fill: 'none' }, bi);
          path.__k = k; path.__rare = sk.rare; path.__ov = sk.overlap; path.__common = !!COMMON[sk.name]; path.__leg = p.legacy; self.ties.push(path);
        });
      });
      this.skl = V.skills.map(function (sk, j) {
        var p = self.sp[j], g = U.el('g', null, s);
        U.el('rect', { x: p[0] - 9, y: p[1] - 9, width: 18, height: 18, rx: 2, class: 'box' + (sk.rare ? ' box--hi' : '') }, g);
        U.text(g, p[0] + 24, p[1] + 6, sk.name, 'cap cap--sm', sk.rare ? { style: 'fill:#6FD8BE' } : null);
        U.text(g, p[0] + 24, p[1] + 34, fmt(sk.holders) + ' hold it' + (sk.overlap ? ' · both legacy units' : ''), 'lab lab--sm');
        g.__sk = sk; g.__common = !!COMMON[sk.name]; return g;
      });
      var ra = U.el('g', { class: 'ph' }, s); this.ra = ra;
      V.reliance.forEach(function (e) {
        var a = self.pp[e[0]], b = self.pp[e[1]], r = Math.abs(a[1] - b[1]) / 2;
        U.el('path', { d: 'M' + (a[0] - 12) + ',' + a[1] + ' A' + r + ',' + r + ' 0 0 ' + (a[1] < b[1] ? 0 : 1) + ' ' + (b[0] - 12) + ',' + b[1], class: 'r-rel edge', fill: 'none', 'marker-end': 'url(#ar-rel-sv-exp)' }, ra);
      });
      var br = U.el('g', { class: 'ph' }, s); this.br = br;
      ['A', 'B'].forEach(function (L) {
        var ks = V.people.map(function (p, k) { return p.legacy === L ? k : -1; }).filter(function (k) { return k >= 0; });
        var ys = ks.map(function (k) { return self.pp[k][1]; }), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
        U.el('path', { d: 'M' + (PX - 30) + ',' + (y0 - 8) + ' h-10 V' + (y1 + 8) + ' h10', class: 'box box--hi', fill: 'none' }, br);
        U.text(br, PX - 52, (y0 + y1) / 2 + 8, 'Legacy ' + L, 'tag', { 'text-anchor': 'end' });
      });
      this.nodes = V.people.map(function (p, k) {
        var P = self.pp[k];
        return U.el('circle', { cx: P[0], cy: P[1], r: (k === V.H || k === V.S) ? 11 : 8, class: 'nd ' + U.fnClass(p.fn) }, s);
      });
      this.tagS = U.el('g', { class: 'ph' }, s); U.text(this.tagS, self.pp[V.S][0] - 24, self.pp[V.S][1] + 8, 'S · specialist', 'tag', { 'text-anchor': 'end' });
      this.tagH = U.el('g', { class: 'ph' }, s); U.text(this.tagH, self.pp[V.H][0] - 24, self.pp[V.H][1] + 8, 'H', 'tag', { 'text-anchor': 'end' });
      // left panel: H and S compared
      var vm = Math.max(V.people[V.H].msgs, V.people[V.S].msgs);
      var vol = U.el('g', { class: 'ph', transform: 'translate(0,40)' }, s); this.vol = vol;
      U.text(vol, 0, 0, 'Messages in 12 weeks', 'lab lab--hi');
      [[V.H, 'H'], [V.S, 'S']].forEach(function (x, j) {
        var w = V.people[x[0]].msgs / vm * 300;
        U.text(vol, 0, 48 + j * 44, x[1], 'lab');
        U.el('rect', { x: 36, y: 33 + j * 44, width: w, height: 14, rx: 3, class: j ? 'bar bar--hi' : 'bar bar--mu' }, vol);
        U.text(vol, 50 + w, 48 + j * 44, fmt(V.people[x[0]].msgs), 'lab lab--t2');
      });
      U.lines(vol, 0, 170, ['H: rarest skill shared with ' + PA.H.rarestSkillHolders, 'colleagues'], 'cap cap--sm', 32);
      U.lines(vol, 0, 262, ['S: named as an expertise source', 'by ' + PA.S.relianceNominationsReceived + ' colleagues'], 'cap cap--sm', 32, { style: 'fill:#6FD8BE' });
      this.eS = U.el('g', { class: 'ph', transform: 'translate(0,40)' }, s);
      U.lines(this.eS, 0, 0, ['Settlement engine: ' + V.skills.filter(function (x) { return x.rare; })[0].holders + ' holders;', 'S is the only expert-level holder'], 'cap cap--sm', 32, { style: 'fill:#6FD8BE' });
      this.eL = U.el('g', { class: 'ph', transform: 'translate(0,440)' }, s);
      U.lines(this.eL, 0, 0, ['Legacy A and Legacy B both hold', LG.overlapSkills.join(' and ') + '.', 'Working ties between the expert', 'pools: ' + LG.abTies + '.'], 'cap cap--sm', 32);
      // projection inset: two-mode fragment → projected employee–employee tie
      var pj = U.el('g', { class: 'ph', transform: 'translate(0,420)' }, s); this.pj = pj;
      U.text(pj, 0, 0, 'Projection onto employees', 'lab lab--hi');
      [[40, 70], [40, 190]].forEach(function (P) { U.el('path', { d: 'M' + (P[0] + 12) + ',' + P[1] + ' L228,130', class: 'r-skill edge', fill: 'none' }, pj); U.el('circle', { cx: P[0], cy: P[1], r: 10, class: 'nd' }, pj); });
      U.el('rect', { x: 228, y: 121, width: 18, height: 18, rx: 2, class: 'box box--hi' }, pj);
      U.text(pj, 237, 172, 'shared skill', 'lab lab--sm', { 'text-anchor': 'middle' });
      U.text(pj, 340, 138, '→', 'cap', { 'text-anchor': 'middle' });
      U.el('line', { x1: 470, y1: 82, x2: 470, y2: 178, class: 'r-rel edge', 'stroke-dasharray': '6 6' }, pj);
      [[470, 70], [470, 190]].forEach(function (P) { U.el('circle', { cx: P[0], cy: P[1], r: 10, class: 'nd' }, pj); });
      U.text(pj, 494, 138, 'projected tie', 'lab lab--sm');
      U.text(pj, 0, 250, 'capability overlap · access measured separately', 'cap cap--sm', { style: 'fill:#6FD8BE' });
      this.tm = U.el('g', { class: 'ph', transform: 'translate(0,640)' }, s);
      U.text(this.tm, 0, 0, 'Transactive memory', 'lab lab--hi');
      U.text(this.tm, 0, 40, 'knowing who knows what, and how to reach it', 'cap cap--sm');
      U.legend(s, 0, 796, [{ kind: 'line', cls: 'r-skill', label: 'holds skill' }, { kind: 'line', cls: 'r-rel', label: 'relies on the expertise of' }]);
    },
    phase: function (k, U) {
      var V = this.V, pj = k === 4;
      U.cls(this.pj, 'is-on', pj);
      k = k >= 5 ? k - 1 : pj ? 3 : k;
      U.cls(this.ra, 'is-on', k >= 5); U.cls(this.br, 'is-on', k === 4);
      U.cls(this.tagS, 'is-on', k >= 2); U.cls(this.tagH, 'is-on', k >= 3);
      U.cls(this.eS, 'is-on', k === 2); U.cls(this.vol, 'is-on', k >= 3); U.cls(this.eL, 'is-on', k >= 4); U.cls(this.tm, 'is-on', k >= 5);
      this.vol.style.opacity = k >= 4 || pj ? 0.45 : '';
      this.nodes.forEach(function (c, j) { U.cls(c, 'is-ring', (j === V.S && k >= 2) || (j === V.H && k >= 3)); });
      this.ties.forEach(function (t) {
        var on = (k === 1 && t.__common) || (k === 2 && t.__rare) || (k === 3 && (t.__k === V.H || t.__k === V.S)) || (k === 4 && t.__ov && (t.__leg === 'A' || t.__leg === 'B'));
        t.setAttribute('class', (t.__rare && k >= 2 ? 'rt is-hi' : 'r-skill') + ' edge');
        t.style.opacity = k === 0 ? 0.35 : on ? 0.9 : k >= 5 ? (t.__rare ? 0.6 : 0.08) : t.__rare && k >= 2 ? 0.5 : 0.1;
      });
      this.skl.forEach(function (g) {
        var sk = g.__sk, hot = (k === 1 && g.__common) || (k === 2 && sk.rare) || (k === 4 && sk.overlap) || (k >= 5 && sk.rare);
        g.style.opacity = k === 0 || k === 3 || hot ? 1 : 0.55;
      });
    },
  });

  // =========================================================================
  // 09 · vulnerability — staged removal: S fades → its ties dissolve → counters fall
  // =========================================================================
  B.push({
    id: 'vulnerability', kicker: KICK,
    lensKey: 'Relation', lens: ['Recurring collaboration + advice', 'access to the Settlement engine domain'],
    phases: [{ p: 0 }, { p: 2 }, { p: 2, say: 'additional traffic shifts toward' }, { p: 5 }, { p: 6 }, { p: 6, say: 'After those additional expertise paths' }],
    desc: ['Specialist S and a 38-person displayed sample of the 196 employees on Settlement engine programs; metrics use all 196: 188 within two steps.', 'S removed from the measured network: S fades, S’s ties dissolve, then access is recalculated (17 of 196).',
      'The traffic shifts toward an already-busy connector.', 'A structural counterfactual: conditional on the measured network.', 'Three colleagues cross-trained in the Settlement engine: new knowledge sources.', 'S removed again: 188 of 196 remain within two steps.'],
    source: 'Structural counterfactual on the measured synthetic network · Sources: Albert, Jeong & Barabási 2000; Borgatti 2006; Smith & Moody 2013 · ledger rows 25–26, 41',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-vul'), self = this, V = NL.views.b8, VU = NL.vulnerability;
      var g = U.el('g', { transform: 'translate(0,40) scale(1.02)' }, s); this.g = g;
      this.P = V.pos; this.A = adj(V.people.length, V.edges); this.S = V.S; this.C2 = V.C2;
      this.edges = V.edges.map(function (e) { var l = U.line(g, V.pos[e[0]], V.pos[e[1]], 'rt edge'); l.__s = e[0] === V.S || e[1] === V.S; l.style.opacity = 0.45; return l; });
      this.train = V.training.map(function (e) { return U.line(g, V.pos[e[0]], V.pos[e[1]], 'rt is-new edge'); });
      this.nodes = V.people.map(function (p, k) {
        var c = U.el('circle', { cx: V.pos[k][0], cy: V.pos[k][1], r: k === V.S ? 16 : p.holder ? 12 : 9, class: 'nd ' + U.fnClass(p.fn) }, g);
        c.__p = p; return c;
      });
      var tg = function (k, txt, dy, cls) { return U.text(g, V.pos[k][0], V.pos[k][1] + (dy || -28), txt, cls || 'tag', { 'text-anchor': 'middle' }); };
      this.tS = tg(V.S, 'S · Settlement engine specialist');
      this.tC = tg(V.C2, 'Busy connector', 38, 'tag tag--w');
      var rt = V.people.map(function (p, k) { return p.rareTeam ? k : -1; }).filter(function (k) { return k >= 0; });
      var cx = 0, cy = 0; rt.forEach(function (k) { cx += V.pos[k][0]; cy += V.pos[k][1]; });
      U.text(g, cx / rt.length, cy / rt.length + 96, 'Settlement engine team', 'lab lab--sm lab--hi', { 'text-anchor': 'middle' });
      var nd = V.people.map(function (p, k) { return p.need ? k : -1; }).filter(function (k) { return k >= 0; });
      var nx = 0; nd.forEach(function (k) { nx += V.pos[k][0]; });
      U.lines(g, 560, -14, [nd.length + '-person displayed sample of the ' + VU.needPopulation + ' employees', 'on Settlement engine programs · metrics use all ' + VU.needPopulation], 'lab lab--sm', 28, { 'text-anchor': 'middle', style: halo });
      this.needIx = nd; this.holders = V.people.map(function (p, k) { return p.holder ? k : -1; }).filter(function (k) { return k >= 0; });
      this.trainees = V.people.map(function (p, k) { return p.trainee ? k : -1; }).filter(function (k) { return k >= 0; });
      this.host = U.el('g', null, g);
      // stats
      var R = U.el('g', { transform: 'translate(1100,30)' }, s);
      U.text(R, 0, 0, 'Within two steps of the domain', 'lab lab--hi');
      this.n1 = U.text(R, 0, 62, '', 'num'); U.text(R, 0, 100, 'of ' + VU.needPopulation + ' employees on programs that need it', 'lab lab--sm');
      U.text(R, 0, 160, 'Typical distance to the domain', 'lab lab--hi');
      this.n2 = U.text(R, 0, 214, '', 'num num--md'); U.text(R, 110, 214, 'steps', 'lab');
      var after = U.el('g', { class: 'ph', transform: 'translate(0,290)' }, R); this.after = after;
      U.text(after, 0, 0, 'Across the whole organization', 'lab lab--hi');
      U.lines(after, 0, 42, [fmt(VU.crossFunctionRoutesLengthened) + ' cross-function routes lengthen',
        'Busy connector, Legacy A: already in the', 'top ' + VU.busyConnector.wasTopPct + '% by brokerage; carries ' + VU.busyConnector.increasePct + '% more', 'cross-function paths'], 'cap cap--sm', 34);
      var red = U.el('g', { class: 'ph', transform: 'translate(0,290)' }, R); this.red = red;
      U.text(red, 0, 0, 'Redundancy added', 'lab lab--hi');
      U.lines(red, 0, 42, [NL.interventions.crossTrained + ' colleagues who already work with', 'the programs are cross-trained', 'in the domain'], 'cap cap--sm', 34);
      var cond = U.el('g', { class: 'ph', transform: 'translate(0,500)' }, R); this.cond = cond;
      U.el('rect', { x: -16, y: -40, width: 670, height: 150, rx: 4, class: 'box box--hi' }, cond);
      U.text(cond, 0, 0, 'Conditional on the measured network', 'lab lab--hi');
      U.lines(cond, 0, 40, ['S removed; every other tie held as observed.', 'A structural counterfactual, not a forecast.'], 'cap cap--sm', 34);
      this.cap = U.text(s, 0, 790, '', 'lab lab--sm');
      this.VU = VU;
    },
    phase: function (k, U) {
      var self = this, VU = this.VU;
      var removed = k === 1 || k === 2 || k === 3 || k === 5, trained = k >= 4;
      var staged = (k === 1 || k === 5) && !U.STILL;
      var sNode = this.nodes[this.S];
      this.train.forEach(function (l) { l.style.opacity = trained ? '' : 0; });
      this.nodes.forEach(function (c, j) {
        c.classList.remove('is-gone', 'is-ring', 'is-warm', 'is-hi');
        if (j === self.S) c.classList.add(removed && !staged ? 'is-gone' : 'is-hi');
        else if (c.__p.holder || (trained && c.__p.trainee)) c.classList.add('is-ring');
      });
      this.edges.forEach(function (l) { l.classList.remove('is-gone', 'is-warm'); U.cls(l, 'is-gone', removed && !staged && l.__s); });
      var from = k === 5 ? VU.withRedundancy : VU.before;
      var st = k === 0 ? VU.before : k === 4 ? VU.withRedundancy : k === 5 ? VU.withRedundancyAfterRemoval : VU.afterRemoval;
      if (staged) {
        // 1) S fades   2) S's ties flash, then dissolve   3) the counters fall
        U.later(function () { sNode.classList.remove('is-hi'); sNode.classList.add('is-gone'); }, 300);
        U.later(function () { self.edges.forEach(function (l) { if (l.__s) l.classList.add('is-warm'); }); }, 1100);
        U.later(function () { self.edges.forEach(function (l) { if (l.__s) { l.classList.remove('is-warm'); l.classList.add('is-gone'); } }); }, 2300);
        this.n1.textContent = fmt(from.within2); this.n2.textContent = String(from.meanDistance);
        countTo(U, this.n1, from.within2, st.within2, 1800, 3000, 0);
        countTo(U, this.n2, from.meanDistance, st.meanDistance, 1800, 3000, 2);
      } else { this.n1.textContent = fmt(st.within2); this.n2.textContent = st.meanDistance.toFixed(2); }
      U.cls(this.n1, 'num--hi', k === 0 || k >= 4);
      U.cls(this.nodes[this.C2], 'is-warm', k === 2 || k === 3);
      this.tC.style.opacity = k === 2 || k === 3 ? 1 : 0;
      this.tS.textContent = removed ? 'S · removed' : 'S · Settlement engine specialist';
      U.cls(this.after, 'is-on', k === 2 || k === 3); U.cls(this.red, 'is-on', k >= 4); U.cls(this.cond, 'is-on', removed); U.cls(this.cond, 'is-strong', k === 3);
      this.cap.textContent = ['Before: the measured network', 'After removing S from the same network', 'After removing S from the same network', 'After removing S from the same network', 'With cross-training', 'With cross-training, after removing S'][k];
      // tokens: domain requests travel from need-side employees to the nearest holder
      var block = {}; if (removed) block[this.S] = 1;
      var targets = this.holders.concat(trained ? this.trainees : []).filter(function (h) { return !block[h]; });
      var send = function (j) {
        var a = self.needIx[(j * 7) % self.needIx.length], best = null;
        targets.forEach(function (h) { var p = bfsPath(self.A, a, h, block); if (p && (!best || p.length < best.length)) best = p; });
        if (best) U.token(self.host, best.map(function (x) { return self.P[x]; }), { dur: 500 * best.length, kind: best.length > 4 ? 'warm' : null });
      };
      if (U.STILL) send(1); else { var j = 0; U.every(function () { send(j++); }, 1100, staged ? 5200 : 300); }
    },
  });

  // =========================================================================
  // 10 · overload — one 12-week cycle, then the peak deadline week
  // =========================================================================
  B.push({
    id: 'overload', kicker: KICK,
    lensKey: 'Relation', lens: ['Communication metadata · requests and reply times', '12 weeks'],
    phases: [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 4 }, { p: 7 }],
    desc: ['Broker B from the centrality example, whose ties reach four functions; boundaries → brokerage → dependency → load.', '32 high-brokerage employees, about 1% of the workforce, receive 13% of cross-function requests.', 'Requests reaching B across one 12-week cycle, then the peak deadline week; median reply times.',
      'Aggregate text features added as a subordinate layer at the overloaded handoff.', 'Coordination paths that would distribute the load.'],
    source: 'Sources: Cross, Rebele & Grant 2016 (practitioner); Oldroyd & Morris 2012; Grimmer & Stewart 2013 · text features: synthetic weekly aggregates',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-ovl'), self = this, VB = NL.views.b6B, O = NL.overload;
      // retrieval cue
      var rc = U.el('g', { class: 'ph' }, s); this.rc = rc;
      U.text(rc, 0, 20, 'boundaries → brokerage → dependency → load', 'lab lab--hi');
      var g = U.el('g', { transform: 'translate(0,70) scale(0.9)' }, s); this.g = g;
      VB.edges.forEach(function (e) { U.line(g, VB.pos[e[0]], VB.pos[e[1]], 'r-comm edge', 0, 0, { opacity: 0.35 }); });
      VB.people.forEach(function (p, k) { U.el('circle', { cx: VB.pos[k][0], cy: VB.pos[k][1], r: k === VB.center ? 16 : 9, class: 'nd ' + U.fnClass(p.fn) + (k === VB.center ? ' is-ring' : '') }, g); });
      var cb = VB.pos[VB.center]; this.cb = cb; this.VB = VB;
      U.text(g, cb[0], cb[1] - 34, 'B · broker from the centrality example', 'tag', { 'text-anchor': 'middle', style: 'font-size:30px;' + halo });
      // alternative coordination paths (option)
      var alt = U.el('g', { class: 'ph' }, g); this.alt = alt;
      var groups = {}; VB.units.forEach(function (u, k) { if (k === VB.center) return; (groups[u] = groups[u] || []).push(k); });
      var cents = Object.keys(groups).filter(function (u) { return groups[u].length >= 2; }).map(function (u) {
        var x = 0, y = 0; groups[u].forEach(function (k) { x += VB.pos[k][0]; y += VB.pos[k][1]; }); return [x / groups[u].length, y / groups[u].length];
      });
      for (var i2 = 0; i2 < cents.length; i2++) U.curve(alt, cents[i2], cents[(i2 + 1) % cents.length], 'rt is-new edge', 0.18);
      this.host = U.el('g', null, g);
      // queue beside B: one square per ~13 requests
      var Qg = U.el('g', { transform: 'translate(0,640)' }, s);
      U.text(Qg, 0, 0, 'B’s queue', 'lab lab--hi');
      this.qBoxes = []; for (var i = 0; i < 12; i++) this.qBoxes.push(U.el('rect', { x: 170 + i * 28, y: -20, width: 22, height: 22, rx: 2, class: 'bar--mu', style: 'opacity:0' }, Qg));
      this.wk = U.text(Qg, 0, 40, '', 'lab lab--sm');
      var altT = U.el('g', { class: 'ph' }, s); this.altT = altT;
      U.text(altT, 0, 770, 'Option: an interface team shares the integration work', 'cap cap--sm', { style: 'fill:#6FD8BE' });
      // weekly strip
      var W = U.el('g', { class: 'ph', transform: 'translate(860,70)' }, s); this.W = W;
      U.text(W, 0, 0, 'Requests reaching B each week', 'lab lab--hi');
      var mx = Math.max.apply(null, O.weekly.map(function (w) { return w.bIncoming; }));
      this.mx = mx; this.peak = O.weekly.map(function (w) { return w.bIncoming; }).indexOf(mx);
      this.bars = O.weekly.map(function (w, j) {
        var h = w.bIncoming / mx * 150;
        var r = U.el('rect', { x: j * 70, y: 190 - h, width: 44, height: h, rx: 3, class: w.deadline ? 'bar bar--w' : 'bar bar--mu' }, W);
        U.text(W, j * 70 + 22, 222, String(w.week), 'lab', { 'text-anchor': 'middle' });
        return r;
      });
      U.el('line', { x1: 0, y1: 190, x2: 12 * 70 - 26, y2: 190, class: 'axis' }, W);
      U.text(W, 0, 258, 'Week · yellow = deadline week', 'lab lab--sm');
      var S1 = U.el('g', { class: 'ph', transform: 'translate(860,388)' }, s); this.S1 = S1;
      U.lines(S1, 0, 0, [O.brokerCount + ' high-brokerage employees (' + O.brokerSharePctOfEmployees + '% of employees)', 'receive ' + O.brokersShareOfCrossFunctionRequestsPct + '% of cross-function requests'], 'cap cap--sm', 34);
      var S2 = U.el('g', { class: 'ph', transform: 'translate(860,388)' }, s); this.S2 = S2;
      U.text(S2, 0, 82, 'Brokers’ median reply: ' + O.brokerReplyHoursOther + ' h · deadline weeks ' + O.brokerReplyHoursDeadline + ' h', 'cap cap--sm');
      U.text(S2, 0, 116, 'All other employees: ' + O.othersReplyHoursOther + ' h', 'lab lab--sm');
      // text-feature layer (subordinate)
      var T = U.el('g', { class: 'ph', transform: 'translate(0,480)' }, W); this.T = T;
      var tx = O.text;
      U.text(T, 0, 0, 'Content layer (page 07) · uncertainty / negative affect', 'lab lab--hi');
      U.text(T, 0, 32, tx.interfaceName + ' · weekly means', 'lab lab--sm');
      var spark = function (y, arr, org, name, a, b) {
        var xs = function (j) { return j * 38; }, lo = 0.05, hi = 0.45, ys = function (v) { return y + 56 - (v - lo) / (hi - lo) * 56; };
        U.el('path', { d: org.map(function (v, j) { return (j ? 'L' : 'M') + xs(j) + ',' + ys(v).toFixed(1); }).join(' '), class: 'spark', stroke: '#9FB2C1', opacity: 0.6 }, T);
        U.el('path', { d: arr.map(function (v, j) { return (j ? 'L' : 'M') + xs(j) + ',' + ys(v).toFixed(1); }).join(' '), class: 'spark', stroke: '#6FD8BE' }, T);
        U.text(T, 460, y + 22, name, 'lab lab--sm lab--t2');
        U.text(T, 460, y + 52, a + ' deadline · ' + b + ' other', 'lab lab--sm');
      };
      spark(50, tx.weeklyUncertainty, tx.orgWeeklyUncertainty, 'Uncertainty', tx.uncertaintyDeadline, tx.uncertaintyOther);
      spark(130, tx.weeklyNegative, tx.orgWeeklyNegative, 'Negative affect', tx.negativeDeadline, tx.negativeOther);
      U.text(T, 0, 230, 'Grey: other interfaces. Describes the interaction, not its cause.', 'lab lab--sm');
      this.O = O;
    },
    phase: function (k, U) {
      var self = this, O = this.O, VB = this.VB;
      U.cls(this.T, 'is-on', k >= 3); U.cls(this.alt, 'is-on', k >= 4); U.cls(this.altT, 'is-on', k >= 4);
      U.cls(this.W, 'is-on', k >= 2); U.cls(this.S1, 'is-on', k >= 1); U.cls(this.S2, 'is-on', k >= 2);
      this.S1.style.opacity = k >= 2 ? 0.6 : '';
      U.cls(this.rc, 'is-on', k === 0);
      var cur = 0;
      var showWeek = function (w) {
        cur = w; var wk = O.weekly[w], q = Math.round(wk.bIncoming / self.mx * 12);
        self.qBoxes.forEach(function (b, i) { b.style.opacity = i < q ? (wk.deadline ? 1 : 0.7) : 0; b.setAttribute('class', wk.deadline ? 'bar--w' : 'bar--mu'); });
        self.wk.textContent = 'Week ' + wk.week + (wk.deadline ? ' · deadline' : '') + ' · ' + wk.bIncoming + ' requests';
        self.bars.forEach(function (b, j) { b.style.opacity = j === w ? 1 : 0.35; });
      };
      var others = VB.people.map(function (p, j) { return j; }).filter(function (j) { return j !== VB.center; });
      if (k <= 1) { showWeek(this.peak); this.bars.forEach(function (b) { b.style.opacity = ''; }); self.wk.textContent = ''; self.qBoxes.forEach(function (b) { b.style.opacity = 0; }); }
      else if (U.STILL || k >= 3) { showWeek(this.peak); U.token(this.host, [VB.pos[others[0]], this.cb], { parkAt: 0.6 }); }
      else {
        showWeek(0);
        for (var w = 1; w < 12; w++) (function (w) { U.later(function () { showWeek(w); }, 1500 + w * 1100); })(w);
        U.later(function () { showWeek(self.peak); }, 1500 + 12 * 1100 + 600);
        var j = 0;
        U.every(function () {
          var burst = O.weekly[cur].deadline ? 3 : 1;
          for (var b = 0; b < burst; b++) U.token(self.host, [VB.pos[others[(j + b * 5) % others.length]], self.cb], { dur: 900, delay: b * 200 });
          j++;
        }, 600, 300);
      }
      if (k >= 3) this.bars.forEach(function (b, j) { b.style.opacity = j === self.peak ? 1 : 0.6; });
    },
  });

  // =========================================================================
  // 11 · access — aligned unit strips (1 square = 1% of the group) + nested adjustment ladder
  // =========================================================================
  var BINS = [[0, 0, '0'], [1, 2, '1–2'], [3, 5, '3–5'], [6, 10, '6–10'], [11, 20, '11–20'], [21, 1e9, '21+']];
  function unitShares(arr) {
    var raw = BINS.map(function (b) { return arr.filter(function (v) { return v >= b[0] && v <= b[1]; }).length / arr.length * 100; });
    var fl = raw.map(Math.floor), left = 100 - fl.reduce(function (a, b) { return a + b; }, 0);
    raw.map(function (v, j) { return [v - fl[j], j]; }).sort(function (a, b) { return b[0] - a[0] || a[1] - b[1]; }).slice(0, left).forEach(function (x) { fl[x[1]]++; });
    return fl;
  }
  B.push({
    id: 'access', kicker: KICK,
    lensKey: 'Relation', lens: ['Informal working-session co-attendance', '12 weeks', 'all ' + (window.NL ? window.NL.org.employees.toLocaleString('en-US') : '') + ' employees'],
    phases: [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 3 }, { p: 3, say: 'With role and level' }, { p: 3, say: 'Adding tenure moves' }, { p: 3, say: 'Adding department shifts' }, { p: 3, say: 'Adding project participation' }, { p: 3, say: 'The bootstrap intervals show' }, { p: 4 }, { p: 5 }, { p: 6 }],
    desc: ['The relation: informal working-session co-attendance. A three-person session: each attendee gains two distinct contacts.', 'Fully remote (mean 2.8) and office + hybrid (mean 6.4), one square per 1% of each group.',
      'Nested descriptive adjustments: the gap as measured characteristics are added.', 'Raw gap: 57%.', 'With role and level: 41%.', 'Adding tenure: 38%.', 'Adding department: back to 40%.', 'With project participation: 27%.',
      '95% bootstrap intervals around each estimate.', 'Mechanisms that remain plausible.', 'Homophily, selection and influence: why similarity in a network rarely identifies influence.', 'One form of informal access differs by work arrangement.'],
    source: 'Sources: McPherson, Smith-Lovin & Cook 2001; Kossinets & Watts 2009; Yang et al. 2022; Gelbach 2016 · nested OLS on all ' + (window.NL ? window.NL.org.employees.toLocaleString('en-US') : '') + ' employees, 200 seeded bootstrap resamples',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-acc'), self = this, A = NL.access, D = NL.views.accessDist;
      // left: unit strips
      var X0 = 250, CW = 124, SQ = 20;
      U.text(s, 0, 20, 'Informal contacts per employee', 'lab lab--hi');
      U.text(s, 0, 54, 'distinct colleagues met in informal working sessions · one square = 1% of the group', 'lab lab--sm');
      var strip = function (y, arr, name, n, mean, hi) {
        var g = U.el('g', { class: 'ph' }, s);
        U.text(g, 0, y - 84, name, 'cap cap--sm', hi ? { style: 'fill:#E8F1F6' } : null);
        U.text(g, 0, y - 50, fmt(n) + ' employees', 'lab lab--sm');
        U.text(g, 0, y + 12, 'mean', 'lab'); U.text(g, 84, y + 14, String(mean), 'num num--md', hi ? { style: 'fill:#6FD8BE' } : null);
        var sh = unitShares(arr), sq = [];
        sh.forEach(function (c, b) {
          for (var i = 0; i < c; i++) {
            var r = U.el('rect', { x: X0 + b * CW + (i % 5) * SQ, y: y - Math.floor(i / 5) * SQ, width: SQ - 4, height: SQ - 4, rx: 2, fill: hi ? '#D8F2FF' : '#9FB2C1', opacity: 0.85 }, g);
            r.__d = Math.floor(i / 5); sq.push(r);
          }
          U.text(g, X0 + b * CW + 48, y - Math.floor((c - 1) / 5) * SQ - 14, c + '%', 'lab lab--sm', { 'text-anchor': 'middle' });
        });
        g.__sq = sq; return g;
      };
      this.sR = strip(360, D.remote, 'Fully remote', A.remoteN, A.remoteMean, true);
      this.sO = strip(700, D.other, 'Office + hybrid', A.nonRemoteN, A.nonRemoteMean, false);
      U.el('line', { x1: X0 - 6, y1: 720, x2: X0 + 6 * CW - 20, y2: 720, class: 'axis' }, s);
      BINS.forEach(function (b, j) { U.text(s, X0 + j * CW + 48, 752, b[2], 'lab', { 'text-anchor': 'middle' }); });
      U.text(s, X0, 790, 'colleagues met in informal sessions', 'lab lab--sm');
      // right: nested adjustment ladder with bootstrap intervals
      var R = U.el('g', { transform: 'translate(1040,20)' }, s);
      var L = U.el('g', { class: 'ph' }, R); this.L = L;
      U.text(L, 0, 0, 'Nested descriptive adjustments', 'lab lab--hi');
      U.text(L, 0, 36, 'Remote gap, % below office + hybrid', 'lab lab--sm');
      var AX = 300, PX = 5.4;
      [0, 20, 40, 60].forEach(function (v) {
        U.el('line', { x1: AX + v * PX, y1: 62, x2: AX + v * PX, y2: 360, class: 'grid' }, L);
        U.text(L, AX + v * PX, 388, v + '%', 'lab', { 'text-anchor': 'middle' });
      });
      this.rows = A.steps.map(function (x, j) {
        var g = U.el('g', { class: 'ph', transform: 'translate(0,' + (96 + j * 58) + ')' }, L);
        U.text(g, 0, 8, x.label, 'cap cap--sm');
        var a = Math.abs(x.ciHigh), b = Math.abs(x.ciLow), m = Math.abs(x.gapPct);
        g.__ci = U.el('line', { x1: AX + a * PX, y1: 0, x2: AX + b * PX, y2: 0, stroke: '#9FB2C1', 'stroke-width': 3 }, g);
        U.el('circle', { cx: AX + m * PX, cy: 0, r: 9, fill: j === 0 ? '#F2C94C' : '#D8F2FF' }, g);
        U.text(g, AX + b * PX + 16, 8, m + '%', 'lab lab--t2');
        return g;
      });
      this.ring = U.el('rect', { class: 'ph box box--hi', x: -14, y: 96 + 3 * 58 - 30, width: 700, height: 56, rx: 4 }, L);
      U.text(L, 0, 426, 'Dot: estimate · line: 95% bootstrap interval', 'lab lab--sm');
      var mech = U.el('g', { class: 'ph', transform: 'translate(0,490)' }, R); this.mech = mech;
      U.text(mech, 0, 0, 'Mechanisms still open', 'lab lab--hi');
      ['work allocation', 'geography', 'onboarding', 'preference', 'meeting design', 'exclusion', 'discrimination'].forEach(function (x, j) {
        var xx = (j % 3) * 236, yy = 26 + Math.floor(j / 3) * 56;
        U.el('rect', { x: xx, y: yy, width: 222, height: 44, rx: 3, class: 'box' }, mech);
        U.text(mech, xx + 14, yy + 30, x, 'lab lab--sm lab--t2');
      });
      var idp = U.el('g', { class: 'ph', transform: 'translate(0,490)' }, R); this.idp = idp;
      U.text(idp, 0, 0, 'An identification problem', 'lab lab--hi');
      U.lines(idp, 0, 44, ['homophily / selection: similar people form ties', 'influence: ties make people more similar', 'shared settings can produce both'], 'cap cap--sm', 36);
      // what co-attendance means: one informal working session, three people
      var sch = U.el('g', { class: 'ph', transform: 'translate(250,160)' }, s); this.sch = sch;
      U.el('rect', { x: 0, y: 0, width: 520, height: 300, rx: 10, class: 'box' }, sch);
      U.text(sch, 20, 40, 'one informal working session', 'lab lab--sm');
      var tri = [[130, 200], [260, 110], [390, 200]];
      [[0, 1], [1, 2], [0, 2]].forEach(function (e) { U.line(sch, tri[e[0]], tri[e[1]], 'r-comm edge', 18, 18, { 'stroke-width': 3 }); });
      tri.forEach(function (p) { U.el('circle', { cx: p[0], cy: p[1], r: 18, class: 'nd', 'stroke-width': 3 }, sch); });
      U.text(sch, 260, 272, 'each attendee: two distinct contacts', 'lab lab--sm', { 'text-anchor': 'middle' });
      var fin = U.el('g', { class: 'ph', transform: 'translate(0,490)' }, R); this.fin = fin;
      U.lines(fin, 0, 0, ['Different positions in one form of informal', 'access: a pattern worth investigating.'], 'cap', 40, { style: 'fill:#6FD8BE' });
    },
    phase: function (k, U) {
      var self = this;
      [this.sR, this.sO].forEach(function (g, gi) {
        U.cls(g, 'is-on', k >= 1);
        g.__sq.forEach(function (r) {
          if (k === 1 && !U.STILL) { r.style.opacity = 0; U.later(function () { r.style.transition = 'opacity .35s'; r.style.opacity = ''; }, 200 + gi * 400 + r.__d * 90); }
          else { r.style.transition = 'none'; r.style.opacity = ''; }
        });
      });
      // each ladder row appears on the sentence that gives its estimate; the current row is bright
      U.cls(this.L, 'is-on', k >= 2); U.cls(this.ring, 'is-on', k === 6);
      U.cls(this.mech, 'is-on', k === 9); U.cls(this.idp, 'is-on', k === 10); U.cls(this.fin, 'is-on', k >= 11); U.cls(this.sch, 'is-on', k === 0);
      this.rows.forEach(function (g, j) {
        U.cls(g, 'is-on', k >= 3 + j);
        g.style.opacity = k >= 3 + j && k <= 7 && k !== 3 + j ? 0.55 : '';
        g.__ci.setAttribute('stroke', k === 8 ? '#6FD8BE' : '#9FB2C1'); g.__ci.setAttribute('stroke-width', k === 8 ? 5 : 3);
      });
    },
  });

  // =========================================================================
  // 12 · dynamics
  // =========================================================================
  B.push({
    id: 'dynamics', kicker: KICK,
    lensKey: 'Relation', lens: ['Working ties between units', 'model-generated snapshots', 'fixed positions'],
    phases: [{ p: 0 }, { p: 1, say: 'The 2021 state predates' }, { p: 1, say: 'Legacy A enters in 2022' }, { p: 1, say: 'Legacy B and hybrid work' }, { p: 2, say: 'and then to 10 percent' }, { p: 3 }, { p: 4 }],
    desc: ['Four model-generated historical states of synthetic Northline, 2021 to the current window, shown inactive.', '2021: Northline before the acquisitions.', '2022: Legacy A joins.',
      '2024: Legacy B joins; hybrid work; Program Atlas begins. Legacy A’s ties to core: 1% → 4%.', 'Current window: Legacy A 10%; Legacy B 12% → 15%.', 'Broker B: 46th → 100th percentile of cross-function brokerage; Program Atlas cross-department ties grow.', 'One snapshot, several tie processes: ties form, persist, decay and are replaced.'],
    source: 'Sources: Ahuja, Soda & Zaheer 2012; Allatta & Singh 2011; Burt 2002 · snapshots regenerated under the spec’s parameter schedule',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-dyn'), self = this, V = NL.views, D = NL.dynamics.snapshots;
      var us = V.units, xs = us.map(function (u) { return u.pos[0]; }), ys = us.map(function (u) { return u.pos[1]; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      var sc = Math.min(820 / (x1 - x0), 560 / (y1 - y0));
      this.pos = {}; us.forEach(function (u) { self.pos[u.id] = [70 + (u.pos[0] - x0) * sc, 150 + (u.pos[1] - y0) * sc]; });
      this.eg = U.el('g', null, s);
      this.nodes = {};
      us.forEach(function (u) {
        var p = self.pos[u.id], g = U.el('g', null, s);
        U.el('circle', { cx: p[0], cy: p[1], r: 5 + Math.sqrt(u.size) * 0.9, class: 'nd fill ' + U.fnClass(u.fn), 'fill-opacity': 0.35 }, g);
        self.nodes[u.id] = g;
      });
      // one label per legacy group and for the Coordination Office, pushed outward from the centre
      var all = [0, 0]; us.forEach(function (u) { all[0] += self.pos[u.id][0] / us.length; all[1] += self.pos[u.id][1] / us.length; });
      var labs = U.el('g', null, s);
      [['A', 'Legacy A'], ['B', 'Legacy B']].forEach(function (L) {
        var m = us.filter(function (u) { return u.legacy === L[0]; }); if (!m.length) return;
        var c = [0, 0]; m.forEach(function (u) { c[0] += self.pos[u.id][0] / m.length; c[1] += self.pos[u.id][1] / m.length; });
        var dx = c[0] - all[0], dy = c[1] - all[1], d = Math.hypot(dx, dy) || 1;
        U.text(labs, c[0] + dx / d * 70, c[1] + dy / d * 70 + 8, L[1], 'tag', { 'text-anchor': 'middle', style: 'paint-order:stroke;stroke:#071A2B;stroke-width:6px' });
      });
      var big = U.el('g', null, s);
      this.big = U.text(big, 0, 30, '', 'lab lab--hi', { style: 'font-size:30px;letter-spacing:.04em' });
      this.mbox = U.el('g', null, big); U.el('rect', { x: 0, y: 58, width: 470, height: 44, rx: 4, class: 'box box--hi' }, this.mbox);
      U.text(big, 16, 88, 'Model-generated snapshots', 'lab lab--hi');
      // table
      var T = U.el('g', { transform: 'translate(960,40)' }, s); this.T = T;
      var keys = ['aCoreSharePct', 'bCoreSharePct', 'bPercentile', 'atlasCrossDeptTies'];
      var heads = [['Legacy A', 'ties to core'], ['Legacy B', 'ties to core'], ['Broker B', 'percentile'], ['Atlas', 'cross-dept']];
      var CX = [230, 380, 530, 680];
      heads.forEach(function (h, c) { U.lines(T, CX[c], 0, h, 'lab lab--sm', 28); });
      var short = ['Pre-acquisition', 'Legacy A joins', 'Hybrid · B joins', 'Current window'];
      this.cells = []; this.bCells = []; this.colCells = [];
      D.forEach(function (d, i) {
        var g = U.el('g', { transform: 'translate(0,' + (110 + i * 96) + ')' }, T);
        U.text(g, 0, 0, String(d.year), 'cap', { style: 'font-weight:600' });
        U.text(g, 0, 32, short[i], 'lab lab--sm');
        keys.forEach(function (k, c) {
          var v = d[k], txt = v == null ? '—' : (c <= 1 ? v + '%' : c === 2 ? ordinal(v) : fmt(v));
          var t = U.text(g, CX[c], 8, txt, 'cap', { style: 'font-weight:600' });
          if (c === 1) self.bCells.push(t);
          (self.colCells[c] = self.colCells[c] || []).push(t);
        });
        self.cells.push(g);
      });
      var fn = U.el('g', null, T); this.fn = fn;
      U.lines(fn, 0, 530, ['Ties to core: share of the unit’s working ties', 'that reach core Northline units.', 'Broker B: percentile of cross-function', 'brokerage among employees present.'], 'lab lab--sm', 30);
      U.text(fn, 0, 670, 'Generated from the parameter schedule in', 'lab lab--sm');
      U.text(fn, 0, 700, 'data/northline-spec.js', 'lab');
      // tie processes behind one snapshot: form · persist · decay · replace
      var tp = U.el('g', { class: 'ph', transform: 'translate(960,560)' }, s); this.tp = tp;
      U.text(tp, 0, 0, 'Behind one snapshot: tie processes', 'lab lab--hi');
      [['form', 'new'], ['persist', 'kept'], ['decay', 'lost'], ['replace', 'swap']].forEach(function (x, j) {
        var g = U.el('g', { transform: 'translate(' + (j * 190) + ',40)' }, tp), A = [20, 70], Bn = [110, 30], Cn = [110, 110];
        var old = { 'class': 'r-comm edge', 'stroke-width': 3 }, ghost = { 'class': 'r-comm edge', 'stroke-width': 2, 'stroke-dasharray': '5 7', opacity: 0.4 };
        if (x[0] === 'form') U.el('line', { x1: A[0], y1: A[1], x2: Bn[0], y2: Bn[1], 'class': 'rt is-hi edge', 'stroke-width': 3 }, g);
        if (x[0] === 'persist') U.el('line', { x1: A[0], y1: A[1], x2: Bn[0], y2: Bn[1], 'class': old['class'], 'stroke-width': 3 }, g);
        if (x[0] === 'decay' || x[0] === 'replace') U.el('line', { x1: A[0], y1: A[1], x2: Bn[0], y2: Bn[1], 'class': ghost['class'], 'stroke-width': 2, 'stroke-dasharray': '5 7', opacity: 0.4 }, g);
        if (x[0] === 'replace') U.el('line', { x1: A[0], y1: A[1], x2: Cn[0], y2: Cn[1], 'class': 'rt is-hi edge', 'stroke-width': 3 }, g);
        [A, Bn, Cn].forEach(function (P) { U.el('circle', { cx: P[0], cy: P[1], r: 9, 'class': 'nd' }, g); });
        U.text(g, 0, 156, x[0], 'cap cap--sm');
      });
      this.D = D; this.V = V;
    },
    phase: function (k, U) {
      var self = this;
      U.cls(this.mbox, 'is-strong', true);
      var colOn = function (c) { return (c === 0 && (k === 3 || k === 4)) || (c === 1 && k === 4) || ((c === 2 || c === 3) && k === 5); };
      this.colCells.forEach(function (ts, c) { ts.forEach(function (t) { t.style.fill = colOn(c) ? '#6FD8BE' : ''; }); });
      if (k === 0) {
        // overview: every year present but inactive
        this.big.textContent = 'Four snapshots · ' + this.V.dyn[0].year + ' → ' + this.V.dyn[3].year;
        Object.keys(this.nodes).forEach(function (u) { self.nodes[u].style.opacity = 0.3; });
        this.eg.textContent = '';
        this.cells.forEach(function (g) { g.style.opacity = 0.7; });
        return;
      }
      var snap = Math.min(k - 1, 3), d = this.V.dyn[snap];
      this.big.textContent = d.year + ' · ' + d.label;
      Object.keys(this.nodes).forEach(function (u) { self.nodes[u].style.opacity = d.units.indexOf(u) >= 0 ? 1 : 0.07; });
      this.eg.textContent = '';
      d.edges.forEach(function (e) { if (!self.pos[e[0]] || !self.pos[e[1]]) return; U.line(self.eg, self.pos[e[0]], self.pos[e[1]], 'r-comm edge', 0, 0, { 'stroke-width': Math.min(7, 1 + e[2] * 5).toFixed(1), opacity: Math.min(0.9, 0.25 + e[2]) }); });
      this.cells.forEach(function (g, i) { g.style.opacity = k >= 6 ? 0.45 : k >= 5 ? 1 : i === snap ? 1 : i < snap ? 0.65 : 0; });
      U.cls(this.tp, 'is-on', k === 6); this.fn.style.opacity = k === 6 ? 0 : '';
    },
  });
})();
