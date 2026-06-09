/**
 * animations.js  —  USYEI Website
 * Modern scroll & entrance animation system
 * Vanilla JS · No dependencies · 60 FPS target
 * ─────────────────────────────────────────────
 *  1. Reduced-motion guard
 *  2. Inject styles
 *  3. Progress bar
 *  4. Hero entrance (orchestrated, staggered)
 *  5. Scroll-reveal (fade + directional slide)
 *  6. Stagger children (cards/grids)
 *  7. Statistics counter
 *  8. Navbar shrink + glass effect
 *  9. Parallax on hero image
 * 10. Hover lift on cards
 * 11. Quote band word reveal
 * 12. Help-card spotlight glow
 * 13. Magnetic Buttons
 * 14. Floating Background Elements
 * 15. Advanced Micro-interactions
 */

(function () {
  'use strict';

  /* ── 1. REDUCED MOTION ───────────────────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ── 2. INJECT STYLES ────────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    /* ── Progress bar ── */
    #progress-bar {
      position: fixed;
      top: 0; left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, #e63946, #f4a261, #f4a261);
      z-index: 9999;
      transition: width 0.12s linear;
      border-radius: 0 2px 2px 0;
    }

    /* ── Reveal base ── */
    .usyei-reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1),
                  transform 0.7s cubic-bezier(.22,1,.36,1);
      will-change: opacity, transform;
    }
    .usyei-reveal.from-left  { transform: translateX(-40px); }
    .usyei-reveal.from-right { transform: translateX( 40px); }
    .usyei-reveal.from-scale { transform: scale(0.92) translateY(16px); }
    .usyei-reveal.visible {
      opacity: 1 !important;
      transform: none !important;
    }

    /* ── Stagger container ── */
    .usyei-stagger > * {
      opacity: 0;
      transform: translateY(28px) scale(0.97);
      transition: opacity 0.6s cubic-bezier(.22,1,.36,1),
                  transform 0.6s cubic-bezier(.22,1,.36,1);
      will-change: opacity, transform;
    }
    .usyei-stagger.visible > * {
      opacity: 1;
      transform: none;
    }

    /* ── Hero entrance ── */
    .hero-line-wrap {
      overflow: hidden;
      display: block;
    }
    .hero-line-inner {
      display: block;
      opacity: 0;
      transform: translateY(100%);
      transition: opacity 0.75s cubic-bezier(.22,1,.36,1),
                  transform 0.75s cubic-bezier(.22,1,.36,1);
    }
    .hero-line-inner.in {
      opacity: 1;
      transform: none;
    }
    .hero__tag, .hero__tagline {
      opacity: 0;
      transform: translateY(18px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .hero__tag.in, .hero__tagline.in {
      opacity: 1;
      transform: none;
    }

    /* ── Navbar glass ── */
    .usyei-navbar-scrolled {
      padding-top: 8px !important;
      padding-bottom: 8px !important;
      background: rgba(255,255,255,0.88) !important;
      backdrop-filter: blur(14px) saturate(160%) !important;
      -webkit-backdrop-filter: blur(14px) saturate(160%) !important;
      box-shadow: 0 2px 24px rgba(0,0,0,0.10) !important;
    }
    #site-header, .navbar {
      transition: padding 0.35s ease, background 0.35s ease,
                  box-shadow 0.35s ease !important;
    }

    /* ── Card hover lift ── */
    .news-card, .help-card, .program-card, .mv-card {
      transition: transform 0.35s cubic-bezier(.22,1,.36,1),
                  box-shadow 0.35s cubic-bezier(.22,1,.36,1) !important;
    }
    .news-card:hover, .help-card:hover, .program-card:hover {
      transform: translateY(-6px) scale(1.012) !important;
      box-shadow: 0 16px 48px rgba(0,0,0,0.14) !important;
    }
    .mv-card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 12px 36px rgba(0,0,0,0.12) !important;
    }

    /* ── Help-card spotlight glow ── */
    .help-card {
      position: relative;
      overflow: hidden;
    }
    .help-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle 180px at var(--mx, 50%) var(--my, 50%),
        rgba(230,57,70,0.10) 0%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      border-radius: inherit;
    }
    .help-card:hover::before { opacity: 1; }

    /* ── Quote band word reveal ── */
    .qb-word {
      display: inline-block;
      opacity: 0;
      transform: translateY(14px);
      transition: opacity 0.45s ease, transform 0.45s ease;
    }
    .qb-word.in {
      opacity: 1;
      transform: none;
    }

    /* ── Mission/Vision badge pop ── */
    .card-badge {
      opacity: 0;
      transform: scale(0.85);
      transition: opacity 0.5s ease 0.2s, transform 0.5s cubic-bezier(.34,1.56,.64,1) 0.2s;
    }
    .mv-card.visible .card-badge {
      opacity: 1;
      transform: none;
    }

    /* ── Section heading underline draw ── */
    .heading-underline {
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 0.7s cubic-bezier(.22,1,.36,1) 0.3s;
    }
    .heading-underline.in {
      transform: scaleX(1);
    }

    /* ── Scroll-indicator pulse ── */
    .scroll-indicator {
      animation: sciFadeSlide 1.4s ease 1.8s both,
                 sciPulse 2.2s ease 3.2s infinite;
    }
    @keyframes sciFadeSlide {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:none; }
    }
    @keyframes sciPulse {
      0%,100% { opacity: 0.7; transform: translateY(0); }
      50%      { opacity: 1;   transform: translateY(5px); }
    }

    /* ── Floating elements ── */
    .floating-shape {
      position: absolute;
      z-index: 0;
      pointer-events: none;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.15;
      will-change: transform;
    }

    /* ── Micro-interactions ── */
    .btn, .navlink, .program-card__icon, .help-icon, .social-icons a {
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                  box-shadow 0.3s ease, background 0.3s ease !important;
    }
    .social-icons a:hover {
      transform: scale(1.2) rotate(8deg);
    }
    .program-card__icon:hover, .help-icon:hover {
      transform: scale(1.1) rotate(-5deg);
    }

    /* ── Reduced motion overrides ── */
    @media (prefers-reduced-motion: reduce) {
      .usyei-reveal, .usyei-stagger > *,
      .hero-line-inner, .hero__tag, .hero__tagline,
      .qb-word, .card-badge {
        transition: opacity 0.2s ease !important;
        transform: none !important;
        animation: none !important;
        opacity: 0;
      }
      .usyei-reveal.visible, .usyei-stagger.visible > *,
      .hero-line-inner.in, .hero__tag.in, .hero__tagline.in,
      .qb-word.in, .mv-card.visible .card-badge { opacity: 1 !important; }
      .scroll-indicator { animation: none !important; opacity: 1; }
      .floating-shape { display: none; }
    }
  `;
  document.head.appendChild(style);

  /* ── 3. PROGRESS BAR ─────────────────────────────────────────────────────── */
  function initProgressBar() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = docHeight > 0
          ? Math.min((scrollTop / docHeight) * 100, 100) + '%'
          : '0%';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── 4. HERO ENTRANCE ───────────────────────────────────────────────────── */
  function animateHero() {
    // Tag line
    const tag = document.querySelector('.hero__tag');
    if (tag) setTimeout(() => tag.classList.add('in'), 80);

    // Title lines — wrap each <span class="line"> for clip reveal
    const titleLines = document.querySelectorAll('.hero__title .line');
    titleLines.forEach((line, i) => {
      const text = line.innerHTML;
      const wrap = document.createElement('span');
      wrap.className = 'hero-line-wrap';
      const inner = document.createElement('span');
      inner.className = 'hero-line-inner';
      inner.innerHTML = text;
      wrap.appendChild(inner);
      line.innerHTML = '';
      line.appendChild(wrap);
      setTimeout(() => inner.classList.add('in'), 200 + i * 160);
    });

    // Tagline with refined word reveal
    const tagline = document.querySelector('.hero__tagline');
    if (tagline) {
      const originalHTML = tagline.innerHTML;
      const words = tagline.innerText.split(' ');
      tagline.innerHTML = words.map((word, i) => `<span class="hero-word" style="display:inline-block; opacity:0; transform:translateY(10px); transition:all 0.4s ease ${i * 0.05}s">${word}</span>`).join(' ');
      
      const count = titleLines.length;
      setTimeout(() => {
        tagline.querySelectorAll('.hero-word').forEach(w => {
          w.style.opacity = '1';
          w.style.transform = 'none';
        });
      }, 200 + count * 160 + 200);
    }
  }

  /* ── 5. QUOTE BAND WORD REVEAL ──────────────────────────────────────────── */
  function initQuoteBand() {
    const blockquote = document.querySelector('.quote-band blockquote');
    if (!blockquote) return;

    const rawText = blockquote.textContent.trim();
    const words = rawText.split(/\s+/);
    blockquote.innerHTML = words
      .map(w => `<span class="qb-word">${w}</span>`)
      .join(' ');

    const spans = blockquote.querySelectorAll('.qb-word');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      spans.forEach((span, i) => {
        setTimeout(() => span.classList.add('in'), i * 45);
      });
    }, { threshold: 0.4 });
    observer.observe(blockquote);
  }

  /* ── 6. TAG SCROLL-REVEAL ELEMENTS ─────────────────────────────────────── */
  function tagRevealElements() {
    const revealSelectors = [
      'section h2', 'section h3',
      '.programs__header p',
      '.news-card',
      '.mv-card',
      '.footer-about', '.footer-links', '.footer-contact', '.footer-social',
      'section:not(:first-of-type) img',
    ];
    const skip = new Set();

    revealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (skip.has(el) || el.closest('.usyei-stagger')) return;
        if (el.classList.contains('usyei-reveal')) return;

        if (el.matches('h2, h3')) {
          const allH = Array.from(document.querySelectorAll('section h2, section h3'));
          const idx  = allH.indexOf(el);
          el.classList.add('usyei-reveal', idx % 2 === 0 ? 'from-left' : 'from-right');
        } else if (el.matches('.news-card, .mv-card')) {
          el.classList.add('usyei-reveal', 'from-scale');
        } else {
          el.classList.add('usyei-reveal');
        }
        skip.add(el);
      });
    });

    /* Stagger grids */
    const staggerSelectors = [
      '.news__grid',
      '.mv-wrapper',
      '.programs__cards',
      '[class*="grid"]',
      '[class*="cards"]',
      '[class*="features"]',
    ];
    staggerSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.classList.contains('usyei-stagger')) return;
        if (el.children.length < 2) return;
        el.classList.add('usyei-stagger');
        Array.from(el.children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 110}ms`;
        });
      });
    });

    /* Heading underline */
    document.querySelectorAll('.heading-underline').forEach(el => {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); }
      }, { threshold: 0.5 });
      io.observe(el);
    });
  }

  /* ── 7. INTERSECTION OBSERVER (reveal + stagger) ────────────────────────── */
  function initScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.usyei-reveal, .usyei-stagger')
        .forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.usyei-reveal, .usyei-stagger')
      .forEach(el => observer.observe(el));
  }

  /* ── 8. STATISTICS COUNTER ──────────────────────────────────────────────── */
  function initCounters() {
    const counterPattern = /^(\d[\d,]*)(\+|%|k)?$/;
    const candidates = document.querySelectorAll(
      '[class*="stat"] *, [class*="number"] *, [class*="count"] *,' +
      '[class*="impact"] h3, [class*="impact"] h2,' +
      '[class*="stat"] h3, [class*="stat"] h2'
    );

    const counters = [];
    candidates.forEach(el => {
      const text = el.textContent.trim().replace(/,/g, '');
      const match = text.match(counterPattern);
      if (!match) return;
      const target = parseInt(match[1], 10);
      if (isNaN(target) || target === 0) return;
      counters.push({ el, target, suffix: match[2] || '' });
    });

    if (counters.length === 0) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const c = counters.find(x => x.el === entry.target);
        if (!c) return;
        observer.unobserve(entry.target);
        animateCounter(c);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c.el));
  }

  function animateCounter({ el, target, suffix }) {
    const duration = 2000;
    const start    = performance.now();
    const easeOut  = t => 1 - Math.pow(1 - t, 3);
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(p) * target).toLocaleString() +
                       (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ── 9. NAVBAR SHRINK + GLASS ────────────────────────────────────────────── */
  function initNavbar() {
    const navbar =
      document.getElementById('navbar') ||
      document.querySelector('nav') ||
      document.querySelector('header');
    if (!navbar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        navbar.classList.toggle('usyei-navbar-scrolled', window.scrollY > 60);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── 10. PARALLAX ON HERO IMAGE ─────────────────────────────────────────── */
  function initParallax() {
    if (prefersReducedMotion) return;
    if ((navigator.hardwareConcurrency || 4) <= 2) return;

    const slides = document.querySelectorAll('.hero__image-bg .slide');
    if (slides.length === 0) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.22, 60);
        slides.forEach(s => {
          s.style.transform = `scale(1.08) translateY(${offset}px)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ── 11. HELP-CARD SPOTLIGHT GLOW ───────────────────────────────────────── */
  function initCardSpotlight() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.help-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
      });
    });
  }

  /* ── 13. MAGNETIC BUTTONS ───────────────────────────────────────────────── */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    const magnets = document.querySelectorAll('.btn, .navlink:last-child, .cta-dropdown-trigger');
    magnets.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ── 14. FLOATING BACKGROUND ELEMENTS ───────────────────────────────────── */
  function initFloatingShapes() {
    if (prefersReducedMotion) return;
    const sections = document.querySelectorAll('.hero, .programs, .sectionhelp');
    sections.forEach(section => {
      for (let i = 0; i < 3; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        const size = Math.random() * 200 + 100;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.background = i % 2 === 0 ? 'rgba(71,184,224,0.2)' : 'rgba(230,57,70,0.2)';
        shape.style.top = `${Math.random() * 80}%`;
        shape.style.left = `${Math.random() * 80}%`;
        section.appendChild(shape);

        animateShape(shape);
      }
    });
  }

  function animateShape(shape) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const duration = Math.random() * 3000 + 3000;
    
    shape.animate([
      { transform: 'translate(0, 0)' },
      { transform: `translate(${x}px, ${y}px)` },
      { transform: 'translate(0, 0)' }
    ], {
      duration: duration,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  }

  /* ── INIT ────────────────────────────────────────────────────────────────── */
  function init() {
    initProgressBar();
    animateHero();
    initQuoteBand();
    tagRevealElements();
    initScrollObserver();
    initCounters();
    initNavbar();
    initParallax();
    initCardSpotlight();
    initMagneticButtons();
    initFloatingShapes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
