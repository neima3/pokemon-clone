'use client';

import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('@/game/GameCanvas'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#081820] gap-6">
      <h1 className="font-mono text-[#e0f8d0] text-2xl tracking-wider">
        POK&Eacute;MON
      </h1>
      <GameCanvas />
      <p className="font-mono text-[#88c070] text-sm text-center leading-relaxed">
        Arrows/WASD move &bull; Z/Enter confirm &bull; X/Esc cancel
      </p>
    </main>
  );
}
