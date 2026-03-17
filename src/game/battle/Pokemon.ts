import { MoveData, MOVES, SPECIES, SpeciesData, totalExpForLevel, StatusCondition, ABILITIES, AbilityData } from './data';
import type { HeldItem } from './HeldItems';
import { HELD_ITEMS } from './HeldItems';
import type { WeatherType } from '../Weather';

export interface MoveInstance {
  data: MoveData;
  key: string;
  pp: number;
}

function stageMultiplier(stage: number): number {
  return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

export interface PokemonSaveData {
  speciesKey: string;
  level: number;
  hp: number;
  exp: number;
  moves: Array<{ key: string; pp: number }>;
  isShiny?: boolean;
  heldItemKey?: string | null;
  abilityKey?: string;
}

export class Pokemon {
  speciesKey: string;
  species: SpeciesData;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: MoveInstance[];
  exp: number;

  atkStage = 0;
  defStage = 0;
  spdStage = 0;

  status: StatusCondition | null = null;
  sleepTurns = 0;
  toxicCounter = 0;
  isShiny = false;
  heldItem: HeldItem | null = null;
  ability: AbilityData | null = null;
  abilityKey: string | null = null;
  
  confused = false;
  confuseTurns = 0;
  
  twoTurnState: 'none' | 'charging' | 'flying' | 'underground' = 'none';
  twoTurnMove: string | null = null;

  flashFireBoost = false;
  sturdyUsed = false;

  protected = false;
  consecutiveProtect = 0;
  isSwitching = false;
  
  damageTakenThisTurn = 0;
  lastIncomingMoveWasPhysical: boolean | null = null;

  substituteHp = 0;
  
  trapped = false;
  trappedTurns = 0;
  trappedBy: string | null = null;
  
  disabledMove: string | null = null;
  disabledTurns = 0;
  lastUsedMove: string | null = null;
  
  encoredMove: string | null = null;
  encoreTurns = 0;
  
  taunted = false;
  tauntTurns = 0;

  infatuated = false;
  infatuatedTarget: string | null = null;
  
  drowsy = false;
  
  wishTurns = 0;
  wishHealAmount = 0;
  
  cantSwitch = false;

  futureSightTurns = 0;
  futureSightDamage = 0;
  futureSightAttacker: string | null = null;
  
  doomDesireTurns = 0;
  doomDesireDamage = 0;
  doomDesireAttacker: string | null = null;
  
  destinyBond = false;
  perishSongTurns = 0;
  
  zMoveUsed = false;

  constructor(speciesKey: string, level: number, badgeCount: number = 0) {
    const species = SPECIES[speciesKey];
    if (!species) throw new Error(`Unknown species: ${speciesKey}`);

    this.speciesKey = speciesKey;
    this.species = species;
    this.level = level;
    this.exp = totalExpForLevel(level);

    this.maxHp = Math.floor((species.baseHp * 2 * level) / 100) + level + 10;
    this.attack = Math.floor((species.baseAtk * 2 * level) / 100) + 5;
    this.defense = Math.floor((species.baseDef * 2 * level) / 100) + 5;
    this.speed = Math.floor((species.baseSpd * 2 * level) / 100) + 5;

    this.hp = this.maxHp;
    
    const baseShinyChance = 1 / 256;
    const badgeBonus = 1 + (badgeCount * 0.1);
    this.isShiny = Math.random() < baseShinyChance * badgeBonus;

    this.moves = species.learnedMoves.map((key) => ({
      data: MOVES[key],
      key,
      pp: MOVES[key].maxPp,
    }));

    if (species.abilities && species.abilities.length > 0) {
      const abilityIdx = Math.floor(Math.random() * species.abilities.length);
      this.abilityKey = species.abilities[abilityIdx];
      this.ability = ABILITIES[this.abilityKey] || null;
    }
  }

  get name() { return this.species.name; }
  get isAlive() { return this.hp > 0; }
  get hpPercent() { return this.hp / this.maxHp; }

  get expPercent(): number {
    const currentLevelExp = totalExpForLevel(this.level);
    const nextLevelExp = totalExpForLevel(this.level + 1);
    const range = nextLevelExp - currentLevelExp;
    if (range <= 0) return 1;
    return (this.exp - currentLevelExp) / range;
  }

  get expToNext(): number {
    return totalExpForLevel(this.level + 1) - this.exp;
  }

  get canEvolve(): boolean {
    return !!this.species.evolution && this.level >= this.species.evolution.level;
  }

  get evolutionTarget(): string | null {
    if (!this.species.evolution) return null;
    if (this.level < this.species.evolution.level) return null;
    return this.species.evolution.into;
  }

  getEffAtk() { return Math.max(1, Math.floor(this.attack * stageMultiplier(this.atkStage))); }
  getEffDef() { return Math.max(1, Math.floor(this.defense * stageMultiplier(this.defStage))); }
  getEffSpd() { return Math.max(1, Math.floor(this.speed * stageMultiplier(this.spdStage))); }
  
  getEffSpdWithWeather(weather?: WeatherType): number {
    let spd = this.speed;
    spd = Math.floor(spd * stageMultiplier(this.spdStage));
    
    if (weather && this.ability) {
      if (weather === 'sunny' && this.ability.effect === 'sun_speed_boost') {
        spd *= 2;
      }
      if (weather === 'rain' && this.ability.effect === 'rain_speed_boost') {
        spd *= 2;
      }
    }
    
    if (this.ability?.effect === 'status_spd_boost' && this.status) {
      spd = Math.floor(spd * 1.5);
    }
    
    return Math.max(1, spd);
  }
  
  getEvasionWithWeather(weather?: WeatherType): number {
    let evasion = 1;
    
    if (weather === 'sandstorm' && this.ability?.effect === 'sand_evasion') {
      evasion = 1.25;
    }
    if (this.ability?.effect === 'confuse_evasion' && this.confused) {
      evasion *= 1.25;
    }
    
    return evasion;
  }

  hasAbilityEffect(effect: string): boolean {
    return this.ability?.effect === effect;
  }

  isImmuneToStatus(status: StatusCondition): boolean {
    if (status === 'poison' || status === 'toxic') {
      if (this.hasAbilityEffect('poison_immune')) return true;
      if (this.species.types.includes('poison')) return true;
      if (this.species.types.includes('steel')) return true;
    }
    if (status === 'paralyze' && this.hasAbilityEffect('paralyze_immune')) return true;
    if (status === 'sleep' && this.hasAbilityEffect('sleep_immune')) return true;
    if (status === 'burn' && this.species.types.includes('fire')) return true;
    return false;
  }

  resetStages() {
    this.atkStage = 0;
    this.defStage = 0;
    this.spdStage = 0;
    this.confused = false;
    this.confuseTurns = 0;
    this.twoTurnState = 'none';
    this.twoTurnMove = null;
    this.protected = false;
    this.isSwitching = false;
    this.damageTakenThisTurn = 0;
    this.lastIncomingMoveWasPhysical = null;
    this.toxicCounter = 0;
    this.substituteHp = 0;
    this.trapped = false;
    this.trappedTurns = 0;
    this.trappedBy = null;
    this.disabledMove = null;
    this.disabledTurns = 0;
    this.encoredMove = null;
    this.encoreTurns = 0;
    this.taunted = false;
    this.tauntTurns = 0;
    this.infatuated = false;
    this.infatuatedTarget = null;
    this.drowsy = false;
    this.wishTurns = 0;
    this.wishHealAmount = 0;
    this.cantSwitch = false;
    this.futureSightTurns = 0;
    this.futureSightDamage = 0;
    this.futureSightAttacker = null;
    this.doomDesireTurns = 0;
    this.doomDesireDamage = 0;
    this.doomDesireAttacker = null;
    this.destinyBond = false;
    this.perishSongTurns = 0;
    this.zMoveUsed = false;
  }

  heal() {
    this.hp = this.maxHp;
    this.resetStages();
    this.status = null;
    this.sleepTurns = 0;
    this.confused = false;
    this.confuseTurns = 0;
    this.twoTurnState = 'none';
    this.twoTurnMove = null;
    this.protected = false;
    this.consecutiveProtect = 0;
    this.isSwitching = false;
    this.toxicCounter = 0;
    this.substituteHp = 0;
    this.trapped = false;
    this.trappedTurns = 0;
    this.trappedBy = null;
    this.disabledMove = null;
    this.disabledTurns = 0;
    this.lastUsedMove = null;
    this.encoredMove = null;
    this.encoreTurns = 0;
    this.taunted = false;
    this.tauntTurns = 0;
    this.infatuated = false;
    this.infatuatedTarget = null;
    this.drowsy = false;
    this.wishTurns = 0;
    this.wishHealAmount = 0;
    this.cantSwitch = false;
    this.futureSightTurns = 0;
    this.futureSightDamage = 0;
    this.futureSightAttacker = null;
    this.doomDesireTurns = 0;
    this.doomDesireDamage = 0;
    this.doomDesireAttacker = null;
    this.destinyBond = false;
    this.perishSongTurns = 0;
    this.zMoveUsed = false;
    for (const m of this.moves) m.pp = m.data.maxPp;
  }

  canUseZMove(): boolean {
    return !this.zMoveUsed && this.heldItem?.effect === 'z_crystal';
  }
  
  getZMoveCompatibleMove(): string | null {
    if (!this.canUseZMove()) return null;
    const zType = this.heldItem?.boostType;
    if (!zType) return null;
    
    for (const move of this.moves) {
      if (move.data.type === zType && move.data.category === 'physical' && move.data.power > 0) {
        return move.key;
      }
    }
    return null;
  }

  private recalcStats(): number {
    const s = this.species;
    const oldMaxHp = this.maxHp;
    this.maxHp = Math.floor((s.baseHp * 2 * this.level) / 100) + this.level + 10;
    this.attack = Math.floor((s.baseAtk * 2 * this.level) / 100) + 5;
    this.defense = Math.floor((s.baseDef * 2 * this.level) / 100) + 5;
    this.speed = Math.floor((s.baseSpd * 2 * this.level) / 100) + 5;
    const hpGain = this.maxHp - oldMaxHp;
    this.hp = Math.min(this.maxHp, this.hp + hpGain);
    return hpGain;
  }

  evolve(): boolean {
    const target = this.evolutionTarget;
    if (!target) return false;

    const newSpecies = SPECIES[target];
    if (!newSpecies) return false;

    const hpRatio = this.hp / this.maxHp;

    this.speciesKey = target;
    this.species = newSpecies;

    this.recalcStats();
    this.hp = Math.max(1, Math.round(this.maxHp * hpRatio));

    if (newSpecies.abilities && newSpecies.abilities.length > 0) {
      const abilityIdx = Math.floor(Math.random() * newSpecies.abilities.length);
      this.abilityKey = newSpecies.abilities[abilityIdx];
      this.ability = ABILITIES[this.abilityKey] || null;
    }

    return true;
  }

  gainExp(amount: number): Array<{ newLevel: number; newMoves: string[]; pendingMoves: string[] }> {
    this.exp += amount;
    const events: Array<{ newLevel: number; newMoves: string[]; pendingMoves: string[] }> = [];

    while (this.exp >= totalExpForLevel(this.level + 1) && this.level < 100) {
      this.level++;
      this.recalcStats();

      const newMoves: string[] = [];
      const pendingMoves: string[] = [];
      for (const lm of this.species.levelUpMoves) {
        if (lm.level === this.level) {
          const alreadyKnown = this.moves.some((m) => m.key === lm.moveKey);
          if (alreadyKnown) continue;
          const moveData = MOVES[lm.moveKey];
          if (!moveData) continue;
          if (this.moves.length < 4) {
            this.moves.push({ data: moveData, key: lm.moveKey, pp: moveData.maxPp });
            newMoves.push(lm.moveKey);
          } else {
            pendingMoves.push(lm.moveKey);
          }
        }
      }

      events.push({ newLevel: this.level, newMoves, pendingMoves });
    }

    return events;
  }

  replaceMove(index: number, newMoveKey: string): boolean {
    if (index < 0 || index >= this.moves.length) return false;
    const moveData = MOVES[newMoveKey];
    if (!moveData) return false;
    this.moves[index] = { data: moveData, key: newMoveKey, pp: moveData.maxPp };
    return true;
  }

  toJSON(): PokemonSaveData {
    return {
      speciesKey: this.speciesKey,
      level: this.level,
      hp: this.hp,
      exp: this.exp,
      moves: this.moves.map((m) => ({ key: m.key, pp: m.pp })),
      isShiny: this.isShiny || undefined,
      heldItemKey: this.heldItem?.key ?? null,
      abilityKey: this.abilityKey ?? undefined,
    };
  }

  static fromJSON(data: PokemonSaveData): Pokemon {
    const mon = new Pokemon(data.speciesKey, data.level);
    mon.exp = data.exp;
    mon.hp = Math.min(data.hp, mon.maxHp);
    mon.isShiny = data.isShiny ?? false;
    if (data.heldItemKey && HELD_ITEMS[data.heldItemKey]) {
      mon.heldItem = HELD_ITEMS[data.heldItemKey];
    }
    if (data.abilityKey && ABILITIES[data.abilityKey]) {
      mon.abilityKey = data.abilityKey;
      mon.ability = ABILITIES[data.abilityKey];
    }
    mon.moves = data.moves
      .filter((saved) => MOVES[saved.key])
      .map((saved) => {
        const moveData = MOVES[saved.key];
        return { data: moveData, key: saved.key, pp: Math.min(saved.pp, moveData.maxPp) };
      });
    return mon;
  }
}
