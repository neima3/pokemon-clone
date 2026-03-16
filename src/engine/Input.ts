export type Direction = 'up' | 'down' | 'left' | 'right';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

export class Input {
  private held = new Set<Direction>();
  private queue: Direction[] = [];

  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown(e: KeyboardEvent) {
    const dir = KEY_MAP[e.key];
    if (dir) {
      e.preventDefault();
      if (!this.held.has(dir)) {
        this.held.add(dir);
        this.queue.push(dir);
      }
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    const dir = KEY_MAP[e.key];
    if (dir) {
      this.held.delete(dir);
      this.queue = this.queue.filter((d) => d !== dir);
    }
  }

  /** Returns the most recently pressed direction that is still held, or null. */
  getDirection(): Direction | null {
    // Clean stale entries
    this.queue = this.queue.filter((d) => this.held.has(d));
    return this.queue.length > 0 ? this.queue[this.queue.length - 1] : null;
  }
}
