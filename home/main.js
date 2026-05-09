import { games } from "./games.js";

/**
 * Construye una tarjeta de juego a partir de la config en games.js.
 * Devuelve un nodo DOM listo para insertar.
 */
function createGameCard(game) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = game.url;
    card.dataset.accent = game.accent;
    card.setAttribute("aria-label", `Jugar a ${game.title}`);

    if (game.featured) card.classList.add("card--featured");
    if (game.layout === "wide") card.classList.add("card--wide");

    // Enlace aún no disponible → estado visual "próximamente"
    if (game.url === "#") {
        card.classList.add("card--pending");
        card.setAttribute("aria-disabled", "true");
    }

    const media = document.createElement("div");
    media.className = "card__media";
    const img = document.createElement("img");
    img.src = game.image;
    img.alt = game.title;
    img.loading = "lazy";
    media.append(img);

    const body = document.createElement("div");
    body.className = "card__body";

    if (game.tag) {
        const tag = document.createElement("span");
        tag.className = "card__tag";
        tag.textContent = game.tag;
        body.append(tag);
    }

    const title = document.createElement("h3");
    title.className = "card__title";
    title.textContent = game.title;
    body.append(title);

    if (game.description) {
        const desc = document.createElement("p");
        desc.className = "card__desc";
        desc.textContent = game.description;
        body.append(desc);
    }

    const btn = document.createElement("span");
    btn.className = "card__btn";
    btn.textContent = game.cta;
    body.append(btn);

    card.append(media, body);
    return card;
}

/**
 * Renderiza todas las tarjetas dentro del contenedor del grid.
 * Usa un DocumentFragment para evitar múltiples reflows.
 */
function renderGames(container, items) {
    const fragment = document.createDocumentFragment();
    for (const game of items) {
        fragment.append(createGameCard(game));
    }
    container.replaceChildren(fragment);
}

/**
 * Animación de entrada: las cards aparecen cuando entran en el viewport.
 */
function observeCards(container) {
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.15 }
    );

    for (const card of container.querySelectorAll(".card")) {
        observer.observe(card);
    }
}

const grid = document.querySelector("#games-grid");
if (grid) {
    renderGames(grid, games);
    observeCards(grid);
}
