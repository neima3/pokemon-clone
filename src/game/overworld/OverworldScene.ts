import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { Player } from './Player';
import { Camera } from './Camera';
import { MAP_DATA, MAP_WIDTH, MAP_HEIGHT } from './mapData';
import { Tile, drawTile, isSolid, COLORS } from './tiles';

/** Native GB resolution: 160×144. We use 320×240 (20×15 tiles) for more room. */
export const VIEW_W = 320;
export const VIEW_H = 240;

export class OverworldScene implements Scene {
  private input: Input;
  private player: Player;
  private camera: Camera;

  constructor(input: Input) {
    this.input = input;
    this.player = new Player(4, 4);
    this.camera = new Camera(VIEW_W, VIEW_H, MAP_WIDTH, MAP_HEIGHT);
  }

  onEnter() {}

  update(dt: number) {
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
    this.camera.follow(this.player.px, this.player.py);
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
