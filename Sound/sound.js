// Sistema de sonido corregido
const sounds = {
    // Usamos '../' para salir de la carpeta 'Sound' y entrar en 'assets'
    background: new Audio('../assets/sound/circus.wav'),
    hit: new Audio('../assets/sound/patosound.wav')
};

const volumes = {
    background: 0.3,
    hit: 0.7
};

// Configuración inicial
sounds.background.loop = true;
sounds.background.volume = volumes.background;
sounds.hit.volume = volumes.hit;

let isMuted = false;
let isBackgroundPlaying = false;

// FUNCIÓN PARA SONIDOS DE EFECTOS (ej: cuando das al pato)
export function playSound(soundName) {
    if (isMuted || !sounds[soundName]) return;
    
    // Clonamos el nodo para que se puedan reproducir varios sonidos de hit a la vez
    const soundClone = sounds[soundName].cloneNode();
    soundClone.volume = volumes[soundName] || 1;
    soundClone.play().catch(e => console.log("Audio de efecto bloqueado:", e));
}

// FUNCIONES PARA LA MÚSICA DE FONDO
export function playBackgroundMusic() {
    if (isMuted) return;
    
    sounds.background.play()
        .then(() => {
            isBackgroundPlaying = true;
        })
        .catch(e => console.log("Música bloqueada por el navegador:", e));
}

export function pauseBackgroundMusic() {
    sounds.background.pause();
    isBackgroundPlaying = false;
}

export function stopBackgroundMusic() {
    sounds.background.pause();
    sounds.background.currentTime = 0;
    isBackgroundPlaying = false;
}

export function toggleMute() {
    isMuted = !isMuted;

    // Si silenciamos, pausamos. Si quitamos silencio, reproducimos.
    if (isMuted) {
        sounds.background.pause();
    } else {
        if (isBackgroundPlaying) {
            sounds.background.play().catch(e => console.log(e));
        }
    }
    return isMuted;
}

export function getMuteState() {
    return isMuted;
}