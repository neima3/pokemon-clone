const TILE = 16;

export class Camera {
  x = 0;
  y = 0;

  constructor(
    private viewW: number,
    private viewH: number,
    private mapW: number,
    private mapH: number,
  ) {}

  follow(px: number, py: number) {
    // Center on target
    this.x = px + TILE / 2 - this.viewW / 2;
    this.y = py + TILE / 2 - this.viewH / 2;

    // Clamp to map bounds
    const maxX = this.mapW * TILE - this.viewW;
    const maxY = this.mapH * TILE - this.viewH;
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));

    // Round to avoid sub-pixel blur
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }
}
