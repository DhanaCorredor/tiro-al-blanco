import { getTopScores } from './storage.js';

const MEDALS = ['🥇', '🥈', '🥉'];
const TIERS = ['first', 'second', 'third'];

// Mantenemos `updateDailyWinnerView` por compatibilidad con views.js y
// game.js, pero ahora pinta un podio (top 3).
export function updateDailyWinnerView() {
  const container = document.getElementById('rankingList');
  if (!container) return;

  const top = getTopScores(3);
  container.innerHTML = '';

  if (top.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'ranking-empty';
    empty.textContent = 'Sin partidas aún. ¡Juega para entrar al ranking!';
    container.appendChild(empty);
    return;
  }

  // Siempre rellenamos 3 huecos: los vacíos quedan como gradas grises.
  for (let i = 0; i < 3; i++) {
    container.appendChild(createPodiumSlot(top[i], i));
  }
}

function createPodiumSlot(entry, position) {
  const slot = document.createElement('div');
  slot.className = `podium-slot podium-slot--${TIERS[position]}`;

  if (entry) {
    const medal = document.createElement('span');
    medal.className = 'podium-medal';
    medal.textContent = MEDALS[position];

    const name = document.createElement('span');
    name.className = 'podium-name';
    name.textContent = entry.name;

    const score = document.createElement('span');
    score.className = 'podium-score';
    score.textContent = `${entry.score} pts`;

    const meta = document.createElement('span');
    meta.className = 'podium-meta';
    meta.textContent = `Nivel ${entry.level}`;

    slot.append(medal, name, score, meta);
  } else {
    slot.classList.add('podium-slot--empty');
    const dash = document.createElement('span');
    dash.className = 'podium-dash';
    dash.textContent = '—';
    slot.appendChild(dash);
  }

  const step = document.createElement('div');
  step.className = 'podium-step';
  step.textContent = String(position + 1);
  slot.appendChild(step);

  return slot;
}
