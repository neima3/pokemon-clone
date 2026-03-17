import { Pokemon, MoveInstance } from './Pokemon';
import { getTypeEffectiveness, MOVES, StatusCondition } from './data';
import type { PokemonType } from './data';
import type { WeatherType } from '../Weather';

export interface TurnResult {
  damage: number;
  effectiveness: number;
  missed: boolean;
  critical: boolean;
  statusMessage?: string;
  abilityMessage?: string;
  healed?: number;
  absorbed?: boolean;
  immune?: boolean;
}

export interface CatchResult {
  shakes: number;
  caught: boolean;
}

export interface ActResult {
  canAct: boolean;
  message?: string;
}

function stageMultiplier(stage: number): number {
  return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

export function canAct(mon: Pokemon): ActResult {
  if (mon.status === 'sleep') {
    if (mon.sleepTurns > 0) {
      mon.sleepTurns--;
      return { canAct: false, message: `${mon.name} is fast asleep!` };
    } else {
      mon.status = null;
      return { canAct: true, message: `${mon.name} woke up!` };
    }
  }
  
  if (mon.status === 'paralyze') {
    if (Math.random() < 0.25) {
      return { canAct: false, message: `${mon.name} is paralyzed! It can't move!` };
    }
  }
  
  return { canAct: true };
}

export interface StatusDamageResult {
  damage: number;
  message?: string;
}

export function applyStatusDamage(mon: Pokemon): StatusDamageResult | null {
  if (!mon.status || mon.hp <= 0) return null;
  
  if (mon.status === 'poison') {
    const dmg = Math.max(1, Math.floor(mon.maxHp / 8));
    mon.hp = Math.max(0, mon.hp - dmg);
    return { damage: dmg, message: `${mon.name} is hurt by poison!` };
  }
  
  if (mon.status === 'burn') {
    const dmg = Math.max(1, Math.floor(mon.maxHp / 16));
    mon.hp = Math.max(0, mon.hp - dmg);
    return { damage: dmg, message: `${mon.name} is hurt by its burn!` };
  }
  
  return null;
}

export function determineTurnOrder(player: Pokemon, enemy: Pokemon): 'player' | 'enemy' {
  const playerSpd = player.getEffSpd();
  const enemySpd = enemy.getEffSpd();
  
  if (playerSpd > enemySpd) return 'player';
  if (enemySpd > playerSpd) return 'enemy';
  return Math.random() < 0.5 ? 'player' : 'enemy';
}

export function getEnemyMove(enemy: Pokemon, _player: Pokemon): MoveInstance | null {
  const usableMoves = enemy.moves.filter(m => m.pp > 0);
  if (usableMoves.length === 0) return null;
  
  const idx = Math.floor(Math.random() * usableMoves.length);
  return usableMoves[idx];
}

function checkAbilityImmunity(attacker: Pokemon, defender: Pokemon, moveType: PokemonType): { immune: boolean; message?: string } {
  const ability = defender.ability;
  if (!ability) return { immune: false };
  
  if (ability.effect === 'ground_immune' && moveType === 'ground') {
    return { immune: true, message: `${defender.name}'s LEVITATE made it immune!` };
  }
  
  if (ability.effect === 'flash_fire' && moveType === 'fire') {
    defender.flashFireBoost = true;
    return { immune: true, message: `${defender.name}'s FLASH FIRE boosted its Fire moves!` };
  }
  
  if (ability.effect === 'water_heal' && moveType === 'water') {
    const healAmount = Math.floor(defender.maxHp / 4);
    defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
    return { immune: true, message: `${defender.name}'s WATER ABSORB restored HP!` };
  }
  
  if (ability.effect === 'electric_heal' && moveType === 'electric') {
    const healAmount = Math.floor(defender.maxHp / 4);
    defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
    return { immune: true, message: `${defender.name}'s VOLT ABSORB restored HP!` };
  }
  
  if (ability.effect === 'electric_absorb' && moveType === 'electric') {
    defender.atkStage = Math.min(6, defender.atkStage + 1);
    return { immune: true, message: `${defender.name}'s LIGHTNING ROD raised its Sp.Atk!` };
  }
  
  return { immune: false };
}

function checkContactAbility(attacker: Pokemon, defender: Pokemon): string | null {
  const ability = defender.ability;
  if (!ability || !attacker.status) return null;
  
  if (ability.effect === 'paralyze_contact') {
    if (!attacker.status && Math.random() < 0.3) {
      if (!attacker.isImmuneToStatus('paralyze')) {
        attacker.status = 'paralyze';
        return `${attacker.name} was paralyzed by ${defender.name}'s STATIC!`;
      }
    }
  }
  
  if (ability.effect === 'poison_contact') {
    if (!attacker.status && Math.random() < 0.3) {
      if (!attacker.isImmuneToStatus('poison')) {
        attacker.status = 'poison';
        return `${attacker.name} was poisoned by ${defender.name}'s POISON POINT!`;
      }
    }
  }
  
  if (ability.effect === 'burn_contact') {
    if (!attacker.status && Math.random() < 0.3) {
      if (!attacker.isImmuneToStatus('burn')) {
        attacker.status = 'burn';
        return `${attacker.name} was burned by ${defender.name}'s FLAME BODY!`;
      }
    }
  }
  
  if (ability.effect === 'spore_contact') {
    if (!attacker.status && Math.random() < 0.1) {
      const effects: StatusCondition[] = ['paralyze', 'poison', 'sleep'];
      const effect = effects[Math.floor(Math.random() * effects.length)];
      if (!attacker.isImmuneToStatus(effect)) {
        attacker.status = effect;
        if (effect === 'sleep') attacker.sleepTurns = 2 + Math.floor(Math.random() * 2);
        return `${attacker.name} was affected by ${defender.name}'s EFFECT SPORE!`;
      }
    }
  }
  
  return null;
}

function checkSturdyAbility(defender: Pokemon, damage: number): { survived: boolean; message?: string } {
  if (defender.ability?.effect === 'survive_ko' && defender.hp === defender.maxHp && damage >= defender.hp) {
    defender.sturdyUsed = true;
    return { survived: true, message: `${defender.name}'s STURDY kept it standing!` };
  }
  return { survived: false };
}

function getAbilityDamageModifier(attacker: Pokemon, defender: Pokemon, moveType: PokemonType): number {
  let modifier = 1;
  
  if (defender.ability?.effect === 'fire_ice_resist') {
    if (moveType === 'fire' || moveType === 'ice') {
      modifier *= 0.5;
    }
  }
  
  if (attacker.ability) {
    const hpRatio = attacker.hp / attacker.maxHp;
    if (hpRatio <= 1/3) {
      if (attacker.ability.effect === 'fire_boost' && moveType === 'fire') modifier *= 1.5;
      if (attacker.ability.effect === 'water_boost' && moveType === 'water') modifier *= 1.5;
      if (attacker.ability.effect === 'grass_boost' && moveType === 'grass') modifier *= 1.5;
      if (attacker.ability.effect === 'bug_boost' && moveType === 'bug') modifier *= 1.5;
    }
  }
  
  if (attacker.flashFireBoost && moveType === 'fire') {
    modifier *= 1.5;
  }
  
  if (attacker.ability?.effect === 'technician') {
  }
  
  return modifier;
}

export function executeMove(attacker: Pokemon, defender: Pokemon, move: MoveInstance, weather?: WeatherType): TurnResult {
  move.pp = Math.max(0, move.pp - 1);
  
  const result: TurnResult = {
    damage: 0,
    effectiveness: 1,
    missed: false,
    critical: false,
  };
  
  if (move.data.category === 'status') {
    if (move.data.accuracy < 100 && Math.random() * 100 >= move.data.accuracy) {
      result.missed = true;
      return result;
    }
    
    const effect = move.data.effect;
    if (effect === 'lower_attack') {
      defender.atkStage = Math.max(-6, defender.atkStage - 1);
    } else if (effect === 'lower_defense') {
      defender.defStage = Math.max(-6, defender.defStage - 1);
    } else if (effect === 'lower_speed') {
      defender.spdStage = Math.max(-6, defender.spdStage - 1);
    } else if (effect === 'raise_defense') {
      attacker.defStage = Math.min(6, attacker.defStage + 1);
    } else if (effect === 'raise_attack') {
      attacker.atkStage = Math.min(6, attacker.atkStage + 1);
    } else if (effect === 'poison' && !defender.status && !defender.isImmuneToStatus('poison')) {
      defender.status = 'poison';
      result.statusMessage = `${defender.name} was poisoned!`;
    } else if (effect === 'burn' && !defender.status && !defender.isImmuneToStatus('burn')) {
      defender.status = 'burn';
      result.statusMessage = `${defender.name} was burned!`;
    } else if (effect === 'paralyze' && !defender.status && !defender.isImmuneToStatus('paralyze')) {
      defender.status = 'paralyze';
      result.statusMessage = `${defender.name} was paralyzed!`;
    } else if (effect === 'sleep' && !defender.status && !defender.isImmuneToStatus('sleep')) {
      defender.status = 'sleep';
      defender.sleepTurns = 2 + Math.floor(Math.random() * 2);
      result.statusMessage = `${defender.name} fell asleep!`;
    }
    return result;
  }
  
  const immunity = checkAbilityImmunity(attacker, defender, move.data.type);
  if (immunity.immune) {
    result.immune = true;
    result.absorbed = true;
    result.statusMessage = immunity.message;
    return result;
  }
  
  result.effectiveness = getTypeEffectiveness(move.data.type, defender.species.types);
  
  if (result.effectiveness === 0) {
    return result;
  }
  
  let accuracy = move.data.accuracy;
  if (attacker.ability?.effect === 'acc_boost') {
    accuracy = Math.min(100, accuracy * 1.3);
  }
  if (attacker.ability?.effect === 'always_hit' || defender.ability?.effect === 'always_hit') {
    accuracy = 100;
  }
  
  if (Math.random() * 100 >= accuracy) {
    result.missed = true;
    return result;
  }
  
  let critRate = 0.0625;
  if (Math.random() < critRate) {
    result.critical = true;
  }
  
  let atk = attacker.getEffAtk();
  let def = defender.getEffDef();
  
  if (attacker.status === 'burn' && attacker.ability?.effect !== 'status_atk_boost') {
    atk = Math.floor(atk * 0.5);
  }
  
  if (attacker.ability?.effect === 'status_atk_boost' && attacker.status) {
    atk = Math.floor(atk * 1.5);
  }
  
  let damage = Math.floor(((2 * attacker.level / 5 + 2) * move.data.power * atk / def) / 50) + 2;
  
  if (result.critical) {
    damage = Math.floor(damage * 1.5);
  }
  
  damage = Math.floor(damage * result.effectiveness);
  
  const abilityMod = getAbilityDamageModifier(attacker, defender, move.data.type);
  damage = Math.floor(damage * abilityMod);
  
  if (weather) {
    if (weather === 'rain') {
      if (move.data.type === 'water') damage = Math.floor(damage * 1.5);
      if (move.data.type === 'fire') damage = Math.floor(damage * 0.5);
    }
    if (weather === 'sunny') {
      if (move.data.type === 'fire') damage = Math.floor(damage * 1.5);
      if (move.data.type === 'water') damage = Math.floor(damage * 0.5);
    }
  }
  
  if (attacker.species.types.includes(move.data.type)) {
    damage = Math.floor(damage * 1.5);
    if (attacker.ability?.effect === 'stab_boost') {
      damage = Math.floor(damage * 1.33);
    }
  }
  
  damage = Math.max(1, damage);
  
  const sturdyCheck = checkSturdyAbility(defender, damage);
  if (sturdyCheck.survived) {
    damage = defender.hp - 1;
    result.statusMessage = sturdyCheck.message;
  }
  
  defender.hp = Math.max(0, defender.hp - damage);
  result.damage = damage;
  
  if (defender.ability?.effect === 'crit_atk_max' && result.critical) {
    attacker.atkStage = 6;
    result.abilityMessage = `${attacker.name}'s ANGER POINT maxed its Attack!`;
  }
  
  const contactMsg = checkContactAbility(attacker, defender);
  if (contactMsg) {
    result.abilityMessage = contactMsg;
  }
  
  if (move.data.statusEffect && !defender.status && Math.random() * 100 < (move.data.statusChance || 10)) {
    if (!defender.isImmuneToStatus(move.data.statusEffect)) {
      defender.status = move.data.statusEffect;
      if (move.data.statusEffect === 'sleep') {
        defender.sleepTurns = 2 + Math.floor(Math.random() * 2);
      }
    }
  }
  
  return result;
}

export function attemptCatch(mon: Pokemon, catchMultiplier: number = 1): CatchResult {
  const catchRate = (3 * mon.maxHp - 2 * mon.hp) * mon.species.catchRate * catchMultiplier / (3 * mon.maxHp);
  const shakeProb = 65536 / Math.pow(255 / catchRate, 0.1875);
  
  let shakes = 0;
  for (let i = 0; i < 3; i++) {
    if (Math.random() * 65536 < shakeProb) {
      shakes++;
    }
  }
  
  return {
    shakes,
    caught: shakes >= 3,
  };
}
