import { Pokemon, MoveInstance } from './Pokemon';
import { getTypeEffectiveness, StatusCondition } from './data';

export interface TurnResult {
  attacker: Pokemon;
  defender: Pokemon;
  move: MoveInstance;
  damage: number;
  effectiveness: number;
  missed: boolean;
  critical: boolean;
  statusMessage?: string;
  statusInflicted?: StatusCondition;
  defenderFainted: boolean;
}

/** Check if attacker can act this turn (handles paralysis, sleep) */
export function canAct(mon: Pokemon): { canAct: boolean; message?: string } {
  if (mon.status === 'sleep') {
    if (mon.sleepTurns <= 0) {
      mon.status = null;
      return { canAct: true, message: `${mon.name} woke up!` };
    }
    mon.sleepTurns--;
    return { canAct: false, message: `${mon.name} is fast asleep!` };
  }
  if (mon.status === 'paralyze') {
    if (Math.random() < 0.25) {
      return { canAct: false, message: `${mon.name} is paralyzed! It can't move!` };
    }
  }
  return { canAct: true };
}

/** Apply end-of-turn status damage (poison, burn) */
export function applyStatusDamage(mon: Pokemon): { damage: number; message?: string } | null {
  if (!mon.isAlive) return null;
  if (mon.status === 'poison') {
    const dmg = Math.max(1, Math.floor(mon.maxHp / 8));
    mon.hp = Math.max(0, mon.hp - dmg);
    return { damage: dmg, message: `${mon.name} is hurt by poison!` };
  }
  if (mon.status === 'burn') {
    const dmg = Math.max(1, Math.floor(mon.maxHp / 8));
    mon.hp = Math.max(0, mon.hp - dmg);
    return { damage: dmg, message: `${mon.name} is hurt by its burn!` };
  }
  return null;
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
    return { attacker, defender, move, damage: 0, effectiveness: 1, missed: true, critical: false, defenderFainted: false };
  }

  // Status moves
  if (move.data.category === 'status') {
    let statusMessage = '';
    let statusInflicted: StatusCondition | undefined;

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
      case 'raise_defense':
        attacker.defStage = Math.min(6, attacker.defStage + 1);
        statusMessage = `${attacker.name}'s DEF rose!`;
        break;
      case 'raise_attack':
        attacker.atkStage = Math.min(6, attacker.atkStage + 1);
        statusMessage = `${attacker.name}'s ATK rose!`;
        break;
      case 'poison':
        if (defender.status) {
          statusMessage = `${defender.name} is already affected!`;
        } else if (defender.species.types.includes('poison')) {
          statusMessage = `It doesn't affect ${defender.name}...`;
        } else {
          defender.status = 'poison';
          statusInflicted = 'poison';
          statusMessage = `${defender.name} was poisoned!`;
        }
        break;
      case 'burn':
        if (defender.status) {
          statusMessage = `${defender.name} is already affected!`;
        } else if (defender.species.types.includes('fire')) {
          statusMessage = `It doesn't affect ${defender.name}...`;
        } else {
          defender.status = 'burn';
          statusInflicted = 'burn';
          statusMessage = `${defender.name} was burned!`;
        }
        break;
      case 'paralyze':
        if (defender.status) {
          statusMessage = `${defender.name} is already affected!`;
        } else if (defender.species.types.includes('electric')) {
          statusMessage = `It doesn't affect ${defender.name}...`;
        } else {
          defender.status = 'paralyze';
          statusInflicted = 'paralyze';
          statusMessage = `${defender.name} is paralyzed!`;
        }
        break;
      case 'sleep':
        if (defender.status) {
          statusMessage = `${defender.name} is already affected!`;
        } else {
          defender.status = 'sleep';
          defender.sleepTurns = 1 + Math.floor(Math.random() * 3); // 1-3 turns
          statusInflicted = 'sleep';
          statusMessage = `${defender.name} fell asleep!`;
        }
        break;
    }
    return { attacker, defender, move, damage: 0, effectiveness: 1, missed: false, critical: false, statusMessage, statusInflicted, defenderFainted: false };
  }

  // Critical hit check (1/16 chance, 1.5x damage)
  const critical = Math.random() < (1 / 16);

  // Damage calculation
  const level = attacker.level;
  const power = move.data.power;
  let atk = attacker.getEffAtk();
  const def = defender.getEffDef();

  // Burn halves physical attack
  if (attacker.status === 'burn') {
    atk = Math.max(1, Math.floor(atk * 0.5));
  }

  const base = Math.floor(((2 * level / 5 + 2) * power * atk / def) / 50) + 2;
  const effectiveness = getTypeEffectiveness(move.data.type, defender.species.types);
  const stab = attacker.species.types.includes(move.data.type) ? 1.5 : 1;
  const random = 0.85 + Math.random() * 0.15;
  const critMult = critical ? 1.5 : 1;

  const damage = Math.max(1, Math.floor(base * effectiveness * stab * random * critMult));
  defender.hp = Math.max(0, defender.hp - damage);

  // Check for secondary status effect
  let statusMessage: string | undefined;
  let statusInflicted: StatusCondition | undefined;
  if (move.data.statusEffect && move.data.statusChance && !defender.status && defender.hp > 0) {
    if (Math.random() * 100 < move.data.statusChance) {
      // Check type immunity
      const immune =
        (move.data.statusEffect === 'poison' && defender.species.types.includes('poison')) ||
        (move.data.statusEffect === 'burn' && defender.species.types.includes('fire')) ||
        (move.data.statusEffect === 'paralyze' && defender.species.types.includes('electric'));

      if (!immune) {
        defender.status = move.data.statusEffect;
        statusInflicted = move.data.statusEffect;
        if (move.data.statusEffect === 'sleep') {
          defender.sleepTurns = 1 + Math.floor(Math.random() * 3);
        }
        const statusNames: Record<StatusCondition, string> = {
          poison: 'poisoned',
          burn: 'burned',
          paralyze: 'paralyzed',
          sleep: 'fell asleep',
        };
        statusMessage = `${defender.name} was ${statusNames[move.data.statusEffect]}!`;
      }
    }
  }

  return { attacker, defender, move, damage, effectiveness, missed: false, critical, statusMessage, statusInflicted, defenderFainted: defender.hp <= 0 };
}

/** Smarter AI: prefers super effective and high-power moves, with some randomness */
export function getEnemyMove(pokemon: Pokemon, defender?: Pokemon): MoveInstance | null {
  const available = pokemon.moves.filter((m) => m.pp > 0);
  if (available.length === 0) return null;

  // If no defender info, pick randomly
  if (!defender) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Score each move and weighted random pick
  const scored = available.map((m) => {
    let score = 1;
    if (m.data.power > 0) {
      const eff = getTypeEffectiveness(m.data.type, defender.species.types);
      const stab = pokemon.species.types.includes(m.data.type) ? 1.5 : 1;
      score = m.data.power * eff * stab;
    } else {
      // Status moves get a baseline score
      score = 30;
      // Prefer status moves if defender doesn't have a status yet
      if (m.data.effect && !defender.status) score = 50;
    }
    return { move: m, score: Math.max(1, score) };
  });

  // 30% chance to pick randomly (keeps it unpredictable)
  if (Math.random() < 0.3) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Weighted random based on scores
  const totalScore = scored.reduce((s, e) => s + e.score, 0);
  let roll = Math.random() * totalScore;
  for (const entry of scored) {
    roll -= entry.score;
    if (roll <= 0) return entry.move;
  }
  return scored[scored.length - 1].move;
}

export function determineTurnOrder(player: Pokemon, enemy: Pokemon): 'player' | 'enemy' {
  let ps = player.getEffSpd();
  let es = enemy.getEffSpd();
  // Paralysis halves speed
  if (player.status === 'paralyze') ps = Math.max(1, Math.floor(ps * 0.5));
  if (enemy.status === 'paralyze') es = Math.max(1, Math.floor(es * 0.5));
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
  // Status conditions improve catch rate
  const statusBonus = target.status === 'sleep' ? 2 : target.status ? 1.5 : 1;
  const catchRate = Math.min(255, Math.floor(rate * hpFactor * catchMultiplier * statusBonus));

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
