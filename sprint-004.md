# Sprint 004 - Sound, NPCs, Trainer Battles, Evolution & Expanded World

## Goals
1. Chiptune sound system (SFX + music)
2. Screen transition effects
3. Expanded Pokemon roster (4 new species + 3 evolutions)
4. Evolution system
5. NPC system with dialogue
6. Pokemon Center & Poke Mart
7. Trainer battles
8. Redesigned map with town + routes
9. Visual polish (animated tiles, HUD)

## Status: COMPLETE

## Deliverables
- `src/engine/Audio.ts` — Web Audio API chiptune synthesizer with 15+ SFX (encounter, attack, level up, evolve, catch, heal, purchase, etc.) and procedural battle/overworld music loops
- `src/game/TransitionEffect.ts` — Battle encounter transition (flash + closing bars) and fade effect
- `src/game/overworld/NPC.ts` — NPC class with dialogue, facing, trainer battle support, defeat tracking
- `src/game/overworld/tiles.ts` — 9 new tile types (PokeCenterRoof/Door, MartRoof/Door, BuildingWall, Sign, Fence, Ledge), animated water shimmer, swaying tall grass
- `src/game/overworld/mapData.ts` — Expanded 40×30 map with town (buildings, fences, signs), Route 1 (trainers, grass), Route 2 (harder encounters), 7 NPC definitions
- `src/game/overworld/OverworldScene.ts` — Complete rewrite: NPC interaction, dialogue system, Pokemon Center healing, Poke Mart shop menu, route-based encounters, HUD (zone name, money), music integration
- `src/game/battle/data.ts` — 7 new species (Ivysaur, Charmeleon, Wartortle, Pikachu, Zubat, Geodude, Nidoran♂), 12+ new moves, 4 new types (Electric, Ground, Rock, Flying), route encounter tables, trainer definitions, item prices
- `src/game/battle/sprites.ts` — Pixel art sprites (front+back) for all 13 species, 6 NPC sprite types (youngster, lass, bugCatcher, hiker, nurse, shopkeeper)
- `src/game/battle/Pokemon.ts` — Evolution system (canEvolve, evolutionTarget, evolve() preserves HP ratio and moves)
- `src/game/battle/BattleScene.ts` — SFX integration, trainer battles (multi-Pokemon, rewards, can't run/use items), evolution check after victory, evolution animation
- `src/game/GameState.ts` — Money system, defeated trainer tracking, healTeam(), save/load for money + defeated trainers
- `src/game/GameCanvas.tsx` — Transition effect integration, trainer battle callback, audio initialization
- `src/game/StarterSelectScene.ts` — SFX on select/confirm, evolution info display
- `src/app/page.tsx` — Updated control hints

## New Pokemon
| Species | Types | Where Found | Notes |
|---------|-------|-------------|-------|
| Ivysaur | Grass/Poison | Evolution (Bulbasaur Lv16) | Higher stats, learns Seed Bomb |
| Charmeleon | Fire | Evolution (Charmander Lv16) | Higher stats, learns Flamethrower |
| Wartortle | Water | Evolution (Squirtle Lv16) | Higher stats, learns Water Pulse |
| Pikachu | Electric | Route 1 (rare), Route 2 | Fast, learns Thunderbolt |
| Zubat | Poison/Flying | Route 2 | Common, learns Wing Attack |
| Geodude | Rock/Ground | Route 2 | High DEF, learns Rock Slide |
| Nidoran♂ | Poison | Route 1, Route 2 | Learns Headbutt |

## Trainers
| Trainer | Location | Team | Reward |
|---------|----------|------|--------|
| Youngster Joey | Route 1 | Rattata Lv5 | ¥120 |
| Lass Sally | Route 1 | Pidgey Lv4, Nidoran♂ Lv5 | ¥200 |
| Bug Catcher Rick | Route 2 | 3× Caterpie (Lv4, 4, 6) | ¥150 |
| Hiker Dave | Route 2 | Geodude Lv7, Geodude Lv8 | ¥350 |

## Notes
- Started: 2026-03-16
- Building on Sprint 003 battle system
- Sound uses Web Audio API oscillators (no external audio files)
- Battle music: A-minor arpeggiated pattern with bass line
- Overworld music: C-major cheerful melody
- Evolution preserves HP ratio and current moves
- Trainer battles: can't run, can't use items, multi-Pokemon support
- Money starts at ¥1000, earned from trainer victories, spent at Poke Mart
- Map zones: Town (easy encounters), Route 1 (medium), Route 2 (harder)
- NPCs face the player when spoken to
- Defeated trainers are tracked in save data
- Pikachu is rare (5-10% encounter rate)
