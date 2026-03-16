# Sprint 002 - Battle System & Encounters

## Goals
1. Wild Pokémon encounter system (walking in grass triggers battles)
2. Battle scene with turn-based combat
3. Player Pokémon team (starter selection)
4. Basic moves (tackle, growl, etc.)
5. HP bars and battle UI
6. Win/lose conditions

## Status: COMPLETE

## Deliverables
- `src/game/battle/data.ts` — Types, type chart, 10 moves, 6 species definitions
- `src/game/battle/Pokemon.ts` — Pokemon class with stats, HP, stage modifiers
- `src/game/battle/sprites.ts` — Pixel art front/back sprites for all 6 species
- `src/game/battle/BattleEngine.ts` — Damage formula, STAB, type effectiveness, status effects
- `src/game/battle/BattleUI.ts` — HP bars, text box, action menu, move menu
- `src/game/battle/BattleScene.ts` — Full battle state machine (intro→action→moves→combat→result)
- `src/game/StarterSelectScene.ts` — Choose from Bulbasaur/Charmander/Squirtle
- `src/game/GameState.ts` — Shared player state (team)
- Modified `src/engine/Input.ts` — Added action/cancel/direction pressed methods for menus
- Modified `src/game/overworld/OverworldScene.ts` — Encounter system in tall grass
- Modified `src/game/GameCanvas.tsx` — Wired starter→overworld→battle flow

## Notes
- Started: 2026-03-16
- Building on Sprint 001 foundation
- 3 starters at Level 5, wild Pokemon levels 2-5
- Type effectiveness: fire>grass/bug, water>fire, grass>water, etc.
- 15% encounter rate per step in tall grass
- Auto-heal on loss (no Pokemon Center yet)
