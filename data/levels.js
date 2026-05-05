export const levels = [
  {
    level: 1,
    name: 'Nivel 1',
    speed: 1,
    spawnInterval: 2000,
    time: 45,
    pointsPerHit: 10,
    description: 'Principiante'
  },
  {
    level: 2,
    name: 'Nivel 2',
    speed: 1.5,
    spawnInterval: 1500,
    time: 40,
    pointsPerHit: 20,
    description: 'Intermedio'
  },
  {
    level: 3,
    name: 'Nivel 3',
    speed: 2,
    spawnInterval: 1000,
    time: 35,
    pointsPerHit: 30,
    description: 'Experto'
  }
];

export function getLevel(levelNum) {
  return levels.find(l => l.level === levelNum) || levels[0];
}
