# Sprint 019 — Day/Night Encounters & Ambient Atmosphere

## Goals
- Complete terrain encounter variance (water encounters, different rates per terrain)
- Add day/night encounter variations (nocturnal Pokemon appear at night)
- Add ambient particle effects for atmosphere (leaves, dust motes)
- Add time display to HUD showing in-game time
- Visual polish for overworld immersion

## Status: COMPLETE

## Implementation Plan

1. Add Cave tile type to tiles.ts for cave areas
2. Update ENCOUNTER_RATES in OverworldScene.ts with water and cave rates
3. Add day/night encounter modifier to rollEncounter in data.ts
4. Add ambient particle system to OverworldScene.ts
5. Add time display to HUD
6. Run npm run build to verify
7. Update CHANGELOG.md
8. Commit changes

## Technical Details

### Terrain Encounter Rates (as planned in Sprint 018)
- TallGrass: 1/16 (0.0625) - standard
- Water: 1/24 (0.042) - lower rate for fishing/surfing
- Cave: 1/12 (0.083) - higher rate in caves

### Day/Night System
- 6am-6pm: Day time - standard encounters
- 6pm-8pm: Dusk - mixed encounters
- 8pm-6am: Night - nocturnal Pokemon (ghost, dark, psychic types more common)

### Ambient Particles
- Leaf particles in grassy areas
- Dust motes in caves/buildings
- Water sparkles near water tiles
- Snow particles in ice areas

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-018.md
