# Sprint 030 — Ability Polish, Delayed Attacks & Destiny Bond

## Goals
- Implement missing ability effects (Technician, Iron Fist, Reckless, Filter, Cute Charm)
- Future Sight delayed attack mechanic
- Doom Desire delayed attack mechanic
- Destiny Bond high-stakes move
- Perish Song counter mechanic
- Visual polish for battle effects

## Status: COMPLETED

## Implementation Plan

1. Update BattleEngine.ts to implement missing ability effects
2. Add futureSightTurns and doomDesireTurns tracking to Pokemon class
3. Add destinyBond and perishSong counters to Pokemon class
4. Add new moves to data.ts (Future Sight, Doom Desire, Destiny Bond, Perish Song)
5. Update BattleEngine to handle delayed attacks
6. Update BattleEngine to handle Destiny Bond/Perish Song
7. Add visual effects for delayed attacks
8. Run npm run build to verify
9. Update CHANGELOG.md
10. Commit changes

## Missing Ability Effects

### Technician
- Powers up moves with base power 60 or less by 1.5x
- Affects all moves, not just damaging ones

### Iron Fist
- Powers up punching moves by 1.2x
- Punching moves: Mach Punch, Dynamic Punch, Comet Punch, Mega Punch, Thunder Punch, Fire Punch, Ice Punch

### Reckless
- Powers up recoil moves by 1.2x
- Includes moves with recoil property

### Filter
- Reduces super effective damage by 25%
- Solid Rock has same effect

### Cute Charm
- 30% chance to infatuate on contact
- Works like Static but for infatuation

## Delayed Attack Mechanics

### Future Sight
- Psychic type, 120 power, 100% accuracy
- Attacks 2 turns later
- User can switch out, attack still lands
- Damage calculated when used, applied when hits

### Doom Desire
- Steel type, 140 power, 100% accuracy
- Attacks 2 turns later
- Same mechanics as Future Sight

## Destiny Bond
- If user faints this turn, attacker also faints
- Fails if used consecutively
- Message: "X took its attacker down with it!"

## Perish Song
- All Pokemon on field faint in 3 turns
- Counter decreases each turn
- Can be avoided by switching
- Message: "All Pokemon will perish in X turns!"

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-029.md
