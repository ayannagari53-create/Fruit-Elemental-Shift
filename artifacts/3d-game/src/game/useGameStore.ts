import { create } from 'zustand';
import { Fruit, FruitType, GamePhase, GameState, ScoreFloat, SliceParticle, ZenStone, FRUIT_CONFIG } from './types';

let idCounter = 0;
const nextId = () => `${++idCounter}`;

function makeZenStones(): ZenStone[] {
  return [
    { id: 0, hp: 3, cracking: false, crackTime: 0 },
    { id: 1, hp: 3, cracking: false, crackTime: 0 },
    { id: 2, hp: 3, cracking: false, crackTime: 0 },
  ];
}

function weightedRandom(): FruitType {
  const types = Object.entries(FRUIT_CONFIG) as [FruitType, typeof FRUIT_CONFIG[FruitType]][];
  const total = types.reduce((acc, [, cfg]) => acc + cfg.spawnWeight, 0);
  let r = Math.random() * total;
  for (const [type, cfg] of types) {
    r -= cfg.spawnWeight;
    if (r <= 0) return type;
  }
  return 'apple';
}

interface GameStore {
  fruits: Fruit[];
  particles: SliceParticle[];
  scoreFloats: ScoreFloat[];
  game: GameState;

  startGame: () => void;
  endGame: () => void;
  returnToMenu: () => void;

  spawnFruit: (gravityInverted: boolean) => void;
  updateFruits: (dt: number, gravityInverted: boolean) => void;
  sliceFruit: (id: string) => void;
  updateParticles: (dt: number) => void;
  updateScoreFloats: () => void;

  triggerSlowMo: () => void;
  triggerChainReaction: (x: number, y: number, z: number) => void;
  triggerGravityInvert: () => void;

  missedFruit: (id: string) => void;
  clearExpired: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  fruits: [],
  particles: [],
  scoreFloats: [],
  game: {
    phase: 'menu',
    score: 0,
    lives: 3,
    zenStones: makeZenStones(),
    slownMotion: false,
    slowMotionEnd: 0,
    gravityInverted: false,
    gravityFlipTime: 0,
    combo: 0,
    highScore: 0,
  },

  startGame: () => {
    set({
      fruits: [],
      particles: [],
      scoreFloats: [],
      game: {
        phase: 'playing',
        score: 0,
        lives: 3,
        zenStones: makeZenStones(),
        slownMotion: false,
        slowMotionEnd: 0,
        gravityInverted: false,
        gravityFlipTime: 0,
        combo: 0,
        highScore: get().game.highScore,
      },
    });
  },

  endGame: () => {
    const { game } = get();
    set({
      game: {
        ...game,
        phase: 'gameover',
        highScore: Math.max(game.score, game.highScore),
      },
    });
  },

  returnToMenu: () => {
    set({ game: { ...get().game, phase: 'menu' } });
  },

  spawnFruit: (gravityInverted: boolean) => {
    const type = weightedRandom();
    const cfg = FRUIT_CONFIG[type];
    const x = (Math.random() - 0.5) * 7;
    const baseY = gravityInverted ? 5.5 : -5.5;
    const vy = gravityInverted
      ? -(3.5 + Math.random() * 2.5)
      : 5 + Math.random() * 3;

    const fruit: Fruit = {
      id: nextId(),
      type,
      x,
      y: baseY,
      z: (Math.random() - 0.5) * 2,
      vx: (Math.random() - 0.5) * 2,
      vy,
      vz: 0,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 4,
      scale: 1,
      sliced: false,
      missed: false,
      spawnTime: Date.now(),
    };
    set((s) => ({ fruits: [...s.fruits, fruit] }));
  },

  updateFruits: (dt: number, gravityInverted: boolean) => {
    const gravity = gravityInverted ? 6.5 : -6.5;
    const now = Date.now();
    const { game } = get();
    const slowFactor = game.slownMotion && now < game.slowMotionEnd ? 0.25 : 1;

    set((s) => ({
      fruits: s.fruits.map((f) => {
        if (f.sliced || f.missed) return f;
        const actualDt = dt * slowFactor;
        return {
          ...f,
          x: f.x + f.vx * actualDt,
          y: f.y + f.vy * actualDt,
          vx: f.vx * (1 - 0.5 * actualDt),
          vy: f.vy + gravity * actualDt,
          rotation: f.rotation + f.rotationSpeed * actualDt,
        };
      }),
    }));
  },

  sliceFruit: (id: string) => {
    const { fruits, game } = get();
    const fruit = fruits.find((f) => f.id === id);
    if (!fruit || fruit.sliced || fruit.missed) return;

    const cfg = FRUIT_CONFIG[fruit.type];
    const now = Date.now();

    if (fruit.type === 'frost_pear') {
      get().triggerSlowMo();
    } else if (fruit.type === 'volcanic_plum') {
      get().triggerChainReaction(fruit.x, fruit.y, fruit.z);
    } else if (fruit.type === 'gravity_core') {
      get().triggerGravityInvert();
    }

    const pts = cfg.points * Math.max(1, game.combo);
    const newCombo = game.combo + 1;

    const particleCount = 18;
    const newParticles: SliceParticle[] = Array.from({ length: particleCount }, () => ({
      id: nextId(),
      x: fruit.x,
      y: fruit.y,
      vx: (Math.random() - 0.5) * 7,
      vy: (Math.random() - 0.5) * 7,
      color: cfg.color,
      color2: cfg.color2,
      size: 6 + Math.random() * 14,
      life: 1,
      maxLife: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
    }));

    const scoreFloat: ScoreFloat = {
      id: nextId(),
      x: fruit.x,
      y: fruit.y,
      value: pts,
      color: fruit.type === 'frost_pear' ? '#7dd3fc' :
        fruit.type === 'volcanic_plum' ? '#ff6030' :
        fruit.type === 'gravity_core' ? '#c084fc' : '#fbbf24',
      born: now,
    };

    set((s) => ({
      fruits: s.fruits.map((f) =>
        f.id === id ? { ...f, sliced: true, sliceTime: now } : f
      ),
      particles: [...s.particles, ...newParticles],
      scoreFloats: [...s.scoreFloats, scoreFloat],
      game: {
        ...s.game,
        score: s.game.score + pts,
        combo: newCombo,
      },
    }));
  },

  updateParticles: (dt: number) => {
    set((s) => ({
      particles: s.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          vy: p.vy - 9 * dt,
          life: p.life - dt * 1.5,
          rotation: p.rotation + p.rotationSpeed * dt,
        }))
        .filter((p) => p.life > 0),
    }));
  },

  updateScoreFloats: () => {
    const now = Date.now();
    set((s) => ({
      scoreFloats: s.scoreFloats.filter((sf) => now - sf.born < 900),
    }));
  },

  triggerSlowMo: () => {
    const now = Date.now();
    set((s) => ({
      game: {
        ...s.game,
        slownMotion: true,
        slowMotionEnd: now + 3000,
      },
    }));
  },

  triggerChainReaction: (x: number, y: number, z: number) => {
    const CHAIN_RADIUS = 3;
    const { fruits } = get();
    const targets = fruits.filter(
      (f) =>
        !f.sliced &&
        !f.missed &&
        f.type !== 'volcanic_plum' &&
        f.type !== 'gravity_core' &&
        Math.hypot(f.x - x, f.y - y) < CHAIN_RADIUS
    );
    for (const t of targets) {
      setTimeout(() => {
        get().sliceFruit(t.id);
      }, Math.random() * 300);
    }
  },

  triggerGravityInvert: () => {
    const now = Date.now();
    set((s) => ({
      game: {
        ...s.game,
        gravityInverted: !s.game.gravityInverted,
        gravityFlipTime: now,
      },
    }));
  },

  missedFruit: (id: string) => {
    const { game, fruits } = get();
    const fruit = fruits.find((f) => f.id === id);
    if (!fruit || fruit.type === 'gravity_core') return;

    const stones = [...game.zenStones];
    let damaged = false;
    for (let i = stones.length - 1; i >= 0; i--) {
      if (stones[i].hp > 0) {
        stones[i] = {
          ...stones[i],
          hp: stones[i].hp - 1,
          cracking: true,
          crackTime: Date.now(),
        };
        damaged = true;
        break;
      }
    }

    const allDead = stones.every((s) => s.hp <= 0);
    set((s) => ({
      fruits: s.fruits.map((f) => (f.id === id ? { ...f, missed: true } : f)),
      game: {
        ...s.game,
        zenStones: stones,
        combo: 0,
        phase: allDead ? 'gameover' : s.game.phase,
        highScore: allDead ? Math.max(s.game.score, s.game.highScore) : s.game.highScore,
      },
    }));
  },

  clearExpired: () => {
    set((s) => ({
      fruits: s.fruits.filter((f) => {
        if (f.sliced && f.sliceTime && Date.now() - f.sliceTime > 500) return false;
        if (f.missed) return false;
        return true;
      }),
    }));
  },
}));
