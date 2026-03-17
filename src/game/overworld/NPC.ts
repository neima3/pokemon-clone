import { drawNPCSprite } from '../battle/sprites';

export interface NPCData {
  id: string;
  gx: number;
  gy: number;
  sprite: string;
  facing: 'up' | 'down' | 'left' | 'right';
  dialogue: string[];
  isTrainer?: boolean;
  trainerId?: string;  // maps to TRAINERS key in data.ts
  blocksCave?: boolean; // NPC blocks cave entrance until post-game
}

export class NPC {
  data: NPCData;
  defeated = false;

  constructor(data: NPCData) {
    this.data = data;
  }

  get gx() { return this.data.gx; }
  get gy() { return this.data.gy; }
  get id() { return this.data.id; }

  /** Face toward a grid position */
  faceToward(gx: number, gy: number) {
    const dx = gx - this.data.gx;
    const dy = gy - this.data.gy;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.data.facing = dx > 0 ? 'right' : 'left';
    } else {
      this.data.facing = dy > 0 ? 'down' : 'up';
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const px = this.data.gx * 16;
    const py = this.data.gy * 16;
    drawNPCSprite(ctx, this.data.sprite, px, py, this.data.facing);
  }
}
