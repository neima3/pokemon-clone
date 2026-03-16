/**
 * Screen transition effects for battle encounters and scene changes.
 */

export type TransitionType = 'battle-enter' | 'fade' | 'none';

export class TransitionEffect {
  private type: TransitionType = 'none';
  private timer = 0;
  private duration = 0;
  private callback: (() => void) | null = null;
  private phase: 'in' | 'out' | 'none' = 'none';

  get active() {
    return this.phase !== 'none';
  }

  /** Start a battle encounter transition (flash + closing bars) */
  battleEnter(onMidpoint: () => void) {
    this.type = 'battle-enter';
    this.timer = 0;
    this.duration = 1.2;
    this.callback = onMidpoint;
    this.phase = 'in';
  }

  /** Simple fade to black and back */
  fade(duration: number, onMidpoint: () => void) {
    this.type = 'fade';
    this.timer = 0;
    this.duration = duration;
    this.callback = onMidpoint;
    this.phase = 'in';
  }

  update(dt: number) {
    if (this.phase === 'none') return;
    this.timer += dt;

    const mid = this.duration / 2;
    if (this.phase === 'in' && this.timer >= mid) {
      this.phase = 'out';
      this.callback?.();
      this.callback = null;
    }
    if (this.timer >= this.duration) {
      this.phase = 'none';
      this.type = 'none';
    }
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (this.phase === 'none') return;

    const mid = this.duration / 2;

    switch (this.type) {
      case 'battle-enter':
        this.renderBattleEnter(ctx, w, h, mid);
        break;
      case 'fade':
        this.renderFade(ctx, w, h, mid);
        break;
    }
  }

  private renderBattleEnter(ctx: CanvasRenderingContext2D, w: number, h: number, mid: number) {
    if (this.phase === 'in') {
      // Phase 1: Rapid flashing (0 to 0.3)
      if (this.timer < 0.3) {
        const flash = Math.floor(this.timer / 0.05) % 2 === 0;
        if (flash) {
          ctx.fillStyle = '#f8f8f8';
          ctx.fillRect(0, 0, w, h);
        }
      }
      // Phase 2: Horizontal bars closing (0.3 to mid)
      else {
        const t = (this.timer - 0.3) / (mid - 0.3);
        const barH = (h / 2) * Math.min(1, t);
        ctx.fillStyle = '#081820';
        ctx.fillRect(0, 0, w, barH);
        ctx.fillRect(0, h - barH, w, barH);
      }
    } else {
      // Phase out: bars opening
      const t = (this.timer - mid) / mid;
      const barH = (h / 2) * Math.max(0, 1 - t * 2);
      if (barH > 0) {
        ctx.fillStyle = '#081820';
        ctx.fillRect(0, 0, w, barH);
        ctx.fillRect(0, h - barH, w, barH);
      }
    }
  }

  private renderFade(ctx: CanvasRenderingContext2D, w: number, h: number, mid: number) {
    let alpha: number;
    if (this.phase === 'in') {
      alpha = Math.min(1, this.timer / mid);
    } else {
      alpha = Math.max(0, 1 - (this.timer - mid) / mid);
    }
    ctx.fillStyle = `rgba(8, 24, 32, ${alpha})`;
    ctx.fillRect(0, 0, w, h);
  }
}
