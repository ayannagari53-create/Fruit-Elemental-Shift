import { useGameStore } from '../game/useGameStore';

export function MenuScreen() {
  const { startGame, game } = useGameStore();

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-30"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(15,20,40,0.95) 0%, rgba(5,8,20,0.98) 100%)',
      }}
    >
      <div className="flex flex-col items-center gap-8 px-6 text-center max-w-lg">
        <div>
          <h1
            className="text-6xl font-black tracking-tight leading-none"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f97316, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.4))',
              fontFamily: 'monospace',
            }}
          >
            ELEMENTAL
          </h1>
          <h1
            className="text-5xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(56,189,248,0.4))',
              fontFamily: 'monospace',
            }}
          >
            FRUIT SLASH
          </h1>
        </div>

        {game.highScore > 0 && (
          <div
            className="text-lg font-semibold"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Best: {game.highScore.toLocaleString()}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 w-full">
          <div
            className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}
          >
            <span className="text-2xl">🍐</span>
            <span className="text-xs font-semibold" style={{ color: '#7dd3fc' }}>Frost Pear</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Slow time 3s</span>
          </div>
          <div
            className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <span className="text-2xl">🔴</span>
            <span className="text-xs font-semibold" style={{ color: '#f87171' }}>Volcanic Plum</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Chain reaction</span>
          </div>
          <div
            className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}
          >
            <span className="text-2xl">🌀</span>
            <span className="text-xs font-semibold" style={{ color: '#c084fc' }}>Gravity Core</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Flip gravity</span>
          </div>
        </div>

        <div
          className="flex items-center gap-3 text-sm"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <div className="flex gap-1">
            <span>⬟</span><span>⬟</span><span>⬟</span>
          </div>
          <span>Three Zen Stones protect you — crack all three and the session ends</span>
        </div>

        <button
          onClick={startGame}
          className="px-12 py-4 rounded-2xl text-xl font-black tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            color: 'white',
            boxShadow: '0 0 40px rgba(249,115,22,0.5), 0 8px 32px rgba(0,0,0,0.4)',
            border: 'none',
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}
        >
          PLAY
        </button>
      </div>
    </div>
  );
}
