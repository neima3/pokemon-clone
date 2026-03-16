import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { SFX, Music } from '@/engine/Audio';
import { Player } from './Player';
import { Camera } from './Camera';
import { MAP_DATA, MAP_WIDTH, MAP_HEIGHT, MAP_NPCS, getRouteZone } from './mapData';
import { Tile, drawTile, isSolid, isInteractable, COLORS, updateTileAnim } from './tiles';
import { GameState, Inventory } from '../GameState';
import { NPC } from './NPC';
import { rollEncounter, ITEMS, TRAINERS } from '../battle/data';

/** Native GB resolution: 160x144. We use 320x240 (20x15 tiles) for more room. */
export const VIEW_W = 320;
export const VIEW_H = 240;

const ENCOUNTER_RATE = 0.15;
const FONT = 'bold 9px monospace';
const FONT_SM = 'bold 8px monospace';

type OverworldPhase = 'explore' | 'dialogue' | 'shop' | 'heal';

export class OverworldScene implements Scene {
  private input: Input;
  private player: Player;
  private camera: Camera;
  private onEncounter?: (speciesKey: string, level: number) => void;
  private onTrainerBattle?: (trainerId: string, npcId: string) => void;
  private gameState: GameState;
  private frozen = false;

  // NPCs
  private npcs: NPC[] = [];

  // Dialogue state
  private phase: OverworldPhase = 'explore';
  private dialogueTexts: string[] = [];
  private dialogueIndex = 0;
  private dialogueCharIdx = 0;
  private dialogueCallback: (() => void) | null = null;

  // Shop state
  private shopCursor = 0;
  private shopItems: Array<{ key: keyof Inventory; name: string; price: number }> = [
    { key: 'pokeball', name: 'POKé BALL', price: 200 },
    { key: 'potion', name: 'POTION', price: 300 },
    { key: 'superPotion', name: 'SUPER POTION', price: 700 },
  ];

  // Heal animation
  private healTimer = 0;

  // HUD
  private showMiniStatus = true;

  constructor(
    input: Input,
    onEncounter: (speciesKey: string, level: number) => void,
    gameState: GameState,
    onTrainerBattle?: (trainerId: string, npcId: string) => void,
  ) {
    this.input = input;
    this.onEncounter = onEncounter;
    this.onTrainerBattle = onTrainerBattle;
    this.gameState = gameState;

    const startX = gameState.playerPosition.x;
    const startY = gameState.playerPosition.y;
    this.player = new Player(startX, startY);
    this.camera = new Camera(VIEW_W, VIEW_H, MAP_WIDTH, MAP_HEIGHT);

    // Create NPCs
    this.npcs = MAP_NPCS.map((data) => new NPC(data));
  }

  onEnter() {
    this.input.clear();
    this.frozen = false;
    this.phase = 'explore';

    if (this.gameState) {
      this.player.setPosition(this.gameState.playerPosition.x, this.gameState.playerPosition.y);
    }

    // Refresh NPC defeated states
    for (const npc of this.npcs) {
      if (npc.data.trainerId && this.gameState.isTrainerDefeated(npc.data.trainerId)) {
        npc.defeated = true;
      }
    }

    Music.overworld();
  }

  onExit() {
    if (this.gameState) {
      this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
    }
  }

  update(dt: number) {
    updateTileAnim(dt);

    switch (this.phase) {
      case 'explore':
        this.updateExplore(dt);
        break;
      case 'dialogue':
        this.updateDialogue(dt);
        break;
      case 'shop':
        this.updateShop();
        break;
      case 'heal':
        this.updateHeal(dt);
        break;
    }
  }

  private updateExplore(dt: number) {
    if (this.frozen) return;

    const wasMoving = this.player.isMoving;

    if (!this.player.isMoving) {
      // Check for interaction
      if (this.input.getActionPressed()) {
        if (this.tryInteract()) return;
      }

      const dir = this.input.getDirection();
      if (dir) {
        this.player.tryMove(dir, (gx, gy) => {
          if (gx < 0 || gy < 0 || gx >= MAP_WIDTH || gy >= MAP_HEIGHT) return false;
          const tile = MAP_DATA[gy * MAP_WIDTH + gx];
          if (isSolid(tile)) return false;
          // Check NPC collision
          if (this.npcs.some((n) => n.gx === gx && n.gy === gy)) return false;
          return true;
        });
      }
    }
    this.player.update(dt);

    // Check for encounter when player finishes a step
    if (wasMoving && !this.player.isMoving) {
      this.checkEncounter();
    }

    this.camera.follow(this.player.px, this.player.py);
  }

  private tryInteract(): boolean {
    // Get tile in front of player
    let fx = this.player.gx;
    let fy = this.player.gy;
    switch (this.player.facing) {
      case 'up': fy--; break;
      case 'down': fy++; break;
      case 'left': fx--; break;
      case 'right': fx++; break;
    }

    // Check for NPC
    const npc = this.npcs.find((n) => n.gx === fx && n.gy === fy);
    if (npc) {
      SFX.menuConfirm();
      npc.faceToward(this.player.gx, this.player.gy);

      // Special NPC behaviors
      if (npc.id === 'nurse') {
        this.startDialogue(npc.data.dialogue.slice(0, 2), () => {
          this.phase = 'heal';
          this.healTimer = 0;
        });
        return true;
      }

      if (npc.id === 'shopkeeper') {
        this.startDialogue(npc.data.dialogue, () => {
          this.phase = 'shop';
          this.shopCursor = 0;
        });
        return true;
      }

      // Trainer NPC
      if (npc.data.isTrainer && npc.data.trainerId && !npc.defeated) {
        this.startDialogue(npc.data.dialogue, () => {
          this.frozen = true;
          this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
          Music.stop();
          this.onTrainerBattle?.(npc.data.trainerId!, npc.id);
        });
        return true;
      }

      // Regular NPC or defeated trainer
      const dialogue = npc.defeated
        ? [npc.data.dialogue[npc.data.dialogue.length - 1]]
        : npc.data.dialogue;
      this.startDialogue(dialogue);
      return true;
    }

    // Check for sign
    if (fx >= 0 && fy >= 0 && fx < MAP_WIDTH && fy < MAP_HEIGHT) {
      const tile = MAP_DATA[fy * MAP_WIDTH + fx];
      if (tile === Tile.Sign) {
        SFX.menuSelect();
        // Context-sensitive sign text
        const zone = getRouteZone(fx, fy);
        if (zone === 'town') {
          this.startDialogue(['PALLET TOWN', 'A quiet place to start your journey.']);
        } else if (zone === 'route1') {
          this.startDialogue(['ROUTE 1', 'Wild POKéMON ahead! Be prepared!']);
        } else {
          this.startDialogue(['ROUTE 2', 'Stronger POKéMON live here.']);
        }
        return true;
      }

      // Check for building doors
      if (tile === Tile.PokeCenterDoor) {
        SFX.menuConfirm();
        this.startDialogue(['Welcome to the POKéMON CENTER!', 'We\'ll heal your POKéMON to full health!'], () => {
          this.phase = 'heal';
          this.healTimer = 0;
        });
        return true;
      }
      if (tile === Tile.MartDoor) {
        SFX.menuConfirm();
        this.startDialogue(['Welcome to the POKé MART!'], () => {
          this.phase = 'shop';
          this.shopCursor = 0;
        });
        return true;
      }
    }

    return false;
  }

  private startDialogue(texts: string[], callback?: () => void) {
    this.phase = 'dialogue';
    this.dialogueTexts = texts;
    this.dialogueIndex = 0;
    this.dialogueCharIdx = 0;
    this.dialogueCallback = callback ?? null;
  }

  private updateDialogue(dt: number) {
    this.dialogueCharIdx += dt * 40;

    if (this.input.getActionPressed()) {
      const currentText = this.dialogueTexts[this.dialogueIndex];
      if (this.dialogueCharIdx < currentText.length) {
        this.dialogueCharIdx = currentText.length;
      } else if (this.dialogueIndex < this.dialogueTexts.length - 1) {
        this.dialogueIndex++;
        this.dialogueCharIdx = 0;
      } else {
        if (this.dialogueCallback) {
          const cb = this.dialogueCallback;
          this.dialogueCallback = null;
          cb();
        } else {
          this.phase = 'explore';
        }
      }
    }
  }

  private updateShop() {
    const dir = this.input.getDirectionPressed();
    const totalItems = this.shopItems.length + 1; // +1 for EXIT

    if (dir === 'up' && this.shopCursor > 0) this.shopCursor--;
    if (dir === 'down' && this.shopCursor < totalItems - 1) this.shopCursor++;

    if (this.input.getCancelPressed()) {
      SFX.menuCancel();
      this.phase = 'explore';
      return;
    }

    if (this.input.getActionPressed()) {
      if (this.shopCursor >= this.shopItems.length) {
        SFX.menuCancel();
        this.phase = 'explore';
        return;
      }

      const item = this.shopItems[this.shopCursor];
      if (this.gameState.spendMoney(item.price)) {
        this.gameState.inventory[item.key]++;
        SFX.purchase();
        this.gameState.save();
      } else {
        SFX.bump();
      }
    }
  }

  private updateHeal(dt: number) {
    this.healTimer += dt;
    if (this.healTimer >= 1.5) {
      this.gameState.healTeam();
      this.gameState.save();
      SFX.heal();
      this.startDialogue(['Your POKéMON are fully healed!', 'Come back anytime!']);
    }
  }

  private checkEncounter() {
    const tile = MAP_DATA[this.player.gy * MAP_WIDTH + this.player.gx];
    if (tile === Tile.TallGrass && Math.random() < ENCOUNTER_RATE) {
      this.frozen = true;
      if (this.gameState) {
        this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
      }
      Music.stop();
      SFX.encounter();
      const zone = getRouteZone(this.player.gx, this.player.gy);
      const encounter = rollEncounter(zone);
      // Small delay for the encounter SFX to play
      setTimeout(() => {
        this.onEncounter?.(encounter.species, encounter.level);
      }, 400);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const cx = this.camera.x;
    const cy = this.camera.y;

    const startCol = Math.max(0, Math.floor(cx / 16));
    const startRow = Math.max(0, Math.floor(cy / 16));
    const endCol = Math.min(MAP_WIDTH - 1, Math.floor((cx + VIEW_W) / 16));
    const endRow = Math.min(MAP_HEIGHT - 1, Math.floor((cy + VIEW_H) / 16));

    // Draw tiles
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const tile = MAP_DATA[row * MAP_WIDTH + col] as Tile;
        const px = col * 16 - cx;
        const py = row * 16 - cy;
        drawTile(ctx, tile, px, py);
      }
    }

    // Draw NPCs
    ctx.save();
    ctx.translate(-cx, -cy);
    for (const npc of this.npcs) {
      // Only draw if in view
      const npx = npc.gx * 16;
      const npy = npc.gy * 16;
      if (npx + 16 >= cx && npx < cx + VIEW_W && npy + 16 >= cy && npy < cy + VIEW_H) {
        npc.draw(ctx);
        // Draw exclamation mark over undefeated trainers
        if (npc.data.isTrainer && !npc.defeated) {
          ctx.fillStyle = '#f85830';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('!', npx + 8, npy - 2);
          ctx.textAlign = 'left';
        }
      }
    }

    // Draw player
    this.player.draw(ctx);
    ctx.restore();

    // Draw HUD
    this.drawHUD(ctx);

    // Draw dialogue box
    if (this.phase === 'dialogue') {
      this.drawDialogueBox(ctx);
    }

    // Draw shop menu
    if (this.phase === 'shop') {
      this.drawShopMenu(ctx);
    }

    // Draw heal animation
    if (this.phase === 'heal') {
      this.drawHealAnim(ctx);
    }
  }

  private drawHUD(ctx: CanvasRenderingContext2D) {
    if (!this.showMiniStatus || this.phase !== 'explore') return;

    const lead = this.gameState.leadPokemon;
    if (!lead) return;

    // Zone indicator
    const zone = getRouteZone(this.player.gx, this.player.gy);
    const zoneName = zone === 'town' ? 'PALLET TOWN' : zone === 'route1' ? 'ROUTE 1' : 'ROUTE 2';

    ctx.fillStyle = 'rgba(8, 24, 32, 0.7)';
    ctx.fillRect(2, 2, 100, 12);
    ctx.fillStyle = COLORS.bg;
    ctx.font = 'bold 7px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(zoneName, 6, 4);

    // Money
    ctx.fillStyle = 'rgba(8, 24, 32, 0.7)';
    ctx.fillRect(VIEW_W - 72, 2, 70, 12);
    ctx.fillStyle = '#f8d870';
    ctx.fillText(`¥${this.gameState.money}`, VIEW_W - 68, 4);
  }

  private drawDialogueBox(ctx: CanvasRenderingContext2D) {
    const bx = 4, by = VIEW_H - 60, bw = VIEW_W - 8, bh = 56;

    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    const text = this.dialogueTexts[this.dialogueIndex];
    const shown = text.substring(0, Math.floor(this.dialogueCharIdx));

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    // Word wrap
    const lines = wrapText(shown, 38);
    for (let i = 0; i < lines.length && i < 2; i++) {
      ctx.fillText(lines[i], bx + 10, by + 8 + i * 16);
    }

    // Blinking advance indicator
    if (this.dialogueCharIdx >= text.length && Math.floor(Date.now() / 400) % 2 === 0) {
      ctx.fillText('\u25bc', bx + bw - 18, by + bh - 16);
    }
  }

  private drawShopMenu(ctx: CanvasRenderingContext2D) {
    const bx = 40, by = 20, bw = VIEW_W - 80, bh = 160;

    // Background
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Title
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText('POKé MART', bx + bw / 2, by + 6);

    // Money display
    ctx.fillStyle = '#f8d870';
    ctx.font = FONT_SM;
    ctx.fillText(`Money: ¥${this.gameState.money}`, bx + bw / 2, by + 20);
    ctx.textAlign = 'left';

    // Items
    ctx.font = FONT;
    for (let i = 0; i < this.shopItems.length; i++) {
      const item = this.shopItems[i];
      const y = by + 38 + i * 22;

      if (i === this.shopCursor) {
        ctx.fillStyle = COLORS.dark;
        ctx.fillText('\u25b6', bx + 10, y);
      }

      ctx.fillStyle = COLORS.dark;
      ctx.fillText(item.name, bx + 26, y);

      // Price
      ctx.font = FONT_SM;
      ctx.textAlign = 'right';
      ctx.fillText(`¥${item.price}`, bx + bw - 12, y + 1);

      // Current stock
      const count = this.gameState.inventory[item.key];
      ctx.fillText(`x${count}`, bx + bw - 60, y + 1);
      ctx.textAlign = 'left';
      ctx.font = FONT;
    }

    // EXIT
    const exitY = by + 38 + this.shopItems.length * 22;
    if (this.shopCursor === this.shopItems.length) {
      ctx.fillStyle = COLORS.dark;
      ctx.fillText('\u25b6', bx + 10, exitY);
    }
    ctx.fillStyle = COLORS.dark;
    ctx.fillText('EXIT', bx + 26, exitY);

    // Instructions
    ctx.font = 'bold 7px monospace';
    ctx.fillStyle = COLORS.mid;
    ctx.textAlign = 'center';
    ctx.fillText('Z: Buy  X: Exit', bx + bw / 2, by + bh - 14);
    ctx.textAlign = 'left';
  }

  private drawHealAnim(ctx: CanvasRenderingContext2D) {
    // Pulsing overlay
    const alpha = 0.3 + Math.sin(this.healTimer * 8) * 0.2;
    ctx.fillStyle = `rgba(255, 160, 160, ${alpha})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Centered text
    ctx.fillStyle = '#f8f8f0';
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Healing your POKéMON...', VIEW_W / 2, VIEW_H / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (line.length + word.length + 1 > maxChars && line.length > 0) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
