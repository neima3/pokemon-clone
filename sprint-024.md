# Sprint 024 — Two-Turn Moves & Confusion System

## Goals
- Implement two-turn moves (Solar Beam, Fly, Dig)
- Add confusion status system
- Add confusion-inducing moves (Confuse Ray, Supersonic)
- Visual polish for battles
- Performance optimizations

## Status: COMPLETED

## Implementation Plan

1. Add two-turn move tracking state to BattleScene
2. Implement charge turn logic in executeTurn
3. Add invulnerability for Fly/Dig
4. Add confusion status to Pokemon class
5. Add confusion check in canAct
6. Add confusion self-hit logic
7. Add confusion-inducing moves to MOVES
8. Visual polish: confusion particles, charge animation
9. Run npm run build to verify
10. Update CHANGELOG.md
11. Commit changes

## Two-Turn Moves

### Charging Moves
- Solar Beam: Charge turn, then attack (2x power in sunny weather)

### Invulnerability Moves  
- Fly: Turn 1 fly up (invulnerable), Turn 2 attack
- Dig: Turn 1 dig underground (invulnerable), Turn 2 attack

## Confusion System

### Confusion Status
- 33% chance to hurt self instead of attacking
- Self-damage: 40 power physical attack against own defense
- Lasts 1-4 turns randomly

### Confusion Moves
- Confuse Ray: Ghost, 100% accuracy, causes confusion
- Supersonic: Normal, 55% accuracy, causes confusion
- Swagger: Normal, 90% accuracy, raises target Attack +2, causes confusion

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-023.md
