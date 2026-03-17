# Sprint 020 — Pokemon Abilities System

## Goals
- Add Pokemon abilities (each species has 1-2 possible abilities)
- Abilities affect battle (immunities, stat changes, entry effects)
- Show ability name when it activates in battle
- Add ability description to Pokemon info screen
- Improve strategic depth of battles

## Status: COMPLETED

## Implementation Plan

1. Add ability definitions to data.ts (AbilityData interface, ABILITIES object)
2. Update SpeciesData to include abilities array
3. Update SPECIES entries with appropriate abilities
4. Update Pokemon class to have an ability property
5. Implement ability triggers in BattleEngine.ts
6. Add ability activation messages in BattleScene.ts
7. Show ability in Pokemon info/menu screens
8. Run npm run build to verify
9. Update CHANGELOG.md
10. Commit changes

## Abilities to Implement

### Passive Abilities (always active)
- **Levitate** - Immune to Ground-type moves
- **Sturdy** - Survives with 1 HP from a KO hit at full HP
- **Immunity** - Cannot be poisoned
- **Flash Fire** - Immune to Fire, powers up Fire moves when hit
- **Water Absorb** - Heals from Water moves instead of damage
- **Volt Absorb** - Heals from Electric moves instead of damage
- **Thick Fat** - Fire/Ice resistance (0.5x damage)

### Contact Abilities (trigger when hit by contact moves)
- **Static** - 30% chance to paralyze attacker
- **Poison Point** - 30% chance to poison attacker
- **Flame Body** - 30% chance to burn attacker
- **Effect Spore** - 10% chance to paralyze/poison/sleep attacker

### Entry Abilities (trigger when Pokemon enters battle)
- **Intimidate** - Lowers opponent's Attack by 1 stage
- **Sand Stream** - Summons sandstorm (weather)
- **Drizzle** - Summons rain (weather)
- **Drought** - Summons sun (weather)

### HP-Based Abilities (boost power when HP is low)
- **Blaze** - Powers up Fire moves at 1/3 HP (1.5x)
- **Torrent** - Powers up Water moves at 1/3 HP (1.5x)
- **Overgrow** - Powers up Grass moves at 1/3 HP (1.5x)
- **Swarm** - Powers up Bug moves at 1/3 HP (1.5x)

### Weather Abilities
- **Swift Swim** - Speed doubles in rain
- **Chlorophyll** - Speed doubles in sun
- **Sand Veil** - Evasion +20% in sandstorm
- **Snow Cloak** - Evasion +20% in hail

## Species Ability Assignments

### Starters
- Bulbasaur/Ivysaur/Venusaur: Overgrow
- Charmander/Charmeleon/Charizard: Blaze
- Squirtle/Wartortle/Blastoise: Torrent

### Electric Types
- Pikachu/Raichu: Static
- Magnemite/Magneton: Sturdy, Magnet Pull
- Voltorb/Electrode: Static, Soundproof

### Fire Types
- Vulpix/Ninetales: Flash Fire
- Growlithe/Arcanine: Intimidate, Flash Fire
- Ponyta/Rapidash: Flash Fire, Run Away

### Water Types
- Staryu/Starmie: Illuminate, Natural Cure
- Tentacool/Tentacruel: Clear Body, Liquid Ooze
- Lapras: Water Absorb, Shell Armor
- Magikarp/Gyarados: Intimidate (Gyarados only)

### Psychic Types
- Abra/Kadabra/Alakazam: Synchronize, Inner Focus
- Drowzee/Hypno: Insomnia, Forewarn
- Mr. Mime: Soundproof, Filter

### Ghost Types
- Gastly/Haunter/Gengar: Levitate

### Poison Types
- Koffing/Weezing: Levitate
- Grimer/Muk: Stench, Sticky Hold
- Ekans/Arbok: Intimidate, Shed Skin

### Ground Types
- Diglett/Dugtrio: Sand Veil, Arena Trap
- Cubone/Marowak: Lightning Rod, Rock Head
- Geodude/Graveler/Golem: Rock Head, Sturdy
- Rhyhorn/Rhydon: Lightning Rod, Rock Head

### Rock Types
- Onix/Steelix: Rock Head, Sturdy
- Aerodactyl: Rock Head, Pressure

### Fighting Types
- Machop/Machoke/Machamp: Guts, No Guard
- Mankey/Primeape: Vital Spirit, Anger Point
- Hitmonlee: Limber, Reckless
- Hitmonchan: Keen Eye, Iron Fist

### Normal Types
- Rattata/Raticate: Guts, Run Away
- Pidgey/Pidgeotto/Pidgeot: Keen Eye, Tangled Feet
- Snorlax: Immunity, Thick Fat
- Tauros: Intimidate, Anger Point
- Kangaskhan: Early Bird, Scrappy
- Meowth/Persian: Pick Up, Technician

### Bug Types
- Caterpie/Metapod/Butterfree: Shield Dust, Compound Eyes
- Weedle/Kakuna/Beedrill: Shield Dust, Swarm
- Scyther: Swarm, Technician
- Pinsir: Hyper Cutter, Mold Breaker

### Dragon Types
- Dratini/Dragonair/Dragonite: Shed Skin, Inner Focus

### Ice Types
- Seel/Dewgong: Thick Fat, Hydration
- Jynx: Oblivious, Forewarn
- Lapras: Water Absorb, Shell Armor

### Other
- Eevee: Run Away, Adaptability
- Flareon: Flash Fire, Guts
- Jolteon: Volt Absorb, Quick Feet
- Vaporeon: Water Absorb, Hydration
- Clefairy: Cute Charm, Magic Guard
- Jigglypuff: Cute Charm, Friend Guard
- Zubat/Golbat: Inner Focus, Infiltrator
- Oddish/Gloom/Vileplume: Chlorophyll
- Bellsprout/Weepinbell/Victreebel: Chlorophyll

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-019.md
