# Sprint 017 — Visual Polish & Quality Improvements

## Goals
- Add healing visual effects for potions and recovery moves
- Fix dragon attack animation stroke issue
- Fix bag menu in battle to show all item types (great ball, ultra ball, etc.)
- Add stat change visual indicators (+/- floating text)
- Optimize audio system to reduce garbage collection
- Improve shiny odds based on badges collected

## Status: COMPLETE

## Implementation Plan

1. Fix BattleUI.ts dragon animation - add proper beginPath() before stroke
2. Update bag menu in BattleScene.ts to include all ball types and potions
3. Add heal particle effect to BattleUI.ts
4. Add stat change floating text to BattleScene.ts
5. Optimize Audio.ts to reuse gain nodes and reduce GC
6. Add badge-based shiny odds improvement in Pokemon.ts
7. Run npm run build to verify
8. Update CHANGELOG.md
9. Commit changes

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-016.md
