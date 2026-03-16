// ── Pokemon Types ──

export type PokemonType = 'normal' | 'fire' | 'water' | 'grass' | 'poison' | 'bug';

const TYPE_CHART: Partial<Record<PokemonType, Partial<Record<PokemonType, number>>>> = {
  fire:   { grass: 2, water: 0.5, bug: 2, fire: 0.5 },
  water:  { fire: 2, grass: 0.5, water: 0.5 },
  grass:  { water: 2, fire: 0.5, grass: 0.5, poison: 0.5, bug: 0.5 },
  poison: { grass: 2, poison: 0.5 },
  bug:    { grass: 2, fire: 0.5, poison: 0.5 },
};

export function getTypeEffectiveness(atkType: PokemonType, defTypes: PokemonType[]): number {
  let mult = 1;
  for (const dt of defTypes) {
    mult *= TYPE_CHART[atkType]?.[dt] ?? 1;
  }
  return mult;
}

// ── Moves ──

export interface MoveData {
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  maxPp: number;
  category: 'physical' | 'status';
  effect?: 'lower_attack' | 'lower_defense' | 'lower_speed';
}

export const MOVES: Record<string, MoveData> = {
  tackle:      { name: 'TACKLE',      type: 'normal', power: 40, accuracy: 100, maxPp: 35, category: 'physical' },
  scratch:     { name: 'SCRATCH',     type: 'normal', power: 40, accuracy: 100, maxPp: 35, category: 'physical' },
  growl:       { name: 'GROWL',       type: 'normal', power: 0,  accuracy: 100, maxPp: 40, category: 'status', effect: 'lower_attack' },
  tailWhip:    { name: 'TAIL WHIP',   type: 'normal', power: 0,  accuracy: 100, maxPp: 30, category: 'status', effect: 'lower_defense' },
  vineWhip:    { name: 'VINE WHIP',   type: 'grass',  power: 45, accuracy: 100, maxPp: 25, category: 'physical' },
  ember:       { name: 'EMBER',       type: 'fire',   power: 40, accuracy: 100, maxPp: 25, category: 'physical' },
  waterGun:    { name: 'WATER GUN',   type: 'water',  power: 40, accuracy: 100, maxPp: 25, category: 'physical' },
  gust:        { name: 'GUST',        type: 'normal', power: 40, accuracy: 100, maxPp: 35, category: 'physical' },
  quickAttack: { name: 'QUICK ATK',   type: 'normal', power: 40, accuracy: 100, maxPp: 30, category: 'physical' },
  stringShot:  { name: 'STRING SHOT', type: 'bug',    power: 0,  accuracy: 95,  maxPp: 40, category: 'status', effect: 'lower_speed' },
  razorLeaf:   { name: 'RAZOR LEAF',  type: 'grass',  power: 55, accuracy: 95,  maxPp: 25, category: 'physical' },
  fireFang:    { name: 'FIRE FANG',   type: 'fire',   power: 65, accuracy: 95,  maxPp: 15, category: 'physical' },
  bite:        { name: 'BITE',        type: 'normal', power: 60, accuracy: 100, maxPp: 25, category: 'physical' },
  bubbleBeam:  { name: 'BUBBLEBEAM',  type: 'water',  power: 65, accuracy: 100, maxPp: 20, category: 'physical' },
  bugBite:     { name: 'BUG BITE',    type: 'bug',    power: 60, accuracy: 100, maxPp: 20, category: 'physical' },
};

// ── Species ──

export interface LevelUpMove {
  level: number;
  moveKey: string;
}

export interface SpeciesData {
  id: number;
  name: string;
  types: PokemonType[];
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpd: number;
  learnedMoves: string[];
  baseExpYield: number;
  catchRate: number;
  levelUpMoves: LevelUpMove[];
}

export const SPECIES: Record<string, SpeciesData> = {
  bulbasaur: {
    id: 1, name: 'BULBASAUR', types: ['grass', 'poison'],
    baseHp: 45, baseAtk: 49, baseDef: 49, baseSpd: 45,
    learnedMoves: ['tackle', 'growl', 'vineWhip'],
    baseExpYield: 64, catchRate: 45,
    levelUpMoves: [{ level: 7, moveKey: 'vineWhip' }, { level: 10, moveKey: 'razorLeaf' }],
  },
  charmander: {
    id: 4, name: 'CHARMANDER', types: ['fire'],
    baseHp: 39, baseAtk: 52, baseDef: 43, baseSpd: 65,
    learnedMoves: ['scratch', 'growl', 'ember'],
    baseExpYield: 62, catchRate: 45,
    levelUpMoves: [{ level: 7, moveKey: 'ember' }, { level: 10, moveKey: 'fireFang' }],
  },
  squirtle: {
    id: 7, name: 'SQUIRTLE', types: ['water'],
    baseHp: 44, baseAtk: 48, baseDef: 65, baseSpd: 43,
    learnedMoves: ['tackle', 'tailWhip', 'waterGun'],
    baseExpYield: 63, catchRate: 45,
    levelUpMoves: [{ level: 7, moveKey: 'waterGun' }, { level: 10, moveKey: 'bubbleBeam' }],
  },
  pidgey: {
    id: 16, name: 'PIDGEY', types: ['normal'],
    baseHp: 40, baseAtk: 45, baseDef: 40, baseSpd: 56,
    learnedMoves: ['tackle', 'gust'],
    baseExpYield: 50, catchRate: 255,
    levelUpMoves: [{ level: 5, moveKey: 'gust' }, { level: 9, moveKey: 'quickAttack' }],
  },
  rattata: {
    id: 19, name: 'RATTATA', types: ['normal'],
    baseHp: 30, baseAtk: 56, baseDef: 35, baseSpd: 72,
    learnedMoves: ['tackle', 'tailWhip', 'quickAttack'],
    baseExpYield: 51, catchRate: 255,
    levelUpMoves: [{ level: 7, moveKey: 'bite' }, { level: 10, moveKey: 'quickAttack' }],
  },
  caterpie: {
    id: 10, name: 'CATERPIE', types: ['bug'],
    baseHp: 45, baseAtk: 30, baseDef: 35, baseSpd: 45,
    learnedMoves: ['tackle', 'stringShot'],
    baseExpYield: 39, catchRate: 255,
    levelUpMoves: [{ level: 7, moveKey: 'bugBite' }],
  },
};

export const STARTERS = ['bulbasaur', 'charmander', 'squirtle'] as const;
export const WILD_POKEMON = ['pidgey', 'rattata', 'caterpie'] as const;

// ── Items ──

export type ItemType = 'pokeball' | 'medicine';

export interface ItemData {
  name: string;
  type: ItemType;
  description: string;
  healAmount?: number;
  catchMultiplier?: number;
}

export const ITEMS: Record<string, ItemData> = {
  pokeball:    { name: 'POKé BALL',   type: 'pokeball', description: 'Catches wild POKéMON.', catchMultiplier: 1.0 },
  potion:      { name: 'POTION',      type: 'medicine',  description: 'Restores 20 HP.', healAmount: 20 },
  superPotion: { name: 'SUPER POTION', type: 'medicine', description: 'Restores 50 HP.', healAmount: 50 },
};

// ── EXP ──

/** Medium-fast EXP curve: total EXP at level L = L^3 */
export function totalExpForLevel(level: number): number {
  return level * level * level;
}

export function expToNextLevel(currentLevel: number, currentExp: number): number {
  return totalExpForLevel(currentLevel + 1) - currentExp;
}

export function calculateExpGain(defeatedSpeciesKey: string, defeatedLevel: number): number {
  const species = SPECIES[defeatedSpeciesKey];
  if (!species) return 0;
  return Math.floor((species.baseExpYield * defeatedLevel) / 7);
}
