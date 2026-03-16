import { Pokemon } from './battle/Pokemon';

export class GameState {
  team: Pokemon[] = [];

  get hasStarter() {
    return this.team.length > 0;
  }

  get leadPokemon() {
    return this.team[0] ?? null;
  }
}
