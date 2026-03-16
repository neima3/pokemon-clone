import { Pokemon, MoveInstance } from './Pokemon';
import { getTypeEffectiveness } from './data';

export interface TurnResult {
  attacker: Pokemon;
  defender: Pokemon;
  move: MoveInstance;
  damage: number;
  effectiveness: number;
  missed: boolean;
  statusMessage?: string;
  defenderFainted: boolean;
}

export function executeMove(
  attacker: Pokemon,
  defender: Pokemon,
  move: MoveInstance,
): TurnResult {
  move.pp = Math.max(0, move.pp - 1);

  // Accuracy check
  const missed = Math.random() * 100 >= move.data.accuracy;
  if (missed) {
    return { attacker, defender, move, damage: 0, effectiveness: 1, missed: true, defenderFainted: false };
  }

  // Status moves
  if (move.data.category === 'status') {
    let statusMessage = '';
    switch (move.data.effect) {
      case 'lower_attack':
        defender.atkStage = Math.max(-6, defender.atkStage - 1);
        statusMessage = `${defender.name}'s ATK fell!`;
        break;
      case 'lower_defense':
        defender.defStage = Math.max(-6, defender.defStage - 1);
        statusMessage = `${defender.name}'s DEF fell!`;
        break;
      case 'lower_speed':
        defender.spdStage = Math.max(-6, defender.spdStage - 1);
        statusMessage = `${defender.name}'s SPD fell!`;
        break;
    }
    return { attacker, defender, move, damage: 0, effectiveness: 1, missed: false, statusMessage, defenderFainted: false };
  }

  // Damage calculation
  const level = attacker.level;
  const power = move.data.power;
  const atk = attacker.getEffAtk();
  const def = defender.getEffDef();

  const base = Math.floor(((2 * level / 5 + 2) * power * atk / def) / 50) + 2;
  const effectiveness = getTypeEffectiveness(move.data.type, defender.species.types);
  const stab = attacker.species.types.includes(move.data.type) ? 1.5 : 1;
  const random = 0.85 + Math.random() * 0.15;

  const damage = Math.max(1, Math.floor(base * effectiveness * stab * random));
  defender.hp = Math.max(0, defender.hp - damage);

  return { attacker, defender, move, damage, effectiveness, missed: false, defenderFainted: defender.hp <= 0 };
}

export function getEnemyMove(pokemon: Pokemon): MoveInstance | null {
  const available = pokemon.moves.filter((m) => m.pp > 0);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function determineTurnOrder(player: Pokemon, enemy: Pokemon): 'player' | 'enemy' {
  const ps = player.getEffSpd();
  const es = enemy.getEffSpd();
  if (ps !== es) return ps > es ? 'player' : 'enemy';
  return Math.random() < 0.5 ? 'player' : 'enemy';
}

/**
 * Calculate catch rate. Returns number of shakes (0-3) and whether caught.
 * Based on simplified Gen I formula.
 */
export function attemptCatch(
  target: Pokemon,
  catchMultiplier: number,
): { shakes: number; caught: boolean } {
  const rate = target.species.catchRate;
  const hpFactor = (3 * target.maxHp - 2 * target.hp) / (3 * target.maxHp);
  const catchRate = Math.min(255, Math.floor(rate * hpFactor * catchMultiplier));

  // Each shake has a probability based on catch rate
  const shakeProb = catchRate / 255;
  let shakes = 0;

  for (let i = 0; i < 3; i++) {
    if (Math.random() < shakeProb) {
      shakes++;
    } else {
      return { shakes, caught: false };
    }
  }

  // All 3 shakes passed = caught
  return { shakes: 3, caught: true };
}
