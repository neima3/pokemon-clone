# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.22.0] - 2026-03-17

### Added
- Sprint 023: Held Items Integration & Battle Polish
- Held items now affect battles: type-boosting items increase damage by 20%
- Scope Lens doubles critical hit rate
- Leftovers heals 1/16 max HP at end of each turn
- Lum Berry cures status conditions when first inflicted
- Held item display in battle UI showing equipped item name
- Flinch mechanic: Headbutt, Bite, Rock Slide, Air Slash have 30% flinch chance

### Technical
- Integrated getHeldItemDamageBoost in executeMove for damage calculation
- Integrated getCritBoost for critical hit rate modification
- Added checkTurnEndHeldItems function for Leftovers healing
- Added checkLumBerry function for status cure on infliction
- Added flinchChance field to MoveData interface
- Extended TurnResult with flinched field
- Added playerFlinched and enemyFlinched state tracking in BattleScene
- Updated drawPlayerInfo to display held item name

## [0.21.0] - 2026-03-17

### Added
- Sprint 022: Bug Fixes, Smarter AI & Battle Enhancements
- Smarter enemy AI: considers type effectiveness, STAB, and move accuracy when selecting moves
- Weather visual effects in battles: rain, hail, sandstorm, sunny, and fog particles
- Multi-hit moves: Double Slap, Fury Swipes, Fury Attack, Pin Missile, Bullet Seed, Rock Blast (2-5 hits)
- Multi-hit damage display showing number of hits

### Fixed
- Fixed contact abilities (Static, Poison Point, Flame Body, Effect Spore) not triggering correctly
- Fixed duplicate TurnEndResult interface definition in BattleEngine

### Technical
- Added `hits` field to MoveData interface for multi-hit moves (e.g., [2, 5] for 2-5 hits)
- Extended TurnResult with `hits` field for multi-hit tracking
- Added weather particle system to BattleScene with setWeather method
- Improved getEnemyMove AI with scoring system based on effectiveness and STAB
- Added multi-hit damage calculation with individual critical hit checks per hit

## [0.20.0] - 2026-03-17

### Added
- Sprint 021: Advanced Move Mechanics & Ability Triggers
- Priority moves: Quick Attack, Mach Punch always go first regardless of speed
- Drain moves: Absorb, Mega Drain, Giga Drain heal user for 50% of damage dealt
- Recoil moves: Take Down, Flare Blitz, Submission damage user for 33% recoil
- Entry abilities: Intimidate lowers opponent's Attack when entering battle
- Turn-end abilities: Shed Skin has 30% chance to cure status each turn

### Technical
- Added priority, drain, and recoil fields to MoveData interface
- Extended TurnResult with drainHeal, drainMessage, recoilDamage, and recoilMessage fields
- Added checkTurnEndAbilities function for Shed Skin ability
- Updated determineTurnOrder to consider move priority
- Integrated Intimidate ability trigger in BattleScene
- Updated applyEndOfTurnStatus to call Shed Skin check

### Added
- Sprint 020: Pokemon Abilities System
- Full ability implementation with triggers for immunities, damage modifiers, and contact effects
- Ability activation messages displayed in battle when abilities trigger
- Ability display in party menu showing each Pokemon's ability name
- Ability display in player info box during battle

### Abilities Implemented
- **Passive Abilities**: Levitate (Ground immunity), Thick Fat (Fire/Ice resist), Immunity (Poison immune), Sturdy (survive KO at full HP)
- **Type Absorption**: Water Absorb, Volt Absorb, Flash Fire, Lightning Rod
- **Contact Abilities**: Static, Poison Point, Flame Body, Effect Spore
- **HP-Based Abilities**: Blaze, Torrent, Overgrow, Swarm (1.5x power at low HP)
- **Entry Abilities**: Intimidate support
- **Stat Abilities**: Anger Point (max Attack on crit), Guts (Attack boost with status)

### Technical
- Rewrote BattleEngine.ts with proper ability trigger system
- Added `checkAbilityImmunity()`, `checkContactAbility()`, `checkSturdyAbility()`, `getAbilityDamageModifier()` functions
- Extended TurnResult interface with `abilityMessage` and `immune` fields
- Updated BattleUI to display ability names in party and player info

## [0.18.0] - 2026-03-17

### Added
- Sprint 018: Audio Optimization & Battle Enhancements
- Pokemon cry sounds: unique audio cries for each Pokemon species when entering battle
- Badge-based shiny odds: each badge improves shiny encounter rate by 10% cumulative
- Faint cry sound: Pokemon play a descending cry when they faint

### Changed
- Optimized audio system with gain node pooling to reduce garbage collection
- Encounter rate system now supports terrain-based variance (configurable per tile type)

### Technical
- Added `pokemonCry()` and `pokemonFaintCry()` methods to Audio.ts
- Pokemon constructor now accepts optional `badgeCount` parameter for shiny odds
- Created reusable gain node pool in Audio.ts for better performance

## [0.17.0] - 2026-03-17

### Added
- Sprint 017: Visual Polish & Quality Improvements
- Healing visual effects: floating green plus particles when using potions or recovery moves
- Stat change visual indicators: floating +/- text when stats are raised or lowered
- New particle systems: HealParticles and StatChangeHelper for battle feedback

### Fixed
- Fixed dragon-type attack animation not rendering properly (replaced stroke with filled diamond shapes)
- Fixed bag menu in battle now shows all item types (Great Ball, Ultra Ball, Hyper Potion, Max Potion, etc.)

### Changed
- Improved bag menu layout with smaller font to fit more items
- Enhanced battle feedback with visual indicators for healing and stat changes

## [0.16.0] - 2026-03-17

### Added
- Sprint 016: Champion Battle Music & Bug Fixes
- Champion battle now plays epic champion theme music instead of regular battle music
- Added `isChampion` flag to TrainerData interface for proper champion detection

### Fixed
- Fixed Champion Gary battle not using the champion music theme
- Fixed Elite Four and Champion trainer data structure consistency

## [0.15.0] - 2026-03-17

### Added
- Sprint 015: Battle Visual Polish & Pokemon League Music
- Dragon-type attack animation: swirling draconic energy with purple aura
- Steel-type attack animation: metallic shards spinning outward
- Fighting-type attack animation: martial arts impact with energy bursts
- Pokemon League zone music theme: majestic and epic orchestral melody
- Champion battle music theme: intense and dramatic final challenge theme

### Changed
- Zone music now plays Pokemon League theme when entering Victory Road area

## [0.14.0] - 2026-03-17

### Added
- Sprint 014: Pokemon League & Endgame Content
- Pokemon League area added to map (Victory Road entrance path)
- Elite Four and Champion NPCs: Lorelei (Ice), Bruno (Fighting), Agatha (Ghost), Lance (Dragon), Champion Gary
- New Pokémon: Ekans (#23), Arbok (#24), Aerodactyl (#142)
- Status condition visual effects in battles (particles for poison, burn, paralyze, sleep)
- Sprites for Arbok and Aerodactyl

### Fixed
- Fixed syntax error in TitleScene.ts import statement
- Fixed malformed code in BattleUI.ts status particles implementation
- Restored missing DamageNumbers export in BattleUI.ts

## [0.13.1] - 2026-03-17

### Added
- Sprint 013: Route 9 — Viridian City approach, the final overworld area
- Giovanni as Gym Leader 8: Dugtrio, Persian, Nidoking, Rhydon team; rewards EARTH BADGE
- New Pokémon: Raichu (Pikachu evo), Nidoking (Nidorino evo), Meowth, Persian, Kangaskhan, Tauros
- HYPER POTION (heals 200 HP, ¥1200) and MAX POTION (full restore, ¥2500) in shop and bag
- Route 9 trainer battles: Cooltrainer Anya, Rex, and Vera
- Route 9 chiptune music — dramatic E-minor march theme for the final stretch
- Giovanni sprite (dark suit, slicked hair, Team Rocket boss appearance)
- Victory message after collecting all 8 Gym Badges: "Pokémon Master!" celebration
- Map extended to 50×66 tiles (was 50×56)

## [0.11.0] - 2026-03-17

### Added
- Sprint 012: Weather system with visual effects (rain, sun, fog, sandstorm, hail)
- Weather affects battles (water boosted in rain, fire boosted in sun, etc.)
- Held items system for Pokémon (type-boosting items, leftovers, lum berry)
- Damage numbers display during battles
- Running shoes toggle (B key or hold Shift)
- Critical hit sound effect
- Badge get fanfare sound
- Weather change sound effect

### Fixed
- Status conditions now properly cured at Pokémon Center

## [0.7.0] - 2026-03-16

### Added
- Sprint 006: New Pokémon, Route 3, Misty's gym, PC box system, smarter AI
- Move effectiveness indicators (colored dots)
- Auto-storage when team is full

## [0.6.0] - 2026-03-16

### Added
- Sprint 005: Status conditions (poison, paralysis, sleep, burn)
- Critical hit system
- Gym leader battle with badge reward
- Pause menu with save/load
- Pokédex tracking seen/caught Pokémon

## [0.5.0] - 2026-03-16

### Added
- Sprint 004: Chiptune sound system (SFX + music)
- Screen transition effects
- Expanded Pokémon roster (7 new species + 3 evolutions)
- Evolution system at level 16
- NPC system with dialogue
- Pokémon Center & Poké Mart
- Trainer battles with rewards
- Redesigned map with town + routes
- Visual polish (animated tiles, HUD)

## [0.4.0] - 2026-03-16

### Added
- Sprint 003: EXP & leveling system
- Wild Pokémon catching with Pokéballs
- Inventory system (Pokéballs & Potions)
- Party management (switch mid-battle)
- Save/Load with localStorage persistence

## [0.3.0] - 2026-03-16

### Added
- Sprint 002: Battle system with encounters
- Starter Pokémon selection
- Turn-based combat
- Type matchups
- Battle UI and animations

## [0.2.0] - 2026-03-16

### Added
- Sprint 001: Core game engine
- Overworld with tile-based movement
- Player character with collision
- Camera system
- Basic map rendering

## [0.1.0] - 2026-03-16

### Added
- Initial project setup
- Next.js + TypeScript foundation
- HTML5 Canvas integration
- Basic project structure
