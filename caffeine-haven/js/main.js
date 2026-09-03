/* =========================================================================
   The Caffeine Haven — motion layer
   - Milk-pour hero (canvas 2D) that reveals the headline as the milk lands
   - Lenis momentum scroll + GSAP/ScrollTrigger reveals, parallax, cup-fill
   - Infinite coffee/pastry marquee (rAF, runs even if GSAP is unavailable)
   - Every image slot upgrades to real photography when the file exists,
     otherwise a procedural fallback keeps the page looking finished.
   Nothing here throws fatally: if a CDN is blocked, content shows statically.
   ========================================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  if (gsapReady) window.gsap.registerPlugin(window.ScrollTrigger);

  /* ---------------------------------------------------------------------
     0. Year
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     1. Navigation — left dropdown
     --------------------------------------------------------------------- */
  (function nav() {
    var trigger = document.getElementById("navTrigger");
    var panel = document.getElementById("navPanel");
    if (!trigger || !panel) return;

    var scrim = document.createElement("div");
    scrim.className = "nav-scrim";
    document.body.appendChild(scrim);

    function open() {
      document.body.classList.add("nav-open");
      trigger.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
    }
    function close() {
      document.body.classList.remove("nav-open");
      trigger.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    }
    function toggle() {
      document.body.classList.contains("nav-open") ? close() : open();
    }
    trigger.addEventListener("click", toggle);
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    panel.querySelectorAll("[data-navlink]").forEach(function (a) {
      a.addEventListener("click", close);
    });
  })();

  /* ---------------------------------------------------------------------
     2. Header scrolled state
     --------------------------------------------------------------------- */
  (function header() {
    var el = document.getElementById("siteHeader");
    if (!el) return;
    function onScroll() {
      el.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ---------------------------------------------------------------------
     3. Image slots — upgrade to real photos when present
     --------------------------------------------------------------------- */
  (function photos() {
    document.querySelectorAll("[data-img]").forEach(function (host) {
      var url = host.getAttribute("data-img");
      var media = host.querySelector(".taste-media, .tile-media");
      if (!url || !media) return;
      var probe = new Image();
      probe.onload = function () {
        media.style.backgroundImage = "url('" + url + "')";
        media.classList.add("has-photo");
      };
      probe.onerror = function () { /* keep procedural fallback */ };
      probe.src = url;
    });
  })();

  /* ---------------------------------------------------------------------
     4. Infinite marquee (independent of GSAP)
     --------------------------------------------------------------------- */
  (function marquee() {
    var track = document.getElementById("mqA");
    if (!track) return;
    // duplicate items so the strip can loop seamlessly
    var original = track.innerHTML;
    track.innerHTML = original + original;
    if (reduce) return;

    var offset = 0;
    var speed = 0.4; // px per frame
    var half = 0;
    function measure() { half = track.scrollWidth / 2; }
    measure();
    window.addEventListener("resize", measure);

    var paused = false;
    track.parentElement.addEventListener("mouseenter", function () { paused = true; });
    track.parentElement.addEventListener("mouseleave", function () { paused = false; });

    function tick() {
      if (!paused && half > 0) {
        offset -= speed;
        if (-offset >= half) offset += half;
        track.style.transform = "translate3d(" + offset + "px,0,0)";
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  /* ---------------------------------------------------------------------
     5. Milk-pour hero (canvas 2D)
     Reveals the headline (hero.is-poured) as the milk lands (~850ms).
     --------------------------------------------------------------------- */
  (function pourHero() {
    var hero = document.getElementById("hero");
    var canvas = document.getElementById("pourCanvas");
    if (!hero) return;

    // Safety net: reveal the headline no matter what, shortly after load.
    var revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      hero.classList.add("is-poured");
    }

    if (!canvas || !canvas.getContext || reduce) {
      // No canvas / reduced motion — reveal immediately, skip animation.
      setTimeout(reveal, reduce ? 60 : 400);
      return;
    }

    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cx, cy, R;

    function fit() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H * 0.48;
      R = Math.min(W, H) * (W < 640 ? 0.34 : 0.24);
    }
    fit();
    window.addEventListener("resize", fit);

    var CREMA = "239,228,209";
    var CARAMEL = "201,160,102";
    var start = performance.now();
    var rings = [];   // cream ripples
    var steam = [];   // rising wisps

    function spawnRing(t) { rings.push({ born: t, r0: R * 0.08 }); }

    function drawBackground() {
      var g = ctx.createRadialGradient(cx, cy - R * 0.3, R * 0.1, cx, cy, Math.max(W, H) * 0.75);
      g.addColorStop(0, "#1d1510");
      g.addColorStop(0.55, "#140e0a");
      g.addColorStop(1, "#0c0806");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // warm glow behind cup
      var gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.2);
      gl.addColorStop(0, "rgba(" + CARAMEL + ",0.10)");
      gl.addColorStop(1, "rgba(" + CARAMEL + ",0)");
      ctx.fillStyle = gl;
      ctx.fillRect(0, 0, W, H);
    }

    function drawCupDisc() {
      // rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2);
      ctx.fillStyle = "#0e0a07";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(" + CREMA + ",0.10)";
      ctx.stroke();
      ctx.restore();
      // crema surface
      var g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.1, cx, cy, R);
      g.addColorStop(0, "#5b3a20");
      g.addColorStop(0.5, "#3f2814");
      g.addColorStop(1, "#28180d");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    function withDiscClip(fn) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      fn();
      ctx.restore();
    }

    function drawStream(elapsed) {
      // stream active 120ms..1250ms
      var s = (elapsed - 120) / 380;        // head descent progress
      if (elapsed < 120) return;
      var headP = Math.min(1, s);
      var impactY = cy - R * 0.15;
      var topY = -20;
      var headY = topY + (impactY - topY) * ease(headP);
      var fade = elapsed > 1100 ? Math.max(0, 1 - (elapsed - 1100) / 260) : 1;
      if (fade <= 0) return;
      var wob = Math.sin(elapsed / 90) * 3;
      var w = R * 0.06;
      ctx.save();
      ctx.globalAlpha = fade;
      var grad = ctx.createLinearGradient(0, topY, 0, headY);
      grad.addColorStop(0, "rgba(" + CREMA + ",0.0)");
      grad.addColorStop(0.2, "rgba(" + CREMA + ",0.85)");
      grad.addColorStop(1, "rgba(" + CREMA + ",0.95)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx - w, topY);
      ctx.bezierCurveTo(cx - w + wob, (topY + headY) / 2, cx - w * 0.6 + wob, headY, cx, headY + w);
      ctx.bezierCurveTo(cx + w * 0.6 + wob, headY, cx + w + wob, (topY + headY) / 2, cx + w, topY);
      ctx.closePath();
      ctx.fill();
      // bright core
      ctx.fillStyle = "rgba(255,250,240,0.6)";
      ctx.fillRect(cx - w * 0.28, topY, w * 0.56, headY - topY);
      ctx.restore();
    }

    function drawRings(t) {
      withDiscClip(function () {
        for (var i = rings.length - 1; i >= 0; i--) {
          var age = (t - rings[i].born) / 1400;
          if (age > 1) { rings.splice(i, 1); continue; }
          var r = rings[i].r0 + age * R * 1.15;
          var a = (1 - age) * 0.5;
          ctx.beginPath();
          ctx.arc(cx, cy - R * 0.15, r, 0, Math.PI * 2);
          ctx.lineWidth = R * 0.05 * (1 - age) + 1;
          ctx.strokeStyle = "rgba(" + CREMA + "," + a + ")";
          ctx.stroke();
        }
        // central foam pool grows after impact
      });
    }

    function drawFoam(elapsed) {
      var p = clamp((elapsed - 500) / 900, 0, 1);
      if (p <= 0) return;
      withDiscClip(function () {
        var fr = R * (0.16 + 0.5 * ease(p));
        var g = ctx.createRadialGradient(cx - fr * 0.2, cy - R * 0.15 - fr * 0.25, fr * 0.1, cx, cy - R * 0.15, fr);
        g.addColorStop(0, "rgba(" + CREMA + ",0.92)");
        g.addColorStop(0.6, "rgba(" + CREMA + ",0.5)");
        g.addColorStop(1, "rgba(" + CARAMEL + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy - R * 0.15, fr, 0, Math.PI * 2);
        ctx.fill();
        // rosetta hint — symmetric crescents forming down the pool
        if (p > 0.35) drawLeaf(clamp((p - 0.35) / 0.6, 0, 1), fr);
      });
    }

    function drawLeaf(p, fr) {
      var topY = cy - R * 0.15 - fr * 0.55;
      var botY = cy - R * 0.15 + fr * 0.72;
      var pairs = 5;
      ctx.save();
      ctx.strokeStyle = "rgba(63,40,20,0.55)";
      ctx.fillStyle = "rgba(63,40,20,0.28)";
      ctx.lineWidth = 1.4;
      var shown = Math.floor(p * pairs) + 1;
      for (var i = 0; i < shown && i < pairs; i++) {
        var yy = topY + (botY - topY) * (i / pairs);
        var spread = fr * (0.5 * (1 - i / (pairs + 1))) + 4;
        drawCrescent(cx, yy, spread, -1);
        drawCrescent(cx, yy, spread, 1);
      }
      // stem
      ctx.beginPath();
      ctx.moveTo(cx, topY);
      ctx.lineTo(cx, botY);
      ctx.stroke();
      ctx.restore();
    }
    function drawCrescent(x, y, s, dir) {
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.5);
      ctx.quadraticCurveTo(x + dir * s, y - s * 0.1, x, y + s * 0.5);
      ctx.quadraticCurveTo(x + dir * s * 0.45, y, x, y - s * 0.5);
      ctx.fill();
      ctx.stroke();
    }

    function drawSwirl(t) {
      // slow ambient rotation highlight on the crema
      withDiscClip(function () {
        var ang = t / 4200;
        var hx = cx + Math.cos(ang) * R * 0.3;
        var hy = cy + Math.sin(ang) * R * 0.3;
        var g = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 0.7);
        g.addColorStop(0, "rgba(" + CREMA + ",0.08)");
        g.addColorStop(1, "rgba(" + CREMA + ",0)");
        ctx.fillStyle = g;
        ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      });
    }

    function drawSteam(t, elapsed) {
      if (elapsed > 1300 && Math.random() < 0.06 && steam.length < 30) {
        steam.push({ born: t, x: cx + (Math.random() - 0.5) * R * 0.7, life: 2600 + Math.random() * 1400, sway: Math.random() * 6.28 });
      }
      for (var i = steam.length - 1; i >= 0; i--) {
        var s = steam[i];
        var age = (t - s.born) / s.life;
        if (age > 1) { steam.splice(i, 1); continue; }
        var y = cy - R * 0.9 - age * R * 1.7;
        var x = s.x + Math.sin(age * 6 + s.sway) * 16;
        var a = Math.sin(age * Math.PI) * 0.14;
        var rad = 10 + age * 34;
        var g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, "rgba(" + CREMA + "," + a + ")");
        g.addColorStop(1, "rgba(" + CREMA + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function ease(x) { return 1 - Math.pow(1 - x, 3); }
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

    var lastRing = 0;
    function frame(now) {
      var elapsed = now - start;
      if (!document.hidden) {
        drawBackground();
        drawCupDisc();
        // spawn ripples during/after impact
        if (elapsed > 480 && elapsed < 1400 && now - lastRing > 200) { spawnRing(now); lastRing = now; }
        drawRings(now);
        drawFoam(elapsed);
        drawSwirl(now);
        drawStream(elapsed);
        drawSteam(now, elapsed);
      }
      if (!revealed && elapsed > 850) reveal();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------------------------------------------------------------------
     6. Scroll system — Lenis + GSAP reveals, parallax, cup-fill
     Fallback: if GSAP absent, show everything statically.
     --------------------------------------------------------------------- */
  function showAllStatic() {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = "1"; el.style.transform = "none";
    });
    document.querySelectorAll("[data-reveal-line]").forEach(function (el) {
      el.style.transform = "none";
    });
    // cup half-full so the section still reads
    var fill = document.getElementById("cupFill");
    if (fill) fill.style.height = "62%";
    document.querySelectorAll(".pour-note").forEach(function (n) { n.classList.add("is-on"); });
  }

  if (!gsapReady) {
    showAllStatic();
    console.warn("[Caffeine Haven] GSAP unavailable — content shown statically.");
    return;
  }

  var gsap = window.gsap, ST = window.ScrollTrigger;

  // Lenis momentum scroll
  if (!reduce && window.Lenis) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Generic reveals
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" }
    });
  });

  // Line reveals (story lead) — clip-style rise
  gsap.utils.toArray("[data-reveal-line]").forEach(function (el, i) {
    gsap.fromTo(el, { yPercent: 110 }, {
      yPercent: 0, duration: 1.1, ease: "power4.out", delay: i * 0.08,
      scrollTrigger: { trigger: el.closest("h2") || el, start: "top 82%" }
    });
  });

  // Marquee subtle parallax already handled by rAF; add a scrub drift to band
  gsap.utils.toArray(".marquee-band").forEach(function (band) {
    gsap.fromTo(band, { backgroundPositionY: "0px" }, {
      ease: "none", scrollTrigger: { trigger: band, scrub: true, start: "top bottom", end: "bottom top" }
    });
  });

  // Story lead offset drift (layered depth)
  var storyLead = document.querySelector(".story-lead");
  if (storyLead) {
    gsap.to(storyLead, {
      yPercent: -8, ease: "none",
      scrollTrigger: { trigger: ".story", scrub: true, start: "top bottom", end: "bottom top" }
    });
  }

  // Space gallery — gentle stagger + parallax on media
  gsap.utils.toArray(".tile-media").forEach(function (m, i) {
    gsap.fromTo(m, { yPercent: -6 }, {
      yPercent: 6, ease: "none",
      scrollTrigger: { trigger: m.closest(".tile"), scrub: true, start: "top bottom", end: "bottom top" }
    });
  });

  /* ---------- THE POUR — scroll-scrubbed cup fill ---------- */
  (function pourScrub() {
    var scrub = document.getElementById("pourScrub");
    var fill = document.getElementById("cupFill");
    var foam = document.getElementById("cupFoam");
    var notes = gsap.utils.toArray(".pour-note");
    if (!scrub || !fill) return;

    ST.create({
      trigger: ".pour",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: function (self) {
        var p = self.progress;
        var h = Math.min(1, p * 1.15);           // fill a touch faster than scroll
        fill.style.height = (h * 92) + "%";
        if (foam) {
          foam.style.bottom = (h * 92) + "%";
          foam.style.opacity = h > 0.04 && h < 0.99 ? "1" : "0";
        }
        notes.forEach(function (n, i) {
          var th = 0.28 + i * 0.22;
          n.classList.toggle("is-on", p >= th);
        });
      }
    });
  })();

  // Recalculate once fonts/images settle
  window.addEventListener("load", function () { ST.refresh(); });
})();
