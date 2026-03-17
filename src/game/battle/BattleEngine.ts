import { Pokemon, MoveInstance } from './Pokemon';
import { getTypeEffectiveness, MOVES, StatusCondition, TerrainType } from './data';
import type { PokemonType } from './data';
import type { WeatherType } from '../Weather';
import { getHeldItemDamageBoost, getCritBoost, getLeftoversHeal, shouldCureStatus, getSuperEffectiveBoost, getLifeOrbBoost, getLifeOrbRecoil, checkFocusSash, getContactDamage, hasGroundImmunityItem, getBlackSludgeHeal, setContextMaxHp, getSpeedBoost } from './HeldItems';

export interface FieldHazards {
  spikes: number;
  toxicSpikes: number;
  stealthRock: boolean;
}

export function createEmptyHazards(): FieldHazards {
  return { spikes: 0, toxicSpikes: 0, stealthRock: false };
}

export function applyEntryHazards(mon: Pokemon, hazards: FieldHazards): { damage: number; messages: string[]; toxic: boolean } {
  const result = { damage: 0, messages: [] as string[], toxic: false };
  
  if (mon.ability?.effect === 'no_indirect_damage') {
    return result;
  }
  
  const isFloating = mon.ability?.effect === 'ground_immune' || 
                     mon.species.types.includes('flying') ||
                     hasGroundImmunityItem(mon.heldItem);
  
  if (hazards.spikes > 0 && !isFloating) {
    const damagePerLayer = [0, 0.125, 0.167, 0.25];
    const dmg = Math.floor(mon.maxHp * damagePerLayer[hazards.spikes]);
    mon.hp = Math.max(0, mon.hp - dmg);
    result.damage += dmg;
    result.messages.push(`${mon.name} was hurt by the SPIKES!`);
  }
  
  if (hazards.stealthRock) {
    const types = mon.species.types;
    let multiplier = 1;
    for (const t of types) {
      const eff = getTypeEffectiveness('rock', [t]);
      multiplier *= eff;
    }
    const dmg = Math.floor(mon.maxHp * 0.125 * multiplier);
    mon.hp = Math.max(0, mon.hp - dmg);
    result.damage += dmg;
    if (dmg > 0) {
      result.messages.push(`${mon.name} was hurt by STEALTH ROCK!`);
    }
  }
  
  if (hazards.toxicSpikes > 0 && !mon.status) {
    const isImmune = mon.species.types.includes('poison') || 
                      mon.species.types.includes('steel') ||
                      mon.ability?.effect === 'poison_immune' ||
                      mon.isImmuneToStatus('poison');
    
    if (!isImmune) {
      if (hazards.toxicSpikes >= 2) {
        result.messages.push(`${mon.name} was badly poisoned by TOXIC SPIKES!`);
        mon.status = 'toxic';
      } else {
        result.messages.push(`${mon.name} was poisoned by TOXIC SPIKES!`);
        mon.status = 'poison';
      }
      result.toxic = true;
    } else if (mon.species.types.includes('poison')) {
      result.messages.push(`${mon.name} absorbed the TOXIC SPIKES!`);
    }
  }
  
  return result;
}

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
  hazardSet?: 'spikes' | 'stealth_rock' | 'toxic_spikes';
  hazardsCleared?: boolean;
  batonPass?: boolean;
  pivotSwitch?: boolean;
  rockyHelmetDamage?: number;
  airBalloonPopped?: boolean;
  substituteCreated?: boolean;
  substituteDamage?: number;
  substituteBroken?: boolean;
  trapped?: boolean;
  trapTurns?: number;
  disabled?: string;
  encored?: string;
  taunted?: boolean;
  infatuated?: boolean;
  infatuatedTarget?: string;
  phazed?: boolean;
  yawned?: boolean;
  wishActivated?: boolean;
  wishHeal?: number;
  preventedSwitch?: boolean;
  teamCured?: boolean;
  futureSightSet?: boolean;
  doomDesireSet?: boolean;
  destinyBondSet?: boolean;
  perishSongSet?: boolean;
  destinyBondTriggered?: boolean;
  perishSongCount?: number;
  terrainSet?: TerrainType;
  terrainTurns?: number;
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
  
  if (mon.infatuated) {
    if (Math.random() < 0.5) {
      return { canAct: false, message: `${mon.name} is in love and can't move!` };
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
  
  if (mon.ability?.effect === 'no_indirect_damage') return null;
  
  if (mon.status === 'poison') {
    const dmg = Math.max(1, Math.floor(mon.maxHp / 8));
    mon.hp = Math.max(0, mon.hp - dmg);
    return { damage: dmg, message: `${mon.name} is hurt by poison!` };
  }
  
  if (mon.status === 'toxic') {
    mon.toxicCounter = (mon.toxicCounter || 0) + 1;
    const dmg = Math.max(1, Math.floor(mon.maxHp * mon.toxicCounter / 16));
    mon.hp = Math.max(0, mon.hp - dmg);
    return { damage: dmg, message: `${mon.name} is hurt by toxic!` };
  }
  
  if (mon.status === 'burn') {
    const dmg = Math.max(1, Math.floor(mon.maxHp / 16));
    mon.hp = Math.max(0, mon.hp - dmg);
    return { damage: dmg, message: `${mon.name} is hurt by its burn!` };
  }
  
  return null;
}

export function determineTurnOrder(player: Pokemon, enemy: Pokemon, playerMove?: MoveInstance, enemyMove?: MoveInstance, weather?: WeatherType): 'player' | 'enemy' {
  let playerPriority = playerMove?.data.priority ?? 0;
  let enemyPriority = enemyMove?.data.priority ?? 0;
  
  if (player.ability?.effect === 'status_priority' && playerMove?.data.category === 'status') {
    playerPriority += 1;
  }
  if (enemy.ability?.effect === 'status_priority' && enemyMove?.data.category === 'status') {
    enemyPriority += 1;
  }
  
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
  
  if (ability.effect === 'attract_contact') {
    if (Math.random() < 0.3 && !attacker.infatuated && attacker.ability?.effect !== 'no_attract') {
      attacker.infatuated = true;
      attacker.infatuatedTarget = defender.speciesKey;
      return `${attacker.name} was infatuated by ${defender.name}'s CUTE CHARM!`;
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

function getAbilityDamageModifier(attacker: Pokemon, defender: Pokemon, moveType: PokemonType, movePower: number = 0, moveKey: string = ''): number {
  let modifier = 1;
  
  if (defender.ability?.effect === 'fire_ice_resist') {
    if (moveType === 'fire' || moveType === 'ice') {
      modifier *= 0.5;
    }
  }
  
  if (defender.ability?.effect === 'super_resist') {
    const effectiveness = getTypeEffectiveness(moveType, defender.species.types);
    if (effectiveness > 1) {
      modifier *= 0.75;
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
    
    if (attacker.ability.effect === 'technician' && movePower > 0 && movePower <= 60) {
      modifier *= 1.5;
    }
    
    if (attacker.ability.effect === 'punch_boost' && isPunchingMove(moveKey)) {
      modifier *= 1.2;
    }
    
    if (attacker.ability.effect === 'recoil_boost' && movePower > 0) {
      modifier *= 1.2;
    }
  }
  
  if (attacker.flashFireBoost && moveType === 'fire') {
    modifier *= 1.5;
  }
  
  return modifier;
}

const PUNCHING_MOVES = new Set([
  'machPunch', 'thunderPunch', 'fireFang', 'icePunch', 'megaPunch',
  'dynamicPunch', 'cometPunch', 'firePunch'
]);

function isPunchingMove(moveKey: string): boolean {
  return PUNCHING_MOVES.has(moveKey);
}

export function getTerrainDamageModifier(attacker: Pokemon, moveType: PokemonType, terrain: TerrainType): number {
  if (terrain === 'none') return 1;
  
  const isGrounded = !attacker.species.types.includes('flying') && 
                     attacker.ability?.effect !== 'ground_immune' &&
                     !hasGroundImmunityItem(attacker.heldItem);
  
  if (!isGrounded) return 1;
  
  if (terrain === 'electric' && moveType === 'electric') return 1.5;
  if (terrain === 'psychic' && moveType === 'psychic') return 1.5;
  if (terrain === 'grassy' && moveType === 'grass') return 1.5;
  if (terrain === 'misty' && moveType === 'dragon') return 0.5;
  
  return 1;
}

export function isImmuneToStatusInTerrain(mon: Pokemon, statusType: 'sleep' | 'all', terrain: TerrainType): boolean {
  if (terrain === 'none') return false;
  
  const isGrounded = !mon.species.types.includes('flying') && 
                     mon.ability?.effect !== 'ground_immune' &&
                     !hasGroundImmunityItem(mon.heldItem);
  
  if (!isGrounded) return false;
  
  if (terrain === 'electric' && statusType === 'sleep') return true;
  if (terrain === 'misty' && statusType === 'all') return true;
  if (terrain === 'grassy' && mon.ability?.effect === 'grassy_terrain_status_immune') return true;
  
  return false;
}

export function getTerrainHeal(mon: Pokemon, terrain: TerrainType): number {
  if (terrain !== 'grassy') return 0;
  
  const isGrounded = !mon.species.types.includes('flying') && 
                     mon.ability?.effect !== 'ground_immune' &&
                     !hasGroundImmunityItem(mon.heldItem);
  
  if (!isGrounded) return 0;
  
  return Math.floor(mon.maxHp / 16);
}

export function getTerrainSpeedBoost(mon: Pokemon, terrain: TerrainType): number {
  if (terrain === 'electric' && mon.ability?.effect === 'electric_terrain_speed') {
    return 2;
  }
  return 1;
}

export function getTerrainDefenseBoost(mon: Pokemon, terrain: TerrainType): number {
  if (terrain === 'grassy' && mon.ability?.effect === 'grassy_terrain_defense') {
    return 1.5;
  }
  return 1;
}

export function blocksPriorityMoves(terrain: TerrainType, defender: Pokemon): boolean {
  if (terrain !== 'psychic') return false;
  
  const isGrounded = !defender.species.types.includes('flying') && 
                     defender.ability?.effect !== 'ground_immune' &&
                     !hasGroundImmunityItem(defender.heldItem);
  
  return isGrounded;
}

export function executeMove(attacker: Pokemon, defender: Pokemon, move: MoveInstance, weather?: WeatherType, terrain: TerrainType = 'none'): TurnResult {
  move.pp = Math.max(0, move.pp - 1);
  
  const result: TurnResult = {
    damage: 0,
    effectiveness: 1,
    missed: false,
    critical: false,
  };
  
  if (move.data.category === 'status') {
    if (defender.ability?.effect === 'reflect_status') {
      const bouncerName = defender.name;
      const temp = attacker;
      attacker = defender;
      defender = temp;
      result.statusMessage = `${bouncerName}'s MAGIC BOUNCE reflected the move!`;
    }
    
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
    } else if (effect === 'spikes') {
      result.statusMessage = `SPIKES were scattered around the opposing team!`;
      result.hazardSet = 'spikes';
    } else if (effect === 'stealth_rock') {
      result.statusMessage = `Pointed stones float around ${defender.name}!`;
      result.hazardSet = 'stealth_rock';
    } else if (effect === 'toxic_spikes') {
      result.statusMessage = `TOXIC SPIKES were scattered around the opposing team!`;
      result.hazardSet = 'toxic_spikes';
    } else if (effect === 'clear_hazards') {
      result.statusMessage = `${attacker.name} blew away the hazards!`;
      result.hazardsCleared = true;
    } else if (effect === 'baton_pass') {
      result.statusMessage = `${attacker.name} used BATON PASS!`;
      result.batonPass = true;
    } else if (effect === 'u_turn') {
      result.pivotSwitch = true;
    } else if (effect === 'substitute') {
      if (attacker.substituteHp > 0) {
        result.statusMessage = `${attacker.name} already has a SUBSTITUTE!`;
      } else if (attacker.hp <= Math.floor(attacker.maxHp * 0.25)) {
        result.statusMessage = `${attacker.name} is too weak to make a SUBSTITUTE!`;
      } else {
        const subHp = Math.floor(attacker.maxHp * 0.25);
        attacker.hp -= subHp;
        attacker.substituteHp = subHp;
        result.substituteCreated = true;
        result.statusMessage = `${attacker.name} created a SUBSTITUTE!`;
      }
    } else if (effect === 'disable') {
      if (defender.lastUsedMove) {
        defender.disabledMove = defender.lastUsedMove;
        defender.disabledTurns = 4;
        result.disabled = defender.lastUsedMove;
        const moveData = MOVES[defender.lastUsedMove];
        result.statusMessage = `${defender.name}'s ${moveData?.name ?? 'move'} was DISABLED!`;
      } else {
        result.statusMessage = `But it failed!`;
      }
    } else if (effect === 'encore') {
      if (defender.lastUsedMove && defender.moves.some(m => m.key === defender.lastUsedMove)) {
        defender.encoredMove = defender.lastUsedMove;
        defender.encoreTurns = 3;
        result.encored = defender.lastUsedMove;
        const moveData = MOVES[defender.lastUsedMove];
        result.statusMessage = `${defender.name} received an ENCORE for ${moveData?.name ?? 'its move'}!`;
      } else {
        result.statusMessage = `But it failed!`;
      }
    } else if (effect === 'taunt') {
      defender.taunted = true;
      defender.tauntTurns = 3;
      result.taunted = true;
      result.statusMessage = `${defender.name} fell for the TAUNT!`;
    } else if (effect === 'attract') {
      if (defender.ability?.effect === 'no_attract') {
        result.statusMessage = `${defender.name}'s OBLIVIOUS prevented infatuation!`;
      } else if (!defender.infatuated) {
        defender.infatuated = true;
        defender.infatuatedTarget = attacker.speciesKey;
        result.infatuated = true;
        result.infatuatedTarget = attacker.name;
        result.statusMessage = `${defender.name} fell in love with ${attacker.name}!`;
      } else {
        result.statusMessage = `${defender.name} is already in love!`;
      }
    } else if (effect === 'phaze') {
      result.phazed = true;
      result.statusMessage = `${defender.name} was blown away!`;
    } else if (effect === 'yawn') {
      if (!defender.status && !defender.drowsy) {
        defender.drowsy = true;
        result.yawned = true;
        result.statusMessage = `${defender.name} grew drowsy!`;
      } else {
        result.statusMessage = `But it failed!`;
      }
    } else if (effect === 'wish') {
      attacker.wishTurns = 2;
      attacker.wishHealAmount = Math.floor(attacker.maxHp * 0.5);
      result.statusMessage = `${attacker.name} made a wish!`;
    } else if (effect === 'prevent_switch') {
      defender.cantSwitch = true;
      result.preventedSwitch = true;
      result.statusMessage = `${defender.name} can no longer escape!`;
    } else if (effect === 'team_cure') {
      result.teamCured = true;
      result.statusMessage = `A bell chimed! The team's status conditions were cured!`;
    } else if (effect === 'future_sight') {
      attacker.futureSightTurns = 3;
      attacker.futureSightDamage = calculateFutureSightDamage(attacker, move);
      attacker.futureSightAttacker = attacker.speciesKey;
      result.futureSightSet = true;
      result.statusMessage = `${attacker.name} foresaw an attack!`;
    } else if (effect === 'doom_desire') {
      attacker.doomDesireTurns = 3;
      attacker.doomDesireDamage = calculateDoomDesireDamage(attacker, move);
      attacker.doomDesireAttacker = attacker.speciesKey;
      result.doomDesireSet = true;
      result.statusMessage = `${attacker.name} chose doom for its foe!`;
    } else if (effect === 'destiny_bond') {
      attacker.destinyBond = true;
      result.destinyBondSet = true;
      result.statusMessage = `${attacker.name} is trying to take its foe down with it!`;
    } else if (effect === 'perish_song') {
      attacker.perishSongTurns = 4;
      defender.perishSongTurns = 4;
      result.perishSongSet = true;
      result.perishSongCount = 4;
      result.statusMessage = `A PERISH SONG! All Pokemon will faint in 3 turns!`;
    } else if (effect === 'electric_terrain') {
      result.terrainSet = 'electric';
      result.terrainTurns = 5;
      result.statusMessage = `An electric current runs across the battlefield!`;
    } else if (effect === 'psychic_terrain') {
      result.terrainSet = 'psychic';
      result.terrainTurns = 5;
      result.statusMessage = `The battlefield got weird!`;
    } else if (effect === 'grassy_terrain') {
      result.terrainSet = 'grassy';
      result.terrainTurns = 5;
      result.statusMessage = `Grass grew to cover the battlefield!`;
    } else if (effect === 'misty_terrain') {
      result.terrainSet = 'misty';
      result.terrainTurns = 5;
      result.statusMessage = `Mist swirled around the battlefield!`;
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
    
    const abilityMod = getAbilityDamageModifier(attacker, defender, move.data.type, move.data.power, move.key);
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
    
    const terrainMod = getTerrainDamageModifier(attacker, move.data.type, terrain);
    if (terrainMod !== 1) {
      hitDamage = Math.floor(hitDamage * terrainMod);
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
  
  if (defender.substituteHp > 0) {
    const subDamage = Math.min(defender.substituteHp, damage);
    defender.substituteHp -= subDamage;
    result.substituteDamage = subDamage;
    if (defender.substituteHp <= 0) {
      defender.substituteHp = 0;
      result.substituteBroken = true;
      result.statusMessage = `${defender.name}'s SUBSTITUTE broke!`;
    } else {
      result.statusMessage = `The SUBSTITUTE took damage!`;
    }
    damage = 0;
  }
  
  defender.hp = Math.max(0, defender.hp - damage);
  defender.damageTakenThisTurn += damage;
  defender.lastIncomingMoveWasPhysical = move.data.category === 'physical';
  result.damage = damage;
  
  if (getLifeOrbBoost(attacker.heldItem) > 1 && damage > 0) {
    const lifeOrbRecoil = getLifeOrbRecoil(attacker.heldItem);
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
        
        setContextMaxHp(attacker.maxHp);
        const rockyHelmetDmg = getContactDamage(defender.heldItem);
        if (rockyHelmetDmg > 0 && damage > 0 && move.data.category === 'physical') {
            attacker.hp = Math.max(0, attacker.hp - rockyHelmetDmg);
            result.rockyHelmetDamage = rockyHelmetDmg;
            result.heldItemMessage = `${attacker.name} was hurt by ${defender.name}'s ROCKY HELMET!`;
        }
        
        if (defender.heldItem?.effect === 'ground_immune' && damage > 0) {
            defender.heldItem = null;
            result.airBalloonPopped = true;
            if (!result.heldItemMessage) {
                result.heldItemMessage = `${defender.name}'s AIR BALLOON popped!`;
            } else {
                result.heldItemMessage += ` ${defender.name}'s AIR BALLOON popped!`;
            }
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
        
        if (move.data.effect === 'trap' && damage > 0 && !defender.trapped) {
            const [minTurns, maxTurns] = move.data.trapTurns ?? [4, 5];
            defender.trapped = true;
            defender.trappedTurns = minTurns + Math.floor(Math.random() * (maxTurns - minTurns + 1));
            defender.trappedBy = move.data.name;
            result.trapped = true;
            result.trapTurns = defender.trappedTurns;
            result.statusMessage = `${defender.name} was trapped by ${move.data.name}!`;
        }
        
        attacker.lastUsedMove = move.key;
        
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
  
  setContextMaxHp(mon.maxHp);
  const healAmount = getLeftoversHeal(mon.heldItem);
  if (healAmount > 0 && mon.hp < mon.maxHp) {
    mon.hp = Math.min(mon.maxHp, mon.hp + healAmount);
    return {
      message: `${mon.name}'s LEFTOVERS restored HP!`,
      healed: healAmount,
    };
  }
  
  const sludge = getBlackSludgeHeal(mon.heldItem, mon.maxHp, mon.species.types.includes('poison'));
  if (sludge.heal > 0 && mon.hp < mon.maxHp) {
    mon.hp = Math.min(mon.maxHp, mon.hp + sludge.heal);
    return {
      message: `${mon.name}'s BLACK SLUDGE restored HP!`,
      healed: sludge.heal,
    };
  } else if (sludge.damage > 0) {
    mon.hp = Math.max(0, mon.hp - sludge.damage);
    return {
      message: `${mon.name} was hurt by BLACK SLUDGE!`,
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

export interface TrapResult {
  damage: number;
  message?: string;
  freed?: boolean;
}

export function checkTrappingDamage(mon: Pokemon): TrapResult | null {
  if (!mon.trapped || mon.trappedTurns <= 0) return null;
  
  if (mon.ability?.effect === 'no_indirect_damage') {
    mon.trappedTurns--;
    if (mon.trappedTurns <= 0) {
      mon.trapped = false;
      mon.trappedBy = null;
      return { damage: 0, freed: true, message: `${mon.name} was freed from ${mon.trappedBy ?? 'the trap'}!` };
    }
    return null;
  }
  
  const damage = Math.max(1, Math.floor(mon.maxHp / 16));
  mon.hp = Math.max(0, mon.hp - damage);
  mon.trappedTurns--;
  
  if (mon.trappedTurns <= 0) {
    const trapName = mon.trappedBy ?? 'the trap';
    mon.trapped = false;
    mon.trappedBy = null;
    return { damage, freed: true, message: `${mon.name} was freed from ${trapName}!` };
  }
  
  return { damage, message: `${mon.name} is hurt by ${mon.trappedBy ?? 'the trap'}!` };
}

export interface MoveRestrictionResult {
  canUse: boolean;
  message?: string;
}

export function canUseMove(mon: Pokemon, move: MoveInstance): MoveRestrictionResult {
  if (mon.disabledMove && mon.disabledMove === move.key && mon.disabledTurns > 0) {
    const moveData = MOVES[move.key];
    return { canUse: false, message: `${moveData?.name ?? 'The move'} is DISABLED!` };
  }
  
  if (mon.encoredMove && mon.encoreTurns > 0) {
    if (move.key !== mon.encoredMove) {
      const encoredMoveData = MOVES[mon.encoredMove];
      return { canUse: false, message: `${mon.name} must use ${encoredMoveData?.name ?? 'the encored move'}!` };
    }
  }
  
  if (mon.taunted && mon.tauntTurns > 0 && move.data.category === 'status') {
    return { canUse: false, message: `${mon.name} can't use ${move.data.name} because of the TAUNT!` };
  }
  
  return { canUse: true };
}

export function decrementTurnCounters(mon: Pokemon): void {
  if (mon.disabledTurns > 0) {
    mon.disabledTurns--;
    if (mon.disabledTurns <= 0) {
      mon.disabledMove = null;
    }
  }
  
  if (mon.encoreTurns > 0) {
    mon.encoreTurns--;
    if (mon.encoreTurns <= 0) {
      mon.encoredMove = null;
    }
  }
  
  if (mon.tauntTurns > 0) {
    mon.tauntTurns--;
    if (mon.tauntTurns <= 0) {
      mon.taunted = false;
    }
  }
  
  if (mon.wishTurns > 0) {
    mon.wishTurns--;
  }
}

export interface DrowsyResult {
  fellAsleep: boolean;
  message?: string;
}

export function checkDrowsy(mon: Pokemon): DrowsyResult {
  if (mon.drowsy && !mon.status) {
    mon.drowsy = false;
    mon.status = 'sleep';
    mon.sleepTurns = 2 + Math.floor(Math.random() * 2);
    return { fellAsleep: true, message: `${mon.name} fell asleep!` };
  }
  return { fellAsleep: false };
}

export interface WishResult {
  healed: number;
  message?: string;
}

export function checkWish(mon: Pokemon): WishResult {
  if (mon.wishTurns === 0 && mon.wishHealAmount > 0) {
    const healAmount = Math.min(mon.wishHealAmount, mon.maxHp - mon.hp);
    mon.hp = Math.min(mon.maxHp, mon.hp + healAmount);
    mon.wishHealAmount = 0;
    return { healed: healAmount, message: `${mon.name}'s wish came true!` };
  }
  return { healed: 0 };
}

function calculateFutureSightDamage(attacker: Pokemon, move: MoveInstance): number {
  const power = move.data.power || 120;
  const atk = attacker.getEffAtk();
  const def = attacker.getEffDef();
  return Math.floor(((2 * attacker.level / 5 + 2) * power * atk / def) / 50) + 2;
}

function calculateDoomDesireDamage(attacker: Pokemon, move: MoveInstance): number {
  const power = move.data.power || 140;
  const atk = attacker.getEffAtk();
  const def = attacker.getEffDef();
  return Math.floor(((2 * attacker.level / 5 + 2) * power * atk / def) / 50) + 2;
}

export interface DelayedAttackResult {
  damage: number;
  message?: string;
  attackerName?: string;
}

export function checkFutureSight(mon: Pokemon): DelayedAttackResult {
  if (mon.futureSightTurns > 0) {
    mon.futureSightTurns--;
    if (mon.futureSightTurns === 0 && mon.futureSightDamage > 0) {
      const damage = Math.min(mon.futureSightDamage, mon.hp);
      mon.hp = Math.max(0, mon.hp - damage);
      const storedDamage = mon.futureSightDamage;
      mon.futureSightDamage = 0;
      mon.futureSightAttacker = null;
      return { damage: storedDamage, message: `The future attack hit ${mon.name}!`, attackerName: mon.futureSightAttacker ?? 'Unknown' };
    }
  }
  return { damage: 0 };
}

export function checkDoomDesire(mon: Pokemon): DelayedAttackResult {
  if (mon.doomDesireTurns > 0) {
    mon.doomDesireTurns--;
    if (mon.doomDesireTurns === 0 && mon.doomDesireDamage > 0) {
      const damage = Math.min(mon.doomDesireDamage, mon.hp);
      mon.hp = Math.max(0, mon.hp - damage);
      const storedDamage = mon.doomDesireDamage;
      mon.doomDesireDamage = 0;
      mon.doomDesireAttacker = null;
      return { damage: storedDamage, message: `DOOM DESIRE struck ${mon.name}!`, attackerName: mon.doomDesireAttacker ?? 'Unknown' };
    }
  }
  return { damage: 0 };
}

export interface DestinyBondResult {
  triggered: boolean;
  message?: string;
}

export function checkDestinyBond(fainted: Pokemon, attacker: Pokemon): DestinyBondResult {
  if (fainted.destinyBond && fainted.hp <= 0) {
    attacker.hp = 0;
    fainted.destinyBond = false;
    return { triggered: true, message: `${fainted.name} took ${attacker.name} down with it!` };
  }
  return { triggered: false };
}

export interface PerishSongResult {
  count?: number;
  fainted?: boolean;
  message?: string;
}

export function checkPerishSong(mon: Pokemon): PerishSongResult {
  if (mon.perishSongTurns > 0) {
    mon.perishSongTurns--;
    if (mon.perishSongTurns === 0) {
      mon.hp = 0;
      return { count: 0, fainted: true, message: `${mon.name}'s PERISH SONG count ended!` };
    }
    return { count: mon.perishSongTurns };
  }
  return {};
}
