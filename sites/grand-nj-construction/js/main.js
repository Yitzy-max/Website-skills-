/* ═══════════════════════════════════════════════════════════════════════
   GRAND NJ CONSTRUCTION — motion

   Rules this file obeys, in order of importance:

   1. The page is fully readable with this file deleted. Reveal states live
      behind a `.js` class that is added ONLY after GSAP has actually
      loaded — so a blocked CDN leaves everything visible rather than
      stranding content at opacity:0.
   2. Motion is scroll-LINKED (scrub), not entrance-triggered. Scroll
      position drives it and it rewinds on the way back up.
   3. Mobile motion budget is ~zero. Below 900px nothing is fetched at all:
      no GSAP, no Lenis, no video.
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

  if (reduced || !big || thrifty) return;   // static page, and that's fine

  /* ── hero video ──────────────────────────────────────────────────────
     Progressive enhancement only. Missing file or decode error just
     leaves the poster still in place. */
  var vid = document.querySelector('.hero__video');
  if (vid) {
    vid.addEventListener('error', function () { vid.remove(); }, { once: true });
    vid.addEventListener('canplay', function () {
      vid.classList.add('is-on');
      var p = vid.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused — poster stands */ });
    }, { once: true });
    vid.preload = 'auto';
    vid.src = 'videos/van-arrival.mp4';
  }

  /* ── magnetic primary button ─────────────────────────────────────────
     Pointer-precision devices only. Transform-only, so it never triggers
     layout. */
  if (fine) {
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

  Promise.all([
    load(CDN + 'gsap/3.12.5/gsap.min.js'),
    load(CDN + 'gsap/3.12.5/ScrollTrigger.min.js')
  ]).then(function (ok) {
    if (!ok[0] || !ok[1] || !window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    // Only now is it safe to hide things — GSAP is here to bring them back.
    doc.classList.add('js');

    /* ── momentum scroll, desktop only ─────────────────────────────── */
    load('https://cdnjs.cloudflare.com/ajax/libs/lenis/1.1.13/lenis.min.js').then(function (okL) {
      var L = window.Lenis || (window.lenis && window.lenis.Lenis);
      if (!okL || !L) return;
      var lenis = new L({ duration: 1.05, smoothWheel: true });
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    });

    /* ── THE SIGNATURE: scrub-linked hero ───────────────────────────
       Media and headline travel at different rates as you scroll, and
       the sky lifts. Driven by scroll position, reverses on scroll-up. */
    var media = document.querySelector('.hero__media');
    var body  = document.querySelector('.hero__body');

    if (media && body) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })
      .to(media, { y: '18%', scale: 1.08, ease: 'none' }, 0)
      .to(body,  { y: '-12%', opacity: .25, ease: 'none' }, 0);
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
