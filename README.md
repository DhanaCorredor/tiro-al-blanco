# 🎯 Tiro al Blanco

Juego web interactivo inspirado en las casetas de tiro de feria. Apunta y dispara a los patos en movimiento antes de que se acabe el tiempo. Incluye 3 niveles, sistema de combo, ranking diario y datos en vivo de clima y noticias.

🌐 **Demo en vivo:** https://tiro-al-blanco-ten.vercel.app

---

## 🎮 Cómo se juega

1. Introduce tu nombre.
2. Elige nivel (Principiante / Intermedio / Experto).
3. Click en los patos. Encadena aciertos para activar el **combo** (multiplicador hasta x5).
4. Caza el **pato dorado** raro (vale 100 pts).
5. Gana puntos antes de que se acabe el tiempo y entra al podio del día.

## ⭐ Funcionalidades

- 3 niveles de dificultad progresivos
- Sistema de **combo** con multiplicador hasta x5
- **Pato dorado** raro (15% probabilidad, 100 pts)
- **Podio diario** top 3 con medallas oro/plata/bronce
- **Confeti + banner** al batir récord personal
- Persistencia con localStorage (puntuaciones, nombre, ciudad favorita)
- Música de feria + efectos de sonido (con mute)
- Efectos visuales: mirilla, plumas al acertar, screen shake, tiempo crítico pulsante
- Diseño responsive (Mobile First)
- Modal de ajustes (cambiar nombre, mute, borrar puntuaciones)

## 🌍 Integraciones externas

- **GNews** — titulares en carrusel rotativo
- **OpenWeatherMap** — clima por ciudad o por geolocalización del navegador
- **Geolocation API** — botón 📍 para usar la ubicación del usuario

## 🛠️ Stack

- HTML5 semántico
- CSS3 (animaciones, custom properties, mobile first)
- JavaScript Vanilla (ES Modules) — sin frameworks
- **Vercel Serverless Functions** (Node.js) para ocultar las API keys
- LocalStorage
- Diseño en [Figma](https://www.figma.com/proto/VnGMiJgMITOboXdDcvjNWA/Tiro-al-Blanco?node-id=0-1&t=QBiD9y0QOKEtWF8o-1)

## 🔐 Arquitectura: API keys ocultas

Las llamadas a GNews y OpenWeatherMap **no se hacen desde el navegador**. El frontend habla con dos endpoints internos del propio dominio:

```
navegador  →  /api/news      →  GNews
navegador  →  /api/weather   →  OpenWeatherMap
```

Esos endpoints son **Serverless Functions** que viven en `api/` y leen las claves desde variables de entorno del servidor (`GNEWS_API_KEY`, `OPENWEATHER_API_KEY`). Las keys nunca llegan al cliente, así que no se pueden extraer abriendo DevTools. Además se cachean 10 min en el CDN de Vercel para no quemar la cuota gratuita.

## 🧱 Estructura

```
tiro-al-blanco/
├── api/                       # Vercel Serverless Functions
│   ├── news.js                #   proxy a GNews
│   └── weather.js             #   proxy a OpenWeatherMap
├── assets/                    # Imágenes y sonidos
├── css/
│   ├── style.css              # Layout global, cards, footer
│   ├── game.css               # Pantallas, HUD, pato, efectos
│   ├── news.css               # Carrusel de noticias
│   └── error.css              # Página de error
├── data/
│   └── levels.js              # Configuración de niveles
├── features/
│   ├── api/
│   │   ├── api-connection.js  # Cliente del clima (→ /api/weather)
│   │   └── noticias.js        # Cliente de noticias (→ /api/news)
│   └── core/
│       ├── game.js            # Bucle principal, patos, combo, dorado
│       ├── score.js           # Render del podio
│       └── storage.js         # localStorage
├── pages/
│   └── error.html
├── sound/
│   └── sound.js               # Música y efectos
├── views.js                   # Pantallas, HUD, confeti, combo
├── main.js                    # Punto de entrada
├── index.html
├── package.json               # type: module (ES Modules en el frontend)
├── .env.example               # Plantilla de variables de entorno
└── README.md
```

## ⚙️ Cómo correrlo

### Producción
Ya está desplegado en Vercel: https://tiro-al-blanco-ten.vercel.app

### Desarrollo local

Necesitas [Vercel CLI](https://vercel.com/docs/cli) para que las Serverless Functions de `/api/*` funcionen también en local.

```bash
git clone https://github.com/DhanaCorredor/tiro-al-blanco.git
cd tiro-al-blanco
npm i -g vercel          # solo la primera vez
vercel link              # vincula el repo con tu proyecto de Vercel
vercel env pull .env     # descarga las variables de entorno
vercel dev               # arranca en http://localhost:3000
```

> ⚠️ Si abres `index.html` con Live Server o doble click, el clima y las noticias darán error porque `/api/*` solo existe en Vercel. Usa siempre `vercel dev`.

### Setup de las API keys (solo si forkeas el proyecto)

1. Regístrate en [GNews](https://gnews.io) y [OpenWeatherMap](https://openweathermap.org/api) y obtén tus claves gratuitas.
2. En Vercel → Settings → Environment Variables, crea:
   - `GNEWS_API_KEY` = tu clave de GNews
   - `OPENWEATHER_API_KEY` = tu clave de OpenWeatherMap
3. Marca ambas para **Production and Preview** y actívales el flag **Sensitive**.
4. Redeploy.

Variables documentadas en `.env.example`.

## 🚀 Despliegue

Solo en **Vercel** — necesita backend para las Serverless Functions. GitHub Pages no sirve porque es 100% estático.

Cualquier `git push` a `main` redespliega automáticamente.

## 📊 Metodología

- GitFlow
- Kanban
- Historias de usuario
- Sprint planning

## 👤 Autor

**[Dhana Corredor]**
- GitHub: [@DhanaCorredor](https://github.com/DhanaCorredor)
Proyecto de formación en Frontend Developer · Factoría F5 · 2026.

## ✅ Estado

Funcional y desplegado en vercel → https://tiro-al-blanco-ten.vercel.app

## 📄 Licencia

Este proyecto está bajo licencia [MIT](LICENSE) — eres libre de usarlo, modificarlo y distribuirlo.
