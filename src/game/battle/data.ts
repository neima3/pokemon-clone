// ── Pokemon Types ──

export type PokemonType = 'normal' | 'fire' | 'water' | 'grass' | 'poison' | 'bug' | 'electric' | 'ground' | 'rock' | 'flying' | 'psychic';

export type StatusCondition = 'poison' | 'burn' | 'paralyze' | 'sleep';

const TYPE_CHART: Partial<Record<PokemonType, Partial<Record<PokemonType, number>>>> = {
  fire:     { grass: 2, water: 0.5, bug: 2, fire: 0.5, rock: 0.5 },
  water:    { fire: 2, grass: 0.5, water: 0.5, ground: 2, rock: 2 },
  grass:    { water: 2, fire: 0.5, grass: 0.5, poison: 0.5, bug: 0.5, ground: 2, rock: 2, flying: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5 },
  bug:      { grass: 2, fire: 0.5, poison: 0.5, flying: 0.5 },
  electric: { water: 2, electric: 0.5, ground: 0, flying: 2, grass: 0.5 },
  ground:   { fire: 2, electric: 2, rock: 2, poison: 2, grass: 0.5, flying: 0, bug: 0.5 },
  rock:     { fire: 2, bug: 2, flying: 2, ground: 0.5 },
  flying:   { grass: 2, bug: 2, ground: 0, rock: 0.5, electric: 0.5 },
  normal:   { rock: 0.5 },
  psychic:  { poison: 2 },
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
  effect?: 'lower_attack' | 'lower_defense' | 'lower_speed' | 'raise_defense' | 'raise_attack' | 'poison' | 'burn' | 'paralyze' | 'sleep';
  /** Secondary status effect on damaging moves (e.g. Ember 10% burn) */
  statusEffect?: StatusCondition;
  statusChance?: number;
}

export const MOVES: Record<string, MoveData> = {
  // Normal
  tackle:       { name: 'TACKLE',       type: 'normal',   power: 40,  accuracy: 100, maxPp: 35, category: 'physical' },
  scratch:      { name: 'SCRATCH',      type: 'normal',   power: 40,  accuracy: 100, maxPp: 35, category: 'physical' },
  growl:        { name: 'GROWL',        type: 'normal',   power: 0,   accuracy: 100, maxPp: 40, category: 'status', effect: 'lower_attack' },
  tailWhip:     { name: 'TAIL WHIP',    type: 'normal',   power: 0,   accuracy: 100, maxPp: 30, category: 'status', effect: 'lower_defense' },
  gust:         { name: 'GUST',         type: 'flying',   power: 40,  accuracy: 100, maxPp: 35, category: 'physical' },
  quickAttack:  { name: 'QUICK ATK',    type: 'normal',   power: 40,  accuracy: 100, maxPp: 30, category: 'physical' },
  bite:         { name: 'BITE',         type: 'normal',   power: 60,  accuracy: 100, maxPp: 25, category: 'physical' },
  slam:         { name: 'SLAM',         type: 'normal',   power: 80,  accuracy: 75,  maxPp: 20, category: 'physical' },
  headbutt:     { name: 'HEADBUTT',     type: 'normal',   power: 70,  accuracy: 100, maxPp: 15, category: 'physical' },
  // Grass
  vineWhip:     { name: 'VINE WHIP',    type: 'grass',    power: 45,  accuracy: 100, maxPp: 25, category: 'physical' },
  razorLeaf:    { name: 'RAZOR LEAF',   type: 'grass',    power: 55,  accuracy: 95,  maxPp: 25, category: 'physical' },
  seedBomb:     { name: 'SEED BOMB',    type: 'grass',    power: 80,  accuracy: 100, maxPp: 15, category: 'physical' },
  // Fire
  ember:        { name: 'EMBER',        type: 'fire',     power: 40,  accuracy: 100, maxPp: 25, category: 'physical', statusEffect: 'burn', statusChance: 10 },
  fireFang:     { name: 'FIRE FANG',    type: 'fire',     power: 65,  accuracy: 95,  maxPp: 15, category: 'physical', statusEffect: 'burn', statusChance: 10 },
  flamethrower: { name: 'FLAMETHRWR',   type: 'fire',     power: 90,  accuracy: 100, maxPp: 15, category: 'physical', statusEffect: 'burn', statusChance: 10 },
  // Water
  waterGun:     { name: 'WATER GUN',    type: 'water',    power: 40,  accuracy: 100, maxPp: 25, category: 'physical' },
  bubbleBeam:   { name: 'BUBBLEBEAM',   type: 'water',    power: 65,  accuracy: 100, maxPp: 20, category: 'physical' },
  waterPulse:   { name: 'WATER PULSE',  type: 'water',    power: 60,  accuracy: 100, maxPp: 20, category: 'physical' },
  // Bug
  stringShot:   { name: 'STRING SHOT',  type: 'bug',      power: 0,   accuracy: 95,  maxPp: 40, category: 'status', effect: 'lower_speed' },
  bugBite:      { name: 'BUG BITE',     type: 'bug',      power: 60,  accuracy: 100, maxPp: 20, category: 'physical' },
  // Electric
  thunderShock: { name: 'THNDR SHOCK',  type: 'electric',  power: 40,  accuracy: 100, maxPp: 30, category: 'physical', statusEffect: 'paralyze', statusChance: 10 },
  thunderbolt:  { name: 'THNDR BOLT',   type: 'electric',  power: 90,  accuracy: 100, maxPp: 15, category: 'physical', statusEffect: 'paralyze', statusChance: 10 },
  spark:        { name: 'SPARK',        type: 'electric',  power: 65,  accuracy: 100, maxPp: 20, category: 'physical', statusEffect: 'paralyze', statusChance: 30 },
  // Ground/Rock
  rockThrow:    { name: 'ROCK THROW',   type: 'rock',      power: 50,  accuracy: 90,  maxPp: 15, category: 'physical' },
  mudSlap:      { name: 'MUD-SLAP',     type: 'ground',    power: 20,  accuracy: 100, maxPp: 10, category: 'physical' },
  rockSlide:    { name: 'ROCK SLIDE',   type: 'rock',      power: 75,  accuracy: 90,  maxPp: 10, category: 'physical' },
  // Poison
  poisonSting:  { name: 'POISON STING', type: 'poison',    power: 15,  accuracy: 100, maxPp: 35, category: 'physical', statusEffect: 'poison', statusChance: 30 },
  // Flying
  wingAttack:   { name: 'WING ATK',     type: 'flying',    power: 60,  accuracy: 100, maxPp: 35, category: 'physical' },
  aerialAce:    { name: 'AERIAL ACE',   type: 'flying',    power: 60,  accuracy: 100, maxPp: 20, category: 'physical' },
  leer:         { name: 'LEER',         type: 'normal',    power: 0,   accuracy: 100, maxPp: 30, category: 'status', effect: 'lower_defense' },
  screech:      { name: 'SCREECH',      type: 'normal',    power: 0,   accuracy: 85,  maxPp: 40, category: 'status', effect: 'lower_defense' },
  // New moves — Sprint 005
  harden:       { name: 'HARDEN',       type: 'bug',       power: 0,   accuracy: 100, maxPp: 30, category: 'status', effect: 'raise_defense' },
  confusion:    { name: 'CONFUSION',    type: 'psychic',   power: 50,  accuracy: 100, maxPp: 25, category: 'physical' },
  psybeam:      { name: 'PSYBEAM',      type: 'psychic',   power: 65,  accuracy: 100, maxPp: 20, category: 'physical' },
  sleepPowder:  { name: 'SLEEP POWDER', type: 'grass',     power: 0,   accuracy: 75,  maxPp: 15, category: 'status', effect: 'sleep' },
  stunSpore:    { name: 'STUN SPORE',   type: 'grass',     power: 0,   accuracy: 75,  maxPp: 30, category: 'status', effect: 'paralyze' },
  poisonPowder: { name: 'PSN POWDER',   type: 'poison',    power: 0,   accuracy: 75,  maxPp: 35, category: 'status', effect: 'poison' },
  hyperFang:    { name: 'HYPER FANG',   type: 'normal',    power: 80,  accuracy: 90,  maxPp: 15, category: 'physical' },
  airSlash:     { name: 'AIR SLASH',    type: 'flying',    power: 75,  accuracy: 95,  maxPp: 15, category: 'physical' },
  bind:         { name: 'BIND',         type: 'normal',    power: 15,  accuracy: 85,  maxPp: 20, category: 'physical' },
  rockTomb:     { name: 'ROCK TOMB',    type: 'rock',      power: 60,  accuracy: 95,  maxPp: 15, category: 'physical', effect: 'lower_speed' },
  ironTail:     { name: 'IRON TAIL',    type: 'normal',    power: 100, accuracy: 75,  maxPp: 15, category: 'physical', effect: 'lower_defense' },
  pursuit:      { name: 'PURSUIT',      type: 'normal',    power: 40,  accuracy: 100, maxPp: 20, category: 'physical' },
  focusEnergy:  { name: 'FOCUS ENRGY',  type: 'normal',    power: 0,   accuracy: 100, maxPp: 30, category: 'status', effect: 'raise_attack' },
  // New moves — Sprint 006
  bodySlam:     { name: 'BODY SLAM',    type: 'normal',    power: 85,  accuracy: 100, maxPp: 15, category: 'physical', statusEffect: 'paralyze', statusChance: 30 },
  thunderWave:  { name: 'THNDR WAVE',   type: 'electric',  power: 0,   accuracy: 90,  maxPp: 20, category: 'status', effect: 'paralyze' },
  absorb:       { name: 'ABSORB',       type: 'grass',     power: 20,  accuracy: 100, maxPp: 25, category: 'physical' },
  megaDrain:    { name: 'MEGA DRAIN',   type: 'grass',     power: 40,  accuracy: 100, maxPp: 15, category: 'physical' },
  crossPoison:  { name: 'CROSS PSN',    type: 'poison',    power: 70,  accuracy: 100, maxPp: 20, category: 'physical', statusEffect: 'poison', statusChance: 10 },
  twineedle:    { name: 'TWINEEDLE',    type: 'bug',       power: 60,  accuracy: 100, maxPp: 20, category: 'physical', statusEffect: 'poison', statusChance: 20 },
  swift:        { name: 'SWIFT',        type: 'normal',    power: 60,  accuracy: 100, maxPp: 20, category: 'physical' },
  surf:         { name: 'SURF',         type: 'water',     power: 90,  accuracy: 100, maxPp: 15, category: 'physical' },
  lowKick:      { name: 'LOW KICK',     type: 'normal',    power: 65,  accuracy: 100, maxPp: 20, category: 'physical' },
  furySwipes:   { name: 'FURY SWIPES',  type: 'normal',    power: 50,  accuracy: 80,  maxPp: 15, category: 'physical' },
  megaPunch:    { name: 'MEGA PUNCH',   type: 'normal',    power: 80,  accuracy: 85,  maxPp: 20, category: 'physical' },
  karatechop:   { name: 'KARATE CHOP',  type: 'normal',    power: 50,  accuracy: 100, maxPp: 25, category: 'physical' },
  acidSpray:    { name: 'ACID SPRAY',   type: 'poison',    power: 40,  accuracy: 100, maxPp: 20, category: 'physical', effect: 'lower_defense' },
  rapidSpin:    { name: 'RAPID SPIN',   type: 'normal',    power: 50,  accuracy: 100, maxPp: 40, category: 'physical' },
  recover:      { name: 'RECOVER',      type: 'normal',    power: 0,   accuracy: 100, maxPp: 10, category: 'status', effect: 'raise_defense' },
  psychic:      { name: 'PSYCHIC',      type: 'psychic',   power: 90,  accuracy: 100, maxPp: 15, category: 'physical' },
  teleport:     { name: 'TELEPORT',     type: 'psychic',   power: 0,   accuracy: 100, maxPp: 20, category: 'status' },
  swiftStar:    { name: 'SWIFT STAR',   type: 'water',     power: 60,  accuracy: 100, maxPp: 20, category: 'physical' },
  powerGem:     { name: 'POWER GEM',    type: 'rock',      power: 80,  accuracy: 100, maxPp: 20, category: 'physical' },
};

// ── Species ──

export interface LevelUpMove {
  level: number;
  moveKey: string;
}

export interface EvolutionData {
  level: number;
  into: string;
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
  evolution?: EvolutionData;
}

export const SPECIES: Record<string, SpeciesData> = {
  // ── Starters & evolutions ──
  bulbasaur: {
    id: 1, name: 'BULBASAUR', types: ['grass', 'poison'],
    baseHp: 45, baseAtk: 49, baseDef: 49, baseSpd: 45,
    learnedMoves: ['tackle', 'growl', 'vineWhip'],
    baseExpYield: 64, catchRate: 45,
    levelUpMoves: [{ level: 7, moveKey: 'vineWhip' }, { level: 10, moveKey: 'razorLeaf' }, { level: 15, moveKey: 'poisonSting' }],
    evolution: { level: 16, into: 'ivysaur' },
  },
  ivysaur: {
    id: 2, name: 'IVYSAUR', types: ['grass', 'poison'],
    baseHp: 60, baseAtk: 62, baseDef: 63, baseSpd: 60,
    learnedMoves: ['tackle', 'vineWhip', 'razorLeaf', 'poisonSting'],
    baseExpYield: 142, catchRate: 45,
    levelUpMoves: [{ level: 18, moveKey: 'seedBomb' }],
  },
  charmander: {
    id: 4, name: 'CHARMANDER', types: ['fire'],
    baseHp: 39, baseAtk: 52, baseDef: 43, baseSpd: 65,
    learnedMoves: ['scratch', 'growl', 'ember'],
    baseExpYield: 62, catchRate: 45,
    levelUpMoves: [{ level: 7, moveKey: 'ember' }, { level: 10, moveKey: 'fireFang' }, { level: 14, moveKey: 'bite' }],
    evolution: { level: 16, into: 'charmeleon' },
  },
  charmeleon: {
    id: 5, name: 'CHARMELEON', types: ['fire'],
    baseHp: 58, baseAtk: 64, baseDef: 58, baseSpd: 80,
    learnedMoves: ['scratch', 'ember', 'fireFang', 'bite'],
    baseExpYield: 142, catchRate: 45,
    levelUpMoves: [{ level: 19, moveKey: 'flamethrower' }],
  },
  squirtle: {
    id: 7, name: 'SQUIRTLE', types: ['water'],
    baseHp: 44, baseAtk: 48, baseDef: 65, baseSpd: 43,
    learnedMoves: ['tackle', 'tailWhip', 'waterGun'],
    baseExpYield: 63, catchRate: 45,
    levelUpMoves: [{ level: 7, moveKey: 'waterGun' }, { level: 10, moveKey: 'bubbleBeam' }, { level: 13, moveKey: 'bite' }],
    evolution: { level: 16, into: 'wartortle' },
  },
  wartortle: {
    id: 8, name: 'WARTORTLE', types: ['water'],
    baseHp: 59, baseAtk: 63, baseDef: 80, baseSpd: 58,
    learnedMoves: ['tackle', 'waterGun', 'bubbleBeam', 'bite'],
    baseExpYield: 143, catchRate: 45,
    levelUpMoves: [{ level: 18, moveKey: 'waterPulse' }],
  },

  // ── Wild Pokemon ──
  pidgey: {
    id: 16, name: 'PIDGEY', types: ['normal', 'flying'],
    baseHp: 40, baseAtk: 45, baseDef: 40, baseSpd: 56,
    learnedMoves: ['tackle', 'gust'],
    baseExpYield: 50, catchRate: 255,
    levelUpMoves: [{ level: 5, moveKey: 'gust' }, { level: 9, moveKey: 'quickAttack' }, { level: 13, moveKey: 'wingAttack' }],
    evolution: { level: 18, into: 'pidgeotto' },
  },
  pidgeotto: {
    id: 17, name: 'PIDGEOTTO', types: ['normal', 'flying'],
    baseHp: 63, baseAtk: 60, baseDef: 55, baseSpd: 71,
    learnedMoves: ['tackle', 'gust', 'quickAttack', 'wingAttack'],
    baseExpYield: 122, catchRate: 120,
    levelUpMoves: [{ level: 20, moveKey: 'airSlash' }],
    evolution: { level: 36, into: 'pidgeot' },
  },
  rattata: {
    id: 19, name: 'RATTATA', types: ['normal'],
    baseHp: 30, baseAtk: 56, baseDef: 35, baseSpd: 72,
    learnedMoves: ['tackle', 'tailWhip', 'quickAttack'],
    baseExpYield: 51, catchRate: 255,
    levelUpMoves: [{ level: 7, moveKey: 'bite' }, { level: 10, moveKey: 'quickAttack' }, { level: 14, moveKey: 'pursuit' }],
    evolution: { level: 20, into: 'raticate' },
  },
  raticate: {
    id: 20, name: 'RATICATE', types: ['normal'],
    baseHp: 55, baseAtk: 81, baseDef: 60, baseSpd: 97,
    learnedMoves: ['tackle', 'quickAttack', 'bite', 'pursuit'],
    baseExpYield: 145, catchRate: 127,
    levelUpMoves: [{ level: 22, moveKey: 'hyperFang' }],
  },
  caterpie: {
    id: 10, name: 'CATERPIE', types: ['bug'],
    baseHp: 45, baseAtk: 30, baseDef: 35, baseSpd: 45,
    learnedMoves: ['tackle', 'stringShot'],
    baseExpYield: 39, catchRate: 255,
    levelUpMoves: [{ level: 7, moveKey: 'bugBite' }],
    evolution: { level: 7, into: 'metapod' },
  },
  metapod: {
    id: 11, name: 'METAPOD', types: ['bug'],
    baseHp: 50, baseAtk: 20, baseDef: 55, baseSpd: 30,
    learnedMoves: ['tackle', 'harden'],
    baseExpYield: 72, catchRate: 120,
    levelUpMoves: [{ level: 7, moveKey: 'harden' }],
    evolution: { level: 10, into: 'butterfree' },
  },
  butterfree: {
    id: 12, name: 'BUTTERFREE', types: ['bug', 'flying'],
    baseHp: 60, baseAtk: 45, baseDef: 50, baseSpd: 70,
    learnedMoves: ['confusion', 'gust', 'poisonPowder', 'stunSpore'],
    baseExpYield: 178, catchRate: 45,
    levelUpMoves: [{ level: 12, moveKey: 'sleepPowder' }, { level: 15, moveKey: 'psybeam' }],
  },
  pikachu: {
    id: 25, name: 'PIKACHU', types: ['electric'],
    baseHp: 35, baseAtk: 55, baseDef: 40, baseSpd: 90,
    learnedMoves: ['thunderShock', 'quickAttack', 'growl'],
    baseExpYield: 112, catchRate: 190,
    levelUpMoves: [{ level: 6, moveKey: 'thunderShock' }, { level: 10, moveKey: 'spark' }, { level: 18, moveKey: 'thunderbolt' }],
  },
  zubat: {
    id: 41, name: 'ZUBAT', types: ['poison', 'flying'],
    baseHp: 40, baseAtk: 45, baseDef: 35, baseSpd: 55,
    learnedMoves: ['tackle', 'screech'],
    baseExpYield: 49, catchRate: 255,
    levelUpMoves: [{ level: 5, moveKey: 'bite' }, { level: 9, moveKey: 'wingAttack' }, { level: 13, moveKey: 'poisonSting' }],
  },
  geodude: {
    id: 74, name: 'GEODUDE', types: ['rock', 'ground'],
    baseHp: 40, baseAtk: 80, baseDef: 100, baseSpd: 20,
    learnedMoves: ['tackle', 'mudSlap'],
    baseExpYield: 60, catchRate: 255,
    levelUpMoves: [{ level: 6, moveKey: 'rockThrow' }, { level: 10, moveKey: 'mudSlap' }, { level: 14, moveKey: 'rockSlide' }],
  },
  nidoranM: {
    id: 32, name: 'NIDORAN♂', types: ['poison'],
    baseHp: 46, baseAtk: 57, baseDef: 40, baseSpd: 50,
    learnedMoves: ['leer', 'poisonSting'],
    baseExpYield: 55, catchRate: 235,
    levelUpMoves: [{ level: 7, moveKey: 'tackle' }, { level: 9, moveKey: 'bite' }, { level: 13, moveKey: 'headbutt' }],
    evolution: { level: 16, into: 'nidorino' },
  },
  // Gym leader Pokemon
  onix: {
    id: 95, name: 'ONIX', types: ['rock', 'ground'],
    baseHp: 35, baseAtk: 45, baseDef: 160, baseSpd: 70,
    learnedMoves: ['tackle', 'bind', 'rockThrow', 'rockTomb'],
    baseExpYield: 77, catchRate: 45,
    levelUpMoves: [{ level: 6, moveKey: 'rockThrow' }, { level: 10, moveKey: 'rockTomb' }, { level: 15, moveKey: 'ironTail' }],
  },

  // ── Sprint 006 Pokemon ──

  // Weedle line
  weedle: {
    id: 13, name: 'WEEDLE', types: ['bug', 'poison'],
    baseHp: 40, baseAtk: 35, baseDef: 30, baseSpd: 50,
    learnedMoves: ['poisonSting', 'stringShot'],
    baseExpYield: 39, catchRate: 255,
    levelUpMoves: [{ level: 5, moveKey: 'bugBite' }],
    evolution: { level: 7, into: 'kakuna' },
  },
  kakuna: {
    id: 14, name: 'KAKUNA', types: ['bug', 'poison'],
    baseHp: 45, baseAtk: 25, baseDef: 50, baseSpd: 35,
    learnedMoves: ['poisonSting', 'harden'],
    baseExpYield: 72, catchRate: 120,
    levelUpMoves: [{ level: 7, moveKey: 'harden' }],
    evolution: { level: 10, into: 'beedrill' },
  },
  beedrill: {
    id: 15, name: 'BEEDRILL', types: ['bug', 'poison'],
    baseHp: 65, baseAtk: 90, baseDef: 40, baseSpd: 75,
    learnedMoves: ['twineedle', 'poisonSting', 'furySwipes', 'focusEnergy'],
    baseExpYield: 178, catchRate: 45,
    levelUpMoves: [{ level: 12, moveKey: 'furySwipes' }, { level: 16, moveKey: 'crossPoison' }],
  },

  // Pidgeot (evolution of Pidgeotto)
  pidgeot: {
    id: 18, name: 'PIDGEOT', types: ['normal', 'flying'],
    baseHp: 83, baseAtk: 80, baseDef: 75, baseSpd: 101,
    learnedMoves: ['gust', 'quickAttack', 'wingAttack', 'airSlash'],
    baseExpYield: 216, catchRate: 45,
    levelUpMoves: [{ level: 38, moveKey: 'swift' }],
  },

  // Nidorino (evolution of NidoranM)
  nidorino: {
    id: 33, name: 'NIDORINO', types: ['poison'],
    baseHp: 61, baseAtk: 72, baseDef: 57, baseSpd: 65,
    learnedMoves: ['poisonSting', 'bite', 'headbutt', 'crossPoison'],
    baseExpYield: 128, catchRate: 120,
    levelUpMoves: [{ level: 20, moveKey: 'crossPoison' }, { level: 23, moveKey: 'bodySlam' }],
  },

  // Oddish line
  oddish: {
    id: 43, name: 'ODDISH', types: ['grass', 'poison'],
    baseHp: 45, baseAtk: 50, baseDef: 55, baseSpd: 30,
    learnedMoves: ['absorb', 'growl'],
    baseExpYield: 64, catchRate: 255,
    levelUpMoves: [{ level: 5, moveKey: 'absorb' }, { level: 9, moveKey: 'poisonPowder' }, { level: 13, moveKey: 'megaDrain' }],
    evolution: { level: 21, into: 'gloom' },
  },
  gloom: {
    id: 44, name: 'GLOOM', types: ['grass', 'poison'],
    baseHp: 60, baseAtk: 65, baseDef: 70, baseSpd: 40,
    learnedMoves: ['absorb', 'megaDrain', 'poisonPowder', 'acidSpray'],
    baseExpYield: 138, catchRate: 120,
    levelUpMoves: [{ level: 24, moveKey: 'sleepPowder' }, { level: 28, moveKey: 'seedBomb' }],
  },

  // Mankey line
  mankey: {
    id: 56, name: 'MANKEY', types: ['normal'],
    baseHp: 40, baseAtk: 80, baseDef: 35, baseSpd: 70,
    learnedMoves: ['scratch', 'leer', 'karatechop'],
    baseExpYield: 61, catchRate: 190,
    levelUpMoves: [{ level: 9, moveKey: 'karatechop' }, { level: 13, moveKey: 'furySwipes' }, { level: 17, moveKey: 'lowKick' }],
    evolution: { level: 28, into: 'primeape' },
  },
  primeape: {
    id: 57, name: 'PRIMEAPE', types: ['normal'],
    baseHp: 65, baseAtk: 105, baseDef: 60, baseSpd: 95,
    learnedMoves: ['karatechop', 'furySwipes', 'lowKick', 'megaPunch'],
    baseExpYield: 159, catchRate: 75,
    levelUpMoves: [{ level: 30, moveKey: 'megaPunch' }, { level: 35, moveKey: 'bodySlam' }],
  },

  // Abra line
  abra: {
    id: 63, name: 'ABRA', types: ['psychic'],
    baseHp: 25, baseAtk: 20, baseDef: 15, baseSpd: 90,
    learnedMoves: ['teleport'],
    baseExpYield: 62, catchRate: 200,
    levelUpMoves: [{ level: 8, moveKey: 'confusion' }],
    evolution: { level: 16, into: 'kadabra' },
  },
  kadabra: {
    id: 64, name: 'KADABRA', types: ['psychic'],
    baseHp: 40, baseAtk: 35, baseDef: 30, baseSpd: 105,
    learnedMoves: ['confusion', 'psybeam', 'teleport'],
    baseExpYield: 145, catchRate: 100,
    levelUpMoves: [{ level: 18, moveKey: 'psybeam' }, { level: 24, moveKey: 'psychic' }],
  },

  // Staryu line (Misty's Pokemon)
  staryu: {
    id: 120, name: 'STARYU', types: ['water'],
    baseHp: 30, baseAtk: 45, baseDef: 55, baseSpd: 85,
    learnedMoves: ['tackle', 'waterGun', 'rapidSpin'],
    baseExpYield: 68, catchRate: 225,
    levelUpMoves: [{ level: 7, moveKey: 'waterGun' }, { level: 12, moveKey: 'swiftStar' }, { level: 18, moveKey: 'bubbleBeam' }],
    evolution: { level: 25, into: 'starmie' },
  },
  starmie: {
    id: 121, name: 'STARMIE', types: ['water', 'psychic'],
    baseHp: 60, baseAtk: 75, baseDef: 85, baseSpd: 115,
    learnedMoves: ['waterGun', 'bubbleBeam', 'swiftStar', 'psychic'],
    baseExpYield: 182, catchRate: 60,
    levelUpMoves: [{ level: 28, moveKey: 'surf' }, { level: 33, moveKey: 'powerGem' }],
  },
};

export const STARTERS = ['bulbasaur', 'charmander', 'squirtle'] as const;
export const WILD_POKEMON = ['pidgey', 'rattata', 'caterpie', 'pikachu', 'zubat', 'geodude', 'nidoranM', 'weedle', 'oddish', 'mankey', 'abra', 'staryu'] as const;

// ── Route-specific encounters ──
export const ROUTE_ENCOUNTERS: Record<string, { species: string; minLevel: number; maxLevel: number; weight: number }[]> = {
  town: [
    { species: 'rattata', minLevel: 2, maxLevel: 4, weight: 40 },
    { species: 'pidgey', minLevel: 2, maxLevel: 4, weight: 40 },
    { species: 'caterpie', minLevel: 2, maxLevel: 3, weight: 20 },
  ],
  route1: [
    { species: 'pidgey', minLevel: 3, maxLevel: 6, weight: 30 },
    { species: 'rattata', minLevel: 3, maxLevel: 6, weight: 25 },
    { species: 'nidoranM', minLevel: 3, maxLevel: 5, weight: 15 },
    { species: 'pikachu', minLevel: 3, maxLevel: 5, weight: 5 },
    { species: 'caterpie', minLevel: 3, maxLevel: 5, weight: 25 },
  ],
  route2: [
    { species: 'zubat', minLevel: 5, maxLevel: 8, weight: 25 },
    { species: 'geodude', minLevel: 5, maxLevel: 8, weight: 20 },
    { species: 'nidoranM', minLevel: 5, maxLevel: 8, weight: 15 },
    { species: 'pidgey', minLevel: 5, maxLevel: 8, weight: 10 },
    { species: 'pikachu', minLevel: 5, maxLevel: 7, weight: 5 },
    { species: 'weedle', minLevel: 5, maxLevel: 7, weight: 15 },
    { species: 'oddish', minLevel: 5, maxLevel: 7, weight: 10 },
  ],
  route3: [
    { species: 'mankey', minLevel: 8, maxLevel: 12, weight: 20 },
    { species: 'oddish', minLevel: 8, maxLevel: 11, weight: 20 },
    { species: 'abra', minLevel: 8, maxLevel: 10, weight: 5 },
    { species: 'pidgey', minLevel: 8, maxLevel: 11, weight: 15 },
    { species: 'nidoranM', minLevel: 8, maxLevel: 11, weight: 15 },
    { species: 'geodude', minLevel: 9, maxLevel: 12, weight: 10 },
    { species: 'staryu', minLevel: 8, maxLevel: 11, weight: 10 },
    { species: 'zubat', minLevel: 8, maxLevel: 11, weight: 5 },
  ],
};

/** Pick a random encounter from a route table */
export function rollEncounter(route: string): { species: string; level: number } {
  const table = ROUTE_ENCOUNTERS[route] ?? ROUTE_ENCOUNTERS.town;
  const totalWeight = table.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) {
      const level = entry.minLevel + Math.floor(Math.random() * (entry.maxLevel - entry.minLevel + 1));
      return { species: entry.species, level };
    }
  }
  const last = table[table.length - 1];
  return { species: last.species, level: last.minLevel };
}

// ── Items ──

export type ItemType = 'pokeball' | 'medicine';

export type StatusItemEffect = 'cure_poison' | 'cure_all';

export interface ItemData {
  name: string;
  type: ItemType;
  description: string;
  price: number;
  healAmount?: number;
  catchMultiplier?: number;
  statusCure?: StatusItemEffect;
}

export const ITEMS: Record<string, ItemData> = {
  pokeball:    { name: 'POKé BALL',    type: 'pokeball', description: 'Catches wild POKéMON.', catchMultiplier: 1.0, price: 200 },
  greatBall:   { name: 'GREAT BALL',   type: 'pokeball', description: 'Better catch rate.', catchMultiplier: 1.5, price: 600 },
  potion:      { name: 'POTION',       type: 'medicine', description: 'Restores 20 HP.', healAmount: 20, price: 300 },
  superPotion: { name: 'SUPER POTION', type: 'medicine', description: 'Restores 50 HP.', healAmount: 50, price: 700 },
  antidote:    { name: 'ANTIDOTE',     type: 'medicine', description: 'Cures poison.', statusCure: 'cure_poison', price: 100 },
  fullHeal:    { name: 'FULL HEAL',    type: 'medicine', description: 'Cures any status.', statusCure: 'cure_all', price: 600 },
};

// ── Type colors (for UI) ──

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal:   '#a8a878',
  fire:     '#f08030',
  water:    '#6890f0',
  grass:    '#78c850',
  poison:   '#a040a0',
  bug:      '#a8b820',
  electric: '#f8d030',
  ground:   '#e0c068',
  rock:     '#b8a038',
  flying:   '#a890f0',
  psychic:  '#f85888',
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

// ── Trainer data ──

export interface TrainerData {
  name: string;
  team: Array<{ species: string; level: number }>;
  reward: number; // money
  defeatMessage: string;
  sprite: 'youngster' | 'lass' | 'bugCatcher' | 'hiker' | 'gymLeader' | 'gymLeader2';
  isGymLeader?: boolean;
  badgeName?: string;
}

export const TRAINERS: Record<string, TrainerData> = {
  youngster_joey: {
    name: 'YOUNGSTER JOEY',
    team: [{ species: 'rattata', level: 5 }],
    reward: 120,
    defeatMessage: "My RATTATA is in the top percentage!",
    sprite: 'youngster',
  },
  lass_sally: {
    name: 'LASS SALLY',
    team: [{ species: 'pidgey', level: 4 }, { species: 'nidoranM', level: 5 }],
    reward: 200,
    defeatMessage: "You're pretty good at this!",
    sprite: 'lass',
  },
  bugCatcher_rick: {
    name: 'BUG CATCHER RICK',
    team: [{ species: 'caterpie', level: 4 }, { species: 'caterpie', level: 4 }, { species: 'caterpie', level: 6 }],
    reward: 150,
    defeatMessage: "Bugs are the best though...",
    sprite: 'bugCatcher',
  },
  hiker_dave: {
    name: 'HIKER DAVE',
    team: [{ species: 'geodude', level: 7 }, { species: 'geodude', level: 8 }],
    reward: 350,
    defeatMessage: "You've got real grit, kid!",
    sprite: 'hiker',
  },
  gym_brock: {
    name: 'LEADER BROCK',
    team: [{ species: 'geodude', level: 10 }, { species: 'onix', level: 12 }],
    reward: 1200,
    defeatMessage: "Your POKéMON's power is incredible!",
    sprite: 'gymLeader',
    isGymLeader: true,
    badgeName: 'BOULDER BADGE',
  },
  // Route 3 trainers
  lass_marina: {
    name: 'LASS MARINA',
    team: [{ species: 'oddish', level: 9 }, { species: 'staryu', level: 10 }],
    reward: 280,
    defeatMessage: "Water and grass make a great combo!",
    sprite: 'lass',
  },
  youngster_kyle: {
    name: 'YOUNGSTER KYLE',
    team: [{ species: 'mankey', level: 10 }, { species: 'rattata', level: 11 }],
    reward: 300,
    defeatMessage: "I need to train harder!",
    sprite: 'youngster',
  },
  // Second gym leader
  gym_misty: {
    name: 'LEADER MISTY',
    team: [{ species: 'staryu', level: 18 }, { species: 'starmie', level: 21 }],
    reward: 2100,
    defeatMessage: "You really are talented! Here, take the CASCADE BADGE!",
    sprite: 'gymLeader2',
    isGymLeader: true,
    badgeName: 'CASCADE BADGE',
  },
};
