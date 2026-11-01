/* ============================================================
   Gateway Intelligence — "How Intelligence Flows" scroll story
   One sticky canvas behind the #flow panes. 640 squares (one
   example week of things a business hears) move through six
   states as the open gaps between panes scroll by:
   0 scattered → 1 colored by source → 2 filtered into the core
   → 3 sorted into needs → 4 flowing out as work → 5 results.
   Counts are illustrative. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  var section = document.getElementById('flow');
  var cv = document.getElementById('flow-canvas');
  if (!section || !cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep in sync with the chips and lists in index.html (#flow).
  var SOURCES = [
    { c: '#2D7CF3', w: .22 }, { c: '#0E9F8E', w: .14 }, { c: '#1E3A8A', w: .2 },
    { c: '#E0674A', w: .12 }, { c: '#7C5CC4', w: .16 }, { c: '#4D8B3A', w: .16 }
  ];
  var NEEDS = [
    { name: 'Guest questions', n: 150, c: '#2D7CF3', work: 'Booking replies', result: 'Faster replies' },
    { name: 'Busy days coming', n: 104, c: '#E0674A', work: 'Staff schedules', result: 'Calmer busy days' },
    { name: 'Group and quote requests', n: 96, c: '#0E9F8E', work: 'Quotes', result: 'More quotes sent' },
    { name: 'Slow weeks coming', n: 84, c: '#7C5CC4', work: 'Marketing', result: 'Fuller slow weeks' },
    { name: 'Owner questions', n: 94, c: '#1E3A8A', work: 'Dashboards', result: 'Clear numbers' }
  ];
  var TOTAL = 640;
  var KEPT = NEEDS.reduce(function (a, t) { return a + t.n; }, 0);
  var NOISE = TOTAL - KEPT;
  var C = { ink: '#0B0F1C', soft: '#3A4152', tile: '#D9D3C7', dim: '#E6E1D6', core: '#2563C9' };
  var READOUT = [
    [TOTAL, 'things heard this week'],
    [TOTAL, 'read from 6 places'],
    [KEPT, 'kept, ' + NOISE + ' filtered out'],
    [NEEDS.length, 'clear needs'],
    [NEEDS.length, 'jobs running'],
    [NEEDS.length, 'ways the business improves']
  ];

  // Seeded random so the picture is the same on every visit.
  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  var P = [];
  NEEDS.forEach(function (t, ti) { for (var i = 0; i < t.n; i++) P.push({ need: ti }); });
  for (var i = 0; i < NOISE; i++) P.push({ need: -1 });
  P.forEach(function (p) {
    var r = rnd(), acc = 0;
    p.src = SOURCES.length - 1;
    for (var k = 0; k < SOURCES.length; k++) { acc += SOURCES[k].w; if (r < acc) { p.src = k; break; } }
    p.delay = rnd(); p.phase = rnd(); p.jy = rnd() - .5; p.jx = rnd();
  });
  var order = P.map(function (_, i) { return i; });
  for (var j = order.length - 1; j > 0; j--) {
    var m = Math.floor(rnd() * (j + 1)), tmp = order[j]; order[j] = order[m]; order[m] = tmp;
  }
  order.forEach(function (pi, k) { P[pi].gi = k; });
  P.map(function (_, i) { return i; })
    .filter(function (i) { return P[i].need >= 0; })
    .sort(function (a, b) { return P[a].gi - P[b].gi; })
    .forEach(function (pi, k) { P[pi].ci = k; });

  var W = 0, H = 0, DPR = 1, S = [], labels = [], core = { x: 0, y: 0, r: 0 };

  function layout() {
    W = cv.clientWidth; H = cv.clientHeight;
    if (!W || !H) return;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);

    var padX = W < 600 ? 10 : 24, top = 72 + 14, bottom = 64;
    var aw = W - padX * 2, ah = H - top - bottom, portrait = W < H;
    var N = P.length;

    // 0/1: grid filling the screen
    var cell = Math.sqrt(aw * ah / N), cols = Math.max(1, Math.floor(aw / cell)), rows = Math.ceil(N / cols);
    while (rows * cell > ah) { cols++; rows = Math.ceil(N / cols); }
    var cw = aw / cols, ch = Math.min(cw, ah / rows);
    var gx = padX + (aw - cols * cw) / 2, gy = top + (ah - rows * ch) / 2, ts = Math.min(cw, ch) * .74;

    // 2: core
    var mn = Math.min(aw, ah);
    core = { x: W / 2, y: top + ah * .48, r: mn * .25 };
    var cc = core.r * .86 / Math.sqrt(KEPT);

    // 3: clusters, area scaled to count
    var ctr = portrait
      ? [[.28, .16], [.74, .26], [.3, .46], [.72, .58], [.36, .8]]
      : [[.18, .26], [.5, .2], [.82, .3], [.32, .72], [.68, .74]];
    var k = mn * (portrait ? .12 : .14) / Math.sqrt(150);
    var ci = NEEDS.map(function () { return 0; });

    // 4: lanes streaming left to right
    var lanes = NEEDS.length;
    function laneY(i) { return top + ah * (.1 + i * (.8 / (lanes - 1))); }
    var laneX0 = -20, laneLen = portrait ? W + 40 : padX + aw * .76 + 20;

    // 5: bars, one per need, shortest to tallest
    var tot = NEEDS.map(function (t) { return t.n; });
    var sorted = NEEDS.map(function (_, i) { return i; }).sort(function (a, b) { return tot[a] - tot[b]; });
    var barW = aw * (portrait ? .15 : .11), barGap = (aw - barW * lanes) / (lanes + 1), maxT = Math.max.apply(null, tot);
    var bcols = Math.max(3, Math.floor(barW / (ts * .9)));
    while (Math.ceil(maxT / bcols) * barW / bcols > ah * .62) bcols++;
    var bc = barW / bcols, cnt = NEEDS.map(function () { return 0; }), base = top + ah * .9;

    for (var s = 0; s < 6; s++) S[s] = [];
    P.forEach(function (p, i) {
      var g = { x: gx + (p.gi % cols + .5) * cw, y: gy + (Math.floor(p.gi / cols) + .5) * ch };
      var srcC = SOURCES[p.src].c;
      S[0][i] = { x: g.x, y: g.y, s: ts, c: C.tile, a: 1 };
      S[1][i] = { x: g.x, y: g.y, s: ts, c: srcC, a: 1 };
      if (p.need >= 0) {
        var t = NEEDS[p.need];
        var rr = cc * Math.sqrt(p.ci + .5), an = p.ci * 2.39996;
        S[2][i] = { x: core.x + Math.cos(an) * rr, y: core.y + Math.sin(an) * rr, s: cc * 1.25, c: srcC, a: 1 };
        var jn = ci[p.need]++, r2 = k * Math.sqrt(jn + .5), a2 = jn * 2.39996;
        S[3][i] = { x: padX + aw * ctr[p.need][0] + Math.cos(a2) * r2, y: top + ah * ctr[p.need][1] + Math.sin(a2) * r2, s: k * .8, c: t.c, a: 1 };
        S[4][i] = { lane: true, x0: laneX0, len: laneLen, y: laneY(p.need) + p.jy * ah * .08, s: ts * .6, c: t.c, a: 1 };
        var pos = sorted.indexOf(p.need), b = cnt[p.need]++;
        S[5][i] = { x: padX + barGap * (pos + 1) + barW * pos + (b % bcols + .5) * bc, y: base - (Math.floor(b / bcols) + .5) * bc, s: bc * .76, c: t.c, a: 1 };
      } else {
        var gone = { x: padX + aw * p.jx, y: H + ts, s: ts * .5, c: C.dim, a: 0 };
        S[2][i] = { x: padX + aw * p.jx, y: top + ah + bottom * .35, s: ts * .4, c: C.tile, a: .7 };
        S[3][i] = gone; S[4][i] = gone; S[5][i] = gone;
      }
    });

    labels = [[], [],
      [{ t: 'GATEWAY INTELLIGENCE', x: core.x, y: core.y + core.r + 26, align: 'center', core: 1 },
       { t: NOISE + ' filtered out', x: W / 2, y: top + ah + bottom * .35 - ts - 6, align: 'center', soft: 1 }],
      NEEDS.map(function (t, ti) {
        return { t: t.name, x: padX + aw * ctr[ti][0], y: top + ah * ctr[ti][1] - k * Math.sqrt(t.n) - 12, align: 'center' };
      }),
      NEEDS.map(function (t, i) {
        return portrait
          ? { t: t.work + ' →', x: padX + aw, y: laneY(i) - ah * .05, align: 'right' }
          : { t: '→ ' + t.work, x: laneX0 + laneLen + 14, y: laneY(i) + 5, align: 'left' };
      }),
      sorted.map(function (ni, pos) {
        return { t: NEEDS[ni].result, x: padX + barGap * (pos + 1) + barW * pos + barW / 2, y: base + 20, align: 'center', small: portrait };
      })
    ];
  }

  function stream(d, t, p) {
    if (!d.lane) return d;
    var u = (p.phase + (reduce ? 0 : t * .00005 * (1 + p.delay))) % 1;
    return { x: d.x0 + u * d.len, y: d.y, s: d.s, c: d.c, a: Math.min(1, u * 10, (1 - u) * 12) };
  }

  var chapters = [].slice.call(section.querySelectorAll('.flow__chapter'));
  var prog = 0, target = 0;
  function computeTarget() {
    // Step i-1 → i plays while chapter i's open gap crosses the screen.
    var anchor = window.innerHeight * .6, p = 0;
    chapters.forEach(function (el, i) {
      if (i === 0) return;
      var gap = el.querySelector('.flow__gap');
      if (!gap) return;
      var r = gap.getBoundingClientRect();
      var f = Math.max(0, Math.min(1, (anchor - r.top) / (r.height * .75)));
      if (f > 0) p = Math.max(p, i - 1 + f);
    });
    target = p;
  }

  function hex(c) { var n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mix(a, b, t) {
    if (a === b) return a;
    var x = hex(a), y = hex(b);
    return 'rgb(' + Math.round(lerp(x[0], y[0], t)) + ',' + Math.round(lerp(x[1], y[1], t)) + ',' + Math.round(lerp(x[2], y[2], t)) + ')';
  }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  var roN = document.getElementById('flow-ro-n'), roL = document.getElementById('flow-ro-l'), lastRO = -1;
  var running = false;

  function frame(t) {
    if (!running) return;
    prog += (target - prog) * (reduce ? 1 : .1);
    if (Math.abs(target - prog) < .0005) prog = target;
    var a = Math.min(4, Math.floor(prog)), f = prog - a;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var ringA = Math.max(0, 1 - Math.abs(prog - 2) * 1.2);
    if (ringA > 0) {
      ctx.globalAlpha = ringA; ctx.strokeStyle = C.core; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(core.x, core.y, core.r * 1.02, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = ringA * .35; ctx.lineWidth = 1;
      if (ctx.setLineDash) ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(0, 72); ctx.lineTo(core.x - core.r * .72, core.y - core.r * .72);
      ctx.moveTo(W, 72); ctx.lineTo(core.x + core.r * .72, core.y - core.r * .72);
      ctx.stroke();
      if (ctx.setLineDash) ctx.setLineDash([]);
    }

    for (var i = 0; i < P.length; i++) {
      var p = P[i], A = S[a][i], B = S[Math.min(5, a + 1)][i];
      if (a === 4) A = stream(A, t, p);
      if (a + 1 === 4) B = stream(B, t, p);
      var lt = ease(Math.max(0, Math.min(1, f * 1.6 - p.delay * .6)));
      var al = lerp(A.a, B.a, lt);
      if (al < .02) continue;
      var x = lerp(A.x, B.x, lt), y = lerp(A.y, B.y, lt), s = lerp(A.s, B.s, lt);
      ctx.globalAlpha = al;
      ctx.fillStyle = lt <= 0 ? A.c : lt >= 1 ? B.c : mix(A.c, B.c, lt);
      var rad = Math.min(3, s * .22);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - s / 2, y - s / 2, s, s, rad); else ctx.rect(x - s / 2, y - s / 2, s, s);
      ctx.fill();
    }

    var near = Math.round(prog), la = 1 - Math.min(1, Math.abs(prog - near) * 3);
    ctx.globalAlpha = la; ctx.textBaseline = 'alphabetic';
    (labels[near] || []).forEach(function (L) {
      var size = L.core ? (W < 500 ? 12 : 14) : (W < 500 || L.small ? 11 : 13);
      ctx.font = (L.core ? '800 ' : '700 ') + size + 'px Inter, system-ui, sans-serif';
      ctx.fillStyle = L.core ? C.core : L.soft ? C.soft : C.ink;
      ctx.textAlign = L.align;
      ctx.fillText(L.t, L.x, L.y);
    });
    ctx.globalAlpha = 1;

    if (near !== lastRO && roN && roL) {
      lastRO = near; roN.textContent = READOUT[near][0]; roL.textContent = READOUT[near][1];
    }
    requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
  function stop() { running = false; }

  layout(); computeTarget(); prog = target;
  window.addEventListener('scroll', computeTarget, { passive: true });
  var rz;
  window.addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () { layout(); computeTarget(); }, 100);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { lastRO = -1; });

  // Only draw while the section is on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { layout(); start(); } else stop();
    }).observe(section);
  } else {
    start();
  }
})();
