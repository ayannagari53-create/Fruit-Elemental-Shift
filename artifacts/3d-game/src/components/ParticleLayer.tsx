import { useGameStore } from '../game/useGameStore';

function worldToScreen(x: number, y: number): { left: string; top: string } {
  const fov = 60;
  const dist = 10;
  const scale = dist / (dist - 0) * Math.tan((fov / 2) * (Math.PI / 180));

  const left = `${50 + (x / scale) * 50}%`;
  const top = `${50 - (y / scale) * 50}%`;
  return { left, top };
}

export function ParticleLayer() {
  const { particles, scoreFloats } = useGameStore();
  const now = Date.now();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => {
        const progress = 1 - p.life / p.maxLife;
        const screenX = 50 + (p.x / 5.2) * 50;
        const screenY = 50 - (p.y / 5.5) * 50;
        return (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${screenX}%`,
              top: `${screenY}%`,
              width: p.size,
              height: p.size * 0.6,
              background: `linear-gradient(135deg, ${p.color}, ${p.color2})`,
              opacity: p.life,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              boxShadow: `0 0 ${p.size * 0.5}px ${p.color}88`,
            }}
          />
        );
      })}

      {scoreFloats.map((sf) => {
        const age = (now - sf.born) / 900;
        const screenX = 50 + (sf.x / 5.2) * 50;
        const screenY = 50 - (sf.y / 5.5) * 50;
        return (
          <div
            key={sf.id}
            className="absolute font-bold pointer-events-none"
            style={{
              left: `${screenX}%`,
              top: `${screenY - age * 8}%`,
              transform: 'translate(-50%, -50%)',
              color: sf.color,
              fontSize: sf.value >= 50 ? '2rem' : '1.4rem',
              opacity: 1 - age,
              textShadow: `0 0 12px ${sf.color}`,
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
          >
            +{sf.value}
          </div>
        );
      })}
    </div>
  );
}
