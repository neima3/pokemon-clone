# Sprint 029 — Infatuation, Phazing & Delayed Effects

## Goals
- Infatuation system (Attract move + Cute Charm ability)
- Phazing moves (Roar, Whirlwind, Dragon Tail, Circle Throw)
- Yawn delayed sleep mechanic
- Wish delayed heal mechanic
- Mean Look/Block to prevent switching
- Heal Bell/Aromatherapy team cure
- Visual effects for new mechanics

## Status: COMPLETED

## Implementation Plan

1. Add infatuated state and attractTarget to Pokemon class
2. Add yawn state to Pokemon class (sleeps next turn)
3. Add wish state to Pokemon class (heals in 2 turns)
4. Add cantSwitch state to Pokemon class (Mean Look/Block)
5. Add new moves to data.ts (Attract, Roar, Whirlwind, Dragon Tail, Circle Throw, Yawn, Wish, Mean Look, Block, Heal Bell, Aromatherapy)
6. Update BattleEngine to handle infatuation (50% skip chance)
7. Update BattleEngine to handle phazing (force switch)
8. Update BattleEngine to handle Yawn (sleep after 1 turn)
9. Update BattleEngine to handle Wish (heal after 2 turns)
10. Update BattleEngine to handle Mean Look/Block (prevent switch)
11. Update BattleEngine to handle Heal Bell/Aromatherapy (cure team)
12. Update BattleScene for visual effects (hearts for infatuation, notes for heal bell)
13. Run npm run build to verify
14. Update CHANGELOG.md
15. Commit changes

## Infatuation Mechanic
- Target becomes infatuated if opposite gender
- 50% chance to skip turn when infatuated
- Wears off if either Pokemon switches or faints
- Attracted Pokemon shows hearts floating around it
- Oblivious ability prevents infatuation

## Phazing Moves
- Roar/Whirlpool: -6 priority, forces switch (wild: ends battle, trainer: sends next Pokemon)
- Dragon Tail: 60 power, forces switch
- Circle Throw: 60 power, forces switch
- Fails if no other Pokemon available

## Yawn Mechanic
- Target falls asleep at the end of next turn
- Can be prevented by switching
- Message: "X grew drowsy!"

## Wish Mechanic
- Heals 50% of user's max HP after 2 turns
- Heals the Pokemon currently active (not necessarily the user)
- Message: "X's wish came true!"

## Mean Look/Block
- Prevents target from switching
- Can be Baton Passed
- Wears off if user switches or faints

## Heal Bell/Aromatherapy
- Cures status conditions for entire team
- Heal Bell: Normal type, affects all party Pokemon
- Aromatherapy: Grass type, affects all party Pokemon
- Soundproof blocks Heal Bell

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-028.md
