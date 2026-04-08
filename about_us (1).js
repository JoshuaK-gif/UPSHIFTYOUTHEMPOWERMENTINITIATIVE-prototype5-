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








   function toggleReadMore4(event){
    event.preventDefault();
    const introContent=document.getElementById('intro');
    const bttnIntro=document.getElementById('bttnintro');

    introContent.classList.toggle('expanded');
     if(introContent.classList.contains('expanded')){
      bttnIntro.textContent='Read Less ←';
     }
     else{
      bttnIntro.innerHTML='Read More →';
     }
  }

     function toggleReadMore5(event){
    event.preventDefault();
    const contapproach=document.getElementById('approach');
    const bttnapproach=document.getElementById('bttnapproach');

    contapproach.classList.toggle('expanded');
     if(contapproach.classList.contains('expanded')){
      bttnapproach.textContent='Read Less ←';
     }
     else{
      bttnapproach.innerHTML='Read More →';
     }
  }

 


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
 
