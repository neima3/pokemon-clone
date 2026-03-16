# Sprint 003 - Catching, Leveling, Inventory & Save System

## Goals
1. EXP & leveling system (gain EXP from battles, level up, learn new moves)
2. Wild Pokémon catching with Pokéball mechanic
3. Inventory system (Pokéballs and Potions usable in battle)
4. Party management (switch Pokémon mid-battle, auto-switch on faint)
5. Save/Load system (localStorage persistence)

## Status: COMPLETE

## Deliverables
- `src/game/battle/data.ts` — Added 5 new moves (Razor Leaf, Fire Fang, Bite, BubbleBeam, Bug Bite), EXP yields, catch rates, level-up move tables, item definitions
- `src/game/battle/Pokemon.ts` — Added speciesKey, EXP tracking, expPercent/expToNext getters, gainExp() with level-up + new move learning, toJSON()/fromJSON() serialization
- `src/game/battle/BattleEngine.ts` — Added attemptCatch() with shake-based catch formula
- `src/game/battle/BattleUI.ts` — 2×2 action menu (FIGHT/BAG/POKéMON/RUN), bag item menu, full-screen party menu with HP bars, EXP bar in player info, pokéball sprite drawing
- `src/game/battle/BattleScene.ts` — Complete rewrite with bag phase, party phase, catch animation, EXP gain phase, level-up messages, party switching, auto-switch on faint
- `src/game/GameState.ts` — Inventory system, save/load to localStorage, addToTeam (max 6), position tracking
- `src/game/GameCanvas.tsx` — Save/load integration, auto-save after battle, resume from save on reload
- `src/game/overworld/OverworldScene.ts` — GameState integration, position save/restore on scene transitions
- `src/game/overworld/Player.ts` — Added setPosition() for save/load teleport
- `src/app/page.tsx` — Updated control instructions

## Notes
- Started: 2026-03-16
- Building on Sprint 002 battle system
- EXP curve: medium-fast (level^3), formula: (baseExpYield * enemyLevel) / 7
- Catch formula: simplified Gen I with 3-shake system
- Level-up moves learned automatically if < 4 moves
- Auto-save after every battle, position saved on scene exit
- Save persists team, inventory, and player position
- Party switching resets stat stages, enemy gets a free turn
- Using potion/pokéball costs a turn (enemy attacks after)
- Starter items: 5 Pokéballs, 3 Potions
