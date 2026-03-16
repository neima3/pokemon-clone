import { MoveData, MOVES, SPECIES, SpeciesData } from './data';

export interface MoveInstance {
  data: MoveData;
  pp: number;
}

function stageMultiplier(stage: number): number {
  return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

export class Pokemon {
  species: SpeciesData;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: MoveInstance[];

  atkStage = 0;
  defStage = 0;
  spdStage = 0;

  constructor(speciesKey: string, level: number) {
    const species = SPECIES[speciesKey];
    if (!species) throw new Error(`Unknown species: ${speciesKey}`);

    this.species = species;
    this.level = level;

    // Simplified stat formula
    this.maxHp = Math.floor((species.baseHp * 2 * level) / 100) + level + 10;
    this.attack = Math.floor((species.baseAtk * 2 * level) / 100) + 5;
    this.defense = Math.floor((species.baseDef * 2 * level) / 100) + 5;
    this.speed = Math.floor((species.baseSpd * 2 * level) / 100) + 5;

    this.hp = this.maxHp;

    this.moves = species.learnedMoves.map((key) => ({
      data: MOVES[key],
      pp: MOVES[key].maxPp,
    }));
  }

  get name() { return this.species.name; }
  get isAlive() { return this.hp > 0; }
  get hpPercent() { return this.hp / this.maxHp; }

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
    for (const m of this.moves) m.pp = m.data.maxPp;
  }
}
