/* ================================================================
   Akshay Kondala — Portfolio Script
   GSAP 3 + ScrollTrigger + Lenis smooth scroll
   ================================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   SMOOTH SCROLL — Lenis
   ================================================================ */

const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* ================================================================
   CUSTOM CURSOR
   ================================================================ */

const dot    = document.getElementById('cursorDot');
const ring   = document.getElementById('cursorRing');

let mx = -999, my = -999;
let rx = -999, ry = -999;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  gsap.to(dot, { x: mx, y: my, duration: 0.08, ease: 'none', overwrite: true });
});

(function rafCursor() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  gsap.set(ring, { x: rx, y: ry });
  requestAnimationFrame(rafCursor);
})();

const hoverTargets = 'a, button, .pcard, .ccard, .honor, .nav-logo';

document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
});

/* ================================================================
   HERO — TYPING + REVEAL
   ================================================================ */

const nameEl   = document.getElementById('typedName');
const cursorEl = document.getElementById('heroCursor');
const subEl    = document.getElementById('heroSub');
const metaEl   = document.getElementById('heroMeta');
const ctaEl    = document.getElementById('heroCta');
const scrollEl = document.getElementById('heroScroll');

function type(el, text, speed, onDone) {
  let i = 0;
  el.textContent = '';
  const tick = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) { clearInterval(tick); if (onDone) onDone(); }
  }, speed);
}

// "Hi, I'm" fades in first
gsap.from('.hero-hi', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.3 });

// Start typing name after delay
setTimeout(() => {
  type(nameEl, 'Akshay Kondala.', 72, () => {
    setTimeout(() => {
      cursorEl.style.display = 'none';

      gsap.to([subEl, metaEl, ctaEl, scrollEl], {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
      });
    }, 400);
  });
}, 700);

/* ================================================================
   NAV — appear after hero
   ================================================================ */

ScrollTrigger.create({
  start: 'top -100',
  onEnter:     () => document.getElementById('nav').classList.add('nav-up'),
  onLeaveBack: () => document.getElementById('nav').classList.remove('nav-up'),
});

/* ================================================================
   SECTION LABELS
   ================================================================ */

gsap.utils.toArray('.section-label').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    x: 0,
    duration: 0.65,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 90%' },
  });
});

/* ================================================================
   ABOUT
   ================================================================ */

// Headshot reveal
gsap.to('.about-photo', {
  opacity: 1, y: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about', start: 'top 72%' },
});

gsap.to('.about-big', {
  opacity: 1, y: 0,
  duration: 1.1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about', start: 'top 72%' },
});

gsap.to('.about-rule', {
  scaleX: 1,
  duration: 0.9,
  ease: 'power3.inOut',
  scrollTrigger: { trigger: '.about-rule', start: 'top 88%' },
});

gsap.to('.about-body', {
  opacity: 1, y: 0,
  duration: 0.85,
  stagger: 0.18,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about-right', start: 'top 75%' },
});

gsap.to('.about-pills span', {
  opacity: 1, y: 0,
  duration: 0.6,
  stagger: 0.08,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.about-pills', start: 'top 88%' },
});

/* ================================================================
   TECH — HORIZONTAL DRAG SCROLL
   ================================================================ */

const techOuter = document.getElementById('techOuter');
const techTrack = document.getElementById('techTrack');
const progressBar = document.getElementById('techProgress');

// Reveal cards on first sight
gsap.to('.pcard', {
  opacity: 1, y: 0,
  duration: 0.75,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.tech-section', start: 'top 78%' },
});

// Drag to scroll
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

function getMaxScroll() {
  return techTrack.scrollWidth - techOuter.offsetWidth;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

techOuter.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - techOuter.offsetLeft;
  scrollLeft = techOuter.scrollLeft;
  techOuter.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - techOuter.offsetLeft;
  const walk = (x - startX) * 1.4;
  techOuter.scrollLeft = scrollLeft - walk;
  updateProgress();
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  techOuter.style.userSelect = '';
});

// Touch: let native scroll handle momentum — progress bar updates via the scroll listener above

// Wheel: handle both horizontal trackpad swipes and vertical scroll
techOuter.addEventListener('wheel', (e) => {
  const hDelta = Math.abs(e.deltaX);
  const vDelta = Math.abs(e.deltaY);

  if (hDelta > 0) {
    // Two-finger horizontal trackpad swipe — let it scroll naturally
    e.preventDefault();
    techOuter.scrollLeft += e.deltaX;
  } else if (vDelta > 0) {
    // Vertical scroll — redirect into horizontal
    const atStart = techOuter.scrollLeft <= 0;
    const atEnd   = techOuter.scrollLeft >= getMaxScroll();
    if ((e.deltaY > 0 && atEnd) || (e.deltaY < 0 && atStart)) return;
    e.preventDefault();
    techOuter.scrollLeft += e.deltaY * 2;
  }
}, { passive: false });

// Progress bar: update on any native scroll
techOuter.addEventListener('scroll', updateProgress, { passive: true });

function updateProgress() {
  const max = getMaxScroll();
  if (!max) return;
  progressBar.style.width = clamp((techOuter.scrollLeft / max) * 100, 0, 100) + '%';
}

// Scroll into section → auto-scroll track slightly for hint
ScrollTrigger.create({
  trigger: '.tech-section',
  start: 'top 40%',
  once: true,
  onEnter: () => {
    gsap.to(techOuter, {
      scrollLeft: 60,
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: updateProgress,
    });
  },
});

/* ================================================================
   CARD 3-D TILT
   ================================================================ */

document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const rx = ((e.clientY - rect.top)  - cy) / cy * -5;
    const ry = ((e.clientX - rect.left) - cx) / cx *  5;
    gsap.to(card, {
      rotateX: rx, rotateY: ry,
      transformPerspective: 900,
      duration: 0.45,
      ease: 'power2.out',
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0, rotateY: 0,
      duration: 0.7,
      ease: 'power3.out',
    });
  });
});

/* ================================================================
   CREATIVE
   ================================================================ */

gsap.to('.creative-big', {
  opacity: 1, y: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.creative-section', start: 'top 70%' },
});

// TikTok frames stagger in
gsap.from('.tt-frame', {
  opacity: 0, y: 50,
  duration: 0.9,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.tiktok-row', start: 'top 78%' },
});

gsap.to('.ccard', {
  opacity: 1, y: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.creative-grid', start: 'top 78%' },
});

/* ================================================================
   EXPERIENCE TIMELINE
   ================================================================ */

// Draw the spine
gsap.to('.timeline-spine', {
  height: () => document.querySelector('.timeline').offsetHeight - 28,
  ease: 'none',
  scrollTrigger: {
    trigger: '.timeline',
    start: 'top 65%',
    end: 'bottom 45%',
    scrub: 0.6,
  },
});

gsap.to('.tl-item', {
  opacity: 1, x: 0,
  duration: 0.75,
  stagger: 0.18,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.timeline', start: 'top 72%' },
});

/* ================================================================
   RECOGNITION
   ================================================================ */

gsap.to('.honor', {
  opacity: 1, y: 0,
  duration: 0.65,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.honors-grid', start: 'top 80%' },
});

/* ================================================================
   CONTACT
   ================================================================ */

gsap.to(['.contact-eyebrow', '.contact-heading', '.contact-email', '.contact-links'], {
  opacity: 1, y: 0,
  duration: 0.9,
  stagger: 0.14,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-section', start: 'top 72%' },
});

/* ================================================================
   PARALLAX — hero grid + orb on scroll
   ================================================================ */

gsap.to('.hero-grid', {
  yPercent: 25,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
});

gsap.to('.hero-orb', {
  yPercent: 40,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
});

/* Parallax on floaters */
gsap.to('.geo-1', {
  yPercent: -60,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
});

gsap.to('.geo-2', {
  yPercent: 80,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
});

/* ================================================================
   NAV SMOOTH ANCHOR CLICKS (override Lenis)
   ================================================================ */

document.querySelectorAll('#nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  });
});

document.querySelectorAll('.hero-cta a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  });
});

/* ================================================================
   COUNTER ANIMATION (stat numbers in cards)
   ================================================================ */

function animateCount(el) {
  const raw = el.textContent.trim();
  // Strip commas so "1,200+" doesn't split into suffix ",200+"
  const stripped = raw.replace(/,/g, '');
  const num = parseFloat(stripped.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return;
  const prefix  = stripped.replace(/[0-9.]+.*$/, '');
  const suffix  = stripped.replace(/^[^0-9]*[0-9.]+/, '');
  const isFloat = stripped.includes('.');

  // Lock element width to final value upfront so growing text doesn't shift layout
  el.style.minWidth = el.offsetWidth + 'px';

  const obj = { val: 0 };
  gsap.to(obj, {
    val: num,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate: () => {
      const v = isFloat
        ? obj.val.toFixed(1)
        : Math.round(obj.val).toLocaleString(); // restores comma formatting
      el.textContent = prefix + v + suffix;
    },
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
}

document.querySelectorAll('.stat b, .tl-stat b').forEach(animateCount);

/* ================================================================
   VIDEO AUTOPLAY — custom start time + loop back to start point
   Change data-start="X" on each <video> to set seconds (e.g. 3.5)
   ================================================================ */

const ttVideos = document.querySelectorAll('.tt-video');

ttVideos.forEach(vid => {
  const startTime = parseFloat(vid.dataset.start) || 0;

  // Seek to start point once metadata is ready, then play
  vid.addEventListener('loadedmetadata', () => {
    vid.currentTime = startTime;
  });

  // Loop back to start point (instead of frame 0)
  vid.addEventListener('ended', () => {
    vid.currentTime = startTime;
    vid.play().catch(() => {});
  });
});

if (ttVideos.length) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      const startTime = parseFloat(vid.dataset.start) || 0;
      if (entry.isIntersecting) {
        // Reset to start point each time it comes into view
        vid.currentTime = startTime;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.2 });

  ttVideos.forEach(v => videoObserver.observe(v));
}

/* ================================================================
   REFRESH on load
   ================================================================ */

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  updateProgress();
});
