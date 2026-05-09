// Fuente única de verdad para las tarjetas de la Galería de Juegos.
// Cuando cada grupo termine su proyecto, reemplaza `url: "#"` por el
// enlace real al juego desplegado. No hace falta tocar nada más.

export const games = [
    {
        id: "random-lucky",
        title: "Random Lucky",
        tag: "AZAR EXCLUSIVE",
        image: "./assets/img/random-lucky.png",
        cta: "PLAY NOW",
        accent: "yellow",
        featured: true,
        url: "https://mariaperis.github.io/CarnivalDOM_RandomLucky/" 
    },
    {
        id: "parejas",
        title: "Parejas",
        description: "Entrena tu memoria",
        image: "./assets/img/parejas.png",
        cta: "Launch",
        accent: "cyan",
        layout: "wide",
        url: "#" // TODO: reemplazar cuando el grupo entregue
    },
    {
        id: "trileros",
        title: "Trileros",
        image: "./assets/img/trileros.png",
        cta: "Bet",
        accent: "purple",
        url: "https://lexyarraez.github.io/game-trileros/"
    },
    {
        id: "tiro-al-blanco",
        title: "Tiro al blanco",
        image: "./assets/img/tiro-al-blanco.png",
        cta: "Aim",
        accent: "pink",
        url: "/"
    },
    {
        id: "piedra-papel-tijera",
        title: "Piedra / Papel / Tijera",
        image: "./assets/img/piedra-papel-tijera.png",
        cta: "Fight!",
        accent: "orange",
        url: "https://rock-paper-scissors-psi-gray.vercel.app/"
    }
];
