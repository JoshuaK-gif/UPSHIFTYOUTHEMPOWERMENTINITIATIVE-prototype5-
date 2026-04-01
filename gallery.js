  const bar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / total * 100) + '%';
    });
  
  
    // Navbar shrink
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
    });
    mobileM.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileM.classList.remove('open');
      });
    });

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

    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-backdrop').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });