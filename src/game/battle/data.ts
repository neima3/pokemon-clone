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
  tackle:     { name: 'TACKLE',     type: 'normal', power: 40, accuracy: 100, maxPp: 35, category: 'physical' },
  scratch:    { name: 'SCRATCH',    type: 'normal', power: 40, accuracy: 100, maxPp: 35, category: 'physical' },
  growl:      { name: 'GROWL',      type: 'normal', power: 0,  accuracy: 100, maxPp: 40, category: 'status', effect: 'lower_attack' },
  tailWhip:   { name: 'TAIL WHIP', type: 'normal', power: 0,  accuracy: 100, maxPp: 30, category: 'status', effect: 'lower_defense' },
  vineWhip:   { name: 'VINE WHIP', type: 'grass',  power: 45, accuracy: 100, maxPp: 25, category: 'physical' },
  ember:      { name: 'EMBER',     type: 'fire',   power: 40, accuracy: 100, maxPp: 25, category: 'physical' },
  waterGun:   { name: 'WATER GUN', type: 'water',  power: 40, accuracy: 100, maxPp: 25, category: 'physical' },
  gust:       { name: 'GUST',      type: 'normal', power: 40, accuracy: 100, maxPp: 35, category: 'physical' },
  quickAttack:{ name: 'QUICK ATK', type: 'normal', power: 40, accuracy: 100, maxPp: 30, category: 'physical' },
  stringShot: { name: 'STRING SHOT',type:'bug',    power: 0,  accuracy: 95,  maxPp: 40, category: 'status', effect: 'lower_speed' },
};

// ── Species ──

export interface SpeciesData {
  id: number;
  name: string;
  types: PokemonType[];
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpd: number;
  learnedMoves: string[];
}

export const SPECIES: Record<string, SpeciesData> = {
  bulbasaur: {
    id: 1, name: 'BULBASAUR', types: ['grass', 'poison'],
    baseHp: 45, baseAtk: 49, baseDef: 49, baseSpd: 45,
    learnedMoves: ['tackle', 'growl', 'vineWhip'],
  },
  charmander: {
    id: 4, name: 'CHARMANDER', types: ['fire'],
    baseHp: 39, baseAtk: 52, baseDef: 43, baseSpd: 65,
    learnedMoves: ['scratch', 'growl', 'ember'],
  },
  squirtle: {
    id: 7, name: 'SQUIRTLE', types: ['water'],
    baseHp: 44, baseAtk: 48, baseDef: 65, baseSpd: 43,
    learnedMoves: ['tackle', 'tailWhip', 'waterGun'],
  },
  pidgey: {
    id: 16, name: 'PIDGEY', types: ['normal'],
    baseHp: 40, baseAtk: 45, baseDef: 40, baseSpd: 56,
    learnedMoves: ['tackle', 'gust'],
  },
  rattata: {
    id: 19, name: 'RATTATA', types: ['normal'],
    baseHp: 30, baseAtk: 56, baseDef: 35, baseSpd: 72,
    learnedMoves: ['tackle', 'tailWhip', 'quickAttack'],
  },
  caterpie: {
    id: 10, name: 'CATERPIE', types: ['bug'],
    baseHp: 45, baseAtk: 30, baseDef: 35, baseSpd: 45,
    learnedMoves: ['tackle', 'stringShot'],
  },
};

export const STARTERS = ['bulbasaur', 'charmander', 'squirtle'] as const;
export const WILD_POKEMON = ['pidgey', 'rattata', 'caterpie'] as const;
