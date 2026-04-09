import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { ZenStoneUI } from './components/ZenStoneUI';
import { ParticleLayer } from './components/ParticleLayer';
import { MenuScreen } from './components/MenuScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { SlowMotionOverlay, GravityFlipOverlay } from './components/SlowMotionOverlay';
import { useGameStore } from './game/useGameStore';
import './index.css';

export default function App() {
  const { game } = useGameStore();

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <GameCanvas />

      {game.phase === 'playing' && (
        <>
          <SlowMotionOverlay />
          <GravityFlipOverlay />
          <ParticleLayer />
          <HUD />
          <ZenStoneUI />
        </>
      )}

      {game.phase === 'menu' && <MenuScreen />}
      {game.phase === 'gameover' && (
        <>
          <ParticleLayer />
          <GameOverScreen />
        </>
      )}
    </div>
  );
}
