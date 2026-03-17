import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { SFX, Music } from '@/engine/Audio';
import { Pokemon, MoveInstance } from './Pokemon';
import { BattleUI, DamageNumber, DamageNumbers, StatusParticle, StatusParticles, HealParticle, HealParticles, StatChangeText, StatChangeHelper } from './BattleUI';
import { drawPokemonFront, drawPokemonBack } from './sprites';
import { executeMove, getEnemyMove, determineTurnOrder, attemptCatch, canAct, applyStatusDamage, checkEntryAbilities, checkTurnEndAbilities, checkTurnEndHeldItems, resetProtection, createEmptyHazards, applyEntryHazards, FieldHazards, checkTrappingDamage, canUseMove, decrementTurnCounters, checkDrowsy, checkWish, checkFutureSight, checkDoomDesire, checkDestinyBond, checkPerishSong, getTerrainHeal } from './BattleEngine';
import { calculateExpGain, ITEMS, MOVES, TRAINERS, TrainerData, PokemonType, StatusCondition, TerrainType, TYPE_COLORS } from './data';
import { isZCrystal, getZCrystalType } from './HeldItems';
import { GameState, Inventory } from '../GameState';
import type { WeatherType } from '../Weather';

type Phase =
  | 'intro' | 'message' | 'action' | 'moves'
  | 'animating' | 'result'
  | 'bag' | 'party'
  | 'catching' | 'exp'
  | 'evolving' | 'learnMove';

export class BattleScene implements Scene {
  private input: Input;
  private gameState: GameState;
  private playerMon: Pokemon;
  private enemyMon: Pokemon;
  private onEnd: (won: boolean) => void;

  // Trainer battle info
  private isTrainerBattle = false;
  private trainerData: TrainerData | null = null;
  private trainerTeam: Pokemon[] = [];
  private trainerTeamIndex = 0;

  // Phase state
  private phase: Phase = 'intro';
  private cursor = 0;

  // Intro animation
  private introTimer = 0;
  private shinySparkled = false;
  private playerCryPlayed = false;
  private enemyCryPlayed = false;
  private shinyParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }> = [];

  // Message system
  private msgText = '';
  private msgCharIdx = 0;
  private msgCallback: (() => void) | null = null;
  private msgQueue: Array<{ text: string; done?: () => void }> = [];

  // Attack animation
  private anim = { active: false, isPlayer: true, timer: 0, done: () => {}, moveType: 'normal' as PokemonType, critical: false };

  // HP display (for smooth animation)
  private playerDisplayHp: number;
  private enemyDisplayHp: number;

  // EXP display (for smooth animation)
  private playerDisplayExp: number;

  // Result
  private battleWon = false;
  private resultTimer = 0;

  // Sprite positions (for animations)
  private playerSpriteX = 40;
  private enemySpriteX = 210;
  private playerVisible = true;
  private enemyVisible = true;

  // Flash overlay
  private flashAlpha = 0;

  // Screen shake
  private screenShake = 0;

  // Damage numbers
  private damageNumbers: DamageNumber[] = [];
  
  // Status particles
  private statusParticles: StatusParticle[] = [];

  // Heal particles
  private healParticles: HealParticle[] = [];

  // Stat change text
  private statChangeTexts: StatChangeText[] = [];

  // Weather effects
  private weather: WeatherType = 'clear';
  private weatherParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }> = [];
  private weatherTimer = 0;

  // Terrain effects
  private terrain: TerrainType = 'none';
  private terrainTurns = 0;
  private terrainParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string }> = [];

  // Catch animation state
  private catchTimer = 0;
  private catchShakes = 0;
  private catchTargetShakes = 0;
  private catchCaught = false;
  private catchBallX = 0;
  private catchBallY = 0;

  // Bag menu state
  private bagItems: Array<{ key: keyof Inventory; count: number }> = [];

  // Party tracking — which team index is active
  private activeTeamIndex = 0;

  // Evolution state
  private evolveTimer = 0;
  private evolvingMon: Pokemon | null = null;

  // Move learning state
  private learnMoveMon: Pokemon | null = null;
  private learnMoveKey: string = '';
  private learnMovePendingQueue: Array<{ mon: Pokemon; moveKey: string }> = [];
  private learnMoveConfirm = false; // true = asking "forget which move?"

  // Flinch state for current turn
  private playerFlinched = false;
  private enemyFlinched = false;

  // Entry hazards
  private playerHazards: FieldHazards = createEmptyHazards();
  private enemyHazards: FieldHazards = createEmptyHazards();
  
  // Z-Move state
  private zMoveActive = false;
  private zMoveTimer = 0;
  private zMoveParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string; angle: number }> = [];
  private zMoveFlashAlpha = 0;

  private applyHazardsOnEntry(mon: Pokemon, isPlayer: boolean): string[] {
    const hazards = isPlayer ? this.playerHazards : this.enemyHazards;
    const result = applyEntryHazards(mon, hazards);
    if (result.damage > 0) {
      if (isPlayer) {
        this.playerDisplayHp = this.playerMon.hp;
      } else {
        this.enemyDisplayHp = this.enemyMon.hp;
      }
    }
    return result.messages;
  }

  constructor(input: Input, gameState: GameState, enemyMon: Pokemon, onEnd: (won: boolean) => void, trainerId?: string) {
    this.input = input;
    this.gameState = gameState;
    this.playerMon = gameState.leadPokemon!;
    this.enemyMon = enemyMon;
    this.onEnd = onEnd;
    this.playerDisplayHp = this.playerMon.hp;
    this.enemyDisplayHp = enemyMon.hp;
    this.playerDisplayExp = this.playerMon.expPercent;
    this.activeTeamIndex = 0;

    // Set up trainer battle
    if (trainerId && TRAINERS[trainerId]) {
      this.isTrainerBattle = true;
      this.trainerData = TRAINERS[trainerId];
      const badgeCount = gameState.badges.size;
      this.trainerTeam = this.trainerData.team.map((t) => new Pokemon(t.species, t.level, badgeCount));
      this.trainerTeamIndex = 0;
      this.enemyMon = this.trainerTeam[0];
      this.enemyDisplayHp = this.enemyMon.hp;
    }

    // Track Pokemon seen in pokedex
    gameState.pokedexSeen.add(this.enemyMon.speciesKey);
  }

  onEnter() {
    this.input.clear();
    this.phase = 'intro';
    this.introTimer = 0;
    if (this.trainerData?.isChampion) {
      Music.champion();
    } else if (this.trainerData?.isGymLeader) {
      Music.gymBattle();
    } else {
      Music.battle();
    }
  }

  // ── Message helpers ──

  private queueMessages(texts: string[], finalCallback?: () => void) {
    for (let i = 0; i < texts.length; i++) {
      this.msgQueue.push({
        text: texts[i],
        done: i === texts.length - 1 ? finalCallback : undefined,
      });
    }
    this.nextMessage();
  }

  private nextMessage() {
    if (this.msgQueue.length === 0) return;
    const msg = this.msgQueue.shift()!;
    this.msgText = msg.text;
    this.msgCharIdx = 0;
    this.msgCallback = msg.done ?? null;
    this.phase = 'message';
  }

  // ── Update ──

  update(dt: number) {
    // Animate HP bars toward actual values
    this.playerDisplayHp = this.lerpHp(this.playerDisplayHp, this.playerMon.hp, dt);
    this.enemyDisplayHp = this.lerpHp(this.enemyDisplayHp, this.enemyMon.hp, dt);

    // Animate EXP bar
    const targetExp = this.playerMon.expPercent;
    if (Math.abs(this.playerDisplayExp - targetExp) > 0.005) {
      this.playerDisplayExp += (targetExp > this.playerDisplayExp ? 1 : -1) * dt * 0.8;
      if ((targetExp > this.playerDisplayExp) === (this.playerDisplayExp >= targetExp)) {
        this.playerDisplayExp = targetExp;
      }
    } else {
      this.playerDisplayExp = targetExp;
    }

    // Decay screen shake
    if (this.screenShake > 0) {
      this.screenShake *= 0.85;
      if (this.screenShake < 0.5) this.screenShake = 0;
    }

    // Update damage numbers
    for (const dn of this.damageNumbers) {
      DamageNumbers.update(dn, dt);
    }
    this.damageNumbers = this.damageNumbers.filter(dn => dn.timer < dn.maxTimer);

    // Update status particles
    StatusParticles.update(this.statusParticles, dt);
    this.statusParticles = this.statusParticles.filter(p => p.life > 0);

    // Update heal particles
    HealParticles.update(this.healParticles, dt);
    this.healParticles = this.healParticles.filter(p => p.life > 0);

    // Update stat change text
    for (const sct of this.statChangeTexts) {
      StatChangeHelper.update(sct, dt);
    }
    this.statChangeTexts = this.statChangeTexts.filter(sct => sct.timer < sct.maxTimer);

    // Update weather particles
    this.updateWeatherParticles(dt);
    
    // Update terrain particles
    this.updateTerrainParticles(dt);
    
    // Update Z-Move particles
    this.updateZMoveParticles(dt);

    // Spawn status particles for Pokemon with status conditions
    if (this.playerMon.status && this.phase !== 'intro' && Math.random() < dt * 2) {
      const particles = StatusParticles.create(this.playerMon.status);
      for (const p of particles) {
        p.x = this.playerSpriteX + 20 + Math.random() * 40;
        p.y = 80 + Math.random() * 30;
      }
      this.statusParticles.push(...particles);
    }
    if (this.enemyMon.status && this.phase !== 'intro' && Math.random() < dt * 2) {
      const particles = StatusParticles.create(this.enemyMon.status);
      for (const p of particles) {
        p.x = this.enemySpriteX + Math.random() * 50;
        p.y = 20 + Math.random() * 30;
      }
      this.statusParticles.push(...particles);
    }
    
    // Spawn confusion particles
    if (this.playerMon.confused && this.phase !== 'intro' && Math.random() < dt * 3) {
      for (let i = 0; i < 3; i++) {
        this.statusParticles.push({
          x: this.playerSpriteX + 20 + Math.random() * 50,
          y: 60 + Math.random() * 40,
          vx: (Math.random() - 0.5) * 30,
          vy: -20 - Math.random() * 20,
          life: 0.6 + Math.random() * 0.3,
          maxLife: 0.6 + Math.random() * 0.3,
          size: 3 + Math.random() * 3,
          color: '#f8d830',
          type: 'confusion',
        });
      }
    }
    if (this.enemyMon.confused && this.phase !== 'intro' && Math.random() < dt * 3) {
      for (let i = 0; i < 3; i++) {
        this.statusParticles.push({
          x: this.enemySpriteX + Math.random() * 50,
          y: 15 + Math.random() * 35,
          vx: (Math.random() - 0.5) * 30,
          vy: -20 - Math.random() * 20,
          life: 0.6 + Math.random() * 0.3,
          maxLife: 0.6 + Math.random() * 0.3,
          size: 3 + Math.random() * 3,
          color: '#f8d830',
          type: 'confusion',
        });
      }
    }

    switch (this.phase) {
      case 'intro': this.updateIntro(dt); break;
      case 'message': this.updateMessage(); break;
      case 'action': this.updateAction(); break;
      case 'moves': this.updateMoves(); break;
      case 'animating': this.updateAnimating(dt); break;
      case 'result': this.updateResult(); break;
      case 'bag': this.updateBag(); break;
      case 'party': this.updateParty(); break;
      case 'catching': this.updateCatching(dt); break;
      case 'evolving': this.updateEvolving(dt); break;
      case 'learnMove': this.updateLearnMove(); break;
      case 'exp': break;
    }
  }

  private lerpHp(display: number, target: number, dt: number): number {
    if (Math.abs(display - target) < 0.5) return target;
    const speed = this.playerMon.maxHp * 0.8;
    if (display > target) return Math.max(target, display - speed * dt);
    return Math.min(target, display + speed * dt);
  }

  setWeather(weather: WeatherType) {
    this.weather = weather;
    this.weatherParticles = [];
  }

  private updateWeatherParticles(dt: number) {
    if (this.weather === 'clear') return;
    
    this.weatherTimer += dt;
    
    const targetCount = this.weather === 'rain' ? 60 : this.weather === 'hail' ? 30 : this.weather === 'sandstorm' ? 40 : 20;
    
    while (this.weatherParticles.length < targetCount) {
      this.spawnWeatherParticle();
    }
    
    for (const p of this.weatherParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    
    this.weatherParticles = this.weatherParticles.filter(p => p.life > 0 && p.y < 200 && p.x < 340);
  }

  private spawnWeatherParticle() {
    switch (this.weather) {
      case 'rain':
        this.weatherParticles.push({
          x: Math.random() * 320,
          y: -10,
          vx: -20,
          vy: 250 + Math.random() * 100,
          life: 1.5 + Math.random(),
          maxLife: 1.5 + Math.random(),
          size: 2 + Math.random() * 2,
        });
        break;
      case 'hail':
        this.weatherParticles.push({
          x: Math.random() * 320,
          y: -10,
          vx: -15,
          vy: 120 + Math.random() * 50,
          life: 2 + Math.random(),
          maxLife: 2 + Math.random(),
          size: 3 + Math.random() * 3,
        });
        break;
      case 'sandstorm':
        this.weatherParticles.push({
          x: -10,
          y: Math.random() * 150,
          vx: 180 + Math.random() * 80,
          vy: Math.sin(this.weatherTimer * 2) * 15,
          life: 1.2 + Math.random(),
          maxLife: 1.2 + Math.random(),
          size: 2 + Math.random() * 2,
        });
        break;
      case 'sunny':
        this.weatherParticles.push({
          x: Math.random() * 320,
          y: Math.random() * 150,
          vx: 0,
          vy: -8,
          life: 0.8 + Math.random(),
          maxLife: 0.8 + Math.random(),
          size: 3 + Math.random() * 4,
        });
        break;
      case 'fog':
        this.weatherParticles.push({
          x: Math.random() * 320,
          y: Math.random() * 150,
          vx: 8 + Math.random() * 15,
          vy: Math.sin(this.weatherTimer + Math.random()) * 3,
          life: 3 + Math.random() * 2,
          maxLife: 3 + Math.random() * 2,
          size: 25 + Math.random() * 35,
        });
        break;
    }
  }

  private renderWeather(ctx: CanvasRenderingContext2D) {
    if (this.weather === 'clear') return;
    
    for (const p of this.weatherParticles) {
      const alpha = Math.min(1, p.life / p.maxLife);
      
      switch (this.weather) {
        case 'rain':
          ctx.strokeStyle = `rgba(140, 170, 210, ${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 0.015, p.y + p.vy * 0.015);
          ctx.stroke();
          break;
        case 'hail':
          ctx.fillStyle = `rgba(190, 210, 240, ${alpha * 0.7})`;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          break;
        case 'sandstorm':
          ctx.fillStyle = `rgba(200, 170, 130, ${alpha * 0.4})`;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          break;
        case 'sunny':
          ctx.fillStyle = `rgba(255, 235, 170, ${alpha * 0.35})`;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          break;
        case 'fog':
          ctx.fillStyle = `rgba(190, 190, 200, ${alpha * 0.12})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    }
    
    if (this.weather === 'sunny') {
      ctx.fillStyle = 'rgba(255, 235, 190, 0.06)';
      ctx.fillRect(0, 0, 320, 156);
    } else if (this.weather === 'fog') {
      ctx.fillStyle = 'rgba(170, 170, 180, 0.12)';
      ctx.fillRect(0, 0, 320, 156);
    } else if (this.weather === 'sandstorm') {
      ctx.fillStyle = 'rgba(200, 170, 130, 0.08)';
      ctx.fillRect(0, 0, 320, 156);
    }
  }

  private updateTerrainParticles(dt: number) {
    if (this.terrain === 'none') return;
    
    const targetCount = 25;
    while (this.terrainParticles.length < targetCount) {
      this.spawnTerrainParticle();
    }
    
    for (const p of this.terrainParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    
    this.terrainParticles = this.terrainParticles.filter(p => p.life > 0 && p.y < 200);
  }

  private spawnTerrainParticle() {
    switch (this.terrain) {
      case 'electric':
        this.terrainParticles.push({
          x: Math.random() * 320,
          y: 130 + Math.random() * 20,
          vx: (Math.random() - 0.5) * 40,
          vy: -30 - Math.random() * 20,
          life: 0.4 + Math.random() * 0.2,
          maxLife: 0.4 + Math.random() * 0.2,
          size: 2 + Math.random() * 2,
          color: '#f8d858',
        });
        break;
      case 'psychic':
        this.terrainParticles.push({
          x: Math.random() * 320,
          y: 100 + Math.random() * 40,
          vx: Math.sin(this.weatherTimer * 3) * 20,
          vy: -15 + Math.cos(this.weatherTimer * 2) * 10,
          life: 1.5 + Math.random(),
          maxLife: 1.5 + Math.random(),
          size: 4 + Math.random() * 3,
          color: '#f85888',
        });
        break;
      case 'grassy':
        this.terrainParticles.push({
          x: Math.random() * 320,
          y: 140 + Math.random() * 10,
          vx: (Math.random() - 0.5) * 10,
          vy: -20 - Math.random() * 15,
          life: 1 + Math.random() * 0.5,
          maxLife: 1 + Math.random() * 0.5,
          size: 3 + Math.random() * 2,
          color: '#78c850',
        });
        break;
      case 'misty':
        this.terrainParticles.push({
          x: Math.random() * 320,
          y: Math.random() * 150,
          vx: 5 + Math.random() * 10,
          vy: Math.sin(this.weatherTimer + Math.random()) * 2,
          life: 2 + Math.random(),
          maxLife: 2 + Math.random(),
          size: 20 + Math.random() * 25,
          color: '#ee99ac',
        });
        break;
    }
  }

  private renderTerrain(ctx: CanvasRenderingContext2D) {
    if (this.terrain === 'none') return;
    
    for (const p of this.terrainParticles) {
      const alpha = Math.min(1, p.life / p.maxLife);
      ctx.fillStyle = p.color.replace(')', `, ${alpha * 0.5})`).replace('rgb', 'rgba').replace('#', '');
      
      const hex = p.color;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`;
      
      if (this.terrain === 'electric') {
        ctx.fillRect(p.x - p.size / 4, p.y - 1, p.size / 2, 2);
        ctx.fillRect(p.x - 1, p.y - p.size / 4, 2, p.size / 2);
      } else if (this.terrain === 'psychic') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.terrain === 'grassy') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else if (this.terrain === 'misty') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    if (this.terrain === 'electric') {
      ctx.fillStyle = 'rgba(248, 216, 88, 0.08)';
      ctx.fillRect(0, 120, 320, 36);
    } else if (this.terrain === 'psychic') {
      ctx.fillStyle = 'rgba(248, 88, 136, 0.08)';
      ctx.fillRect(0, 0, 320, 156);
    } else if (this.terrain === 'grassy') {
      ctx.fillStyle = 'rgba(120, 200, 80, 0.08)';
      ctx.fillRect(0, 120, 320, 36);
    } else if (this.terrain === 'misty') {
      ctx.fillStyle = 'rgba(238, 153, 172, 0.1)';
      ctx.fillRect(0, 0, 320, 156);
    }
  }

  private updateZMoveParticles(dt: number) {
    if (!this.zMoveActive) return;
    
    this.zMoveTimer += dt;
    
    // Spawn dramatic particles during Z-Move animation
    if (this.zMoveTimer < 1.0) {
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 80 + Math.random() * 120;
        this.zMoveParticles.push({
          x: 160 + (Math.random() - 0.5) * 60,
          y: 78 + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.4 + Math.random() * 0.3,
          maxLife: 0.4 + Math.random() * 0.3,
          size: 3 + Math.random() * 5,
          color: '#f8f8f8',
          angle: 0,
        });
      }
    }
    
    // Update particles
    for (const p of this.zMoveParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.angle += dt * 10;
      p.life -= dt;
    }
    
    this.zMoveParticles = this.zMoveParticles.filter(p => p.life > 0);
    
    // Fade out flash
    if (this.zMoveFlashAlpha > 0) {
      this.zMoveFlashAlpha -= dt * 2;
      if (this.zMoveFlashAlpha < 0) this.zMoveFlashAlpha = 0;
    }
    
    // End Z-Move animation
    if (this.zMoveTimer >= 1.5) {
      this.zMoveActive = false;
      this.zMoveParticles = [];
    }
  }
  
  private renderZMove(ctx: CanvasRenderingContext2D) {
    if (!this.zMoveActive && this.zMoveParticles.length === 0) return;
    
    // Render particles
    for (const p of this.zMoveParticles) {
      const alpha = Math.min(1, p.life / p.maxLife);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    
    // Render flash overlay
    if (this.zMoveFlashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.zMoveFlashAlpha * 0.6})`;
      ctx.fillRect(0, 0, 320, 144);
    }
  }

  private updateIntro(dt: number) {
    this.introTimer += dt;

    if (this.introTimer < 0.4) {
      this.flashAlpha = Math.floor(this.introTimer / 0.08) % 2 === 0 ? 0.8 : 0;
    } else {
      this.flashAlpha = 0;
    }

    // Play enemy Pokemon cry when sprite slides in
    if (!this.enemyCryPlayed && this.introTimer >= 1.0) {
      this.enemyCryPlayed = true;
      SFX.pokemonCry(this.enemyMon.species.id, true);
    }

    // Play player Pokemon cry when it enters
    if (!this.playerCryPlayed && this.introTimer >= 1.4) {
      this.playerCryPlayed = true;
      SFX.pokemonCry(this.playerMon.species.id, false);
    }

    // Shiny sparkle sound once sprites have mostly slid in
    if (!this.shinySparkled && this.enemyMon.isShiny && this.introTimer >= 1.0) {
      this.shinySparkled = true;
      SFX.shinySparkle();
      // Spawn sparkle particles around enemy sprite position
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
        this.shinyParticles.push({
          x: this.enemySpriteX + 32 + Math.cos(angle) * 20,
          y: 14 + 32 + Math.sin(angle) * 20,
          vx: Math.cos(angle) * 30 + (Math.random() - 0.5) * 10,
          vy: Math.sin(angle) * 30 + (Math.random() - 0.5) * 10,
          life: 0.8 + Math.random() * 0.5,
          maxLife: 0.8 + Math.random() * 0.5,
          size: 2 + Math.random() * 2,
        });
      }
    }

    // Update shiny particles
    for (const p of this.shinyParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    this.shinyParticles = this.shinyParticles.filter(p => p.life > 0);

    if (this.introTimer >= 1.8) {
      const enemyPrefix = this.isTrainerBattle ? `${this.trainerData!.name} sent out` : 'Wild';
      const msgs: string[] = [`${enemyPrefix} ${this.enemyMon.name}!`, `Go! ${this.playerMon.name}!`];
      
      const enemyEntry = checkEntryAbilities(this.enemyMon, this.playerMon);
      if (enemyEntry?.message) msgs.push(enemyEntry.message);
      
      const playerEntry = checkEntryAbilities(this.playerMon, this.enemyMon);
      if (playerEntry?.message) msgs.push(playerEntry.message);
      
      const enemyHazardMsgs = this.applyHazardsOnEntry(this.enemyMon, false);
      msgs.push(...enemyHazardMsgs);
      
      const playerHazardMsgs = this.applyHazardsOnEntry(this.playerMon, true);
      msgs.push(...playerHazardMsgs);
      
      this.queueMessages(
        msgs,
        () => {
          this.phase = 'action';
          this.cursor = 0;
        },
      );
    }
  }

  private updateMessage() {
    this.msgCharIdx += 1.2; // ~40 chars/sec at 60fps

    if (this.input.getActionPressed()) {
      if (this.msgCharIdx < this.msgText.length) {
        this.msgCharIdx = this.msgText.length;
      } else {
        if (this.msgQueue.length > 0) {
          const cb = this.msgCallback;
          this.nextMessage();
          if (this.msgQueue.length === 0 && this.msgCallback === null) {
            this.msgCallback = cb;
          }
        } else if (this.msgCallback) {
          const cb = this.msgCallback;
          this.msgCallback = null;
          cb();
        }
      }
    }
  }

  private updateAction() {
    const dir = this.input.getDirectionPressed();
    if (dir === 'up' && this.cursor >= 2) this.cursor -= 2;
    if (dir === 'down' && this.cursor < 2) this.cursor += 2;
    if (dir === 'left' && this.cursor % 2 === 1) this.cursor -= 1;
    if (dir === 'right' && this.cursor % 2 === 0) this.cursor += 1;

    if (dir) SFX.menuSelect();

    if (this.input.getActionPressed()) {
      SFX.menuConfirm();
      switch (this.cursor) {
        case 0: // FIGHT
          this.phase = 'moves';
          this.cursor = 0;
          break;
        case 1: // BAG
          if (this.isTrainerBattle) {
            this.queueMessages(["Can't use items in trainer battles!"], () => {
              this.phase = 'action';
              this.cursor = 1;
            });
          } else {
            this.openBag();
          }
          break;
        case 2: // POKEMON
          this.openParty();
          break;
        case 3: // RUN
          if (this.isTrainerBattle) {
            this.queueMessages(["Can't run from trainer battles!"], () => {
              this.phase = 'action';
              this.cursor = 3;
            });
          } else {
            SFX.run();
            this.queueMessages(['Got away safely!'], () => {
              Music.stop();
              this.onEnd(true);
            });
          }
          break;
      }
    }
  }

  private updateMoves() {
    const dir = this.input.getDirectionPressed();
    const moveCount = this.playerMon.moves.length;

    if (dir === 'up' && this.cursor >= 2) this.cursor -= 2;
    if (dir === 'down' && this.cursor + 2 < moveCount) this.cursor += 2;
    if (dir === 'left' && this.cursor % 2 === 1) this.cursor -= 1;
    if (dir === 'right' && this.cursor % 2 === 0 && this.cursor + 1 < moveCount) this.cursor += 1;

    if (dir) SFX.menuSelect();

    if (this.input.getCancelPressed()) {
      SFX.menuCancel();
      this.phase = 'action';
      this.cursor = 0;
      return;
    }

    if (this.input.getActionPressed()) {
      const move = this.playerMon.moves[this.cursor];
      if (move.pp <= 0) {
        SFX.bump();
        return;
      }
      SFX.menuConfirm();
      this.executeTurn(move, false);
    }
    
    // Z-Move activation with C key
    if (this.input.getZMovePressed()) {
      if (this.playerMon.canUseZMove()) {
        const move = this.playerMon.moves[this.cursor];
        const zType = getZCrystalType(this.playerMon.heldItem);
        if (move.data.type === zType && move.data.category === 'physical' && move.data.power > 0 && move.pp > 0) {
          SFX.menuConfirm();
          this.executeTurn(move, true);
        } else {
          SFX.bump();
        }
      } else {
        SFX.bump();
      }
    }
  }

  private updateAnimating(dt: number) {
    if (!this.anim.active) return;
    this.anim.timer += dt;
    if (this.anim.timer >= 0.5) {
      this.anim.active = false;
      this.anim.done();
    }
  }

  private updateResult() {
    this.resultTimer += 1 / 60;
    if (this.resultTimer > 0.5 && this.input.getActionPressed()) {
      Music.stop();
      this.onEnd(this.battleWon);
    }
  }

  // ── Bag ──

  private openBag() {
    this.bagItems = [
      { key: 'pokeball' as keyof Inventory, count: this.gameState.inventory.pokeball },
      { key: 'greatBall' as keyof Inventory, count: this.gameState.inventory.greatBall },
      { key: 'ultraBall' as keyof Inventory, count: this.gameState.inventory.ultraBall },
      { key: 'potion' as keyof Inventory, count: this.gameState.inventory.potion },
      { key: 'superPotion' as keyof Inventory, count: this.gameState.inventory.superPotion },
      { key: 'antidote' as keyof Inventory, count: this.gameState.inventory.antidote },
      { key: 'fullHeal' as keyof Inventory, count: this.gameState.inventory.fullHeal },
      { key: 'revive' as keyof Inventory, count: this.gameState.inventory.revive },
    ].filter((i) => i.count > 0);
    this.phase = 'bag';
    this.cursor = 0;
  }

  private updateBag() {
    const dir = this.input.getDirectionPressed();
    const totalItems = this.bagItems.length + 1;

    if (dir === 'up' && this.cursor > 0) this.cursor--;
    if (dir === 'down' && this.cursor < totalItems - 1) this.cursor++;
    if (dir) SFX.menuSelect();

    if (this.input.getCancelPressed()) {
      SFX.menuCancel();
      this.phase = 'action';
      this.cursor = 1;
      return;
    }

    if (this.input.getActionPressed()) {
      if (this.cursor >= this.bagItems.length) {
        SFX.menuCancel();
        this.phase = 'action';
        this.cursor = 1;
        return;
      }

      const item = this.bagItems[this.cursor];
      SFX.menuConfirm();
      if (item.key === 'pokeball' || item.key === 'greatBall' || item.key === 'ultraBall') {
        this.usePokeball(item.key);
      } else if (item.key === 'antidote' || item.key === 'fullHeal') {
        this.useStatusHeal(item.key);
      } else if (item.key === 'revive') {
        this.useRevive();
      } else {
        this.usePotion(item.key);
      }
    }
  }

  private usePokeball(key: keyof Inventory = 'pokeball') {
    if (!this.gameState.useItem(key)) return;

    const itemData = ITEMS[key];
    SFX.catchBall();
    const result = attemptCatch(this.enemyMon, itemData.catchMultiplier!);
    this.catchTargetShakes = result.shakes;
    this.catchCaught = result.caught;
    this.catchTimer = 0;
    this.catchShakes = 0;
    this.catchBallX = 160;
    this.catchBallY = 60;

    this.queueMessages([`You threw a ${itemData.name}!`], () => {
      this.phase = 'catching';
      this.catchTimer = 0;
    });
  }

  private useStatusHeal(key: keyof Inventory) {
    if (!this.playerMon.status) {
      SFX.bump();
      this.queueMessages([`${this.playerMon.name} has no status problem!`], () => {
        this.openBag();
      });
      return;
    }
    if (!this.gameState.useItem(key)) return;

    const itemData = ITEMS[key];

    // Antidote only cures poison
    if (itemData.statusCure === 'cure_poison' && this.playerMon.status !== 'poison') {
      // Refund the item — can't use antidote on non-poison
      this.gameState.inventory[key]++;
      SFX.bump();
      this.queueMessages([`It won't have any effect!`], () => {
        this.openBag();
      });
      return;
    }

    this.playerMon.status = null;
    this.playerMon.sleepTurns = 0;
    SFX.heal();

    this.queueMessages(
      [`Used ${itemData.name}!`, `${this.playerMon.name} was cured!`],
      () => {
        this.doEnemyTurn();
      },
    );
  }

  private usePotion(key: keyof Inventory) {
    if (!this.gameState.useItem(key)) return;

    const itemData = ITEMS[key];
    const healAmount = itemData.healAmount ?? 20;
    const before = this.playerMon.hp;
    this.playerMon.hp = Math.min(this.playerMon.maxHp, this.playerMon.hp + healAmount);
    const healed = this.playerMon.hp - before;

    SFX.heal();

    this.queueMessages(
      [`Used ${itemData.name}!`, `${this.playerMon.name} recovered ${healed} HP!`],
      () => {
        this.doEnemyTurn();
      },
    );
  }

  private useRevive() {
    // Find first fainted team Pokemon
    const faintedIdx = this.gameState.team.findIndex(p => !p.isAlive);
    if (faintedIdx < 0) {
      SFX.bump();
      this.queueMessages(['No fainted POKéMON to revive!'], () => {
        this.openBag();
      });
      return;
    }
    if (!this.gameState.useItem('revive')) return;

    const fainted = this.gameState.team[faintedIdx];
    fainted.hp = Math.floor(fainted.maxHp / 2);
    SFX.heal();

    this.queueMessages(
      [`Used REVIVE!`, `${fainted.name} was revived!`],
      () => {
        this.doEnemyTurn();
      },
    );
  }

  // ── Party ──

  private openParty() {
    this.phase = 'party';
    this.cursor = 0;
  }

  private updateParty() {
    const dir = this.input.getDirectionPressed();
    const totalOptions = this.gameState.team.length + 1;

    if (dir === 'up' && this.cursor > 0) this.cursor--;
    if (dir === 'down' && this.cursor < totalOptions - 1) this.cursor++;
    if (dir) SFX.menuSelect();

    if (this.input.getCancelPressed()) {
      SFX.menuCancel();
      this.phase = 'action';
      this.cursor = 2;
      return;
    }

    if (this.input.getActionPressed()) {
      if (this.cursor >= this.gameState.team.length) {
        SFX.menuCancel();
        this.phase = 'action';
        this.cursor = 2;
        return;
      }

      const selected = this.gameState.team[this.cursor];
      if (!selected.isAlive) {
        SFX.bump();
        return;
      }
      if (this.cursor === this.activeTeamIndex) {
        SFX.bump();
        return;
      }

      SFX.menuConfirm();
      const oldMon = this.playerMon;
      oldMon.resetStages();
      oldMon.isSwitching = true;
      this.activeTeamIndex = this.cursor;
      this.playerMon = selected;
      this.playerMon.isSwitching = false;
      this.playerDisplayHp = this.playerMon.hp;
      this.playerDisplayExp = this.playerMon.expPercent;

      const msgs: string[] = [`Come back, ${oldMon.name}!`, `Go! ${this.playerMon.name}!`];
      const playerEntry = checkEntryAbilities(this.playerMon, this.enemyMon);
      if (playerEntry?.message) msgs.push(playerEntry.message);
      
      const hazardMsgs = this.applyHazardsOnEntry(this.playerMon, true);
      msgs.push(...hazardMsgs);

      this.queueMessages(
        msgs,
        () => {
          if (!this.playerMon.isAlive) {
            this.handleFaint(this.playerMon);
            return;
          }
          this.doEnemyTurn();
        },
      );
    }
  }

  // ── Catching ──

  private updateCatching(dt: number) {
    this.catchTimer += dt;

    if (this.catchTimer < 0.3) {
      const t = this.catchTimer / 0.3;
      this.catchBallX = 100 + t * 110;
      this.catchBallY = 80 - Math.sin(t * Math.PI) * 40;
      this.enemyVisible = true;
    } else if (this.catchTimer < 0.6) {
      this.enemyVisible = false;
      const t = (this.catchTimer - 0.3) / 0.3;
      this.catchBallX = 230;
      this.catchBallY = 40 + t * 30;
    } else {
      this.catchBallX = 230;
      this.catchBallY = 70;
      const shakeTime = this.catchTimer - 0.6;
      const currentShake = Math.floor(shakeTime / 0.5);

      // Play shake SFX
      if (currentShake > this.catchShakes && currentShake <= this.catchTargetShakes) {
        SFX.catchShake();
      }

      if (currentShake < this.catchTargetShakes) {
        this.catchShakes = currentShake;
      } else {
        if (this.catchCaught) {
          this.enemyVisible = false;
          SFX.catchSuccess();
          this.queueMessages(
            [`Gotcha! ${this.enemyMon.name} was caught!`],
            () => {
              const badgeCount = this.gameState.badges.size;
              const caught = new Pokemon(this.enemyMon.speciesKey, this.enemyMon.level, badgeCount);
              caught.hp = this.enemyMon.hp;
              caught.status = this.enemyMon.status;
              // Track caught in pokedex
              this.gameState.pokedexCaught.add(this.enemyMon.speciesKey);
              if (this.gameState.addToTeam(caught)) {
                this.queueMessages(
                  [`${caught.name} was added to your team!`],
                  () => { this.phase = 'result'; this.battleWon = true; this.resultTimer = 0; },
                );
              } else {
                this.gameState.addToPC(caught);
                this.queueMessages(
                  [`Your team is full!`, `${caught.name} was sent to the PC!`],
                  () => { this.phase = 'result'; this.battleWon = true; this.resultTimer = 0; },
                );
              }
            },
          );
        } else {
          this.enemyVisible = true;
          SFX.catchFail();
          this.queueMessages(
            [`Oh no! It broke free!`],
            () => {
              this.doEnemyTurn();
            },
          );
        }
      }
    }
  }

  // ── Evolution ──

  private updateEvolving(dt: number) {
    this.evolveTimer += dt;

    // Flashing animation for 2 seconds, then evolve
    if (this.evolveTimer >= 2.5 && this.evolvingMon) {
      const oldName = this.evolvingMon.name;
      this.evolvingMon.evolve();
      const newName = this.evolvingMon.name;
      // Track evolution in pokedex
      this.gameState.pokedexSeen.add(this.evolvingMon.speciesKey);
      this.gameState.pokedexCaught.add(this.evolvingMon.speciesKey);
      this.evolvingMon = null;

      // Update display if this is the active mon
      this.playerDisplayHp = this.playerMon.hp;

      this.queueMessages(
        [`${oldName} evolved into ${newName}!`],
        () => {
          // Check if there are more team members to evolve
          this.checkTeamEvolution();
        },
      );
    }
  }

  // ── Move Learning ──

  private updateLearnMove() {
    if (!this.learnMoveMon || !this.learnMoveKey) return;

    const dir = this.input.getDirectionPressed();
    const moveData = MOVES[this.learnMoveKey];
    if (!moveData) { this.finishLearnMove(); return; }

    if (!this.learnMoveConfirm) {
      // Asking: "Want to learn X? Yes/No"
      if (dir === 'left' || dir === 'right') {
        this.cursor = this.cursor === 0 ? 1 : 0;
        SFX.menuSelect();
      }
      if (this.input.getActionPressed()) {
        SFX.menuConfirm();
        if (this.cursor === 0) {
          // Yes - show move selection
          this.learnMoveConfirm = true;
          this.cursor = 0;
        } else {
          // No - skip this move
          this.queueMessages([`${this.learnMoveMon.name} did not learn ${moveData.name}.`], () => {
            this.finishLearnMove();
          });
        }
      }
      if (this.input.getCancelPressed()) {
        SFX.menuCancel();
        this.queueMessages([`${this.learnMoveMon.name} did not learn ${moveData.name}.`], () => {
          this.finishLearnMove();
        });
      }
    } else {
      // Selecting which move to forget
      if (dir === 'up' && this.cursor > 0) { this.cursor--; SFX.menuSelect(); }
      if (dir === 'down' && this.cursor < 4) { this.cursor++; SFX.menuSelect(); }

      if (this.input.getCancelPressed()) {
        SFX.menuCancel();
        this.learnMoveConfirm = false;
        this.cursor = 0;
        return;
      }

      if (this.input.getActionPressed()) {
        SFX.menuConfirm();
        if (this.cursor === 4) {
          // Cancel - don't learn
          this.queueMessages([`${this.learnMoveMon.name} did not learn ${moveData.name}.`], () => {
            this.finishLearnMove();
          });
        } else {
          const oldMove = this.learnMoveMon.moves[this.cursor];
          this.learnMoveMon.replaceMove(this.cursor, this.learnMoveKey);
          this.queueMessages(
            [`1, 2, and... Poof!`, `${this.learnMoveMon.name} forgot ${oldMove.data.name}!`, `And... ${this.learnMoveMon.name} learned ${moveData.name}!`],
            () => { this.finishLearnMove(); },
          );
        }
      }
    }
  }

  private finishLearnMove() {
    this.learnMoveMon = null;
    this.learnMoveKey = '';
    this.learnMoveConfirm = false;
    // Check if there are more pending moves
    if (this.learnMovePendingQueue.length > 0) {
      const next = this.learnMovePendingQueue.shift()!;
      this.startLearnMove(next.mon, next.moveKey);
    } else {
      // Continue to evolution check
      this.checkTeamEvolution();
    }
  }

  private startLearnMove(mon: Pokemon, moveKey: string) {
    const moveData = MOVES[moveKey];
    if (!moveData) { this.finishLearnMove(); return; }
    this.learnMoveMon = mon;
    this.learnMoveKey = moveKey;
    this.learnMoveConfirm = false;
    this.cursor = 0;
    this.queueMessages(
      [`${mon.name} wants to learn ${moveData.name}!`, `But ${mon.name} already knows 4 moves.`, `Forget a move to learn ${moveData.name}?`],
      () => { this.phase = 'learnMove'; this.cursor = 0; },
    );
  }

  private checkTeamEvolution() {
    for (const mon of this.gameState.team) {
      if (mon.canEvolve) {
        SFX.evolve();
        this.evolvingMon = mon;
        this.evolveTimer = 0;
        this.phase = 'evolving';
        this.queueMessages([`What? ${mon.name} is evolving!`], () => {
          this.phase = 'evolving';
          this.evolveTimer = 0;
        });
        return;
      }
    }

    // No more evolutions — end battle
    this.phase = 'result';
    this.resultTimer = 0;
  }

  // ── Enemy solo turn (after using item/switching) ──

  private doEnemyTurn() {
    // Check if enemy can act (sleep, paralysis)
    const actCheck = canAct(this.enemyMon);
    if (!actCheck.canAct) {
      const prefix = this.isTrainerBattle ? 'Foe ' : 'Wild ';
      this.queueMessages([actCheck.message ?? `${prefix}${this.enemyMon.name} can't move!`], () => {
        this.applyEndOfTurnStatus(() => {
          this.phase = 'action';
          this.cursor = 0;
        });
      });
      return;
    }

    // If enemy woke up, show message then let them move
    const enemyMove = getEnemyMove(this.enemyMon, this.playerMon);
    if (!enemyMove) {
      this.phase = 'action';
      this.cursor = 0;
      return;
    }

    const msgs: string[] = [];
    if (actCheck.message) msgs.push(actCheck.message);

    if (msgs.length > 0) {
      this.queueMessages(msgs, () => {
        this.doAttack(this.enemyMon, this.playerMon, enemyMove, false, false, () => {
          if (!this.playerMon.isAlive) {
            this.handleFaint(this.playerMon);
            return;
          }
          this.applyEndOfTurnStatus(() => {
            this.phase = 'action';
            this.cursor = 0;
          });
        });
      });
    } else {
      this.doAttack(this.enemyMon, this.playerMon, enemyMove, false, false, () => {
        if (!this.playerMon.isAlive) {
          this.handleFaint(this.playerMon);
          return;
        }
        this.applyEndOfTurnStatus(() => {
          this.phase = 'action';
          this.cursor = 0;
        });
      });
    }
  }

  // ── End-of-turn status damage ──

  private applyEndOfTurnStatus(then: () => void) {
    const msgs: string[] = [];

    const playerStatus = applyStatusDamage(this.playerMon);
    if (playerStatus?.message) msgs.push(playerStatus.message);

    const enemyStatus = applyStatusDamage(this.enemyMon);
    if (enemyStatus?.message) msgs.push(enemyStatus.message);

    const playerAbility = checkTurnEndAbilities(this.playerMon);
    if (playerAbility?.message) msgs.push(playerAbility.message);

    const enemyAbility = checkTurnEndAbilities(this.enemyMon);
    if (enemyAbility?.message) msgs.push(enemyAbility.message);

    // Held item effects (Leftovers)
    const playerItem = checkTurnEndHeldItems(this.playerMon);
    if (playerItem?.message) {
      msgs.push(playerItem.message);
      if (playerItem.healed && playerItem.healed > 0) {
        this.healParticles.push(...HealParticles.create(this.playerSpriteX + 20, 100, 8));
      }
    }

    const enemyItem = checkTurnEndHeldItems(this.enemyMon);
    if (enemyItem?.message) {
      msgs.push(enemyItem.message);
      if (enemyItem.healed && enemyItem.healed > 0) {
        this.healParticles.push(...HealParticles.create(this.enemySpriteX + 20, 40, 8));
      }
    }

    const playerTrap = checkTrappingDamage(this.playerMon);
    if (playerTrap?.message) msgs.push(playerTrap.message);
    if (playerTrap?.damage && playerTrap.damage > 0) {
      this.playerDisplayHp = this.playerMon.hp;
    }

    const enemyTrap = checkTrappingDamage(this.enemyMon);
    if (enemyTrap?.message) msgs.push(enemyTrap.message);
    if (enemyTrap?.damage && enemyTrap.damage > 0) {
      this.enemyDisplayHp = this.enemyMon.hp;
    }

    // Check for drowsy (Yawn effect)
    const playerDrowsy = checkDrowsy(this.playerMon);
    if (playerDrowsy.message) msgs.push(playerDrowsy.message);
    
    const enemyDrowsy = checkDrowsy(this.enemyMon);
    if (enemyDrowsy.message) msgs.push(enemyDrowsy.message);

    // Check for Wish healing
    const playerWish = checkWish(this.playerMon);
    if (playerWish.message) {
      msgs.push(playerWish.message);
      if (playerWish.healed > 0) {
        this.healParticles.push(...HealParticles.create(this.playerSpriteX + 20, 100, 12));
        this.playerDisplayHp = this.playerMon.hp;
      }
    }
    
    const enemyWish = checkWish(this.enemyMon);
    if (enemyWish.message) {
      msgs.push(enemyWish.message);
      if (enemyWish.healed > 0) {
        this.healParticles.push(...HealParticles.create(this.enemySpriteX + 20, 40, 12));
        this.enemyDisplayHp = this.enemyMon.hp;
      }
    }

    // Check for Future Sight
    const playerFutureSight = checkFutureSight(this.playerMon);
    if (playerFutureSight.message) {
      msgs.push(playerFutureSight.message);
      if (playerFutureSight.damage > 0) {
        this.damageNumbers.push(DamageNumbers.create(playerFutureSight.damage, false, false, false));
        this.playerDisplayHp = this.playerMon.hp;
        this.screenShake = 4;
      }
    }
    
    const enemyFutureSight = checkFutureSight(this.enemyMon);
    if (enemyFutureSight.message) {
      msgs.push(enemyFutureSight.message);
      if (enemyFutureSight.damage > 0) {
        this.damageNumbers.push(DamageNumbers.create(enemyFutureSight.damage, true, false, false));
        this.enemyDisplayHp = this.enemyMon.hp;
        this.screenShake = 4;
      }
    }

    // Check for Doom Desire
    const playerDoomDesire = checkDoomDesire(this.playerMon);
    if (playerDoomDesire.message) {
      msgs.push(playerDoomDesire.message);
      if (playerDoomDesire.damage > 0) {
        this.damageNumbers.push(DamageNumbers.create(playerDoomDesire.damage, false, false, false));
        this.playerDisplayHp = this.playerMon.hp;
        this.screenShake = 6;
      }
    }
    
    const enemyDoomDesire = checkDoomDesire(this.enemyMon);
    if (enemyDoomDesire.message) {
      msgs.push(enemyDoomDesire.message);
      if (enemyDoomDesire.damage > 0) {
        this.damageNumbers.push(DamageNumbers.create(enemyDoomDesire.damage, true, false, false));
        this.enemyDisplayHp = this.enemyMon.hp;
        this.screenShake = 6;
      }
    }

    // Check for Perish Song
    const playerPerish = checkPerishSong(this.playerMon);
    if (playerPerish.message) msgs.push(playerPerish.message);
    if (playerPerish.count && playerPerish.count > 0) {
      msgs.push(`${this.playerMon.name}'s perish count: ${playerPerish.count}`);
    }
    
    const enemyPerish = checkPerishSong(this.enemyMon);
    if (enemyPerish.message) msgs.push(enemyPerish.message);
    if (enemyPerish.count && enemyPerish.count > 0) {
      msgs.push(`${this.enemyMon.name}'s perish count: ${enemyPerish.count}`);
    }

    // Terrain effects
    if (this.terrain !== 'none') {
      this.terrainTurns--;
      if (this.terrainTurns <= 0) {
        msgs.push('The terrain returned to normal.');
        this.terrain = 'none';
      } else if (this.terrain === 'grassy') {
        const playerTerrainHeal = getTerrainHeal(this.playerMon, this.terrain);
        if (playerTerrainHeal > 0) {
          this.playerMon.hp = Math.min(this.playerMon.maxHp, this.playerMon.hp + playerTerrainHeal);
          msgs.push(`${this.playerMon.name} was healed by the grassy terrain!`);
          this.healParticles.push(...HealParticles.create(this.playerSpriteX + 20, 100, 6));
          this.playerDisplayHp = this.playerMon.hp;
        }
        
        const enemyTerrainHeal = getTerrainHeal(this.enemyMon, this.terrain);
        if (enemyTerrainHeal > 0) {
          this.enemyMon.hp = Math.min(this.enemyMon.maxHp, this.enemyMon.hp + enemyTerrainHeal);
          msgs.push(`${this.enemyMon.name} was healed by the grassy terrain!`);
          this.healParticles.push(...HealParticles.create(this.enemySpriteX + 20, 40, 6));
          this.enemyDisplayHp = this.enemyMon.hp;
        }
      }
    }

    decrementTurnCounters(this.playerMon);
    decrementTurnCounters(this.enemyMon);

    // Reset flinch state for next turn
    this.playerFlinched = false;
    this.enemyFlinched = false;
    
    // Reset protection state for next turn
    resetProtection(this.playerMon);
    resetProtection(this.enemyMon);

    if (msgs.length > 0) {
      this.queueMessages(msgs, () => {
        if (!this.playerMon.isAlive) {
          this.handleFaint(this.playerMon);
          return;
        }
        if (!this.enemyMon.isAlive) {
          this.handleFaint(this.enemyMon);
          return;
        }
        then();
      });
    } else {
      then();
    }
  }

  // ── Turn execution ──

  private executeTurn(playerMove: MoveInstance, useZMove: boolean = false) {
    const enemyMove = getEnemyMove(this.enemyMon, this.playerMon) ?? { data: MOVES['tackle'], key: 'tackle', pp: 0 };
    const order = determineTurnOrder(this.playerMon, this.enemyMon, playerMove, enemyMove, this.weather);

    const first = order === 'player'
      ? { mon: this.playerMon, move: playerMove, isPlayer: true, useZMove }
      : { mon: this.enemyMon, move: enemyMove!, isPlayer: false, useZMove: false };

    const second = order === 'player'
      ? { mon: this.enemyMon, move: enemyMove!, isPlayer: false, useZMove: false }
      : { mon: this.playerMon, move: playerMove, isPlayer: true, useZMove };

    this.executeOneAttack(first.mon, first.isPlayer ? this.enemyMon : this.playerMon, first.move, first.isPlayer, first.useZMove, () => {
      const defender = first.isPlayer ? this.enemyMon : this.playerMon;
      if (!defender.isAlive) {
        this.handleFaint(defender);
        return;
      }
      this.executeOneAttack(second.mon, second.isPlayer ? this.enemyMon : this.playerMon, second.move, second.isPlayer, second.useZMove, () => {
        const def2 = second.isPlayer ? this.enemyMon : this.playerMon;
        if (!def2.isAlive) {
          this.handleFaint(def2);
          return;
        }
        // Apply end-of-turn status damage
        this.applyEndOfTurnStatus(() => {
          this.phase = 'action';
          this.cursor = 0;
        });
      });
    });
  }

  /** Execute one attack, checking status conditions first */
  private executeOneAttack(attacker: Pokemon, defender: Pokemon, move: MoveInstance, isPlayer: boolean, useZMove: boolean, then: () => void) {
    const prefix = isPlayer ? '' : (this.isTrainerBattle ? 'Foe ' : 'Wild ');
    
    if (attacker.twoTurnState !== 'none') {
      const msgs: string[] = [];
      if (attacker.twoTurnState === 'flying') {
        attacker.twoTurnState = 'none';
        msgs.push(`${prefix}${attacker.name} used ${move.data.name}!`);
      } else if (attacker.twoTurnState === 'underground') {
        attacker.twoTurnState = 'none';
        msgs.push(`${prefix}${attacker.name} used ${move.data.name}!`);
      } else if (attacker.twoTurnState === 'charging') {
        attacker.twoTurnState = 'none';
        msgs.push(`${prefix}${attacker.name} used ${move.data.name}!`);
      }
      if (msgs.length > 0) {
        this.queueMessages(msgs, () => {
          this.doAttack(attacker, defender, move, isPlayer, useZMove, then);
        });
        return;
      }
    }
    
    if (move.data.twoTurn) {
      const msgs: string[] = [];
      msgs.push(`${prefix}${attacker.name} used ${move.data.name}!`);
      
      if (move.data.twoTurn === 'charge') {
        attacker.twoTurnState = 'charging';
        attacker.twoTurnMove = move.key;
        msgs.push(`${prefix}${attacker.name} is charging up!`);
      } else if (move.data.twoTurn === 'fly') {
        attacker.twoTurnState = 'flying';
        attacker.twoTurnMove = move.key;
        msgs.push(`${prefix}${attacker.name} flew up high!`);
      } else if (move.data.twoTurn === 'dig') {
        attacker.twoTurnState = 'underground';
        attacker.twoTurnMove = move.key;
        msgs.push(`${prefix}${attacker.name} dug a hole!`);
      }
      
      move.pp = Math.max(0, move.pp - 1);
      this.queueMessages(msgs, then);
      return;
    }
    
    const actCheck = canAct(attacker);
    if (!actCheck.canAct) {
      const msgs: string[] = [];
      if (actCheck.message) msgs.push(actCheck.message);
      if (actCheck.confusionHit && actCheck.confusionDamage) {
        this.damageNumbers.push(DamageNumbers.create(actCheck.confusionDamage, !isPlayer, false, false));
        this.screenShake = 3;
      }
      if (msgs.length > 0) {
        this.queueMessages(msgs, then);
      } else {
        then();
      }
      return;
    }

    const moveRestriction = canUseMove(attacker, move);
    if (!moveRestriction.canUse) {
      const msgs: string[] = [`${prefix}${attacker.name} used ${move.data.name}!`];
      if (moveRestriction.message) msgs.push(moveRestriction.message);
      move.pp = Math.max(0, move.pp - 1);
      this.queueMessages(msgs, then);
      return;
    }

    if (actCheck.message) {
      this.queueMessages([actCheck.message], () => {
        this.doAttack(attacker, defender, move, isPlayer, useZMove, then);
      });
    } else {
      this.doAttack(attacker, defender, move, isPlayer, useZMove, then);
    }
  }

  private doAttack(attacker: Pokemon, defender: Pokemon, move: MoveInstance, isPlayer: boolean, useZMove: boolean, then: () => void) {
    const prefix = isPlayer ? '' : (this.isTrainerBattle ? 'Foe ' : 'Wild ');
    
    if (defender.twoTurnState === 'flying' || defender.twoTurnState === 'underground') {
      const invulnMsg = defender.twoTurnState === 'flying' 
        ? `${defender.name} is flying high and can't be hit!`
        : `${defender.name} is underground and can't be hit!`;
      const messages: string[] = [`${prefix}${attacker.name} used ${move.data.name}!`, invulnMsg];
      move.pp = Math.max(0, move.pp - 1);
      this.queueMessages(messages, then);
      return;
    }
    
    const result = executeMove(attacker, defender, move, this.weather, this.terrain, useZMove);
    const messages: string[] = [];
    
    // Z-Move activation
    if (result.zMoveActive && result.zMoveName) {
      this.zMoveActive = true;
      this.zMoveTimer = 0;
      this.zMoveFlashAlpha = 1;
      messages.push(`${prefix}${attacker.name} unleashed ${result.zMoveName}!`);
      SFX.criticalHit();
    } else {
      messages.push(`${prefix}${attacker.name} used ${move.data.name}!`);
    }
    
    if (result.hits && result.hits > 1) {
      messages.push(`Hit ${result.hits} times!`);
    }

    if (result.missed) {
      SFX.attackMiss();
      messages.push(`${prefix}${attacker.name}'s attack missed!`);
    } else if (result.damage > 0) {
      SFX.attackHit();
      if (result.critical) {
        SFX.criticalHit();
        messages.push('A critical hit!');
      }
      if (result.effectiveness > 1) {
        SFX.superEffective();
        messages.push("It's super effective!");
      }
      if (result.effectiveness < 1) {
        SFX.notEffective();
        messages.push("It's not very effective...");
      }
      if (result.effectiveness === 0) {
        messages.push("It had no effect...");
      }
    }
    if (result.statusMessage) {
      messages.push(result.statusMessage);
    }
    if (result.abilityMessage) {
      messages.push(result.abilityMessage);
    }
    if (result.heldItemMessage) {
      messages.push(result.heldItemMessage);
    }
    if (result.rockyHelmetDamage && result.rockyHelmetDamage > 0) {
      this.damageNumbers.push(DamageNumbers.create(result.rockyHelmetDamage, isPlayer, false, false));
    }

    this.playAttackAnim(isPlayer, move.data.type as PokemonType, result.critical, () => {
      if (result.damage > 0) {
        this.damageNumbers.push(DamageNumbers.create(result.damage, !isPlayer, false, result.critical));
      }
      
      if (result.hazardSet) {
        const targetHazards = isPlayer ? this.enemyHazards : this.playerHazards;
        if (result.hazardSet === 'spikes') {
          if (targetHazards.spikes < 3) targetHazards.spikes++;
        } else if (result.hazardSet === 'stealth_rock') {
          targetHazards.stealthRock = true;
        } else if (result.hazardSet === 'toxic_spikes') {
          if (targetHazards.toxicSpikes < 2) targetHazards.toxicSpikes++;
        }
      }
      
      if (result.hazardsCleared) {
        if (isPlayer) {
          this.playerHazards = createEmptyHazards();
        } else {
          this.enemyHazards = createEmptyHazards();
        }
      }
      
      if (result.terrainSet) {
        this.terrain = result.terrainSet;
        this.terrainTurns = result.terrainTurns || 5;
      }
      
      this.queueMessages(messages, then);
    });
  }

  private playAttackAnim(isPlayer: boolean, moveType: PokemonType, critical: boolean, callback: () => void) {
    this.phase = 'animating';
    this.anim = { active: true, isPlayer, timer: 0, done: callback, moveType, critical };
    this.screenShake = critical ? 8 : 4;
  }

  private handleFaint(fainted: Pokemon) {
    const isEnemy = fainted === this.enemyMon;
    SFX.faint();
    SFX.pokemonFaintCry(fainted.species.id);
    
    // Check for Destiny Bond
    const attacker = isEnemy ? this.playerMon : this.enemyMon;
    const destinyBondResult = checkDestinyBond(fainted, attacker);
    const destinyBondMsgs: string[] = [];
    if (destinyBondResult.triggered && destinyBondResult.message) {
      destinyBondMsgs.push(destinyBondResult.message);
    }

    if (isEnemy) {
      // Check for next trainer Pokemon
      if (this.isTrainerBattle) {
        this.trainerTeamIndex++;
        if (this.trainerTeamIndex < this.trainerTeam.length) {
          // Trainer sends next Pokemon
          const expGain = calculateExpGain(this.enemyMon.speciesKey, this.enemyMon.level);
          const msgs = [`Foe ${fainted.name} fainted!`, `${this.playerMon.name} gained ${expGain} EXP!`];
          msgs.push(...destinyBondMsgs);

          this.queueMessages(msgs, () => {
            this.awardExpMidBattle(expGain, () => {
              const next = this.trainerTeam[this.trainerTeamIndex];
              this.enemyMon = next;
              this.enemyDisplayHp = next.hp;
              this.gameState.pokedexSeen.add(next.speciesKey);
              
              const entryMsgs: string[] = [`${this.trainerData!.name} sent out ${next.name}!`];
              const enemyEntry = checkEntryAbilities(next, this.playerMon);
              if (enemyEntry?.message) entryMsgs.push(enemyEntry.message);
              
              const hazardMsgs = this.applyHazardsOnEntry(next, false);
              entryMsgs.push(...hazardMsgs);
              
              this.queueMessages(
                entryMsgs,
                () => {
                  if (!next.isAlive) {
                    this.handleFaint(next);
                    return;
                  }
                  this.phase = 'action';
                  this.cursor = 0;
                },
              );
            });
          });
          return;
        }
      }

      this.battleWon = true;
      const msgs: string[] = [];
      msgs.push(`${this.isTrainerBattle ? 'Foe ' : 'Wild '}${fainted.name} fainted!`);

      const expGain = calculateExpGain(this.enemyMon.speciesKey, this.enemyMon.level);
      msgs.push(`${this.playerMon.name} gained ${expGain} EXP!`);

      if (this.isTrainerBattle && this.trainerData) {
        const reward = this.trainerData.reward;
        this.gameState.addMoney(reward);
        msgs.push(`You defeated ${this.trainerData.name}!`);
        msgs.push(`You got ¥${reward} for winning!`);
        // Gym badge
        if (this.trainerData.isGymLeader && this.trainerData.badgeName) {
          this.gameState.addBadge(this.trainerData.badgeName);
          SFX.badgeGet();
          msgs.push(`You received the ${this.trainerData.badgeName}!`);
          if (this.gameState.badges.size >= 8) {
            msgs.push('You have collected all 8 BADGES!');
            msgs.push('You are now ready for the POKéMON LEAGUE!');
            msgs.push('Congratulations, POKéMON MASTER!');
          }
        }
        if (this.trainerData.defeatMessage) {
          msgs.push(`"${this.trainerData.defeatMessage}"`);
        }
      }

      this.queueMessages(msgs, () => {
        this.awardExp(expGain);
      });
    } else {
      const msgs = [`${fainted.name} fainted!`];

      const nextAlive = this.gameState.team.find((p) => p.isAlive);
      if (nextAlive) {
        msgs.push(`${nextAlive.name}, go!`);
        this.queueMessages(msgs, () => {
          this.activeTeamIndex = this.gameState.team.indexOf(nextAlive);
          this.playerMon = nextAlive;
          this.playerDisplayHp = this.playerMon.hp;
          this.playerDisplayExp = this.playerMon.expPercent;
          this.phase = 'action';
          this.cursor = 0;
        });
      } else {
        this.battleWon = false;
        msgs.push('You blacked out!');
        this.queueMessages(msgs, () => {
          this.phase = 'result';
          this.resultTimer = 0;
        });
      }
    }
  }

  /** Award EXP mid-battle (trainer battles with multiple Pokemon) */
  private awardExpMidBattle(amount: number, then: () => void) {
    const events = this.playerMon.gainExp(amount);
    this.playerDisplayExp = this.playerMon.expPercent;

    const msgs: string[] = [];
    for (const ev of events) {
      SFX.levelUp();
      msgs.push(`${this.playerMon.name} grew to Lv.${ev.newLevel}!`);
      for (const moveKey of ev.newMoves) {
        const moveData = MOVES[moveKey];
        if (moveData) {
          msgs.push(`${this.playerMon.name} learned ${moveData.name}!`);
        }
      }
      // Queue pending moves for later
      for (const moveKey of ev.pendingMoves) {
        this.learnMovePendingQueue.push({ mon: this.playerMon, moveKey });
      }
    }

    // EXP Share: distribute 50% to all other alive team members
    if (this.gameState.inventory.expShare > 0) {
      const sharedAmount = Math.floor(amount * 0.5);
      if (sharedAmount > 0) {
        for (const mon of this.gameState.team) {
          if (mon === this.playerMon || !mon.isAlive) continue;
          const sharedEvents = mon.gainExp(sharedAmount);
          for (const ev of sharedEvents) {
            SFX.levelUp();
            msgs.push(`${mon.name} grew to Lv.${ev.newLevel}! (EXP. SHARE)`);
            for (const moveKey of ev.newMoves) {
              const moveData = MOVES[moveKey];
              if (moveData) {
                msgs.push(`${mon.name} learned ${moveData.name}!`);
              }
            }
            for (const moveKey of ev.pendingMoves) {
              this.learnMovePendingQueue.push({ mon, moveKey });
            }
          }
        }
      }
    }

    this.playerDisplayHp = this.playerMon.hp;

    if (msgs.length === 0) {
      then();
      return;
    }

    this.queueMessages(msgs, then);
  }

  private awardExp(amount: number) {
    const events = this.playerMon.gainExp(amount);
    this.playerDisplayExp = this.playerMon.expPercent;

    const msgs: string[] = [];

    for (const ev of events) {
      SFX.levelUp();
      msgs.push(`${this.playerMon.name} grew to Lv.${ev.newLevel}!`);
      for (const moveKey of ev.newMoves) {
        const moveData = MOVES[moveKey];
        if (moveData) {
          msgs.push(`${this.playerMon.name} learned ${moveData.name}!`);
        }
      }
      // Queue pending moves for move replacement
      for (const moveKey of ev.pendingMoves) {
        this.learnMovePendingQueue.push({ mon: this.playerMon, moveKey });
      }
    }

    // EXP Share: distribute 50% to all other alive team members
    if (this.gameState.inventory.expShare > 0) {
      const sharedAmount = Math.floor(amount * 0.5);
      if (sharedAmount > 0) {
        for (const mon of this.gameState.team) {
          if (mon === this.playerMon || !mon.isAlive) continue;
          const sharedEvents = mon.gainExp(sharedAmount);
          for (const ev of sharedEvents) {
            SFX.levelUp();
            msgs.push(`${mon.name} grew to Lv.${ev.newLevel}! (EXP. SHARE)`);
            for (const moveKey of ev.newMoves) {
              const moveData = MOVES[moveKey];
              if (moveData) {
                msgs.push(`${mon.name} learned ${moveData.name}!`);
              }
            }
            for (const moveKey of ev.pendingMoves) {
              this.learnMovePendingQueue.push({ mon, moveKey });
            }
          }
        }
      }
    }

    this.playerDisplayHp = this.playerMon.hp;

    if (msgs.length === 0) {
      Music.victory();
      this.queueMessages(['You won!'], () => {
        this.checkPendingMoves();
      });
      return;
    }

    msgs.push('You won!');
    Music.victory();
    this.queueMessages(msgs, () => {
      this.checkPendingMoves();
    });
  }

  /** Check for pending move learns before evolution */
  private checkPendingMoves() {
    if (this.learnMovePendingQueue.length > 0) {
      const next = this.learnMovePendingQueue.shift()!;
      this.startLearnMove(next.mon, next.moveKey);
    } else {
      this.checkTeamEvolution();
    }
  }

  // ── Render ──

  render(ctx: CanvasRenderingContext2D) {
    // Party screen is a full overlay
    if (this.phase === 'party') {
      BattleUI.drawPartyMenu(ctx, this.gameState.team, this.activeTeamIndex, this.cursor);
      return;
    }

    // Move learning screen
    if (this.phase === 'learnMove' && this.learnMoveMon) {
      this.renderLearnMove(ctx);
      return;
    }

    // Evolution screen
    if (this.phase === 'evolving' && this.evolvingMon) {
      this.renderEvolution(ctx);
      return;
    }

    // Apply screen shake
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake * 2;
      const shakeY = (Math.random() - 0.5) * this.screenShake * 2;
      ctx.save();
      ctx.translate(shakeX, shakeY);
    }

    BattleUI.drawBackground(ctx);

    // Render weather effects
    this.renderWeather(ctx);
    
    // Render terrain effects
    this.renderTerrain(ctx);
    
    // Render Z-Move effects
    this.renderZMove(ctx);

    // Calculate sprite positions with animation offsets
    let psx = this.playerSpriteX;
    let esx = this.enemySpriteX;
    let pVisible = this.playerVisible;
    let eVisible = this.enemyVisible;

    if (this.anim.active) {
      const t = this.anim.timer;
      if (this.anim.isPlayer) {
        if (t < 0.15) psx += (t / 0.15) * 16;
        else if (t < 0.3) psx += 16 - ((t - 0.15) / 0.15) * 16;
        if (t > 0.15 && t < 0.4) eVisible = Math.floor(t / 0.06) % 2 === 0;
      } else {
        if (t < 0.15) esx -= (t / 0.15) * 16;
        else if (t < 0.3) esx -= 16 - ((t - 0.15) / 0.15) * 16;
        if (t > 0.15 && t < 0.4) pVisible = Math.floor(t / 0.06) % 2 === 0;
      }
    }

    // Intro slide-in (~1.5 seconds)
    if (this.phase === 'intro') {
      const p = Math.min(1, this.introTimer / 1.5);
      // Ease-out for smooth deceleration
      const eased = 1 - Math.pow(1 - p, 3);
      esx = 320 + (this.enemySpriteX - 320) * eased;
      psx = -60 + (this.playerSpriteX + 60) * eased;
    }

    if (this.phase === 'catching') {
      eVisible = this.enemyVisible;
    }

    // Draw Pokemon sprites
    drawPokemonBack(ctx, this.playerMon.species.id, Math.round(psx), 76, pVisible);
    drawPokemonFront(ctx, this.enemyMon.species.id, Math.round(esx), 14, eVisible);

    // Draw hazard indicators
    this.drawHazardIndicators(ctx, Math.round(psx), 76, true);
    this.drawHazardIndicators(ctx, Math.round(esx), 14, false);

    // Draw substitute dolls
    this.drawSubstitute(ctx, Math.round(psx), 76, this.playerMon.substituteHp > 0);
    this.drawSubstitute(ctx, Math.round(esx), 14, this.enemyMon.substituteHp > 0);

    // Shiny sparkle particles
    if (this.shinyParticles.length > 0) {
      for (const p of this.shinyParticles) {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
        // Draw a small star/diamond shape
        const cx = p.x;
        const cy = p.y;
        const s = p.size * alpha;
        ctx.beginPath();
        ctx.moveTo(cx, cy - s);
        ctx.lineTo(cx + s * 0.4, cy - s * 0.4);
        ctx.lineTo(cx + s, cy);
        ctx.lineTo(cx + s * 0.4, cy + s * 0.4);
        ctx.lineTo(cx, cy + s);
        ctx.lineTo(cx - s * 0.4, cy + s * 0.4);
        ctx.lineTo(cx - s, cy);
        ctx.lineTo(cx - s * 0.4, cy - s * 0.4);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Type-colored attack flash
    if (this.anim.active) {
      BattleUI.drawAttackFlash(ctx, this.anim.moveType, this.anim.timer, this.anim.isPlayer);
      if (this.anim.critical) {
        BattleUI.drawCriticalEffect(ctx, this.anim.timer, this.anim.isPlayer);
      }
    }

    // Draw catch ball
    if (this.phase === 'catching' && this.catchTimer < 0.6 + this.catchTargetShakes * 0.5 + 0.5) {
      if (this.catchTimer > 0.1) {
        const wobble = this.catchTimer > 0.6
          ? Math.sin((this.catchTimer - 0.6) * 12) * 0.3
          : 0;
        BattleUI.drawPokeball(ctx, this.catchBallX, this.catchBallY, wobble);
      }
    }

    // Draw info boxes with status
    BattleUI.drawEnemyInfo(ctx, this.enemyMon.name, this.enemyMon.level, this.enemyDisplayHp / this.enemyMon.maxHp, this.enemyMon.status);

    // Shiny star indicator next to enemy name
    if (this.enemyMon.isShiny) {
      ctx.fillStyle = '#f8d830';
      ctx.font = 'bold 8px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText('\u2605', 8 + 6 + ctx.measureText(this.enemyMon.name).width + 3, 8 + 4);
    }

    BattleUI.drawPlayerInfo(
      ctx,
      this.playerMon.name,
      this.playerMon.level,
      this.playerDisplayHp,
      this.playerMon.maxHp,
      this.playerDisplayHp / this.playerMon.maxHp,
      this.playerDisplayExp,
      this.playerMon.status,
      this.playerMon.ability?.name,
      this.playerMon.heldItem?.name,
    );

    // Trainer team indicator
    if (this.isTrainerBattle) {
      this.drawTrainerBalls(ctx);
    }

    // Draw bottom UI based on phase
    switch (this.phase) {
      case 'intro':
      case 'message':
      case 'animating':
      case 'exp':
      case 'catching':
        BattleUI.drawTextBox(ctx, this.msgText, this.msgCharIdx);
        break;
      case 'action':
        BattleUI.drawActionPrompt(ctx, this.playerMon.name);
        BattleUI.drawActionMenu(ctx, this.cursor);
        break;
      case 'moves':
        BattleUI.drawMoveMenu(ctx, this.playerMon.moves, this.cursor, this.enemyMon.species.types as PokemonType[]);
        break;
      case 'bag':
        BattleUI.drawBagMenu(ctx, this.gameState.inventory, this.cursor);
        break;
      case 'result':
        BattleUI.drawTextBox(ctx, this.battleWon ? 'You won!' : 'You blacked out!', 999);
        break;
    }

    // Flash overlay (intro effect)
    if (this.flashAlpha > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.flashAlpha})`;
      ctx.fillRect(0, 0, 320, 240);
    }

    // Render damage numbers
    for (const dn of this.damageNumbers) {
      DamageNumbers.render(ctx, dn);
    }

    // Render heal particles
    HealParticles.render(ctx, this.healParticles);

    // Render stat change text
    for (const sct of this.statChangeTexts) {
      StatChangeHelper.render(ctx, sct);
    }

    // Render status particles
    StatusParticles.render(ctx, this.statusParticles);

    // Restore screen shake transform
    if (this.screenShake > 0) {
      ctx.restore();
    }
  }

  private renderEvolution(ctx: CanvasRenderingContext2D) {
    // Dark background
    ctx.fillStyle = '#081820';
    ctx.fillRect(0, 0, 320, 240);

    if (this.evolvingMon) {
      // Flashing sprite
      const flash = Math.sin(this.evolveTimer * 10) > 0;
      const id = this.evolvingMon.species.id;
      const targetKey = this.evolvingMon.evolutionTarget;
      const targetId = targetKey ? (SPECIES_LOOKUP[targetKey] ?? id) : id;

      // Alternate between old and new sprite
      const showNew = this.evolveTimer > 1.5 && flash;
      const spriteId = showNew ? targetId : id;

      // White glow effect
      const glowAlpha = 0.3 + Math.sin(this.evolveTimer * 6) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${glowAlpha})`;
      ctx.fillRect(100, 30, 120, 120);

      drawPokemonFront(ctx, spriteId, 128, 50);

      // Text
      ctx.fillStyle = '#f8f8f0';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.evolvingMon.name} is evolving!`, 160, 190);
      ctx.textAlign = 'left';
    }
  }

  private renderLearnMove(ctx: CanvasRenderingContext2D) {
    const FONT = 'bold 9px monospace';
    const FONT_SM = 'bold 8px monospace';
    const dark = '#081820';

    ctx.fillStyle = '#e8e0d0';
    ctx.fillRect(4, 4, 312, 232);
    ctx.strokeStyle = dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 312, 232);

    ctx.fillStyle = dark;
    ctx.font = 'bold 11px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    const moveData = MOVES[this.learnMoveKey];
    if (!moveData || !this.learnMoveMon) return;

    if (!this.learnMoveConfirm) {
      // "Want to learn X?"
      ctx.fillText(`${this.learnMoveMon.name} wants to learn`, 160, 20);
      ctx.fillStyle = '#f08030';
      ctx.fillText(moveData.name, 160, 40);
      ctx.fillStyle = dark;
      ctx.fillText('Forget a move to make room?', 160, 70);

      // Yes / No
      const options = ['YES', 'NO'];
      for (let i = 0; i < 2; i++) {
        const x = 110 + i * 100;
        const y = 110;
        if (i === this.cursor) {
          ctx.fillStyle = '#c8d8a8';
          ctx.fillRect(x - 30, y - 4, 60, 22);
          ctx.fillStyle = dark;
          ctx.font = FONT;
          ctx.fillText('\u25b6', x - 26, y);
        }
        ctx.fillStyle = dark;
        ctx.font = FONT;
        ctx.textAlign = 'center';
        ctx.fillText(options[i], x, y);
      }

      // New move info
      ctx.textAlign = 'left';
      ctx.font = FONT_SM;
      ctx.fillStyle = '#606060';
      ctx.fillText(`Type: ${moveData.type.toUpperCase()}  POW: ${moveData.power || '-'}  ACC: ${moveData.accuracy}`, 60, 150);
    } else {
      // Select which move to forget
      ctx.fillText('Which move should be forgotten?', 160, 12);
      ctx.textAlign = 'left';

      for (let i = 0; i < this.learnMoveMon.moves.length; i++) {
        const m = this.learnMoveMon.moves[i];
        const y = 40 + i * 32;
        if (i === this.cursor) {
          ctx.fillStyle = '#c8d8a8';
          ctx.fillRect(12, y - 2, 296, 28);
          ctx.fillStyle = dark;
          ctx.font = FONT;
          ctx.fillText('\u25b6', 16, y + 4);
        }
        ctx.fillStyle = dark;
        ctx.font = FONT;
        ctx.fillText(m.data.name, 32, y + 4);
        ctx.font = FONT_SM;
        ctx.fillStyle = '#606060';
        ctx.fillText(`${m.data.type.toUpperCase()}  POW:${m.data.power || '-'}  PP:${m.pp}/${m.data.maxPp}`, 32, y + 16);
      }

      // New move option (highlighted differently)
      const newY = 40 + 4 * 32;
      ctx.fillStyle = '#f0e0c0';
      ctx.fillRect(12, newY - 2, 296, 28);
      ctx.fillStyle = dark;
      ctx.font = FONT_SM;
      ctx.fillText('NEW:', 16, newY + 4);
      ctx.fillStyle = '#c04040';
      ctx.font = FONT;
      ctx.fillText(moveData.name, 50, newY + 4);
      ctx.font = FONT_SM;
      ctx.fillStyle = '#606060';
      ctx.fillText(`${moveData.type.toUpperCase()}  POW:${moveData.power || '-'}  ACC:${moveData.accuracy}`, 50, newY + 16);

      // Cancel option
      if (this.cursor === 4) {
        ctx.fillStyle = dark;
        ctx.font = FONT;
        ctx.fillText('\u25b6', 16, newY + 34);
      }
      ctx.fillStyle = dark;
      ctx.font = FONT;
      ctx.fillText('CANCEL', 32, newY + 34);
    }
    ctx.textAlign = 'left';
  }

  private drawHazardIndicators(ctx: CanvasRenderingContext2D, spriteX: number, spriteY: number, isPlayer: boolean) {
    const hazards = isPlayer ? this.playerHazards : this.enemyHazards;
    let offsetX = 0;
    
    ctx.font = 'bold 7px monospace';
    ctx.textBaseline = 'top';
    
    if (hazards.spikes > 0) {
      ctx.fillStyle = '#a0a0a0';
      const spikeText = hazards.spikes === 1 ? '▲' : hazards.spikes === 2 ? '▲▲' : '▲▲▲';
      ctx.fillText(spikeText, spriteX + offsetX, spriteY + 55);
      offsetX += 15;
    }
    
    if (hazards.stealthRock) {
      ctx.fillStyle = '#b08050';
      ctx.fillText('◆', spriteX + offsetX, spriteY + 55);
      offsetX += 10;
    }
    
    if (hazards.toxicSpikes > 0) {
      ctx.fillStyle = '#a040a0';
      const toxicText = hazards.toxicSpikes === 1 ? '◇' : '◇◇';
      ctx.fillText(toxicText, spriteX + offsetX, spriteY + 55);
    }
  }

  private drawSubstitute(ctx: CanvasRenderingContext2D, spriteX: number, spriteY: number, hasSubstitute: boolean) {
    if (!hasSubstitute) return;
    
    ctx.fillStyle = '#c8a878';
    ctx.beginPath();
    ctx.arc(spriteX + 32, spriteY + 45, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#a88858';
    ctx.beginPath();
    ctx.arc(spriteX + 28, spriteY + 42, 3, 0, Math.PI * 2);
    ctx.arc(spriteX + 36, spriteY + 42, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#f8d830';
    ctx.font = 'bold 8px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('SUB', spriteX + 22, spriteY + 52);
  }

  private drawTrainerBalls(ctx: CanvasRenderingContext2D) {
    // Show small pokeball indicators for trainer's remaining pokemon
    const totalMons = this.trainerTeam.length;
    for (let i = 0; i < totalMons; i++) {
      const x = 160 + i * 12;
      const y = 86;
      const alive = this.trainerTeam[i].isAlive;
      ctx.fillStyle = alive ? '#e04040' : '#808080';
      ctx.fillRect(x, y, 8, 8);
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(x, y + 3, 8, 2);
      ctx.fillRect(x + 3, y + 2, 2, 4);
    }
  }
}

// Quick lookup for species IDs by key (for evolution rendering)
import { SPECIES } from './data';
const SPECIES_LOOKUP: Record<string, number> = {};
for (const [key, data] of Object.entries(SPECIES)) {
  SPECIES_LOOKUP[key] = (data as { id: number }).id;
}
