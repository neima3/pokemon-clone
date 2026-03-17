# Sprint 034 — Legendary Encounters & Post-Game

## Goals
- Add Mewtwo as a legendary encounter in Cerulean Cave
- Implement post-game unlock system after defeating Champion
- Add Master Ball item for guaranteed catch
- Add legendary battle theme music
- Add Cerulean Cave area to the map
- Special legendary encounter mechanics (one-time only, higher difficulty)

## Status: COMPLETED

## Implementation Plan

1. Add Master Ball item to ITEMS in data.ts
2. Add Mewtwo species data and sprite
3. Add postGame flag to GameState
4. Extend map with Cerulean Cave area
5. Add NPC that blocks cave entrance until post-game
6. Add legendary encounter table with Mewtwo
7. Add legendary battle music theme
8. Add Master Ball guaranteed catch logic
9. Run npm run build to verify
10. Update CHANGELOG.md
11. Commit changes

## Legendary Mechanics

### Mewtwo
- Level 70 legendary Psychic-type
- Found in Cerulean Cave (post-game only)
- High stats: 106 HP, 110 Atk, 90 Def, 154 SpA, 90 SpD, 130 Spd
- Cannot be encountered again once caught or defeated
- Pressure ability (doubles opponent PP usage)

### Master Ball
- Catches any Pokemon with 100% success rate
- Rare item, obtainable from NPC after becoming Champion
- Only one per playthrough

### Post-Game Unlock
- After defeating Champion, postGame flag is set
- Cerulean Cave NPC allows entry
- New encounter tables available
- Special dialogue from NPCs acknowledging Champion status

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-033.md
