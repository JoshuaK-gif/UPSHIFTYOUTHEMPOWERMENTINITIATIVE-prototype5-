/**
 * script.js - USYEI Website
 * Consolidated and cleaned up to avoid conflicts with animations.js
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // ─── 1. NAVBAR & PROGRESS BAR ──────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    const bar = document.getElementById('progress-bar');
    
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Navbar shrink logic
          if (navbar) {
            navbar.classList.toggle('shrink', scrollY > 60);
          }

          // Progress bar logic
          if (bar) {
            const total = document.body.scrollHeight - window.innerHeight;
            if (total > 0) {
              bar.style.width = (scrollY / total * 100) + '%';
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ─── 2. MOBILE MENU / HAMBURGER ────────────────────────────────────────
    const toggle = document.getElementById('navToggle');
    const mobileM = document.getElementById('mobileMenu');

    if (toggle && mobileM) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        mobileM.classList.toggle('open');
      }, { passive: true });

      mobileM.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          if (link.classList.contains('mobile-dropdown-toggle')) {
            const content = link.nextElementSibling;
            if (content) content.classList.toggle('open');
          } else {
            toggle.classList.remove('open');
            mobileM.classList.remove('open');
          }
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        const isInsideNav = navbar && navbar.contains(e.target);
        const isInsideMenu = mobileM.contains(e.target);

        if (!isInsideNav && !isInsideMenu && mobileM.classList.contains('open')) {
          toggle.classList.remove('open');
          mobileM.classList.remove('open');
        }
      }, { passive: true });
    }

    // ─── 3. LIGHTBOX (GALLERY) ─────────────────────────────────────────────
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const lbCounter = document.getElementById('lb-counter');
    let currentImageIndex = 0;

    if (items.length > 0 && lightbox && lbImg) {
      const openLightbox = (index) => {
        currentImageIndex = index;
        updateLightbox();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      };

      const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      };

      const updateLightbox = () => {
        const item = items[currentImageIndex];
        const img = item.querySelector('img');
        if (img) {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
        }
        lbCaption.textContent = item.dataset.caption || '';
        lbCounter.textContent = (currentImageIndex + 1) + ' / ' + items.length;
      };

      const navigate = (dir) => {
        currentImageIndex = (currentImageIndex + dir + items.length) % items.length;
        // brief fade
        lbImg.style.opacity = '0';
        lbImg.style.transform = 'scale(0.96)';
        setTimeout(() => {
          updateLightbox();
          lbImg.style.opacity = '1';
          lbImg.style.transform = 'scale(1)';
        }, 150);
      };

      lbImg.style.transition = 'opacity 0.15s ease, transform 0.15s ease';

      items.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
      });

      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
      });
      
      // Close lightbox button listener (if exists)
      const closeBtn = lightbox.querySelector('.close-lightbox');
      if (closeBtn) {
          closeBtn.addEventListener('click', closeLightbox);
      } else {
          // Fallback: click on lightbox background to close
          lightbox.addEventListener('click', (e) => {
              if (e.target === lightbox) closeLightbox();
          });
      }
    }

    // ─── 4. HERO SLIDER ────────────────────────────────────────────────────
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const SLIDE_DURATION = 6500; // Slower automatic transition
    let slideIndex = 0;
    let sliderTimer = null;

    if (slides.length > 0) {
      const resetBar = (index) => {
        if (!indicators[index]) return;
        const fill = indicators[index].querySelector('.indicator__fill');
        if (fill) {
          fill.style.animation = 'none';
          fill.offsetHeight; // force reflow
          fill.style.animation = '';
        }
      };

      const startBar = (index) => {
        if (!indicators[index]) return;
        const fill = indicators[index].querySelector('.indicator__fill');
        if (fill) {
          fill.style.animation = 'none';
          fill.offsetHeight;
          fill.style.animation = 'fill-bar ' + (SLIDE_DURATION / 1000) + 's linear forwards';
        }
      };

      const goToSlide = (next) => {
        const prev = slideIndex;
        slideIndex = ((next % slides.length) + slides.length) % slides.length;

        slides[prev].classList.remove('active');
        slides[prev].classList.add('exit');
        slides[slideIndex].classList.add('active');

        setTimeout(() => {
          slides[prev].classList.remove('exit');
        }, 2500); // Matches slower transition in CSS (if updated)

        if (indicators.length > 0) {
          indicators[prev].classList.remove('active');
          resetBar(prev);
          indicators[slideIndex].classList.add('active');
          startBar(slideIndex);
        }
      };

      indicators.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          if (i === slideIndex) return;
          clearInterval(sliderTimer);
          goToSlide(i);
          sliderTimer = setInterval(() => goToSlide(slideIndex + 1), SLIDE_DURATION);
        });
      });

      startBar(0);
      sliderTimer = setInterval(() => goToSlide(slideIndex + 1), SLIDE_DURATION);
    }

    // ─── 5. READ MORE BUTTONS ──────────────────────────────────────────────
    window.toggleReadMore = function(event) {
      event.preventDefault();
      const DMcontent = document.getElementById('DM');
      const bttn = document.getElementById('bttn');
      if (!DMcontent || !bttn) return;

      DMcontent.classList.toggle('expanded');
      bttn.textContent = DMcontent.classList.contains('expanded') ? 'Read Less ←' : 'Read More →';
    };

    window.toggleReadMore1 = function(event) {
      event.preventDefault();
      const ATcontent = document.getElementById('AT');
      const bttnAT = document.getElementById('bttnAT');
      if (!ATcontent || !bttnAT) return;

      ATcontent.classList.toggle('expanded');
      bttnAT.textContent = ATcontent.classList.contains('expanded') ? 'Read Less ←' : 'Read More →';
    };

    window.toggleReadMore2 = function(event) {
      event.preventDefault();
      const FNcontent = document.getElementById('FN');
      const bttnFN = document.getElementById('bttnFN');
      if (!FNcontent || !bttnFN) return;

      FNcontent.classList.toggle('expanded');
      bttnFN.textContent = FNcontent.classList.contains('expanded') ? 'Read Less ←' : 'Read More →';
    };
(function () {
      'use strict';

      var card = document.querySelector('.usyei-mission .usyei-mission__card');
      if (!card) return;

      // If IntersectionObserver not supported, show immediately
      if (!('IntersectionObserver' in window)) {
        card.classList.add('um-visible');
        return;
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('um-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -48px 0px'
        }
      );

      observer.observe(card);
    })();
  /* ── Easing helper (easeOutExpo) ──────────────────────── */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  /* ── Format number with commas ────────────────────────── */
  function formatNumber(n) {
    return n.toLocaleString("en-US");
  }

  /* ── Count-up animation ───────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || "";
    const duration = 2000; // ms
    const start    = performance.now();

    // Respect reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = formatNumber(target) + suffix;
      el.classList.add("count-done");
      return;
    }

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutExpo(progress);
      const current  = Math.round(eased * target);

      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target) + suffix;
        // Pulse effect after counting finishes
        el.classList.remove("count-done");
        // Force reflow to re-trigger animation
        void el.offsetWidth;
        el.classList.add("count-done");
      }
    }

    requestAnimationFrame(step);
  }

  /* ── Scroll reveal + trigger counters ────────────────── */
  function initReveal() {
    const revealEls = document.querySelectorAll("[data-reveal]");
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const el = entry.target;

          // Staggered delay from attribute (CSS handles it, but we mark visible)
          el.classList.add("is-visible");

          // Trigger counter if this element contains a stat number
          const counter = el.querySelector(".stat-number[data-target]");
          if (counter && !counter.dataset.animated) {
            counter.dataset.animated = "true";

            // Delay counter start to align with card slide-in
            const delay = parseInt(el.dataset.revealDelay || 0, 10);
            setTimeout(function () {
              animateCounter(counter);
            }, delay + 300); // +300 so the card is fully visible first
          }

          observer.unobserve(el);
        });
      },
      {
        threshold: 0.15,        // trigger when 15 % of card is in view
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Floating background shapes (subtle parallax on mouse) ── */
  function initParallax() {
    const section = document.querySelector(".impact-section");
    const shapes  = document.querySelectorAll(".bg-shape");
    if (!section || !shapes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener("mousemove", function (e) {
      const rect = section.getBoundingClientRect();
      // Only when mouse is over the section
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      targetX = (e.clientX / window.innerWidth  - 0.5) * 14;
      targetY = (e.clientY / window.innerHeight - 0.5) * 10;
    });

    (function loop() {
      // Lerp toward target
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      shapes.forEach(function (shape, i) {
        const factor = 1 + i * 0.35;
        shape.style.transform =
          "translate(" + currentX * factor + "px, " + currentY * factor + "px)";
      });

      requestAnimationFrame(loop);
    })();
  }

  /* ── Init on DOM ready ───────────────────────────────── */
  function init() {
    initReveal();
    initParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
;


    // ─── 6. CARD CAROUSEL (HELP SECTION) ──────────────────────────────────
    (function () {
      const stage = document.getElementById('cardStage');
      if (!stage) return;

      const cards = [document.getElementById('hc0'), document.getElementById('hc1'), document.getElementById('hc2')].filter(el => el);
      const dots = [document.getElementById('hd0'), document.getElementById('hd1'), document.getElementById('hd2')].filter(el => el);
      const btnPrev = document.getElementById('btnPrev');
      const btnNext = document.getElementById('btnNext');
      
      if (cards.length === 0) return;

      const total = cards.length;
      const PAUSE = 5000;
      const TRANS = 800;
      const GAP = 40;
      let currentIdx = 0;
      let isLocked = false;
      let carouselTimer = null;

      const sw = () => stage.offsetWidth;
      const cw = () => cards[0].offsetWidth;
      const mid = () => (sw() - cw()) / 2;
      const lft = () => mid() - cw() - GAP;
      const rgt = () => mid() + cw() + GAP;

      function snap(card, x, o) {
        if (!card) return;
        card.style.transition = 'none';
        card.style.opacity = String(o);
        card.style.transform = 'translateX(' + x + 'px)';
      }
      function glide(card, x, o) {
        if (!card) return;
        card.style.transition = 'transform ' + TRANS + 'ms cubic-bezier(0.4,0,0.2,1), opacity ' + TRANS + 'ms ease';
        card.style.opacity = String(o);
        card.style.transform = 'translateX(' + x + 'px)';
      }

      function setDots(i) {
        dots.forEach((d, j) => { d.classList.toggle('active', j === i); });
      }

      function arrange(idx, animate) {
        const prev = (idx - 1 + total) % total;
        const next = (idx + 1) % total;
        setDots(idx);
        const fn = animate ? glide : snap;
        fn(cards[idx], mid(), 1);
        fn(cards[prev], lft(), 0.2);
        fn(cards[next], rgt(), 0.2);
      }

      function goTo(direction) {
        if (isLocked) return;
        isLocked = true;
        clearTimeout(carouselTimer);

        const prev = (currentIdx - 1 + total) % total;
        const next = (currentIdx + 1) % total;

        if (direction === 'next') {
          const newNext = (currentIdx + 2) % total;
          glide(cards[currentIdx], lft(), 0.2);
          glide(cards[next], mid(), 1);
          snap(cards[newNext], sw() + cw(), 0);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              glide(cards[newNext], rgt(), 0.2);
            });
          });
          glide(cards[prev], -(cw() + GAP + 60), 0);
          currentIdx = next;
        } else {
          const newPrev = (currentIdx - 2 + total) % total;
          glide(cards[currentIdx], rgt(), 0.2);
          glide(cards[prev], mid(), 1);
          snap(cards[newPrev], -(cw() + GAP + 60), 0);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              glide(cards[newPrev], lft(), 0.2);
            });
          });
          glide(cards[next], sw() + cw(), 0);
          currentIdx = prev;
        }

        setDots(currentIdx);

        setTimeout(() => {
          isLocked = false;
          scheduleNext();
        }, TRANS + 50);
      }

      function scheduleNext() {
        clearTimeout(carouselTimer);
        carouselTimer = setTimeout(() => { goTo('next'); }, PAUSE);
      }

      if (btnNext) btnNext.addEventListener('click', () => { goTo('next'); });
      if (btnPrev) btnPrev.addEventListener('click', () => { goTo('prev'); });

      // Init carousel
      cards.forEach((c) => { snap(c, sw() + cw(), 0); });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          arrange(0, true);
          scheduleNext();
        });
      });

      window.addEventListener('resize', () => { arrange(currentIdx, false); });
    })();
  });
})();
