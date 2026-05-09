// Punto de entrada de la aplicación
import {
    initUsernameFlow,
    initViewListeners,
    initSettings,
    initFooterScrollTop
} from './views.js';
import { updateDailyWinnerView } from './features/core/score.js';
import {
    playBackgroundMusic,
    pauseBackgroundMusic,
    toggleMute
} from './sound/sound.js';
// Side-effect imports: estos módulos se autoinicializan (form de clima,
// fetch de noticias). Antes se cargaban como <script defer> aparte; ahora
// van por el grafo de módulos para ser consistentes.
import './features/api/api-connection.js';
import './features/api/noticias.js';

initUsernameFlow();
initViewListeners();
initSettings();
initFooterScrollTop();
updateDailyWinnerView();

// Botones que controlan la música/sonido — viven aquí (no en views.js)
// porque acoplan UI con el módulo de Sound, que no debería conocer la UI.
document.addEventListener('DOMContentLoaded', () => {
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            const isMuted = toggleMute();
            const muteIcon = document.getElementById('muteIcon');
            if (muteIcon) {
                muteIcon.className = isMuted
                    ? 'fas fa-volume-mute'
                    : 'fas fa-volume-up';
            }
        });
    }

    document.getElementById('startBtn')?.addEventListener('click', playBackgroundMusic);
    document.getElementById('pauseBtn')?.addEventListener('click', pauseBackgroundMusic);
    document.getElementById('resumeBtn')?.addEventListener('click', playBackgroundMusic);
});
