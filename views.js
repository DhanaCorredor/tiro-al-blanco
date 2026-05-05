import { game } from './features/core/game.js';
import { updateDailyWinnerView } from './features/core/score.js';
import { savePlayerName, getPlayerName, clearScores } from './features/core/storage.js';
import { toggleMute, getMuteState } from './Sound/sound.js';


export function initUsernameFlow() {
  const nameScreen  = document.getElementById('nameScreen');
  const startScreen = document.getElementById('startScreen');
  const nameInput   = document.getElementById('playerNameInput');
  const nameForm    = document.getElementById('nameForm');
  const nameError   = document.getElementById('nameError');

  // If already named, go straight to start
  if (getPlayerName()) {
    nameScreen?.classList.remove('active');
    startScreen?.classList.add('active');
    return;
  }

  // Show name screen
  nameScreen?.classList.add('active');
  startScreen?.classList.remove('active');
  nameInput?.focus();

  nameForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = nameInput?.value.trim() ?? '';

    if (value.length < 2) {
      if (nameError) nameError.textContent = 'El nombre debe tener al menos 2 caracteres.';
      nameInput?.focus();
      return;
    }

    savePlayerName(value);
    nameScreen?.classList.remove('active');
    startScreen?.classList.add('active');
    updateDailyWinnerView();
  });
}

// Elementos del DOM cacheados
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    gameOver: document.getElementById('gameOverScreen'),
    pause: document.getElementById('pauseScreen')
};

const hud = {
    score: document.getElementById('score'),
    time: document.getElementById('time')
};

const elements = {
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resumeBtn: document.getElementById('resumeBtn'),
    exitPauseBtn: document.getElementById('exitPauseBtn'),
    restartBtn: document.getElementById('restartBtn'),
    finalScore: document.getElementById('finalScore'),
    finalHits: document.getElementById('finalHits'),
    finalPrecision: document.getElementById('finalPrecision'),
    recordBanner: document.getElementById('recordBanner'),
    comboDisplay: document.getElementById('comboDisplay'),
    comboValue: document.getElementById('comboValue')
};

let selectedLevel = 1;

// Cambiar pantalla activa
export function switchScreen(screenKey) {
    Object.values(screens).forEach(s => s?.classList.remove('active'));
    screens[screenKey]?.classList.add('active');
}

// Actualizar HUD del juego
export function updateHUD(score, time) {
    if (hud.score) hud.score.textContent = score;
    if (hud.time) {
        hud.time.textContent = time;
        // Tiempo crítico: últimos 5 segundos
        hud.time.classList.toggle('is-critical', time > 0 && time <= 5);
    }
}

// Mostrar pantalla de fin de juego
export function showGameOver(score, hits, accuracy, isRecord = false) {
    switchScreen('gameOver');
    elements.finalScore.textContent = score;
    elements.finalHits.textContent = hits;
    elements.finalPrecision.textContent = `${accuracy}%`;

    if (elements.recordBanner) {
        elements.recordBanner.hidden = !isRecord;
    }
    if (isRecord) spawnConfetti();
}

// Mostrar / ocultar el combo flotante con animación de "bump" en cada hit
export function updateCombo(combo) {
    const display = elements.comboDisplay;
    const value = elements.comboValue;
    if (!display || !value) return;

    if (combo >= 2) {
        value.textContent = combo;
        display.classList.add('is-visible');
        // Reiniciar la animación de bump
        display.classList.remove('is-bumped');
        void display.offsetWidth;
        display.classList.add('is-bumped');
    } else {
        display.classList.remove('is-visible', 'is-bumped');
    }
}

// === MODAL DE AJUSTES ===
// Sincroniza el estado del mute entre el botón del HUD y el toggle del modal.
function syncMuteUI(muted) {
    const settingsMuteBtn = document.getElementById('settingsMute');
    const settingsMuteIcon = document.getElementById('settingsMuteIcon');
    const settingsMuteText = document.getElementById('settingsMuteText');
    if (settingsMuteBtn) {
        settingsMuteBtn.setAttribute('aria-pressed', String(muted));
        settingsMuteIcon.className = muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        settingsMuteText.textContent = muted ? 'Silenciado' : 'Activado';
    }
    const hudIcon = document.getElementById('muteIcon');
    if (hudIcon) {
        hudIcon.className = muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
}

export function initSettings() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;

    const nameInput = document.getElementById('settingsName');
    const muteBtn = document.getElementById('settingsMute');
    const resetBtn = document.getElementById('settingsReset');
    const saveBtn = document.getElementById('settingsSave');

    const open = () => {
        nameInput.value = getPlayerName() ?? '';
        syncMuteUI(getMuteState());
        if (typeof modal.showModal === 'function') modal.showModal();
        else modal.setAttribute('open', '');
    };

    const close = () => {
        if (typeof modal.close === 'function') modal.close();
        else modal.removeAttribute('open');
    };

    document.querySelectorAll('[data-open-settings]').forEach((btn) =>
        btn.addEventListener('click', open)
    );
    document.querySelectorAll('[data-close-settings]').forEach((btn) =>
        btn.addEventListener('click', close)
    );

    // Cerrar al clicar fuera de la card
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    muteBtn?.addEventListener('click', () => syncMuteUI(toggleMute()));

    resetBtn?.addEventListener('click', () => {
        if (confirm('¿Borrar todas las puntuaciones guardadas? Esta acción no se puede deshacer.')) {
            clearScores();
            updateDailyWinnerView();
        }
    });

    saveBtn?.addEventListener('click', () => {
        const newName = nameInput.value.trim();
        if (newName.length >= 2) {
            savePlayerName(newName);
            updateDailyWinnerView();
        }
        close();
    });
}

// Botón "INICIO" del footer → vuelve arriba
export function initFooterScrollTop() {
    document.querySelectorAll('[data-scroll-top]').forEach((btn) =>
        btn.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
        )
    );
}

function spawnConfetti(count = 60) {
    const colors = ['#e63946', '#ffcc00', '#ffffff', '#ff8c00', '#b02121'];
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.setProperty('--dx', `${(Math.random() - 0.5) * 250}px`);
        piece.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
        piece.style.animationDelay = `${Math.random() * 0.6}s`;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
    }
}

// Inicializar todos los eventos de la UI
export function initViewListeners() {
    const levelButtons = document.querySelectorAll('.level-btn');
    if (levelButtons.length === 0) return;

    levelButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            levelButtons.forEach(b => b.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            selectedLevel = parseInt(e.currentTarget.dataset.level);
            elements.startBtn.disabled = false;
        });
    });

    // Botón JUGAR
    elements.startBtn?.addEventListener('click', () => {
        switchScreen('game');
        game.startGame(selectedLevel);
    });

    // Botón PAUSA
    elements.pauseBtn?.addEventListener('click', () => {
        if (game.isPlaying) {
            game.pauseGame();
            switchScreen('pause');
        }
    });

    // Botón REANUDAR
    elements.resumeBtn?.addEventListener('click', () => {
        game.resumeGame();
        switchScreen('game');
    });

    // Botón SALIR de pausa
    elements.exitPauseBtn?.addEventListener('click', () => {
        game.endGame();
        switchScreen('start');
    });

    // Botón JUGAR DE NUEVO
    elements.restartBtn?.addEventListener('click', () => {
        switchScreen('game');
        game.restart();
    });
}