/**
 * program.js - USYEI "What We Do" Page
 * Refactored to avoid collisions and provide smoother animations.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // ─── 1. NAVBAR & PROGRESS BAR ──────────────────────────────────────────
    // Note: We keep these if this page doesn't load script.js
    const navbar = document.getElementById('navbar');
    const bar = document.getElementById('progress-bar');
    
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          if (navbar) {
            navbar.classList.toggle('shrink', scrollY > 60);
          }

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

      document.addEventListener('click', (e) => {
        const isInsideNav = navbar && navbar.contains(e.target);
        const isInsideMenu = mobileM.contains(e.target);

        if (!isInsideNav && !isInsideMenu && mobileM.classList.contains('open')) {
          toggle.classList.remove('open');
          mobileM.classList.remove('open');
        }
      }, { passive: true });
    }

    // ─── 3. SCROLL REVEAL (Consolidated) ───────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      reveals.forEach(el => observer.observe(el));
    }

    // ─── 4. DANCE SLIDESHOW ────────────────────────────────────────────────
    const slideshow = document.getElementById('danceSlideshow');
    if (slideshow) {
      const slides = slideshow.querySelectorAll('.slide');
      const dots = document.querySelectorAll('#slideDots .dot');
      const btnPrev = document.getElementById('slidePrev');
      const btnNext = document.getElementById('slideNext');
      const SLIDE_PAUSE = 6000; // Slower automatic transition
      let currentIdx = 0;
      let slideTimer = null;

      const goToSlide = (index) => {
        slides[currentIdx].classList.remove('active');
        slides[currentIdx].classList.add('exit');
        if (dots[currentIdx]) dots[currentIdx].classList.remove('active');

        // Clean up exit class after transition finishes (matches CSS duration)
        const oldIdx = currentIdx;
        setTimeout(() => {
          slides[oldIdx].classList.remove('exit');
        }, 1500); // Matches slower 1.4s transition

        currentIdx = (index + slides.length) % slides.length;
        slides[currentIdx].classList.add('active');
        if (dots[currentIdx]) dots[currentIdx].classList.add('active');
      };

      const startSlideTimer = () => {
        clearInterval(slideTimer);
        slideTimer = setInterval(() => { goToSlide(currentIdx + 1); }, SLIDE_PAUSE);
      };

      if (btnPrev) {
        btnPrev.addEventListener('click', () => { goToSlide(currentIdx - 1); startSlideTimer(); });
      }
      if (btnNext) {
        btnNext.addEventListener('click', () => { goToSlide(currentIdx + 1); startSlideTimer(); });
      }

      dots.forEach((dot) => {
        dot.addEventListener('click', function () {
          const idx = parseInt(this.getAttribute('data-index'), 10);
          if (!isNaN(idx)) {
            goToSlide(idx);
            startSlideTimer();
          }
        });
      });

      // Touch support
      let touchStartX = 0;
      slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      slideshow.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
          goToSlide(diff > 0 ? currentIdx + 1 : currentIdx - 1);
          startSlideTimer();
        }
      }, { passive: true });

      startSlideTimer();
    }

    // ─── 5. READ MORE TOGGLES ──────────────────────────────────────────────
    window.toggleReadMore5 = function(e) {
      e.preventDefault();
      const extra = document.getElementById('approach');
      const btn = document.getElementById('bttnapproach');
      if (!extra) return;
      
      const isExpanded = extra.classList.toggle('expanded');
      if (btn) {
        btn.innerHTML = isExpanded ? 'Read Less <i class="fas fa-arrow-up"></i>' : 'Read More <i class="fas fa-arrow-right"></i>';
      }
      
      // Fallback for old style if no CSS class
      if (!extra.classList.contains('expanded')) {
          // Check if we should still use display if CSS is missing
          if (getComputedStyle(extra).maxHeight === 'none') {
             extra.style.display = extra.style.display === 'none' ? 'block' : 'none';
          }
      }
    };

    window.toggleReadMore1 = function(event) {
      event.preventDefault();
      const ATcontent = document.getElementById('AT');
      const bttnAT = document.getElementById('bttnAT');
      if (!ATcontent || !bttnAT) return;

      ATcontent.classList.toggle('expanded');
      bttnAT.textContent = ATcontent.classList.contains('expanded') ? 'Read Less' : 'Read More';
    };

    window.toggleReadMore2 = function(event) {
      event.preventDefault();
      const FNcontent = document.getElementById('FN');
      const bttnFN = document.getElementById('bttnFN');
      if (!FNcontent || !bttnFN) return;

      FNcontent.classList.toggle('expanded');
      bttnFN.textContent = FNcontent.classList.contains('expanded') ? 'Read Less' : 'Read More';
    };
  });
})();
