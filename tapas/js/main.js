/* =========================================================================
   TAPAS — Toms River, NJ

   Everything here degrades. The page is fully readable with JavaScript off,
   with the motion libraries missing, and with the images/ folder empty.
   ========================================================================= */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Missing photography should never show a broken-image icon. Each <img> sits
   on a designed ground; if the file isn't there we drop the <img> and the
   ground below it is what you see. */
(function retireBrokenImages() {
  document.querySelectorAll("img").forEach((img) => {
    const drop = () => img.remove();
    // An <img> still holding its URL in data-src has no src yet, and a
    // src-less image reports complete with zero width. Leave those alone.
    if (!img.getAttribute("src")) {
      img.addEventListener("error", drop, { once: true });
      return;
    }
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener("error", drop, { once: true });
  });
})();

/* -------------------------------------------------------------------------
   Header — a solid sand bar throughout; this only adds the hairline rule
   once you have scrolled off the hero.
   ------------------------------------------------------------------------- */
(function header() {
  const el = document.getElementById("siteHeader");
  if (!el) return;
  let ticking = false;
  const update = () => {
    el.classList.toggle("is-stuck", window.scrollY > window.innerHeight * 0.55);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* -------------------------------------------------------------------------
   HERO

   The video never plays on its own — scroll position is its transport. That
   is the point: at rest you are looking at a single held frame, so the food
   sits still instead of simmering the way generated video does on a loop.

   The scrub is set up in the motion block below, once GSAP is available.
   Here we only decide whether to use the film at all, and get it buffered.
   ------------------------------------------------------------------------- */

/* Phones on cell data should not be handed a multi-megabyte video. */
function videoBudget() {
  const c = navigator.connection || {};
  if (c.saveData === true) return "none";
  if (/(^|-)2g$/.test(c.effectiveType || "")) return "none";
  return window.matchMedia("(max-width: 900px)").matches ? "mobile" : "full";
}

/* Resolves once the video can be seeked, or gives up. */
function primeHeroFilm(video) {
  const budget = videoBudget();
  if (budget === "none") return Promise.resolve(false);

  video.src = budget === "mobile" ? video.dataset.srcMobile : video.dataset.src;
  video.load();

  // Safari will not decode or seek until the element has been played once,
  // so start it and immediately stop: scroll owns the timeline from here.
  const kick = video.play();
  if (kick && kick.then) kick.then(() => video.pause()).catch(() => {});

  return new Promise((resolve) => {
    let settled = false;
    const done = (ok) => { if (!settled) { settled = true; resolve(ok); } };

    // Scrubbing is seeking, and seeking needs the host to answer HTTP Range
    // requests. Some don't. Prove a seek actually lands before betting the
    // whole hero on it, or the page sits frozen on an empty table.
    const proveSeekable = () => {
      video.pause();
      const target = Math.min(1, (video.duration || 2) / 2);
      if (!isFinite(target) || target <= 0) return done(false);
      const ok = () => done(Math.abs(video.currentTime - target) < 0.5);
      video.addEventListener("seeked", ok, { once: true });
      setTimeout(ok, 3000);
      try { video.currentTime = target; } catch { done(false); }
    };

    if (video.readyState >= 2) proveSeekable();
    else video.addEventListener("loadeddata", proveSeekable, { once: true });
    video.addEventListener("error", () => done(false), { once: true });
    setTimeout(() => done(false), 8000);
  });
}
const heroFilmReady = (() => {
  const v = document.getElementById("heroVideo");
  if (!v || REDUCED.matches) return Promise.resolve(false);
  return primeHeroFilm(v);
})();

/* -------------------------------------------------------------------------
   SPOTLIGHT COVERFLOW

   Three plates, the ones regulars actually order. Vanilla port of the
   supplied React CoverFlowCarousel: same 3D geometry, autoplay, keyboard,
   swipe and dot behavior.
   ------------------------------------------------------------------------- */
const PLATES = [
  {
    name: "Short Rib Cigars",
    sub: "Fried to order",
    desc: "Shredded beef short rib rolled tight in a crisp wrapper, roasted garlic aioli.",
    img: "images/plate-short-rib-cigars.jpg",
  },
  {
    name: "BBQ Brisket Nachos",
    sub: "Built for the table",
    desc: "Slow-cooked brisket over corn chips, pico de gallo, guacamole, chipotle crema.",
    img: "images/plate-brisket-nachos.jpg",
  },
  {
    name: "Mango Habanero Poppers",
    sub: "Sweet first, heat after",
    desc: "Chicken poppers under a mango habanero glaze, slaw alongside to cool it down.",
    img: "images/plate-mango-habanero-poppers.jpg",
  },
];

(function coverflow() {
  const stage = document.getElementById("cfStage");
  const dotsWrap = document.getElementById("cfDots");
  const prevBtn = document.getElementById("cfPrev");
  const nextBtn = document.getElementById("cfNext");
  const live = document.getElementById("cfLive");
  const section = document.getElementById("spotlight");
  if (!stage || !section) return;

  const AUTOPLAY_MS = 5000;
  const total = PLATES.length;
  let current = 0, hovered = false, inView = true, timer = null, touchStartX = 0;

  const cards = PLATES.map((item, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cf-card";
    card.setAttribute("role", "tabpanel");
    card.setAttribute("aria-label", item.name);

    const media = document.createElement("div");
    media.className = "cf-media";
    media.dataset.initial = item.name.charAt(0);

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => img.remove(), { once: true });
    media.appendChild(img);

    const scrim = document.createElement("div");
    scrim.className = "cf-scrim";

    const body = document.createElement("div");
    body.className = "cf-body";
    body.innerHTML = `<h3 class="cf-name"></h3><span class="cf-sub"></span><p class="cf-desc"></p>`;
    body.querySelector(".cf-name").textContent = item.name;
    body.querySelector(".cf-sub").textContent = item.sub;
    body.querySelector(".cf-desc").textContent = item.desc;

    card.append(media, scrim, body);
    card.addEventListener("click", () => { if (i !== current) { go(i); restart(); } });
    stage.appendChild(card);
    return card;
  });

  const dots = PLATES.map((item, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cf-dot";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", item.name);
    b.appendChild(document.createElement("span"));
    b.addEventListener("click", () => { go(i); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });

  const POSITIONS = ["is-center", "is-near-r", "is-far-r", "is-far-l", "is-near-l"];

  function go(next) {
    current = ((next % total) + total) % total;
    cards.forEach((card, i) => {
      const offset = (i - current + total) % total;
      POSITIONS.forEach((c) => card.classList.remove(c));
      if (offset === 0) card.classList.add("is-center");
      else if (offset === 1) card.classList.add("is-near-r");
      else if (offset === 2 && total > 4) card.classList.add("is-far-r");
      else if (offset === total - 1) card.classList.add("is-near-l");
      else if (offset === total - 2 && total > 4) card.classList.add("is-far-l");

      card.tabIndex = offset === 0 ? -1 : 0;
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    });
    dots.forEach((d, i) => d.setAttribute("aria-current", i === current ? "true" : "false"));
    if (live) live.textContent = `${PLATES[current].name}. ${current + 1} of ${total}.`;
  }

  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  function restart() {
    clearInterval(timer);
    if (!hovered && inView && !REDUCED.matches && total > 1) timer = setInterval(next, AUTOPLAY_MS);
  }

  nextBtn?.addEventListener("click", () => { next(); restart(); });
  prevBtn?.addEventListener("click", () => { prev(); restart(); });

  section.addEventListener("mouseenter", () => { hovered = true; restart(); });
  section.addEventListener("mouseleave", () => { hovered = false; restart(); });
  section.addEventListener("focusin", () => { hovered = true; restart(); });
  section.addEventListener("focusout", () => { hovered = false; restart(); });

  section.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  section.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 45) { diff < 0 ? next() : prev(); restart(); }
  }, { passive: true });

  // Arrows drive the carousel only while it is on screen, so they don't
  // hijack the keyboard for the rest of the page.
  window.addEventListener("keydown", (e) => {
    if (!inView) return;
    if (e.key === "ArrowLeft") { prev(); restart(); }
    else if (e.key === "ArrowRight") { next(); restart(); }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => { inView = e[0].isIntersecting; restart(); },
      { threshold: 0.2 }).observe(stage);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(timer); else restart();
  });
  REDUCED.addEventListener?.("change", restart);

  go(0);
  restart();
})();

/* -------------------------------------------------------------------------
   Full menu, behind a button
   ------------------------------------------------------------------------- */
(function menuDisclosure() {
  const btn = document.getElementById("menuToggle");
  const panel = document.getElementById("menuPanel");
  const label = document.getElementById("menuToggleLabel");
  if (!btn || !panel) return;

  let open = false;

  btn.addEventListener("click", () => {
    open = !open;
    btn.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Hide the full menu" : "See the full menu";

    if (open) {
      panel.hidden = false;
      // Next frame, so the transition has a collapsed state to run from.
      requestAnimationFrame(() => panel.setAttribute("data-open", "true"));
      window.ScrollTrigger?.refresh();
    } else {
      panel.removeAttribute("data-open");
      const hide = () => { panel.hidden = true; window.ScrollTrigger?.refresh(); };
      if (REDUCED.matches) hide();
      else panel.addEventListener("transitionend", hide, { once: true });
    }
  });
})();

/* -------------------------------------------------------------------------
   Reveals — IntersectionObserver only, no dependency on the motion libraries
   ------------------------------------------------------------------------- */
(function reveals() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("js");

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...(entry.target.parentElement?.children || [])];
      const delay = Math.min(siblings.indexOf(entry.target), 4) * 70;
      setTimeout(() => entry.target.classList.add("is-in"), delay);
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });

  items.forEach((el) => io.observe(el));
  setTimeout(() => items.forEach((el) => el.classList.add("is-in")), 4000);
})();

/* -------------------------------------------------------------------------
   Momentum scroll + the hero's slow settle

   Vendored, not CDN-loaded: this has to work off a USB stick. Still wrapped,
   so a missing file downgrades to native scrolling instead of breaking.
   ------------------------------------------------------------------------- */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}

(async function motion() {
  if (REDUCED.matches) return;

  try {
    await Promise.all([
      loadScript("js/vendor/lenis.min.js"),
      loadScript("js/vendor/gsap.min.js"),
    ]);
    await loadScript("js/vendor/ScrollTrigger.min.js");
  } catch (err) {
    console.warn("[Tapas] Motion libraries unavailable; the page falls back to native scrolling.", err);
    return;
  }
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---- The hero: scroll is the video transport ---- */
  const wrap = document.getElementById("heroScroll");
  const video = document.getElementById("heroVideo");
  const stages = [...document.querySelectorAll(".hero-stage")];
  const cue = document.getElementById("scrollCue");

  const filmOk = await heroFilmReady;

  if (wrap && video && filmOk && video.duration) {
    wrap.classList.add("is-scrub");
    video.pause();

    const dur = video.duration;
    let wanted = 0;

    // Seek on a frame tick rather than on every scroll event: piling seeks
    // onto a decoder is what makes scrubbed video stutter. The gate is the
    // element's own `seeking` flag, which the browser clears itself — a
    // hand-rolled one stays stuck if a `seeked` event never arrives.
    const pump = () => {
      if (video.seeking) return;
      if (Math.abs(video.currentTime - wanted) < 0.03) return;
      video.currentTime = wanted;
    };

    ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        wanted = Math.min(dur - 0.03, Math.max(0, self.progress * dur));
      },
    });
    gsap.ticker.add(pump);

    // The copy arrives with the plates: the headline once the first plate has
    // landed, then everything a visitor needs to act on once the second does.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.6 },
    });
    tl.fromTo(stages[0], { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.13 }, 0.15)
      .fromTo(stages[1], { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.13 }, 0.40)
      .to({}, { duration: 0.47 });

    if (cue) {
      gsap.to(cue, {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: wrap, start: "top top", end: "12% bottom", scrub: true },
      });
    }
  } else if (cue) {
    // No scrub: the hero is one static screen, so the cue has nothing to promise.
    cue.style.display = "none";
  }

  ScrollTrigger.refresh();
})();
