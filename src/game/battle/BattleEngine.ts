import { Pokemon, MoveInstance } from './Pokemon';
import { getTypeEffectiveness, MOVES, StatusCondition } from './data';
import type { PokemonType } from './data';
import type { WeatherType } from '../Weather';
import { getHeldItemDamageBoost, getCritBoost, getLeftoversHeal, shouldCureStatus, getSuperEffectiveBoost, getLifeOrbBoost, getLifeOrbRecoil, checkFocusSash } from './HeldItems';

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
  recoilDamage?: number;
  recoilMessage?: string;
  drainHeal?: number;
  drainMessage?: string;
  hits?: number;
  heldItemMessage?: string;
  flinched?: boolean;
  confused?: boolean;
  snappedOut?: boolean;
  charging?: boolean;
  invulnerable?: boolean;
}

  
export interface CatchResult {
  shakes: number;
  caught: boolean;
}

export interface TurnEndResult {
  message?: string;
  cured?: boolean;
}

export interface ActResult {
  canAct: boolean;
  message?: string;
  confusionHit?: boolean;
  confusionDamage?: number;
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
  
  if (mon.confused) {
    mon.confuseTurns--;
    if (mon.confuseTurns <= 0) {
      mon.confused = false;
      return { canAct: true, message: `${mon.name} snapped out of confusion!` };
    }
    if (Math.random() < 0.33) {
      const damage = Math.floor(((2 * mon.level / 5 + 2) * 40 * mon.attack / mon.defense) / 50) + 2;
      mon.hp = Math.max(0, mon.hp - damage);
      return { canAct: false, message: `${mon.name} is confused! It hurt itself in confusion!`, confusionHit: true, confusionDamage: damage };
    }
    return { canAct: true, message: `${mon.name} is confused!` };
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

export function determineTurnOrder(player: Pokemon, enemy: Pokemon, playerMove?: MoveInstance, enemyMove?: MoveInstance, weather?: WeatherType): 'player' | 'enemy' {
  const playerPriority = playerMove?.data.priority ?? 0;
  const enemyPriority = enemyMove?.data.priority ?? 0;
  
  if (playerPriority > enemyPriority) return 'player';
  if (enemyPriority > playerPriority) return 'enemy';
  
  const playerSpd = player.getEffSpdWithWeather(weather);
  const enemySpd = enemy.getEffSpdWithWeather(weather);
  
  if (playerSpd > enemySpd) return 'player';
  if (enemySpd > playerSpd) return 'enemy';
  return Math.random() < 0.5 ? 'player' : 'enemy';
}

export function getEnemyMove(enemy: Pokemon, player: Pokemon): MoveInstance | null {
  const usableMoves = enemy.moves.filter(m => m.pp > 0);
  if (usableMoves.length === 0) return null;
  
  interface ScoredMove {
    move: MoveInstance;
    score: number;
  }
  
  const scoredMoves: ScoredMove[] = usableMoves.map(move => {
    let score = move.data.power || 50;
    
    const effectiveness = getTypeEffectiveness(move.data.type, player.species.types);
    score *= effectiveness;
    
    if (effectiveness === 0) score = 0;
    
    if (enemy.species.types.includes(move.data.type)) {
      score *= 1.3;
    }
    
    if (move.data.accuracy < 100) {
      score *= move.data.accuracy / 100;
    }
    
    if (move.data.priority && move.data.priority > 0) {
      score *= 1.2;
    }
    
    if (move.data.drain) {
      score *= 1.1;
    }
    
    if (move.data.category === 'status') {
      score = 40;
      if (move.data.effect === 'poison' && !player.status && !player.isImmuneToStatus('poison')) {
        score = 60;
      }
      if (move.data.effect === 'burn' && !player.status && !player.isImmuneToStatus('burn')) {
        score = 55;
      }
      if (move.data.effect === 'paralyze' && !player.status && !player.isImmuneToStatus('paralyze')) {
        score = 50;
      }
      if (move.data.effect === 'sleep' && !player.status && !player.isImmuneToStatus('sleep')) {
        score = 65;
      }
    }
    
    score += (Math.random() - 0.5) * 20;
    
    return { move, score };
  });
  
  scoredMoves.sort((a, b) => b.score - a.score);
  
  if (scoredMoves[0].score > 60 && Math.random() < 0.7) {
    return scoredMoves[0].move;
  }
  
  const topMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length));
  const idx = Math.floor(Math.random() * topMoves.length);
  return topMoves[idx].move;
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
  if (!ability || attacker.status) return null;
  
  if (ability.effect === 'paralyze_contact') {
    if (Math.random() < 0.3) {
      if (!attacker.isImmuneToStatus('paralyze')) {
        attacker.status = 'paralyze';
        return `${attacker.name} was paralyzed by ${defender.name}'s STATIC!`;
      }
    }
  }
  
  if (ability.effect === 'poison_contact') {
    if (Math.random() < 0.3) {
      if (!attacker.isImmuneToStatus('poison')) {
        attacker.status = 'poison';
        return `${attacker.name} was poisoned by ${defender.name}'s POISON POINT!`;
      }
    }
  }
  
  if (ability.effect === 'burn_contact') {
    if (Math.random() < 0.3) {
      if (!attacker.isImmuneToStatus('burn')) {
        attacker.status = 'burn';
        return `${attacker.name} was burned by ${defender.name}'s FLAME BODY!`;
      }
    }
  }
  
  if (ability.effect === 'spore_contact') {
    if (Math.random() < 0.1) {
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
    if (effect === 'protect') {
      const successChance = Math.max(0, 100 - attacker.consecutiveProtect * 50);
      if (Math.random() * 100 < successChance) {
        attacker.protected = true;
        attacker.consecutiveProtect++;
        result.statusMessage = `${attacker.name} protected itself!`;
      } else {
        result.statusMessage = `${attacker.name}'s protection failed!`;
      }
    } else if (effect === 'lower_attack') {
      defender.atkStage = Math.max(-6, defender.atkStage - 1);
    } else if (effect === 'lower_defense') {
      defender.defStage = Math.max(-6, defender.defStage - 1);
    } else if (effect === 'lower_speed') {
      defender.spdStage = Math.max(-6, defender.spdStage - 1);
    } else if (effect === 'raise_defense') {
      attacker.defStage = Math.min(6, attacker.defStage + 1);
    } else if (effect === 'raise_attack') {
      attacker.atkStage = Math.min(6, attacker.atkStage + 1);
    } else if (effect === 'raise_attack_2') {
      defender.atkStage = Math.min(6, defender.atkStage + 2);
      if (!defender.confused) {
        defender.confused = true;
        defender.confuseTurns = 1 + Math.floor(Math.random() * 4);
        result.statusMessage = `${defender.name}'s Attack rose sharply! ${defender.name} became confused!`;
      } else {
        result.statusMessage = `${defender.name}'s Attack rose sharply!`;
      }
    } else if (effect === 'raise_speed') {
      attacker.spdStage = Math.min(6, attacker.spdStage + 2);
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
    } else if (effect === 'confuse' && !defender.confused) {
      defender.confused = true;
      defender.confuseTurns = 1 + Math.floor(Math.random() * 4);
      result.statusMessage = `${defender.name} became confused!`;
    }
    return result;
  }
  
  if (defender.protected) {
    result.statusMessage = `${defender.name} protected itself!`;
    result.immune = true;
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
  
  const evasion = defender.getEvasionWithWeather(weather);
  const effectiveAccuracy = accuracy / evasion;
  
  if (Math.random() * 100 >= effectiveAccuracy) {
    result.missed = true;
    return result;
  }
  
  let critRate = 0.0625;
  critRate *= getCritBoost(attacker.heldItem);
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
  
  let effectivePower = move.data.power;
  if (move.data.pursuit && defender.isSwitching) {
    effectivePower *= 2;
  }
  
  if (move.data.counter && attacker.damageTakenThisTurn > 0) {
    const canCounter = move.data.counter === 'any' ||
      (move.data.counter === 'physical' && attacker.lastIncomingMoveWasPhysical === true) ||
      (move.data.counter === 'special' && attacker.lastIncomingMoveWasPhysical === false);
    
    if (canCounter) {
      effectivePower = Math.floor(attacker.damageTakenThisTurn * (move.data.counterMult ?? 2));
    } else {
      result.missed = true;
      result.statusMessage = `${attacker.name}'s ${move.data.name} failed!`;
      return result;
    }
  }
  
  if (effectivePower <= 0 && move.data.power === 0) {
    result.missed = true;
    result.statusMessage = `${attacker.name}'s ${move.data.name} failed!`;
    return result;
  }
  
  let baseDamage = Math.floor(((2 * attacker.level / 5 + 2) * effectivePower * atk / def) / 50) + 2;
  
  let numHits = 1;
  if (move.data.hits) {
    const [minHits, maxHits] = move.data.hits;
    numHits = minHits + Math.floor(Math.random() * (maxHits - minHits + 1));
    result.hits = numHits;
  }
  
  let totalDamage = 0;
  let anyCritical = false;
  
  for (let hit = 0; hit < numHits; hit++) {
    let hitDamage = baseDamage;
    
    if (Math.random() < critRate) {
      hitDamage = Math.floor(hitDamage * 1.5);
      anyCritical = true;
    }
    
    hitDamage = Math.floor(hitDamage * result.effectiveness);
    
    const abilityMod = getAbilityDamageModifier(attacker, defender, move.data.type);
    hitDamage = Math.floor(hitDamage * abilityMod);
    
    if (weather) {
      if (weather === 'rain') {
        if (move.data.type === 'water') hitDamage = Math.floor(hitDamage * 1.5);
        if (move.data.type === 'fire') hitDamage = Math.floor(hitDamage * 0.5);
      }
      if (weather === 'sunny') {
        if (move.data.type === 'fire') hitDamage = Math.floor(hitDamage * 1.5);
        if (move.data.type === 'water') hitDamage = Math.floor(hitDamage * 0.5);
      }
    }
    
    if (attacker.species.types.includes(move.data.type)) {
      hitDamage = Math.floor(hitDamage * 1.5);
      if (attacker.ability?.effect === 'stab_boost') {
        hitDamage = Math.floor(hitDamage * 1.33);
      }
    }
    
    const itemBoost = getHeldItemDamageBoost(attacker.heldItem, move.data.type);
    if (itemBoost > 1) {
      hitDamage = Math.floor(hitDamage * itemBoost);
    }
    
    const superEffBoost = getSuperEffectiveBoost(attacker.heldItem, result.effectiveness);
    if (superEffBoost > 1) {
      hitDamage = Math.floor(hitDamage * superEffBoost);
    }
    
    const lifeOrbBoost = getLifeOrbBoost(attacker.heldItem);
    if (lifeOrbBoost > 1) {
      hitDamage = Math.floor(hitDamage * lifeOrbBoost);
    }
    
    hitDamage = Math.max(1, hitDamage);
    totalDamage += hitDamage;
  }
  
  result.critical = anyCritical;
  let damage = totalDamage;
  
  const sturdyCheck = checkSturdyAbility(defender, damage);
  if (sturdyCheck.survived) {
    damage = defender.hp - 1;
    result.statusMessage = sturdyCheck.message;
  }
  
  const focusSashResult = checkFocusSash(defender.heldItem, defender.hp, defender.maxHp, damage);
  if (focusSashResult.survived) {
    damage = defender.hp - 1;
    defender.heldItem = null;
    result.statusMessage = `${defender.name} hung on using its FOCUS SASH!`;
  }
  
  defender.hp = Math.max(0, defender.hp - damage);
  defender.damageTakenThisTurn += damage;
  defender.lastIncomingMoveWasPhysical = move.data.category === 'physical';
  result.damage = damage;
  
  if (getLifeOrbBoost(attacker.heldItem) > 1 && damage > 0) {
    const lifeOrbRecoil = getLifeOrbRecoil(attacker.heldItem, attacker.maxHp);
    attacker.hp = Math.max(0, attacker.hp - lifeOrbRecoil);
    result.recoilDamage = lifeOrbRecoil;
    result.recoilMessage = `${attacker.name} was hurt by its LIFE ORB!`;
  }

  if (move.data.drain && damage > 0) {
            const healAmount = Math.floor(damage * move.data.drain / 100);
            attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
            result.healed = healAmount;
            result.drainHeal = healAmount;
            result.drainMessage = `${attacker.name} restored HP!`;
        }

        if (move.data.recoil && damage > 0 && attacker.ability?.effect !== 'no_recoil') {
            const recoilDamage = Math.floor(damage * move.data.recoil / 100);
            attacker.hp = Math.max(0, attacker.hp - recoilDamage);
            result.recoilDamage = recoilDamage;
            result.recoilMessage = `${attacker.name} was hurt by recoil!`;
        }

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
                const lumResult = checkLumBerry(defender, move.data.statusEffect);
                if (lumResult.cured) {
                    result.statusMessage = lumResult.message;
                } else {
                    defender.status = move.data.statusEffect;
                    if (move.data.statusEffect === 'sleep') {
                        defender.sleepTurns = 1 + Math.floor(Math.random() * 2);
                    }
                }
            }
        }
        
        if (move.data.flinchChance && damage > 0 && Math.random() * 100 < move.data.flinchChance) {
            if (defender.ability?.effect !== 'no_flinch') {
                result.flinched = true;
            }
        }
        
        if (move.data.confuseChance && damage > 0 && !defender.confused && Math.random() * 100 < move.data.confuseChance) {
            defender.confused = true;
            defender.confuseTurns = 1 + Math.floor(Math.random() * 4);
            result.statusMessage = `${defender.name} became confused!`;
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

export interface EntryResult {
  message?: string;
}

export function checkEntryAbilities(entering: Pokemon, opponent: Pokemon): EntryResult | null {
  const ability = entering.ability;
  if (!ability || ability.trigger !== 'on_entry') return null;
  
  if (ability.effect === 'lower_atk') {
    if (opponent.atkStage > -6 && opponent.ability?.effect !== 'no_atk_down' && opponent.ability?.effect !== 'no_stat_down') {
      opponent.atkStage = Math.max(-6, opponent.atkStage - 1);
      return { message: `${entering.name}'s INTIMIDATE cut ${opponent.name}'s attack!` };
    }
  }
  
  return null;
}

export function checkTurnEndAbilities(mon: Pokemon): TurnEndResult | null {
  if (!mon.status || mon.hp <= 0) return null;
  
  if (mon.ability?.effect === 'status_heal_chance') {
    if (Math.random() < 0.3) {
      const oldStatus = mon.status;
      mon.status = null;
      mon.sleepTurns = 0;
      return {
        message: `${mon.name}'s SHED SKIN cured its ${oldStatus}!`,
        cured: true,
      };
    }
  }
  
  return null;
}

export interface HeldItemResult {
  message?: string;
  healed?: number;
}

export function checkTurnEndHeldItems(mon: Pokemon): HeldItemResult | null {
  if (mon.hp <= 0) return null;
  
  const healAmount = getLeftoversHeal(mon.heldItem, mon.maxHp);
  if (healAmount > 0 && mon.hp < mon.maxHp) {
    mon.hp = Math.min(mon.maxHp, mon.hp + healAmount);
    return {
      message: `${mon.name}'s LEFTOVERS restored HP!`,
      healed: healAmount,
    };
  }
  
  return null;
}

export function resetProtection(mon: Pokemon): void {
  if (!mon.protected) {
    mon.consecutiveProtect = 0;
  }
  mon.protected = false;
}

export function checkLumBerry(mon: Pokemon, status: StatusCondition): { cured: boolean; message?: string } {
  if (shouldCureStatus(mon.heldItem)) {
    mon.heldItem = null;
    return {
      cured: true,
      message: `${mon.name}'s LUM BERRY cured its ${status}!`,
    };
  }
  return { cured: false };
}
