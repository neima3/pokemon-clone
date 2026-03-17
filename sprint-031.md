# Sprint 031 — Terrain Effects System

## Goals
- Implement terrain effects (Electric, Psychic, Grassy, Misty)
- Add terrain-setting moves (Electric Terrain, Psychic Terrain, Grassy Terrain, Misty Terrain, Tapu moves)
- Terrain-based move power boosts (1.5x for matching types)
- Terrain immunity effects (sleep prevention, priority blocking, etc.)
- Visual terrain overlays and indicators
- Terrain-affected abilities (Surge Surfer, etc.)

## Status: COMPLETED

## Implementation Plan

1. Add TerrainType to data.ts
2. Add terrain state tracking to BattleScene
3. Add terrain moves to data.ts (Electric Terrain, Psychic Terrain, Grassy Terrain, Misty Terrain)
4. Update BattleEngine to handle terrain effects
5. Add terrain damage/heal modifiers
6. Add terrain status immunity effects
7. Add visual terrain rendering in BattleScene
8. Add terrain-affected abilities
9. Run npm run build to verify
10. Update CHANGELOG.md
11. Commit changes

## Terrain Effects

### Electric Terrain
- Electric moves: 1.5x power
- Grounded Pokemon immune to sleep
- Lasts 5 turns (8 with Terrain Extender)
- Visual: Electric sparks/pulses on ground

### Psychic Terrain
- Psychic moves: 1.5x power
- Grounded Pokemon immune to priority moves
- Lasts 5 turns
- Visual: Psychic waves/ripples

### Grassy Terrain
- Grass moves: 1.5x power
- Grounded Pokemon heal 1/16 HP per turn
- Earthquake/Magnitude/Bulldoze: 0.5x power
- Lasts 5 turns
- Visual: Grass/flowers growing

### Misty Terrain
- Dragon moves: 0.5x power
- Grounded Pokemon immune to status conditions
- Lasts 5 turns
- Visual: Mist/fog overlay

## Terrain-Setting Moves
- Electric Terrain (Electric, status)
- Psychic Terrain (Psychic, status)
- Grassy Terrain (Grass, status)
- Misty Terrain (Fairy, status)

## Terrain-Related Abilities
- Surge Surfer: Speed doubles in Electric Terrain
- Grass Pelt: Defense boosts in Grassy Terrain
- Leaf Guard: Immune to status in Grassy Terrain

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-030.md
