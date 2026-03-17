# Sprint 018 — Audio Optimization & Battle Enhancements

## Goals
- Optimize audio system to reduce garbage collection (reuse gain nodes)
- Improve shiny odds based on badges collected
- Add Pokemon cry sounds in battle (distinctive sounds per species)
- Add encounter rate variance based on terrain type

## Status: COMPLETE

## Implementation Plan

1. Refactor Audio.ts to pool and reuse gain nodes
2. Update Pokemon.ts to calculate shiny odds based on badge count
3. Add Pokemon cry system in Audio.ts (species-based sounds)
4. Update BattleScene.ts to play cries on Pokemon entry
5. Update OverworldScene.ts to vary encounter rates by terrain
6. Run npm run build to verify
7. Update CHANGELOG.md
8. Commit changes

## Technical Details

### Audio Optimization
- Create a pool of reusable gain nodes
- Pre-allocate oscillator nodes for common sounds
- Use object pooling for frequently created audio objects

### Badge-Based Shiny Odds
- Base odds: 1/256 (0.39%)
- Each badge improves odds by 10% cumulative
- 8 badges: ~1/119 (0.84%)

### Pokemon Cries
- Generate unique cry based on species ID
- Use frequency modulation to create distinctive sounds
- Play on entry and faint

### Terrain Encounter Variance
- Grass: standard rate (1/16)
- Water: lower rate (1/24) 
- Cave: higher rate (1/12)

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-017.md
