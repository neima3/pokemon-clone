import { Pokemon, PokemonSaveData } from './battle/Pokemon';

const SAVE_KEY = 'pokemon-clone-save';
const MAX_TEAM_SIZE = 6;

export interface Inventory {
  pokeball: number;
  potion: number;
  superPotion: number;
}

interface SaveData {
  team: PokemonSaveData[];
  inventory: Inventory;
  playerPosition: { x: number; y: number };
  money: number;
  defeatedTrainers: string[];
}

export class GameState {
  team: Pokemon[] = [];
  inventory: Inventory = { pokeball: 5, potion: 3, superPotion: 0 };
  playerPosition = { x: 15, y: 13 };
  money = 1000;
  defeatedTrainers: Set<string> = new Set();

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

  /** Heal all team Pokemon */
  healTeam() {
    for (const p of this.team) p.heal();
  }

  /** Save game state to localStorage */
  save() {
    const data: SaveData = {
      team: this.team.map((p) => p.toJSON()),
      inventory: { ...this.inventory },
      playerPosition: { ...this.playerPosition },
      money: this.money,
      defeatedTrainers: [...this.defeatedTrainers],
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
      this.inventory = {
        pokeball: data.inventory.pokeball ?? 0,
        potion: data.inventory.potion ?? 0,
        superPotion: data.inventory.superPotion ?? 0,
      };
      this.playerPosition = data.playerPosition ?? { x: 15, y: 13 };
      this.money = data.money ?? 1000;
      this.defeatedTrainers = new Set(data.defeatedTrainers ?? []);
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
