import { MoveData, MOVES, SPECIES, SpeciesData, totalExpForLevel, StatusCondition } from './data';

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

  /** Status condition (poison, burn, paralyze, sleep) */
  status: StatusCondition | null = null;
  /** Turns remaining for sleep */
  sleepTurns = 0;

  constructor(speciesKey: string, level: number) {
    const species = SPECIES[speciesKey];
    if (!species) throw new Error(`Unknown species: ${speciesKey}`);

    this.speciesKey = speciesKey;
    this.species = species;
    this.level = level;
    this.exp = totalExpForLevel(level);

    // Calculate stats
    this.maxHp = Math.floor((species.baseHp * 2 * level) / 100) + level + 10;
    this.attack = Math.floor((species.baseAtk * 2 * level) / 100) + 5;
    this.defense = Math.floor((species.baseDef * 2 * level) / 100) + 5;
    this.speed = Math.floor((species.baseSpd * 2 * level) / 100) + 5;

    this.hp = this.maxHp;

    this.moves = species.learnedMoves.map((key) => ({
      data: MOVES[key],
      key,
      pp: MOVES[key].maxPp,
    }));
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

  /** Check if this Pokemon can evolve at its current level */
  get canEvolve(): boolean {
    return !!this.species.evolution && this.level >= this.species.evolution.level;
  }

  /** Get the species key this Pokemon evolves into, or null */
  get evolutionTarget(): string | null {
    if (!this.species.evolution) return null;
    if (this.level < this.species.evolution.level) return null;
    return this.species.evolution.into;
  }

  getEffAtk() { return Math.max(1, Math.floor(this.attack * stageMultiplier(this.atkStage))); }
  getEffDef() { return Math.max(1, Math.floor(this.defense * stageMultiplier(this.defStage))); }
  getEffSpd() { return Math.max(1, Math.floor(this.speed * stageMultiplier(this.spdStage))); }

  resetStages() {
    this.atkStage = 0;
    this.defStage = 0;
    this.spdStage = 0;
  }

  heal() {
    this.hp = this.maxHp;
    this.resetStages();
    this.status = null;
    this.sleepTurns = 0;
    for (const m of this.moves) m.pp = m.data.maxPp;
  }

  /** Recalculate stats after level up. Returns HP increase. */
  private recalcStats(): number {
    const s = this.species;
    const oldMaxHp = this.maxHp;
    this.maxHp = Math.floor((s.baseHp * 2 * this.level) / 100) + this.level + 10;
    this.attack = Math.floor((s.baseAtk * 2 * this.level) / 100) + 5;
    this.defense = Math.floor((s.baseDef * 2 * this.level) / 100) + 5;
    this.speed = Math.floor((s.baseSpd * 2 * this.level) / 100) + 5;
    // Heal proportional to maxHP increase
    const hpGain = this.maxHp - oldMaxHp;
    this.hp = Math.min(this.maxHp, this.hp + hpGain);
    return hpGain;
  }

  /**
   * Evolve this Pokemon into a new species.
   * Preserves HP ratio, moves, and EXP.
   */
  evolve(): boolean {
    const target = this.evolutionTarget;
    if (!target) return false;

    const newSpecies = SPECIES[target];
    if (!newSpecies) return false;

    const hpRatio = this.hp / this.maxHp;

    this.speciesKey = target;
    this.species = newSpecies;

    // Recalculate stats with new base stats
    this.recalcStats();

    // Restore HP proportionally
    this.hp = Math.max(1, Math.round(this.maxHp * hpRatio));

    return true;
  }

  /**
   * Add EXP and handle level-ups.
   * Returns array of level-up events (level, new moves learned).
   */
  gainExp(amount: number): Array<{ newLevel: number; newMoves: string[]; pendingMoves: string[] }> {
    this.exp += amount;
    const events: Array<{ newLevel: number; newMoves: string[]; pendingMoves: string[] }> = [];

    while (this.exp >= totalExpForLevel(this.level + 1) && this.level < 100) {
      this.level++;
      this.recalcStats();

      // Check for new moves at this level
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
            // Moves full — player needs to choose which to forget
            pendingMoves.push(lm.moveKey);
          }
        }
      }

      events.push({ newLevel: this.level, newMoves, pendingMoves });
    }

    return events;
  }

  /** Replace a move at the given index with a new move */
  replaceMove(index: number, newMoveKey: string): boolean {
    if (index < 0 || index >= this.moves.length) return false;
    const moveData = MOVES[newMoveKey];
    if (!moveData) return false;
    this.moves[index] = { data: moveData, key: newMoveKey, pp: moveData.maxPp };
    return true;
  }

  /** Serialize for save */
  toJSON(): PokemonSaveData {
    return {
      speciesKey: this.speciesKey,
      level: this.level,
      hp: this.hp,
      exp: this.exp,
      moves: this.moves.map((m) => ({ key: m.key, pp: m.pp })),
    };
  }

  /** Restore from save data */
  static fromJSON(data: PokemonSaveData): Pokemon {
    const mon = new Pokemon(data.speciesKey, data.level);
    mon.exp = data.exp;
    mon.hp = Math.min(data.hp, mon.maxHp);
    // Restore moves with saved PP
    mon.moves = data.moves
      .filter((saved) => MOVES[saved.key]) // skip unknown moves
      .map((saved) => {
        const moveData = MOVES[saved.key];
        return { data: moveData, key: saved.key, pp: Math.min(saved.pp, moveData.maxPp) };
      });
    return mon;
  }
}
