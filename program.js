 
 const bar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / total * 100) + '%';
    });
  
  
  
  
  const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shrink', window.scrollY > 60);
    }, { passive: true });

    // Hamburger
    const toggle  = document.getElementById('navToggle');
    const mobileM = document.getElementById('mobileMenu');

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
  const isInsideNav = navbar.contains(e.target);
  const isInsideMenu = mobileM.contains(e.target);

  if (!isInsideNav && !isInsideMenu && mobileM.classList.contains('open')) {
    toggle.classList.remove('open');
    mobileM.classList.remove('open');
  }
}, { passive: true });



    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => obs.observe(el));


  (function () {
    var slideshow = document.getElementById('danceSlideshow');
    if (!slideshow) return;

    var slides  = slideshow.querySelectorAll('.slide');
    var dots    = document.querySelectorAll('#slideDots .dot');
    var btnPrev = document.getElementById('slidePrev');
    var btnNext = document.getElementById('slideNext');
    var current = 0;
    var timer;

    function goTo(index) {
      slides[current].classList.remove('active');
      slides[current].classList.add('exit');
      dots[current].classList.remove('active');

      // clean up exit class after transition finishes
      (function (old) {
        setTimeout(function () {
          slides[old].classList.remove('exit');
        }, 750);
      })(current);

      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () { goTo(current - 1); startTimer(); });
    }
    if (btnNext) {
      btnNext.addEventListener('click', function () { goTo(current + 1); startTimer(); });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(this.getAttribute('data-index'), 10));
        startTimer();
      });
    });

    /* touch swipe support for iOS */
    var touchStartX = 0;
    slideshow.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slideshow.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
        startTimer();
      }
    }, { passive: true });

    startTimer();
  })();

  /* ── SCROLL REVEAL ── */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Skip on touch devices (iPhones, iPads). CSS already shows
    // content normally there — no animation, no opacity:0 risk.
    var isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isTouch || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });

    els.forEach(function (el) { observer.observe(el); });
  })();

  /* ── READ MORE TOGGLE (stub — replace with your real function) ── */
  function toggleReadMore5(e) {
    e.preventDefault();
    var extra = document.getElementById('approach');
    var btn   = document.getElementById('bttnapproach');
    if (!extra) return;
    if (extra.style.display === 'none' || extra.style.display === '') {
      extra.style.display = 'block';
      if (btn) btn.innerHTML = 'Read Less <i class="fas fa-arrow-up"></i>';
    } else {
      extra.style.display = 'none';
      if (btn) btn.innerHTML = 'Read More <i class="fas fa-arrow-right"></i>';
    }
  }







function toggleReadMore1(event){
    event.preventDefault();
    const ATcontent=document.getElementById('AT');
    const bttnAT=document.getElementById('bttnAT');

    ATcontent.classList.toggle('expanded');
     if(ATcontent.classList.contains('expanded')){
      bttnAT.textContent='Read Less ';
     }
     else{
      bttnAT.innerHTML='Read More ';
     }
  }

  function toggleReadMore2(event){
    event.preventDefault();
    const FNcontent=document.getElementById('FN');
    const bttnFN=document.getElementById('bttnFN');

    FNcontent.classList.toggle('expanded');
    if(FNcontent.classList.contains('expanded')){
      bttnFN.textContent='Read Less ';
    } 
    else{
      bttnFN.innerHTML='Read More ';
    }
  }