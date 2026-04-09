import { useEffect, useRef } from 'react';
import { useGameStore } from '../game/useGameStore';

interface StoneProps {
  hp: number;
  cracking: boolean;
  crackTime: number;
  index: number;
}

function Stone({ hp, cracking, crackTime, index }: StoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const now = Date.now();
  const isShaking = cracking && now - crackTime < 500;
  const isDead = hp <= 0;
  const isCracked = hp < 3 && hp > 0;

  const cracks = 3 - hp;

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      style={{
        animation: isShaking ? 'stoneCrack 0.4s ease-in-out' : 'none',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <svg width="64" height="70" viewBox="0 0 64 70" fill="none">
        <ellipse
          cx="32"
          cy="52"
          rx="22"
          ry="8"
          fill="rgba(0,0,0,0.3)"
        />
        <path
          d="M32 6 L56 28 L52 58 L12 58 L8 28 Z"
          fill={isDead ? '#1a0000' : isCracked ? '#2d2d2d' : '#3d3d3d'}
          stroke={isDead ? '#7f0000' : isCracked ? '#666' : '#888'}
          strokeWidth="1.5"
        />
        {isDead && (
          <path
            d="M32 6 L56 28 L52 58 L12 58 L8 28 Z"
            fill="url(#redGlow)"
            opacity="0.6"
          />
        )}
        {cracks >= 1 && (
          <line x1="32" y1="12" x2="25" y2="35" stroke="#ff2200" strokeWidth="1.5" opacity="0.8" />
        )}
        {cracks >= 2 && (
          <>
            <line x1="25" y1="35" x2="38" y2="48" stroke="#ff2200" strokeWidth="1.5" opacity="0.8" />
            <line x1="40" y1="18" x2="48" y2="42" stroke="#ff4400" strokeWidth="1" opacity="0.7" />
          </>
        )}
        {cracks >= 3 && (
          <>
            <line x1="15" y1="30" x2="30" y2="55" stroke="#ff0000" strokeWidth="2" opacity="0.9" />
            <line x1="38" y1="10" x2="20" y2="40" stroke="#ff2200" strokeWidth="1.5" opacity="0.8" />
          </>
        )}
        {isDead && (
          <>
            <circle cx="32" cy="32" r="18" fill="rgba(255,0,0,0.15)" />
            <circle cx="32" cy="32" r="10" fill="rgba(255,0,0,0.1)" />
          </>
        )}
        <defs>
          <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {isDead && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        className="absolute -bottom-1 text-xs font-bold text-center"
        style={{
          color: isDead ? '#ff0000' : isCracked ? '#ff6600' : '#aaaaaa',
          textShadow: isDead ? '0 0 8px #ff0000' : 'none',
          fontSize: '0.55rem',
          letterSpacing: '0.05em',
        }}
      >
        {isDead ? 'SHATTERED' : hp === 3 ? '●●●' : hp === 2 ? '●●○' : '●○○'}
      </div>
    </div>
  );
}

export function ZenStoneUI() {
  const { game } = useGameStore();
  const { zenStones } = game;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-5 z-20">
      {zenStones.map((stone, i) => (
        <Stone
          key={stone.id}
          hp={stone.hp}
          cracking={stone.cracking}
          crackTime={stone.crackTime}
          index={i}
        />
      ))}
    </div>
  );
}
