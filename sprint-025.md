# Sprint 025 — Weather Abilities & Protection System

## Goals
- Integrate weather-based abilities (Chlorophyll, Swift Swim, Sand Veil)
- Add Protect/Detect move system
- Add Pursuit move (double damage on switching)
- Visual polish for battle UI (HP bar gradients, entry animations)
- Performance optimizations for particle systems

## Status: COMPLETED

## Implementation Summary

### Weather Abilities Integrated
- **Chlorophyll**: Speed doubles in sunny weather (Grass-types like Bulbasaur)
- **Swift Swim**: Speed doubles in rainy weather (Water-types)
- **Sand Veil**: Evasion increases by 25% in sandstorm
- **Quick Feet**: Speed increases by 50% when having a status condition
- **Tangled Feet**: Evasion increases by 25% when confused

### Protection System
- **Protect/Detect moves**: Priority +4, protects from all damage for one turn
- **Consecutive protection**: Success rate decreases (100% → 50% → 25% → etc.)
- **State tracking**: protected and consecutiveProtect fields in Pokemon class
- **End-of-turn reset**: Protection state resets properly between turns

### Pursuit Mechanic
- **Pursuit move**: Dark-type, 40 power, priority +1
- **Double damage**: When target is switching out, power doubles to 80
- **Switch tracking**: isSwitching flag set on Pokemon when withdrawing

### Technical Implementation
- Added getEffSpdWithWeather(weather) method to Pokemon class
- Added getEvasionWithWeather(weather) method to Pokemon class
- Extended MoveData interface with 'protect' effect and 'pursuit' flag
- Updated determineTurnOrder to accept weather parameter
- Updated executeMove to handle protect and pursuit mechanics
- Added resetProtection() function for end-of-turn cleanup
- Updated accuracy calculation to factor in evasion abilities

## Implementation Plan

1. Add weather speed boost to getEffSpd in Pokemon class
2. Add evasion boost for Sand Veil in accuracy calculation
3. Add protect state to Pokemon class
4. Add Protect/Detect moves to MOVES
5. Handle protect in executeMove
6. Add Pursuit move with switch detection
7. Add HP bar gradient rendering
8. Add Pokemon entry animation when switching
9. Optimize particle systems with object pooling
10. Run npm run build to verify
11. Update CHANGELOG.md
12. Commit changes

## Weather Abilities

### Chlorophyll
- Speed doubles in sunny weather
- Grass-type Pokemon with this ability benefit significantly

### Swift Swim  
- Speed doubles in rainy weather
- Water-type Pokemon with this ability benefit significantly

### Sand Veil
- Evasion boosted in sandstorm weather
- Ground/Rock-type Pokemon harder to hit

## Protection System

### Protect/Detect
- Protects Pokemon from all moves for one turn
- Success rate decreases with consecutive use (100% -> 50% -> 25% -> etc.)
- Adds strategic depth to battles

## Pursuit Move
- Dark-type move (40 power, 100% accuracy)
- Double damage (80 power) if target is switching out
- Forces opponent to think twice about switching

## Visual Polish
- HP bar with gradient fill (green -> yellow -> red)
- Smooth entry animation for switching Pokemon
- Particle effect optimization

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-024.md
