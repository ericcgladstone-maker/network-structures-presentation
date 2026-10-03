/* Deck controller. Classic script, no modules, no dependencies.

   Rules this file keeps (inherited from the Sandia deck):
     1. Within a beat, geometry is laid out once. Phases set emphasis and run
        tokens; they never re-layout.
     2. Every phase has a complete settled state reachable with animation off
        (?capture=1, ?anim=0, or prefers-reduced-motion). Phase functions are
        absolute: phase(k) fully specifies the view, so back and forward land
        on identical states.
   Phases are keyed to the player's clock: the player pushes seconds-into-state
   through __t(); standalone, the deck runs its own clock.
   FICTIONAL ORGANIZATION · SYNTHETIC DATA. Every number shown is read from
   window.NL (data/compute-metrics.js). */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var NL = window.NL, TL = (window.TIMELINE || { states: [] }).states;
  var q = new URLSearchParams(location.search);
  var CAPTURE = q.get('capture') === '1';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STILL = CAPTURE || reduce || q.get('anim') === '0';
  if (STILL) document.documentElement.classList.add('still');
  if (CAPTURE) document.documentElement.classList.add('capture');

  var stage = document.getElementById('stage'), fit = document.getElementById('fit');
  var field = document.getElementById('field');
  var hdBeat = document.querySelector('.hd__beat'), hdTitle = document.querySelector('.hd__title'), hdLens = document.querySelector('.hd__lens');
  var ftSrc = document.querySelector('.ft__src'), prog = document.getElementById('prog'), help = document.getElementById('help');
  var live = document.getElementById('live');

  // ---- helpers ---------------------------------------------------------------
  var U = {};
  U.STILL = STILL;
  // seeded stream for token choices, so playback is reproducible
  var rs = 20260929 >>> 0;
  U.rand = function () { rs = (rs + 0x6D2B79F5) >>> 0; var x = rs; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  U.el = function (name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  U.text = function (parent, x, y, str, cls, attrs) {
    var t = U.el('text', Object.assign({ x: x, y: y, class: cls || 'lab' }, attrs || {}), parent);
    t.textContent = str; return t;
  };
  // multi-line text (explicit lines)
  U.lines = function (parent, x, y, arr, cls, lh, attrs) {
    var t = U.el('text', Object.assign({ x: x, y: y, class: cls || 'cap' }, attrs || {}), parent);
    arr.forEach(function (s, i) { var ts = U.el('tspan', { x: x, dy: i ? (lh || 30) : 0 }, t); ts.textContent = s; });
    return t;
  };
  U.fmt = function (n) { return Number(n).toLocaleString('en-US'); };
  U.pct = function (n) { return n + '%'; };
  U.cls = function (e, name, on) { if (e) e.classList.toggle(name, !!on); };
  U.all = function (root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
  U.on = function (root, sel, on) { U.all(root, sel).forEach(function (e) { e.classList.toggle('is-on', !!on); }); };
  U.fnClass = function (fn) { return 'f' + fn; };
  U.FN_NAME = {}; NL.functions.forEach(function (f) { U.FN_NAME[f.id] = f.name; });
  U.DEPT = {}; NL.departments.forEach(function (d) { U.DEPT[d.id] = d; });
  // arrowhead marker defs (created once per svg)
  U.defs = function (svg) {
    var d = U.el('defs', null, svg);
    [['ar-adv', '#D8F2FF'], ['ar-rel', '#E3A6D4'], ['ar-mint', '#6FD8BE'], ['ar-mu', '#9FB2C1']].forEach(function (m) {
      var mk = U.el('marker', { id: m[0] + '-' + svg.id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, d);
      U.el('path', { d: 'M0,1 L9,5 L0,9 z', fill: m[1], opacity: 0.85 }, mk);
    });
    return d;
  };
  // line shortened at both ends by r (so arrowheads sit at node rims)
  U.seg = function (a, b, r1, r2) {
    var dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    return [a[0] + dx / d * r1, a[1] + dy / d * r1, b[0] - dx / d * r2, b[1] - dy / d * r2];
  };
  U.line = function (parent, a, b, cls, r1, r2, attrs) {
    var s = U.seg(a, b, r1 || 0, r2 || 0);
    return U.el('line', Object.assign({ x1: s[0].toFixed(1), y1: s[1].toFixed(1), x2: s[2].toFixed(1), y2: s[3].toFixed(1), class: cls }, attrs || {}), parent);
  };
  // gentle curve (organic relational tie)
  U.curve = function (parent, a, b, cls, bend, attrs) {
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    var k = bend == null ? 0.12 : bend;
    var cx = mx - dy * k, cy = my + dx * k;
    return U.el('path', Object.assign({ d: 'M' + a[0].toFixed(1) + ',' + a[1].toFixed(1) + ' Q' + cx.toFixed(1) + ',' + cy.toFixed(1) + ' ' + b[0].toFixed(1) + ',' + b[1].toFixed(1), class: cls }, attrs || {}), parent);
  };
  U.legend = function (parent, x, y, items) {
    var g = U.el('g', { class: 'lg', transform: 'translate(' + x + ',' + y + ')' }, parent);
    var xx = 0;
    items.forEach(function (it) {
      if (it.kind === 'node') U.el('circle', { cx: xx + 8, cy: -8, r: 8, class: 'nd ' + (it.cls || '') }, g);
      else U.el('line', { x1: xx, y1: -8, x2: xx + 30, y2: -8, class: it.cls, 'stroke-width': 3 }, g);
      var t = U.text(g, xx + (it.kind === 'node' ? 20 : 40), 0, it.label, 'lab lab--sm');
      xx += (it.kind === 'node' ? 22 : 42) + it.label.length * 11.5 + 38;
    });
    return g;
  };

  // ---- tokens (Sandia idiom: every moving mint mark is something travelling) --
  var running = [], timers = [];
  U.token = function (host, pts, opts) {
    opts = opts || {};
    var g = U.el('g', { class: 'tk' }, host);
    if (opts.kind === 'sq') U.el('rect', { class: 'tk__sq', x: -6, y: -6, width: 12, height: 12, rx: 1.5 }, g);
    else if (opts.kind === 'warm') U.el('circle', { class: 'tk__w', r: opts.r || 6.5 }, g);
    else U.el('circle', { class: 'tk__dot', r: opts.r || 6.5 }, g);
    if (STILL) {
      if (opts.park === false) { host.removeChild(g); return null; }
      var a = pts[0], b = pts[1] || pts[0], f = opts.parkAt == null ? 0.5 : opts.parkAt;
      g.setAttribute('transform', 'translate(' + (a[0] + (b[0] - a[0]) * f).toFixed(1) + ',' + (a[1] + (b[1] - a[1]) * f).toFixed(1) + ')');
      g.style.opacity = 1; return null;
    }
    var seg = [], total = 0;
    for (var i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
    var frames = [], acc = 0;
    for (var j = 0; j < pts.length; j++) {
      if (j) acc += seg[j - 1];
      frames.push({ offset: total ? acc / total : j / Math.max(1, pts.length - 1), transform: 'translate(' + pts[j][0].toFixed(1) + 'px,' + pts[j][1].toFixed(1) + 'px)', opacity: 1 });
    }
    frames[0].opacity = 0; frames[frames.length - 1].opacity = opts.hold ? 1 : 0;
    var an = g.animate(frames, { duration: opts.dur || Math.max(700, total * 2.2), delay: opts.delay || 0, easing: 'cubic-bezier(.4,0,.5,1)', fill: opts.hold ? 'forwards' : 'both' });
    running.push(an);
    if (!opts.hold) an.finished.then(function () { if (g.parentNode) g.parentNode.removeChild(g); }).catch(function () {});
    return an;
  };
  U.later = function (fn, ms) { if (STILL) return; timers.push(setTimeout(fn, ms)); };
  U.every = function (fn, ms, first) { if (STILL) return; if (first != null) timers.push(setTimeout(fn, first)); timers.push(setInterval(fn, ms)); };
  function clearMotion() {
    timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = [];
    running.forEach(function (a) { try { a.cancel(); } catch (e) {} }); running = [];
    U.all(stage, '.tk').forEach(function (g) { if (g.parentNode) g.parentNode.removeChild(g); });
  }

  // ---- beats -------------------------------------------------------------------
  var BEATS = window.BEATS || [];
  var idx = 0, phase = -1, t = 0, driven = 0, navCount = 0;

  // Seconds into state i when the reader reaches `phrase` in passage p, at the
  // player's reading clock (timeline pace: a settle at each passage, then READ_WPM).
  var PACE = (window.TIMELINE && window.TIMELINE.pace) || { wpm: 180, settle: 4 };
  function sayAt(i, p, phrase) {
    var s = TL[i], para = s && s.paragraphs[p]; if (!para) return 0;
    var j = para.text.indexOf(phrase); if (j < 0) { if (window.console) console.error('phrase not found: ' + phrase); return para.at; }
    var words = para.text.slice(0, j).split(/\s+/).filter(Boolean).length;
    return para.at + PACE.settle + words / (PACE.wpm / 60);
  }
  U.sayAt = sayAt;
  function cueOf(i, k) {
    var b = BEATS[i], ph = b.phases[k], s = TL[i];
    if (!ph) return 0;
    if (ph.say) return Math.round((sayAt(i, ph.p, ph.say) + (ph.dt || 0)) * 10) / 10;
    var base = s && s.paragraphs[ph.p] ? s.paragraphs[ph.p].at : 0;
    return base + (ph.dt || 0);
  }
  function phaseAt(i, sec) {
    var k = 0;
    for (var j = 0; j < BEATS[i].phases.length; j++) if (cueOf(i, j) <= sec + 1e-6) k = j;
    return k;
  }

  function setLens(lensKey, lens) {
    hdLens.innerHTML = '';
    (lens || []).forEach(function (x, k) {
      if (k === 0 && lensKey) { var key = document.createElement('b'); key.textContent = lensKey; hdLens.appendChild(key); }
      var sp = document.createElement('span'); sp.textContent = x; hdLens.appendChild(sp);
    });
  }
  function setHeader(i) {
    var b = BEATS[i], s = TL[i] || {};
    hdBeat.textContent = b.kicker || '';
    hdTitle.textContent = b.title || s.heading || '';
    hdTitle.classList.toggle('hd__title--long', hdTitle.textContent.length > 64);
    setLens(b.lensKey, b.lens);
    ftSrc.textContent = b.source || '';
    var ftSyn = document.querySelector('.ft__syn'), caseAt = BEATS.map(function (x) { return x.id; }).indexOf('northline');
    if (ftSyn) ftSyn.textContent = caseAt >= 0 && i < caseAt ? 'Illustrative examples' : 'Northline Systems is fictional · all data synthetic';
    document.querySelector('.hd').hidden = !!b.noHeader;
  }

  function show(i, opts) {
    opts = opts || {};
    idx = Math.max(0, Math.min(BEATS.length - 1, i));
    clearMotion();
    BEATS.forEach(function (b, j) { if (b.pg) b.pg.hidden = j !== idx; });
    var b = BEATS[idx];
    if (!b.pg) {
      b.pg = document.createElement('div'); b.pg.className = 'pg pg--' + b.id; field.appendChild(b.pg);
      b.build(b.pg, U, NL);
    }
    b.pg.hidden = false;
    setHeader(idx);
    t = opts.at || 0; phase = -1;
    setPhase(opts.phase != null ? opts.phase : phaseAt(idx, t));
    paintProgress();
    if (live) live.textContent = (idx + 1) + ' of ' + BEATS.length + ': ' + (TL[idx] ? TL[idx].heading : '');
  }
  function setPhase(k) {
    if (k === phase) return;
    phase = k;
    clearMotion();
    var b = BEATS[idx];
    b.phase(k, U);
    // optional per-phase lens (a beat can change what the header says is on screen)
    if (b.lensAt) { var L = b.lensAt(k); setLens(L ? L[0] : b.lensKey, L ? L[1] : b.lens); }
    if (b.desc && b.desc[k]) {
      var sv = b.pg.querySelector('svg');
      if (sv) { sv.setAttribute('role', 'img'); sv.setAttribute('aria-label', (TL[idx] ? TL[idx].heading + ' ' : '') + b.desc[k]); }
    }
  }
  function paintProgress() {
    prog.innerHTML = '';
    for (var i = 0; i < BEATS.length; i++) { var e = document.createElement('i'); if (i === idx) e.className = 'is-on'; prog.appendChild(e); }
  }

  // ---- clock -------------------------------------------------------------------
  var last = 0;
  function tick(now) {
    var dt = last ? Math.min((now - last) / 1000, 0.25) : 0; last = now;
    if (Date.now() - driven > 800 && !STILL && !paused) {
      t += dt;
      var dur = TL[idx] ? TL[idx].duration : 60;
      if (t > dur) t = dur;
    }
    var k = phaseAt(idx, t);
    if (k !== phase) setPhase(k);
    requestAnimationFrame(tick);
  }
  var paused = q.get('hold') === '1';

  // ---- input -------------------------------------------------------------------
  var lastNav = 0;
  function navLocked() { var n = Date.now(); if (n - lastNav < 450) return true; lastNav = n; return false; }
  function step(d) {
    var b = BEATS[idx];
    if (d > 0) {
      if (phase < b.phases.length - 1) { t = cueOf(idx, phase + 1); setPhase(phase + 1); }
      else if (idx < BEATS.length - 1) show(idx + 1);
    } else {
      if (phase > 0) { t = cueOf(idx, phase - 1); setPhase(phase - 1); }
      else if (idx > 0) show(idx - 1);
    }
    navCount++;
  }
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); if (e.repeat || navLocked()) return; step(1); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); if (e.repeat || navLocked()) return; step(-1); }
    else if (k === 'f' || k === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(function () {}); }
    else if (k === '?' || k === '/') help.hidden = !help.hidden;
    else if (k === 'Escape') help.hidden = true;
    else if (k === 'Home') { show(0); navCount++; }
  });
  document.addEventListener('click', function (e) {
    if (!help.hidden) { help.hidden = true; return; }
    if (navLocked()) return;
    step(1);
  });

  // ---- fit -----------------------------------------------------------------------
  function resize() { stage.style.setProperty('--k', Math.min(fit.clientWidth / 1920, fit.clientHeight / 1080)); }
  addEventListener('resize', resize);

  // ---- QA: safe-frame audit (?qa=all) --------------------------------------------
  var SAFE = { x: 60, top: 44, bottom: 16 };
  function qaAudit() {
    var k = parseFloat(getComputedStyle(stage).getPropertyValue('--k')) || 1, sb = stage.getBoundingClientRect(), out = [];
    var els = stage.querySelectorAll('.hd *, .pg:not([hidden]) *');
    for (var i = 0; i < els.length; i++) {
      var e = els[i]; if (e.closest('defs') || e.closest('.tk')) continue;
      var cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      if (e.closest('[hidden]')) continue;
      var r = e.getBoundingClientRect(); if (!r.width && !r.height) continue;
      var b = { l: (r.left - sb.left) / k, r: (r.right - sb.left) / k, t: (r.top - sb.top) / k, b: (r.bottom - sb.top) / k };
      var over = Math.max(SAFE.x - b.l, b.r - (1920 - SAFE.x), SAFE.top - b.t, b.b - (1080 - 60));
      if (over > 0.5) out.push({ sel: e.tagName + '.' + (e.getAttribute('class') || ''), txt: (e.textContent || '').slice(0, 40), over: +over.toFixed(1) });
    }
    out.sort(function (a, b2) { return b2.over - a.over; });
    return { state: idx, phase: phase, id: BEATS[idx].id, worst: out[0] ? out[0].over : 0, hits: out.slice(0, 5) };
  }
  // text collisions between visible svg text elements in the current page
  function qaText() {
    var ts = U.all(BEATS[idx].pg, 'text').filter(function (e) {
      var cs = getComputedStyle(e); if (cs.display === 'none' || e.closest('[hidden]')) return false;
      var o = 1, n = e; while (n && n !== stage) { var c = getComputedStyle(n); o *= +c.opacity; n = n.parentElement; }
      return o > 0.3;
    });
    var boxes = ts.map(function (e) { return [e, e.getBoundingClientRect()]; }), hits = [];
    for (var i = 0; i < boxes.length; i++) for (var j = i + 1; j < boxes.length; j++) {
      var a = boxes[i][1], b = boxes[j][1];
      var ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 2 && oy > 2) hits.push([boxes[i][0].textContent.slice(0, 30), boxes[j][0].textContent.slice(0, 30)]);
    }
    return hits;
  }
  // smallest explanatory text in deck px (font size × any SVG scaling), excluding the
  // kicker and the source footer, which are secondary and recoverable in Sources
  function qaSize() {
    var out = [];
    U.all(BEATS[idx].pg, 'text, p, h1').concat(U.all(stage, '.hd__title, .hd__lens span')).forEach(function (e) {
      if (!(e.textContent || '').trim() || e.closest('[hidden]')) return;
      var o = 1, n = e; while (n && n !== stage) { var c = getComputedStyle(n); if (c.display === 'none') { o = 0; break; } o *= +c.opacity; n = n.parentElement; }
      if (o < 0.3) return;
      var px = parseFloat(getComputedStyle(e).fontSize);
      if (e.getScreenCTM) { var m = e.getScreenCTM(); if (m) px *= Math.hypot(m.a, m.b) / (parseFloat(getComputedStyle(stage).getPropertyValue('--k')) || 1); }
      out.push([+px.toFixed(1), e.textContent.trim().slice(0, 40)]);
    });
    out.sort(function (a, b) { return a[0] - b[0]; });
    return out;
  }
  window.__qa = qaAudit; window.__qaText = qaText; window.__qaSize = qaSize;
  // visible text for number provenance checks
  window.__text = function () {
    var out = [hdTitle.textContent, hdLens.textContent, ftSrc.textContent];
    U.all(BEATS[idx].pg, 'text, p, span, div').forEach(function (e) {
      if (e.children.length && e.tagName !== 'text') return;
      var o = 1, n = e; while (n && n !== stage) { var c = getComputedStyle(n); if (c.display === 'none') { o = 0; break; } o *= +c.opacity; n = n.parentElement; }
      if (o > 0.05) out.push(e.textContent);
    });
    return out.join(' ‖ ');
  };

  // ---- boot ----------------------------------------------------------------------
  var booted = false;
  function boot() {
    if (booted) return; booted = true;
    resize();
    var start = parseInt(q.get('s') || '0', 10) || 0, ph = q.get('p');
    show(start, ph != null ? { phase: +ph, at: cueOf(start, +ph) } : {});
    if (ph != null) t = cueOf(start, +ph);
    requestAnimationFrame(tick);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  setTimeout(boot, 350);
  window.__deckReady = true;
  window.__beats = BEATS.length;
  window.__seek = function (i) { show(i); };
  window.__go = function (i, k) { show(i, k != null ? { phase: k, at: cueOf(i, k) } : {}); if (k != null) t = cueOf(i, k); };
  window.__state = function () { return idx; };
  window.__phase = function () { return phase; };
  window.__phases = function (i) { return BEATS[i == null ? idx : i].phases.length; };
  window.__cue = function (i, k) { return cueOf(i, k); };
  window.__nav = function () { return navCount; };
  window.__t = function (sec) { driven = Date.now(); t = sec; var k = phaseAt(idx, t); if (k !== phase) setPhase(k); };
  window.__time = function () { return t; };
})();
