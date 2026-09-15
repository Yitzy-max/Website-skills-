/* ═══════════════════════════════════════════════════════════════════════
   GRAND NJ CONSTRUCTION — motion

   Rules this file obeys, in order of importance:

   1. The page is fully readable with this file deleted. Reveal states live
      behind a `.js` class that is added ONLY after GSAP has actually
      loaded — so a blocked CDN leaves everything visible rather than
      stranding content at opacity:0.
   2. Motion is scroll-LINKED (scrub), not entrance-triggered. Scroll
      position drives it and it rewinds on the way back up.
   3. The scroll-driven hero runs on phones too, with a 747 KB video instead
      of 2 MB and the call buttons never hidden. Lenis and the magnetic
      button stay desktop-only.
   4. prefers-reduced-motion and Save-Data both opt out completely.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var doc = document.documentElement;

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var big     = window.matchMedia('(min-width: 900px)').matches;
  var fine    = window.matchMedia('(pointer: fine)').matches;
  var thrifty = (navigator.connection && navigator.connection.saveData) === true;

  // Reduced motion and Save-Data opt out completely. Small screens do NOT:
  // the scroll-driven hero is the centrepiece and it is built to run there,
  // just with a smaller video and less text movement.
  if (reduced || thrifty) return;   // static page, and that's fine

  /* ── hero video ──────────────────────────────────────────────────────
     Never plays on its own. Scroll sets currentTime; see the ScrollTrigger
     below. A missing file or a decode failure just leaves the poster. */
  var vid = document.querySelector('.hero__video');
  var still = document.querySelector('.hero__still');
  var vidReady = false;

  if (vid) {
    vid.addEventListener('error', function () { vid.remove(); vid = null; }, { once: true });
    vid.addEventListener('loadeddata', function () {
      vidReady = true;
      vid.classList.add('is-on');
      // Priming: iOS will not decode or seek a video that has never been
      // told to play. play() then immediate pause() unlocks seeking without
      // the video ever actually running.
      var pr = vid.play();
      if (pr && pr.then) pr.then(function () { vid.pause(); }).catch(function () {});
      else { try { vid.pause(); } catch (e) {} }
      try { vid.currentTime = 0; } catch (e) {}
    }, { once: true });

    // Deferred: the poster is already on screen and carries the hero, so the
    // video must not compete with first paint. On a phone this keeps the
    // initial view around 190 KB instead of 930 KB.
    var started = false;
    function startVideo() {
      if (started || !vid) return;
      started = true;
      vid.preload = 'auto';
      vid.src = big ? 'videos/hero-desk.mp4' : 'videos/hero-mob.mp4';
      vid.load();
    }
    if (document.readyState === 'complete') setTimeout(startVideo, 120);
    else window.addEventListener('load', function () { setTimeout(startVideo, 120); }, { once: true });
    // whichever comes first — a visitor who scrolls immediately gets it now
    window.addEventListener('scroll', startVideo, { once: true, passive: true });
  }

  /* Seeking is throttled through rAF. Writing currentTime on every scroll
     event floods the decoder and the picture stalls; one seek per frame,
     only when the target actually moved, stays smooth. */
  var wantTime = 0, haveTime = -1;
  function pumpSeek() {
    if (vid && vidReady && Math.abs(wantTime - haveTime) > 0.008) {
      haveTime = wantTime;
      try {
        if (vid.fastSeek) vid.fastSeek(wantTime);
        else vid.currentTime = wantTime;
      } catch (e) {}
    }
    requestAnimationFrame(pumpSeek);
  }
  requestAnimationFrame(pumpSeek);

  /* ── magnetic primary button ─────────────────────────────────────────
     Pointer-precision devices only. Transform-only, so it never triggers
     layout. */
  if (fine && big) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-magnetic]'), function (el) {
      var raf = 0;
      function move(e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = el.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
          var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
          el.style.transform = 'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px)';
        });
      }
      function reset() { el.style.transform = ''; }
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', reset);
      el.addEventListener('blur', reset);
    });
  }

  /* ── script loader ───────────────────────────────────────────────────
     Resolves false instead of rejecting, so one dead CDN degrades the
     page rather than breaking it. */
  function load(src) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload  = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }

  var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';

  // CDN first (likely already cached for the visitor), vendored copy second.
  // The hero is the whole point of this page, so it must not hinge on a
  // third-party host being reachable.
  function loadWithFallback(cdnUrl, localUrl, globalName) {
    return load(cdnUrl).then(function (ok) {
      if (ok && window[globalName]) return true;
      return load(localUrl);
    });
  }

  loadWithFallback(CDN + 'gsap/3.12.5/gsap.min.js', 'js/vendor/gsap.min.js', 'gsap')
    .then(function () {
      return loadWithFallback(CDN + 'gsap/3.12.5/ScrollTrigger.min.js', 'js/vendor/ScrollTrigger.min.js', 'ScrollTrigger');
    })
    .then(function () {
    if (!window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    // Only now is it safe to hide things — GSAP is here to bring them back.
    doc.classList.add('js');

    /* ── momentum scroll, desktop only ─────────────────────────────── */
    if (big) loadWithFallback(CDN + 'lenis/1.1.13/lenis.min.js', 'js/vendor/lenis.min.js', 'Lenis').then(function () {
      var L = window.Lenis || (window.lenis && window.lenis.Lenis);
      if (!L) return;
      var lenis = new L({ duration: 1.05, smoothWheel: true });
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    });

    /* ── THE SIGNATURE: the visitor drives the van ───────────────────
       Scroll position maps straight onto video.currentTime. The van moves
       exactly as fast as they scroll and reverses when they scroll back.
       Text slides in against it, staggered across the same scroll. */
    var heroEl = document.querySelector('.hero');

    if (heroEl) {
      window.ScrollTrigger.create({
        trigger: heroEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: function (self) {
          if (!vid || !vidReady) return;
          var d = vid.duration;
          if (!d || !isFinite(d)) return;
          // last frame held slightly short of the end: seeking exactly to
          // duration can bounce back to 0 in some browsers
          wantTime = Math.min(self.progress * d, d - 0.05);
        }
      });

      // Text staging. Step 0 (eyebrow + headline) is never animated — it is
      // the LCP text. Steps 1-3 slide in over the first two thirds.
      var steps = [
        { sel: '[data-hero="1"]', a: 0.06, b: 0.26 },
        { sel: '[data-hero="2"]', a: 0.20, b: 0.44 },
        { sel: '[data-hero="3"]', a: 0.36, b: 0.58 }
      ];
      steps.forEach(function (st) {
        var el = heroEl.querySelector(st.sel);
        if (!el) return;
        // buttons stay put on small screens — the call must never be hidden
        if (st.sel === '[data-hero="2"]' && !big) return;
        // ScrollTrigger alone, no tween: a tween would fight the gsap.set
        // below and the element would flicker between two owners.
        window.ScrollTrigger.create({
          trigger: heroEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: function (self) {
            var t = (self.progress - st.a) / (st.b - st.a);
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            gsap.set(el, { opacity: t, y: 26 * (1 - t) });
          }
        });
      });
    }

    /* ── coursing rows: staggered, scrubbed ─────────────────────────── */
    gsap.utils.toArray('[data-course]').forEach(function (row) {
      gsap.to(row, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 62%', scrub: true }
      });
    });

    /* ── process steps ──────────────────────────────────────────────── */
    gsap.utils.toArray('[data-step]').forEach(function (step) {
      gsap.to(step, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: step, start: 'top 94%', end: 'top 68%', scrub: true }
      });
    });

    /* ── gallery parallax at differing rates ────────────────────────── */
    gsap.utils.toArray('.shot').forEach(function (fig) {
      var rate = parseFloat(fig.getAttribute('data-par')) || 0.12;
      gsap.fromTo(fig,
        { y: rate * 90 },
        {
          y: -rate * 90, ease: 'none',
          scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
        }
      );
    });

    window.ScrollTrigger.refresh();
  });
})();
