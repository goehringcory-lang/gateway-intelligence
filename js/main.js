/* ============================================================
   Gateway Intelligence — interactions
   Vanilla, no dependencies. Every motion behavior is gated on
   prefers-reduced-motion, and every enhancement degrades to
   readable static content if it can't run.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------------------- 1. Sticky nav state ---------------------- */
  var nav = document.getElementById('nav');
  var sentinel = document.getElementById('top-sentinel');

  if (nav && sentinel && hasIO) {
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }, { rootMargin: '-24px 0px 0px 0px' }).observe(sentinel);
  } else if (nav) {
    nav.classList.add('is-scrolled');
  }

  /* ------------------------ 2. Mobile menu ------------------------ */
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      menu.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* --------------------- 3. Scroll reveals --------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (!hasIO || reduceMotion) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealables, function (el) { revealObserver.observe(el); });

    // Safety net: content must never stay invisible. If the observer has not
    // revealed anything shortly after load, show everything in view.
    window.addEventListener('load', function () {
      setTimeout(function () {
        if (document.querySelector('.reveal.is-visible')) return;
        Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-visible'); });
      }, 1200);
    });
  }

  /* --------------------- 4. Count-up counters ---------------------
     Final values already live in the HTML (SEO / no-JS safe); we
     only zero them out once we know the animation can run. */
  var counters = document.querySelectorAll('[data-count-to]');

  function formatValue(el, value) {
    var text = el.dataset.format === 'comma'
      ? Math.round(value).toLocaleString('en-US')
      : String(Math.round(value));
    return (el.dataset.prefix || '') + text + (el.dataset.suffix || '');
  }

  function countUp(el) {
    var target = parseFloat(el.dataset.countTo);
    if (isNaN(target)) return;

    var duration = 1200;
    var start = null;
    el.textContent = formatValue(el, 0);

    function frame(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = formatValue(el, target * eased);
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if (hasIO && !reduceMotion && counters.length) {
    // Reserve width from the final rendered string so counting can't reflow the
    // grid. The real value stays in the DOM until the animation actually starts,
    // so a counter that never animates still shows its number rather than zero.
    Array.prototype.forEach.call(counters, function (el) {
      el.style.minWidth = el.textContent.trim().length + 'ch';
    });

    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    Array.prototype.forEach.call(counters, function (el) { counterObserver.observe(el); });
  }

  /* ------------------------ 5. FAQ accordion ------------------------ */
  var triggers = document.querySelectorAll('.accordion__trigger');

  Array.prototype.forEach.call(triggers, function (trigger) {
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // single-open behaviour: close everything first
      Array.prototype.forEach.call(triggers, function (other) {
        other.setAttribute('aria-expanded', 'false');
        var item = other.closest('.accordion__item');
        if (item) item.classList.remove('is-open');
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        var openItem = trigger.closest('.accordion__item');
        if (openItem) openItem.classList.add('is-open');
      }
    });
  });

  /* --------------------- 6. Hero parallax orbs --------------------- */
  var orbs = document.querySelectorAll('[data-parallax]');

  if (orbs.length && !reduceMotion && window.innerWidth >= 768) {
    var ticking = false;

    var applyParallax = function () {
      var y = window.pageYOffset;
      Array.prototype.forEach.call(orbs, function (orb) {
        var rate = parseFloat(orb.dataset.parallax) || 0;
        orb.style.transform = 'translate3d(0,' + (y * rate).toFixed(1) + 'px,0)';
      });
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyParallax);
    }, { passive: true });
  }
})();
