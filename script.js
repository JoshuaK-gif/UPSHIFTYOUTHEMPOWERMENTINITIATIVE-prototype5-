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
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileM.classList.remove('open');
      });
    }, { passive: true });



    
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const lbCounter = document.getElementById('lb-counter');
    let current = 0;

    function openLightbox(index) {
      current = index;
      updateLightbox();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function updateLightbox() {
      const item = items[current];
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = item.dataset.caption || '';
      lbCounter.textContent = (current + 1) + ' / ' + items.length;
    }

    function navigate(dir) {
      current = (current + dir + items.length) % items.length;
      // brief fade
      lbImg.style.opacity = '0';
      lbImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        updateLightbox();
        lbImg.style.opacity = '1';
        lbImg.style.transform = 'scale(1)';
      }, 150);
    }

    lbImg.style.transition = 'opacity 0.15s ease, transform 0.15s ease';

    items.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

  

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });


        const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const DURATION = 5000;

    function resetBar(index) {
      const fill = indicators[index].querySelector('.indicator__fill');
      fill.style.animation = 'none';
      fill.offsetHeight; // force reflow
      fill.style.animation = '';
    }

    function startBar(index) {
      const fill = indicators[index].querySelector('.indicator__fill');
      fill.style.animation = 'none';
      fill.offsetHeight;
      fill.style.animation = 'fill-bar ' + (DURATION / 1000) + 's linear forwards';
    }

    function goTo(next) {
      const prev = current;
      current = ((next % slides.length) + slides.length) % slides.length;

      // Same push style for all slides
      slides[prev].classList.remove('active');
      slides[prev].classList.add('exit');
      slides[current].classList.add('active');

      setTimeout(() => {
        slides[prev].classList.remove('exit');
      }, 2200);

      // Indicators
      indicators[prev].classList.remove('active');
      resetBar(prev);
      indicators[current].classList.add('active');
      startBar(current);
    }

    // Dot click
    indicators.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (i === current) return;
        clearInterval(timer);
        goTo(i);
        timer = setInterval(() => goTo(current + 1), DURATION);
      });
    });

    // Start first bar
    startBar(0);

    let timer = setInterval(() => goTo(current + 1), DURATION);   

    //button functions start here
  function toggleReadMore(event){
    event.preventDefault();
    const DMcontent=document.getElementById('DM');
    const bttn=document.getElementById('bttn');
    
    DMcontent.classList.toggle('expanded');
    if (DMcontent.classList.contains('expanded')){
      bttn.textContent='Read Less ←';
    }
    else{
      bttn.innerHTML='Read More →';
    }
  }

  function toggleReadMore1(event){
    event.preventDefault();
    const ATcontent=document.getElementById('AT');
    const bttnAT=document.getElementById('bttnAT');

    ATcontent.classList.toggle('expanded');
     if(ATcontent.classList.contains('expanded')){
      bttnAT.textContent='Read Less ←';
     }
     else{
      bttnAT.innerHTML='Read More →';
     }
  }

  function toggleReadMore2(event){
    event.preventDefault();
    const FNcontent=document.getElementById('FN');
    const bttnFN=document.getElementById('bttnFN');

    FNcontent.classList.toggle('expanded');
    if(FNcontent.classList.contains('expanded')){
      bttnFN.textContent='Read Less ←'
    } 
    else{
      bttnFN.innerHTML='Read More → '
    }
  }
 

  (function () {
  var stage   = document.getElementById('cardStage');
  var cards   = [document.getElementById('hc0'), document.getElementById('hc1'), document.getElementById('hc2')];
  var dots    = [document.getElementById('hd0'), document.getElementById('hd1'), document.getElementById('hd2')];
  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');
  var total   = cards.length;
  var PAUSE   = 5000;
  var TRANS   = 800;
  var GAP     = 40;
  var current = 0;
  var locked  = false;
  var timer   = null;

  function sw()  { return stage.offsetWidth; }
  function cw()  { return cards[0].offsetWidth; }
  function mid() { return (sw() - cw()) / 2; }
  function lft() { return mid() - cw() - GAP; }
  function rgt() { return mid() + cw() + GAP; }

  function snap(card, x, o) {
    card.style.transition = 'none';
    card.style.opacity    = String(o);
    card.style.transform  = 'translateX(' + x + 'px)';
  }
  function glide(card, x, o) {
    card.style.transition = 'transform ' + TRANS + 'ms cubic-bezier(0.4,0,0.2,1), opacity ' + TRANS + 'ms ease';
    card.style.opacity    = String(o);
    card.style.transform  = 'translateX(' + x + 'px)';
  }

  function setDots(i) {
    dots.forEach(function(d, j){ d.classList.toggle('active', j === i); });
  }

  function arrange(idx, animate) {
    var prev = (idx - 1 + total) % total;
    var next = (idx + 1) % total;
    setDots(idx);
    var fn = animate ? glide : snap;
    fn(cards[idx],  mid(), 1);
    fn(cards[prev], lft(), 0.2);
    fn(cards[next], rgt(), 0.2);
  }

  function goTo(direction) {
    if (locked) return;
    locked = true;
    clearTimeout(timer);

    var prev = (current - 1 + total) % total;
    var next = (current + 1) % total;

    if (direction === 'next') {
      var newNext = (current + 2) % total;
      glide(cards[current], lft(), 0.2);
      glide(cards[next],    mid(), 1);
      snap(cards[newNext], sw() + cw(), 0);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          glide(cards[newNext], rgt(), 0.2);
        });
      });
      glide(cards[prev], -(cw() + GAP + 60), 0);
      current = next;
    } else {
      var newPrev = (current - 2 + total) % total;
      glide(cards[current], rgt(), 0.2);
      glide(cards[prev],    mid(), 1);
      snap(cards[newPrev], -(cw() + GAP + 60), 0);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          glide(cards[newPrev], lft(), 0.2);
        });
      });
      glide(cards[next], sw() + cw(), 0);
      current = prev;
    }

    setDots(current);

    setTimeout(function(){
      locked = false;
      scheduleNext();
    }, TRANS + 50);
  }

  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(function(){ goTo('next'); }, PAUSE);
  }

  btnNext.addEventListener('click', function(){ goTo('next'); });
  btnPrev.addEventListener('click', function(){ goTo('prev'); });

  /* init */
  cards.forEach(function(c){ snap(c, sw() + cw(), 0); });
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      arrange(0, true);
      scheduleNext();
    });
  });

  window.addEventListener('resize', function(){ arrange(current, false); });
})();