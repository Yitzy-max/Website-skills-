/* =====================================================================
   The Caffeine Haven — motion layer
   Lenis (momentum scroll) + GSAP ScrollTrigger. Everything degrades to a
   fully readable static page if a script fails or motion is reduced.
   ===================================================================== */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  // Static fallback: if GSAP never arrived, un-hide everything and stop.
  if (!hasGsap || reduced) {
    document.documentElement.classList.remove('js');
    openStatus();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.3, smoothWheel: true, syncTouch: false, lerp: 0.085 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { duration: 1.6 });
      });
    });
  }

  /* ---------- open / closed in the nav ---------- */
  openStatus();
  setInterval(openStatus, 60000);

  /* ---------- hero: intro, then the walk to the door ---------- */
  const hero = document.querySelector('.hero');
  const heroWrap = document.querySelector('.hero-wrap');

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .fromTo('.hero__out img', { scale: 1.1 }, { scale: 1, duration: 2.8, ease: 'power2.out' }, 0)
    .to('.hero__title .line > span', { y: 0, duration: 1.5, stagger: 0.11, ease: 'expo.out' }, 0.25)
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 1 }, 0.5)
    .to('.hero__lead', { opacity: 1, y: 0, duration: 1.1 }, 0.95)
    .to('.hero__cue', { opacity: 1, y: 0, duration: 1.1 }, 1.2);

  // Once the intro is done, the scroll timeline owns the exterior's scale.
  const walk = gsap.timeline({
    scrollTrigger: {
      trigger: heroWrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onEnter: () => intro.progress(1),
    },
    defaults: { ease: 'none' },
  });

  walk
    .to('.hero__content', { y: -60, opacity: 0, duration: 0.28 }, 0)
    .to('.hero__cue', { opacity: 0, duration: 0.15 }, 0)
    .to('.hero__out img', { scale: mobile ? 2.4 : 3.2, duration: 0.78, ease: 'power1.in' }, 0.04)
    .to('.hero__veil', { opacity: 0.2, duration: 0.5 }, 0.2)
    /* the room goes dark before the line lands, so it reads over any photo */
    .to('.hero__dark', { opacity: 0.62, duration: 0.2 }, 0.3)
    .to('.hero__dark', { opacity: 0.3, duration: 0.18 }, 0.66)
    .to('.hero__out', { opacity: 0, duration: 0.24 }, 0.58)
    .to('.hero__thresh-1', { opacity: 1, duration: 0.14 }, 0.36)
    .to('.hero__thresh-1', { opacity: 0, y: -24, duration: 0.14 }, 0.62)
    .to('.hero__in', { opacity: 1, duration: 0.24 }, 0.6)
    .to('.hero__in img', { scale: 1, duration: 0.42 }, 0.58)
    .fromTo('.hero__thresh-2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.16 }, 0.72);

  /* ---------- text reveals (masked lines, not fade-ups) ---------- */
  document.querySelectorAll('.h-display, .h-giant').forEach((h) => {
    const spans = h.querySelectorAll('.line > span');
    if (!spans.length) return;
    gsap.to(spans, {
      y: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: h, start: 'top 85%', once: true },
    });
  });

  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  /* ---------- image reveals: the frame opens, the photo settles ---------- */
  gsap.utils.toArray('.reveal-img').forEach((fig) => {
    const img = fig.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 82%', once: true } });
    tl.to(fig, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.out' }, 0)
      .to(img, { scale: 1, duration: 1.9, ease: 'expo.out' }, 0);
  });

  /* ---------- depth: parallax at different rates ---------- */
  const strength = mobile ? 0.55 : 1;
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) * strength;
    gsap.fromTo(el, { y: () => -speed * window.innerHeight }, {
      y: () => speed * window.innerHeight, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  });
  gsap.utils.toArray('[data-parallax-inner]').forEach((box) => {
    const img = box.querySelector('img');
    const speed = parseFloat(box.dataset.parallaxInner) * strength;
    gsap.fromTo(img, { yPercent: -speed * 50 }, {
      yPercent: speed * 50, ease: 'none',
      scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* ---------- the counter: sticky photo follows the list ---------- */
  const menuImgs = document.querySelectorAll('.counter__img');
  document.querySelectorAll('[data-menu-group]').forEach((group) => {
    ScrollTrigger.create({
      trigger: group, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return;
        menuImgs.forEach((f) => f.classList.toggle('is-active', f.dataset.menuImg === group.dataset.menuGroup));
      },
    });
  });

  /* ---------- wayfinding: which room are we in ---------- */
  const roomLabel = document.getElementById('roomLabel');
  let currentRoom = roomLabel.textContent;
  function setRoom(name) {
    if (name === currentRoom) return;
    currentRoom = name;
    roomLabel.classList.add('is-swapping');
    setTimeout(() => { roomLabel.textContent = name; roomLabel.classList.remove('is-swapping'); }, 260);
  }
  document.querySelectorAll('[data-room]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 60%', end: 'bottom 60%',
      onEnter: () => setRoom(sec.dataset.room),
      onEnterBack: () => setRoom(sec.dataset.room),
    });
  });

  /* the wayfinding label steps out before it can collide with the footer */
  const roomBox = document.querySelector('.room');
  const foot = document.querySelector('.foot');
  if (roomBox && foot) {
    ScrollTrigger.create({
      trigger: foot, start: 'top bottom',
      onEnter: () => roomBox.classList.add('is-gone'),
      onLeaveBack: () => roomBox.classList.remove('is-gone'),
    });
  }

  /* ---------- nav: hides on the way down, returns on the way up ---------- */
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -80', end: 'max',
    onUpdate: (self) => nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 200),
  });

  // Fonts change line heights; recompute triggers once they're in.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* ---------- helpers ---------- */
  function openStatus() {
    const el = document.getElementById('openStatus');
    if (!el) return;
    // Hours in America/New_York: Mon–Fri 6–4, Sat–Sun 7–4.
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const opens = (day === 0 || day === 6) ? 7 * 60 : 6 * 60;
    const closes = 16 * 60;
    if (mins >= opens && mins < closes) {
      el.textContent = 'Open now · till 4pm';
      el.classList.add('is-open');
    } else {
      const nextDay = mins >= closes ? (day + 1) % 7 : day;
      const nextOpens = (nextDay === 0 || nextDay === 6) ? '7am' : '6am';
      el.textContent = (mins >= closes ? 'Closed · opens tomorrow at ' : 'Closed · opens at ') + nextOpens;
      el.classList.remove('is-open');
    }
  }
})();
