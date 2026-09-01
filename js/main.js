/* =========================================================================
   Il Giardinello Di Bacoli — motion layer
   Lenis (momentum scroll) + GSAP/ScrollTrigger (reveals, parallax, marquee)
   + Three.js (hero ambient crossfade, gallery hover-distortion)

   Every WebGL texture first tries to load the restaurant's real photography
   from /images/*.jpg. If a file isn't there yet, it falls back to a soft,
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
  console.warn("[Il Giardinello] GSAP failed to load — scroll animations disabled, content shown statically.");
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

  // gentle parallax on the About portrait
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

  // hero: quiet zoom-out as the visitor scrolls past it
  gsap.to(".hero-canvas", {
    scale: 1.12,
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
   Marquee helper — continuous auto-slide, pauses gently on hover so a card
   or photo can actually be read/looked at. The track's content must already
   be duplicated in the HTML (aria-hidden on the copy) for a seamless loop;
   this just animates it from 0 to -50% and repeats.
   ------------------------------------------------------------------------- */
function initMarquee(track, duration) {
  if (!track || reducedMotion || !gsapReady) return;
  const tween = gsap.to(track, { xPercent: -50, duration, ease: "none", repeat: -1 });
  track.addEventListener("mouseenter", () => tween.timeScale(0.15));
  track.addEventListener("mouseleave", () => tween.timeScale(1));
}

initMarquee(document.getElementById("testimonialTrack"), 34);
// slower and longer — this strip has more than double the cards, and a
// leisurely pace suits "a kitchen that doesn't hurry"
initMarquee(document.getElementById("galleryTrack"), 60);

/* -------------------------------------------------------------------------
   Shared texture helper: real photo first, procedural gradient fallback
   ------------------------------------------------------------------------- */
const PLACEHOLDER_VARIANTS = {
  warm:  ["#F3E6D4", "#D6B98A", "#8A6A45"],
  deep:  ["#E9DCC5", "#8C7A63", "#2A2521"],
  clay:  ["#F0D9C4", "#B99565", "#6B4E30"],
  toast: ["#F5E3C0", "#DFA85C", "#9C6B2E"],
  wine:  ["#EFDCC8", "#B97D5E", "#6E3C2C"],
};

function proceduralTexture(variant = "warm", seed = 0) {
  const stops = PLACEHOLDER_VARIANTS[variant] || PLACEHOLDER_VARIANTS.warm;
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

  // soft radial vignette for depth
  const vg = ctx.createRadialGradient(size * 0.3, size * 0.25, size * 0.05, size * 0.5, size * 0.5, size * 0.75);
  vg.addColorStop(0, "rgba(255,255,255,0.12)");
  vg.addColorStop(1, "rgba(0,0,0,0.18)");
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

function loadTextureWithFallback(url, variant, seed) {
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => { tex.colorSpace = THREE.SRGBColorSpace; resolve(tex); },
      undefined,
      () => resolve(proceduralTexture(variant, seed))
    );
  });
}

/* -------------------------------------------------------------------------
   HERO — ambient crossfade between images, custom wipe/dissolve shader
   ------------------------------------------------------------------------- */
async function initHero() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const sources = [
    { url: "../images/hero-1.jpg", variant: "warm", seed: 1 },
    { url: "../images/hero-2.jpg", variant: "clay", seed: 2 },
    { url: "../images/hero-3.jpg", variant: "deep", seed: 3 },
    { url: "../images/hero-4.jpg", variant: "warm", seed: 4 },
  ];
  const textures = await Promise.all(sources.map((s) => loadTextureWithFallback(s.url, s.variant, s.seed)));
  const noise = proceduralTexture("deep", 9);

  const uniforms = {
    uFrom: { value: textures[0] },
    uTo: { value: textures[1] },
    uNoise: { value: noise },
    uProgress: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTexAspect: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uFrom;
      uniform sampler2D uTo;
      uniform sampler2D uNoise;
      uniform float uProgress;
      uniform vec2 uResolution;
      uniform float uTexAspect;

      // cover-fit uv so the texture always fills the viewport without stretching
      vec2 coverUv(vec2 uv) {
        float screenAspect = uResolution.x / uResolution.y;
        vec2 scale = screenAspect > uTexAspect
          ? vec2(1.0, screenAspect / uTexAspect)
          : vec2(uTexAspect / screenAspect, 1.0);
        return (uv - 0.5) * scale + 0.5;
      }

      void main() {
        vec2 uv = coverUv(vUv);
        float n = texture2D(uNoise, vUv * 1.4).r;
        float edge = smoothstep(uProgress - 0.18, uProgress + 0.18, n * 0.85 + vUv.y * 0.15);
        vec4 a = texture2D(uFrom, uv);
        vec4 b = texture2D(uTo, uv);
        vec3 color = mix(b.rgb, a.rgb, edge);
        // slight darken at the wipe edge for a premium, filmic transition
        float edgeGlow = smoothstep(0.0, 0.06, abs(edge - 0.5) - 0.0) ;
        color *= 1.0 - (1.0 - edgeGlow) * 0.06;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uResolution.value.set(w, h);
  }
  resize();
  window.addEventListener("resize", resize);

  function setTexAspect(tex) {
    const img = tex.image;
    uniforms.uTexAspect.value = img && img.width ? img.width / img.height : 1.5;
  }
  setTexAspect(textures[0]);

  let i = 0;
  function render() { renderer.render(scene, camera); }
  render();

  if (reducedMotion || !gsapReady || textures.length < 2) return; // static frame is enough

  function nextSlide() {
    const from = i % textures.length;
    const to = (i + 1) % textures.length;
    uniforms.uFrom.value = textures[from];
    uniforms.uTo.value = textures[to];
    setTexAspect(textures[from]);
    uniforms.uProgress.value = 0;

    gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: render,
      onComplete: () => { i++; render(); },
    });
  }

  render();
  gsap.delayedCall(4.5, function loop() {
    nextSlide();
    gsap.delayedCall(6, loop);
  });
}

/* -------------------------------------------------------------------------
   GALLERY — shared WebGL overlay: ripple / displacement distortion on hover
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
    const variant = frame ? frame.dataset.placeholder || "warm" : "warm";

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
   on Three.js. Only the hero crossfade and gallery hover-distortion need it,
   so it's loaded last, dynamically, and failure here can't blank the page.
   ------------------------------------------------------------------------- */
(async () => {
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js");
  } catch (err) {
    console.warn("[Il Giardinello] Three.js failed to load — hero/gallery WebGL effects disabled; the rest of the page is unaffected.", err);
    return;
  }
  initHero();
  initGalleryDistortion();
})();
