/* Beats 13–18: reorganization, interventions, evidence, privacy, human–AI, close.
   Field coordinates: 1768 × 800. Type floor (draft 2): explanatory text ≥ 22 px in the 1920 deck. */
window.BEATS = window.BEATS || [];
(function () {
  var B = window.BEATS;
  var KICK = 'Organizational research · Networks and coordination';
  function svg(pg, U, id) { var s = U.el('svg', { id: id, width: 1768, height: 800, viewBox: '0 0 1768 800', role: 'img' }, pg); U.defs(s); return s; }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  var halo = 'paint-order:stroke;stroke:#071A2B;stroke-width:6px';
  var MINT = '#6FD8BE', WARN = '#F2C94C';

  // =========================================================================
  // 13 · reorg — three exposure quantities carry the page
  // =========================================================================
  B.push({
    id: 'reorg', kicker: KICK,
    lensKey: 'Held fixed', lens: ['Observed working network, 302 teams', 'ties reclassified under the proposal'],
    phases: [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 3, say: 'The proposal would newly contain' }, { p: 3, say: 'It would split 191' }, { p: 3, say: 'Thirteen of the 31' }, { p: 5 }, { p: 6 }],
    desc: ['The same 302-team working network from the formal/working page; each circle is a Northline team.', 'Scenario input: the proposed three-line mapping (Enterprise Solutions, Platform & Data, Managed Services).', 'Ties reclassified under the proposed three business lines: newly contained (mint) or split (yellow).',
      'Newly contained: 907 existing cross-boundary working ties.', 'Split: 191 ties that currently sit inside one department.', 'The 13 of 31 leading brokers who keep at least 30% of ties across the new lines, ringed.',
      'Specialist S and broker B still bridge; Legacy A and B share a line but one working tie.', 'What the map supports without a behavioral forecast.'],
    source: 'Structural exposure analysis on the measured synthetic network · Sources: McEvily, Soda & Tortoriello 2014; Srivastava 2015; Kleinbaum 2018',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-reorg'), self = this, V = NL.views, R = NL.reorg;
      var ov = window.OrgView(U, NL, s, [0, 10, 1768, 760], { rbox: [0, 30, 1160, 740] }); this.ov = ov;
      ov.layout('r'); ov.formalOn(0);
      this.cls = ov.edges.map(function (ln) {
        var a = V.teams[ln.__e[0]], b = V.teams[ln.__e[1]];
        if (!a.line || !b.line || a.line === 'CO' || b.line === 'CO') return 'co';
        if (a.dept !== b.dept && a.line === b.line) return 'internal';
        if (a.dept === b.dept && a.line !== b.line) return 'split';
        return a.line === b.line ? 'same' : 'cross';
      });
      var lab = U.el('g', { class: 'ph' }, s); this.lab = lab;
      U.text(lab, 0, 756, 'Scenario input · proposed 3-line mapping: ' + R.lines.map(function (L) { return L.name; }).join(' · '), 'lab lab--sm', { style: 'fill:#6FD8BE' });
      this.cap0 = U.text(s, 0, 756, 'The same 302-team working network from the formal/working page · each circle = one Northline team', 'lab lab--sm');
      var bt = {}; (R.crossLineBrokerTeams || []).forEach(function (id) { bt[id] = 1; }); this.brokerTeam = function (k) { return !!bt[V.teams[k].id]; };
      var pt = V.personaTeams;
      this.mark = U.el('g', { class: 'ph' }, s);
      [[pt.S, 'S · specialist'], [pt.B, 'B · broker']].forEach(function (x) { var p = ov.R[x[0]], isS = x[1][0] === 'S'; U.el('circle', { cx: p[0], cy: p[1], r: 18, fill: 'none', class: 'risk-s', 'stroke-width': 3 }, self.mark); U.text(self.mark, p[0] + (isS ? -26 : 26), p[1] + (isS ? -16 : 36), x[1], 'tag tag--w', { style: halo, 'text-anchor': isS ? 'end' : 'start' }); });
      // panel
      var P = U.el('g', { transform: 'translate(1200,30)' }, s);
      var hd = U.el('g', { class: 'ph' }, P); this.hd = hd;
      U.text(hd, 0, 0, 'Structural exposure', 'lab lab--hi');
      var block = function (y, verb, num, l1, l2, sub, col) {
        var g = U.el('g', { class: 'ph', transform: 'translate(0,' + y + ')' }, P);
        U.text(g, 0, 0, verb, 'lab', { style: 'fill:' + col });
        var n = U.text(g, 0, 58, num, 'num', { style: 'fill:' + col });
        var nx = num.length > 4 ? 200 : 130;
        U.lines(g, nx, 30, [l1, l2], 'cap cap--sm', 30);
        U.text(g, 0, 98, sub, 'lab lab--sm');
        return g;
      };
      this.b1 = block(50, 'Newly contains', fmt(R.newlyInternalTies), 'ties become internal', 'to one line', R.tiesInsideCurrentDepartmentPct + '% of ties inside a unit today → ' + R.tiesInsideProposedLinePct + '%', MINT);
      this.b2 = block(200, 'Potentially disrupts', fmt(R.newlySplitTies), 'ties inside today’s', 'departments split', R.communitiesSplit + ' of ' + R.communitiesConsidered + ' relational communities divide', WARN);
      this.b3 = block(350, 'Depends on', R.brokersMostlyCrossLine + ' of ' + R.brokersConsidered, 'leading brokers keep', '≥ 30% of ties across lines', 'S: ' + R.sTiesCrossLinePct + '% · B: ' + R.bTiesCrossLinePct + '% of their ties cross lines', '#E8F1F6');
      var na = U.el('g', { class: 'ph', transform: 'translate(0,510)' }, P); this.na = na;
      U.text(na, 0, 0, 'Not addressed', 'lab lab--hi');
      U.lines(na, 0, 38, ['Concentrated expertise (S) and dependence', 'on a few brokers. Legacy A and B share a', 'line; working ties between them: ' + NL.cohesion.legacy.abTies], 'cap cap--sm', 32);
      var ba = U.el('g', { class: 'ph', transform: 'translate(0,510)' }, P); this.ba = ba;
      U.text(ba, 0, 0, 'A structural exposure analysis', 'lab lab--hi');
      U.lines(ba, 0, 38, ['which interfaces the proposal contains,', 'divides, or continues to rely on'], 'cap cap--sm', 34);
      U.text(ba, 0, 132, 'Behavior after the change: a future outcome.', 'lab lab--sm');
      U.legend(s, 0, 796, [{ kind: 'line', cls: 'rt is-hi', label: 'becomes internal to a line' }, { kind: 'line', cls: 'rt is-warm', label: 'split by the new lines' }]);
      U.legend(s, 720, 796, NL.functions.map(function (f) { return { kind: 'node', cls: 'fill f' + f.id, label: f.name.replace('Product & Engineering', 'Product & Eng.').replace('Sales & Customer', 'Sales & Cust.').replace('Client Solutions', 'Client Sol.') }; }));
    },
    phase: function (k, U) {
      var ov = this.ov, cls = this.cls, self = this; ov.reset();
      var sk = k; k = k <= 1 ? 0 : k - 1; // state 1 adds only the scenario-input label
      ov.edges.forEach(function (ln, j) {
        var c = cls[j];
        if (k === 0) return;
        var hiIn = c === 'internal' && (k === 1 || k === 2 || k >= 5), hiSp = c === 'split' && (k === 1 || k === 3 || k >= 5);
        if (hiIn) ln.classList.add('is-hi'); else if (hiSp) ln.classList.add('is-warm'); else ln.classList.add('is-dim');
      });
      ov.marks.forEach(function (m) {
        m.__c.setAttribute('fill-opacity', k === 0 ? 0.45 : 0.18);
        if (k === 4 && self.brokerTeam(m.__k)) { m.__c.classList.add('is-ring'); m.__c.setAttribute('fill-opacity', 0.9); }
      });
      this.cap0.style.opacity = sk === 0 ? 1 : 0;
      U.cls(this.lab, 'is-on', sk >= 1); U.cls(this.hd, 'is-on', k >= 1);
      U.cls(this.b1, 'is-on', k >= 2); U.cls(this.b2, 'is-on', k >= 3); U.cls(this.b3, 'is-on', k >= 4); U.cls(this.mark, 'is-on', k >= 5);
      [this.b1, this.b2, this.b3].forEach(function (g, j) { g.style.opacity = k >= 2 + j && k <= 4 && k !== 2 + j ? 0.5 : ''; });
      U.cls(this.na, 'is-on', k === 5); U.cls(this.ba, 'is-on', k >= 6);
    },
  });

  // =========================================================================
  // 14 · interventions
  // =========================================================================
  B.push({
    id: 'interventions', kicker: KICK,
    lensKey: 'Proposed', lens: ['Structural changes on the measured network', 'hypotheses for testing'],
    phases: [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }, { p: 5 }, { p: 6 }],
    desc: ['The three interventions on the measured team network, each tied to a mechanism already found: fragility around S, overload around B, weak access between the legacy pools.', 'Hypothesis 1: cross-train three colleagues in the rare domain.', 'Hypothesis 2: an interface team takes a share of broker B’s cross-function contacts.', 'Hypothesis 3: a recurring forum between the two legacy units’ data experts.',
      'Network interventions: actors, ties, segmentation, opportunities.', 'Each change matched to the mechanism it targets.', 'What a pilot would measure.'],
    source: 'Illustrative additions to the synthetic network · Sources: Valente 2012; Galbraith 1974 · effects on delivery, workload and experience are not established here',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-int'), self = this, V = NL.views, I = NL.interventions, pt = V.personaTeams;
      var ov = window.OrgView(U, NL, s, [0, 10, 1768, 760], { rbox: [0, 30, 1160, 740] }); this.ov = ov;
      ov.layout('r'); ov.formalOn(0);
      ov.edges.forEach(function (l) { l.classList.add('is-dim'); });
      ov.marks.forEach(function (m) { m.__c.setAttribute('fill-opacity', 0.2); });
      // added ties drawn solid mint; the teams they reach ringed; one local label per hypothesis
      var add = function (pairs, label, at, dx, dy) {
        var g = U.el('g', { class: 'ph' }, s);
        pairs.forEach(function (p) {
          if (p[0] === p[1] || p[0] < 0 || p[1] < 0) return;
          U.curve(g, ov.R[p[0]], ov.R[p[1]], 'edge', 0.15, { stroke: MINT, 'stroke-width': 4, opacity: 0.95, fill: 'none' });
          [p[0], p[1]].forEach(function (k) { U.el('circle', { cx: ov.R[k][0], cy: ov.R[k][1], r: 11, fill: 'none', stroke: MINT, 'stroke-width': 3 }, g); });
        });
        U.el('line', { x1: at[0], y1: at[1], x2: at[0] + dx * 0.8, y2: at[1] + dy * 0.8, stroke: MINT, 'stroke-width': 1.5 }, g);
        U.text(g, at[0] + dx, at[1] + dy, label, 'tag', { 'text-anchor': dx < 0 ? 'end' : 'start', style: halo + ';font-size:26px' });
        return g;
      };
      var IV = V.interventions;
      this.h1 = add(IV.trainees.map(function (t) { return [t, pt.S]; }), '1 · cross-training', ov.R[pt.S], -70, -120);
      this.h2 = add(IV.liaisons.map(function (t) { return [t, pt.B]; }), '2 · interface team', ov.R[pt.B], 90, -150);
      var fp = []; IV.forumA.forEach(function (a, j) { fp.push([a, IV.forumB[j % IV.forumB.length]]); });
      var fb = ov.centroid(IV.forumB, 'r');
      this.h3 = add(fp, '3 · forum', fb, -90, 40);
      var mk = U.el('g', null, s);
      [[pt.S, 'S · specialist'], [pt.B, 'B · broker']].forEach(function (x) { var p = ov.R[x[0]]; U.el('circle', { cx: p[0], cy: p[1], r: 16, fill: 'none', stroke: MINT, 'stroke-width': 2.5 }, mk); var isS = x[1][0] === 'S'; U.text(mk, p[0] + (isS ? -22 : 22), p[1] + 36, x[1], 'tag', { style: halo, 'text-anchor': isS ? 'end' : 'start' }); });
      U.legend(s, 0, 796, NL.functions.map(function (f) { return { kind: 'node', cls: 'fill f' + f.id, label: f.name.replace('Product & Engineering', 'Product & Eng.').replace('Sales & Customer', 'Sales & Cust.').replace('Client Solutions', 'Client Sol.') }; }));
      var P = U.el('g', { transform: 'translate(1200,20)' }, s);
      var H = [
        ['1 · Redundant expertise path', 'fragility', 'Cross-train ' + I.crossTrained + ' colleagues in the rare domain', 'After losing S, within two steps (all three changes):', I.rareWithin2AfterLossBefore + ' → ' + I.rareWithin2AfterLossAfter + ' of ' + I.needTotal + ' employees'],
        ['2 · Interface team', 'overload', I.liaisonMembers + ' coordinators share B’s contacts', 'B’s share of cross-function paths:', I.bBrokerageBeforePct + '% → ' + I.bBrokerageAfterPct + '%'],
        ['3 · Recurring forum', 'access', I.forumTiesAdded + ' ties between legacy data experts', 'Typical distance, Legacy A ↔ B:', I.abMeanDistanceBefore + ' → ' + I.abMeanDistanceAfter + ' steps'],
      ];
      this.hp = H.map(function (h, j) {
        var g = U.el('g', { class: 'ph', transform: 'translate(0,' + (j * 180) + ')' }, P);
        U.text(g, 0, 0, h[0], 'lab lab--hi');
        U.text(g, 0, 36, h[2], 'cap cap--sm');
        U.text(g, 0, 70, h[3], 'lab lab--sm');
        U.text(g, 0, 102, h[4], 'cap cap--sm', { style: 'fill:#E8F1F6;font-weight:600' });
        var m = U.el('g', { class: 'ph' }, g); U.text(m, 0, 136, 'Targets ' + h[1], 'tag');
        g.__m = m; return g;
      });
      var fr = U.el('g', { class: 'ph', transform: 'translate(0,560)' }, P); this.fr = fr;
      U.text(fr, 0, 0, 'Network interventions can', 'lab lab--hi');
      U.lines(fr, 0, 38, ['target particular actors · create or remove ties', 'change how groups are segmented', 'alter opportunities for contact and diffusion'], 'cap cap--sm', 34);
      var ev = U.el('g', { class: 'ph', transform: 'translate(0,560)' }, P); this.ev = ev;
      U.text(ev, 0, 0, 'A pilot would measure', 'lab lab--hi');
      U.lines(ev, 0, 38, ['access · response time · delivery quality', 'workload · employee experience'], 'cap cap--sm', 32);
      U.lines(ev, 0, 128, ['Prospective, against interfaces that', 'did not change. Numbers above are', 'structural, in the synthetic network.'], 'lab lab--sm', 30);
    },
    phase: function (k, U) {
      // all three present from the start; the one the prose is on is bright
      var hs = [this.h1, this.h2, this.h3];
      hs.forEach(function (g, j) { U.cls(g, 'is-on', true); g.style.opacity = k === 0 || k >= 4 ? (k === 0 ? 0.55 : '') : (k === j + 1 ? '' : 0.4); });
      this.hp.forEach(function (g, j) { U.cls(g, 'is-on', k >= j + 1); g.style.opacity = k >= 1 && k <= 3 && k !== j + 1 ? 0.5 : ''; U.cls(g.__m, 'is-on', k >= 5); });
      U.cls(this.fr, 'is-on', k === 4); U.cls(this.ev, 'is-on', k >= 6);
    },
  });

  // =========================================================================
  // 15 · evidence
  // =========================================================================
  B.push({
    id: 'evidence', kicker: KICK,
    lensKey: 'Evidence ladder', lens: ['what each kind of claim requires'],
    phases: [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }, { p: 5 }, { p: 6 }],
    desc: ['The evidence ladder: four kinds of claim.', 'Describe: observed structure in the measured network.', 'Structural counterfactual: the same measured graph with a node or tie removed.', 'Predict: repeated measurement and later outcomes.', 'Intervene: deliberate change with a credible comparison.', 'Why networks make causal inference hard: selection vs influence; interference.', 'Where the Northline evidence stands.'],
    source: 'Sources: Shalizi & Thomas 2011; Hudgens & Halloran 2008; Aronow & Samii 2017; Valente 2012; Laumann, Marsden & Prensky 1983; Kossinets 2006; Robins et al. 2007; Snijders et al. 2010 · ledger rows 11, 34, 38–41, 64',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-evi'), X = 180;
      var R = [
        ['Describe', 'Observed structure', '“Legacy A and B experts share one working tie.”', 'The measured relation, with its boundary and missing data stated'],
        ['Structural counterfactual', 'Under the measured network', '“Without S, 17 of 196 stay within two steps.”', 'The same measured graph, with a node or tie removed'],
        ['Predict', 'Anticipate a later outcome', '“Teams with one bridge will see slower delivery next quarter.”', 'Repeated measurement over time; outcomes observed later'],
        ['Intervene', 'Change structure, test consequences', '“An interface team will reduce coordination delay.”', 'Prospective comparison: phased roll-out, matched interfaces, or randomization'],
      ];
      this.rungs = R.map(function (r, j) {
        var y = 660 - j * 165, g = U.el('g', { class: 'ph', transform: 'translate(' + X + ',' + y + ')' }, s);
        U.el('line', { x1: 0, y1: 0, x2: 1180, y2: 0, class: 'grid' }, g);
        U.el('circle', { cx: 0, cy: 0, r: 9, class: 'nd' }, g);
        U.text(g, 30, -92, r[0], 'cap', { style: 'font-weight:600' });
        U.text(g, 30, -58, r[1], 'lab lab--sm');
        U.text(g, 450, -88, r[2], 'cap cap--sm', { style: 'font-style:italic' });
        U.text(g, 450, -50, 'Requires: ' + r[3], 'lab lab--sm');
        return g;
      });
      U.el('line', { x1: X, y1: 660, x2: X, y2: 170, class: 'axis' }, s);
      U.text(s, X - 10, 150, 'stronger claims', 'lab lab--sm', { 'text-anchor': 'end' });
      var ci = U.el('g', { class: 'ph' }, s); this.ci = ci;
      U.text(ci, 1400, 250, 'Why networks make it hard', 'lab lab--hi');
      U.lines(ci, 1400, 296, ['selection and influence can', 'produce the same pattern', '', 'one person’s treatment can', 'change another’s exposure', '(interference)'], 'cap cap--sm', 34);
      var mk = U.el('g', { class: 'ph' }, s); this.mk = mk;
      U.el('path', { d: 'M130,660 V495', stroke: MINT, 'stroke-width': 4 }, mk);
      U.text(mk, 120, 470, 'Northline', 'tag', { 'text-anchor': 'end' });
      U.text(mk, 120, 500, 'evidence', 'tag', { 'text-anchor': 'end' });
      U.lines(mk, 1400, 250, ['Describes the system', 'we generated and tests', 'counterfactuals inside', 'it; yields hypotheses.'], 'cap cap--sm', 34, { style: 'fill:' + MINT });
      U.lines(mk, 1400, 450, ['Real organizational', 'effects: the next study.'], 'cap cap--sm', 34);
    },
    phase: function (k, U) {
      // the ladder is present throughout; each rung brightens when the prose reaches it
      this.rungs.forEach(function (g, j) { U.cls(g, 'is-on', true); g.style.opacity = k === 0 ? 0.68 : k <= 4 ? (j < k ? '' : 0.68) : (j >= 2 && k >= 6 ? 0.72 : ''); });
      U.cls(this.ci, 'is-on', k === 5); U.cls(this.mk, 'is-on', k >= 6);
    },
  });

  // =========================================================================
  // 16 · privacy
  // =========================================================================
  B.push({
    id: 'privacy', kicker: KICK,
    lensKey: 'Relation', lens: ['Advice survey nominations', 'anonymized working network'],
    phases: [{ p: 0 }, { p: 1 }, { p: 3 }, { p: 4 }, { p: 5 }, { p: 6 }],
    desc: ['One synthetic survey respondent names three colleagues who did not answer the survey; they enter the dataset.', 'Across the survey: 907 of 1,015 nonrespondents appear through others’ nominations.',
      'With names removed, a unique position still identifies a person (166 unique department + tie-count combinations).', 'Four governance principles.', 'Message content: additional obligations.', 'Uses outside the research design.'],
    source: 'Sources: Borgatti & Molina 2003; Kadushin 2005; Backstrom, Dwork & Kleinberg 2007; Narayanan & Shmatikov 2009; Ajunwa, Crawford & Schultz 2017; Article 29 WP Opinion 2/2017 · ledger rows 42–44',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-prv'), self = this, V = NL.views.b15, PR = NL.privacy;
      var g = U.el('g', { class: 'ph-dim', transform: 'translate(34,90) scale(0.9)' }, s); this.g = g;
      V.edges.forEach(function (e) {
        var named = e[0] === V.R && V.named.indexOf(e[1]) >= 0 || e[1] === V.R && V.named.indexOf(e[0]) >= 0;
        if (!named) U.line(g, V.pos[e[0]], V.pos[e[1]], 'r-comm edge', 0, 0, { opacity: 0.4 });
      });
      V.named.forEach(function (j) { U.line(g, V.pos[V.R], V.pos[j], 'r-adv edge', 0, 14, { 'marker-end': 'url(#ar-adv-sv-prv)', 'stroke-width': 2.4 }); });
      this.nodes = V.people.map(function (p, k) {
        var named = V.named.indexOf(k) >= 0;
        return U.el('circle', { cx: V.pos[k][0], cy: V.pos[k][1], r: k === V.R ? 15 : 12, class: 'nd ' + U.fnClass(p.fn) + (p.resp ? '' : ' is-hollow') + (named ? ' is-ring' : '') }, g);
      });
      U.text(g, V.pos[V.R][0], V.pos[V.R][1] - 30, 'Respondent', 'tag', { 'text-anchor': 'middle', style: 'font-size:27px;' + halo });
      V.named.forEach(function (j) { U.text(g, V.pos[j][0], V.pos[j][1] + 40, 'did not respond', 'lab lab--sm', { 'text-anchor': 'middle', style: 'font-size:26px;' + halo }); });
      this.stat = U.el('g', { class: 'ph' }, s);
      U.lines(this.stat, 30, 700, [fmt(PR.nonrespondentsNamedByOthers) + ' of ' + fmt(PR.nonrespondents) + ' nonrespondents (' + PR.nonrespondentsNamedPct + '%) appear in the', 'advice data through colleagues’ nominations'], 'cap cap--sm', 34);
      // structural identifiability: the rare-domain bridge, anonymized
      var V8 = NL.views.b8, a = U.el('g', { class: 'ph', transform: 'translate(640,40) scale(0.52)' }, s); this.anon = a;
      V8.edges.forEach(function (e) { U.line(a, V8.pos[e[0]], V8.pos[e[1]], 'rt edge', 0, 0, { opacity: 0.4, 'stroke-width': 2 }); });
      V8.people.forEach(function (p, k) { U.el('circle', { cx: V8.pos[k][0], cy: V8.pos[k][1], r: k === V8.S ? 20 : 11, class: 'nd' + (k === V8.S ? ' is-ring' : ''), style: 'stroke:' + (k === V8.S ? MINT : '#9FB2C1') }, a); });
      U.text(a, V8.pos[V8.S][0], V8.pos[V8.S][1] - 40, 'Unique position', 'tag', { 'text-anchor': 'middle', style: 'font-size:46px;' + halo });
      var ast = U.el('g', { class: 'ph', transform: 'translate(640,440)' }, s); this.ast = ast;
      U.lines(ast, 0, 0, ['Names removed; the only bridge to a', 'rare domain stays recognizable.'], 'cap cap--sm', 34);
      U.text(ast, 0, -380, 'Anonymized slice · Northline working network', 'lab lab--sm');
      U.lines(ast, 0, 90, [fmt(PR.uniqueByDeptAndDegree) + ' employees have a department and', 'tie-count combination no one else shares.'], 'lab lab--sm', 30);
      var gov = U.el('g', { class: 'ph', transform: 'translate(1200,40)' }, s); this.gov = gov;
      U.text(gov, 0, 0, 'Governance design', 'lab lab--hi');
      [['Collect only', 'the minimum the question requires'], ['Separate', 'research from routine managerial access'], ['Suppress', 'outputs exposing individuals or small groups'], ['Restrict', 're-identification to research control']].forEach(function (x, j) {
        U.text(gov, 0, 50 + j * 70, x[0], 'cap', { style: 'fill:' + MINT + ';font-weight:600' });
        U.text(gov, 0, 82 + j * 70, x[1], 'lab lab--sm');
      });
      var cg = U.el('g', { class: 'ph', transform: 'translate(1200,370)' }, s); this.cg = cg;
      U.text(cg, 0, 0, 'Message content adds', 'lab lab--hi');
      ['explicit purpose and access authority', 'collection proportional to the question', 'restricted raw-text access', 'limited retention', 'no identifiable language in reports'].forEach(function (x, j) { U.text(cg, 0, 44 + j * 40, x, 'cap cap--sm'); });
      var out = U.el('g', { class: 'ph', transform: 'translate(1200,370)' }, s); this.out = out;
      U.text(out, 0, 0, 'Outside this research design', 'lab risk');
      ['Individual leaderboards', 'Flight-risk scoring', 'Disciplinary surveillance', 'Covert monitoring'].forEach(function (x, j) {
        U.text(out, 0, 44 + j * 42, x, 'cap cap--sm', { style: 'fill:#9FB2C1' });
        U.el('line', { x1: 0, y1: 36 + j * 42, x2: x.length * 12.2, y2: 36 + j * 42, class: 'strike' }, out);
      });
      U.lines(out, 0, 230, ['Purpose: system diagnosis of teams,', 'interfaces, access and dependencies.'], 'lab lab--sm', 30);
    },
    phase: function (k, U) {
      U.cls(this.stat, 'is-on', k >= 1);
      U.cls(this.anon, 'is-on', k >= 2); U.cls(this.ast, 'is-on', k >= 2);
      U.cls(this.gov, 'is-on', k >= 3); U.cls(this.cg, 'is-on', k === 4); U.cls(this.out, 'is-on', k >= 5);
      U.cls(this.g, 'is-dim', false); this.g.style.opacity = k >= 3 ? 0.7 : '';
    },
  });

  // =========================================================================
  // 17 · human-ai
  // =========================================================================
  var TOPO = { // classic communication patterns, in the order the prose names them; unit box 0..1
    'Centralized': { n: [[.5, .5], [.85, .15], [.85, .85], [.15, .85], [.15, .15]], e: [[0, 1], [0, 2], [0, 3], [0, 4]] },
    'Chain': { n: [[.05, .5], [.28, .5], [.5, .5], [.72, .5], [.95, .5]], e: [[0, 1], [1, 2], [2, 3], [3, 4]] },
    'Circle': { n: [[.5, .08], [.9, .38], [.75, .88], [.25, .88], [.1, .38]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
    'Fully connected': { n: [[.5, .08], [.9, .38], [.75, .88], [.25, .88], [.1, .38]], e: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]] },
    'Lattice': { n: [[.1, .15], [.5, .15], [.9, .15], [.1, .85], [.5, .85], [.9, .85]], e: [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5]] },
  };

  B.push({
    id: 'human-ai', kicker: KICK,
    lensKey: 'Relation', lens: ['Expertise seeking', 'illustrative scenario with one shared assistant'],
    phases: [{ p: 0 }, { p: 1 }, { p: 1, say: 'Forty percent of expertise-seeking ties' }, { p: 4 }, { p: 6 }, { p: 7 }],
    desc: ['A selected Northline expertise-seeking network: circles are employees; dashed ties are expertise-seeking relationships.', 'Illustrative synthetic scenario: a shared enterprise assistant enters.',
      'Forty percent of expertise-seeking ties routed through the assistant; it sits on 49.9% of shortest expertise paths.', 'Reporting lines unchanged; the route between people and knowledge has changed.',
      'Five classic communication patterns: centralized, chain, circle, fully connected, lattice.', 'Language-model agents: same task and model family, only who can communicate changes; the human–AI question stays open.'],
    source: 'Illustrative scenario computed on the synthetic reliance network · Sources: Trist & Bamforth 1951; Leavitt 1951; Qian et al. 2025; Brynjolfsson, Li & Raymond 2025; Dell’Acqua et al. 2025',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-ai'), self = this, V = NL.views.b3, A = NL.ai;
      var P = window.OrgView.groupLayout(V, [0, 90, 780, 620]);
      var rel = V.rules.reliance && V.rules.reliance.length ? V.rules.reliance : V.rules.advice;
      var tag = U.el('g', { class: 'ph' }, s); this.tag = tag;
      U.el('rect', { x: 0, y: 0, width: 420, height: 46, rx: 4, class: 'box box--hi' }, tag);
      U.text(tag, 16, 31, 'Illustrative scenario', 'lab lab--hi');
      this.base = U.el('g', null, s);
      this.lines = rel.map(function (e, j) {
        var l = U.line(self.base, P[e[0]], P[e[1]], 'r-rel edge', 0, 11, { 'marker-end': 'url(#ar-rel-sv-ai)' });
        l.__routed = (j % 5) < 2; // two in five: the scenario's 40%
        return l;
      });
      var ai = [390, 150]; this.ai = ai;
      this.via = U.el('g', { class: 'ph' }, s);
      var touched = {}, inRel = {};
      rel.forEach(function (e, j) { inRel[e[0]] = inRel[e[1]] = 1; if ((j % 5) < 2) { touched[e[0]] = 1; touched[e[1]] = 1; } });
      Object.keys(touched).forEach(function (k) { U.line(self.via, P[k], ai, 'rt is-hi edge', 11, 16, { 'stroke-width': 1.8, opacity: 0.8 }); });
      var nShown = 0; V.people.forEach(function (p, k) { if (inRel[k]) { nShown++; U.el('circle', { cx: P[k][0], cy: P[k][1], r: 11, class: 'nd ' + U.fnClass(p.fn) }, s); } });
      this.slice = U.el('g', null, s);
      U.text(this.slice, 0, 700, 'Selected Northline expertise-seeking network · ' + nShown + ' employees', 'lab lab--sm');
      U.legend(this.slice, 0, 750, [{ kind: 'line', cls: 'r-rel', label: 'seeks expertise from (dashed, directed)' }]);
      var an = U.el('g', { class: 'ph' }, s); this.an = an;
      U.el('rect', { x: ai[0] - 18, y: ai[1] - 18, width: 36, height: 36, rx: 4, fill: '#071A2B', stroke: MINT, 'stroke-width': 3 }, an);
      U.text(an, ai[0] + 34, ai[1] + 8, 'Shared assistant', 'tag', { style: halo });
      var st = U.el('g', { class: 'ph', transform: 'translate(860,30)' }, s); this.st = st;
      U.text(st, 0, 0, 'Scenario, whole organization', 'lab lab--hi');
      U.text(st, 0, 38, A.routedSharePct + '% of expertise-seeking ties go through one assistant', 'cap cap--sm');
      U.text(st, 0, 110, A.assistantBetweennessPct + '%', 'num num--hi');
      U.text(st, 190, 100, 'of shortest expertise paths pass', 'lab lab--sm');
      U.text(st, 190, 128, 'through the assistant', 'lab lab--sm');
      U.text(st, 0, 186, A.maxHumanBeforePct + '%', 'num num--md');
      U.text(st, 190, 180, 'most central colleague beforehand', 'lab lab--sm');
      this.hubT = U.text(st, 0, 236, 'The org chart is unchanged; the information path has a new hub.', 'lab lab--sm');
      var tp = U.el('g', { class: 'ph', transform: 'translate(860,320)' }, s); this.tp = tp;
      U.text(tp, 0, 0, 'Language-model agents: paths imposed directly', 'lab lab--hi');
      Object.keys(TOPO).forEach(function (name, j) {
        var T = TOPO[name], ox = (j % 3) * 300, oy = 40 + Math.floor(j / 3) * 180, w = 150, h = 100;
        T.e.forEach(function (e) { U.el('line', { x1: ox + T.n[e[0]][0] * w, y1: oy + T.n[e[0]][1] * h, x2: ox + T.n[e[1]][0] * w, y2: oy + T.n[e[1]][1] * h, class: 'r-comm' }, tp); });
        T.n.forEach(function (p) { U.el('rect', { x: ox + p[0] * w - 7, y: oy + p[1] * h - 7, width: 14, height: 14, rx: 3, fill: '#071A2B', stroke: '#D8F2FF', 'stroke-width': 2 }, tp); });
        U.text(tp, ox, oy + h + 36, name, 'lab lab--sm lab--t2');
      });
      this.lm = U.el('g', { class: 'ph' }, tp);
      U.lines(this.lm, 600, 250, ['Same task and model family;', 'only who can talk to whom', 'changes.'], 'lab lab--sm', 30);
      U.text(this.lm, 0, 450, 'For human–AI organizations, whether similar effects hold remains open.', 'cap cap--sm');
    },
    phase: function (k, U) {
      // emphasis follows the prose: the assistant → the routed paths → the system → the architectures
      this.lines.forEach(function (l) { l.style.opacity = k >= 2 && l.__routed ? 0.08 : ''; });
      U.cls(this.via, 'is-on', k >= 2); U.cls(this.an, 'is-on', k >= 1); U.cls(this.st, 'is-on', k >= 1); U.cls(this.tp, 'is-on', k >= 4);
      this.via.style.opacity = k >= 3 ? 0.45 : '';
      this.base.style.opacity = k === 1 ? 0.5 : '';
      this.hubT.style.fill = k === 3 ? '#6FD8BE' : '';
      this.st.style.opacity = k >= 4 ? 0.7 : '';
      U.cls(this.lm, 'is-on', k >= 5); U.cls(this.tag, 'is-on', k >= 1);
    },
  });

  // =========================================================================
  // 18 · close — back to the org chart: the symptoms, what the analysis found, the responses, the proposal evaluated, both layers
  // =========================================================================
  B.push({
    id: 'close', kicker: KICK,
    lensKey: 'Both layers', lens: ['The Northline org chart from page 05', 'relational findings from this walkthrough'],
    phases: [{ p: 0 }, { p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }, { p: 6 }],
    desc: ['The Northline org chart: three symptoms and one proposed reorganization.', 'What the relational analysis found, marked on the chart where it has a location.',
      'Five responses, one per mechanism.', 'The proposed reorganization evaluated: 907 contained, 191 split, 13 of 31 brokers still cross-line.', 'Formal structure and relational structure.', 'Both layers, seen together.'],
    source: 'Northline Systems is a fictional case; every result in this talk comes from synthetic data. Full source ledger: sources/claim-ledger.md',
    build: function (pg, U, NL) {
      var s = svg(pg, U, 'sv-close'), V = NL.views, pt = V.personaTeams, R = NL.reorg, C = NL.communities;
      var ov = window.OrgView(U, NL, s, [480, 0, 1768, 520], { compact: true }); this.ov = ov;
      ov.edgesOn(false);
      var ctr = function (f) { var ks = []; V.teams.forEach(function (t, k) { if (f(t)) ks.push(k); }); return ov.centroid(ks, 'f'); };
      var list = function (y, head, items, color) {
        var g = U.el('g', { class: 'ph' }, s);
        U.text(g, 0, y, head, 'lab lab--hi');
        items.forEach(function (x, j) { U.text(g, 0, y + 44 + j * 42, String(j + 1), 'lab', { style: 'letter-spacing:0;fill:' + color }); U.text(g, 30, y + 44 + j * 42, x, 'cap cap--sm'); });
        return g;
      };
      // symptoms (page 01)
      this.sym = list(60, 'Where Northline started', ['Cross-functional delivery slowing', 'Expertise hard to find', 'Heavy coordination loads'], WARN);
      U.text(this.sym, 0, 60 + 44 + 3 * 42 + 20, 'Proposed: three business lines', 'cap cap--sm', { style: 'fill:' + WARN });
      // findings, marked on the chart where they have a location
      var dc = {}; C.deliveryCommunity && (dc[C.deliveryCommunity.id] = 1);
      var F = [
        ['Communities cross functions', ctr(function (t) { return !!dc[t.c]; })],
        ['Brokers concentrate load · B', ov.F[pt.B]],
        ['Rare expertise, few paths · S', ov.F[pt.S]],
        ['Legacy pools weakly connected', ctr(function (t) { return t.legacy === 'A' || t.legacy === 'B'; })],
        ['Remote access weaker, one layer', null],
      ];
      this.find = list(60, 'What the relational analysis found', F.map(function (x) { return x[0]; }), MINT);
      var mk = U.el('g', { class: 'ph' }, s), placed = []; this.mk = mk;
      F.forEach(function (x, j) {
        if (!x[1]) return;
        var p = [x[1][0], x[1][1]];
        for (var t = 0; t < 12 && placed.some(function (q) { return Math.hypot(q[0] - p[0], q[1] - p[1]) < 52; }); t++) { p[0] += 30; p[1] -= 24; }
        placed.push(p);
        if (p[0] !== x[1][0] || p[1] !== x[1][1]) U.el('line', { x1: x[1][0], y1: x[1][1], x2: p[0], y2: p[1], stroke: MINT, 'stroke-width': 1.5 }, mk);
        U.el('circle', { cx: p[0], cy: p[1], r: 19, fill: '#071A2B', 'fill-opacity': 0.85, stroke: MINT, 'stroke-width': 2.4 }, mk);
        U.text(mk, p[0], p[1] + 8, String(j + 1), 'lab', { 'text-anchor': 'middle', style: 'letter-spacing:0;font-size:23px;fill:' + MINT });
      });
      // responses, one per mechanism
      this.resp = list(560, 'Responses', ['Redundant expertise paths around S', 'Distribute broker B’s integration load', 'Strengthen legacy cross-boundary interfaces', 'Investigate access by work arrangement', 'Evaluate structural changes prospectively'], MINT);
      this.resp.setAttribute('transform', 'translate(0,-24)');
      // the proposal, evaluated
      var ev = U.el('g', { class: 'ph', transform: 'translate(900,590)' }, s); this.ev = ev;
      U.text(ev, 0, 0, 'The proposed reorganization, evaluated', 'lab lab--hi');
      [[fmt(R.newlyInternalTies), 'cross-boundary ties newly contained'], [String(R.newlySplitTies), 'internal ties split'], [R.brokersMostlyCrossLine + ' of ' + R.brokersConsidered, 'leading brokers still cross-line']].forEach(function (x, j) {
        U.text(ev, 0, 56 + j * 56, x[0], 'num num--md'); U.text(ev, 190, 50 + j * 56, x[1], 'cap cap--sm');
      });
      var fin = U.el('g', { class: 'ph', transform: 'translate(900,620)' }, s); this.fin = fin;
      U.lines(fin, 0, 0, ['Formal structure: authority, resources, responsibility.', 'Relational structure: how people reach one another.'], 'cap cap--sm', 40);
      this.last = U.el('g', { class: 'ph', transform: 'translate(900,620)' }, s);
      U.text(this.last, 0, 110, 'Better organizational design begins by seeing both.', 'cap', { style: 'fill:' + MINT + ';font-weight:600' });
    },
    phase: function (k, U) {
      this.ov.layout('f');
      U.cls(this.sym, 'is-on', k === 0); U.cls(this.find, 'is-on', k >= 1); U.cls(this.mk, 'is-on', k >= 1);
      this.find.style.opacity = k >= 2 ? 0.55 : ''; this.mk.style.opacity = k >= 2 ? 0.55 : '';
      U.cls(this.resp, 'is-on', k >= 2); this.resp.style.opacity = k >= 3 ? 0.55 : '';
      U.cls(this.ev, 'is-on', k === 3); U.cls(this.fin, 'is-on', k === 4); U.cls(this.last, 'is-on', k >= 4);
      // the final screen is quiet: only the closing line remains
      var quiet = k === 5; this.ov.g.style.opacity = quiet ? 0.12 : ''; this.find.style.opacity = quiet ? 0 : this.find.style.opacity; this.mk.style.opacity = quiet ? 0 : this.mk.style.opacity; this.resp.style.opacity = quiet ? 0 : this.resp.style.opacity;
    },
  });
})();
