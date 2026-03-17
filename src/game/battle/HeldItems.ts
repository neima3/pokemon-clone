export interface HeldItem {
  key: string;
  name: string;
  effect: 'boost_type' | 'heal_on_turn' | 'boost_crit' | 'cure_status' | 'boost_move' | 'boost_atk' | 'survive_ko' | 'super_effective_boost' | 'life_orb' | 'contact_damage' | 'ground_immune' | 'poison_heal' | 'boost_spd' | 'z_crystal' | 'mega_stone';
  boostType?: string;
  boostAmount?: number;
  zMoveName?: string;
  zMoveType?: string;
  megaSpecies?: string;
  megaAbility?: string;
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
  
  // Z-Crystals
  firiumZ: { key: 'firiumZ', name: 'FIRIUM Z', effect: 'z_crystal', boostType: 'fire', zMoveName: 'INFERNO OVRDRIVE', zMoveType: 'fire' },
  wateriumZ: { key: 'wateriumZ', name: 'WATERIUM Z', effect: 'z_crystal', boostType: 'water', zMoveName: 'HYDRO VORTEX', zMoveType: 'water' },
  grassiumZ: { key: 'grassiumZ', name: 'GRASSIUM Z', effect: 'z_crystal', boostType: 'grass', zMoveName: 'BLOOM DOOM', zMoveType: 'grass' },
  electriumZ: { key: 'electriumZ', name: 'ELECTRIUM Z', effect: 'z_crystal', boostType: 'electric', zMoveName: 'GIGAVOLT HVOC', zMoveType: 'electric' },
  psychiumZ: { key: 'psychiumZ', name: 'PSYCHIUM Z', effect: 'z_crystal', boostType: 'psychic', zMoveName: 'SHATTERED PSY', zMoveType: 'psychic' },
  ghostiumZ: { key: 'ghostiumZ', name: 'GHOSTIUM Z', effect: 'z_crystal', boostType: 'ghost', zMoveName: 'NEVER-END NIGHM', zMoveType: 'ghost' },
  darkiniumZ: { key: 'darkiniumZ', name: 'DARKINIUM Z', effect: 'z_crystal', boostType: 'dark', zMoveName: 'BLACK HOLE ECLP', zMoveType: 'dark' },
  dragoniumZ: { key: 'dragoniumZ', name: 'DRAGONIUM Z', effect: 'z_crystal', boostType: 'dragon', zMoveName: 'DEVASTATING DRK', zMoveType: 'dragon' },
  fightiniumZ: { key: 'fightiniumZ', name: 'FIGHTINIUM Z', effect: 'z_crystal', boostType: 'fighting', zMoveName: 'ALL-OUT PUMMEL', zMoveType: 'fighting' },
  steeliumZ: { key: 'steeliumZ', name: 'STEELIUM Z', effect: 'z_crystal', boostType: 'steel', zMoveName: 'CORKSCREW CRSH', zMoveType: 'steel' },
  flyiniumZ: { key: 'flyiniumZ', name: 'FLYINIUM Z', effect: 'z_crystal', boostType: 'flying', zMoveName: 'SUPERSONIC SKY', zMoveType: 'flying' },
  poisoniumZ: { key: 'poisoniumZ', name: 'POISONIUM Z', effect: 'z_crystal', boostType: 'poison', zMoveName: 'ACID DOWNPOUR', zMoveType: 'poison' },
  groundiumZ: { key: 'groundiumZ', name: 'GROUNDIUM Z', effect: 'z_crystal', boostType: 'ground', zMoveName: 'TECTONIC RAGE', zMoveType: 'ground' },
  rockiumZ: { key: 'rockiumZ', name: 'ROCKIUM Z', effect: 'z_crystal', boostType: 'rock', zMoveName: 'CONTINENTL CRSH', zMoveType: 'rock' },
  iciumZ: { key: 'iciumZ', name: 'ICIUM Z', effect: 'z_crystal', boostType: 'ice', zMoveName: 'SUBZERO SLAMMR', zMoveType: 'ice' },
  buginiumZ: { key: 'buginiumZ', name: 'BUGINIUM Z', effect: 'z_crystal', boostType: 'bug', zMoveName: 'SAVAGE SPIN-OUT', zMoveType: 'bug' },
  fairiumZ: { key: 'fairiumZ', name: 'FAIRIUM Z', effect: 'z_crystal', boostType: 'fairy', zMoveName: 'TWINKLE TACKLE', zMoveType: 'fairy' },
  normaliumZ: { key: 'normaliumZ', name: 'NORMALIUM Z', effect: 'z_crystal', boostType: 'normal', zMoveName: 'BREAKNECK BLITZ', zMoveType: 'normal' },
  
  // Mega Stones
  venusaurite: { key: 'venusaurite', name: 'VENUSAURITE', effect: 'mega_stone', megaSpecies: 'venusaur', megaAbility: 'thickFat' },
  charizarditeX: { key: 'charizarditeX', name: 'CHARIZARDITE X', effect: 'mega_stone', megaSpecies: 'charizard', megaAbility: 'toughClaws' },
  charizarditeY: { key: 'charizarditeY', name: 'CHARIZARDITE Y', effect: 'mega_stone', megaSpecies: 'charizard', megaAbility: 'drought' },
  blastoisinite: { key: 'blastoisinite', name: 'BLASTOISINITE', effect: 'mega_stone', megaSpecies: 'blastoise', megaAbility: 'megaLauncher' },
  alakazite: { key: 'alakazite', name: 'ALAKAZITE', effect: 'mega_stone', megaSpecies: 'alakazam', megaAbility: 'trace' },
  gengarite: { key: 'gengarite', name: 'GENGARITE', effect: 'mega_stone', megaSpecies: 'gengar', megaAbility: 'shadowTag' },
  kangaskhanite: { key: 'kangaskhanite', name: 'KANGASKHANITE', effect: 'mega_stone', megaSpecies: 'kangaskhan', megaAbility: 'parentalBond' },
  pinsirite: { key: 'pinsirite', name: 'PINSIRITE', effect: 'mega_stone', megaSpecies: 'pinsir', megaAbility: 'aerilate' },
  gyaradosite: { key: 'gyaradosite', name: 'GYARADOSITE', effect: 'mega_stone', megaSpecies: 'gyarados', megaAbility: 'moldBreaker' },
  aerodactylite: { key: 'aerodactylite', name: 'AERODACTYLITE', effect: 'mega_stone', megaSpecies: 'aerodactyl', megaAbility: 'toughClaws' },
  mewtwoniteX: { key: 'mewtwoniteX', name: 'MEWTWONITE X', effect: 'mega_stone', megaSpecies: 'mewtwo', megaAbility: 'steadfast' },
  mewtwoniteY: { key: 'mewtwoniteY', name: 'MEWTWONITE Y', effect: 'mega_stone', megaSpecies: 'mewtwo', megaAbility: 'insomnia' },
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

export function isZCrystal(item: HeldItem | null): boolean {
  return item?.effect === 'z_crystal';
}

export function getZCrystalType(item: HeldItem | null): string | null {
  if (!item || item.effect !== 'z_crystal') return null;
  return item.boostType ?? null;
}

export function getZMoveData(item: HeldItem | null): { name: string; type: string } | null {
  if (!item || item.effect !== 'z_crystal') return null;
  return { name: item.zMoveName ?? 'Z-MOVE', type: item.zMoveType ?? 'normal' };
}

export function calculateZMovePower(baseMovePower: number): number {
  const minPower = 120;
  const zPower = Math.floor(baseMovePower * 1.5);
  return Math.max(minPower, zPower);
}

export function isMegaStone(item: HeldItem | null): boolean {
  return item?.effect === 'mega_stone';
}

export function getMegaStoneSpecies(item: HeldItem | null): string | null {
  if (!item || item.effect !== 'mega_stone') return null;
  return item.megaSpecies ?? null;
}

export function getMegaAbility(item: HeldItem | null): string | null {
  if (!item || item.effect !== 'mega_stone') return null;
  return item.megaAbility ?? null;
}

export function canMegaEvolve(item: HeldItem | null, speciesKey: string): boolean {
  if (!item || item.effect !== 'mega_stone') return false;
  return item.megaSpecies === speciesKey;
}
