(function(){
  document.documentElement.classList.add('js');

  // ---------- Mobile nav toggle ----------
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ links.classList.remove('open'); });
    });
  }

  // ---------- Mark active nav link ----------
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === here || (here === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });

  // ---------- Scroll reveal (progressive enhancement, safe fallback) ----------
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal, .reveal-fade');
  if(reduceMotion || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function(el){ io.observe(el); });

    // Safety net: never let content stay hidden if the observer misbehaves.
    setTimeout(function(){
      items.forEach(function(el){ el.classList.add('is-visible'); });
    }, 2500);
  }

  // ---------- Reservation form — sends real data via FormSubmit.co ----------
  var form = document.getElementById('rez-form');
  var success = document.getElementById('success-panel');
  var rezError = document.getElementById('rez-error');
  if(form && success){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var nameField = document.getElementById('vardas');
      var name = (nameField && nameField.value.trim()) || 'svečiai';
      var submitBtn = form.querySelector('button[type=submit]');
      var endpoint = form.getAttribute('action');
      var formData = new FormData(form);

      if(rezError) rezError.style.display = 'none';
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Siunčiama…'; }

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(res){
        if(!res.ok) throw new Error('Siuntimas nepavyko');
        return res.json();
      })
      .then(function(){
        success.querySelector('h3').textContent = 'Ačiū, ' + name + '!';
        form.style.display = 'none';
        success.classList.add('show');
        success.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'center'});
      })
      .catch(function(){
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Siųsti rezervaciją'; }
        if(rezError) rezError.style.display = 'block';
      });
    });
  }

  // ---------- Gallery lightbox ----------
  var galleryLinks = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid a'));
  var lightbox = document.getElementById('lightbox');
  if(galleryLinks.length && lightbox){
    var lbImg = lightbox.querySelector('img');
    var idx = 0;

    function openAt(i){
      idx = (i + galleryLinks.length) % galleryLinks.length;
      lbImg.src = galleryLinks[idx].getAttribute('href');
      lbImg.alt = galleryLinks[idx].querySelector('img').alt || '';
      lightbox.classList.add('open');
    }
    function close(){ lightbox.classList.remove('open'); lbImg.src=''; }

    galleryLinks.forEach(function(a, i){
      a.addEventListener('click', function(e){ e.preventDefault(); openAt(i); });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.prev').addEventListener('click', function(){ openAt(idx-1); });
    lightbox.querySelector('.next').addEventListener('click', function(){ openAt(idx+1); });
    lightbox.addEventListener('click', function(e){ if(e.target === lightbox) close(); });
    document.addEventListener('keydown', function(e){
      if(!lightbox.classList.contains('open')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowRight') openAt(idx+1);
      if(e.key === 'ArrowLeft') openAt(idx-1);
    });
  }
})();
