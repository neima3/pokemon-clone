# Sprint 035 — Quality of Life & Missing Species

## Goals
- Add missing Pokemon species for Cerulean Cave (Ditto, Wigglytuff, Paras, Parasect)
- Fix encounter table typos (dittom -> ditto)
- Add critical hit visual feedback (screen flash)
- Improve overall game polish

## Status: COMPLETED

## Implementation Plan

1. Add missing species: Ditto, Wigglytuff, Paras, Parasect to data.ts
2. Fix ceruleanCave encounter table (dittom -> ditto, add wigglytuff, parasect)
3. Add critical hit screen flash effect in BattleScene
4. Run npm run build to verify
5. Update CHANGELOG.md
6. Commit changes

## New Pokemon Species

### Ditto (#132)
- Normal type, Transform Pokemon
- Base stats: 48 HP, 48 Atk, 48 Def, 48 Spd (all equal)
- Limber ability (immune to paralysis)
- Rare encounter in Cerulean Cave

### Paras (#46) 
- Bug/Grass type, Mushroom Pokemon
- Evolves to Parasect at level 24
- Effect Spore/Dry Skin abilities
- Found in Cerulean Cave

### Parasect (#47)
- Bug/Grass type evolution of Paras
- Higher stats: 60 HP, 95 Atk, 80 Def, 30 Spd
- Learns X-Scissor, Giga Drain
- Effect Spore/Dry Skin abilities

### Wigglytuff (#40)
- Normal/Fairy type, Balloon Pokemon (Jigglypuff evolution)
- Very high HP: 140 base HP
- Cute Charm/Competitive abilities
- Found in Cerulean Cave

## Visual Improvements

### Critical Hit Flash
- White/yellow screen flash overlay when landing critical hits
- Flash alpha starts at 0.6, decays over 200ms
- Adds dramatic impact feedback to critical hits
- Triggers in playAttackAnim() when critical=true

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-034.md
- All missing species now properly defined in SPECIES
- Cerulean Cave encounter table now fully functional
