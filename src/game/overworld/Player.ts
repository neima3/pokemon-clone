import { Direction } from '@/engine/Input';
import { COLORS } from './tiles';

const TILE = 16;
const SPEED = 4; // tiles per second

export class Player {
  /** Grid position */
  gx: number;
  gy: number;
  /** Pixel position (smooth movement) */
  px: number;
  py: number;
  facing: Direction = 'down';

  private moving = false;
  private targetPx = 0;
  private targetPy = 0;
  private moveProgress = 0;
  private startPx = 0;
  private startPy = 0;

  constructor(startX: number, startY: number) {
    this.gx = startX;
    this.gy = startY;
    this.px = startX * TILE;
    this.py = startY * TILE;
  }

  get isMoving() {
    return this.moving;
  }

  /** Teleport to a grid position (used for save/load) */
  setPosition(gx: number, gy: number) {
    this.gx = gx;
    this.gy = gy;
    this.px = gx * TILE;
    this.py = gy * TILE;
    this.moving = false;
  }

  /** Attempt to start a grid-based move. Returns false if already moving. */
  tryMove(dir: Direction, canMove: (gx: number, gy: number) => boolean): boolean {
    if (this.moving) return false;

    this.facing = dir;
    let nx = this.gx;
    let ny = this.gy;

    switch (dir) {
      case 'up': ny--; break;
      case 'down': ny++; break;
      case 'left': nx--; break;
      case 'right': nx++; break;
    }

    if (!canMove(nx, ny)) return false;

    this.moving = true;
    this.gx = nx;
    this.gy = ny;
    this.targetPx = nx * TILE;
    this.targetPy = ny * TILE;
    this.startPx = this.px;
    this.startPy = this.py;
    this.moveProgress = 0;
    return true;
  }

  update(dt: number) {
    if (!this.moving) return;

    this.moveProgress += dt * SPEED;
    if (this.moveProgress >= 1) {
      this.moveProgress = 1;
      this.moving = false;
    }

    this.px = this.startPx + (this.targetPx - this.startPx) * this.moveProgress;
    this.py = this.startPy + (this.targetPy - this.startPy) * this.moveProgress;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const x = Math.round(this.px);
    const y = Math.round(this.py);

    // Body
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(x + 4, y + 2, 8, 12);

    // Face/skin
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(x + 5, y + 3, 6, 5);

    // Eyes based on facing
    ctx.fillStyle = COLORS.dark;
    switch (this.facing) {
      case 'down':
        ctx.fillRect(x + 6, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
        break;
      case 'up':
        // back of head — no eyes
        ctx.fillStyle = COLORS.mid;
        ctx.fillRect(x + 5, y + 3, 6, 5);
        break;
      case 'left':
        ctx.fillRect(x + 5, y + 5, 2, 2);
        break;
      case 'right':
        ctx.fillRect(x + 9, y + 5, 2, 2);
        break;
    }

    // Hat
    ctx.fillStyle = COLORS.flower;
    ctx.fillRect(x + 3, y + 1, 10, 3);

    // Legs (animate slightly when moving)
    const legOffset = this.moving ? Math.floor(this.moveProgress * 4) % 2 : 0;
    ctx.fillStyle = COLORS.mid;
    ctx.fillRect(x + 5, y + 13, 3, 3);
    ctx.fillRect(x + 9 - legOffset, y + 13, 3, 3);
  }
}
