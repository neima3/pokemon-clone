# Sprint 032 — Z-Moves System

## Goals
- Implement Z-Moves: powerful signature moves usable once per battle
- Add Z-Crystals as held items that enable Z-Moves
- Z-Move visual effects with dramatic animations
- Z-Move selection UI in battle menu
- Strategic one-time-use mechanic per battle

## Status: COMPLETED

## Implementation Plan

1. Add Z-Crystal items to HeldItems.ts
2. Add Z-Move data to data.ts with power multipliers
3. Add zMoveUsed state to Pokemon class
4. Update BattleScene to handle Z-Move activation
5. Add Z-Move visual effects (dramatic particles, screen flash)
6. Add Z-Move selection UI
7. Run npm run build to verify
8. Update CHANGELOG.md
9. Commit changes

## Z-Move Mechanics

### Z-Crystals
- Each type has a Z-Crystal (Firium Z, Waterium Z, etc.)
- Pokemon must hold matching Z-Crystal to use Z-Move
- Pokemon must have a move of the corresponding type

### Z-Move Effects
- Base power = move power × 1.5 (minimum 120 power)
- Always hits (bypasses accuracy check)
- Can only use one Z-Move per battle
- Dramatic visual effect with screen shake

### Type-Based Z-Moves
- Fire: Inferno Overdrive
- Water: Hydro Vortex
- Grass: Bloom Doom
- Electric: Gigavolt Havoc
- Psychic: Shattered Psyche
- Ghost: Never-Ending Nightmare
- Dark: Black Hole Eclipse
- Dragon: Devastating Drake
- Fighting: All-Out Pummeling
- Steel: Corkscrew Crash
- Flying: Supersonic Skystrike
- Poison: Acid Downpour
- Ground: Tectonic Rage
- Rock: Continental Crush
- Ice: Subzero Slammer
- Bug: Savage Spin-Out
- Fairy: Twinkle Tackle
- Normal: Breakneck Blitz

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-031.md
