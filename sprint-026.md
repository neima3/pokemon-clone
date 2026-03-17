# Sprint 026 — Visual Polish & Counter Moves

## Goals
- HP bar with smooth gradient rendering (green → yellow → red)
- Pokemon entry/switch animations with slide-in effects
- Counter-type moves (Counter, Revenge, Mirror Coat, Metal Burst)
- New held items (Choice Band, Focus Sash, Expert Belt, Life Orb)
- Battle transition improvements and screen effects
- Performance optimization with particle object pooling

## Status: COMPLETED

## Implementation Plan

1. Update BattleUI with HP bar gradient rendering
2. Add entry animation state to BattleScene
3. Add Counter/Revenge/Mirror Coat moves to MOVES
4. Add damage tracking for counter moves in BattleEngine
5. Add new held items to HeldItems.ts
6. Implement particle pooling in BattleScene
7. Add screen flash effects for critical hits
8. Run npm run build to verify
9. Update CHANGELOG.md
10. Commit changes

## Visual Polish

### HP Bar Gradient
- Smooth color transition from green to yellow to red
- Animated fill with slight glow effect
- Better visual feedback for HP status

### Entry Animations
- Pokemon slide in from side when entering battle
- Shrink animation when switching out
- Brief pause with "Go! X!" message

### Screen Effects
- Flash on critical hits
- Screen shake intensity based on damage
- Weather overlay improvements

## New Moves

### Counter (Fighting)
- Priority -5 (always goes last)
- Deals 2x damage taken from physical moves
- Fails if not hit by physical move first

### Mirror Coat (Psychic)
- Priority -5
- Deals 2x damage taken from special moves
- Works like Counter but for special attacks

### Revenge (Fighting)
- Power 60, doubles to 120 if user was damaged this turn
- Priority -4

### Metal Burst (Steel)
- Priority 0
- Returns 1.5x damage taken from any move
- Only works if hit first

## New Held Items

### Choice Band
- Locks user into first move
- Boosts Attack by 50%

### Focus Sash
- Survives a KO hit with 1 HP (consumed)
- Only works at full HP

### Expert Belt
- Boosts super effective moves by 20%

### Life Orb
- Boosts all moves by 30%
- User takes 10% recoil damage

## Performance Optimizations

### Particle Pooling
- Reuse particle objects instead of creating new ones
- Reduce garbage collection pauses
- Smoother frame rate in particle-heavy scenes

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-025.md
