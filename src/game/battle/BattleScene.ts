import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { Pokemon, MoveInstance } from './Pokemon';
import { BattleUI } from './BattleUI';
import { drawPokemonFront, drawPokemonBack } from './sprites';
import { executeMove, getEnemyMove, determineTurnOrder, attemptCatch } from './BattleEngine';
import { calculateExpGain, ITEMS, MOVES } from './data';
import { GameState, Inventory } from '../GameState';

type Phase =
  | 'intro' | 'message' | 'action' | 'moves'
  | 'animating' | 'result'
  | 'bag' | 'party'
  | 'catching' | 'exp';

export class BattleScene implements Scene {
  private input: Input;
  private gameState: GameState;
  private playerMon: Pokemon;
  private enemyMon: Pokemon;
  private onEnd: (won: boolean) => void;

  // Phase state
  private phase: Phase = 'intro';
  private cursor = 0;

  // Intro animation
  private introTimer = 0;

  // Message system
  private msgText = '';
  private msgCharIdx = 0;
  private msgCallback: (() => void) | null = null;
  private msgQueue: Array<{ text: string; done?: () => void }> = [];

  // Attack animation
  private anim = { active: false, isPlayer: true, timer: 0, done: () => {} };

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

  constructor(input: Input, gameState: GameState, enemyMon: Pokemon, onEnd: (won: boolean) => void) {
    this.input = input;
    this.gameState = gameState;
    this.playerMon = gameState.leadPokemon!;
    this.enemyMon = enemyMon;
    this.onEnd = onEnd;
    this.playerDisplayHp = this.playerMon.hp;
    this.enemyDisplayHp = enemyMon.hp;
    this.playerDisplayExp = this.playerMon.expPercent;
    this.activeTeamIndex = 0;
  }

  onEnter() {
    this.input.clear();
    this.phase = 'intro';
    this.introTimer = 0;
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

    switch (this.phase) {
      case 'intro': this.updateIntro(dt); break;
      case 'message': this.updateMessage(dt); break;
      case 'action': this.updateAction(); break;
      case 'moves': this.updateMoves(); break;
      case 'animating': this.updateAnimating(dt); break;
      case 'result': this.updateResult(dt); break;
      case 'bag': this.updateBag(); break;
      case 'party': this.updateParty(); break;
      case 'catching': this.updateCatching(dt); break;
      case 'exp': break; // EXP phase is message-driven
    }
  }

  private lerpHp(display: number, target: number, dt: number): number {
    if (Math.abs(display - target) < 0.5) return target;
    const speed = this.playerMon.maxHp * 0.8;
    if (display > target) return Math.max(target, display - speed * dt);
    return Math.min(target, display + speed * dt);
  }

  private updateIntro(dt: number) {
    this.introTimer += dt;

    if (this.introTimer < 0.4) {
      this.flashAlpha = Math.floor(this.introTimer / 0.08) % 2 === 0 ? 0.8 : 0;
    } else {
      this.flashAlpha = 0;
    }

    if (this.introTimer >= 0.6) {
      this.queueMessages(
        [`Wild ${this.enemyMon.name} appeared!`, `Go! ${this.playerMon.name}!`],
        () => {
          this.phase = 'action';
          this.cursor = 0;
        },
      );
    }
  }

  private updateMessage(dt: number) {
    this.msgCharIdx += dt * 40;

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
    // 2x2 grid navigation: FIGHT(0) BAG(1) / POKEMON(2) RUN(3)
    if (dir === 'up' && this.cursor >= 2) this.cursor -= 2;
    if (dir === 'down' && this.cursor < 2) this.cursor += 2;
    if (dir === 'left' && this.cursor % 2 === 1) this.cursor -= 1;
    if (dir === 'right' && this.cursor % 2 === 0) this.cursor += 1;

    if (this.input.getActionPressed()) {
      switch (this.cursor) {
        case 0: // FIGHT
          this.phase = 'moves';
          this.cursor = 0;
          break;
        case 1: // BAG
          this.openBag();
          break;
        case 2: // POKEMON
          this.openParty();
          break;
        case 3: // RUN
          this.queueMessages(['Got away safely!'], () => {
            this.onEnd(true);
          });
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

    if (this.input.getCancelPressed()) {
      this.phase = 'action';
      this.cursor = 0;
      return;
    }

    if (this.input.getActionPressed()) {
      const move = this.playerMon.moves[this.cursor];
      if (move.pp <= 0) return;
      this.executeTurn(move);
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

  private updateResult(dt: number) {
    this.resultTimer += dt;
    if (this.resultTimer > 0.5 && this.input.getActionPressed()) {
      this.onEnd(this.battleWon);
    }
  }

  // ── Bag ──

  private openBag() {
    this.bagItems = [
      { key: 'pokeball' as keyof Inventory, count: this.gameState.inventory.pokeball },
      { key: 'potion' as keyof Inventory, count: this.gameState.inventory.potion },
      { key: 'superPotion' as keyof Inventory, count: this.gameState.inventory.superPotion },
    ].filter((i) => i.count > 0);
    this.phase = 'bag';
    this.cursor = 0;
  }

  private updateBag() {
    const dir = this.input.getDirectionPressed();
    const totalItems = this.bagItems.length + 1; // +1 for CANCEL

    if (dir === 'up' && this.cursor > 0) this.cursor--;
    if (dir === 'down' && this.cursor < totalItems - 1) this.cursor++;

    if (this.input.getCancelPressed()) {
      this.phase = 'action';
      this.cursor = 1; // Return to BAG position
      return;
    }

    if (this.input.getActionPressed()) {
      if (this.cursor >= this.bagItems.length) {
        // CANCEL
        this.phase = 'action';
        this.cursor = 1;
        return;
      }

      const item = this.bagItems[this.cursor];
      if (item.key === 'pokeball') {
        this.usePokeball();
      } else {
        this.usePotion(item.key);
      }
    }
  }

  private usePokeball() {
    if (!this.gameState.useItem('pokeball')) return;

    const itemData = ITEMS.pokeball;
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

  private usePotion(key: keyof Inventory) {
    if (!this.gameState.useItem(key)) return;

    const itemData = ITEMS[key];
    const healAmount = itemData.healAmount ?? 20;
    const before = this.playerMon.hp;
    this.playerMon.hp = Math.min(this.playerMon.maxHp, this.playerMon.hp + healAmount);
    const healed = this.playerMon.hp - before;

    this.queueMessages(
      [`Used ${itemData.name}!`, `${this.playerMon.name} recovered ${healed} HP!`],
      () => {
        // Enemy turn after using item
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
    const totalOptions = this.gameState.team.length + 1; // +1 for CANCEL

    if (dir === 'up' && this.cursor > 0) this.cursor--;
    if (dir === 'down' && this.cursor < totalOptions - 1) this.cursor++;

    if (this.input.getCancelPressed()) {
      this.phase = 'action';
      this.cursor = 2; // Return to POKEMON position
      return;
    }

    if (this.input.getActionPressed()) {
      if (this.cursor >= this.gameState.team.length) {
        // CANCEL
        this.phase = 'action';
        this.cursor = 2;
        return;
      }

      const selected = this.gameState.team[this.cursor];
      if (!selected.isAlive) {
        // Can't switch to fainted Pokemon
        return;
      }
      if (this.cursor === this.activeTeamIndex) {
        // Already active
        return;
      }

      // Switch Pokemon
      const oldMon = this.playerMon;
      oldMon.resetStages();
      this.activeTeamIndex = this.cursor;
      this.playerMon = selected;
      this.playerDisplayHp = this.playerMon.hp;
      this.playerDisplayExp = this.playerMon.expPercent;

      this.queueMessages(
        [`Come back, ${oldMon.name}!`, `Go! ${this.playerMon.name}!`],
        () => {
          // Enemy turn after switching
          this.doEnemyTurn();
        },
      );
    }
  }

  // ── Catching ──

  private updateCatching(dt: number) {
    this.catchTimer += dt;

    // Phase 1 (0-0.3s): Ball flies toward enemy
    if (this.catchTimer < 0.3) {
      const t = this.catchTimer / 0.3;
      this.catchBallX = 100 + t * 110;
      this.catchBallY = 80 - Math.sin(t * Math.PI) * 40;
      this.enemyVisible = true;
    }
    // Phase 2 (0.3-0.6s): Enemy disappears, ball drops
    else if (this.catchTimer < 0.6) {
      this.enemyVisible = false;
      const t = (this.catchTimer - 0.3) / 0.3;
      this.catchBallX = 230;
      this.catchBallY = 40 + t * 30;
    }
    // Phase 3 (0.6+): Shakes
    else {
      this.catchBallX = 230;
      this.catchBallY = 70;
      const shakeTime = this.catchTimer - 0.6;
      const currentShake = Math.floor(shakeTime / 0.5);

      if (currentShake < this.catchTargetShakes) {
        this.catchShakes = currentShake;
      } else {
        // Done shaking
        if (this.catchCaught) {
          this.enemyVisible = false;
          this.queueMessages(
            [`Gotcha! ${this.enemyMon.name} was caught!`],
            () => {
              // Add to team
              const caught = new Pokemon(this.enemyMon.speciesKey, this.enemyMon.level);
              caught.hp = this.enemyMon.hp;
              if (this.gameState.addToTeam(caught)) {
                this.queueMessages(
                  [`${caught.name} was added to your team!`],
                  () => { this.phase = 'result'; this.battleWon = true; this.resultTimer = 0; },
                );
              } else {
                this.queueMessages(
                  [`But your team is full!`],
                  () => { this.phase = 'result'; this.battleWon = true; this.resultTimer = 0; },
                );
              }
            },
          );
        } else {
          this.enemyVisible = true;
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

  // ── Enemy solo turn (after using item/switching) ──

  private doEnemyTurn() {
    const enemyMove = getEnemyMove(this.enemyMon);
    if (!enemyMove) {
      this.phase = 'action';
      this.cursor = 0;
      return;
    }

    this.doAttack(this.enemyMon, this.playerMon, enemyMove, false, () => {
      if (!this.playerMon.isAlive) {
        this.handleFaint(this.playerMon);
        return;
      }
      this.phase = 'action';
      this.cursor = 0;
    });
  }

  // ── Turn execution ──

  private executeTurn(playerMove: MoveInstance) {
    const enemyMove = getEnemyMove(this.enemyMon);
    const order = determineTurnOrder(this.playerMon, this.enemyMon);

    const first = order === 'player'
      ? { mon: this.playerMon, move: playerMove, isPlayer: true }
      : { mon: this.enemyMon, move: enemyMove!, isPlayer: false };

    const second = order === 'player'
      ? { mon: this.enemyMon, move: enemyMove!, isPlayer: false }
      : { mon: this.playerMon, move: playerMove, isPlayer: true };

    this.doAttack(first.mon, first.isPlayer ? this.enemyMon : this.playerMon, first.move, first.isPlayer, () => {
      const defender = first.isPlayer ? this.enemyMon : this.playerMon;
      if (!defender.isAlive) {
        this.handleFaint(defender);
        return;
      }
      this.doAttack(second.mon, second.isPlayer ? this.enemyMon : this.playerMon, second.move, second.isPlayer, () => {
        const def2 = second.isPlayer ? this.enemyMon : this.playerMon;
        if (!def2.isAlive) {
          this.handleFaint(def2);
          return;
        }
        this.phase = 'action';
        this.cursor = 0;
      });
    });
  }

  private doAttack(attacker: Pokemon, defender: Pokemon, move: MoveInstance, isPlayer: boolean, then: () => void) {
    const result = executeMove(attacker, defender, move);
    const prefix = isPlayer ? '' : 'Wild ';
    const messages: string[] = [];

    messages.push(`${prefix}${attacker.name} used ${move.data.name}!`);

    if (result.missed) {
      messages.push(`${prefix}${attacker.name}'s attack missed!`);
    } else if (result.damage > 0) {
      if (result.effectiveness > 1) messages.push("It's super effective!");
      if (result.effectiveness < 1) messages.push("It's not very effective...");
    }
    if (result.statusMessage) {
      messages.push(result.statusMessage);
    }

    this.playAttackAnim(isPlayer, () => {
      this.queueMessages(messages, then);
    });
  }

  private playAttackAnim(isPlayer: boolean, callback: () => void) {
    this.phase = 'animating';
    this.anim = { active: true, isPlayer, timer: 0, done: callback };
  }

  private handleFaint(fainted: Pokemon) {
    const isEnemy = fainted === this.enemyMon;
    this.battleWon = isEnemy;

    const msgs: string[] = [];
    if (isEnemy) {
      msgs.push(`Wild ${fainted.name} fainted!`);

      // Calculate and award EXP
      const expGain = calculateExpGain(this.enemyMon.speciesKey, this.enemyMon.level);
      msgs.push(`${this.playerMon.name} gained ${expGain} EXP!`);

      this.queueMessages(msgs, () => {
        this.awardExp(expGain);
      });
    } else {
      msgs.push(`${fainted.name} fainted!`);

      // Check if any other team member is alive
      const nextAlive = this.gameState.team.find((p) => p.isAlive);
      if (nextAlive) {
        // Force switch
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
        msgs.push('You blacked out!');
        this.queueMessages(msgs, () => {
          this.phase = 'result';
          this.resultTimer = 0;
        });
      }
    }
  }

  private awardExp(amount: number) {
    const events = this.playerMon.gainExp(amount);
    this.playerDisplayExp = this.playerMon.expPercent;

    if (events.length === 0) {
      // No level up
      this.queueMessages(['You won!'], () => {
        this.phase = 'result';
        this.resultTimer = 0;
      });
      return;
    }

    // Level up messages
    const msgs: string[] = [];
    for (const ev of events) {
      msgs.push(`${this.playerMon.name} grew to Lv.${ev.newLevel}!`);
      for (const moveKey of ev.newMoves) {
        const moveData = MOVES[moveKey];
        if (moveData) {
          msgs.push(`${this.playerMon.name} learned ${moveData.name}!`);
        }
      }
    }
    msgs.push('You won!');

    this.playerDisplayHp = this.playerMon.hp;

    this.queueMessages(msgs, () => {
      this.phase = 'result';
      this.resultTimer = 0;
    });
  }

  // ── Render ──

  render(ctx: CanvasRenderingContext2D) {
    // Party screen is a full overlay
    if (this.phase === 'party') {
      BattleUI.drawPartyMenu(ctx, this.gameState.team, this.activeTeamIndex, this.cursor);
      return;
    }

    BattleUI.drawBackground(ctx);

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

    // Intro slide-in
    if (this.phase === 'intro') {
      const p = Math.min(1, this.introTimer / 0.5);
      esx = 320 + (this.enemySpriteX - 320) * p;
      psx = -60 + (this.playerSpriteX + 60) * p;
    }

    // During catch, override enemy visibility
    if (this.phase === 'catching') {
      eVisible = this.enemyVisible;
    }

    // Draw Pokemon sprites
    drawPokemonBack(ctx, this.playerMon.species.id, Math.round(psx), 76, pVisible);
    drawPokemonFront(ctx, this.enemyMon.species.id, Math.round(esx), 14, eVisible);

    // Draw catch ball
    if (this.phase === 'catching' && this.catchTimer < 0.6 + this.catchTargetShakes * 0.5 + 0.5) {
      if (this.catchTimer > 0.1) {
        const wobble = this.catchTimer > 0.6
          ? Math.sin((this.catchTimer - 0.6) * 12) * 0.3
          : 0;
        BattleUI.drawPokeball(ctx, this.catchBallX, this.catchBallY, wobble);
      }
    }

    // Draw info boxes
    BattleUI.drawEnemyInfo(ctx, this.enemyMon.name, this.enemyMon.level, this.enemyDisplayHp / this.enemyMon.maxHp);
    BattleUI.drawPlayerInfo(
      ctx,
      this.playerMon.name,
      this.playerMon.level,
      this.playerDisplayHp,
      this.playerMon.maxHp,
      this.playerDisplayHp / this.playerMon.maxHp,
      this.playerDisplayExp,
    );

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
        BattleUI.drawMoveMenu(ctx, this.playerMon.moves, this.cursor);
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
  }
}
