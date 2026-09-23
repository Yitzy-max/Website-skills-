/* ═══════════════════════════════════════════════════════════════════════
   REVIEWS — paste the real ones here and the section appears.

   Every entry must come off the Google listing verbatim. Empty array means
   the section stays hidden, which is the correct state until it holds real
   reviews: a contractor's testimonials are the first thing a customer can
   fact-check, and the easiest thing to get caught inventing.

     text   the review, word for word
     name   the reviewer as Google shows them
     stars  1-5

   SCORE is the headline figure — overall rating and how many reviews it is
   drawn from. Leave count at 0 to hide it.
   ═══════════════════════════════════════════════════════════════════════ */

var REVIEWS = [
  { text: "Tony is a great guy and his crew did excellent work repairing some damaged sections of my gutters and re-flashing one of my windows. Highly recommend!!!",
    name: "David Stearns", stars: 5 },

  { text: "I hired Grand NJ construction to replace my chimney. They did a great job on it im so happy with the results. Thank you Tony from Grand NJ construction. Definitely will use you guys again on other projects",
    name: "Lifetime Quality Construction", stars: 5 },

  { text: "Tony and his team did a great job. They fixed pavers in the front of the house, cleaned gutters, install gutter guards, and water proofed basement from the front outside. Would definitely work with Tony and team again.",
    name: "Jeet Patel", stars: 5 },

  { text: "Tony and his team were the best! We had our front stairs and foundation redone. They came in at a fair price and came everyday until the job was finished! Highly recommend for any masonry work or more.",
    name: "Kevin Ginty", stars: 5 },

  { text: "Great experience from start to finish! I needed urgent front steps repair in North Bergen, and they came out the next day. They fixed cracks, repointed the bricks, and now the steps look brand new. Reliable, affordable, and professional masonry services!",
    name: "Gonzalo Saloj", stars: 5 },

  { text: "I had the great pleasure meeting Tony from Grand NJ construction. They transform the front of my house with my new steps. Definitely will recommend them to my family members and my neighbors.",
    name: "William Delgado", stars: 5 },

  { text: "What a great pleasure working with Tony from Grand NJ construction llc. They did an amazing job on my front steps and great value of price thank you so much",
    name: "Benard Myrta", stars: 5 },

  { text: "Beautiful work! Professional, courteous, and timely. Tony is amazing; thank you!",
    name: "Yashika Watkins", stars: 5 }
];

// Overall rating and total review count, both still NEEDED from the listing.
// count: 0 keeps the headline figure hidden rather than guessing at it.
var SCORE = { rating: null, count: 0 };

(function () {
  'use strict';
  var sec = document.querySelector('.sec--says');
  if (!sec || !REVIEWS.length) return;   // nothing real to show yet

  var track = sec.querySelector('[data-track]');
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z"/></svg>';

  function card(r) {
    var n = Math.max(1, Math.min(5, r.stars | 0));
    var el = document.createElement('figure');
    el.className = 'say';
    var stars = document.createElement('div');
    stars.className = 'say__stars';
    stars.innerHTML = new Array(n + 1).join(STAR) +
      '<span class="vh">' + n + ' out of 5 stars</span>';
    var q = document.createElement('blockquote');
    q.className = 'say__text';
    q.textContent = '\u201C' + r.text + '\u201D';     // textContent, never innerHTML
    var who = document.createElement('figcaption');
    who.className = 'say__who';
    who.textContent = r.name;
    el.appendChild(stars); el.appendChild(q); el.appendChild(who);
    return el;
  }

  // two passes of the same list; the track slides exactly -50% so the
  // second pass arrives where the first started and the loop is seamless
  for (var pass = 0; pass < 2; pass++) {
    for (var i = 0; i < REVIEWS.length; i++) {
      var c = card(REVIEWS[i]);
      if (pass === 1) c.setAttribute('aria-hidden', 'true');   // duplicate
      track.appendChild(c);
    }
  }

  // hold a steady speed regardless of how many reviews there are
  sec.querySelector('.marquee').style.setProperty('--dur', (REVIEWS.length * 6) + 's');

  if (SCORE.count > 0 && SCORE.rating) {
    var sc = sec.querySelector('[data-score]');
    sc.innerHTML = '<b>' + SCORE.rating + '</b> on Google · ' + SCORE.count + ' reviews';
    sc.hidden = false;
  }

  sec.hidden = false;
})();

/* ═══════════════════════════════════════════════════════════════════════
   FORMS — the contact form and the footer newsletter

   Each form's endpoint lives in its own action="" in index.html, and both
   are EMPTY on purpose: there is no inbox, form service or mailing list on
   file for Grand NJ yet, and a form that pretends to send is worse than no
   form — a customer types out a leak, hits send, sees a tick, and nobody
   ever calls them back.

   While action is empty the button still works, but it says plainly that
   the form is not connected and points at the phone number, which is real.

   Fill action= in index.html with anything that accepts a POST of form
   fields — Formspree, Netlify Forms, a Zapier catch hook, a Mailchimp
   embed URL — and this file starts posting to it. Keeping it in the
   attribute rather than here means each form also submits the ordinary way
   if JavaScript never loads.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var TEL = '<a href="tel:+15512225512">551-222-5512</a>';

  function wire(form, note, copy) {
    if (!form || !note) return;

    var btn = form.querySelector('button[type="submit"]');
    var endpoint = (form.getAttribute('action') || '').trim();

    function say(html) {
      note.innerHTML = html;
      note.hidden = false;
      /* the notice sits below the button, which on a phone can put it under
         the sticky call dock — scroll it up or nobody sees the answer */
      note.scrollIntoView({ block: 'center', behavior: 'auto' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* let the browser's own validation speak first — it is better at this
         than anything hand-rolled and it is already translated */
      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (!endpoint) { say(copy.off); return; }

      var label = btn.innerHTML;
      btn.disabled = true;

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        say(copy.ok);
      }).catch(function () {
        say(copy.bad);
      }).then(function () {
        btn.disabled = false;
        btn.innerHTML = label;
      });
    });
  }

  wire(
    document.querySelector('[data-form]'),
    document.querySelector('[data-form-note]'),
    {
      off: 'This form isn\'t hooked up to an inbox yet, so nothing was sent. ' +
           'Call ' + TEL + ' and we\'ll pick up.',
      ok:  'Got it — we\'ll be in touch. If it\'s urgent, call ' + TEL + '.',
      bad: 'That didn\'t go through. Call ' + TEL + ' and we\'ll take it over the phone.'
    }
  );

  wire(
    document.querySelector('[data-news]'),
    document.querySelector('[data-news-note]'),
    {
      off: 'The mailing list isn\'t set up yet, so this didn\'t go anywhere. ' +
           'Call ' + TEL + ' if you need something now.',
      ok:  'You\'re on the list. A few emails a year, nothing else.',
      bad: 'That didn\'t go through — try again in a minute.'
    }
  );
})();

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

    /* ── the hero, staged against the scroll ─────────────────────────
       The van video this replaces was scrubbed frame by frame. The plate is
       static, so the scroll now drives the TYPE instead: each block arrives
       on its own slice of the hero's scroll, and rewinds on the way back
       up. Same idea, one HTTP request instead of two megabytes. */
    var heroEl = document.querySelector('.hero');

    if (heroEl) {

      // Text staging. Step 0 (eyebrow + headline) is never animated — it is
      // the LCP text. Steps 1-3 slide in over the first two thirds.
      // Kept early on purpose: a landing page that shows no call button for
      // half the hero is trading conversions for an effect. The slide-in is
      // still visible, it just resolves in the first third.
      var steps = [
        { sel: '[data-hero="1"]', a: 0.03, b: 0.15 },
        { sel: '[data-hero="2"]', a: 0.09, b: 0.23 },
        { sel: '[data-hero="3"]', a: 0.17, b: 0.31 },
        { sel: '[data-hero="4"]', a: 0.24, b: 0.40 }
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

    /* ── the hero counters ──────────────────────────────────────────
       Scroll-LINKED like everything else here, not a fire-once timer: the
       number tracks scroll position, so it runs back down when you scroll
       up, and it can never be mid-count on a screen nobody is looking at.

       The finished figures are already in the HTML. This only overwrites
       them while the hero is on screen, and puts them back at the end, so
       a blocked script leaves the real numbers showing. */
    var counters = gsap.utils.toArray('[data-count]');
    if (counters.length && heroEl) {
      var COUNT_A = 0.26, COUNT_B = 0.46;
      var targets = counters.map(function (el) {
        return parseInt(el.getAttribute('data-count'), 10) || 0;
      });
      // zero them now. Otherwise the finished figures sit on screen until
      // the first scroll event fires onUpdate, and then snap back to 0 —
      // the one frame that gives the whole effect away.
      counters.forEach(function (el) { el.textContent = '0'; });

      window.ScrollTrigger.create({
        trigger: heroEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: function (self) {
          var t = (self.progress - COUNT_A) / (COUNT_B - COUNT_A);
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          // ease out, so it sprints then settles on the final figure
          var e = 1 - Math.pow(1 - t, 3);
          for (var i = 0; i < counters.length; i++) {
            var v = Math.round(targets[i] * e);
            if (counters[i].textContent !== String(v)) {
              counters[i].textContent = v;
            }
          }
        }
      });
    }

    /* ── coursing rows: staggered, scrubbed ─────────────────────────── */
    gsap.utils.toArray('[data-course]').forEach(function (row) {
      gsap.to(row, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 62%', scrub: true }
      });
    });

    /* ── process cards pop in ───────────────────────────────────────
       Still scroll-LINKED rather than a fire-once entrance: scrub drives it,
       so it runs backwards when you scroll up. The pop comes from the scale
       curve — 0.86 up through a 1.03 overshoot and back to 1 — rather than
       from a canned easing on a timer. */
    // The pop is applied to the ITEM, not to .paper. .paper already carries
    // the component's rotate() plus its hover transform in CSS, and an inline
    // transform from GSAP would replace both outright. Two elements, two
    // transforms, they compose.
    gsap.utils.toArray('[data-step]').forEach(function (step) {
      window.ScrollTrigger.create({
        trigger: step,
        start: 'top 92%',
        end: 'top 58%',
        scrub: true,
        onUpdate: function (self) {
          var t = self.progress;
          // overshoot: peaks at 1.03 around 70% through, settles at 1
          var scale = t < 0.7
            ? 0.86 + (1.03 - 0.86) * (t / 0.7)
            : 1.03 - 0.03 * ((t - 0.7) / 0.3);
          gsap.set(step, {
            opacity: Math.min(1, t * 2.2),
            scale: scale,
            y: (1 - t) * 18
          });
        }
      });
    });

    /* ── stacking cards ─────────────────────────────────────────────
       Port of Khoa Phan's StackingCards (21st.dev). The original is React +
       motion/react; this reproduces its maths on GSAP so the page keeps its
       no-framework build.

         scaleTo_i = 1 - (total - i) * SCALE_STEP
         scale_i   = lerp(1 -> scaleTo_i) across [i / total, 1] of progress

       Each slot is sticky, so a card holds at the top while the next rides
       over it; the one underneath shrinks, which is what reads as a stack. */
    var stackEl = document.querySelector('[data-stack]');
    if (stackEl) {
      var lifts = gsap.utils.toArray('[data-card]', stackEl);
      var total = lifts.length;
      var SCALE_STEP = 0.03;

      lifts.forEach(function (lift, i) {
        // the fan offset itself lives in CSS so it can differ per
        // breakpoint; all this has to say is which card this is
        lift.style.setProperty('--i', i);
      });

      window.ScrollTrigger.create({
        trigger: stackEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: function (self) {
          var pr = self.progress;
          for (var i = 0; i < total; i++) {
            var from = i / total;
            var scaleTo = 1 - (total - i) * SCALE_STEP;
            var t = pr <= from ? 0 : (pr - from) / (1 - from);
            if (t > 1) t = 1;
            gsap.set(lifts[i], { scale: 1 + (scaleTo - 1) * t });
          }
        }
      });
    }

    window.ScrollTrigger.refresh();
  });
})();
