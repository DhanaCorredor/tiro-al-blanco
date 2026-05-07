// storage.js
// Almacena las partidas como una lista (no una entrada por nivel) para que
// el podio pueda mostrar varios jugadores. Migra automáticamente el formato
// antiguo `{ '1': {score, name}, ... }` la primera vez que se lee.

const STORAGE_KEY = 'carnival-ducks-storage';
const PLAYER_KEY = 'carnival-ducks-player';
const MAX_ENTRIES = 50;

const emptyStore = () => ({ entries: [] });

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);

    if (parsed && Array.isArray(parsed.entries)) return parsed;

    // Formato antiguo: { '1': {score, name}, '2': ..., '3': ... }
    if (parsed && typeof parsed === 'object') {
      const entries = Object.entries(parsed)
        .filter(([key]) => !Number.isNaN(Number(key)))
        .map(([level, data]) => ({
          level: Number(level),
          score: typeof data === 'number' ? data : data.score,
          name: typeof data === 'number' ? 'Player' : data.name ?? 'Player',
          date: 0
        }))
        .filter((e) => Number.isFinite(e.score) && e.score > 0);
      return { entries };
    }
    return emptyStore();
  } catch {
    return emptyStore();
  }
};

const write = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[Storage] Write failed:', err.message);
  }
};

export const saveScore = (levelId, score) => {
  if (!Number.isFinite(score) || score <= 0) return;

  const data = read();
  data.entries.push({
    level: Number(levelId),
    score,
    name: getPlayerName() ?? 'Player',
    date: Date.now()
  });
  data.entries.sort((a, b) => b.score - a.score);
  data.entries = data.entries.slice(0, MAX_ENTRIES);
  write(data);
};

// Mejor puntuación por nivel — la usa game.js para detectar récords personales.
export const getBestScores = () => {
  const best = {};
  for (const e of read().entries) {
    if (!best[e.level] || e.score > best[e.level].score) {
      best[e.level] = { score: e.score, name: e.name };
    }
  }
  return best;
};

export const clearScores = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Storage] Clear failed:', err.message);
  }
};

// Top jugadores — deduplica por nombre para que un mismo player no
// ocupe los 3 huecos del podio con sus 3 mejores partidas.
export const getTopScores = (limit = 3) => {
  const sorted = read().entries.slice().sort((a, b) => b.score - a.score);
  const seen = new Set();
  const result = [];
  for (const entry of sorted) {
    if (seen.has(entry.name)) continue;
    seen.add(entry.name);
    result.push(entry);
    if (result.length >= limit) break;
  }
  return result;
};

export const getDailyWinner = () => getTopScores(1)[0] ?? null;

export const savePlayerName = (name) => {
  try {
    localStorage.setItem(PLAYER_KEY, name.trim().slice(0, 20));
  } catch {}
};

export const getPlayerName = () => {
  try {
    const name = localStorage.getItem(PLAYER_KEY);
    return name && name.trim().length > 0 ? name : null;
  } catch {
    return null;
  }
};
