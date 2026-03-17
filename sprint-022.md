# Sprint 022 — Bug Fixes, Smarter AI & Battle Enhancements

## Goals
- Fix bugs in battle system (contact abilities, duplicate interface)
- Implement smarter enemy AI that considers type effectiveness
- Add weather visual effects in battles
- Add multi-hit moves (Double Slap, Fury Attack, etc.)
- Improve battle depth and visual feedback

## Status: COMPLETED

## Implementation Plan

1. Fix duplicate TurnEndResult interface in BattleEngine.ts
2. Fix checkContactAbility bug (wrong status check logic)
3. Implement smarter AI (consider type effectiveness, STAB, accuracy)
4. Add weather visual effects to BattleScene
5. Add multi-hit moves support (hits field in MoveData)
6. Add multi-hit move definitions (Double Slap, Fury Swipes, etc.)
7. Update executeMove to handle multi-hit moves
8. Update doAttack to show multi-hit messages
9. Run npm run build to verify
10. Update CHANGELOG.md
11. Commit changes

## Bug Fixes

### Duplicate TurnEndResult Interface
- Removed duplicate interface definition in BattleEngine.ts (lines 22-26 and 33-36)

### Contact Ability Bug
- **Issue**: `checkContactAbility` checked `!attacker.status` which means "return null if attacker has NO status"
- **Fix**: Changed to `attacker.status` so it returns null if attacker ALREADY has a status
- Also removed redundant `!attacker.status` checks inside each ability block

## Smarter AI Implementation

### AI Scoring System
The enemy AI now scores each move based on:
1. **Base Power**: Higher power = higher score
2. **Type Effectiveness**: Super effective moves get 2x score, not very effective gets 0.5x, immune gets 0
3. **STAB Bonus**: 1.3x multiplier for moves matching Pokemon's type
4. **Accuracy**: Lower accuracy reduces score proportionally
5. **Priority**: +1 priority moves get 1.2x bonus
6. **Drain**: Drain moves get 1.1x bonus
7. **Status Moves**: Scored separately with bonuses for applying status to opponents without one
8. **Randomness**: ±10 points of variance to prevent predictability

### Move Selection
- If best move scores > 60, 70% chance to use it
- Otherwise, randomly select from top 3 moves

## Weather Visual Effects

Added weather particle systems to battles:
- **Rain**: Blue streaks falling diagonally
- **Hail**: White/light blue squares falling
- **Sandstorm**: Tan particles blowing horizontally
- **Sunny**: Yellow particles floating upward with warm overlay
- **Fog**: Gray circles drifting with fog overlay

## Multi-Hit Moves

### New Moves Added
- `furyAttack`: Normal, 15 power, 85% accuracy, 2-5 hits
- `pinMissile`: Bug, 25 power, 95% accuracy, 2-5 hits
- `bulletSeed`: Grass, 25 power, 100% accuracy, 2-5 hits
- `rockBlast`: Rock, 25 power, 90% accuracy, 2-5 hits

### Updated Existing Moves
- `doubleSlap`: Changed to 15 power, 2-5 hits (was 45 power, single hit)
- `furySwipes`: Changed to 18 power, 2-5 hits (was 50 power, single hit)

### Technical Implementation
- Added `hits?: [number, number]` field to MoveData (min, max hits)
- Added `hits?: number` field to TurnResult (actual number of hits)
- Damage loop calculates each hit independently with separate critical checks
- Total damage accumulated and displayed with "Hit X times!" message

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-021.md
