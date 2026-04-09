import { useGameStore } from '../game/useGameStore';

export function SlowMotionOverlay() {
  const { game } = useGameStore();
  const now = Date.now();
  const isActive = game.slownMotion && now < game.slowMotionEnd;

  if (!isActive) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        boxShadow: 'inset 0 0 100px rgba(56,189,248,0.35)',
        border: '3px solid rgba(56,189,248,0.2)',
        animation: 'slomoVignette 0.5s ease-out',
      }}
    />
  );
}

export function GravityFlipOverlay() {
  const { game } = useGameStore();
  const now = Date.now();
  const justFlipped = now - game.gravityFlipTime < 1500;

  if (!justFlipped) return null;

  const progress = (now - game.gravityFlipTime) / 1500;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
      style={{ opacity: 1 - progress }}
    >
      <div
        style={{
          fontSize: '5rem',
          transform: `rotate(${progress * 360}deg)`,
          filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.8))',
        }}
      >
        🌀
      </div>
    </div>
  );
}
