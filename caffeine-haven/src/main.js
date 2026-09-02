import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';
import { createGalleryStage } from './webgl/gallery-stage.js';
import { createThumbDistortion } from './webgl/thumb-distortion.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Brand photography, generated with Higgsfield and hosted on Higgsfield's
 * media CDN. To self-host instead: download each file and swap these for
 * local paths (e.g. '/images/gallery-01.webp') under public/.
 */
const CDN = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3IkRZvhQJHVYjmx5uflJWyvBjWO';
export const HERO_VIDEO = `${CDN}/fd35faf5-2965-4332-8002-40ccbeb616a5.mp4`;
export const GALLERY_IMAGES = [
  `${CDN}/b6f1c31f-b03e-4242-96da-e7c2ea4b904c.webp`, // 01 the room (interior)
  `${CDN}/f2be7ef3-064c-4686-b2c9-6c535600a3cd.webp`, // 02 poured slow (latte)
  `${CDN}/bc0882e0-ad76-4a6e-882e-92c3d83ae37b.webp`, // 03 baked each morning (muffin)
  `${CDN}/c28a0278-4536-4759-98ab-57d6cb143681.webp`, // 04 out front (outdoor seating)
  `${CDN}/18fd06e0-d200-4afe-a8c8-a5d89580be08.webp`, // 05 the quiet corner (reading nook)
  `${CDN}/989a1da9-f7d8-4d2d-a516-bc570b340573.webp`, // 06 one cup at a time (pour-over)
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------------- */
/* Smooth scrolling (Lenis) wired into the GSAP ticker                     */
/* ---------------------------------------------------------------------- */

let lenis;
if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------------------------------------------------------------------- */
/* Header: hide on scroll-down, reveal on scroll-up, dropdown nav panel    */
/* ---------------------------------------------------------------------- */

function initHeader() {
  const header = document.querySelector('[data-header]');
  const trigger = document.getElementById('navTrigger');
  const panel = document.getElementById('navPanel');
  let lastY = window.scrollY;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 40);
      if (!panel.classList.contains('is-open')) {
        header.classList.toggle('is-hidden', y > lastY && y > 200);
      }
      lastY = y;
    },
  });

  function setOpen(open) {
    trigger.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    if (open) {
      header.classList.remove('is-hidden');
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }

  trigger.addEventListener('click', () => {
    setOpen(!panel.classList.contains('is-open'));
  });

  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
}

/* ---------------------------------------------------------------------- */
/* Hero: scroll-scrubbed background video                                  */
/* ---------------------------------------------------------------------- */

function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;
  video.src = HERO_VIDEO;

  const start = () => {
    if (prefersReducedMotion) {
      video.autoplay = true;
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      endTrigger: '.impact',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate(self) {
        if (!video.duration) return;
        video.currentTime = self.progress * (video.duration - 0.05);
      },
    });
  };

  if (video.readyState >= 1) {
    start();
  } else {
    video.addEventListener('loadedmetadata', start, { once: true });
  }
}

/* ---------------------------------------------------------------------- */
/* Generic scroll reveals                                                  */
/* ---------------------------------------------------------------------- */

function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: (i % 4) * 0.06,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });
}

/* ---------------------------------------------------------------------- */
/* Impact statement: word-by-word scroll reveal                            */
/* ---------------------------------------------------------------------- */

function initImpactSplit() {
  const el = document.querySelector('[data-split-lines]');
  if (!el) return;

  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(' ');

  gsap.to(el.querySelectorAll('.word'), {
    opacity: 1,
    stagger: 0.02,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: true,
    },
  });
}

/* ---------------------------------------------------------------------- */
/* Parallax layers (about / testimonials backdrops)                        */
/* ---------------------------------------------------------------------- */

function initParallax() {
  document.querySelectorAll('[data-parallax-section]').forEach((section) => {
    const layer = section.querySelector('[data-parallax-layer]');
    if (!layer) return;
    const speed = parseFloat(layer.dataset.speed || '0.2');

    gsap.fromTo(
      layer,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

/* ---------------------------------------------------------------------- */
/* Gallery: pinned Three.js crossfade stage + hover-distorted thumb rail   */
/* ---------------------------------------------------------------------- */

function initGallery() {
  const stageSection = document.querySelector('[data-gallery]');
  const canvas = document.querySelector('[data-gallery-canvas]');
  if (!stageSection || !canvas) return;

  const labels = [
    'The room',
    'Poured slow',
    'Baked each morning',
    'Out front',
    'The quiet corner',
    'One cup at a time',
  ];
  const images = GALLERY_IMAGES;

  const stage = createGalleryStage({
    canvas,
    captionIndexEl: document.querySelector('[data-gallery-index]'),
    captionLabelEl: document.querySelector('[data-gallery-label]'),
    labels,
    images,
  });

  const scrollDistancePerImage = window.innerWidth < 760 ? 0.6 : 1;

  const pinTrigger = ScrollTrigger.create({
    id: 'gallery-pin',
    trigger: '[data-gallery-stage]',
    start: 'top top+=88',
    end: () => `+=${(stage.frameCount - 1) * window.innerHeight * scrollDistancePerImage}`,
    pin: true,
    scrub: 0.5,
    onUpdate(self) {
      stage.setProgress(self.progress * (stage.frameCount - 1));
    },
  });

  // Thumbnail rail: click to jump, hover to distort
  const thumbs = gsap.utils.toArray('[data-thumb]');
  thumbs.forEach((thumb, i) => {
    const canvasEl = thumb.querySelector('[data-thumb-canvas]');
    const fx = createThumbDistortion(canvasEl, images[i]);

    thumb.addEventListener('pointermove', (e) => {
      const rect = thumb.getBoundingClientRect();
      fx.setMouse((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
    });
    thumb.addEventListener('pointerenter', () => fx.setHover(true));
    thumb.addEventListener('pointerleave', () => fx.setHover(false));

    thumb.addEventListener('click', () => {
      const target = pinTrigger.start + (i / (stage.frameCount - 1)) * (pinTrigger.end - pinTrigger.start);
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.1 });
      } else {
        gsap.to(window, { scrollTo: target, duration: 0.9, ease: 'power2.inOut' });
      }
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Misc                                                                     */
/* ---------------------------------------------------------------------- */

function initCdnImages() {
  document.querySelectorAll('[data-cdn-image]').forEach((img) => {
    const idx = Number(img.dataset.cdnImage);
    img.src = GALLERY_IMAGES[idx];
  });
}

function initFooterYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------- */

window.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroVideo();
  initCdnImages();
  initReveals();
  initImpactSplit();
  initParallax();
  initGallery();
  initFooterYear();
  ScrollTrigger.refresh();
});
