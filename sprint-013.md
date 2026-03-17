# Sprint 013 — Route 9 & Giovanni's Gym

## Goals
- Add Route 9 (Viridian City approach) as the final overworld area
- Add Giovanni as Gym Leader 8 with Ground-type team
- Add new Pokémon species: Raichu, Nidoking, Meowth, Persian, Kangaskhan, Tauros
- Add HYPER POTION and MAX POTION items
- Add Route 9 trainer battles (Cooltrainer Anya, Rex, Vera)
- Add victory message upon collecting all 8 badges

## Status: COMPLETE

## Completed Work

### Map Expansion (mapData.ts)
- Extended MAP_HEIGHT from 56 to 66 (10 new rows)
- Row 55 now has path opening at gx=35 leading south to Route 9
- Added Route 9 rows 56–65: grassland, tall grass, flowers, Viridian Gym building
- Viridian Gym at gx=28–32, rows 59–61 (E/Y roof, E/B/y door, E/E/P/E/E exit)
- Horizontal approach path at row 62 (gx=28–35) — Giovanni blocks at gx=30
- `getRouteZone` updated: `gy >= 56 → 'route9'`

### New Species (data.ts)
- `raichu` — Electric, Pikachu evolution at lv.26
- `nidoking` — Poison/Ground, Nidorino evolution at lv.36
- `meowth` — Normal, evolves to Persian at lv.28
- `persian` — Normal type
- `kangaskhan` — Normal type (rare Route 9 encounter)
- `tauros` — Normal type (Route 9 encounter)

### Trainers (data.ts)
- `cooltrainer_anya` — Lv.35–40 Ground/Normal team
- `cooltrainer_rex` — Lv.36–42 Ground/Rock team
- `cooltrainer_vera` — Lv.35–40 Normal team
- `gym_giovanni` — Dugtrio(43), Persian(44), Nidoking(46), Rhydon(48); reward ¥12000; EARTH BADGE

### Items (GameState.ts + OverworldScene.ts)
- Added `hyperPotion` (heals 200 HP, shop price ¥1200)
- Added `maxPotion` (fully restores HP, shop price ¥2500)
- Updated Inventory interface, save/load, getBagItems, updateMenuBag

### Audio (Audio.ts)
- Added `route9()` music — dramatic E-minor march theme for final area

### Sprites (sprites.ts)
- Added `gymLeader8` sprite — Giovanni: dark suit, slicked hair, Team Rocket boss

### Battle Victory (BattleScene.ts)
- After collecting all 8 badges, displays Pokémon Master victory message

### NPCs (mapData.ts)
- Giovanni NPC at (30,62) — blocks westward path, triggers gym battle
- Cooltrainer Anya at (9,58), Rex at (22,57), Vera at (40,60)
- Route 9 helper youngster at (4,61) with gym tips

## Notes
- Auto-started: Tue Mar 17 01:44:18 EDT 2026
- Previous sprint: sprint-012.md
