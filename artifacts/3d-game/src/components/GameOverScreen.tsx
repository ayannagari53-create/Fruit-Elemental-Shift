import { useGameStore } from '../game/useGameStore';

export function GameOverScreen() {
  const { startGame, returnToMenu, game } = useGameStore();

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-30"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(60,0,0,0.9) 0%, rgba(5,5,15,0.97) 70%)',
      }}
    >
      <div className="flex flex-col items-center gap-8 px-6 text-center max-w-md">
        <div>
          <div
            className="text-7xl font-black tracking-tight"
            style={{
              color: '#ff2200',
              textShadow: '0 0 40px rgba(255,34,0,0.7)',
              fontFamily: 'monospace',
            }}
          >
            SESSION
          </div>
          <div
            className="text-4xl font-black tracking-wider"
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'monospace',
            }}
          >
            ENDED
          </div>
        </div>

        <div
          className="flex flex-col items-center gap-2 p-6 rounded-2xl w-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
            FINAL SCORE
          </div>
          <div
            className="text-5xl font-black tabular-nums"
            style={{
              color: '#fbbf24',
              textShadow: '0 0 30px rgba(251,191,36,0.5)',
              fontFamily: 'monospace',
            }}
          >
            {game.score.toLocaleString()}
          </div>
          {game.score >= game.highScore && game.score > 0 && (
            <div
              className="text-sm font-bold px-3 py-1 rounded-full mt-1"
              style={{
                background: 'rgba(251,191,36,0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(251,191,36,0.3)',
              }}
            >
              NEW BEST
            </div>
          )}
          <div className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Best: {game.highScore.toLocaleString()}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-xl text-lg font-black tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              color: 'white',
              boxShadow: '0 0 30px rgba(249,115,22,0.4)',
              border: 'none',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            RETRY
          </button>
          <button
            onClick={returnToMenu}
            className="px-8 py-3 rounded-xl text-lg font-black tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
