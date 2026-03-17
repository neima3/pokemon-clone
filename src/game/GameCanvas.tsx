'use client';

import { useEffect, useRef } from 'react';
import { GameLoop, Input, SceneManager, initAudio } from '@/engine';
import { OverworldScene, VIEW_W, VIEW_H } from './overworld/OverworldScene';
import { BattleScene, Pokemon } from './battle';
import { StarterSelectScene } from './StarterSelectScene';
import { TitleScene } from './TitleScene';
import { GameState } from './GameState';
import { TransitionEffect } from './TransitionEffect';

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
    const transition = new TransitionEffect();

    // Initialize audio on first click/keypress
    const initAudioOnce = () => {
      initAudio();
      window.removeEventListener('click', initAudioOnce);
      window.removeEventListener('keydown', initAudioOnce);
    };
    window.addEventListener('click', initAudioOnce);
    window.addEventListener('keydown', initAudioOnce);

    const startEncounter = (speciesKey: string, level: number) => {
      const badgeCount = gameState.badges.size;
      const wild = new Pokemon(speciesKey, level, badgeCount);

      transition.battleEnter(() => {
        const battle = new BattleScene(input, gameState, wild, (won) => {
          if (!won) {
            for (const p of gameState.team) p.heal();
          }
          gameState.save();
          scenes.switch(overworld);
        });
        scenes.switch(battle);
      });
    };

    const startTrainerBattle = (trainerId: string, _npcId: string) => {
      const badgeCount = gameState.badges.size;
      const dummyMon = new Pokemon('rattata', 1, badgeCount);

      transition.battleEnter(() => {
        const battle = new BattleScene(input, gameState, dummyMon, (won) => {
          if (won) {
            gameState.defeatTrainer(trainerId);
          } else {
            for (const p of gameState.team) p.heal();
          }
          gameState.save();
          scenes.switch(overworld);
        }, trainerId);
        scenes.switch(battle);
      });
    };

    const overworld = new OverworldScene(input, startEncounter, gameState, startTrainerBattle);

    const startNewGame = () => {
      const starter = new StarterSelectScene(input, (pokemon) => {
        gameState.team.push(pokemon);
        gameState.save();
        scenes.switch(overworld);
      });
      scenes.switch(starter);
    };

    const continueGame = () => {
      gameState.load();
      scenes.switch(overworld);
    };

    // Show title screen
    const hasSave = GameState.hasSave();
    const title = new TitleScene(input, startNewGame, continueGame, hasSave);
    scenes.switch(title);

    const loop = new GameLoop(
      (dt) => {
        transition.update(dt);
        if (!transition.active) {
          scenes.update(dt);
        }
      },
      () => {
        scenes.render(ctx);
        transition.render(ctx, VIEW_W, VIEW_H);
      },
    );
    loop.start();

    return () => {
      loop.stop();
      input.detach();
      window.removeEventListener('click', initAudioOnce);
      window.removeEventListener('keydown', initAudioOnce);
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
