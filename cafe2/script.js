/* Main interactive behaviors: carousel, tabs, mobile menu, reviews (localStorage) */

document.addEventListener('DOMContentLoaded', function () {
  // ---------- Year in footer ----------
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Mobile menu toggle ----------
  const menuToggle = document.getElementById('menuToggle');
  const mainMenu = document.getElementById('mainMenu');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      if (mainMenu.style.display === 'flex') {
        mainMenu.style.display = 'none';
      } else {
        mainMenu.style.display = 'flex';
      }
    });
  }

  // ---------- Carousel ----------
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrapper = document.querySelector('.dots');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let current = 0;
  let carouselInterval = null;
  const INTERVAL_MS = 6000;

  function createDots() {
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.dataset.index = i;
      btn.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
      btn.addEventListener('click', () => goTo(i));
      dotsWrapper.appendChild(btn);
    });
  }

  function updateCarousel() {
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    const dots = Array.from(dotsWrapper.children);
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    updateCarousel();
    restartInterval();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startInterval() {
    carouselInterval = setInterval(next, INTERVAL_MS);
  }
  function restartInterval() {
    clearInterval(carouselInterval);
    startInterval();
  }

  createDots();
  updateCarousel();
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  startInterval();

  // Pause on hover
  const carouselEl = document.querySelector('.carousel');
  carouselEl.addEventListener('mouseenter', () => clearInterval(carouselInterval));
  carouselEl.addEventListener('mouseleave', startInterval);

  // ---------- Tabs ----------
  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const tabContents = Array.from(document.querySelectorAll('.tab-content'));

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      tabButtons.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });
      tabContents.forEach(tc => {
        const show = tc.id === target;
        tc.classList.toggle('active', show);
        if (show) {
          tc.removeAttribute('hidden');
        } else {
          tc.setAttribute('hidden', '');
        }
      });
    });
  });


  /*
  // ---------- Reviews (localStorage) ----------
  const STORAGE_KEY = 'alfa_reviews_v1';
  const reviewForm = document.getElementById('reviewForm');
  const reviewsList = document.getElementById('reviewsList');
  const clearReviewsBtn = document.getElementById('clearReviews');

  function loadReviews() {
    const raw = localStorage.getItem(STORAGE_KEY);
    let arr = [];
    try { arr = raw ? JSON.parse(raw) : []; } catch(e){ arr = []; }
    return Array.isArray(arr) ? arr : [];
  }

  function saveReviews(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function renderReviews() {
    const items = loadReviews();
    reviewsList.innerHTML = '';
    if (items.length === 0) {
      reviewsList.innerHTML = '<p style="color:var(--muted)">Aún no hay reseñas. ¡Sé el primero en dejarla!</p>';
      return;
    }
    items.slice().reverse().forEach(r => {
      const card = document.createElement('div');
      card.className = 'review-card';
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      card.innerHTML = `<p>${escapeHTML(r.comment)}</p>
                        <div class="author">${escapeHTML(r.name)} — <span style="color: #ffd700">${stars}</span></div>
                        <div style="color: rgba(255,255,255,0.55);font-size:.85rem;margin-top:6px">${new Date(r.date).toLocaleString()}</div>`;
      reviewsList.appendChild(card);
    });
  }

  function escapeHTML(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reviewName').value.trim();
      const rating = parseInt(document.getElementById('reviewRating').value, 10);
      const comment = document.getElementById('reviewText').value.trim();
      if (!name || !rating || !comment) return alert('Por favor completa todos los campos.');

      const current = loadReviews();
      current.push({ name, rating, comment, date: new Date().toISOString() });
      saveReviews(current);
      renderReviews();
      reviewForm.reset();
      alert('¡Gracias! Tu reseña fue guardada.');
    });
  }

  if (clearReviewsBtn) {
    clearReviewsBtn.addEventListener('click', () => {
      if (!confirm('¿Borrar todas las reseñas almacenadas en este navegador?')) return;
      localStorage.removeItem(STORAGE_KEY);
      renderReviews();
    });
  }

  renderReviews(); */

  // ---------- Accessibility: keyboard carousel controls ----------
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

});


/*funcion del video*/ 

function playVideo(card) {
  const video = card.querySelector("video");
  const isPlaying = !video.paused;

  // Pausar todos los demás videos
  document.querySelectorAll(".video-card video").forEach(v => {
    v.pause();
    v.currentTime = 0;
    v.parentElement.classList.remove("playing");
  });

  if (!isPlaying) {
    card.classList.add("playing");
    video.play();
  } else {
    card.classList.remove("playing");
    video.pause();
  }
}

document.getElementById("year").textContent = new Date().getFullYear();
