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
  const hero = document.getElementById("heroScroll");
  let ticking = false;
  const update = () => {
    // Stay transparent for the whole hero, however long the scrub makes it,
    // and only take the sand bar once the page is actually on sand.
    const edge = hero ? hero.offsetHeight - 80 : window.innerHeight * 0.55;
    el.classList.toggle("is-stuck", window.scrollY > edge);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* -------------------------------------------------------------------------
   HERO

   One photograph, full bleed. Scroll drives a slow push-in on it and stages
   the copy in over it, so the first screen still answers to the visitor
   instead of running on its own clock.

   The motion is set up in the motion block below, once GSAP is available.
   Here we only wait for the photo to actually be on screen: the copy starts
   hidden, and hiding it before there is anything behind it would leave a
   visitor looking at an empty panel.
   ------------------------------------------------------------------------- */
const heroPhotoReady = (() => {
  const img = document.getElementById("heroPhoto");
  if (!img) return Promise.resolve(false);
  if (img.complete) return Promise.resolve(img.naturalWidth > 0);
  return new Promise((resolve) => {
    img.addEventListener("load", () => resolve(true), { once: true });
    img.addEventListener("error", () => resolve(false), { once: true });
    // A slow connection must not hold the copy hidden indefinitely.
    setTimeout(() => resolve(img.naturalWidth > 0), 4000);
  });
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

  /* ---- The hero: scroll drives the push-in and brings the copy in ---- */
  const wrap = document.getElementById("heroScroll");
  const photo = document.querySelector(".plate-film");
  const stages = [...document.querySelectorAll(".hero-stage")];
  const cue = document.getElementById("scrollCue");

  const photoOk = await heroPhotoReady;

  if (wrap && photo && photoOk) {
    wrap.classList.add("is-scrub");

    // A slow push-in the visitor drives. It is scrubbed, not animated: at
    // rest the picture is perfectly still, and it only moves while they do.
    gsap.fromTo(photo,
      { scale: 1 },
      {
        scale: 1.09, ease: "none",
        scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: true },
      });

    // The copy arrives over it: the headline first, then everything a visitor
    // needs to act on.
    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: "top top", end: "bottom bottom", scrub: 0.6 },
    });
    // Once each line is in it stays in. There is no exit tween: the copy rides
    // up and off with the picture when the pin releases, the way anything else
    // on the page leaves. Fading it out early read as the hero losing its
    // words while you were still looking at the hero.
    //
    // The hold at 0.99 is load-bearing, not decoration. ScrollTrigger scrubs
    // timeline *progress*, so these positions are fractions of the timeline's
    // own length -- not of the scroll. Without something out at the end the
    // timeline would be 0.53 long, and 0.40 would land at 75% of the scroll
    // instead of 40%: the phone number would arrive as the hero was leaving.
    tl.fromTo(stages[0], { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.13 }, 0.15)
      .fromTo(stages[1], { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.13 }, 0.40)
      .to(stages, { opacity: 1, duration: 0.01 }, 0.99);

    if (cue) {
      gsap.to(cue, {
        opacity: 0, ease: "none",
        scrollTrigger: {
          trigger: wrap, start: "top top",
          end: () => "+=" + window.innerHeight * 0.5,
          scrub: true,
        },
      });
    }
  } else if (cue) {
    // No scrub: the hero is one static screen, so the cue has nothing to promise.
    cue.style.display = "none";
  }

  ScrollTrigger.refresh();
})();
