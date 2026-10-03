/* Autoplay player (adapted from the Sandia presentation's player.js).

   Differences from Sandia: this deck has phases inside each page, keyed to
   the passage clock. The player pushes its clock into the deck every frame
   through __t(seconds), so pausing, stepping a passage or changing speed
   moves the visual and the prose together. A click or key inside the deck
   advances the deck by one phase; the player follows and pauses.

   Original notes follow.

   Autoplay player for the unmodified v13 deck.

   The deck advances one state per gesture, and every animation inside a state
   runs on the deck's own timers. So autoplay never needs to click anything: it
   only decides WHEN to advance, through the hooks the deck already exposes:
     __seek(i)  show state i with animation on (what a presenter's click does)
     __state()  the state currently on screen
   These are only reachable because the deck is served from the same origin as
   this page. Serve both together, and embed THIS page elsewhere if needed.

   Everything is scoped to a [data-sp="root"] element, parts are found by
   data-sp names inside it, and keyboard shortcuts only apply while focus is
   inside the player, so it can sit inside another site's page. */
(function () {
  'use strict';

  var T = window.TIMELINE.states;
  var root = document.querySelector('[data-sp="root"]');
  var $ = function (name) { return root.querySelector('[data-sp="' + name + '"]'); };
  var frame = $('deck'), box = $('stage');
  var playBtn = $('play'), track = $('track'), jump = $('jump'), prose = $('prose');
  var panel = prose.parentNode;
  var now = $('now'), pos = $('pos'), pprev = $('pprev'), pnext = $('pnext');

  var deck = null;          // the iframe's window once it has booted
  var cur = 0;              // state the player believes is on screen
  var t = 0;                // seconds elapsed inside the current state
  var navSeen = 0;          // deck's own navigation counter (clicks/keys inside the deck)
  var playing = false, speed = 1, last = 0;

  var starts = [], total = 0;
  T.forEach(function (s) { starts.push(total); total += s.duration; });

  function clock(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  /* ---- scale the 1920x1080 deck viewport to the stage box --------------- */
  function fitDeck() {
    // letterboxed fit, so the same code serves the page layout and the expanded (fullscreen) stage
    var w = box.clientWidth, h = box.clientHeight || w * 9 / 16, s = Math.min(w / 1920, h / 1080);
    box.style.setProperty('--sp-s', s);
    frame.style.left = Math.max(0, (w - 1920 * s) / 2) + 'px'; frame.style.top = Math.max(0, (h - 1080 * s) / 2) + 'px';
  }
  if (window.ResizeObserver) new ResizeObserver(fitDeck).observe(box);
  else addEventListener('resize', fitDeck);
  fitDeck();

  /* ---- a transcript panel whose height never changes during playback ----
     Host pages can react to their own height changing (Graystone's background
     field regenerates on it), so the panel is sized once per width to the
     longest state's prose, capped against the viewport, and scrolls inside
     itself when a state is longer than that. */
  var sizedW = 0;
  function sizeTranscript() {
    var w = prose.clientWidth;
    if (!w || w === sizedW) return;
    sizedW = w;
    var probe = prose.cloneNode(false);
    probe.removeAttribute('data-sp');
    probe.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0;width:' + w + 'px';
    panel.appendChild(probe);
    var tallest = 0;
    T.forEach(function (s) {
      probe.innerHTML = '';
      s.paragraphs.forEach(function (p) {
        var el = document.createElement('p'); el.textContent = p.text; probe.appendChild(el);
      });
      tallest = Math.max(tallest, probe.offsetHeight);
    });
    panel.removeChild(probe);
    var cs = getComputedStyle(panel);
    var pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    var cap = Math.max(240, innerHeight * 0.7);
    panel.style.height = Math.ceil(Math.min(tallest + pad, cap)) + 'px';
  }
  if (window.ResizeObserver) new ResizeObserver(sizeTranscript).observe(panel);
  else addEventListener('resize', sizeTranscript);

  /* The current-passage area holds one paragraph at a time. Its height is fixed
     to the longest paragraph at the current width for the same reason. */
  var nowW = 0;
  function sizeNow() {
    var w = now.clientWidth;
    if (!w || w === nowW) return;
    nowW = w;
    var probe = now.cloneNode(false);
    probe.removeAttribute('data-sp');
    probe.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0;width:' + w + 'px';
    now.parentNode.appendChild(probe);
    var tallest = 0;
    T.forEach(function (s) {
      s.paragraphs.forEach(function (p) {
        probe.innerHTML = '';
        var el = document.createElement('p'); el.textContent = p.text; probe.appendChild(el);
        tallest = Math.max(tallest, probe.offsetHeight);
      });
    });
    now.parentNode.removeChild(probe);
    now.style.minHeight = Math.ceil(tallest) + 'px';
  }
  if (window.ResizeObserver) new ResizeObserver(sizeNow).observe(now);
  else addEventListener('resize', sizeNow);

  function showNow(s, on) {
    now.innerHTML = '';
    var el = document.createElement('p');
    if (s.paragraphs[on]) el.textContent = s.paragraphs[on].text;
    else { el.className = 'sp-empty'; el.textContent = 'Spoken text for this page has not been added yet.'; }
    now.appendChild(el);
    var many = s.paragraphs.length > 1;
    pos.textContent = many ? (on + 1) + ' / ' + s.paragraphs.length : '';
    pprev.hidden = pnext.hidden = !many;
    pprev.disabled = on <= 0;
    pnext.disabled = on >= s.paragraphs.length - 1;
  }

  /* Step among the current page's passages. This never moves the deck: the
     clock is set to the chosen passage's cue, so Play resumes from there. */
  function stepPassage(d) {
    var s = T[cur], k = shownOn + d;
    if (k < 0 || k >= s.paragraphs.length) return;
    setPlaying(false);
    t = s.paragraphs[k].at;
    renderTime();
  }

  /* keep the highlighted paragraph visible by scrolling the PANEL, never the page */
  function reveal(el) {
    var top = el.offsetTop, bottom = top + el.offsetHeight;
    var viewTop = panel.scrollTop, viewBottom = viewTop + panel.clientHeight;
    if (top >= viewTop && bottom <= viewBottom) return;
    var target = Math.max(0, top - 12);
    if (panel.scrollTo) panel.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
    else panel.scrollTop = target;
  }
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var shownOn = -1;

  /* ---- static UI -------------------------------------------------------- */
  $('total').textContent = clock(total);
  T.forEach(function (s, i) {
    var seg = document.createElement('i');
    seg.style.flex = s.duration;
    seg.title = (i + 1) + '. ' + s.label;
    seg.appendChild(document.createElement('b'));
    seg.addEventListener('click', function () { go(i); });
    track.appendChild(seg);

    var o = document.createElement('option');
    o.value = i; o.textContent = (i + 1) + ' / ' + T.length + ' · ' + s.label;
    jump.appendChild(o);
  });

  /* ---- navigation ------------------------------------------------------- */
  function go(i) {
    cur = Math.max(0, Math.min(T.length - 1, i));
    t = 0;
    if (deck) deck.__seek(cur);
    renderState();
  }

  function setPlaying(on) {
    playing = on && !!deck;
    playBtn.textContent = playing ? '❚❚' : '▶';
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    playBtn.title = playing ? 'Pause' : 'Play';
  }

  playBtn.addEventListener('click', function () {
    if (!playing && cur === T.length - 1 && t >= T[cur].duration) go(0);
    else if (!playing && t === 0) go(cur);   // start the state's animation from its beginning
    setPlaying(!playing);
  });
  $('prev').addEventListener('click', function () { go(cur - 1); });
  $('next').addEventListener('click', function () { go(cur + 1); });
  $('restart').addEventListener('click', function () { go(0); });
  var expand = $('expand');
  if (expand) {
    if (!box.requestFullscreen) expand.hidden = true;
    expand.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else box.requestFullscreen().catch(function () {});
    });
    document.addEventListener('fullscreenchange', function () {
      var on = document.fullscreenElement === box;
      expand.textContent = on ? '⤡ Exit' : '⤢ Expand';
      expand.setAttribute('aria-label', on ? 'Exit full screen' : 'Show the slides full screen');
      fitDeck();
    });
  }
  pprev.addEventListener('click', function () { stepPassage(-1); });
  pnext.addEventListener('click', function () { stepPassage(1); });
  $('speed').addEventListener('change', function (e) { speed = +e.target.value; });
  jump.addEventListener('change', function (e) { go(+e.target.value); });

  root.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('button, select')) return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); playBtn.click(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  });

  /* ---- rendering -------------------------------------------------------- */
  function renderState() {
    var s = T[cur];
    jump.value = cur;
    $('count').textContent = 'Page ' + (cur + 1) + ' of ' + T.length;
    prose.innerHTML = '';
    panel.scrollTop = 0; shownOn = -1;
    if (!s.paragraphs.length) {
      var e = document.createElement('p');
      e.className = 'sp-empty';
      e.textContent = 'Speaker text for this page has not been added yet.';
      prose.appendChild(e);
    }
    s.paragraphs.forEach(function (p) {
      var el = document.createElement('p');
      el.textContent = p.text;
      el.addEventListener('click', function () {
        /* selecting text should not move the clock */
        if (String(window.getSelection && getSelection())) return;
        t = p.at; renderTime();
      });
      prose.appendChild(el);
    });
    renderTime();
  }

  function renderTime() {
    var s = T[cur];
    $('elapsed').textContent = clock(starts[cur] + t);
    var segs = track.children;
    for (var i = 0; i < segs.length; i++) {
      segs[i].className = i < cur ? 'sp-done' : '';
      segs[i].firstChild.style.width = i === cur ? (100 * t / s.duration) + '%' : '';
    }
    var on = 0;
    s.paragraphs.forEach(function (p, k) { if (p.at <= t) on = k; });
    var ps = prose.querySelectorAll('p:not(.sp-empty)');
    for (var k = 0; k < ps.length; k++) ps[k].classList.toggle('sp-on', k === on);
    if (on !== shownOn) {
      shownOn = on;
      showNow(s, on);
      if (on > 0 && ps[on] && panel.offsetParent) reveal(ps[on]);
    }
  }

  /* ---- the clock -------------------------------------------------------- */
  function tick(now) {
    var dt = last ? Math.min((now - last) / 1000, 0.25) : 0;
    last = now;
    if (deck) {
      /* a visitor clicked or keyed inside the deck: follow it and pause */
      var seen = deck.__state(), nav = deck.__nav ? deck.__nav() : 0;
      if (seen !== cur || nav !== navSeen) {
        navSeen = nav; setPlaying(false);
        if (seen !== cur) { cur = seen; renderState(); }
        t = deck.__time ? Math.min(deck.__time(), T[cur].duration) : 0; renderTime();
      }
      else if (playing) {
        t += dt * speed;
        if (t >= T[cur].duration) {
          if (cur < T.length - 1) go(cur + 1);
          else { t = T[cur].duration; setPlaying(false); }
        }
        renderTime();
      }
      if (deck.__t) deck.__t(t);
    }
    requestAnimationFrame(tick);
  }

  /* ---- boot ------------------------------------------------------------- */
  /* The deck boots on fonts.ready or after 350 ms, whichever comes first, and
     shows its start state then. Wait past that so our first seek is not undone. */
  function attach() {
    var w;
    try { w = frame.contentWindow; if (!w.__deckReady || !w.__seek) throw 0; }
    catch (err) {
      prose.innerHTML = '<p class="sp-empty">The player cannot reach the deck. Open this page through a web server (see README), not by double-clicking the file.</p>';
      return;
    }
    setTimeout(function () { deck = w; cur = w.__state(); navSeen = w.__nav ? w.__nav() : 0; renderState(); }, 600);
  }
  if (frame.contentDocument && frame.contentDocument.readyState === 'complete' && frame.contentWindow.__deckReady) attach();
  else frame.addEventListener('load', attach);

  sizeTranscript();
  sizeNow();
  renderState();
  requestAnimationFrame(tick);
})();
