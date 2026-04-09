export type FruitType = 'apple' | 'watermelon' | 'orange' | 'pineapple' | 'frost_pear' | 'volcanic_plum' | 'gravity_core';

export interface Fruit {
  id: string;
  type: FruitType;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  sliced: boolean;
  missed: boolean;
  sliceTime?: number;
  chainTarget?: boolean;
  spawnTime: number;
}

export interface SliceParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  color2: string;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

export interface ScoreFloat {
  id: string;
  x: number;
  y: number;
  value: number;
  color: string;
  born: number;
}

export type GamePhase = 'menu' | 'playing' | 'gameover';

export interface GameState {
  phase: GamePhase;
  score: number;
  lives: number;
  zenStones: ZenStone[];
  slownMotion: boolean;
  slowMotionEnd: number;
  gravityInverted: boolean;
  gravityFlipTime: number;
  combo: number;
  highScore: number;
}

export interface ZenStone {
  id: number;
  hp: number;
  cracking: boolean;
  crackTime: number;
}

export const FRUIT_CONFIG: Record<FruitType, {
  color: string;
  color2: string;
  emissive: string;
  radius: number;
  segments?: number;
  points: number;
  label: string;
  spawnWeight: number;
}> = {
  apple: {
    color: '#e8312a',
    color2: '#f45f56',
    emissive: '#5c0a08',
    radius: 0.38,
    points: 10,
    label: 'Apple',
    spawnWeight: 25,
  },
  watermelon: {
    color: '#22c55e',
    color2: '#16a34a',
    emissive: '#052e16',
    radius: 0.5,
    points: 15,
    label: 'Watermelon',
    spawnWeight: 15,
  },
  orange: {
    color: '#f97316',
    color2: '#ea580c',
    emissive: '#431407',
    radius: 0.35,
    points: 10,
    label: 'Orange',
    spawnWeight: 25,
  },
  pineapple: {
    color: '#eab308',
    color2: '#ca8a04',
    emissive: '#422006',
    radius: 0.3,
    segments: 12,
    points: 20,
    label: 'Pineapple',
    spawnWeight: 15,
  },
  frost_pear: {
    color: '#7dd3fc',
    color2: '#38bdf8',
    emissive: '#0c4a6e',
    radius: 0.4,
    points: 25,
    label: 'Frost Pear',
    spawnWeight: 8,
  },
  volcanic_plum: {
    color: '#dc2626',
    color2: '#991b1b',
    emissive: '#7c0404',
    radius: 0.36,
    points: 30,
    label: 'Volcanic Plum',
    spawnWeight: 7,
  },
  gravity_core: {
    color: '#a855f7',
    color2: '#7c3aed',
    emissive: '#2e1065',
    radius: 0.42,
    points: 0,
    label: 'Gravity Core',
    spawnWeight: 5,
  },
};
