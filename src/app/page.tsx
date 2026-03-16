'use client';

import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('@/game/GameCanvas'), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#081820] gap-4 p-4">
      <h1 className="font-mono text-[#e0f8d0] text-2xl tracking-wider">
        POK&Eacute;MON
      </h1>
      <GameCanvas />
      <div className="font-mono text-sm text-center leading-relaxed max-w-[640px]">
        <p className="text-[#88c070]">
          Arrows/WASD move &bull; Z/Enter confirm &bull; X/Esc cancel &bull; M menu
        </p>
        <p className="text-[#346856] text-xs mt-1">
          Talk to NPCs &bull; Visit the POK&Eacute;MON Center to heal &bull; Shop at the POK&Eacute; Mart &bull; Challenge the GYM
        </p>
      </div>
    </main>
  );
}
