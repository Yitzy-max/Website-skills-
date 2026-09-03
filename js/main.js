/* =========================================================================
   The Caffeine Haven — motion layer
   Lenis (momentum scroll) + GSAP ScrollTrigger (scrub, pin, parallax)
   + IntersectionObserver reveals that work even if GSAP never loads.

   Principle: the hero is the one cinematic moment (the pour). Everything
   after it is a quiet, layered site where scroll = depth: the hero stays
   pinned underneath, and every section is a sheet sliding over it.
   ========================================================================= */

document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapReady = !!(window.gsap && window.ScrollTrigger);
if (gsapReady) gsap.registerPlugin(ScrollTrigger);

const mqDesktop = window.matchMedia("(min-width: 861px)");

/* -------------------------------------------------------------------------
   Smooth scroll
   ------------------------------------------------------------------------- */
let lenis = null;
if (gsapReady && !reducedMotion && window.Lenis) {
  lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  else target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
}

// In-page anchors go through Lenis so the momentum feel stays consistent.
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    closeNav();
    scrollToTarget(target);
  });
});

/* -------------------------------------------------------------------------
   Header + dropdown nav (top-left, next to the logo)
   ------------------------------------------------------------------------- */
const header = document.getElementById("siteHeader");
const navTrigger = document.getElementById("navTrigger");
const navPanel = document.getElementById("navPanel");

function openNav() {
  navPanel.classList.add("is-open");
  navPanel.setAttribute("aria-hidden", "false");
  navTrigger.setAttribute("aria-expanded", "true");
}
function closeNav() {
  if (!navPanel.classList.contains("is-open")) return;
  navPanel.classList.remove("is-open");
  navPanel.setAttribute("aria-hidden", "true");
  navTrigger.setAttribute("aria-expanded", "false");
}
navTrigger.addEventListener("click", () => (navPanel.classList.contains("is-open") ? closeNav() : openNav()));
document.addEventListener("click", (e) => { if (!header.contains(e.target)) closeNav(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeNav(); navTrigger.focus(); } });

function updateHeader() { header.classList.toggle("is-scrolled", window.scrollY > 40); }
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* -------------------------------------------------------------------------
   Live hours (America/New_York). Mon–Fri 6–4, Sat–Sun 7–4.
   ------------------------------------------------------------------------- */
(function liveHours() {
  const headerText = document.getElementById("headerHoursText");
  const headerWrap = document.getElementById("headerHours");
  const visitNow = document.getElementById("visitNow");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  let parts;
  try {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false });
    parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  } catch (err) { return; }

  const weekend = parts.weekday === "Sat" || parts.weekday === "Sun";
  const open = weekend ? 7 : 6;
  const close = 16;
  const now = (parseInt(parts.hour, 10) % 24) + parseInt(parts.minute, 10) / 60;
  const fmtHour = (h) => (h > 12 ? h - 12 : h) + (h >= 12 ? "pm" : "am");

  if (now >= open && now < close) {
    headerText.textContent = `Open now · until ${fmtHour(close)}`;
    if (visitNow) visitNow.innerHTML = `<strong>Open right now</strong> · doors close at ${fmtHour(close)}`;
  } else {
    headerWrap.classList.add("is-closed");
    const opensAt = now < open ? open : (parts.weekday === "Fri" || parts.weekday === "Sat" ? 7 : 6);
    const when = now < open ? "today" : "tomorrow";
    headerText.textContent = `Closed · opens ${when} ${fmtHour(opensAt)}`;
    if (visitNow) visitNow.innerHTML = `<strong>Closed right now</strong> · opens ${when} at ${fmtHour(opensAt)}`;
  }
})();

/* -------------------------------------------------------------------------
   Word masks: wrap every word in [data-words] so lines can rise out of a clip.
   ------------------------------------------------------------------------- */
(function splitWords() {
  document.querySelectorAll("[data-words]").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((piece) => {
            if (!piece) return;
            if (/^\s+$/.test(piece)) { frag.appendChild(document.createTextNode(" ")); return; }
            const outer = document.createElement("span");
            outer.className = "w";
            const inner = document.createElement("span");
            inner.textContent = piece;
            inner.style.transitionDelay = `${Math.min(i * 45, 900)}ms`;
            i += 1;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    };
    walk(el);
    el.querySelectorAll(".w > span").forEach((s) => { s.style.transition = "transform 1.15s cubic-bezier(0.22, 1, 0.36, 1)"; });
  });
})();

/* -------------------------------------------------------------------------
   Reveals — IntersectionObserver, so they work with or without GSAP.
   ------------------------------------------------------------------------- */
(function reveals() {
  const targets = document.querySelectorAll("[data-reveal], [data-words]");
  if (reducedMotion || !("IntersectionObserver" in window)) { targets.forEach((t) => t.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
  targets.forEach((t) => io.observe(t));
})();

/* -------------------------------------------------------------------------
   Hero: the pour. Text lands as the milk lands.
   ------------------------------------------------------------------------- */
(function hero() {
  const hero = document.getElementById("hero");
  const video = document.getElementById("heroVideo");
  const steps = hero.querySelectorAll("[data-hero-step]");
  steps.forEach((el) => { el.style.transitionDelay = `${(parseInt(el.dataset.heroStep, 10) - 1) * 140}ms`; });

  let revealed = false;
  const reveal = () => { if (revealed) return; revealed = true; hero.classList.add("is-revealed"); };

  if (reducedMotion) { reveal(); return; }

  // Reveal once the milk is visibly landing in the cup (~2s into the 10s
  // pour), or after a safety timeout if autoplay is blocked / the file is
  // missing, so nothing ever stays hidden.
  const REVEAL_AT = 0.22;
  video.addEventListener("timeupdate", () => {
    const d = video.duration || 10;
    if (video.currentTime / d >= REVEAL_AT) reveal();
  });
  // Only give up on the video if the element itself errors or the *last*
  // <source> fails (an earlier codec being unsupported is not a failure).
  video.addEventListener("error", reveal);
  const sources = video.querySelectorAll("source");
  if (sources.length) sources[sources.length - 1].addEventListener("error", reveal);
  const p = video.play && video.play();
  if (p && typeof p.catch === "function") p.catch(() => setTimeout(reveal, 400));
  setTimeout(reveal, 4200);

  // Keep the loop, but don't burn battery while it's hidden under the sheets.
  if (gsapReady) {
    ScrollTrigger.create({
      trigger: "#drinks", start: "top 20%",
      onEnter: () => video.pause(),
      onLeaveBack: () => { video.play && video.play().catch(() => {}); },
    });
  }
  // The pour plays once and holds on the finished latte instead of jump-cutting
  // back to the start; a very slow push-in keeps the frame alive afterwards.
  video.loop = false;
  video.addEventListener("ended", () => {
    video.pause();
    hero.classList.add("is-poured");
  });
})();

/* -------------------------------------------------------------------------
   Scroll-driven depth (GSAP only; the page is complete without it)
   ------------------------------------------------------------------------- */
if (gsapReady && !reducedMotion) {
  // 1. Hero recedes as the first sheet slides over it.
  gsap.timeline({
    scrollTrigger: { trigger: "#drinks", start: "top bottom", end: "top top", scrub: true },
  })
    .to("#heroStage", { scale: 0.92, yPercent: -4, ease: "none" }, 0)
    .to("#heroDim", { opacity: 0.7, ease: "none" }, 0)
    .to("#heroContent, .hero-foot", { yPercent: -18, opacity: 0, ease: "none" }, 0);

  // 2. Drinks rail — vertical scroll becomes sideways travel across the bar.
  ScrollTrigger.matchMedia({
    "(min-width: 861px)": () => {
      const track = document.getElementById("railTrack");
      const pin = document.getElementById("railPin");
      const travel = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: "#drinks",
          start: "top top",
          end: () => "+=" + travel(),
          pin: pin,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Each photo drifts inside its frame at a slightly different rate = parallax between card and image.
      document.querySelectorAll(".rail-card").forEach((card) => {
        const img = card.querySelector("img");
        if (!img) return;
        gsap.fromTo(img, { xPercent: -6 }, {
          xPercent: 6, ease: "none",
          scrollTrigger: { containerAnimation: tween, trigger: card, start: "left right", end: "right left", scrub: true },
        });
      });

      gsap.from(".rail-card", {
        y: 60, opacity: 0, duration: 1.2, ease: "power3.out", stagger: 0.07,
        scrollTrigger: { trigger: "#drinks", start: "top 60%", once: true },
      });
    },
    "(max-width: 860px)": () => {
      gsap.from(".rail-card", {
        y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.06,
        scrollTrigger: { trigger: "#drinks", start: "top 75%", once: true },
      });
    },
  });

  // 3. Why you'll stay — the sticky photo follows the reason you're reading.
  (function stay() {
    const figures = document.querySelectorAll("[data-stay-figure]");
    const counter = document.getElementById("stayCounterNum");
    const items = document.querySelectorAll("[data-stay-item]");
    const activate = (i) => {
      figures.forEach((f, j) => f.classList.toggle("is-active", i === j));
      items.forEach((it, j) => it.classList.toggle("is-active", i === j));
      if (counter) counter.textContent = String(i + 1);
    };
    activate(0);
    items.forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item, start: "top 60%", end: "bottom 60%",
        onEnter: () => activate(i), onEnterBack: () => activate(i),
      });
    });
  })();

  // 4. The room — background drifts slower than the page.
  gsap.fromTo(".room-bg img", { yPercent: -8, scale: 1.08 }, {
    yPercent: 8, scale: 1.08, ease: "none",
    scrollTrigger: { trigger: "#room", start: "top bottom", end: "bottom top", scrub: true },
  });

  // 5. Big closing line drifts up a touch slower than the sheet it sits on.
  gsap.from(".visit-title", {
    yPercent: 12, ease: "none",
    scrollTrigger: { trigger: "#visit", start: "top bottom", end: "top 30%", scrub: true },
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
} else {
  // No GSAP or reduced motion: still keep the stay-section photo in sync.
  const figures = document.querySelectorAll("[data-stay-figure]");
  const items = document.querySelectorAll("[data-stay-item]");
  const counter = document.getElementById("stayCounterNum");
  const activate = (i) => {
    figures.forEach((f, j) => f.classList.toggle("is-active", i === j));
    items.forEach((it, j) => it.classList.toggle("is-active", i === j));
    if (counter) counter.textContent = String(i + 1);
  };
  activate(0);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) activate(parseInt(e.target.dataset.stayItem, 10)); });
    }, { rootMargin: "-40% 0px -40% 0px" });
    items.forEach((it) => io.observe(it));
  }
}
