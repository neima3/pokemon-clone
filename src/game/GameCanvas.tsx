'use client';

import { useEffect, useRef } from 'react';
import { GameLoop, Input, SceneManager } from '@/engine';
import { OverworldScene, VIEW_W, VIEW_H } from './overworld/OverworldScene';

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
    const overworld = new OverworldScene(input);
    scenes.switch(overworld);

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
