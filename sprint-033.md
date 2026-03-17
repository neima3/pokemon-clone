# Sprint 033 — Mega Evolution System

## Goals
- Implement Mega Evolution: powerful temporary evolution during battle
- Add Mega Stones as held items that enable Mega Evolution
- Mega Evolution visual effects with dramatic animations
- Mega Evolution selection UI in battle menu (M key)
- Stat boosts and ability changes for Mega Evolved Pokemon
- One Mega Evolution per battle per trainer

## Status: COMPLETED

## Implementation Plan

1. Add Mega Stone items to HeldItems.ts
2. Add Mega Evolution data to data.ts with stat changes
3. Add megaEvolved and megaEvolutionData state to Pokemon class
4. Update BattleScene to handle Mega Evolution activation
5. Add Mega Evolution visual effects (dramatic particles, screen flash)
6. Add Mega Evolution UI indicator and activation key
7. Run npm run build to verify
8. Update CHANGELOG.md
9. Commit changes

## Mega Evolution Mechanics

### Mega Stones
- Each Mega-evolvable Pokemon has a specific Mega Stone (Venusaurite, Charizardite X/Y, etc.)
- Pokemon must hold matching Mega Stone to Mega Evolve
- Mega Evolution happens at the start of the turn before moves

### Mega Evolution Effects
- Temporary stat boosts (Attack, Defense, Sp.Atk, Sp.Def, Speed)
- Ability change to Mega-specific ability
- Lasts until end of battle
- Can only use one Mega Evolution per battle

### Mega Evolvable Pokemon (Gen 1)
- Venusaur → Mega Venusaur (Thick Fat)
- Charizard → Mega Charizard X (Tough Claws) or Y (Drought)
- Blastoise → Mega Blastoise (Mega Launcher)
- Alakazam → Mega Alakazam (Trace)
- Gengar → Mega Gengar (Shadow Tag)
- Kangaskhan → Mega Kangaskhan (Parental Bond)
- Pinsir → Mega Pinsir (Aerilate)
- Gyarados → Mega Gyarados (Mold Breaker)
- Aerodactyl → Mega Aerodactyl (Tough Claws)
- Mewtwo → Mega Mewtwo X/Y

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-032.md
