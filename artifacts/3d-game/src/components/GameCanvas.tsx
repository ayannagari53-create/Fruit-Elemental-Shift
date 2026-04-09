import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import { FruitMesh } from './FruitMesh';
import { useGameStore } from '../game/useGameStore';

const SPAWN_INTERVAL_BASE = 1200;
const SPAWN_INTERVAL_MIN = 500;

const STAR_POSITIONS = (() => {
  const count = 300;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 8;
  }
  return pos;
})();

function StarField() {
  const ref = useRef<THREE.Points>(null!);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[STAR_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.05} sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

function GameScene() {
  const {
    fruits,
    game,
    spawnFruit,
    updateFruits,
    missedFruit,
    clearExpired,
    updateParticles,
    updateScoreFloats,
    sliceFruit,
  } = useGameStore();

  const spawnTimer = useRef(0);
  const lastTime = useRef(Date.now());

  useFrame(() => {
    if (game.phase !== 'playing') return;

    const now = Date.now();
    const dt = Math.min((now - lastTime.current) / 1000, 0.05);
    lastTime.current = now;

    updateFruits(dt, game.gravityInverted);
    updateParticles(dt);
    updateScoreFloats();

    spawnTimer.current += dt * 1000;
    const interval = Math.max(
      SPAWN_INTERVAL_MIN,
      SPAWN_INTERVAL_BASE - game.score * 0.5
    );
    if (spawnTimer.current > interval) {
      spawnTimer.current = 0;
      const count = Math.random() < 0.3 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        setTimeout(() => spawnFruit(game.gravityInverted), i * 200);
      }
    }

    for (const fruit of fruits) {
      if (fruit.sliced || fruit.missed) continue;
      const outOfBounds = game.gravityInverted
        ? fruit.y < -6
        : fruit.y > 6;
      if (outOfBounds) {
        missedFruit(fruit.id);
      }
    }

    clearExpired();
  });

  return (
    <>
      <StarField />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <pointLight position={[-5, 5, 3]} intensity={0.8} color="#4488ff" />
      <pointLight position={[5, -5, 3]} intensity={0.5} color="#ff4422" />
      {fruits
        .filter((f) => !f.missed && !f.sliced)
        .map((fruit) => (
          <FruitMesh key={fruit.id} fruit={fruit} onSlice={sliceFruit} />
        ))}
    </>
  );
}

export function GameCanvas() {
  const { game } = useGameStore();
  const now = Date.now();
  const isSlowMo = game.slownMotion && now < game.slowMotionEnd;

  return (
    <WebGLErrorBoundary>
      <div
        className="absolute inset-0"
        style={{
          filter: isSlowMo ? 'saturate(1.8) brightness(0.85) hue-rotate(160deg)' : 'none',
          transition: 'filter 0.4s ease',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, #0f1628 0%, #050810 60%, #0a0610 100%)',
          }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor('#050810');
          }}
        >
          <GameScene />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
