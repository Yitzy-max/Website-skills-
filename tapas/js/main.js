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

   If the film should play, it IS the hero and the stills are removed. The
   poster is painted by CSS underneath either way, so the frame is never blank
   while the video loads, and never blank if it never loads.
   ------------------------------------------------------------------------- */

/* Phones on cell data should not be handed a 1.6MB autoplaying video. */
function videoBudget() {
  const c = navigator.connection || {};
  if (c.saveData === true) return "none";
  if (/(^|-)2g$/.test(c.effectiveType || "")) return "none";
  return window.matchMedia("(max-width: 900px)").matches ? "mobile" : "full";
}

function imagesSettled(root, cap = 2500) {
  const imgs = [...root.querySelectorAll("img")].filter((i) => !i.complete);
  if (!imgs.length) return Promise.resolve();
  return Promise.race([
    Promise.all(imgs.map((i) => new Promise((res) => {
      i.addEventListener("load", res, { once: true });
      i.addEventListener("error", res, { once: true });
    }))),
    new Promise((res) => setTimeout(res, cap)),
  ]);
}

function startHeroFilm(video) {
  const budget = videoBudget();
  if (budget === "none") return false;      // poster carries it

  video.src = budget === "mobile" ? video.dataset.srcMobile : video.dataset.src;
  video.preload = "auto";
  video.load();

  const tryPlay = () => video.play().catch(() => {});   // blocked autoplay is fine, poster shows
  tryPlay();
  video.addEventListener("loadeddata", tryPlay, { once: true });

  // Don't burn battery decoding a loop nobody is looking at.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => {
      if (e[0].isIntersecting && !document.hidden) tryPlay(); else video.pause();
    }, { threshold: 0.1 }).observe(video);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause(); else tryPlay();
  });
  return true;
}

async function heroPlates() {
  const media = document.getElementById("heroMedia");
  const nav = document.getElementById("plateNav");
  if (!media) return;

  const all = [...media.querySelectorAll(".plate")];
  const filmPlate = media.querySelector('[data-plate="film"]');
  const video = filmPlate?.querySelector("video");

  // Decided up front, not after a load race: the film either is the hero or isn't.
  if (video && !REDUCED.matches && startHeroFilm(video)) {
    all.forEach((p) => { if (p !== filmPlate) p.remove(); });
    filmPlate.classList.add("is-active");
    return;
  }
  filmPlate?.remove();

  // Only now do the stills get to cost anything: the <img> elements are
  // created here rather than sitting src-less in the markup.
  media.querySelectorAll(".plate[data-img]").forEach((plate) => {
    const img = document.createElement("img");
    img.alt = plate.dataset.alt || "";
    img.decoding = "async";
    img.addEventListener("error", () => img.remove(), { once: true });
    img.src = plate.dataset.img;
    plate.appendChild(img);
  });
  await imagesSettled(media);

  const stills = [...media.querySelectorAll(".plate")];
  const ok = (p) => { const i = p.querySelector("img"); return !!i && i.naturalWidth > 0; };
  const withPhoto = stills.filter(ok);
  const plates = withPhoto.length ? withPhoto : stills.slice(0, 1);
  stills.forEach((p) => { if (!plates.includes(p)) p.remove(); });
  plates.forEach((p, i) => p.classList.toggle("is-active", i === 0));

  if (plates.length < 2) return;

  const HOLD = 5000;
  let index = 0, timer = null, visible = true;

  const dots = plates.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "plate-dot";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Plate ${i + 1} of ${plates.length}`);
    b.appendChild(document.createElement("span"));
    b.addEventListener("click", () => { go(i); restart(); });
    nav.appendChild(b);
    return b;
  });

  function go(next) {
    index = (next + plates.length) % plates.length;
    plates.forEach((p, i) => p.classList.toggle("is-active", i === index));
    dots.forEach((d, i) => d.setAttribute("aria-current", i === index ? "true" : "false"));
  }
  function restart() {
    clearInterval(timer);
    if (visible && !REDUCED.matches) timer = setInterval(() => go(index + 1), HOLD);
  }

  go(0);
  restart();

  document.addEventListener("visibilitychange", () => { visible = !document.hidden; restart(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => {
      visible = e[0].isIntersecting && !document.hidden;
      restart();
    }, { threshold: 0.05 }).observe(media);
  }
  REDUCED.addEventListener?.("change", restart);
}
heroPlates();

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

  const hero = document.getElementById("hero");
  const heroMedia = document.getElementById("heroMedia");

  const coarse = window.matchMedia("(max-width: 900px)").matches;

  if (hero && heroMedia && !coarse) {
    // A slow push in on whatever is showing. The media already dissolves into
    // the page ground, so this is the whole handoff: no scale-and-round.
    gsap.fromTo(heroMedia, { scale: 1 }, {
      scale: 1.08, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
    });
  }

  ScrollTrigger.refresh();
})();
