import { useEffect, useRef } from 'react';
import { useGameStore } from '../game/useGameStore';

export function HUD() {
  const { game } = useGameStore();
  const now = Date.now();
  const isSlowMo = game.slownMotion && now < game.slowMotionEnd;
  const remaining = Math.max(0, (game.slowMotionEnd - now) / 1000);

  return (
    <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
      <div className="flex items-start justify-between px-6 pt-4">
        <div className="flex flex-col gap-1">
          <div
            className="text-4xl font-black tabular-nums"
            style={{
              color: '#fbbf24',
              textShadow: '0 0 20px rgba(251,191,36,0.5), 0 2px 4px rgba(0,0,0,0.8)',
              fontFamily: 'monospace',
            }}
          >
            {game.score.toLocaleString()}
          </div>
          {game.combo > 1 && (
            <div
              className="text-sm font-bold"
              style={{
                color: '#f97316',
                textShadow: '0 0 10px rgba(249,115,22,0.7)',
              }}
            >
              {game.combo}x COMBO
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <div
            className="text-sm font-semibold"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            BEST: {game.highScore.toLocaleString()}
          </div>
        </div>
      </div>

      {isSlowMo && (
        <div className="flex flex-col items-center mt-2 gap-1">
          <div
            className="text-lg font-black tracking-widest animate-pulse"
            style={{
              color: '#38bdf8',
              textShadow: '0 0 20px rgba(56,189,248,0.8)',
              fontFamily: 'monospace',
            }}
          >
            ❄ SLOW MOTION ❄
          </div>
          <div className="w-40 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(remaining / 3) * 100}%`,
                background: 'linear-gradient(90deg, #38bdf8, #7dd3fc)',
                boxShadow: '0 0 8px #38bdf8',
              }}
            />
          </div>
        </div>
      )}

      {game.gravityInverted && (
        <div className="flex justify-center mt-2">
          <div
            className="px-4 py-1 rounded-full text-sm font-bold tracking-widest"
            style={{
              background: 'rgba(168,85,247,0.2)',
              border: '1px solid rgba(168,85,247,0.5)',
              color: '#c084fc',
              textShadow: '0 0 12px rgba(192,132,252,0.8)',
            }}
          >
            GRAVITY INVERTED
          </div>
        </div>
      )}
    </div>
  );
}
