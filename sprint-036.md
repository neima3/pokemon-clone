# Sprint 036 — Critical Fixes & Missing Features

## Goals
- Fix lint errors (unused vars, prefer-const)
- Add missing move definitions for new Pokemon
- Fix Recover move effect bug
- Add Elite Four/Champion NPC triggers in Pokemon League
- Implement Pokedex viewing functionality
- Add held items to shop inventory

## Status: COMPLETED

## Implementation Plan

1. Fix lint errors in BattleEngine.ts, BattleScene.ts, data.ts, OverworldScene.ts
2. Add missing moves: transform, leechLife, spore, hyperVoice, competitive ability
3. Fix Recover move (effect: 'raise_defense' -> 'heal')
4. Add Elite Four NPCs (Lorelei, Bruno, Agatha, Lance) and Champion Gary to Pokemon League
5. Implement Pokedex menu rendering with seen/caught Pokemon display
6. Add held items (Leftovers, Scope Lens, type boosters) to Poke Mart
7. Run npm run build to verify
8. Update CHANGELOG.md
9. Commit changes

## Bug Fixes

### Move Definition Bugs
- **Recover**: Currently raises defense, should heal 50% HP
- **transform**: Missing definition for Ditto
- **leechLife**: Missing definition for Paras
- **spore**: Missing definition for Paras/Parasect
- **hyperVoice**: Missing definition for Wigglytuff

### Code Quality
- Remove unused imports/variables
- Change let to const where appropriate
- Fix TypeScript lint errors

## New Features

### Elite Four & Champion NPCs
- Lorelei (Ice-type specialist) at Pokemon League entrance
- Bruno (Fighting-type specialist) after Lorelei
- Agatha (Ghost-type specialist) after Bruno
- Lance (Dragon-type specialist) after Agatha
- Champion Gary as final boss

### Pokedex Menu
- Display seen Pokemon count
- Display caught Pokemon count
- List all seen/caught Pokemon with numbers
- Show Pokemon type and basic info

### Shop Held Items
- Leftovers: Heals 1/16 HP per turn (¥5000)
- Scope Lens: Doubles critical hit rate (¥3000)
- Type-boosting items (Charcoal, Mystic Water, etc.): ¥1000 each

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-035.md
