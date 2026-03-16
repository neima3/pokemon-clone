import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { Pokemon, MoveInstance } from './Pokemon';
import { BattleUI } from './BattleUI';
import { drawPokemonFront, drawPokemonBack } from './sprites';
import { executeMove, getEnemyMove, determineTurnOrder } from './BattleEngine';

type Phase = 'intro' | 'message' | 'action' | 'moves' | 'animating' | 'result';

export class BattleScene implements Scene {
  private input: Input;
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

  constructor(input: Input, playerMon: Pokemon, enemyMon: Pokemon, onEnd: (won: boolean) => void) {
    this.input = input;
    this.playerMon = playerMon;
    this.enemyMon = enemyMon;
    this.onEnd = onEnd;
    this.playerDisplayHp = playerMon.hp;
    this.enemyDisplayHp = enemyMon.hp;
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

    switch (this.phase) {
      case 'intro': this.updateIntro(dt); break;
      case 'message': this.updateMessage(dt); break;
      case 'action': this.updateAction(); break;
      case 'moves': this.updateMoves(); break;
      case 'animating': this.updateAnimating(dt); break;
      case 'result': this.updateResult(dt); break;
    }
  }

  private lerpHp(display: number, target: number, dt: number): number {
    if (Math.abs(display - target) < 0.5) return target;
    const speed = this.playerMon.maxHp * 0.8; // drain over ~1.2s
    if (display > target) return Math.max(target, display - speed * dt);
    return Math.min(target, display + speed * dt);
  }

  private updateIntro(dt: number) {
    this.introTimer += dt;

    // Flash effect (0 - 0.4s)
    if (this.introTimer < 0.4) {
      this.flashAlpha = Math.floor(this.introTimer / 0.08) % 2 === 0 ? 0.8 : 0;
    } else {
      this.flashAlpha = 0;
    }

    // After flash, show messages
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
    // Typewriter: ~40 chars/second
    this.msgCharIdx += dt * 40;

    if (this.input.getActionPressed()) {
      if (this.msgCharIdx < this.msgText.length) {
        // Instantly show full text
        this.msgCharIdx = this.msgText.length;
      } else {
        // Advance to next message or callback
        if (this.msgQueue.length > 0) {
          const cb = this.msgCallback;
          this.nextMessage();
          // If this was the last queued message before callback, we already set it up
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
    if (dir === 'up' || dir === 'down') {
      this.cursor = this.cursor === 0 ? 1 : 0;
    }

    if (this.input.getActionPressed()) {
      if (this.cursor === 0) {
        // FIGHT
        this.phase = 'moves';
        this.cursor = 0;
      } else {
        // RUN
        this.queueMessages(['Got away safely!'], () => {
          this.onEnd(true);
        });
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
      if (move.pp <= 0) {
        // No PP left — flash a message but stay in move select
        return;
      }
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
      // Check if defender fainted
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
        // Back to action select
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

    // Play attack animation, then show messages
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
      msgs.push('You won!');
    } else {
      msgs.push(`${fainted.name} fainted!`);
      msgs.push('You blacked out!');
    }

    this.queueMessages(msgs, () => {
      this.phase = 'result';
      this.resultTimer = 0;
    });
  }

  // ── Render ──

  render(ctx: CanvasRenderingContext2D) {
    BattleUI.drawBackground(ctx);

    // Calculate sprite positions with animation offsets
    let psx = this.playerSpriteX;
    let esx = this.enemySpriteX;
    let pVisible = this.playerVisible;
    let eVisible = this.enemyVisible;

    if (this.anim.active) {
      const t = this.anim.timer;
      if (this.anim.isPlayer) {
        // Player attacks: slides right then back
        if (t < 0.15) psx += (t / 0.15) * 16;
        else if (t < 0.3) psx += 16 - ((t - 0.15) / 0.15) * 16;
        // Enemy blinks
        if (t > 0.15 && t < 0.4) eVisible = Math.floor(t / 0.06) % 2 === 0;
      } else {
        // Enemy attacks: slides left then back
        if (t < 0.15) esx -= (t / 0.15) * 16;
        else if (t < 0.3) esx -= 16 - ((t - 0.15) / 0.15) * 16;
        // Player blinks
        if (t > 0.15 && t < 0.4) pVisible = Math.floor(t / 0.06) % 2 === 0;
      }
    }

    // Intro slide-in
    if (this.phase === 'intro') {
      const p = Math.min(1, this.introTimer / 0.5);
      esx = 320 + (this.enemySpriteX - 320) * p;
      psx = -60 + (this.playerSpriteX + 60) * p;
    }

    // Draw Pokemon sprites
    drawPokemonBack(ctx, this.playerMon.species.id, Math.round(psx), 76, pVisible);
    drawPokemonFront(ctx, this.enemyMon.species.id, Math.round(esx), 14, eVisible);

    // Draw info boxes
    BattleUI.drawEnemyInfo(ctx, this.enemyMon.name, this.enemyMon.level, this.enemyDisplayHp / this.enemyMon.maxHp);
    BattleUI.drawPlayerInfo(
      ctx,
      this.playerMon.name,
      this.playerMon.level,
      this.playerDisplayHp,
      this.playerMon.maxHp,
      this.playerDisplayHp / this.playerMon.maxHp,
    );

    // Draw bottom UI based on phase
    switch (this.phase) {
      case 'intro':
      case 'message':
      case 'animating':
        BattleUI.drawTextBox(ctx, this.msgText, this.msgCharIdx);
        break;
      case 'action':
        BattleUI.drawActionPrompt(ctx, this.playerMon.name);
        BattleUI.drawActionMenu(ctx, this.cursor);
        break;
      case 'moves':
        BattleUI.drawMoveMenu(ctx, this.playerMon.moves, this.cursor);
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
