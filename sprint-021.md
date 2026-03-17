# Sprint 021 — Advanced Move Mechanics & Ability Triggers

## Goals
- Implement priority moves (Quick Attack always goes first)
- Implement drain moves (Absorb, Mega Drain, Giga Drain heal user)
- Implement recoil moves (Take Down, Flare Blitz damage user)
- Implement entry abilities (Intimidate lowers opponent's Attack)
- Implement turn-end abilities (Shed Skin may cure status)
- Improve battle depth and authenticity

## Status: COMPLETED

## Implementation Plan

1. Add move flags to MoveData interface (priority, drain, recoil)
2. Update MOVES definitions with appropriate flags
3. Implement priority in determineTurnOrder function
4. Implement drain healing in executeMove function
5. Implement recoil damage in executeMove function
6. Implement Intimidate trigger when Pokemon enters battle
7. Implement Shed Skin check at end of each turn
8. Run npm run build to verify
9. Update CHANGELOG.md
10. Commit changes

## Moves to Update

### Priority Moves (always go first)
- quickAttack: priority +1
- machPunch: priority +1

### Drain Moves (heal 50% of damage dealt)
- absorb: drain 50%
- megaDrain: drain 50%
- gigaDrain: drain 50%

### Recoil Moves (user takes 25% of damage)
- takeDown: recoil 25%
- flareBlitz: recoil 33%
- submission: recoil 25%
- highJumpKick: recoil 50% (on miss too)
- closeCombat: no recoil but lowers defense

## Abilities to Implement

### Entry Abilities
- **Intimidate**: Lower opponent's Attack by 1 stage when entering battle

### Turn-End Abilities
- **Shed Skin**: 30% chance to cure status at end of each turn

## Technical Details

### Move Flags in MoveData
```typescript
interface MoveData {
  // existing fields...
  priority?: number;     // Default 0, +1 for Quick Attack
  drain?: number;        // Percentage of damage healed (e.g., 50)
  recoil?: number;       // Percentage of damage taken (e.g., 25)
}
```

### Priority Calculation
- Moves with priority > 0 always go before moves with priority 0
- If same priority, use speed comparison
- Negative priority (slow moves) could be added later

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-020.md
