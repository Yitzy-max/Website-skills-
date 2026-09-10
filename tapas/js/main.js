/* =========================================================================
   TAPAS — Toms River, NJ

   Everything here degrades. The page is fully readable with JavaScript off,
   with the CDN unreachable, and with the images/ folder empty. Motion is an
   enhancement layered on top of a page that already works.
   ========================================================================= */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");

/* -------------------------------------------------------------------------
   Missing photography should never show a broken-image icon. Each <img> sits
   on top of a designed ground; if the file isn't there, we drop the <img> and
   the ground below it is what you see.
   ------------------------------------------------------------------------- */
function retireBrokenImages() {
  document.querySelectorAll("img").forEach((img) => {
    const drop = () => {
      img.dataset.failed = "true";
      img.remove();
    };
    // defer means some images may already have failed before we got here
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener("error", drop, { once: true });
  });
}
retireBrokenImages();

/* -------------------------------------------------------------------------
   Header — solid once you've left the hero
   ------------------------------------------------------------------------- */
(function header() {
  const el = document.getElementById("siteHeader");
  if (!el) return;
  let ticking = false;
  const update = () => {
    el.classList.toggle("is-stuck", window.scrollY > window.innerHeight * 0.6);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* -------------------------------------------------------------------------
   HERO — the plate sequence

   The focal moment of the page: plates arrive one at a time, the way they do
   at the table. Long crossfade, no slide, no zoom-bounce. It pauses when the
   hero is offscreen or the tab is hidden.
   ------------------------------------------------------------------------- */
/* Resolve once every hero photo has either loaded or failed, so the sequence
   is built from the photos that actually exist. Capped so a hanging request
   can't hold the hero hostage. */
function heroImagesSettled(media, cap = 2500) {
  const imgs = Array.from(media.querySelectorAll("img"));
  const pending = imgs.filter((img) => !img.complete);
  if (!pending.length) return Promise.resolve();

  return Promise.race([
    Promise.all(pending.map((img) => new Promise((res) => {
      img.addEventListener("load", res, { once: true });
      img.addEventListener("error", res, { once: true });
    }))),
    new Promise((res) => setTimeout(res, cap)),
  ]);
}

async function heroPlates() {
  const media = document.getElementById("heroMedia");
  const nav = document.getElementById("plateNav");
  if (!media) return;

  await heroImagesSettled(media);

  // Only rotate through plates whose photo actually loaded. Ship four photos
  // instead of five and the sequence quietly becomes four — no empty slot.
  // With no photos at all, one plate stays as the designed ground.
  const all = Array.from(media.querySelectorAll(".plate"));
  const withPhoto = all.filter((p) => {
    const img = p.querySelector("img");
    return img && img.naturalWidth > 0;
  });
  const plates = withPhoto.length ? withPhoto : all.slice(0, 1);
  all.forEach((p) => { if (!plates.includes(p)) p.remove(); });

  if (plates.length < 2) { plates[0]?.classList.add("is-active"); return; }

  const HOLD = 5200;
  let index = 0;
  let timer = null;
  let visible = true;

  // Indicators
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

  function tick() { go(index + 1); }
  function restart() {
    clearInterval(timer);
    if (visible && !REDUCED.matches) timer = setInterval(tick, HOLD);
  }

  go(0);
  restart();

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    restart();
  });

  // Stop the loop once the hero has scrolled away — no work offscreen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting && !document.hidden;
      restart();
    }, { threshold: 0.05 }).observe(media);
  }

  REDUCED.addEventListener?.("change", restart);
}
heroPlates();

/* -------------------------------------------------------------------------
   COVERFLOW — signature plates

   A vanilla port of the supplied React CoverFlowCarousel: same 3D geometry,
   same 800ms easing, same autoplay/hover/keyboard/swipe behavior, retuned to
   this page's palette and given a designed stand-in for missing photography.
   ------------------------------------------------------------------------- */
const PLATES = [
  {
    name: "Short Rib Cigars",
    sub: "Fried to order",
    desc: "Shredded beef short rib rolled tight in a crisp wrapper, roasted garlic aioli.",
    img: "images/plate-short-rib-cigars.jpg",
  },
  {
    name: "Tapas Flatbread",
    sub: "House flatbread",
    desc: "BBQ brisket over crisp in-house flatbread, fresh arugula, chipotle aioli.",
    img: "images/plate-tapas-flatbread.jpg",
  },
  {
    name: "BBQ Brisket Nachos",
    sub: "Built for the table",
    desc: "Slow-cooked brisket over corn chips, pico de gallo, guacamole, chipotle crema.",
    img: "images/plate-brisket-nachos.jpg",
  },
  {
    name: "Grilled Steak Skewer",
    sub: "Off the grill",
    desc: "Marinated in house sauce, charred over the flame, served with a fresh salad.",
    img: "images/plate-steak-skewer.jpg",
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
  const amb = document.getElementById("cfAmb");
  const live = document.getElementById("cfLive");
  const section = document.getElementById("plates");
  if (!stage) return;

  const AUTOPLAY_MS = 5000;
  const total = PLATES.length;
  let current = 0;
  let hovered = false;
  let inView = true;
  let timer = null;
  let touchStartX = 0;

  // Build cards
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
    body.innerHTML =
      `<h3 class="cf-name"></h3>` +
      `<span class="cf-sub"></span>` +
      `<p class="cf-desc"></p>`;
    body.querySelector(".cf-name").textContent = item.name;
    body.querySelector(".cf-sub").textContent = item.sub;
    body.querySelector(".cf-desc").textContent = item.desc;

    card.append(media, scrim, body);
    card.addEventListener("click", () => {
      if (i !== current) { go(i); restart(); }
    });
    stage.appendChild(card);
    return card;
  });

  // Dots
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

      // Only the front card is a tab stop; the rest stay reachable by the dots
      card.tabIndex = offset === 0 ? -1 : 0;
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
    });

    dots.forEach((d, i) => d.setAttribute("aria-current", i === current ? "true" : "false"));

    // Ambient wash behind the stage, pulled from the front card's photo
    const frontImg = cards[current].querySelector("img");
    if (amb && frontImg && frontImg.naturalWidth > 0) {
      amb.style.backgroundImage = `url("${frontImg.currentSrc || frontImg.src}")`;
      amb.classList.add("is-on");
    } else if (amb) {
      amb.classList.remove("is-on");
    }

    if (live) live.textContent = `${PLATES[current].name}. ${current + 1} of ${total}.`;
  }

  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  function restart() {
    clearInterval(timer);
    if (!hovered && inView && !REDUCED.matches && total > 1) {
      timer = setInterval(next, AUTOPLAY_MS);
    }
  }

  nextBtn?.addEventListener("click", () => { next(); restart(); });
  prevBtn?.addEventListener("click", () => { prev(); restart(); });

  section.addEventListener("mouseenter", () => { hovered = true; restart(); });
  section.addEventListener("mouseleave", () => { hovered = false; restart(); });
  section.addEventListener("focusin", () => { hovered = true; restart(); });
  section.addEventListener("focusout", () => { hovered = false; restart(); });

  section.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  section.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 45) { diff < 0 ? next() : prev(); restart(); }
  }, { passive: true });

  // Left/right arrows drive the carousel only while it's actually on screen,
  // so they don't hijack the keyboard for the rest of the page.
  window.addEventListener("keydown", (e) => {
    if (!inView) return;
    if (e.key === "ArrowLeft") { prev(); restart(); }
    else if (e.key === "ArrowRight") { next(); restart(); }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      restart();
    }, { threshold: 0.2 }).observe(section);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(timer); else restart();
  });

  REDUCED.addEventListener?.("change", restart);

  go(0);
  restart();
})();

/* -------------------------------------------------------------------------
   Reveals — IntersectionObserver only, no dependency on GSAP.
   The .js class is added only once we know we can un-hide things again.
   ------------------------------------------------------------------------- */
(function reveals() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) return; // leave everything visible

  document.documentElement.classList.add("js");

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // A short stagger where siblings genuinely read as a list
      const siblings = Array.from(entry.target.parentElement?.children || []);
      const i = siblings.indexOf(entry.target);
      const delay = Math.min(i, 4) * 70;
      setTimeout(() => entry.target.classList.add("is-in"), delay);
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });

  items.forEach((el) => io.observe(el));

  // Safety net: nothing stays hidden if the observer never fires
  setTimeout(() => items.forEach((el) => el.classList.add("is-in")), 4000);
})();

/* -------------------------------------------------------------------------
   Momentum scroll + scroll-scrubbed continuity

   Loaded last and entirely optional. If either CDN is unreachable the page
   keeps its native scroll and every section stays exactly where it belongs.
   ------------------------------------------------------------------------- */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}

(async function motion() {
  if (REDUCED.matches) return;

  // Vendored, not CDN-loaded: this site has to work off a USB stick and keep
  // working if a CDN has a bad day. Still wrapped, so a missing file downgrades
  // to native scrolling instead of breaking the page.
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

  /* Momentum scroll */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.6 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* The one authored handoff: the hero plate contracts and rounds as the
     small-plates panel rises over it, so the two sections read as one
     continuous move rather than two stacked blocks. */
  const heroWrap = document.getElementById("heroWrap");
  const heroMedia = document.getElementById("heroMedia");
  const heroInner = document.querySelector(".hero-inner");

  if (heroWrap && heroMedia) {
    gsap.to(heroMedia, {
      scale: 0.86,
      borderRadius: "28px",
      ease: "none",
      scrollTrigger: {
        trigger: heroWrap,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });

    gsap.to(heroInner, {
      y: -50,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: heroWrap,
        start: "top top",
        end: "55% bottom",
        scrub: 0.6,
      },
    });

    // Very slow drift on whichever plate is showing — the only ambient motion
    // on the page, and it stops with the hero.
    gsap.to(".plate img", {
      scale: 1.14,
      ease: "none",
      scrollTrigger: {
        trigger: heroWrap,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });
  }

  /* The room panel drifts against its frame — parallax with a purpose:
     it keeps the eye on the image while the copy beside it is being read. */
  const fig = document.getElementById("atmosFigure");
  const figImg = fig?.querySelector("img");
  if (figImg) {
    gsap.fromTo(figImg,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: 0.8 },
      }
    );
  }

  ScrollTrigger.refresh();
})();
