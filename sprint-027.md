# Sprint 027 — Entry Hazards & Strategic Items

## Goals
- Entry hazard system (Spikes, Stealth Rock, Toxic Spikes)
- New held items (Choice Specs, Choice Scarf, Rocky Helmet, Air Balloon, Black Sludge)
- New abilities (Prankster, Magic Guard, Magic Bounce)
- New moves (U-turn, Volt Switch, Baton Pass, Rapid Spin clears hazards)
- Visual indicators for active hazards

## Status: COMPLETED

## Implementation Plan

1. Add hazard state tracking to BattleScene
2. Add Spikes, Stealth Rock, Toxic Spikes to MOVES
3. Implement hazard damage on Pokemon entry
4. Add new held items to HeldItems.ts
5. Implement Choice items (lock move, boost stat)
6. Add Rocky Helmet contact damage
7. Add Air Balloon (Ground immunity, pops on hit)
8. Add Black Sludge (Leftovers for Poison types)
9. Add Prankster ability (priority on status moves)
10. Add Magic Guard ability (no indirect damage)
11. Add Magic Bounce ability (reflect status moves)
12. Add U-turn, Volt Switch, Baton Pass moves
13. Make Rapid Spin clear hazards
14. Add hazard visual indicators
15. Run npm run build to verify
16. Update CHANGELOG.md
17. Commit changes

## Entry Hazards

### Spikes (Ground)
- Power 0, Accuracy 100%, PP 20
- Sets 1 layer of spikes on opponent's side
- Max 3 layers: 1/8, 1/6, 1/4 HP damage on switch
- Does not affect Flying types or Levitate

### Stealth Rock (Rock)
- Power 0, Accuracy 100%, PP 20
- Sets rocks on opponent's side
- Damage based on type effectiveness: 12.5% * effectiveness
- Affects all Pokemon

### Toxic Spikes (Poison)
- Power 0, Accuracy 100%, PP 20
- Sets 1 layer of toxic spikes on opponent's side
- 1 layer: regular poison, 2 layers: toxic poison
- Does not affect Steel, Poison types (absorbs)

## New Held Items

### Choice Specs
- Locks user into first move
- Boosts Special Attack by 50%
- Note: For simplicity, boosts all moves by 50%

### Choice Scarf
- Locks user into first move
- Boosts Speed by 50%

### Rocky Helmet
- Deals 1/6 max HP damage to contact attackers

### Air Balloon
- Grants Ground immunity
- Pops when hit by any move

### Black Sludge
- Heals 1/16 max HP each turn (Poison types only)
- Damages 1/8 max HP each turn (non-Poison types)

## New Abilities

### Prankster
- Priority +1 on all status moves

### Magic Guard
- Prevents all indirect damage (hazards, poison, burn, recoil, life orb)

### Magic Bounce
- Reflects status moves back at the user

## New Moves

### U-turn (Bug)
- Power 70, Physical, switches user out after hit

### Volt Switch (Electric)
- Power 70, Physical, switches user out after hit

### Baton Pass (Normal)
- Status move, switches user out and passes stat changes

### Rapid Spin Enhancement
- Clears all hazards on user's side

## Visual Indicators
- Spikes: Small spike icons near Pokemon's feet
- Stealth Rock: Floating rock particles around Pokemon
- Toxic Spikes: Purple bubble particles near Pokemon's feet

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-026.md
