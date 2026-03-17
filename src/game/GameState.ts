import { Pokemon, PokemonSaveData } from './battle/Pokemon';

const SAVE_KEY = 'pokemon-clone-save';
const MAX_TEAM_SIZE = 6;

export interface Inventory {
  pokeball: number;
  greatBall: number;
  ultraBall: number;
  masterBall: number;
  potion: number;
  superPotion: number;
  hyperPotion: number;
  maxPotion: number;
  antidote: number;
  fullHeal: number;
  revive: number;
  repel: number;
  expShare: number;
  leftovers: number;
  scopeLens: number;
  lumBerry: number;
  charcoal: number;
  mysticWater: number;
  miracleSeed: number;
  magnet: number;
  vsSeeker: number;
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
  hasGoodRod?: boolean;
  hasSuperRod?: boolean;
  postGame?: boolean;
  defeatedLegendaries?: string[];
  vsSeekerSteps?: number;
}

export class GameState {
  team: Pokemon[] = [];
  pcBox: Pokemon[] = [];
  inventory: Inventory = { pokeball: 5, greatBall: 0, ultraBall: 0, masterBall: 0, potion: 3, superPotion: 0, hyperPotion: 0, maxPotion: 0, antidote: 0, fullHeal: 0, revive: 0, repel: 0, expShare: 0, leftovers: 0, scopeLens: 0, lumBerry: 0, charcoal: 0, mysticWater: 0, miracleSeed: 0, magnet: 0, vsSeeker: 0 };
  playerPosition = { x: 15, y: 13 };
  money = 1000;
  defeatedTrainers: Set<string> = new Set();
  badges: Set<string> = new Set();
  pokedexSeen: Set<string> = new Set();
  pokedexCaught: Set<string> = new Set();
  repelSteps = 0;
  hasOldRod = false;
  hasGoodRod = false;
  hasSuperRod = false;
  postGame = false;
  defeatedLegendaries: Set<string> = new Set();
  vsSeekerSteps = 0;

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

  /** Check if post-game is unlocked */
  isPostGame(): boolean {
    return this.postGame;
  }

  /** Unlock post-game content */
  unlockPostGame() {
    this.postGame = true;
  }

  /** Check if a legendary has been encountered/defeated */
  isLegendaryDefeated(speciesKey: string): boolean {
    return this.defeatedLegendaries.has(speciesKey);
  }

  /** Mark a legendary as defeated/caught */
  defeatLegendary(speciesKey: string) {
    this.defeatedLegendaries.add(speciesKey);
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

  /** Get best fishing rod available */
  getBestRod(): 'super' | 'good' | 'old' | null {
    if (this.hasSuperRod) return 'super';
    if (this.hasGoodRod) return 'good';
    if (this.hasOldRod) return 'old';
    return null;
  }

  /** Charge VS Seeker while walking */
  chargeVsSeeker(): boolean {
    if (this.inventory.vsSeeker <= 0) return false;
    if (this.vsSeekerSteps < 100) {
      this.vsSeekerSteps++;
      return false;
    }
    return true; // fully charged
  }

  /** Use VS Seeker to reset defeated trainers for rematches */
  useVsSeeker(): boolean {
    if (this.inventory.vsSeeker <= 0 || this.vsSeekerSteps < 100) return false;
    this.vsSeekerSteps = 0;
    return true;
  }

  /** Check if VS Seeker is ready to use */
  isVsSeekerReady(): boolean {
    return this.inventory.vsSeeker > 0 && this.vsSeekerSteps >= 100;
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
      hasGoodRod: this.hasGoodRod,
      hasSuperRod: this.hasSuperRod,
      postGame: this.postGame,
      defeatedLegendaries: [...this.defeatedLegendaries],
      vsSeekerSteps: this.vsSeekerSteps,
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
      const inv = data.inventory as unknown as Record<string, number>;
      const defaultInventory: Inventory = { pokeball: 5, greatBall: 0, ultraBall: 0, masterBall: 0, potion: 3, superPotion: 0, hyperPotion: 0, maxPotion: 0, antidote: 0, fullHeal: 0, revive: 0, repel: 0, expShare: 0, leftovers: 0, scopeLens: 0, lumBerry: 0, charcoal: 0, mysticWater: 0, miracleSeed: 0, magnet: 0, vsSeeker: 0 };
      this.inventory = { ...defaultInventory };
      for (const key of Object.keys(defaultInventory) as Array<keyof Inventory>) {
        if (inv[key] !== undefined) {
          this.inventory[key] = inv[key];
        }
      }
      this.playerPosition = data.playerPosition ?? { x: 15, y: 13 };
      this.money = data.money ?? 1000;
      this.defeatedTrainers = new Set(data.defeatedTrainers ?? []);
      this.badges = new Set(data.badges ?? []);
      this.repelSteps = data.repelSteps ?? 0;
      this.hasOldRod = data.hasOldRod ?? false;
      this.hasGoodRod = data.hasGoodRod ?? false;
      this.hasSuperRod = data.hasSuperRod ?? false;
      this.pokedexSeen = new Set(data.pokedexSeen ?? []);
      this.pokedexCaught = new Set(data.pokedexCaught ?? []);
      this.postGame = data.postGame ?? false;
      this.defeatedLegendaries = new Set(data.defeatedLegendaries ?? []);
      this.vsSeekerSteps = data.vsSeekerSteps ?? 0;
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
