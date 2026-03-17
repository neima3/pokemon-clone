# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
