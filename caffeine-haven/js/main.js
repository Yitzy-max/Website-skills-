/* =========================================================================
   The Caffeine Haven — motion layer
   - HERO mirrors the reference template: copy left, a sliding coffee-card
     carousel right, over a dark milk-pour background. Text reveals as the
     pour lands. Drop images/hero-bg.jpg to replace the canvas with a photo.
   - Lenis momentum scroll + GSAP/ScrollTrigger reveals, parallax, cup-fill.
   - Infinite coffee/pastry marquee (rAF, runs even without GSAP).
   - Image slots upgrade to real photography when the file exists.
   Nothing throws fatally: if a CDN is blocked, content shows statically.
   ========================================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  if (gsapReady) window.gsap.registerPlugin(window.ScrollTrigger);
  var CREMA = "239,228,209", CARAMEL = "201,160,102";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------- Navigation --------------------------- */
  (function nav() {
    var trigger = document.getElementById("navTrigger");
    var panel = document.getElementById("navPanel");
    if (!trigger || !panel) return;
    var scrim = document.createElement("div");
    scrim.className = "nav-scrim";
    document.body.appendChild(scrim);
    function close() { document.body.classList.remove("nav-open"); trigger.setAttribute("aria-expanded", "false"); panel.setAttribute("aria-hidden", "true"); }
    function open() { document.body.classList.add("nav-open"); trigger.setAttribute("aria-expanded", "true"); panel.setAttribute("aria-hidden", "false"); }
    trigger.addEventListener("click", function () { document.body.classList.contains("nav-open") ? close() : open(); });
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    panel.querySelectorAll("[data-navlink]").forEach(function (a) { a.addEventListener("click", close); });
  })();

  /* ------------------------- Header scrolled ------------------------ */
  (function header() {
    var el = document.getElementById("siteHeader");
    if (!el) return;
    function onScroll() { el.classList.toggle("is-scrolled", window.scrollY > 40); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* --------------------- Image slots -> real photos ----------------- */
  (function photos() {
    document.querySelectorAll("[data-img]").forEach(function (host) {
      var url = host.getAttribute("data-img");
      if (!url) return;
      var media = host.querySelector(".taste-media, .tile-media, .show-media") || host;
      var probe = new Image();
      probe.onload = function () { media.style.backgroundImage = "url('" + url + "')"; media.classList.add("has-photo"); };
      probe.src = url;
    });
  })();

  /* --------------------------- Marquee ------------------------------ */
  (function marquee() {
    var track = document.getElementById("mqA");
    if (!track) return;
    track.innerHTML = track.innerHTML + track.innerHTML;
    if (reduce) return;
    var offset = 0, speed = 0.4, half = 0;
    function measure() { half = track.scrollWidth / 2; }
    measure(); window.addEventListener("resize", measure);
    var paused = false;
    track.parentElement.addEventListener("mouseenter", function () { paused = true; });
    track.parentElement.addEventListener("mouseleave", function () { paused = false; });
    (function tick() {
      if (!paused && half > 0) { offset -= speed; if (-offset >= half) offset += half; track.style.transform = "translate3d(" + offset + "px,0,0)"; }
      requestAnimationFrame(tick);
    })();
  })();

  /* ---------------------- Hero card carousel ------------------------ */
  (function showcase() {
    var track = document.getElementById("showTrack");
    var prev = document.getElementById("showPrev");
    var next = document.getElementById("showNext");
    var dotsWrap = document.getElementById("showDots");
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children);
    var n = cards.length, idx = 0, timer = null;

    // dots
    var dots = [];
    if (dotsWrap) {
      cards.forEach(function (_, i) {
        var d = document.createElement("button");
        d.className = "show-dot" + (i === 0 ? " is-on" : "");
        d.setAttribute("aria-label", "Slide " + (i + 1));
        d.addEventListener("click", function () { go(i, true); });
        dotsWrap.appendChild(d); dots.push(d);
      });
    }
    function step() {
      // distance from one card's left edge to the next (card width + gap)
      if (n < 2) return 0;
      return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    }
    function maxIdx() {
      var win = track.parentElement.clientWidth;
      var s = step(); if (!s) return 0;
      var visible = Math.max(1, Math.round(win / s));
      return Math.max(0, n - visible);
    }
    function go(i, user) {
      idx = Math.max(0, Math.min(i, maxIdx()));
      track.style.transform = "translate3d(" + (-idx * step()) + "px,0,0)";
      dots.forEach(function (d, di) { d.classList.toggle("is-on", di === idx); });
      if (user) restart();
    }
    function nextSlide() { go(idx >= maxIdx() ? 0 : idx + 1); }
    function restart() { if (timer) clearInterval(timer); if (!reduce) timer = setInterval(nextSlide, 4200); }

    if (prev) prev.addEventListener("click", function () { go(idx - 1, true); });
    if (next) next.addEventListener("click", function () { go(idx + 1, true); });
    track.parentElement.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    track.parentElement.addEventListener("mouseleave", restart);
    window.addEventListener("resize", function () { go(Math.min(idx, maxIdx())); });
    setTimeout(function () { go(0); restart(); }, 200);
  })();

  /* ================= HERO background — milk-pour ambiance ============ */
  (function heroBg() {
    var hero = document.getElementById("hero");
    var canvas = document.getElementById("pourCanvas");
    if (!hero) return;
    var revealed = false;
    function reveal() { if (!revealed) { revealed = true; hero.classList.add("is-poured"); } }

    if (!canvas || !canvas.getContext || reduce) { setTimeout(reveal, reduce ? 60 : 360); return; }
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var px, steam = [], bokeh = [];
    function fit() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      px = W < 820 ? W * 0.5 : W * 0.72;   // pour axis (behind the cards)
      bokeh = [];
      var nb = W < 820 ? 8 : 16;
      for (var i = 0; i < nb; i++) bokeh.push({ x: Math.random() * W, y: Math.random() * H, r: 40 + Math.random() * 120, a: 0.02 + Math.random() * 0.05, sp: 0.4 + Math.random(), ph: Math.random() * 6.28 });
    }
    fit(); window.addEventListener("resize", fit);
    var start = performance.now();

    function frame(now) {
      var t = now - start;
      if (!document.hidden) {
        ctx.clearRect(0, 0, W, H);
        // warm key glow on the pour side
        var gl = ctx.createRadialGradient(px, H * 0.4, 0, px, H * 0.5, Math.max(W, H) * 0.7);
        gl.addColorStop(0, "rgba(" + CARAMEL + ",0.16)");
        gl.addColorStop(1, "rgba(" + CARAMEL + ",0)");
        ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
        // drifting bokeh (depth)
        for (var i = 0; i < bokeh.length; i++) {
          var b = bokeh[i];
          var yy = (b.y - now * 0.01 * b.sp) % (H + 240); if (yy < -120) yy += H + 240;
          var xx = b.x + Math.sin(now * 0.0004 + b.ph) * 24;
          var rg = ctx.createRadialGradient(xx, yy, 0, xx, yy, b.r);
          rg.addColorStop(0, "rgba(" + CARAMEL + "," + b.a + ")"); rg.addColorStop(1, "rgba(" + CARAMEL + ",0)");
          ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(xx, yy, b.r, 0, 6.2832); ctx.fill();
        }
        // the milk pour: a bright ribbon descending on load
        var landY = H * 0.6;
        var headP = Math.min(1, t / 620);
        if (t < 1500) {
          var topY = -30, headY = topY + (landY - topY) * (1 - Math.pow(1 - headP, 3));
          var fade = t > 1150 ? Math.max(0, 1 - (t - 1150) / 340) : 1;
          var wob = Math.sin(t / 80) * 3, w = Math.max(4, W * 0.012);
          var grad = ctx.createLinearGradient(0, topY, 0, headY);
          grad.addColorStop(0, "rgba(" + CREMA + ",0)"); grad.addColorStop(0.3, "rgba(" + CREMA + "," + (0.55 * fade) + ")"); grad.addColorStop(1, "rgba(255,250,242," + (0.85 * fade) + ")");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(px - w, topY);
          ctx.bezierCurveTo(px - w + wob, (topY + headY) / 2, px - w * 0.5 + wob, headY - w, px, headY);
          ctx.bezierCurveTo(px + w * 0.5 + wob, headY - w, px + w + wob, (topY + headY) / 2, px + w, topY);
          ctx.closePath(); ctx.fill();
          // splash bloom where it lands
          if (headP >= 1) {
            var bloom = Math.min(1, (t - 620) / 700);
            var br = bloom * W * 0.10;
            var bg = ctx.createRadialGradient(px, landY, 0, px, landY, br + 4);
            bg.addColorStop(0, "rgba(" + CREMA + "," + (0.4 * (1 - bloom) * fade) + ")"); bg.addColorStop(1, "rgba(" + CREMA + ",0)");
            ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(px, landY, br + 4, 0, 6.2832); ctx.fill();
          }
        }
        // steam wisps rising near the pour axis
        if (t > 500 && Math.random() < 0.05 && steam.length < 22) steam.push({ born: now, x: px + (Math.random() - 0.5) * W * 0.12, life: 3000 + Math.random() * 1800, sway: Math.random() * 6.28 });
        for (var s = steam.length - 1; s >= 0; s--) {
          var p = steam[s], age = (now - p.born) / p.life; if (age > 1) { steam.splice(s, 1); continue; }
          var y = landY - age * H * 0.5, x = p.x + Math.sin(age * 6 + p.sway) * 20, a = Math.sin(age * Math.PI) * 0.09, rad = 12 + age * 40;
          var sg = ctx.createRadialGradient(x, y, 0, x, y, rad);
          sg.addColorStop(0, "rgba(" + CREMA + "," + a + ")"); sg.addColorStop(1, "rgba(" + CREMA + ",0)");
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
        }
      }
      if (!revealed && t > 560) reveal();   // text lands with the pour
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ================= Scroll system — Lenis + GSAP ==================== */
  function showAllStatic() {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
    document.querySelectorAll("[data-reveal-line]").forEach(function (el) { el.style.transform = "none"; });
    var fill = document.getElementById("cupFill");
    if (fill) fill.style.height = "62%";
    document.querySelectorAll(".pour-note").forEach(function (nn) { nn.classList.add("is-on"); });
  }
  if (!gsapReady) { showAllStatic(); console.warn("[Caffeine Haven] GSAP unavailable — content shown statically."); return; }

  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (!reduce && window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%" } });
  });
  gsap.utils.toArray("[data-reveal-line]").forEach(function (el, i) {
    gsap.fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out", delay: i * 0.08, scrollTrigger: { trigger: el.closest("h2") || el, start: "top 82%" } });
  });
  var storyLead = document.querySelector(".story-lead");
  if (storyLead) gsap.to(storyLead, { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".story", scrub: true, start: "top bottom", end: "bottom top" } });
  gsap.utils.toArray(".tile-media").forEach(function (m) {
    gsap.fromTo(m, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: m.closest(".tile"), scrub: true, start: "top bottom", end: "bottom top" } });
  });

  (function pourScrub() {
    var scrub = document.getElementById("pourScrub");
    var fill = document.getElementById("cupFill");
    var foam = document.getElementById("cupFoam");
    var notes = gsap.utils.toArray(".pour-note");
    if (!scrub || !fill) return;
    ST.create({
      trigger: ".pour", start: "top top", end: "bottom bottom", scrub: 0.6,
      onUpdate: function (self) {
        var p = self.progress, h = Math.min(1, p * 1.15);
        fill.style.height = (h * 92) + "%";
        if (foam) { foam.style.bottom = (h * 92) + "%"; foam.style.opacity = h > 0.04 && h < 0.99 ? "1" : "0"; }
        notes.forEach(function (nn, i) { nn.classList.toggle("is-on", p >= 0.28 + i * 0.22); });
      }
    });
  })();

  window.addEventListener("load", function () { ST.refresh(); });
})();
