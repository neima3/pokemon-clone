# Sprint 038 — Berry System & Visual Polish

## Goals
- Add Berry system with in-battle auto-consumption effects
- Add shiny Pokemon visual effects (sparkle animation)
- Add more wild Pokemon species to encounter tables
- Performance optimizations for particle systems
- Bug fixes for edge cases

## Status: IN PROGRESS

## Implementation Plan

1. Add Berry items to HeldItems.ts (Oran Berry, Sitrus Berry, Cheri Berry, etc.)
2. Add auto-consumption triggers in BattleEngine.ts
3. Add shiny sparkle animation in BattleScene.ts
4. Add new Pokemon species: Tangela, Scyther, Pinsir, Lickitung
5. Optimize particle rendering with object pooling
6. Fix any edge case bugs in battle system
7. Run npm run build to verify
8. Update CHANGELOG.md
9. Commit changes

## New Features

### Berry System
- **Oran Berry**: Heals 10 HP when HP drops below 50%
- **Sitrus Berry**: Heals 25% HP when HP drops below 50%
- **Cheri Berry**: Cures paralysis when inflicted
- **Chesto Berry**: Cures sleep when inflicted
- **Pecha Berry**: Cures poison when inflicted
- **Rawst Berry**: Cures burn when inflicted
- **Aspear Berry**: Cures freeze when inflicted
- **Persim Berry**: Cures confusion when inflicted

### Shiny Visual Effects
- Sparkle particles around shiny Pokemon in battle
- Different color palette tint for shiny sprites
- Shiny star icon in Pokemon info display

### New Pokemon
- **Tangela**: Grass-type vine Pokemon
- **Scyther**: Bug/Flying mantis Pokemon
- **Pinsir**: Bug-type stag beetle Pokemon
- **Lickitung**: Normal-type licking Pokemon

## Performance
- Particle object pooling to reduce GC pressure
- Batched rendering for particles
- Optimized spawn rate calculations

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-037.md
