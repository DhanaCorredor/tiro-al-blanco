# 🎯 Juego Interactivo Tiro al Blanco

## 🚀 Descripción del Proyecto

Tiro al Blanco es un juego web interactivo inspirado en las ferias tradicionales, donde el usuario debe apuntar y acertar a objetivos en movimiento para conseguir la mayor puntuación posible antes de que se acabe el tiempo.

Este proyecto forma parte de la iniciativa Carnival DOM, desarrollada para la empresa AZARGame, y pone en práctica habilidades clave de desarrollo frontend como manipulación del DOM, eventos, animaciones y consumo de APIs.

## 🎯 Objetivo del Juego

- Apuntar con precisión usando el mouse o teclado
- Derribar objetivos en movimiento
- Acumular puntos en un tiempo limitado
- Superar niveles de dificultad progresivos

## 🧩 Funcionalidades

- Mecánicas del juego
- Sistema de puntería (mirilla)
- Objetivos animados en movimiento
- Temporizador de partida
- Sistema de puntuación
- Alertas de acierto o fallo
- Botón de reinicio

## ⭐ Funcionalidades Extra

- Niveles de dificultad progresivos (3 niveles)
- Sistema de **combo** (multiplicador hasta x5 al encadenar aciertos)
- **Pato dorado** raro (más rápido, vale 100 pts)
- **Confeti** y banner cuando bates tu récord
- **Podio** con top 3 (medallas oro/plata/bronce)
- Guardado de puntuaciones en localStorage
- Efectos visuales: mirilla, plumas al acertar, screen shake, tiempo crítico pulsante
- Música y sonidos interactivos con mute

## 🌍 Integración con APIs

- **GNews** — titulares en carrusel rotativo
- **OpenWeatherMap** — clima por ciudad y por geolocalización (humedad, viento, sensación)
- **Geolocation API** del navegador — botón 📍 para usar la ubicación del usuario

## 🎨 UX/UI

- Pantalla de inicio atractiva
- Diseño interactivo y estilo feria 🎡
- Experiencia inmersiva con sonidos y animaciones
- Eventos de usuario: click, teclado y mouse
- Diseño responsive (Mobile First)

## 🛠️ Tecnologías Utilizadas

- HTML5 (semántico)
- CSS3 (animaciones, responsive, custom properties)
- JavaScript (Vanilla, módulos ES)
- Fetch API (GNews + OpenWeatherMap)
- LocalStorage (puntuaciones, nombre del jugador, última ciudad)
- Figma ([diseño UI/UX](https://www.figma.com/proto/VnGMiJgMITOboXdDcvjNWA/Tiro-al-Blanco?node-id=0-1&t=QBiD9y0QOKEtWF8o-1))
- Git & GitFlow

## 🧱 Estructura del Proyecto

```
tiro-al-blanco/
├── assets/                  # Imágenes y sonidos
├── css/
│   ├── style.css            # Estilos globales (cards, layout, footer)
│   ├── game.css             # Pantallas, HUD, pato, efectos del juego
│   ├── news.css             # Carrusel de noticias
│   └── error.css            # Página de error
├── data/
│   └── levels.js            # Configuración de niveles
├── features/
│   ├── api/
│   │   ├── api-connection.js  # OpenWeatherMap (clima)
│   │   ├── noticias.js        # GNews (titulares)
│   │   ├── config.example.js  # Plantilla de claves
│   │   └── config.js          # Claves locales (gitignored)
│   └── core/
│       ├── game.js          # Bucle principal, patos, combo, dorado
│       ├── score.js         # Render del podio
│       └── storage.js       # localStorage
├── pages/
│   └── error.html
├── Sound/
│   └── sound.js
├── views.js                 # Pantallas, HUD, confeti, combo
├── main.js                  # Punto de entrada
├── index.html
├── .gitignore
└── README.md
```

## ⚙️ Instalación y Uso

Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/tiro-al-blanco.git
```

Entra en la carpeta:

```bash
cd tiro-al-blanco
```

Abre el proyecto en tu navegador:

```bash
open index.html
```

## 🔑 Configuración de APIs

El proyecto usa dos APIs externas:

- **OpenWeatherMap** — clima por ciudad / geolocalización.
- **GNews** (https://gnews.io/) — noticias del sidebar.

### Setup local

1. Regístrate en [GNews](https://gnews.io/) y copia tu API key.
2. Copia `features/api/config.example.js` a `features/api/config.js`.
3. Abre `features/api/config.js` y reemplaza `'TU_API_KEY_DE_GNEWS'` por tu clave real.

`features/api/config.js` está en `.gitignore`, así que tu clave nunca se sube al repo.

> ⚠️ Las claves usadas en el navegador siempre son visibles en DevTools.
> Para producción real, conviene servirlas a través de un proxy (Cloudflare Worker,
> función serverless de Vercel/Netlify, etc.).

## ⚠️ Manejo de Errores

- Permisos de geolocalización controlados
- Fallos de API no rompen la aplicación
- Mensajes claros para el usuario

## 🧠 Lógica del Juego (Resumen)

- Se inicia el temporizador
- Aparecen objetivos en movimiento
- El usuario hace click para disparar
- Se detecta colisión (hit o miss)
- Se actualiza la puntuación
- Finaliza el juego al terminar el tiempo

## 📦 Despliegue

Disponible en:

- GitHub Pages
- Netlify
- Vercel

## 📊 Metodología

- GitFlow
- Kanban
- Historias de usuario
- Sprint planning

## 📄 Entregables

- Wireframes
- Mockups (Figma)
- User Flow
- Flowchart
- Documentación técnica
- Repositorio en GitHub
- Enlace de despliegue

## 🧠 Habilidades Desarrolladas

- Manipulación del DOM
- Eventos en JavaScript
- Animaciones web
- Consumo de APIs
- Arquitectura frontend

## 👩‍💻 Autor/a

Desarrollado como proyecto de formación en Frontend Developer 🚀

## ⭐ Estado del Proyecto

🚧 En desarrollo (MVP)
