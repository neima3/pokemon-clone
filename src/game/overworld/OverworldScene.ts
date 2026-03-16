import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { Player } from './Player';
import { Camera } from './Camera';
import { MAP_DATA, MAP_WIDTH, MAP_HEIGHT } from './mapData';
import { Tile, drawTile, isSolid, COLORS } from './tiles';
import { GameState } from '../GameState';

/** Native GB resolution: 160x144. We use 320x240 (20x15 tiles) for more room. */
export const VIEW_W = 320;
export const VIEW_H = 240;

const ENCOUNTER_RATE = 0.15;

export class OverworldScene implements Scene {
  private input: Input;
  private player: Player;
  private camera: Camera;
  private onEncounter?: () => void;
  private gameState?: GameState;
  private frozen = false;

  constructor(input: Input, onEncounter?: () => void, gameState?: GameState) {
    this.input = input;
    this.onEncounter = onEncounter;
    this.gameState = gameState;

    // Restore position from gameState if available
    const startX = gameState?.playerPosition.x ?? 4;
    const startY = gameState?.playerPosition.y ?? 4;
    this.player = new Player(startX, startY);
    this.camera = new Camera(VIEW_W, VIEW_H, MAP_WIDTH, MAP_HEIGHT);
  }

  onEnter() {
    this.input.clear();
    this.frozen = false;

    // Restore position from gameState on re-enter
    if (this.gameState) {
      this.player.setPosition(this.gameState.playerPosition.x, this.gameState.playerPosition.y);
    }
  }

  onExit() {
    // Save position
    if (this.gameState) {
      this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
    }
  }

  update(dt: number) {
    if (this.frozen) return;

    const wasMoving = this.player.isMoving;

    if (!this.player.isMoving) {
      const dir = this.input.getDirection();
      if (dir) {
        this.player.tryMove(dir, (gx, gy) => {
          if (gx < 0 || gy < 0 || gx >= MAP_WIDTH || gy >= MAP_HEIGHT) return false;
          const tile = MAP_DATA[gy * MAP_WIDTH + gx];
          return !isSolid(tile);
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

  private checkEncounter() {
    const tile = MAP_DATA[this.player.gy * MAP_WIDTH + this.player.gx];
    if (tile === Tile.TallGrass && Math.random() < ENCOUNTER_RATE) {
      this.frozen = true;
      // Save position before encounter
      if (this.gameState) {
        this.gameState.playerPosition = { x: this.player.gx, y: this.player.gy };
      }
      this.onEncounter?.();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Clear
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const cx = this.camera.x;
    const cy = this.camera.y;

    // Calculate visible tile range
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

    // Draw player
    ctx.save();
    ctx.translate(-cx, -cy);
    this.player.draw(ctx);
    ctx.restore();
  }
}
