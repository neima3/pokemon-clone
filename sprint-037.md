# Sprint 037 — Quality of Life & Equipment Expansion

## Goals
- Add held items to Poke Mart shop inventory
- Add EXP Share to shop for purchase
- Add Good Rod and Super Rod for better fishing encounters
- Add VS Seeker for trainer rematches
- Visual polish with improved particle effects
- Performance optimizations

## Status: COMPLETED

## Implementation Plan

1. Extend shop items with held items (Leftovers, Scope Lens, type boosters)
2. Add EXP Share to shop (¥3000)
3. Add Good Rod (better encounters) and Super Rod (rare encounters)
4. Add VS Seeker item for rematching trainers after 100 steps
5. Add visual particle effects for various actions
6. Run npm run build to verify
7. Update CHANGELOG.md
8. Commit changes

## New Features

### Shop Held Items
- **Leftovers**: Heals 1/16 HP per turn (¥5000)
- **Scope Lens**: Doubles critical hit rate (¥3000)
- **Type-boosting items**: Charcoal, Mystic Water, etc. (¥1000 each)
- **Lum Berry**: Cures status when inflicted (¥500)
- **EXP Share**: Party Pokemon get 50% EXP (¥3000)

### Fishing Rods
- **Old Rod**: Basic fishing (Magikarp, common water types)
- **Good Rod**: Better encounters (more variety, higher levels)
- **Super Rod**: Rare encounters (Gyarados, rare water types)

### VS Seeker
- Charges while walking (100 steps to full charge)
- Allows rematching defeated trainers
- Trainers have stronger teams in rematches

## Visual Improvements
- Enhanced battle particle effects
- Better water animation
- Improved weather visuals

## Notes
- Auto-started: Tue Mar 17 2026
- Previous sprint: sprint-036.md
