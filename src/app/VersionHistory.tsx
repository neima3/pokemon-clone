'use client';

import { VERSION } from './version';

interface VersionHistoryProps {
  onClose: () => void;
}

export default function VersionHistory({ onClose }: VersionHistoryProps) {
  const versions = [
    {
      version: '0.7.0',
      date: '2026-03-16',
      sprint: 6,
      changes: [
        'New Pokémon added',
        'Route 3 with Misty\'s gym',
        'PC Box system for storage',
        'Smarter AI opponents',
        'Move effectiveness indicators',
      ],
    },
    {
      version: '0.6.0',
      date: '2026-03-16',
      sprint: 5,
      changes: [
        'Status conditions (poison, paralysis, sleep, burn)',
        'Critical hit system',
        'Gym leader battles with badges',
        'Pause menu with save/load',
        'Pokédex tracking',
      ],
    },
    {
      version: '0.5.0',
      date: '2026-03-16',
      sprint: 4,
      changes: [
        'Chiptune sound system',
        'Screen transition effects',
        'Evolution system',
        'NPCs and trainer battles',
        'Pokémon Center & Poké Mart',
        'Expanded world map',
      ],
    },
    {
      version: '0.4.0',
      date: '2026-03-16',
      sprint: 3,
      changes: [
        'EXP & leveling system',
        'Pokémon catching',
        'Inventory system',
        'Party management',
        'Save/Load system',
      ],
    },
    {
      version: '0.3.0',
      date: '2026-03-16',
      sprint: 2,
      changes: [
        'Battle system',
        'Starter selection',
        'Turn-based combat',
        'Type matchups',
      ],
    },
    {
      version: '0.2.0',
      date: '2026-03-16',
      sprint: 1,
      changes: [
        'Core game engine',
        'Overworld movement',
        'Collision detection',
        'Camera system',
      ],
    },
    {
      version: '0.1.0',
      date: '2026-03-16',
      sprint: 0,
      changes: [
        'Initial project setup',
        'Next.js + TypeScript foundation',
        'HTML5 Canvas integration',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-4 border-gray-700 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b-4 border-gray-700 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Version History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Current Version */}
        <div className="bg-green-900/30 p-3 border-b-2 border-green-700">
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-bold">Current Version</span>
            <span className="text-green-300 font-mono">v{VERSION.full}</span>
          </div>
          <div className="text-green-500/70 text-xs mt-1">
            Sprint {VERSION.sprint} • Built {VERSION.buildDate}
          </div>
        </div>

        {/* Version List */}
        <div className="overflow-y-auto max-h-[50vh]">
          {versions.map((ver, idx) => (
            <div
              key={ver.version}
              className={`p-3 ${idx !== versions.length - 1 ? 'border-b border-gray-700' : ''} ${
                ver.version === VERSION.full ? 'bg-green-900/20' : 'hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-yellow-400 font-mono font-bold">v{ver.version}</span>
                <span className="text-gray-500 text-xs">{ver.date}</span>
              </div>
              <div className="text-gray-400 text-xs mb-2">Sprint {ver.sprint}</div>
              <ul className="text-gray-300 text-sm space-y-1">
                {ver.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 p-3 border-t-4 border-gray-700 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
