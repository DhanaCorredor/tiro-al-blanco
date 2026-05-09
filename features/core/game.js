// game.js
import { updateHUD, showGameOver, updateCombo } from '../../views.js';
import { getLevel } from '../../data/levels.js';
import { playSound } from '../../Sound/sound.js'; // Importamos el sistema de sonido
import { saveScore, getBestScores } from './storage.js';
import { updateDailyWinnerView } from './score.js';

const GOLDEN_DUCK_CHANCE = 0.15;
const GOLDEN_DUCK_POINTS = 100;
const MAX_COMBO_MULTIPLIER = 5;

export const game = {
    score: 0,
    time: 0,
    currentLevel: 1,
    isPlaying: false,
    timerInterval: null,
    spawnInterval: null,
    hits: 0,
    shots: 0,
    combo: 0,

    // Iniciar nuevo juego
    startGame(level) {
        this.stopIntervals();

        this.currentLevel = level;
        const levelConfig = getLevel(level);

        this.isPlaying = true;
        this.score = 0;
        this.hits = 0;
        this.shots = 0;
        this.combo = 0;
        this.time = levelConfig.time;

        this.clearCanvas();
        updateHUD(this.score, this.time);
        updateCombo(0);

        this.startTimer();
        this.spawnDuck();
        this.startSpawning();
    },

    // Limpiar el canvas manteniendo el botón de pausa
    clearCanvas() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        canvas.querySelectorAll('.duck').forEach(duck => duck.remove());
    },

    // Iniciar temporizador
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.time--;
            updateHUD(this.score, this.time);

            if (this.time <= 0) {
                this.endGame();
            }
        }, 1000);
    },

    // Iniciar generación de patos
    startSpawning() {
        const levelConfig = getLevel(this.currentLevel);
        this.spawnInterval = setInterval(() => {
            this.spawnDuck();
        }, levelConfig.spawnInterval);
    },

    // Crear y mostrar un pato
    spawnDuck() {
        if (!this.isPlaying) return;

        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        const levelConfig = getLevel(this.currentLevel);

        const duck = document.createElement('div');
        duck.className = 'duck';

        const isGolden = Math.random() < GOLDEN_DUCK_CHANCE;
        if (isGolden) duck.classList.add('golden');

        const goRight = Math.random() > 0.5;
        duck.classList.add(goRight ? 'animate-right' : 'animate-left');
        // El recorrido depende del ancho del canvas — lo pasamos a la animación
        // como variable CSS (la usan @keyframes moveRight/moveLeft).
        duck.style.setProperty('--travel', `${canvas.offsetWidth + 80}px`);

        const baseSpeed = 5;
        const speed = baseSpeed / (levelConfig.speed * (isGolden ? 1.4 : 1));
        duck.style.animationDuration = `${speed}s`;

        const topPos = 20 + Math.random() * 40;
        duck.style.top = `${topPos}%`;

        duck.innerHTML = '<div class="eye"></div><div class="beak"></div><div class="wing"></div>';

        canvas.appendChild(duck);

        // Evento de click - acierto
        duck.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.isPlaying) return;

            playSound('hit');

            this.combo++;
            const multiplier = this.combo >= 2
                ? Math.min(this.combo, MAX_COMBO_MULTIPLIER)
                : 1;
            const basePoints = isGolden ? GOLDEN_DUCK_POINTS : levelConfig.pointsPerHit;
            const points = basePoints * multiplier;

            this.hits++;
            this.shots++;
            this.score += points;

            duck.classList.add('hit');
            updateHUD(this.score, this.time);
            updateCombo(this.combo);

            // Posición del click relativa al canvas
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            spawnScorePopup(canvas, x, y, points);
            spawnFeathers(canvas, x, y, isGolden ? 10 : 6);
            triggerShake(canvas);

            setTimeout(() => {
                if (duck.parentNode) duck.remove();
            }, 300);
        });

        // Remover pato al terminar animación (escape sin acierto → rompe combo).
        // Si el juego está pausado/terminado, no contabilizamos como fallo —
        // el pato ya habrá sido limpiado por pauseGame()/endGame().
        setTimeout(() => {
            if (!this.isPlaying) return;
            if (duck.parentNode && !duck.classList.contains('hit')) {
                this.shots++;
                this.combo = 0;
                updateCombo(0);
                duck.remove();
            }
        }, speed * 1000);
    },

    // Terminar el juego
    endGame() {
        this.isPlaying = false;
        this.stopIntervals();

        // Comprobar récord personal ANTES de guardar — getBestScores incluye
        // la partida actual una vez la hemos guardado, así que el "previo"
        // tiene que leerse antes.
        const previousBest = getBestScores()[this.currentLevel]?.score ?? 0;
        const isRecord = this.score > previousBest && this.score > 0;

        saveScore(this.currentLevel, this.score);
        updateDailyWinnerView();
        updateCombo(0);

        const accuracy = this.shots > 0 ? Math.round((this.hits / this.shots) * 100) : 0;
        showGameOver(this.score, this.hits, accuracy, isRecord);
    },

    // Pausar el juego — limpiamos los patos en vuelo para que no terminen
    // su animación CSS por su cuenta y el combo no se rompa al reanudar.
    pauseGame() {
        this.isPlaying = false;
        this.stopIntervals();
        this.clearCanvas();
    },

    // Reanudar el juego
    resumeGame() {
        this.isPlaying = true;
        this.startTimer();
        this.spawnDuck();
        this.startSpawning();
    },

    // Reiniciar juego
    restart() {
        this.startGame(this.currentLevel);
    },

    // Detener intervalos
    stopIntervals() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
    }
};

// === Helpers de "juice" visual ===

function spawnScorePopup(canvas, x, y, points) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${points}`;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    canvas.appendChild(popup);
    setTimeout(() => popup.remove(), 900);
}

function spawnFeathers(canvas, x, y, count = 6) {
    const fragment = document.createDocumentFragment();
    const feathers = [];

    for (let i = 0; i < count; i++) {
        const feather = document.createElement('div');
        feather.className = 'feather';
        feather.style.left = `${x}px`;
        feather.style.top = `${y}px`;

        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
        const dist = 35 + Math.random() * 30;
        feather.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        feather.style.setProperty('--dy', `${Math.sin(angle) * dist + 25}px`);
        feather.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);

        fragment.appendChild(feather);
        feathers.push(feather);
    }

    canvas.appendChild(fragment);
    setTimeout(() => feathers.forEach(f => f.remove()), 1000);
}

function triggerShake(canvas) {
    canvas.classList.remove('is-shaking');
    // Forzar reflow para reiniciar la animación
    void canvas.offsetWidth;
    canvas.classList.add('is-shaking');
    setTimeout(() => canvas.classList.remove('is-shaking'), 230);
}