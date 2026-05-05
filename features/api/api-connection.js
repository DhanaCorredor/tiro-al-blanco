// Llamamos a /api/weather (serverless function en Vercel) en vez de
// OpenWeatherMap directamente — la API key vive en el servidor.
const WEATHER_URL = '/api/weather';
const STORED_CITY = 'tiro-weather-city';
const DEFAULT_CITY = 'Madrid';

const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('ciudad');
const locateBtn = document.getElementById('locateBtn');
const display = document.getElementById('weatherDisplay');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ciudad = cityInput.value.trim();
    if (ciudad) obtenerClima({ q: ciudad });
  });
}

if (locateBtn) {
  locateBtn.addEventListener('click', obtenerUbicacionActual);
}

// Carga inicial: última ciudad consultada (localStorage) o ciudad por defecto.
const lastCity = localStorage.getItem(STORED_CITY) || DEFAULT_CITY;
obtenerClima({ q: lastCity });

async function obtenerClima(params) {
  setLoading();
  try {
    // El proxy /api/weather añade `appid`, `units` y `lang` en el servidor.
    const url = `${WEATHER_URL}?${new URLSearchParams(params)}`;

    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error('Ciudad no encontrada');
    const datos = await respuesta.json();
    mostrarClima(datos);
    try {
      localStorage.setItem(STORED_CITY, datos.name);
    } catch {}
  } catch (error) {
    setError(error.message);
  }
}

function obtenerUbicacionActual() {
  if (!navigator.geolocation) {
    setError('Tu navegador no soporta geolocalización.');
    return;
  }
  setLoading();
  navigator.geolocation.getCurrentPosition(
    (pos) =>
      obtenerClima({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      }),
    () => setError('No se pudo acceder a tu ubicación.')
  );
}

function setLoading() {
  if (!display) return;
  display.innerHTML = '<p class="weather-empty">Cargando clima...</p>';
}

function setError(msg) {
  if (!display) return;
  display.innerHTML = `<p class="weather-empty">${msg}</p>`;
}

function mostrarClima(datos) {
  if (!display) return;
  display.innerHTML = '';

  const main = document.createElement('div');
  main.className = 'weather-main';

  const icon = datos.weather?.[0]?.icon;
  if (icon) {
    const img = document.createElement('img');
    img.className = 'weather-icon';
    img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    img.alt = datos.weather[0].description || '';
    main.appendChild(img);
  }

  const temp = document.createElement('p');
  temp.className = 'weather-temp';
  temp.textContent = `${Math.round(datos.main.temp)}°C`;

  const city = document.createElement('p');
  city.className = 'weather-city';
  city.textContent = `${datos.name}, ${datos.sys.country}`;

  const desc = document.createElement('p');
  desc.className = 'weather-desc';
  desc.textContent = datos.weather?.[0]?.description || '';

  main.append(temp, city, desc);

  const stats = document.createElement('div');
  stats.className = 'weather-stats';
  stats.append(
    createStat('fa-droplet', `${datos.main.humidity}%`, 'Humedad'),
    createStat(
      'fa-wind',
      `${Math.round(datos.wind.speed * 3.6)} km/h`,
      'Viento'
    ),
    createStat(
      'fa-temperature-half',
      `${Math.round(datos.main.feels_like)}°`,
      'Sensación'
    )
  );

  display.append(main, stats);
}

function createStat(iconName, value, label) {
  const stat = document.createElement('div');
  stat.className = 'weather-stat';

  const icon = document.createElement('i');
  icon.className = `fas ${iconName}`;

  const val = document.createElement('span');
  val.className = 'weather-stat-value';
  val.textContent = value;

  const lbl = document.createElement('span');
  lbl.className = 'weather-stat-label';
  lbl.textContent = label;

  stat.append(icon, val, lbl);
  return stat;
}
