// Llamamos a /api/news (serverless function en Vercel) en vez de GNews
// directamente — la API key vive en el servidor, no en el navegador.
const NEWS_API_URL = '/api/news';
const FALLBACK_IMAGE =
  'https://repararelpc.es/wp-content/uploads/2021/07/tecnologia.png';
const ROTATE_INTERVAL = 6000;
const DEFAULT_QUERY = 'tecnologia';
const MAX_RESULTS = 3;

let currentIndex = 0;
let rotateTimer = null;

async function fetchNews() {
  const container = document.getElementById('newsContainer');
  if (!container) return;

  container.innerHTML = '<p class="news-status">Cargando noticias...</p>';

  try {
    const params = new URLSearchParams({
      q: DEFAULT_QUERY,
      max: String(MAX_RESULTS)
    });

    const response = await fetch(`${NEWS_API_URL}?${params}`);

    if (!response.ok) {
      // GNews devuelve detalles del error en el body — los extraemos para
      // mostrar algo útil ("Invalid API key", "Daily limit exceeded", etc.)
      let detail = `HTTP ${response.status}`;
      try {
        const body = await response.json();
        if (Array.isArray(body?.errors)) {
          detail = body.errors.join(' · ');
        } else if (body?.errors && typeof body.errors === 'object') {
          detail = Object.values(body.errors).flat().join(' · ');
        } else if (body?.message) {
          detail = body.message;
        }
      } catch {
        /* response no era JSON */
      }
      throw new Error(detail);
    }

    const data = await response.json();
    if (!data.articles || data.articles.length === 0) {
      container.innerHTML =
        '<p class="news-status">No se encontraron noticias.</p>';
      return;
    }

    renderCarousel(container, data.articles);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    container.innerHTML = `<p class="news-status news-status--error">No se pudieron cargar las noticias: ${error.message}</p>`;
  }
}

function renderCarousel(container, articles) {
  container.innerHTML = '';
  currentIndex = 0;

  const carousel = document.createElement('div');
  carousel.className = 'news-carousel';

  const frame = document.createElement('div');
  frame.className = 'carousel-frame';

  articles.forEach((article, i) => {
    const card = createNewsCard(article);
    if (i === 0) card.classList.add('is-active');
    frame.appendChild(card);
  });

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';

  const prevBtn = createNavButton('‹', 'Noticia anterior');
  const nextBtn = createNavButton('›', 'Noticia siguiente');

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';

  articles.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Ir a noticia ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => {
      goTo(i, frame, dots);
      restartAutoRotate(frame, dots, articles.length);
    });
    dots.appendChild(dot);
  });

  prevBtn.addEventListener('click', () => {
    goTo(currentIndex - 1, frame, dots);
    restartAutoRotate(frame, dots, articles.length);
  });
  nextBtn.addEventListener('click', () => {
    goTo(currentIndex + 1, frame, dots);
    restartAutoRotate(frame, dots, articles.length);
  });

  controls.append(prevBtn, dots, nextBtn);
  carousel.append(frame, controls);
  container.appendChild(carousel);

  startAutoRotate(frame, dots, articles.length);
  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', () =>
    startAutoRotate(frame, dots, articles.length)
  );
}

function createNavButton(symbol, label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'carousel-nav';
  btn.setAttribute('aria-label', label);
  btn.textContent = symbol;
  return btn;
}

function goTo(index, frame, dots) {
  const cards = frame.querySelectorAll('.news-card');
  const dotEls = dots.querySelectorAll('.carousel-dot');
  const total = cards.length;
  if (total === 0) return;
  currentIndex = ((index % total) + total) % total;

  cards.forEach((c, i) => c.classList.toggle('is-active', i === currentIndex));
  dotEls.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
}

function startAutoRotate(frame, dots, total) {
  stopAutoRotate();
  if (total <= 1) return;
  rotateTimer = setInterval(() => {
    goTo(currentIndex + 1, frame, dots);
  }, ROTATE_INTERVAL);
}

function stopAutoRotate() {
  if (rotateTimer) {
    clearInterval(rotateTimer);
    rotateTimer = null;
  }
}

function restartAutoRotate(frame, dots, total) {
  stopAutoRotate();
  startAutoRotate(frame, dots, total);
}

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Construimos los nodos con createElement + textContent (no innerHTML con
// strings de la API) para evitar inyección de HTML.
function createNewsCard(article) {
  const card = document.createElement('article');
  card.className = 'news-card';

  const img = document.createElement('img');
  img.className = 'news-card-image';
  img.loading = 'lazy';
  img.src = article.image || FALLBACK_IMAGE;
  img.alt = article.title || 'Noticia';
  img.onerror = () => {
    img.src = FALLBACK_IMAGE;
  };

  const content = document.createElement('div');
  content.className = 'news-card-content';

  const header = document.createElement('div');
  header.className = 'news-header';

  const sourceBadge = document.createElement('span');
  sourceBadge.className = 'source-badge';
  sourceBadge.textContent = article.source?.name || 'Fuente desconocida';

  const date = document.createElement('span');
  date.className = 'date';
  date.textContent = formatDate(article.publishedAt);

  header.append(sourceBadge, date);

  const title = document.createElement('h3');
  title.textContent = article.title || 'Sin título';

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = article.description || 'Sin descripción disponible';

  const link = document.createElement('a');
  link.className = 'read-more';
  link.href = article.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Leer más →';

  content.append(header, title, description, link);
  card.append(img, content);

  return card;
}

document.addEventListener('DOMContentLoaded', fetchNews);
