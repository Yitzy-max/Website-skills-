/* =========================================================================
   The Caffeine Haven — motion layer
   Lenis (momentum scroll) + GSAP/ScrollTrigger (reveals, parallax, marquee,
   the hero's cup/pastry drop-in) + Three.js (atmosphere gallery hover-
   distortion only).

   Every WebGL texture first tries to load the shop's real photography from
   /images/*.jpg. If a file isn't there yet, it falls back to a soft,
   procedurally-generated gradient so the page never looks broken pre-launch.
   Swap in real photos and everything upgrades automatically — no code
   changes needed. See /images/README.md for the exact filenames expected.
   ========================================================================= */

// Three.js is dynamically imported (see bottom of file) inside a try/catch,
// deliberately NOT as a static `import` — a static import throws and aborts
// this entire module if the CDN is unreachable, which would also kill the
// GSAP-fallback reveal logic below and leave the whole page blank. Dynamic
// import keeps that failure contained to the WebGL enhancements only.
let THREE = null;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// If the GSAP/ScrollTrigger CDN failed to load for this visitor, don't let
// [data-reveal] content stay invisible forever — reveal it plainly and skip
// every GSAP-dependent block below.
const gsapReady = !!(window.gsap && window.ScrollTrigger);
if (!gsapReady) {
  document.querySelectorAll("[data-reveal], [data-reveal-mask], [data-reveal-clip]")
    .forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; el.style.clipPath = "none"; });
  document.querySelectorAll(".spread-item").forEach((el) => { el.style.opacity = "1"; el.style.transform = "translateX(-50%)"; });
  console.warn("[Caffeine Haven] GSAP failed to load — scroll animations disabled, content shown statically.");
}

/* -------------------------------------------------------------------------
   Lenis smooth scroll, wired into GSAP's ticker so ScrollTrigger stays in sync
   ------------------------------------------------------------------------- */
let lenis = null;
if (gsapReady && !reducedMotion && window.Lenis) {
  lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", () => window.ScrollTrigger && window.ScrollTrigger.update());
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

if (gsapReady) gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------
   Header: scroll state + dropdown nav panel
   ------------------------------------------------------------------------- */
(function header() {
  const header = document.getElementById("siteHeader");
  const trigger = document.getElementById("navTrigger");
  const panel = document.getElementById("navPanel");

  if (gsapReady) {
    ScrollTrigger.create({
      start: 60,
      onUpdate: (self) => header.classList.toggle("is-scrolled", self.scroll() > 60),
    });
  } else {
    // plain-JS fallback so the header still shades in on scroll without GSAP
    window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 60));
  }

  function closePanel() {
    trigger.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }
  function openPanel() {
    trigger.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  }

  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    isOpen ? closePanel() : openPanel();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !trigger.contains(e.target)) closePanel();
  });
  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", closePanel));
})();

/* -------------------------------------------------------------------------
   Scroll reveals — fade/rise, mask reveal, clip-path image reveal, parallax
   ------------------------------------------------------------------------- */
(function reveals() {
  if (reducedMotion || !gsapReady) return;

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  // hero copy plays immediately on load rather than waiting on scroll
  gsap.to(".hero [data-reveal]", {
    opacity: 1, y: 0, duration: 1.3, ease: "power3.out", stagger: 0.12, delay: 0.35,
  });

  gsap.utils.toArray("[data-reveal-mask]").forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(0 0 100% 0)" },
      {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.4,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 82%" },
      }
    );
  });

  gsap.utils.toArray("[data-reveal-clip]").forEach((el, i) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(12% 12% 12% 12% round 2px)", scale: 1.06 },
      {
        clipPath: "inset(0% 0% 0% 0% round 2px)",
        scale: 1,
        duration: 1.3,
        ease: "power3.out",
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: "top 90%" },
      }
    );
  });

  // gentle parallax on the story portrait
  const parallaxEl = document.querySelector("[data-parallax]");
  if (parallaxEl) {
    gsap.fromTo(
      parallaxEl,
      { y: -40 },
      {
        y: 40,
        ease: "none",
        scrollTrigger: { trigger: parallaxEl, start: "top bottom", end: "bottom top", scrub: 0.6 },
      }
    );
  }

  // hero: everything fades/lifts as the visitor scrolls past it, so the
  // cinematic open has a clear end before the rest of the page takes over
  gsap.to(".hero-spread", {
    y: 40,
    opacity: 0.5,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-godrays", {
    opacity: 0.3,
    y: -60,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-content", {
    y: 90,
    opacity: 0.4,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
})();

/* -------------------------------------------------------------------------
   HERO SPREAD — the cups and pastries drop in from above and settle onto
   the counter, back row (drinks) first, then the front row (pastries), so
   the shop's own menu feels like it's being set out in front of you. Pure
   DOM/GSAP — no Three.js dependency, so it plays immediately on load
   rather than waiting on the WebGL bootstrap at the bottom of this file.
   ------------------------------------------------------------------------- */
(function heroSpread() {
  const items = Array.from(document.querySelectorAll(".spread-item"));
  if (!items.length) return;

  if (reducedMotion || !gsapReady) {
    items.forEach((el) => { el.style.opacity = "1"; });
    return;
  }

  const back = items.filter((el) => el.dataset.row === "back");
  const front = items.filter((el) => el.dataset.row === "front");

  const tl = gsap.timeline({ delay: 0.5 });
  [back, front].forEach((row, rowIndex) => {
    tl.fromTo(
      row,
      { y: -160, opacity: 0, rotation: () => gsap.utils.random(-9, 9) },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 1,
        ease: "back.out(1.6)",
        stagger: 0.1,
      },
      rowIndex === 0 ? 0 : 0.35 // front row starts just after the back row begins
    );
  });

  // a slow, barely-there idle float once everything has landed — enough to
  // feel alive without ever looking like a loading animation
  tl.add(() => {
    items.forEach((el, i) => {
      gsap.to(el, {
        y: `+=${gsap.utils.random(4, 8)}`,
        duration: gsap.utils.random(2.6, 3.6),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.15,
      });
    });
  });
})();

/* -------------------------------------------------------------------------
   Marquee helper — continuous auto-slide, pauses gently on hover so a card
   or photo can actually be looked at. The track's content must already be
   duplicated in the HTML (aria-hidden on the copy) for a seamless loop;
   this just animates it from 0 to -50% and repeats.
   ------------------------------------------------------------------------- */
function initMarquee(track, duration) {
  if (!track || reducedMotion || !gsapReady) return;
  const tween = gsap.to(track, { xPercent: -50, duration, ease: "none", repeat: -1 });
  track.addEventListener("mouseenter", () => tween.timeScale(0.15));
  track.addEventListener("mouseleave", () => tween.timeScale(1));
}

initMarquee(document.getElementById("testimonialTrack"), 34);
// slower and longer — a leisurely pace suits a room built for lingering
initMarquee(document.getElementById("atmosphereTrack"), 55);

/* -------------------------------------------------------------------------
   Shared texture helper: real photo first, procedural gradient fallback.
   Stops lean into the brand palette — roasted copper, warm cream, amber,
   and a low dusk brown — so an unfinished image slot still feels intentional.
   ------------------------------------------------------------------------- */
const PLACEHOLDER_VARIANTS = {
  roast: ["#3B2A19", "#8F5E2E", "#C9884C"],
  cream: ["#2A2115", "#8B7F6C", "#E7A968"],
  amber: ["#241A10", "#C9884C", "#E3B75B"],
  dusk:  ["#1A140D", "#5C3B22", "#8F5E2E"],
};

function proceduralTexture(variant = "roast", seed = 0) {
  const stops = PLACEHOLDER_VARIANTS[variant] || PLACEHOLDER_VARIANTS.roast;
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  const angle = (seed * 47) % 360;
  const rad = (angle * Math.PI) / 180;
  const x1 = size / 2 + Math.cos(rad) * size * 0.6;
  const y1 = size / 2 + Math.sin(rad) * size * 0.6;
  const x2 = size / 2 - Math.cos(rad) * size * 0.6;
  const y2 = size / 2 - Math.sin(rad) * size * 0.6;

  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(0.55, stops[1]);
  grad.addColorStop(1, stops[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // soft radial "window light" for depth — low-key, like light through a
  // dim room rather than a bright vignette
  const vg = ctx.createRadialGradient(size * 0.28, size * 0.22, size * 0.04, size * 0.5, size * 0.5, size * 0.8);
  vg.addColorStop(0, "rgba(255,235,200,0.10)");
  vg.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, size, size);

  // fine grain
  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    imgData.data[i] += n;
    imgData.data[i + 1] += n;
    imgData.data[i + 2] += n;
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}


/* -------------------------------------------------------------------------
   ATMOSPHERE GALLERY — shared WebGL overlay: ripple / displacement
   distortion on hover
   ------------------------------------------------------------------------- */
function initGalleryDistortion() {
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length || reducedMotion || !gsapReady || window.matchMedia("(hover: none)").matches) return;

  const overlay = document.createElement("canvas");
  overlay.className = "gallery-distort-canvas";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "5",
    pointerEvents: "none",
    opacity: "0",
    borderRadius: "2px",
    transition: "opacity 0.35s ease",
  });
  document.body.appendChild(overlay);

  const renderer = new THREE.WebGLRenderer({ canvas: overlay, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTex: { value: null },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHoverStrength: { value: 0 },
    uTexAspect: { value: 1 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }`,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform vec2 uMouse;
      uniform float uHoverStrength;
      uniform float uTexAspect;
      uniform vec2 uResolution;

      vec2 coverUv(vec2 uv) {
        float boxAspect = uResolution.x / uResolution.y;
        vec2 scale = boxAspect > uTexAspect ? vec2(1.0, boxAspect / uTexAspect) : vec2(uTexAspect / boxAspect, 1.0);
        return (uv - 0.5) * scale + 0.5;
      }

      void main() {
        vec2 uv = vUv;
        vec2 toMouse = uv - uMouse;
        float dist = length(toMouse);
        float ripple = sin(dist * 26.0 - uHoverStrength * 6.0) * 0.5 + 0.5;
        float falloff = smoothstep(0.55, 0.0, dist);
        vec2 offset = normalize(toMouse + 0.0001) * ripple * falloff * 0.035 * uHoverStrength;
        gl_FragColor = texture2D(uTex, coverUv(uv + offset));
      }
    `,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  let active = null;
  let raf = null;

  function loop() {
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }

  items.forEach((item, idx) => {
    const frame = item.querySelector(".media-frame");
    const img = item.querySelector(".media-img");
    const variant = frame ? frame.dataset.placeholder || "roast" : "roast";

    item.addEventListener("mouseenter", async () => {
      active = item;
      const rect = frame.getBoundingClientRect();
      overlay.style.width = rect.width + "px";
      overlay.style.height = rect.height + "px";
      overlay.style.top = rect.top + "px";
      overlay.style.left = rect.left + "px";
      renderer.setSize(rect.width, rect.height, false);
      uniforms.uResolution.value.set(rect.width, rect.height);

      let tex;
      if (img && img.isConnected && img.complete && img.naturalWidth) {
        tex = new THREE.Texture(img);
        tex.needsUpdate = true;
        tex.colorSpace = THREE.SRGBColorSpace;
        uniforms.uTexAspect.value = img.naturalWidth / img.naturalHeight;
      } else {
        tex = proceduralTexture(variant, idx + 1);
        uniforms.uTexAspect.value = 4 / 5;
      }
      uniforms.uTex.value = tex;

      overlay.style.opacity = "1";
      gsap.to(uniforms.uHoverStrength, { value: 1, duration: 0.5, ease: "power2.out" });
      if (!raf) loop();
    });

    item.addEventListener("mousemove", (e) => {
      if (active !== item) return;
      const rect = frame.getBoundingClientRect();
      uniforms.uMouse.value.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
    });

    item.addEventListener("mouseleave", () => {
      overlay.style.opacity = "0";
      gsap.to(uniforms.uHoverStrength, {
        value: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          if (active === item) {
            active = null;
            if (raf) { cancelAnimationFrame(raf); raf = null; }
          }
        },
      });
    });
  });

  window.addEventListener("scroll", () => {
    if (active) {
      const frame = active.querySelector(".media-frame");
      const rect = frame.getBoundingClientRect();
      overlay.style.top = rect.top + "px";
      overlay.style.left = rect.left + "px";
    }
  });
}

/* -------------------------------------------------------------------------
   Footer year
   ------------------------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* -------------------------------------------------------------------------
   WebGL bootstrap — everything above this line works with zero dependency
   on Three.js. Only the atmosphere gallery's hover-distortion needs it, so
   it's loaded last, dynamically, and failure here can't blank the page.
   ------------------------------------------------------------------------- */
(async () => {
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js");
  } catch (err) {
    console.warn("[Caffeine Haven] Three.js failed to load — the gallery hover effect is disabled; the rest of the page is unaffected.", err);
    return;
  }
  initGalleryDistortion();
})();
