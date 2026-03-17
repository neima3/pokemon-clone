export interface HeldItem {
  key: string;
  name: string;
  effect: 'boost_type' | 'heal_on_turn' | 'boost_crit' | 'cure_status' | 'boost_move' | 'boost_atk' | 'survive_ko' | 'super_effective_boost' | 'life_orb' | 'contact_damage' | 'ground_immune' | 'poison_heal' | 'boost_spd';
  boostType?: string;
  boostAmount?: number;
}

export const HELD_ITEMS: Record<string, HeldItem> = {
  charcoal: { key: 'charcoal', name: 'CHARCOAL', effect: 'boost_type', boostType: 'fire', boostAmount: 1.2 },
  mysticWater: { key: 'mysticWater', name: 'MYSTIC WATER', effect: 'boost_type', boostType: 'water', boostAmount: 1.2 },
  miracleSeed: { key: 'miracleSeed', name: 'MIRACLE SEED', effect: 'boost_type', boostType: 'grass', boostAmount: 1.2 },
  magnet: { key: 'magnet', name: 'MAGNET', effect: 'boost_type', boostType: 'electric', boostAmount: 1.2 },
  sharpBeak: { key: 'sharpBeak', name: 'SHARP BEAK', effect: 'boost_type', boostType: 'flying', boostAmount: 1.2 },
  poisonBarb: { key: 'poisonBarb', name: 'POISON BARB', effect: 'boost_type', boostType: 'poison', boostAmount: 1.2 },
  silkScarf: { key: 'silkScarf', name: 'SILK SCARF', effect: 'boost_type', boostType: 'normal', boostAmount: 1.2 },
  silverPowder: { key: 'silverPowder', name: 'SILVER PWD', effect: 'boost_type', boostType: 'bug', boostAmount: 1.2 },
  hardStone: { key: 'hardStone', name: 'HARD STONE', effect: 'boost_type', boostType: 'rock', boostAmount: 1.2 },
  softSand: { key: 'softSand', name: 'SOFT SAND', effect: 'boost_type', boostType: 'ground', boostAmount: 1.2 },
  twistedSpoon: { key: 'twistedSpoon', name: 'TWISTEDSPOON', effect: 'boost_type', boostType: 'psychic', boostAmount: 1.2 },
  spellTag: { key: 'spellTag', name: 'SPELL TAG', effect: 'boost_type', boostType: 'ghost', boostAmount: 1.2 },
  neverMeltIce: { key: 'neverMeltIce', name: 'NEVERMELT', effect: 'boost_type', boostType: 'ice', boostAmount: 1.2 },
  blackBelt: { key: 'blackBelt', name: 'BLACK BELT', effect: 'boost_type', boostType: 'fighting', boostAmount: 1.2 },
  dragonFang: { key: 'dragonFang', name: 'DRAGON FANG', effect: 'boost_type', boostType: 'dragon', boostAmount: 1.2 },
  metalCoat: { key: 'metalCoat', name: 'METAL COAT', effect: 'boost_type', boostType: 'steel', boostAmount: 1.2 },
  scopeLens: { key: 'scopeLens', name: 'SCOPE LENS', effect: 'boost_crit', boostAmount: 2 },
  leftovers: { key: 'leftovers', name: 'LEFTOVERS', effect: 'heal_on_turn', boostAmount: 0.0625 },
  lumBerry: { key: 'lumBerry', name: 'LUM BERRY', effect: 'cure_status' },
  choiceBand: { key: 'choiceBand', name: 'CHOICE BAND', effect: 'boost_atk', boostAmount: 1.5 },
  focusSash: { key: 'focusSash', name: 'FOCUS SASH', effect: 'survive_ko' },
  expertBelt: { key: 'expertBelt', name: 'EXPERT BELT', effect: 'super_effective_boost', boostAmount: 1.2 },
  lifeOrb: { key: 'lifeOrb', name: 'LIFE ORB', effect: 'life_orb', boostAmount: 1.3 },
  choiceSpecs: { key: 'choiceSpecs', name: 'CHOICE SPECS', effect: 'boost_atk', boostAmount: 1.5 },
  choiceScarf: { key: 'choiceScarf', name: 'CHOICE SCARF', effect: 'boost_spd', boostAmount: 1.5 },
  rockyHelmet: { key: 'rockyHelmet', name: 'ROCKY HELMET', effect: 'contact_damage', boostAmount: 0.1667 },
  airBalloon: { key: 'airBalloon', name: 'AIR BALLOON', effect: 'ground_immune' },
  blackSludge: { key: 'blackSludge', name: 'BLACK SLUDGE', effect: 'poison_heal', boostAmount: 0.0625 },
};

let maxHpForItem: number = 100;

export function setContextMaxHp(maxHp: number) {
  maxHpForItem = maxHp;
}

export function getHeldItemDamageBoost(item: HeldItem | null, moveType: string): number {
  if (!item) return 1;
  if (item.effect === 'boost_type' && item.boostType === moveType) {
    return item.boostAmount ?? 1;
  }
  return 1;
}

export function getCritBoost(item: HeldItem | null): number {
  if (!item) return 1;
  if (item.effect === 'boost_crit') {
    return item.boostAmount ?? 1;
  }
  return 1;
}

export function getLeftoversHeal(item: HeldItem | null): number {
  if (!item) return 0;
  if (item.effect === 'heal_on_turn') {
    return Math.max(1, Math.floor(maxHpForItem * (item.boostAmount ?? 0.0625)));
  }
  return 0;
}

export function shouldCureStatus(item: HeldItem | null): boolean {
  return item?.effect === 'cure_status';
}

export function getAttackBoost(item: HeldItem | null): number {
  if (!item) return 1;
  if (item.effect === 'boost_atk') {
    return item.boostAmount ?? 1;
  }
  return 1;
}
export function checkFocusSash(item: HeldItem | null, currentHp: number, maxHp: number, damage: number): { survived: boolean; consumed: boolean } {
  if (!item || item.effect !== 'survive_ko') return { survived: false, consumed: false };
  if (currentHp === maxHp && damage >= currentHp) {
    return { survived: true, consumed: true };
  }
  return { survived: false, consumed: false };
}
export function getSuperEffectiveBoost(item: HeldItem | null, effectiveness: number): number {
  if (!item) return 1;
  if (item.effect === 'super_effective_boost' && effectiveness > 1) {
    return item.boostAmount ?? 1;
  }
  return 1;
}
export function getLifeOrbBoost(item: HeldItem | null): number {
  if (!item) return 1;
  if (item.effect === 'life_orb') {
    return item.boostAmount ?? 1;
  }
  return 1;
}
export function getLifeOrbRecoil(item: HeldItem | null): number {
  if (!item || item.effect !== 'life_orb') return 0;
  return Math.max(1, Math.floor(maxHpForItem * 0.1));
}
export function getSpeedBoost(item: HeldItem | null): number {
  if (!item) return 1;
  if (item.effect === 'boost_spd') {
    return item.boostAmount ?? 1;
  }
  return 1;
}
export function getContactDamage(item: HeldItem | null): number {
  if (!item || item.effect !== 'contact_damage') return 0;
  return Math.max(1, Math.floor(maxHpForItem * (item.boostAmount ?? 0)));
}
export function hasGroundImmunityItem(item: HeldItem | null): boolean {
  return item?.effect === 'ground_immune';
}
export function getBlackSludgeHeal(item: HeldItem | null, maxHp: number, isPoison: boolean): { heal: number; damage: number } {
  if (!item || item.effect !== 'poison_heal') return { heal: 0, damage: 0 };
  const amount = Math.max(1, Math.floor(maxHp * (item.boostAmount ?? 0.0625)));
  if (isPoison) {
    return { heal: amount, damage: 0 };
  } else {
    return { heal: 0, damage: Math.floor(amount * 1.5) };
  }
}
