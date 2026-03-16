export class GameLoop {
  private lastTime = 0;
  private running = false;
  private rafId = 0;
  private updateFn: (dt: number) => void;
  private renderFn: () => void;

  constructor(update: (dt: number) => void, render: () => void) {
    this.updateFn = update;
    this.renderFn = render;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.updateFn(dt);
    this.renderFn();
    this.rafId = requestAnimationFrame(this.tick);
  };
}
