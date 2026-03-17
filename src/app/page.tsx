'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import VersionHistory from './VersionHistory';
import { getVersionString } from './version';

const GameCanvas = dynamic(() => import('@/game/GameCanvas'), { ssr: false });

export default function Home() {
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#081820] gap-4 p-4 relative">
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
        
        <button 
          onClick={() => setShowVersionHistory(true)}
          className="text-[#346856] hover:text-[#88c070] text-xs mt-4 underline decoration-[#346856]/50 hover:decoration-[#88c070] transition-colors"
        >
          {getVersionString()} - View Changelog
        </button>
      </div>

      {showVersionHistory && (
        <VersionHistory onClose={() => setShowVersionHistory(false)} />
      )}
    </main>
  );
}
