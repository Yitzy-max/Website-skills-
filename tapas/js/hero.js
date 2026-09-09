/* =========================================================================
   There's Always Something Good in Tapas — hero scroll engine

   This is a straight port of the MacBook Neo `FrameSequenceHero` component
   into vanilla JS (this project isn't React). Every number that shapes the
   motion is unchanged from the original:

     · progress  = scrollY / (spacer.offsetHeight - innerHeight), clamped 0..1
     · target    = progress * (frameCount - 1)
     · RAF lerp  = display += (target - display) * 0.28, snapping under 0.08
     · preload   = `eagerCount` frames first, the rest once those settle
     · steps     = the same from/to progress windows, same active/prev logic
     · ticks     = filled by (p - from) / (to - from) within the active step

   The MacBook animation was never a set of laptop objects — it's a rendered
   image sequence that scroll scrubs through, frame by frame. So "swap the
   laptops for dishes" means swapping the sequence: same engine, food frames.
   See tapas/frames/README.md for how those frames get produced.
   ========================================================================= */

/* -------------------------------------------------------------------------
   Frame source
   Flip `useLocal` to true once the tapas frames are sitting in tapas/frames/.
   Until then the hero runs on the original reference sequence so the motion,
   timing and scrub can be reviewed with real assets in place.
   ------------------------------------------------------------------------- */
const SEQUENCE = {
  count: 941,
  eagerCount: 140,
  useLocal: false,
  local:  (i) => `frames/frame_${String(i).padStart(4, "0")}.jpg`,
  remote: (i) => `https://raw.githubusercontent.com/duthiljean/hero-apple/main/frames/frame_${String(i).padStart(4, "0")}.jpg`,
};

const framePath = (i) => (SEQUENCE.useLocal ? SEQUENCE.local(i) : SEQUENCE.remote(i));

/* -------------------------------------------------------------------------
   Steps — identical progress windows to the original four MacBook chapters,
   restaurant content in place of the product copy.
   ------------------------------------------------------------------------- */
const steps = [
  { from: 0.02, to: 0.28, color: "#B08948", num: "01", total: "04", icon: "✦",
    title: "Gambas al ajillo.",
    description: "Head-on shrimp, garlic, a little chili. Still bubbling in the oil when it reaches the table.",
    label: "Dish one" },
  { from: 0.28, to: 0.55, color: "#A8543C", num: "02", total: "04", icon: "◐",
    title: "Patatas bravas.",
    description: "Crisp outside, soft in the middle, brava sauce with just enough heat to notice.",
    label: "Dish two" },
  { from: 0.55, to: 0.82, color: "#6F7A4C", num: "03", total: "04", icon: "▣",
    title: "Pan con tomate.",
    description: "Grilled bread, ripe tomato rubbed in by hand, good oil, flaked salt. Nothing else.",
    label: "Dish three" },
  { from: 0.82, to: 1.01, color: "#7A3B4A", num: "04", total: "04", icon: "⌁",
    title: "Small plates, long nights.",
    description: "Come with four people, order eight things, stay past closing. That's how it's meant to go.",
    label: "The room" },
];

/* ---- element handles ---------------------------------------------------- */
const root      = document.querySelector(".fsh-root");
const spacer    = document.querySelector(".fsh-spacer");
const img       = document.querySelector(".fsh-canvas");
const nav       = document.querySelector(".fsh-nav");
const sub       = document.querySelector(".fsh-sub");
const review    = document.querySelector(".fsh-review");
const cardsWrap = document.querySelector(".fsh-cards");
const progressFill = document.querySelector(".fsh-progress-fill");
const loader      = document.querySelector(".fsh-loader");
const loaderText  = document.querySelector(".fsh-loader-text");
const loaderFill  = document.querySelector(".fsh-loader-fill");

if (root && spacer && img) {
  /* ---- scrub state (mirrors the component's refs) ---------------------- */
  const cache = new Array(SEQUENCE.count);
  let loaded = 0;
  let targetFrame = 0;
  let displayFrame = 0;
  let lastShown = -1;
  let rafActive = false;
  let loaderDone = false;

  /* ---- cards are built once from `steps`, then only classed on scroll --- */
  const cardEls = steps.map((s, i) => {
    const article = document.createElement("article");
    article.className = "fsh-card";
    article.style.setProperty("--c", s.color);
    article.innerHTML = `
      <div class="fsh-card-inner">
        <span aria-hidden="true" class="fsh-card-glow"></span>
        <div class="fsh-card-head">
          <span class="fsh-card-num"><strong>${s.num}</strong> / ${s.total}</span>
          <span aria-hidden="true" class="fsh-card-icon">${s.icon}</span>
        </div>
        <h3 class="fsh-card-title">${s.title}</h3>
        <p class="fsh-card-desc">${s.description}</p>
        <div class="fsh-card-foot">
          <div class="fsh-ticks">
            ${steps.map(() => `<i class="fsh-tick"><span></span></i>`).join("")}
          </div>
          <span class="fsh-card-label">${s.label}</span>
        </div>
      </div>`;
    cardsWrap.appendChild(article);
    return article;
  });
  const tickEls = cardEls.map((el) => Array.from(el.querySelectorAll(".fsh-tick span")));

  const showFrame = (i) => {
    if (i === lastShown) return;
    img.src = framePath(i + 1);
    lastShown = i;
  };

  /* Single RAF chain, guarded so scroll events never stack loops — the
     display frame eases toward the target so fast flicks stay smooth. */
  const loop = () => {
    if (rafActive) return;
    rafActive = true;
    const tick = () => {
      const diff = targetFrame - displayFrame;
      if (Math.abs(diff) < 0.08) displayFrame = targetFrame;
      else displayFrame += diff * 0.28;
      const idx = Math.max(0, Math.min(SEQUENCE.count - 1, Math.round(displayFrame)));
      if (idx !== lastShown) showFrame(idx);
      if (displayFrame !== targetFrame) requestAnimationFrame(tick);
      else rafActive = false;
    };
    requestAnimationFrame(tick);
  };

  /* ---- preload: eager block first, then the tail in the background ----- */
  const eager = Math.min(SEQUENCE.eagerCount, SEQUENCE.count);
  const loadOne = (i) => {
    const image = new Image();
    image.decoding = "async";
    image.src = framePath(i + 1);
    // A missing frame settles like a loaded one on purpose: a gap in the
    // sequence must never leave the loader stuck at 98%.
    const onSettle = () => {
      loaded += 1;
      const pct = Math.round((loaded / SEQUENCE.count) * 100);
      if (loaderText) loaderText.textContent = pct < 100 ? `Loading · ${pct}%` : "Ready";
      if (loaderFill) loaderFill.style.width = `${pct}%`;
      if (loaded === eager && !loaderDone) {
        loaderDone = true;
        if (loader) loader.classList.add("fsh-loader-done");
        for (let j = eager; j < SEQUENCE.count; j++) loadOne(j);
      }
    };
    image.onload = onSettle;
    image.onerror = onSettle;
    cache[i] = image;
  };
  for (let i = 0; i < eager; i++) loadOne(i);

  /* ---- scroll ---------------------------------------------------------- */
  const onScroll = () => {
    const total = spacer.offsetHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, total)));

    targetFrame = p * (SEQUENCE.count - 1);
    loop();

    if (progressFill) progressFill.style.width = `${p * 100}%`;
    if (nav) nav.classList.toggle("fsh-nav-scrolled", window.scrollY > 4);
    if (sub) sub.classList.toggle("fsh-sub-hidden", window.scrollY > 8);

    let activeIdx = -1;
    let local = 0;
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      if (p >= s.from && p < s.to) {
        activeIdx = i;
        local = (p - s.from) / (s.to - s.from);
        break;
      }
    }
    const stepLocal = Math.max(0, Math.min(1, local));

    cardEls.forEach((el, i) => {
      el.classList.toggle("fsh-card-active", activeIdx === i);
      el.classList.toggle("fsh-card-prev", activeIdx >= 0 && i < activeIdx);
    });

    tickEls.forEach((ticks) => {
      ticks.forEach((span, j) => {
        const done = j < activeIdx;
        const cur = j === activeIdx;
        span.style.transform = `scaleX(${done ? 1 : cur ? stepLocal : 0})`;
        span.style.transition = done ? "none" : "transform 160ms linear";
      });
    });

    // The review rides with the first dish, the way the original ran its
    // secondary copy alongside the opening chapter.
    if (review) review.classList.toggle("fsh-review-show", activeIdx === 0);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}
