export interface HeldItem {
  key: string;
  name: string;
  effect: 'boost_type' | 'heal_on_turn' | 'boost_crit' | 'cure_status' | 'boost_move';
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
};

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

export function getLeftoversHeal(item: HeldItem | null, maxHp: number): number {
  if (!item) return 0;
  if (item.effect === 'heal_on_turn') {
    return Math.max(1, Math.floor(maxHp * (item.boostAmount ?? 0)));
  }
  return 0;
}

export function shouldCureStatus(item: HeldItem | null): boolean {
  return item?.effect === 'cure_status';
}
