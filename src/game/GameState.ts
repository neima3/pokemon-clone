import { Pokemon, PokemonSaveData } from './battle/Pokemon';

const SAVE_KEY = 'pokemon-clone-save';
const MAX_TEAM_SIZE = 6;

export interface Inventory {
  pokeball: number;
  greatBall: number;
  ultraBall: number;
  potion: number;
  superPotion: number;
  antidote: number;
  fullHeal: number;
  revive: number;
  repel: number;
}

interface SaveData {
  team: PokemonSaveData[];
  pcBox: PokemonSaveData[];
  inventory: Inventory;
  playerPosition: { x: number; y: number };
  money: number;
  defeatedTrainers: string[];
  badges: string[];
  pokedexSeen: string[];
  pokedexCaught: string[];
  repelSteps?: number;
  hasOldRod?: boolean;
}

export class GameState {
  team: Pokemon[] = [];
  pcBox: Pokemon[] = [];
  inventory: Inventory = { pokeball: 5, greatBall: 0, ultraBall: 0, potion: 3, superPotion: 0, antidote: 0, fullHeal: 0, revive: 0, repel: 0 };
  playerPosition = { x: 15, y: 13 };
  money = 1000;
  defeatedTrainers: Set<string> = new Set();
  badges: Set<string> = new Set();
  pokedexSeen: Set<string> = new Set();
  pokedexCaught: Set<string> = new Set();
  repelSteps = 0;
  hasOldRod = false;

  get hasStarter() {
    return this.team.length > 0;
  }

  get leadPokemon() {
    return this.team[0] ?? null;
  }

  /** Get first alive Pokemon or null */
  get firstAlive(): Pokemon | null {
    return this.team.find((p) => p.isAlive) ?? null;
  }

  addToTeam(pokemon: Pokemon): boolean {
    if (this.team.length >= MAX_TEAM_SIZE) return false;
    this.team.push(pokemon);
    return true;
  }

  /** Add Pokemon to PC box storage */
  addToPC(pokemon: Pokemon) {
    this.pcBox.push(pokemon);
  }

  /** Withdraw Pokemon from PC to team. Returns false if team is full. */
  withdrawFromPC(index: number): boolean {
    if (this.team.length >= MAX_TEAM_SIZE) return false;
    if (index < 0 || index >= this.pcBox.length) return false;
    const mon = this.pcBox.splice(index, 1)[0];
    this.team.push(mon);
    return true;
  }

  /** Deposit Pokemon from team to PC. Cannot deposit last alive Pokemon. */
  depositToPC(teamIndex: number): boolean {
    if (teamIndex < 0 || teamIndex >= this.team.length) return false;
    // Don't deposit if it's the only alive Pokemon
    const aliveCount = this.team.filter(p => p.isAlive).length;
    if (aliveCount <= 1 && this.team[teamIndex].isAlive) return false;
    const mon = this.team.splice(teamIndex, 1)[0];
    this.pcBox.push(mon);
    return true;
  }

  useItem(itemKey: keyof Inventory): boolean {
    if (this.inventory[itemKey] <= 0) return false;
    this.inventory[itemKey]--;
    return true;
  }

  addMoney(amount: number) {
    this.money += amount;
  }

  spendMoney(amount: number): boolean {
    if (this.money < amount) return false;
    this.money -= amount;
    return true;
  }

  isTrainerDefeated(trainerId: string): boolean {
    return this.defeatedTrainers.has(trainerId);
  }

  defeatTrainer(trainerId: string) {
    this.defeatedTrainers.add(trainerId);
  }

  addBadge(badgeName: string) {
    this.badges.add(badgeName);
  }

  hasBadge(badgeName: string): boolean {
    return this.badges.has(badgeName);
  }

  /** Use a repel (100 steps of no wild encounters) */
  useRepel() {
    this.repelSteps = 100;
  }

  /** Tick repel counter. Returns true if repel is active */
  tickRepel(): boolean {
    if (this.repelSteps > 0) {
      this.repelSteps--;
      if (this.repelSteps === 0) return false; // just expired
      return true; // still active
    }
    return false;
  }

  /** Heal all team Pokemon */
  healTeam() {
    for (const p of this.team) p.heal();
  }

  /** Save game state to localStorage */
  save() {
    const data: SaveData = {
      team: this.team.map((p) => p.toJSON()),
      pcBox: this.pcBox.map((p) => p.toJSON()),
      inventory: { ...this.inventory },
      playerPosition: { ...this.playerPosition },
      money: this.money,
      defeatedTrainers: [...this.defeatedTrainers],
      badges: [...this.badges],
      pokedexSeen: [...this.pokedexSeen],
      pokedexCaught: [...this.pokedexCaught],
      repelSteps: this.repelSteps,
      hasOldRod: this.hasOldRod,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      // localStorage may be unavailable
    }
  }

  /** Load game state from localStorage. Returns true if save existed. */
  load(): boolean {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;

      const data: SaveData = JSON.parse(raw);
      this.team = data.team.map((d) => Pokemon.fromJSON(d));
      this.pcBox = (data.pcBox ?? []).map((d) => Pokemon.fromJSON(d));
      this.inventory = {
        pokeball: data.inventory.pokeball ?? 0,
        greatBall: data.inventory.greatBall ?? 0,
        ultraBall: data.inventory.ultraBall ?? 0,
        potion: data.inventory.potion ?? 0,
        superPotion: data.inventory.superPotion ?? 0,
        antidote: data.inventory.antidote ?? 0,
        fullHeal: data.inventory.fullHeal ?? 0,
        revive: data.inventory.revive ?? 0,
        repel: data.inventory.repel ?? 0,
      };
      this.playerPosition = data.playerPosition ?? { x: 15, y: 13 };
      this.money = data.money ?? 1000;
      this.defeatedTrainers = new Set(data.defeatedTrainers ?? []);
      this.badges = new Set(data.badges ?? []);
      this.repelSteps = data.repelSteps ?? 0;
      this.hasOldRod = data.hasOldRod ?? false;
      this.pokedexSeen = new Set(data.pokedexSeen ?? []);
      this.pokedexCaught = new Set(data.pokedexCaught ?? []);
      return this.team.length > 0;
    } catch {
      return false;
    }
  }

  /** Check if a save exists */
  static hasSave(): boolean {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  /** Delete save */
  static deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // ignore
    }
  }
}
