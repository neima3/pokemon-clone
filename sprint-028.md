# Sprint 028 — Substitute, Trapping & Disable System

## Goals
- Substitute system (creates decoy that takes damage)
- Trapping moves (Wrap, Fire Spin, Whirlpool, Clamp, Bind)
- Disable move (prevents using last used move)
- Encore move (forces repeated use of last move)
- Taunt move (prevents status moves)
- Visual effects for new mechanics

## Status: COMPLETED

## Implementation Plan

1. Add substitute HP tracking to Pokemon class
2. Add trapped state and trapping moves to Pokemon class
3. Add disabled move and encore tracking to Pokemon class
4. Add taunt state to Pokemon class
5. Add new moves to data.ts (Substitute, Wrap, Fire Spin, Whirlpool, Clamp, Disable, Encore, Taunt)
6. Update BattleEngine to handle substitute damage redirection
7. Update BattleEngine to handle trapping damage
8. Update BattleEngine to handle disable/encore restrictions
9. Update BattleEngine to handle taunt restrictions
10. Update BattleScene for visual effects (substitute doll, trap indicators)
11. Run npm run build to verify
12. Update CHANGELOG.md
13. Commit changes

## Substitute Mechanic
- User sacrifices 25% of max HP to create a substitute
- Substitute has HP equal to the sacrificed amount
- All damage is redirected to substitute until it breaks
- Status conditions cannot be applied while substitute is active
- Substitute breaks when its HP reaches 0

## Trapping Moves
- Wrap: Normal, 15 power, 90% accuracy, traps for 2-5 turns
- Fire Spin: Fire, 35 power, 85% accuracy, traps for 2-5 turns, can burn
- Whirlpool: Water, 35 power, 85% accuracy, traps for 2-5 turns
- Clamp: Water, 35 power, 85% accuracy, traps for 2-5 turns
- Bind: Normal, 15 power, 85% accuracy, traps for 2-5 turns

Trapped Pokemon cannot switch out and take 1/16 max HP damage per turn.

## Disable Mechanic
- Disables the target's last used move for 4 turns
- Target cannot use the disabled move
- Message: "X's move was disabled!"

## Encore Mechanic
- Forces target to use its last move for 3 turns
- Target can only use the encored move
- Message: "X received an encore!"

## Taunt Mechanic
- Target cannot use status moves for 3 turns
- Message: "X fell for the taunt!"

## Visual Effects
- Substitute: Small doll sprite in front of Pokemon
- Trapped: Red binding effect around trapped Pokemon
- Disabled: Gray X over disabled move slot
- Encore: Musical notes around affected Pokemon
- Taunt: Angry expression indicator

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-027.md
