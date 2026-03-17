// ── Pokemon Types ──

export type PokemonType = 'normal' | 'fire' | 'water' | 'grass' | 'poison' | 'bug' | 'electric' | 'ground' | 'rock' | 'flying' | 'psychic' | 'ghost' | 'ice' | 'fighting' | 'dragon' | 'steel';

export type StatusCondition = 'poison' | 'burn' | 'paralyze' | 'sleep';

const TYPE_CHART: Partial<Record<PokemonType, Partial<Record<PokemonType, number>>>> = {
  fire:     { grass: 2, water: 0.5, bug: 2, fire: 0.5, rock: 0.5, ice: 2, dragon: 0.5, steel: 2 },
  water:    { fire: 2, grass: 0.5, water: 0.5, ground: 2, rock: 2, ice: 0.5, dragon: 0.5 },
  grass:    { water: 2, fire: 0.5, grass: 0.5, poison: 0.5, bug: 0.5, ground: 2, rock: 2, flying: 0.5, dragon: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  bug:      { grass: 2, fire: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, fighting: 0.5 },
  electric: { water: 2, electric: 0.5, ground: 0, flying: 2, grass: 0.5, dragon: 0.5 },
  ground:   { fire: 2, electric: 2, rock: 2, poison: 2, steel: 2, grass: 0.5, flying: 0, bug: 0.5, ice: 2 },
  rock:     { fire: 2, bug: 2, flying: 2, ground: 0.5, ice: 2, fighting: 0.5 },
  flying:   { grass: 2, bug: 2, fighting: 2, ground: 0, rock: 0.5, electric: 0.5, ice: 2 },
  normal:   { rock: 0.5, ghost: 0, fighting: 0.5 },
  psychic:  { fighting: 2, poison: 2, ghost: 0.5 },
  ghost:    { ghost: 2, psychic: 2, normal: 0 },
  ice:      { grass: 2, ground: 2, flying: 2, dragon: 2, water: 0.5, ice: 0.5, fire: 0.5 },
  fighting: { normal: 2, rock: 2, ice: 2, steel: 2, flying: 0.5, poison: 0.5, bug: 0.5, psychic: 0.5, ghost: 0 },
  dragon:   { dragon: 2 },
  steel:    { ice: 2, rock: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
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
  ironTail:     { name: 'IRON TAIL',    type: 'steel',     power: 100, accuracy: 75,  maxPp: 15, category: 'physical', effect: 'lower_defense' },
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
  lowKick:      { name: 'LOW KICK',     type: 'fighting',  power: 65,  accuracy: 100, maxPp: 20, category: 'physical' },
  furySwipes:   { name: 'FURY SWIPES',  type: 'normal',    power: 50,  accuracy: 80,  maxPp: 15, category: 'physical' },
  megaPunch:    { name: 'MEGA PUNCH',   type: 'normal',    power: 80,  accuracy: 85,  maxPp: 20, category: 'physical' },
  karatechop:   { name: 'KARATE CHOP',  type: 'fighting',  power: 50,  accuracy: 100, maxPp: 25, category: 'physical' },
  acidSpray:    { name: 'ACID SPRAY',   type: 'poison',    power: 40,  accuracy: 100, maxPp: 20, category: 'physical', effect: 'lower_defense' },
  rapidSpin:    { name: 'RAPID SPIN',   type: 'normal',    power: 50,  accuracy: 100, maxPp: 40, category: 'physical' },
  recover:      { name: 'RECOVER',      type: 'normal',    power: 0,   accuracy: 100, maxPp: 10, category: 'status', effect: 'raise_defense' },
  psychic:      { name: 'PSYCHIC',      type: 'psychic',   power: 90,  accuracy: 100, maxPp: 15, category: 'physical' },
  teleport:     { name: 'TELEPORT',     type: 'psychic',   power: 0,   accuracy: 100, maxPp: 20, category: 'status' },
  swiftStar:    { name: 'SWIFT STAR',   type: 'water',     power: 60,  accuracy: 100, maxPp: 20, category: 'physical' },
  powerGem:     { name: 'POWER GEM',    type: 'rock',      power: 80,  accuracy: 100, maxPp: 20, category: 'physical' },
  // New moves — Sprint 007
  fireBlast:    { name: 'FIRE BLAST',  type: 'fire',     power: 110, accuracy: 85,  maxPp: 5,  category: 'physical', statusEffect: 'burn', statusChance: 10 },
  hydroPump:    { name: 'HYDRO PUMP',  type: 'water',    power: 110, accuracy: 80,  maxPp: 5,  category: 'physical' },
  solarBeam:    { name: 'SOLAR BEAM',  type: 'grass',    power: 120, accuracy: 100, maxPp: 10, category: 'physical' },
  earthquake:   { name: 'EARTHQUAKE',  type: 'ground',   power: 100, accuracy: 100, maxPp: 10, category: 'physical' },
  thunderPunch: { name: 'THNDR PUNCH', type: 'electric', power: 75,  accuracy: 100, maxPp: 15, category: 'physical', statusEffect: 'paralyze', statusChance: 10 },
  sonicBoom:    { name: 'SONIC BOOM',  type: 'normal',   power: 40,  accuracy: 90,  maxPp: 20, category: 'physical' },
  selfDestruct: { name: 'SELFDSTRCT',  type: 'normal',   power: 200, accuracy: 100, maxPp: 5,  category: 'physical' },
  dig:          { name: 'DIG',         type: 'ground',   power: 80,  accuracy: 100, maxPp: 10, category: 'physical' },
  sing:         { name: 'SING',        type: 'normal',   power: 0,   accuracy: 55,  maxPp: 15, category: 'status', effect: 'sleep' },
  doubleSlap:   { name: 'DOUBLESLAP',  type: 'normal',   power: 45,  accuracy: 85,  maxPp: 10, category: 'physical' },
  pound:        { name: 'POUND',       type: 'normal',   power: 40,  accuracy: 100, maxPp: 35, category: 'physical' },
  disable:      { name: 'DISABLE',     type: 'normal',   power: 0,   accuracy: 100, maxPp: 20, category: 'status', effect: 'lower_speed' },
  hypnosis:     { name: 'HYPNOSIS',    type: 'psychic',  power: 0,   accuracy: 60,  maxPp: 20, category: 'status', effect: 'sleep' },
  headbutt2:    { name: 'HEADBUTT',    type: 'normal',   power: 70,  accuracy: 100, maxPp: 15, category: 'physical' },
  submission:   { name: 'SUBMISSION',  type: 'fighting', power: 80,  accuracy: 80,  maxPp: 20, category: 'physical' },
  dragonRage:   { name: 'DRAGON RAGE', type: 'dragon',   power: 60,  accuracy: 100, maxPp: 10, category: 'physical' },
  wingAttack2:  { name: 'WING ATK',    type: 'flying',   power: 60,  accuracy: 100, maxPp: 35, category: 'physical' },
  // New moves — Sprint 008
  petalDance:   { name: 'PETAL DANCE', type: 'grass',    power: 120, accuracy: 100, maxPp: 10, category: 'physical' },
  gigaDrain:    { name: 'GIGA DRAIN',  type: 'grass',    power: 75,  accuracy: 100, maxPp: 10, category: 'physical' },
  sludgeBomb:   { name: 'SLUDGE BOMB', type: 'poison',   power: 90,  accuracy: 100, maxPp: 10, category: 'physical', statusEffect: 'poison', statusChance: 30 },
  fireSpinMove: { name: 'FIRE SPIN',   type: 'fire',     power: 35,  accuracy: 85,  maxPp: 15, category: 'physical', statusEffect: 'burn', statusChance: 10 },
  flameBurst:   { name: 'FLAME BURST', type: 'fire',     power: 70,  accuracy: 100, maxPp: 15, category: 'physical' },
  agility:      { name: 'AGILITY',     type: 'psychic',  power: 0,   accuracy: 100, maxPp: 30, category: 'status', effect: 'raise_attack' },
  flareBlitz:   { name: 'FLARE BLITZ', type: 'fire',     power: 120, accuracy: 100, maxPp: 15, category: 'physical', statusEffect: 'burn', statusChance: 10 },
  takeDown:     { name: 'TAKE DOWN',   type: 'normal',   power: 90,  accuracy: 85,  maxPp: 20, category: 'physical' },
  crunch:       { name: 'CRUNCH',      type: 'normal',   power: 80,  accuracy: 100, maxPp: 15, category: 'physical', effect: 'lower_defense' },
  roar:         { name: 'ROAR',        type: 'normal',   power: 0,   accuracy: 100, maxPp: 20, category: 'status', effect: 'lower_attack' },
  willOWisp:    { name: 'WILL-O-WISP',type: 'fire',     power: 0,   accuracy: 85,  maxPp: 15, category: 'status', effect: 'burn' },
  quickAttack2: { name: 'QUICK ATK',   type: 'normal',   power: 40,  accuracy: 100, maxPp: 30, category: 'physical' },
  wrapMove:     { name: 'WRAP',        type: 'normal',   power: 15,  accuracy: 90,  maxPp: 20, category: 'physical' },
  acid:         { name: 'ACID',        type: 'poison',   power: 40,  accuracy: 100, maxPp: 30, category: 'physical', effect: 'lower_defense' },
  razorWind:    { name: 'RAZOR WIND',  type: 'normal',   power: 80,  accuracy: 100, maxPp: 10, category: 'physical' },
  stomp:        { name: 'STOMP',       type: 'normal',   power: 65,  accuracy: 100, maxPp: 20, category: 'physical' },
  lick:         { name: 'LICK',        type: 'ghost',    power: 30,  accuracy: 100, maxPp: 30, category: 'physical', statusEffect: 'paralyze', statusChance: 30 },
  nightShade:   { name: 'NIGHT SHADE', type: 'ghost',    power: 50,  accuracy: 100, maxPp: 15, category: 'physical' },
  shadowBall:   { name: 'SHADOW BALL', type: 'ghost',    power: 80,  accuracy: 100, maxPp: 15, category: 'physical', effect: 'lower_defense' },
  hypnosis2:    { name: 'HYPNOSIS',    type: 'psychic',  power: 0,   accuracy: 60,  maxPp: 20, category: 'status', effect: 'sleep' },
  dreamEater:   { name: 'DREAM EATR', type: 'psychic',  power: 100, accuracy: 100, maxPp: 15, category: 'physical' },
  // New moves — Sprint 009: Ghost + Ice types
  shadowPunch:  { name: 'SHADOW PNCH', type: 'ghost',   power: 60,  accuracy: 100, maxPp: 20, category: 'physical' },
  hex:          { name: 'HEX',         type: 'ghost',    power: 65,  accuracy: 100, maxPp: 10, category: 'physical' },
  shadowClaw:   { name: 'SHADOW CLAW', type: 'ghost',    power: 70,  accuracy: 100, maxPp: 15, category: 'physical' },
  curse:        { name: 'CURSE',       type: 'ghost',    power: 0,   accuracy: 100, maxPp: 10, category: 'status', effect: 'lower_speed' },
  iceBeam:      { name: 'ICE BEAM',    type: 'ice',      power: 90,  accuracy: 100, maxPp: 10, category: 'physical', statusEffect: 'paralyze', statusChance: 10 },
  blizzard:     { name: 'BLIZZARD',    type: 'ice',      power: 110, accuracy: 70,  maxPp: 5,  category: 'physical', statusEffect: 'paralyze', statusChance: 10 },
  icePunch:     { name: 'ICE PUNCH',   type: 'ice',      power: 75,  accuracy: 100, maxPp: 15, category: 'physical', statusEffect: 'paralyze', statusChance: 10 },
  icyWind:      { name: 'ICY WIND',    type: 'ice',      power: 55,  accuracy: 95,  maxPp: 15, category: 'physical', effect: 'lower_speed' },
  auroraBeam:   { name: 'AURORA BEAM', type: 'ice',      power: 65,  accuracy: 100, maxPp: 20, category: 'physical', effect: 'lower_attack' },
  powderSnow:   { name: 'POWDER SNOW', type: 'ice',      power: 40,  accuracy: 100, maxPp: 25, category: 'physical', statusEffect: 'paralyze', statusChance: 10 },
  barrier:      { name: 'BARRIER',     type: 'psychic',  power: 0,   accuracy: 100, maxPp: 20, category: 'status', effect: 'raise_defense' },
  dazzleGleam:  { name: 'DAZZLE GLAM', type: 'normal',   power: 80,  accuracy: 100, maxPp: 10, category: 'physical' },
  // New moves — Sprint 010: Fighting + Dragon types
  brickBreak:   { name: 'BRICK BREAK', type: 'fighting', power: 75,  accuracy: 100, maxPp: 15, category: 'physical' },
  closeCombat:  { name: 'CLOSE COMBAT',type: 'fighting', power: 120, accuracy: 100, maxPp: 5,  category: 'physical' },
  highJumpKick: { name: 'HI JUMP KCK', type: 'fighting', power: 130, accuracy: 90,  maxPp: 10, category: 'physical' },
  crossChop:    { name: 'CROSS CHOP',  type: 'fighting', power: 100, accuracy: 80,  maxPp: 5,  category: 'physical' },
  dragonClaw:   { name: 'DRAGON CLAW', type: 'dragon',   power: 80,  accuracy: 100, maxPp: 15, category: 'physical' },
  dragonBreath: { name: 'DRAGON BRTH', type: 'dragon',   power: 60,  accuracy: 100, maxPp: 20, category: 'physical', statusEffect: 'paralyze', statusChance: 30 },
  dragonPulse:  { name: 'DRAGON PLSE', type: 'dragon',   power: 85,  accuracy: 100, maxPp: 10, category: 'physical' },
  outrage:      { name: 'OUTRAGE',     type: 'dragon',   power: 120, accuracy: 100, maxPp: 10, category: 'physical' },
  sludgeWave:   { name: 'SLUDGE WAVE', type: 'poison',   power: 95,  accuracy: 100, maxPp: 10, category: 'physical', statusEffect: 'poison', statusChance: 10 },
  venoshock:    { name: 'VENOSHOCK',   type: 'poison',    power: 65,  accuracy: 100, maxPp: 10, category: 'physical', statusEffect: 'poison', statusChance: 10 },
  toxic:        { name: 'TOXIC',       type: 'poison',    power: 0,   accuracy: 90,  maxPp: 10, category: 'status', effect: 'poison' },
  smog:         { name: 'SMOG',        type: 'poison',    power: 30,  accuracy: 70,  maxPp: 20, category: 'physical', statusEffect: 'poison', statusChance: 40 },
  selfDestruct2:{ name: 'EXPLOSION',   type: 'normal',    power: 250, accuracy: 100, maxPp: 5,  category: 'physical' },
  waterfall:    { name: 'WATERFALL',   type: 'water',     power: 80,  accuracy: 100, maxPp: 15, category: 'physical' },
  hyperBeam:    { name: 'HYPER BEAM',  type: 'normal',    power: 150, accuracy: 90,  maxPp: 5,  category: 'physical' },
  xScissor:     { name: 'X-SCISSOR',   type: 'bug',       power: 80,  accuracy: 100, maxPp: 15, category: 'physical' },
  slash:        { name: 'SLASH',       type: 'normal',    power: 70,  accuracy: 100, maxPp: 20, category: 'physical' },
  guillotine:   { name: 'GUILLOTINE', type: 'normal',    power: 120, accuracy: 50,  maxPp: 5,  category: 'physical' },
  viceGrip:     { name: 'VICE GRIP',  type: 'normal',    power: 55,  accuracy: 100, maxPp: 30, category: 'physical' },
  splash:       { name: 'SPLASH',     type: 'normal',    power: 0,   accuracy: 100, maxPp: 40, category: 'status' },
  flail:        { name: 'FLAIL',      type: 'normal',    power: 30,  accuracy: 100, maxPp: 15, category: 'physical' },
  // New moves — Sprint 011: Steel type + extras
  ironHead:     { name: 'IRON HEAD',  type: 'steel',     power: 80,  accuracy: 100, maxPp: 15, category: 'physical' },
  metalClaw:    { name: 'METAL CLAW', type: 'steel',     power: 50,  accuracy: 95,  maxPp: 35, category: 'physical' },
  flashCannon:  { name: 'FLASH CANN', type: 'steel',     power: 80,  accuracy: 100, maxPp: 10, category: 'physical', effect: 'lower_defense' },
  steelWing:    { name: 'STEEL WING', type: 'steel',     power: 70,  accuracy: 90,  maxPp: 25, category: 'physical', effect: 'raise_defense' },
  magnetBomb:   { name: 'MAGNET BOMB',type: 'steel',     power: 60,  accuracy: 100, maxPp: 20, category: 'physical' },
  mirrorShot:   { name: 'MIRROR SHOT',type: 'steel',     power: 65,  accuracy: 85,  maxPp: 10, category: 'physical', effect: 'lower_attack' },
  boneClub:     { name: 'BONE CLUB',  type: 'ground',    power: 65,  accuracy: 85,  maxPp: 20, category: 'physical' },
  bonemerang:    { name: 'BONEMERANG', type: 'ground',    power: 50,  accuracy: 90,  maxPp: 10, category: 'physical' },
  hornAttack:   { name: 'HORN ATK',   type: 'normal',    power: 65,  accuracy: 100, maxPp: 25, category: 'physical' },
  hornDrill:    { name: 'HORN DRILL', type: 'normal',    power: 120, accuracy: 50,  maxPp: 5,  category: 'physical' },
  megaKick:     { name: 'MEGA KICK',  type: 'normal',    power: 120, accuracy: 75,  maxPp: 5,  category: 'physical' },
  rollingKick:  { name: 'ROLLING KCK',type: 'fighting',  power: 60,  accuracy: 85,  maxPp: 15, category: 'physical' },
  cometPunch:   { name: 'COMET PNCH', type: 'normal',    power: 60,  accuracy: 85,  maxPp: 15, category: 'physical' },
  machPunch:    { name: 'MACH PUNCH', type: 'fighting',  power: 40,  accuracy: 100, maxPp: 30, category: 'physical' },
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
    evolution: { level: 32, into: 'venusaur' },
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
    evolution: { level: 36, into: 'charizard' },
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
    evolution: { level: 36, into: 'blastoise' },
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
    evolution: { level: 26, into: 'raichu' },
  },
  raichu: {
    id: 26, name: 'RAICHU', types: ['electric'],
    baseHp: 60, baseAtk: 90, baseDef: 55, baseSpd: 110,
    learnedMoves: ['thunderbolt', 'quickAttack', 'spark', 'thunderPunch'],
    baseExpYield: 218, catchRate: 75,
    levelUpMoves: [{ level: 28, moveKey: 'thunderPunch' }, { level: 36, moveKey: 'hyperBeam' }],
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
    evolution: { level: 36, into: 'steelix' },
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
    evolution: { level: 36, into: 'nidoking' },
  },
  nidoking: {
    id: 34, name: 'NIDOKING', types: ['poison', 'ground'],
    baseHp: 81, baseAtk: 102, baseDef: 77, baseSpd: 85,
    learnedMoves: ['bodySlam', 'earthquake', 'sludgeBomb', 'megaKick'],
    baseExpYield: 235, catchRate: 45,
    levelUpMoves: [{ level: 38, moveKey: 'earthquake' }, { level: 44, moveKey: 'hyperBeam' }],
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
    evolution: { level: 32, into: 'vileplume' },
  },

  // Mankey line
  mankey: {
    id: 56, name: 'MANKEY', types: ['fighting'],
    baseHp: 40, baseAtk: 80, baseDef: 35, baseSpd: 70,
    learnedMoves: ['scratch', 'leer', 'karatechop'],
    baseExpYield: 61, catchRate: 190,
    levelUpMoves: [{ level: 9, moveKey: 'karatechop' }, { level: 13, moveKey: 'furySwipes' }, { level: 17, moveKey: 'brickBreak' }],
    evolution: { level: 28, into: 'primeape' },
  },
  primeape: {
    id: 57, name: 'PRIMEAPE', types: ['fighting'],
    baseHp: 65, baseAtk: 105, baseDef: 60, baseSpd: 95,
    learnedMoves: ['karatechop', 'furySwipes', 'brickBreak', 'closeCombat'],
    baseExpYield: 159, catchRate: 75,
    levelUpMoves: [{ level: 30, moveKey: 'closeCombat' }, { level: 35, moveKey: 'crossChop' }],
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
    evolution: { level: 36, into: 'alakazam' },
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

  // ── Sprint 007 Pokemon ──

  // Complete starter evolutions
  venusaur: {
    id: 3, name: 'VENUSAUR', types: ['grass', 'poison'],
    baseHp: 80, baseAtk: 82, baseDef: 83, baseSpd: 80,
    learnedMoves: ['vineWhip', 'razorLeaf', 'seedBomb', 'solarBeam'],
    baseExpYield: 236, catchRate: 45,
    levelUpMoves: [{ level: 32, moveKey: 'solarBeam' }],
  },
  charizard: {
    id: 6, name: 'CHARIZARD', types: ['fire', 'flying'],
    baseHp: 78, baseAtk: 84, baseDef: 78, baseSpd: 100,
    learnedMoves: ['fireFang', 'flamethrower', 'wingAttack', 'dragonRage'],
    baseExpYield: 240, catchRate: 45,
    levelUpMoves: [{ level: 36, moveKey: 'fireBlast' }],
  },
  blastoise: {
    id: 9, name: 'BLASTOISE', types: ['water'],
    baseHp: 79, baseAtk: 83, baseDef: 100, baseSpd: 78,
    learnedMoves: ['waterGun', 'bubbleBeam', 'waterPulse', 'surf'],
    baseExpYield: 239, catchRate: 45,
    levelUpMoves: [{ level: 36, moveKey: 'hydroPump' }],
  },

  // New Pokemon for Route 4
  magnemite: {
    id: 81, name: 'MAGNEMITE', types: ['electric', 'steel'],
    baseHp: 25, baseAtk: 35, baseDef: 70, baseSpd: 45,
    learnedMoves: ['tackle', 'thunderShock'],
    baseExpYield: 65, catchRate: 190,
    levelUpMoves: [{ level: 6, moveKey: 'thunderShock' }, { level: 11, moveKey: 'sonicBoom' }, { level: 16, moveKey: 'spark' }, { level: 21, moveKey: 'thunderbolt' }, { level: 26, moveKey: 'metalClaw' }],
    evolution: { level: 30, into: 'magneton' },
  },
  voltorb: {
    id: 100, name: 'VOLTORB', types: ['electric'],
    baseHp: 40, baseAtk: 30, baseDef: 50, baseSpd: 100,
    learnedMoves: ['tackle', 'thunderShock', 'screech'],
    baseExpYield: 66, catchRate: 190,
    levelUpMoves: [{ level: 8, moveKey: 'sonicBoom' }, { level: 12, moveKey: 'spark' }, { level: 22, moveKey: 'selfDestruct' }],
    evolution: { level: 30, into: 'electrode' },
  },
  diglett: {
    id: 50, name: 'DIGLETT', types: ['ground'],
    baseHp: 10, baseAtk: 55, baseDef: 25, baseSpd: 95,
    learnedMoves: ['scratch', 'mudSlap'],
    baseExpYield: 53, catchRate: 255,
    levelUpMoves: [{ level: 5, moveKey: 'mudSlap' }, { level: 9, moveKey: 'dig' }, { level: 15, moveKey: 'rockSlide' }, { level: 22, moveKey: 'earthquake' }],
    evolution: { level: 26, into: 'dugtrio' },
  },
  dugtrio: {
    id: 51, name: 'DUGTRIO', types: ['ground'],
    baseHp: 35, baseAtk: 100, baseDef: 50, baseSpd: 120,
    learnedMoves: ['scratch', 'mudSlap', 'dig', 'earthquake'],
    baseExpYield: 149, catchRate: 50,
    levelUpMoves: [{ level: 28, moveKey: 'rockSlide' }],
  },
  jigglypuff: {
    id: 39, name: 'JIGGLYPUFF', types: ['normal'],
    baseHp: 115, baseAtk: 45, baseDef: 20, baseSpd: 20,
    learnedMoves: ['pound', 'sing'],
    baseExpYield: 95, catchRate: 170,
    levelUpMoves: [{ level: 5, moveKey: 'pound' }, { level: 9, moveKey: 'sing' }, { level: 14, moveKey: 'doubleSlap' }, { level: 19, moveKey: 'bodySlam' }],
  },
  drowzee: {
    id: 96, name: 'DROWZEE', types: ['psychic'],
    baseHp: 60, baseAtk: 48, baseDef: 45, baseSpd: 42,
    learnedMoves: ['pound', 'hypnosis'],
    baseExpYield: 66, catchRate: 190,
    levelUpMoves: [{ level: 5, moveKey: 'hypnosis' }, { level: 9, moveKey: 'confusion' }, { level: 17, moveKey: 'headbutt' }, { level: 21, moveKey: 'psybeam' }, { level: 29, moveKey: 'psychic' }],
    evolution: { level: 26, into: 'hypno' },
  },
  machop: {
    id: 66, name: 'MACHOP', types: ['fighting'],
    baseHp: 70, baseAtk: 80, baseDef: 50, baseSpd: 35,
    learnedMoves: ['karatechop', 'leer'],
    baseExpYield: 61, catchRate: 180,
    levelUpMoves: [{ level: 7, moveKey: 'brickBreak' }, { level: 13, moveKey: 'focusEnergy' }, { level: 19, moveKey: 'karatechop' }, { level: 25, moveKey: 'submission' }, { level: 32, moveKey: 'crossChop' }],
    evolution: { level: 28, into: 'machoke' },
  },
  machoke: {
    id: 67, name: 'MACHOKE', types: ['fighting'],
    baseHp: 80, baseAtk: 100, baseDef: 70, baseSpd: 45,
    learnedMoves: ['karatechop', 'brickBreak', 'submission', 'crossChop'],
    baseExpYield: 142, catchRate: 90,
    levelUpMoves: [{ level: 34, moveKey: 'closeCombat' }],
    evolution: { level: 40, into: 'machamp' },
  },

  // ── Sprint 008 Pokemon ──

  // Bellsprout line (Erika's gym + Route 5)
  bellsprout: {
    id: 69, name: 'BELLSPROUT', types: ['grass', 'poison'],
    baseHp: 50, baseAtk: 75, baseDef: 35, baseSpd: 40,
    learnedMoves: ['vineWhip', 'growl', 'wrapMove'],
    baseExpYield: 60, catchRate: 255,
    levelUpMoves: [{ level: 7, moveKey: 'vineWhip' }, { level: 11, moveKey: 'wrapMove' }, { level: 15, moveKey: 'poisonPowder' }, { level: 18, moveKey: 'sleepPowder' }, { level: 23, moveKey: 'acid' }],
    evolution: { level: 21, into: 'weepinbell' },
  },
  weepinbell: {
    id: 70, name: 'WEEPINBELL', types: ['grass', 'poison'],
    baseHp: 65, baseAtk: 90, baseDef: 50, baseSpd: 55,
    learnedMoves: ['vineWhip', 'acid', 'sleepPowder', 'razorLeaf'],
    baseExpYield: 137, catchRate: 120,
    levelUpMoves: [{ level: 24, moveKey: 'razorLeaf' }, { level: 29, moveKey: 'sludgeBomb' }],
    evolution: { level: 36, into: 'victreebel' },
  },
  victreebel: {
    id: 71, name: 'VICTREEBEL', types: ['grass', 'poison'],
    baseHp: 80, baseAtk: 105, baseDef: 65, baseSpd: 70,
    learnedMoves: ['razorLeaf', 'sludgeBomb', 'sleepPowder', 'seedBomb'],
    baseExpYield: 221, catchRate: 45,
    levelUpMoves: [{ level: 38, moveKey: 'petalDance' }],
  },

  // Growlithe + Arcanine
  growlithe: {
    id: 58, name: 'GROWLITHE', types: ['fire'],
    baseHp: 55, baseAtk: 70, baseDef: 45, baseSpd: 60,
    learnedMoves: ['ember', 'roar', 'bite'],
    baseExpYield: 70, catchRate: 190,
    levelUpMoves: [{ level: 6, moveKey: 'ember' }, { level: 12, moveKey: 'bite' }, { level: 17, moveKey: 'flameBurst' }, { level: 23, moveKey: 'takeDown' }, { level: 30, moveKey: 'flamethrower' }],
    evolution: { level: 30, into: 'arcanine' },
  },
  arcanine: {
    id: 59, name: 'ARCANINE', types: ['fire'],
    baseHp: 90, baseAtk: 110, baseDef: 80, baseSpd: 95,
    learnedMoves: ['flamethrower', 'takeDown', 'bite', 'flareBlitz'],
    baseExpYield: 194, catchRate: 75,
    levelUpMoves: [{ level: 34, moveKey: 'flareBlitz' }],
  },

  // Vulpix + Ninetales
  vulpix: {
    id: 37, name: 'VULPIX', types: ['fire'],
    baseHp: 38, baseAtk: 41, baseDef: 40, baseSpd: 65,
    learnedMoves: ['ember', 'tailWhip'],
    baseExpYield: 60, catchRate: 190,
    levelUpMoves: [{ level: 7, moveKey: 'ember' }, { level: 12, moveKey: 'quickAttack' }, { level: 15, moveKey: 'fireSpinMove' }, { level: 20, moveKey: 'willOWisp' }, { level: 28, moveKey: 'flamethrower' }],
    evolution: { level: 30, into: 'ninetales' },
  },
  ninetales: {
    id: 38, name: 'NINETALES', types: ['fire'],
    baseHp: 73, baseAtk: 76, baseDef: 75, baseSpd: 100,
    learnedMoves: ['flamethrower', 'quickAttack', 'willOWisp', 'fireBlast'],
    baseExpYield: 177, catchRate: 75,
    levelUpMoves: [{ level: 34, moveKey: 'fireBlast' }],
  },

  // Ponyta + Rapidash
  ponyta: {
    id: 77, name: 'PONYTA', types: ['fire'],
    baseHp: 50, baseAtk: 85, baseDef: 55, baseSpd: 90,
    learnedMoves: ['tackle', 'growl', 'ember'],
    baseExpYield: 82, catchRate: 190,
    levelUpMoves: [{ level: 5, moveKey: 'ember' }, { level: 10, moveKey: 'fireSpinMove' }, { level: 16, moveKey: 'stomp' }, { level: 21, moveKey: 'flameBurst' }, { level: 28, moveKey: 'takeDown' }, { level: 33, moveKey: 'flareBlitz' }],
    evolution: { level: 40, into: 'rapidash' },
  },
  rapidash: {
    id: 78, name: 'RAPIDASH', types: ['fire'],
    baseHp: 65, baseAtk: 100, baseDef: 70, baseSpd: 105,
    learnedMoves: ['flareBlitz', 'stomp', 'takeDown', 'fireBlast'],
    baseExpYield: 175, catchRate: 60,
    levelUpMoves: [{ level: 42, moveKey: 'fireBlast' }],
  },

  // Tangela (Erika's gym)
  tangela: {
    id: 114, name: 'TANGELA', types: ['grass'],
    baseHp: 65, baseAtk: 55, baseDef: 115, baseSpd: 60,
    learnedMoves: ['vineWhip', 'absorb', 'stunSpore'],
    baseExpYield: 87, catchRate: 45,
    levelUpMoves: [{ level: 10, moveKey: 'absorb' }, { level: 14, moveKey: 'vineWhip' }, { level: 19, moveKey: 'stunSpore' }, { level: 25, moveKey: 'megaDrain' }, { level: 31, moveKey: 'seedBomb' }, { level: 36, moveKey: 'gigaDrain' }],
  },

  // Gloom evolution -> Vileplume
  vileplume: {
    id: 45, name: 'VILEPLUME', types: ['grass', 'poison'],
    baseHp: 75, baseAtk: 80, baseDef: 85, baseSpd: 50,
    learnedMoves: ['megaDrain', 'sludgeBomb', 'sleepPowder', 'petalDance'],
    baseExpYield: 221, catchRate: 45,
    levelUpMoves: [{ level: 35, moveKey: 'petalDance' }],
  },

  // Gastly line
  gastly: {
    id: 92, name: 'GASTLY', types: ['ghost', 'poison'],
    baseHp: 30, baseAtk: 35, baseDef: 30, baseSpd: 80,
    learnedMoves: ['lick', 'hypnosis'],
    baseExpYield: 62, catchRate: 190,
    levelUpMoves: [{ level: 8, moveKey: 'nightShade' }, { level: 13, moveKey: 'hypnosis2' }, { level: 19, moveKey: 'shadowPunch' }, { level: 25, moveKey: 'shadowBall' }],
    evolution: { level: 25, into: 'haunter' },
  },
  haunter: {
    id: 93, name: 'HAUNTER', types: ['ghost', 'poison'],
    baseHp: 45, baseAtk: 50, baseDef: 45, baseSpd: 95,
    learnedMoves: ['nightShade', 'shadowBall', 'hypnosis2', 'dreamEater'],
    baseExpYield: 142, catchRate: 90,
    levelUpMoves: [{ level: 28, moveKey: 'dreamEater' }, { level: 33, moveKey: 'hex' }],
    evolution: { level: 38, into: 'gengar' },
  },

  // Snorlax
  snorlax: {
    id: 143, name: 'SNORLAX', types: ['normal'],
    baseHp: 160, baseAtk: 110, baseDef: 65, baseSpd: 30,
    learnedMoves: ['tackle', 'headbutt', 'bodySlam', 'slam'],
    baseExpYield: 189, catchRate: 25,
    levelUpMoves: [{ level: 15, moveKey: 'headbutt' }, { level: 20, moveKey: 'bodySlam' }, { level: 28, moveKey: 'crunch' }, { level: 35, moveKey: 'earthquake' }],
  },

  // ── Sprint 009 Pokemon ──

  // Gengar (Haunter evolution)
  gengar: {
    id: 94, name: 'GENGAR', types: ['ghost', 'poison'],
    baseHp: 60, baseAtk: 65, baseDef: 60, baseSpd: 110,
    learnedMoves: ['shadowBall', 'hex', 'dreamEater', 'hypnosis2'],
    baseExpYield: 225, catchRate: 45,
    levelUpMoves: [{ level: 40, moveKey: 'shadowClaw' }],
  },

  // Alakazam (Kadabra evolution)
  alakazam: {
    id: 65, name: 'ALAKAZAM', types: ['psychic'],
    baseHp: 55, baseAtk: 50, baseDef: 45, baseSpd: 120,
    learnedMoves: ['confusion', 'psybeam', 'psychic', 'recover'],
    baseExpYield: 250, catchRate: 50,
    levelUpMoves: [{ level: 38, moveKey: 'dazzleGleam' }],
  },

  // Hypno (Drowzee evolution)
  hypno: {
    id: 97, name: 'HYPNO', types: ['psychic'],
    baseHp: 85, baseAtk: 73, baseDef: 67, baseSpd: 67,
    learnedMoves: ['confusion', 'hypnosis', 'psybeam', 'headbutt'],
    baseExpYield: 169, catchRate: 75,
    levelUpMoves: [{ level: 29, moveKey: 'psychic' }, { level: 37, moveKey: 'dreamEater' }],
  },

  // Clefairy
  clefairy: {
    id: 35, name: 'CLEFAIRY', types: ['normal'],
    baseHp: 70, baseAtk: 45, baseDef: 48, baseSpd: 35,
    learnedMoves: ['pound', 'growl', 'sing'],
    baseExpYield: 68, catchRate: 150,
    levelUpMoves: [{ level: 7, moveKey: 'doubleSlap' }, { level: 13, moveKey: 'sing' }, { level: 18, moveKey: 'dazzleGleam' }, { level: 25, moveKey: 'bodySlam' }],
  },

  // Seel + Dewgong
  seel: {
    id: 86, name: 'SEEL', types: ['water'],
    baseHp: 65, baseAtk: 45, baseDef: 55, baseSpd: 45,
    learnedMoves: ['headbutt', 'waterGun'],
    baseExpYield: 65, catchRate: 190,
    levelUpMoves: [{ level: 7, moveKey: 'waterGun' }, { level: 11, moveKey: 'icyWind' }, { level: 17, moveKey: 'auroraBeam' }, { level: 23, moveKey: 'bubbleBeam' }, { level: 29, moveKey: 'iceBeam' }],
    evolution: { level: 34, into: 'dewgong' },
  },
  dewgong: {
    id: 87, name: 'DEWGONG', types: ['water', 'ice'],
    baseHp: 90, baseAtk: 70, baseDef: 80, baseSpd: 70,
    learnedMoves: ['auroraBeam', 'iceBeam', 'bubbleBeam', 'surf'],
    baseExpYield: 166, catchRate: 75,
    levelUpMoves: [{ level: 36, moveKey: 'blizzard' }],
  },

  // Jynx
  jynx: {
    id: 124, name: 'JYNX', types: ['ice', 'psychic'],
    baseHp: 65, baseAtk: 50, baseDef: 35, baseSpd: 95,
    learnedMoves: ['pound', 'icyWind', 'confusion'],
    baseExpYield: 159, catchRate: 45,
    levelUpMoves: [{ level: 15, moveKey: 'powderSnow' }, { level: 18, moveKey: 'confusion' }, { level: 21, moveKey: 'icePunch' }, { level: 25, moveKey: 'psybeam' }, { level: 33, moveKey: 'iceBeam' }, { level: 39, moveKey: 'psychic' }, { level: 44, moveKey: 'blizzard' }],
  },

  // Lapras
  lapras: {
    id: 131, name: 'LAPRAS', types: ['water', 'ice'],
    baseHp: 130, baseAtk: 85, baseDef: 80, baseSpd: 60,
    learnedMoves: ['waterGun', 'powderSnow', 'bodySlam'],
    baseExpYield: 187, catchRate: 45,
    levelUpMoves: [{ level: 7, moveKey: 'waterGun' }, { level: 13, moveKey: 'iceBeam' }, { level: 18, moveKey: 'bodySlam' }, { level: 25, moveKey: 'surf' }, { level: 31, moveKey: 'iceBeam' }, { level: 37, moveKey: 'blizzard' }, { level: 43, moveKey: 'hydroPump' }],
  },

  // Eevee
  eevee: {
    id: 133, name: 'EEVEE', types: ['normal'],
    baseHp: 55, baseAtk: 55, baseDef: 50, baseSpd: 55,
    learnedMoves: ['tackle', 'tailWhip', 'quickAttack'],
    baseExpYield: 65, catchRate: 45,
    levelUpMoves: [{ level: 8, moveKey: 'quickAttack' }, { level: 16, moveKey: 'bite' }, { level: 23, moveKey: 'swift' }, { level: 30, moveKey: 'takeDown' }],
  },

  // Mr. Mime
  mrMime: {
    id: 122, name: 'MR. MIME', types: ['psychic'],
    baseHp: 40, baseAtk: 45, baseDef: 65, baseSpd: 90,
    learnedMoves: ['confusion', 'barrier'],
    baseExpYield: 136, catchRate: 45,
    levelUpMoves: [{ level: 8, moveKey: 'confusion' }, { level: 15, moveKey: 'barrier' }, { level: 22, moveKey: 'psybeam' }, { level: 29, moveKey: 'dazzleGleam' }, { level: 36, moveKey: 'psychic' }],
  },

  // Dratini + Dragonair (using normal/flying as proxy since no dragon type)
  dratini: {
    id: 147, name: 'DRATINI', types: ['dragon'],
    baseHp: 41, baseAtk: 64, baseDef: 45, baseSpd: 50,
    learnedMoves: ['wrapMove', 'tackle'],
    baseExpYield: 60, catchRate: 45,
    levelUpMoves: [{ level: 5, moveKey: 'tackle' }, { level: 11, moveKey: 'dragonBreath' }, { level: 15, moveKey: 'slam' }, { level: 21, moveKey: 'agility' }, { level: 25, moveKey: 'dragonClaw' }],
    evolution: { level: 30, into: 'dragonair' },
  },
  dragonair: {
    id: 148, name: 'DRAGONAIR', types: ['dragon'],
    baseHp: 61, baseAtk: 84, baseDef: 65, baseSpd: 70,
    learnedMoves: ['dragonBreath', 'dragonClaw', 'slam', 'agility'],
    baseExpYield: 147, catchRate: 27,
    levelUpMoves: [{ level: 33, moveKey: 'dragonPulse' }, { level: 38, moveKey: 'hydroPump' }],
    evolution: { level: 55, into: 'dragonite' },
  },

  // ── Sprint 010 Pokemon ──

  // Machamp (Machoke evolution)
  machamp: {
    id: 68, name: 'MACHAMP', types: ['fighting'],
    baseHp: 90, baseAtk: 130, baseDef: 80, baseSpd: 55,
    learnedMoves: ['crossChop', 'closeCombat', 'submission', 'earthquake'],
    baseExpYield: 227, catchRate: 45,
    levelUpMoves: [{ level: 42, moveKey: 'closeCombat' }],
  },

  // Dragonite (Dragonair evolution)
  dragonite: {
    id: 149, name: 'DRAGONITE', types: ['dragon', 'flying'],
    baseHp: 91, baseAtk: 134, baseDef: 95, baseSpd: 80,
    learnedMoves: ['dragonClaw', 'dragonPulse', 'wingAttack', 'hyperBeam'],
    baseExpYield: 270, catchRate: 9,
    levelUpMoves: [{ level: 57, moveKey: 'outrage' }],
  },

  // Koffing + Weezing (Koga's gym)
  koffing: {
    id: 109, name: 'KOFFING', types: ['poison'],
    baseHp: 40, baseAtk: 65, baseDef: 95, baseSpd: 35,
    learnedMoves: ['tackle', 'smog', 'poisonSting'],
    baseExpYield: 68, catchRate: 190,
    levelUpMoves: [{ level: 6, moveKey: 'smog' }, { level: 10, moveKey: 'poisonSting' }, { level: 17, moveKey: 'acidSpray' }, { level: 22, moveKey: 'sludgeBomb' }, { level: 28, moveKey: 'selfDestruct' }],
    evolution: { level: 35, into: 'weezing' },
  },
  weezing: {
    id: 110, name: 'WEEZING', types: ['poison'],
    baseHp: 65, baseAtk: 90, baseDef: 120, baseSpd: 60,
    learnedMoves: ['sludgeBomb', 'sludgeWave', 'toxic', 'selfDestruct2'],
    baseExpYield: 172, catchRate: 60,
    levelUpMoves: [{ level: 38, moveKey: 'sludgeWave' }],
  },

  // Grimer + Muk
  grimer: {
    id: 88, name: 'GRIMER', types: ['poison'],
    baseHp: 80, baseAtk: 80, baseDef: 50, baseSpd: 25,
    learnedMoves: ['pound', 'poisonSting', 'smog'],
    baseExpYield: 65, catchRate: 190,
    levelUpMoves: [{ level: 7, moveKey: 'smog' }, { level: 12, moveKey: 'acid' }, { level: 17, moveKey: 'venoshock' }, { level: 23, moveKey: 'sludgeBomb' }],
    evolution: { level: 38, into: 'muk' },
  },
  muk: {
    id: 89, name: 'MUK', types: ['poison'],
    baseHp: 105, baseAtk: 105, baseDef: 75, baseSpd: 50,
    learnedMoves: ['sludgeBomb', 'venoshock', 'acid', 'bodySlam'],
    baseExpYield: 175, catchRate: 75,
    levelUpMoves: [{ level: 40, moveKey: 'sludgeWave' }],
  },

  // Tentacool + Tentacruel
  tentacool: {
    id: 72, name: 'TENTACOOL', types: ['water', 'poison'],
    baseHp: 40, baseAtk: 40, baseDef: 35, baseSpd: 70,
    learnedMoves: ['poisonSting', 'waterGun'],
    baseExpYield: 67, catchRate: 190,
    levelUpMoves: [{ level: 6, moveKey: 'waterGun' }, { level: 12, moveKey: 'acid' }, { level: 18, moveKey: 'bubbleBeam' }, { level: 24, moveKey: 'venoshock' }, { level: 30, moveKey: 'surf' }],
    evolution: { level: 30, into: 'tentacruel' },
  },
  tentacruel: {
    id: 73, name: 'TENTACRUEL', types: ['water', 'poison'],
    baseHp: 80, baseAtk: 70, baseDef: 65, baseSpd: 100,
    learnedMoves: ['surf', 'sludgeWave', 'venoshock', 'bubbleBeam'],
    baseExpYield: 180, catchRate: 60,
    levelUpMoves: [{ level: 34, moveKey: 'hydroPump' }],
  },

  // Magikarp + Gyarados
  magikarp: {
    id: 129, name: 'MAGIKARP', types: ['water'],
    baseHp: 20, baseAtk: 10, baseDef: 55, baseSpd: 80,
    learnedMoves: ['splash', 'tackle'],
    baseExpYield: 20, catchRate: 255,
    levelUpMoves: [{ level: 15, moveKey: 'flail' }, { level: 25, moveKey: 'tackle' }],
    evolution: { level: 20, into: 'gyarados' },
  },
  gyarados: {
    id: 130, name: 'GYARADOS', types: ['water', 'flying'],
    baseHp: 95, baseAtk: 125, baseDef: 79, baseSpd: 81,
    learnedMoves: ['bite', 'waterfall', 'crunch', 'hydroPump'],
    baseExpYield: 189, catchRate: 45,
    levelUpMoves: [{ level: 23, moveKey: 'crunch' }, { level: 30, moveKey: 'waterfall' }, { level: 38, moveKey: 'hydroPump' }, { level: 44, moveKey: 'hyperBeam' }],
  },

  // Scyther
  scyther: {
    id: 123, name: 'SCYTHER', types: ['bug', 'flying'],
    baseHp: 70, baseAtk: 110, baseDef: 80, baseSpd: 105,
    learnedMoves: ['quickAttack', 'wingAttack', 'slash'],
    baseExpYield: 187, catchRate: 45,
    levelUpMoves: [{ level: 6, moveKey: 'quickAttack' }, { level: 12, moveKey: 'slash' }, { level: 18, moveKey: 'wingAttack' }, { level: 24, moveKey: 'xScissor' }, { level: 30, moveKey: 'aerialAce' }, { level: 36, moveKey: 'airSlash' }],
  },

  // Pinsir
  pinsir: {
    id: 127, name: 'PINSIR', types: ['bug'],
    baseHp: 65, baseAtk: 125, baseDef: 100, baseSpd: 85,
    learnedMoves: ['viceGrip', 'focusEnergy', 'bugBite'],
    baseExpYield: 175, catchRate: 45,
    levelUpMoves: [{ level: 7, moveKey: 'bugBite' }, { level: 13, moveKey: 'viceGrip' }, { level: 18, moveKey: 'slash' }, { level: 25, moveKey: 'xScissor' }, { level: 33, moveKey: 'guillotine' }],
  },

  // ── Sprint 011 Pokemon ──

  // Magneton (Magnemite evolution)
  magneton: {
    id: 82, name: 'MAGNETON', types: ['electric', 'steel'],
    baseHp: 50, baseAtk: 60, baseDef: 95, baseSpd: 70,
    learnedMoves: ['thunderShock', 'spark', 'thunderbolt', 'metalClaw'],
    baseExpYield: 163, catchRate: 60,
    levelUpMoves: [{ level: 32, moveKey: 'flashCannon' }, { level: 38, moveKey: 'mirrorShot' }],
  },

  // Electrode (Voltorb evolution)
  electrode: {
    id: 101, name: 'ELECTRODE', types: ['electric'],
    baseHp: 60, baseAtk: 50, baseDef: 70, baseSpd: 150,
    learnedMoves: ['thunderShock', 'spark', 'sonicBoom', 'selfDestruct'],
    baseExpYield: 172, catchRate: 60,
    levelUpMoves: [{ level: 32, moveKey: 'thunderbolt' }],
  },

  // Steelix (Onix evolution)
  steelix: {
    id: 208, name: 'STEELIX', types: ['steel', 'ground'],
    baseHp: 75, baseAtk: 85, baseDef: 200, baseSpd: 30,
    learnedMoves: ['ironTail', 'rockSlide', 'earthquake', 'ironHead'],
    baseExpYield: 179, catchRate: 25,
    levelUpMoves: [{ level: 38, moveKey: 'flashCannon' }],
  },

  // Cubone
  cubone: {
    id: 104, name: 'CUBONE', types: ['ground'],
    baseHp: 50, baseAtk: 50, baseDef: 95, baseSpd: 35,
    learnedMoves: ['growl', 'mudSlap', 'headbutt'],
    baseExpYield: 64, catchRate: 190,
    levelUpMoves: [{ level: 7, moveKey: 'mudSlap' }, { level: 11, moveKey: 'boneClub' }, { level: 17, moveKey: 'headbutt' }, { level: 23, moveKey: 'bonemerang' }, { level: 29, moveKey: 'earthquake' }],
    evolution: { level: 28, into: 'marowak' },
  },

  // Marowak (Cubone evolution)
  marowak: {
    id: 105, name: 'MAROWAK', types: ['ground'],
    baseHp: 60, baseAtk: 80, baseDef: 110, baseSpd: 45,
    learnedMoves: ['boneClub', 'bonemerang', 'headbutt', 'earthquake'],
    baseExpYield: 149, catchRate: 75,
    levelUpMoves: [{ level: 30, moveKey: 'earthquake' }],
  },

  // Rhyhorn
  rhyhorn: {
    id: 111, name: 'RHYHORN', types: ['ground', 'rock'],
    baseHp: 80, baseAtk: 85, baseDef: 95, baseSpd: 25,
    learnedMoves: ['tackle', 'mudSlap', 'hornAttack'],
    baseExpYield: 69, catchRate: 120,
    levelUpMoves: [{ level: 8, moveKey: 'hornAttack' }, { level: 12, moveKey: 'stomp' }, { level: 19, moveKey: 'rockSlide' }, { level: 26, moveKey: 'dig' }, { level: 33, moveKey: 'earthquake' }],
    evolution: { level: 42, into: 'rhydon' },
  },

  // Rhydon (Rhyhorn evolution)
  rhydon: {
    id: 112, name: 'RHYDON', types: ['ground', 'rock'],
    baseHp: 105, baseAtk: 130, baseDef: 120, baseSpd: 40,
    learnedMoves: ['rockSlide', 'earthquake', 'hornAttack', 'hyperBeam'],
    baseExpYield: 204, catchRate: 60,
    levelUpMoves: [{ level: 44, moveKey: 'hornDrill' }],
  },

  // Flareon (fire Eeveelution)
  flareon: {
    id: 136, name: 'FLAREON', types: ['fire'],
    baseHp: 65, baseAtk: 130, baseDef: 60, baseSpd: 65,
    learnedMoves: ['ember', 'quickAttack', 'bite', 'fireFang'],
    baseExpYield: 184, catchRate: 45,
    levelUpMoves: [{ level: 25, moveKey: 'fireFang' }, { level: 29, moveKey: 'flamethrower' }, { level: 33, moveKey: 'flareBlitz' }],
  },

  // Jolteon (electric Eeveelution)
  jolteon: {
    id: 135, name: 'JOLTEON', types: ['electric'],
    baseHp: 65, baseAtk: 65, baseDef: 60, baseSpd: 130,
    learnedMoves: ['thunderShock', 'quickAttack', 'spark'],
    baseExpYield: 184, catchRate: 45,
    levelUpMoves: [{ level: 25, moveKey: 'spark' }, { level: 29, moveKey: 'thunderbolt' }, { level: 33, moveKey: 'thunderPunch' }],
  },

  // Vaporeon (water Eeveelution)
  vaporeon: {
    id: 134, name: 'VAPOREON', types: ['water'],
    baseHp: 130, baseAtk: 65, baseDef: 60, baseSpd: 65,
    learnedMoves: ['waterGun', 'quickAttack', 'bite'],
    baseExpYield: 184, catchRate: 45,
    levelUpMoves: [{ level: 25, moveKey: 'bubbleBeam' }, { level: 29, moveKey: 'surf' }, { level: 33, moveKey: 'hydroPump' }],
  },

  // Hitmonlee
  hitmonlee: {
    id: 106, name: 'HITMONLEE', types: ['fighting'],
    baseHp: 50, baseAtk: 120, baseDef: 53, baseSpd: 87,
    learnedMoves: ['lowKick', 'karatechop', 'rollingKick'],
    baseExpYield: 159, catchRate: 45,
    levelUpMoves: [{ level: 21, moveKey: 'brickBreak' }, { level: 26, moveKey: 'highJumpKick' }, { level: 31, moveKey: 'megaKick' }, { level: 36, moveKey: 'closeCombat' }],
  },

  // Hitmonchan
  hitmonchan: {
    id: 107, name: 'HITMONCHAN', types: ['fighting'],
    baseHp: 50, baseAtk: 105, baseDef: 79, baseSpd: 76,
    learnedMoves: ['cometPunch', 'machPunch', 'icePunch'],
    baseExpYield: 159, catchRate: 45,
    levelUpMoves: [{ level: 21, moveKey: 'icePunch' }, { level: 26, moveKey: 'thunderPunch' }, { level: 31, moveKey: 'brickBreak' }, { level: 36, moveKey: 'closeCombat' }],
  },

  // ── Sprint 013 Pokemon ──

  // Meowth + Persian (Giovanni's team)
  meowth: {
    id: 52, name: 'MEOWTH', types: ['normal'],
    baseHp: 40, baseAtk: 45, baseDef: 35, baseSpd: 90,
    learnedMoves: ['scratch', 'growl', 'bite'],
    baseExpYield: 58, catchRate: 190,
    levelUpMoves: [{ level: 7, moveKey: 'bite' }, { level: 12, moveKey: 'slash' }, { level: 17, moveKey: 'swift' }, { level: 23, moveKey: 'pursuit' }],
    evolution: { level: 28, into: 'persian' },
  },
  persian: {
    id: 53, name: 'PERSIAN', types: ['normal'],
    baseHp: 65, baseAtk: 70, baseDef: 60, baseSpd: 115,
    learnedMoves: ['bite', 'slash', 'swift', 'hyperFang'],
    baseExpYield: 154, catchRate: 90,
    levelUpMoves: [{ level: 30, moveKey: 'hyperFang' }, { level: 36, moveKey: 'slash' }, { level: 42, moveKey: 'hyperBeam' }],
  },

  // Kangaskhan (Route 9 rare encounter)
  kangaskhan: {
    id: 115, name: 'KANGASKHAN', types: ['normal'],
    baseHp: 105, baseAtk: 95, baseDef: 80, baseSpd: 90,
    learnedMoves: ['cometPunch', 'bite', 'headbutt', 'bodySlam'],
    baseExpYield: 175, catchRate: 45,
    levelUpMoves: [{ level: 15, moveKey: 'bite' }, { level: 20, moveKey: 'headbutt' }, { level: 27, moveKey: 'bodySlam' }, { level: 34, moveKey: 'hyperBeam' }],
  },

  // Tauros (Route 9 strong encounter)
  tauros: {
    id: 128, name: 'TAUROS', types: ['normal'],
    baseHp: 75, baseAtk: 100, baseDef: 95, baseSpd: 110,
    learnedMoves: ['tackle', 'tailWhip', 'stomp', 'bodySlam'],
    baseExpYield: 211, catchRate: 45,
    levelUpMoves: [{ level: 16, moveKey: 'stomp' }, { level: 22, moveKey: 'bodySlam' }, { level: 30, moveKey: 'takeDown' }, { level: 38, moveKey: 'hyperBeam' }],
  },

  // ── Sprint 014 Pokemon ──

  // Arbok (Ekans evolution)
  ekans: {
    id: 23, name: 'EKANS', types: ['poison'],
    baseHp: 35, baseAtk: 60, baseDef: 44, baseSpd: 55,
    learnedMoves: ['poisonSting', 'leer', 'bite'],
    baseExpYield: 58, catchRate: 255,
    levelUpMoves: [{ level: 7, moveKey: 'bite' }, { level: 12, moveKey: 'acid' }, { level: 18, moveKey: 'wrapMove' }, { level: 24, moveKey: 'sludgeBomb' }],
    evolution: { level: 22, into: 'arbok' },
  },
  arbok: {
    id: 24, name: 'ARBOK', types: ['poison'],
    baseHp: 60, baseAtk: 85, baseDef: 69, baseSpd: 80,
    learnedMoves: ['bite', 'acid', 'wrapMove', 'sludgeBomb'],
    baseExpYield: 157, catchRate: 90,
    levelUpMoves: [{ level: 26, moveKey: 'crunch' }, { level: 32, moveKey: 'sludgeWave' }, { level: 38, moveKey: 'gigaDrain' }],
  },

  // Aerodactyl (fossil Pokemon)
  aerodactyl: {
    id: 142, name: 'AERODACTYL', types: ['rock', 'flying'],
    baseHp: 80, baseAtk: 105, baseDef: 65, baseSpd: 130,
    learnedMoves: ['tackle', 'wingAttack', 'bite', 'rockSlide'],
    baseExpYield: 202, catchRate: 45,
    levelUpMoves: [{ level: 20, moveKey: 'wingAttack' }, { level: 26, moveKey: 'bite' }, { level: 32, moveKey: 'rockSlide' }, { level: 38, moveKey: 'hyperBeam' }, { level: 44, moveKey: 'gigaDrain' }],
  },
};

export const STARTERS = ['bulbasaur', 'charmander', 'squirtle'] as const;
export const WILD_POKEMON = ['pidgey', 'rattata', 'caterpie', 'pikachu', 'zubat', 'geodude', 'nidoranM', 'weedle', 'oddish', 'mankey', 'abra', 'staryu', 'magnemite', 'voltorb', 'diglett', 'jigglypuff', 'drowzee', 'machop', 'bellsprout', 'growlithe', 'vulpix', 'ponyta', 'gastly', 'snorlax', 'clefairy', 'seel', 'jynx', 'lapras', 'eevee', 'dratini', 'mrMime', 'koffing', 'grimer', 'tentacool', 'magikarp', 'scyther', 'pinsir', 'cubone', 'rhyhorn', 'hitmonlee', 'hitmonchan', 'flareon', 'jolteon', 'vaporeon', 'raichu', 'meowth', 'persian', 'nidoking', 'kangaskhan', 'tauros', 'ekans', 'aerodactyl'] as const;

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
  route4: [
    { species: 'magnemite', minLevel: 11, maxLevel: 15, weight: 20 },
    { species: 'voltorb', minLevel: 11, maxLevel: 14, weight: 15 },
    { species: 'diglett', minLevel: 11, maxLevel: 14, weight: 15 },
    { species: 'machop', minLevel: 11, maxLevel: 14, weight: 15 },
    { species: 'drowzee', minLevel: 11, maxLevel: 14, weight: 10 },
    { species: 'jigglypuff', minLevel: 10, maxLevel: 13, weight: 10 },
    { species: 'pidgey', minLevel: 11, maxLevel: 14, weight: 10 },
    { species: 'geodude', minLevel: 12, maxLevel: 15, weight: 5 },
  ],
  route5: [
    { species: 'bellsprout', minLevel: 14, maxLevel: 18, weight: 20 },
    { species: 'growlithe', minLevel: 14, maxLevel: 17, weight: 15 },
    { species: 'vulpix', minLevel: 14, maxLevel: 17, weight: 10 },
    { species: 'ponyta', minLevel: 15, maxLevel: 18, weight: 10 },
    { species: 'gastly', minLevel: 14, maxLevel: 17, weight: 15 },
    { species: 'oddish', minLevel: 14, maxLevel: 16, weight: 10 },
    { species: 'drowzee', minLevel: 14, maxLevel: 17, weight: 10 },
    { species: 'snorlax', minLevel: 18, maxLevel: 20, weight: 2 },
    { species: 'pidgey', minLevel: 14, maxLevel: 17, weight: 8 },
  ],
  route6: [
    { species: 'drowzee', minLevel: 18, maxLevel: 22, weight: 18 },
    { species: 'seel', minLevel: 18, maxLevel: 21, weight: 15 },
    { species: 'clefairy', minLevel: 18, maxLevel: 21, weight: 15 },
    { species: 'gastly', minLevel: 18, maxLevel: 22, weight: 15 },
    { species: 'jynx', minLevel: 20, maxLevel: 23, weight: 8 },
    { species: 'abra', minLevel: 18, maxLevel: 20, weight: 5 },
    { species: 'eevee', minLevel: 18, maxLevel: 22, weight: 4 },
    { species: 'dratini', minLevel: 18, maxLevel: 22, weight: 3 },
    { species: 'machop', minLevel: 18, maxLevel: 21, weight: 10 },
    { species: 'lapras', minLevel: 22, maxLevel: 25, weight: 2 },
    { species: 'mrMime', minLevel: 20, maxLevel: 23, weight: 5 },
  ],
  route7: [
    { species: 'koffing', minLevel: 22, maxLevel: 26, weight: 20 },
    { species: 'grimer', minLevel: 22, maxLevel: 26, weight: 18 },
    { species: 'tentacool', minLevel: 22, maxLevel: 25, weight: 15 },
    { species: 'gastly', minLevel: 23, maxLevel: 27, weight: 12 },
    { species: 'scyther', minLevel: 24, maxLevel: 28, weight: 5 },
    { species: 'pinsir', minLevel: 24, maxLevel: 28, weight: 5 },
    { species: 'machop', minLevel: 22, maxLevel: 26, weight: 10 },
    { species: 'zubat', minLevel: 22, maxLevel: 25, weight: 10 },
    { species: 'mankey', minLevel: 22, maxLevel: 26, weight: 5 },
  ],
  route8: [
    { species: 'ponyta', minLevel: 28, maxLevel: 33, weight: 18 },
    { species: 'growlithe', minLevel: 28, maxLevel: 32, weight: 15 },
    { species: 'rhyhorn', minLevel: 28, maxLevel: 32, weight: 15 },
    { species: 'cubone', minLevel: 27, maxLevel: 31, weight: 15 },
    { species: 'magnemite', minLevel: 28, maxLevel: 32, weight: 10 },
    { species: 'geodude', minLevel: 28, maxLevel: 32, weight: 8 },
    { species: 'vulpix', minLevel: 28, maxLevel: 31, weight: 8 },
    { species: 'hitmonlee', minLevel: 30, maxLevel: 33, weight: 3 },
    { species: 'hitmonchan', minLevel: 30, maxLevel: 33, weight: 3 },
    { species: 'flareon', minLevel: 30, maxLevel: 33, weight: 2 },
    { species: 'eevee', minLevel: 28, maxLevel: 30, weight: 3 },
  ],
  route9: [
    { species: 'persian', minLevel: 33, maxLevel: 38, weight: 15 },
    { species: 'nidoking', minLevel: 35, maxLevel: 40, weight: 10 },
    { species: 'raichu', minLevel: 33, maxLevel: 38, weight: 10 },
    { species: 'tauros', minLevel: 35, maxLevel: 40, weight: 8 },
    { species: 'kangaskhan', minLevel: 35, maxLevel: 40, weight: 5 },
    { species: 'dugtrio', minLevel: 33, maxLevel: 37, weight: 18 },
    { species: 'rhydon', minLevel: 36, maxLevel: 42, weight: 10 },
    { species: 'arcanine', minLevel: 33, maxLevel: 38, weight: 8 },
    { species: 'dragonair', minLevel: 35, maxLevel: 40, weight: 5 },
    { species: 'meowth', minLevel: 30, maxLevel: 35, weight: 11 },
  ],
  fishing: [
    { species: 'magikarp', minLevel: 5, maxLevel: 15, weight: 50 },
    { species: 'staryu', minLevel: 10, maxLevel: 18, weight: 20 },
    { species: 'tentacool', minLevel: 10, maxLevel: 16, weight: 10 },
    { species: 'squirtle', minLevel: 10, maxLevel: 15, weight: 8 },
    { species: 'seel', minLevel: 12, maxLevel: 18, weight: 7 },
    { species: 'gyarados', minLevel: 20, maxLevel: 25, weight: 2 },
    { species: 'rattata', minLevel: 8, maxLevel: 12, weight: 3 },
  ],
};

/** Pick a random encounter from a route table */
export function rollEncounter(route: string): { species: string; level: number } {
  const table = ROUTE_ENCOUNTERS[route] ?? ROUTE_ENCOUNTERS.town;
  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 6;
  const isDusk = hour >= 17 && hour < 20;

  const nocturnalTypes = ['ghost', 'psychic', 'dark'];

  let adjustedTable = table.map(entry => {
    let weight = entry.weight;
    const species = SPECIES[entry.species];
    if (species) {
      const isNocturnal = species.types.some(t => nocturnalTypes.includes(t));
      if (isNight && isNocturnal) {
        weight = Math.floor(weight * 2);
      } else if (isDusk && isNocturnal) {
        weight = Math.floor(weight * 1.5);
      }
    }
    return { ...entry, weight };
  });

  const totalWeight = adjustedTable.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of adjustedTable) {
    roll -= entry.weight;
    if (roll <= 0) {
      const level = entry.minLevel + Math.floor(Math.random() * (entry.maxLevel - entry.minLevel + 1));
      return { species: entry.species, level };
    }
  }
  const last = adjustedTable[adjustedTable.length - 1];
  return { species: last.species, level: last.minLevel };
}

// ── Items ──

export type ItemType = 'pokeball' | 'medicine' | 'repel' | 'key';

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
  ultraBall:   { name: 'ULTRA BALL',   type: 'pokeball', description: 'Best catch rate!', catchMultiplier: 2.0, price: 1200 },
  potion:      { name: 'POTION',       type: 'medicine', description: 'Restores 20 HP.', healAmount: 20, price: 300 },
  superPotion: { name: 'SUPER POTION', type: 'medicine', description: 'Restores 50 HP.', healAmount: 50, price: 700 },
  antidote:    { name: 'ANTIDOTE',     type: 'medicine', description: 'Cures poison.', statusCure: 'cure_poison', price: 100 },
  fullHeal:    { name: 'FULL HEAL',    type: 'medicine', description: 'Cures any status.', statusCure: 'cure_all', price: 600 },
  revive:      { name: 'REVIVE',       type: 'medicine', description: 'Revives fainted POKéMON to half HP.', price: 1500 },
  hyperPotion: { name: 'HYPER POTION', type: 'medicine', description: 'Restores 200 HP.', healAmount: 200, price: 1200 },
  maxPotion:   { name: 'MAX POTION',  type: 'medicine', description: 'Fully restores HP.', healAmount: 9999, price: 2500 },
  repel:       { name: 'REPEL',       type: 'repel',    description: 'Prevents encounters (100 steps).', price: 350 },
  oldRod:      { name: 'OLD ROD',    type: 'key',      description: 'Fish in water for POKéMON.', price: 0 },
  expShare:    { name: 'EXP. SHARE', type: 'key',     description: 'Party POKéMON get 50% EXP from battle.', price: 3000 },
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
  ghost:    '#705898',
  ice:      '#98d8d8',
  fighting: '#c03028',
  dragon:   '#7038f8',
  steel:    '#b8b8d0',
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
  reward: number;
  defeatMessage: string;
  sprite: 'youngster' | 'lass' | 'bugCatcher' | 'hiker' | 'gymLeader' | 'gymLeader2' | 'gymLeader3' | 'gymLeader4' | 'gymLeader5' | 'gymLeader6' | 'gymLeader7' | 'gymLeader8';
  isGymLeader?: boolean;
  badgeName?: string;
  isEliteFour?: boolean;
  isChampion?: boolean;
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
  // Route 4 trainers
  engineer_tom: {
    name: 'ENGINEER TOM',
    team: [{ species: 'magnemite', level: 14 }, { species: 'voltorb', level: 14 }],
    reward: 450,
    defeatMessage: "Shocking result!",
    sprite: 'hiker',
  },
  lass_jenny: {
    name: 'LASS JENNY',
    team: [{ species: 'jigglypuff', level: 13 }, { species: 'oddish', level: 14 }],
    reward: 320,
    defeatMessage: "My cute POK\u00e9MON lost!",
    sprite: 'lass',
  },
  // Third gym leader
  gym_surge: {
    name: 'LT. SURGE',
    team: [{ species: 'voltorb', level: 21 }, { species: 'magnemite', level: 22 }, { species: 'pikachu', level: 24 }],
    reward: 3000,
    defeatMessage: "Now that's a real shock! The THUNDER BADGE is yours!",
    sprite: 'gymLeader3',
    isGymLeader: true,
    badgeName: 'THUNDER BADGE',
  },
  // Route 5 trainers
  lass_lily: {
    name: 'LASS LILY',
    team: [{ species: 'bellsprout', level: 16 }, { species: 'oddish', level: 17 }],
    reward: 380,
    defeatMessage: "My flowers wilted...",
    sprite: 'lass',
  },
  youngster_sam: {
    name: 'YOUNGSTER SAM',
    team: [{ species: 'growlithe', level: 17 }, { species: 'ponyta', level: 17 }],
    reward: 420,
    defeatMessage: "Hot stuff, huh?",
    sprite: 'youngster',
  },
  hiker_greg: {
    name: 'HIKER GREG',
    team: [{ species: 'geodude', level: 16 }, { species: 'machop', level: 16 }, { species: 'geodude', level: 18 }],
    reward: 500,
    defeatMessage: "You rock! ...I mean, I rock. Ugh.",
    sprite: 'hiker',
  },
  // Fourth gym leader
  gym_erika: {
    name: 'LEADER ERIKA',
    team: [{ species: 'bellsprout', level: 26 }, { species: 'tangela', level: 28 }, { species: 'weepinbell', level: 30 }],
    reward: 4200,
    defeatMessage: "Oh! I concede defeat. You are quite strong. Take the RAINBOW BADGE!",
    sprite: 'gymLeader4',
    isGymLeader: true,
    badgeName: 'RAINBOW BADGE',
  },
  // Route 6 trainers
  lass_sarah: {
    name: 'LASS SARAH',
    team: [{ species: 'clefairy', level: 20 }, { species: 'jynx', level: 22 }],
    reward: 500,
    defeatMessage: "Brrr! Your POKéMON are too strong!",
    sprite: 'lass',
  },
  youngster_matt: {
    name: 'YOUNGSTER MATT',
    team: [{ species: 'seel', level: 20 }, { species: 'drowzee', level: 21 }],
    reward: 480,
    defeatMessage: "I need to study harder!",
    sprite: 'youngster',
  },
  hiker_ben: {
    name: 'HIKER BEN',
    team: [{ species: 'geodude', level: 20 }, { species: 'machop', level: 21 }, { species: 'haunter', level: 22 }],
    reward: 600,
    defeatMessage: "Ghosts give me the creeps too!",
    sprite: 'hiker',
  },
  // Fifth gym leader — Sabrina
  gym_sabrina: {
    name: 'LEADER SABRINA',
    team: [{ species: 'mrMime', level: 30 }, { species: 'kadabra', level: 32 }, { species: 'alakazam', level: 35 }],
    reward: 5600,
    defeatMessage: "Your power... I had not foreseen this! Take the MARSH BADGE!",
    sprite: 'gymLeader5',
    isGymLeader: true,
    badgeName: 'MARSH BADGE',
  },
  // Route 7 trainers
  lass_claire: {
    name: 'LASS CLAIRE',
    team: [{ species: 'tentacool', level: 24 }, { species: 'grimer', level: 25 }],
    reward: 560,
    defeatMessage: "Eww, your POKéMON are too strong!",
    sprite: 'lass',
  },
  youngster_kai: {
    name: 'YOUNGSTER KAI',
    team: [{ species: 'koffing', level: 24 }, { species: 'machop', level: 24 }, { species: 'koffing', level: 26 }],
    reward: 600,
    defeatMessage: "Poison is tricky to deal with!",
    sprite: 'youngster',
  },
  hiker_bruce: {
    name: 'HIKER BRUCE',
    team: [{ species: 'grimer', level: 25 }, { species: 'geodude', level: 25 }, { species: 'koffing', level: 27 }],
    reward: 700,
    defeatMessage: "The toxic fumes got to me...",
    sprite: 'hiker',
  },
  // Sixth gym leader — Koga
  gym_koga: {
    name: 'LEADER KOGA',
    team: [{ species: 'koffing', level: 33 }, { species: 'grimer', level: 34 }, { species: 'tentacruel', level: 36 }, { species: 'weezing', level: 39 }],
    reward: 6800,
    defeatMessage: "Humph! You have proven your worth! Take the SOUL BADGE!",
    sprite: 'gymLeader6',
    isGymLeader: true,
    badgeName: 'SOUL BADGE',
  },
  // Route 8 trainers
  lass_ember: {
    name: 'LASS EMBER',
    team: [{ species: 'vulpix', level: 30 }, { species: 'ponyta', level: 31 }],
    reward: 700,
    defeatMessage: "Your POKéMON put out my flames!",
    sprite: 'lass',
  },
  youngster_ash: {
    name: 'YOUNGSTER ASH',
    team: [{ species: 'cubone', level: 29 }, { species: 'growlithe', level: 30 }, { species: 'rhyhorn', level: 31 }],
    reward: 750,
    defeatMessage: "The volcano's heat wasn't enough!",
    sprite: 'youngster',
  },
  hiker_magma: {
    name: 'HIKER MAGMA',
    team: [{ species: 'geodude', level: 30 }, { species: 'rhyhorn', level: 31 }, { species: 'cubone', level: 32 }],
    reward: 850,
    defeatMessage: "Even molten rock couldn't stop you!",
    sprite: 'hiker',
  },
  // Seventh gym leader — Blaine
  gym_blaine: {
    name: 'LEADER BLAINE',
    team: [{ species: 'growlithe', level: 37 }, { species: 'ponyta', level: 38 }, { species: 'rapidash', level: 40 }, { species: 'arcanine', level: 43 }],
    reward: 8600,
    defeatMessage: "Hah! I have been scorched! You earned the VOLCANO BADGE!",
    sprite: 'gymLeader7',
    isGymLeader: true,
    badgeName: 'VOLCANO BADGE',
  },
  // Route 9 trainers
  cooltrainer_anya: {
    name: 'COOLTRAINER ANYA',
    team: [{ species: 'persian', level: 35 }, { species: 'nidoking', level: 36 }],
    reward: 900,
    defeatMessage: "You're stronger than you look!",
    sprite: 'lass',
  },
  cooltrainer_rex: {
    name: 'COOLTRAINER REX',
    team: [{ species: 'raichu', level: 35 }, { species: 'arcanine', level: 36 }, { species: 'tauros', level: 37 }],
    reward: 950,
    defeatMessage: "Outstanding battle form!",
    sprite: 'hiker',
  },
  cooltrainer_vera: {
    name: 'COOLTRAINER VERA',
    team: [{ species: 'dugtrio', level: 34 }, { species: 'meowth', level: 35 }, { species: 'persian', level: 37 }],
    reward: 920,
    defeatMessage: "I was no match for your team!",
    sprite: 'lass',
  },
  // Eighth gym leader — Giovanni
  gym_giovanni: {
    name: 'LEADER GIOVANNI',
    team: [{ species: 'dugtrio', level: 43 }, { species: 'persian', level: 44 }, { species: 'nidoking', level: 46 }, { species: 'rhydon', level: 48 }],
    reward: 12000,
    defeatMessage: "Silence! I refuse to admit defeat! Take the EARTH BADGE!",
    sprite: 'gymLeader8',
    isGymLeader: true,
    badgeName: 'EARTH BADGE',
  },
  // Elite Four — Lorelei (Ice type specialist)
  elite_lorelei: {
    name: 'ELITE LORELEI',
    team: [{ species: 'dewgong', level: 54 }, { species: 'lapras', level: 53 }, { species: 'jynx', level: 56 }],
    reward: 5700,
    defeatMessage: "Your skills are impressive... but not enough for the Elite Four!",
    sprite: 'gymLeader7',
    isEliteFour: true,
  },
  // Elite Four — Agatha (Ghost type specialist)
  elite_agatha: {
    name: 'ELITE AGATHA',
    team: [{ species: 'haunter', level: 54 }, { species: 'gengar', level: 53 }, { species: 'gengar', level: 56 }],
    reward: 5700,
    defeatMessage: "Your spirit is strong... but can you withstand the darkness?",
    sprite: 'gymLeader6',
    isEliteFour: true,
  },
  // Elite Four — Bruno (Fighting type specialist)
  elite_bruno: {
    name: 'ELITE BRUNO',
    team: [{ species: 'hitmonlee', level: 55 }, { species: 'hitmonchan', level: 55 }, { species: 'machamp', level: 58 }],
    reward: 5800,
    defeatMessage: "Your fighting spirit is admirable! But you need more power!",
    sprite: 'gymLeader5',
    isEliteFour: true,
  },
  // Elite Four — Lance (Dragon type specialist)
  elite_lance: {
    name: 'ELITE LANCE',
    team: [{ species: 'dragonair', level: 55 }, { species: 'gyarados', level: 56 }, { species: 'dragonite', level: 60 }],
    reward: 6000,
    defeatMessage: "Magnificent battle! But you must face the Champion next!",
    sprite: 'gymLeader4',
    isEliteFour: true,
  },
  // Champion — Gary (Mixed type master)
  champion_gary: {
    name: 'CHAMPION GARY',
    team: [{ species: 'gengar', level: 54 }, { species: 'haunter', level: 53 }, { species: 'arbok', level: 55 }, { species: 'alakazam', level: 57 }, { species: 'rhydon', level: 59 }, { species: 'gyarados', level: 61 }],
    reward: 15000,
    defeatMessage: "NO! I was so close! You... you truly are a POKéMON MASTER!",
    sprite: 'gymLeader8',
    isChampion: true,
  },
};
