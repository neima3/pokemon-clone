'use client';

import { useEffect, useRef } from 'react';
import { GameLoop, Input, SceneManager } from '@/engine';
import { OverworldScene, VIEW_W, VIEW_H } from './overworld/OverworldScene';
import { BattleScene, Pokemon, WILD_POKEMON } from './battle';
import { StarterSelectScene } from './StarterSelectScene';
import { GameState } from './GameState';

const SCALE = 2;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    const input = new Input();
    input.attach();

    const scenes = new SceneManager();
    const gameState = new GameState();

    // Create overworld with encounter callback
    const overworld = new OverworldScene(input, () => {
      const speciesKey = WILD_POKEMON[Math.floor(Math.random() * WILD_POKEMON.length)];
      const level = 2 + Math.floor(Math.random() * 4); // 2-5
      const wild = new Pokemon(speciesKey, level);
      const lead = gameState.leadPokemon!;

      const battle = new BattleScene(input, lead, wild, (won) => {
        if (!won) {
          // Heal team on loss
          for (const p of gameState.team) p.heal();
        }
        scenes.switch(overworld);
      });
      scenes.switch(battle);
    });

    // Start with starter selection
    const starter = new StarterSelectScene(input, (pokemon) => {
      gameState.team.push(pokemon);
      scenes.switch(overworld);
    });
    scenes.switch(starter);

    const loop = new GameLoop(
      (dt) => scenes.update(dt),
      () => scenes.render(ctx),
    );
    loop.start();

    return () => {
      loop.stop();
      input.detach();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={VIEW_W}
      height={VIEW_H}
      style={{
        width: VIEW_W * SCALE,
        height: VIEW_H * SCALE,
        imageRendering: 'pixelated',
        border: '4px solid #081820',
        borderRadius: 8,
        background: '#081820',
      }}
      tabIndex={0}
    />
  );
}
