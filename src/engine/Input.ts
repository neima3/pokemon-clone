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
  private pressed = new Set<string>();
  private shiftHeld = false;

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
    if (e.key === 'Shift') this.shiftHeld = true;
    const dir = KEY_MAP[e.key];
    if (dir) {
      e.preventDefault();
      if (!this.held.has(dir)) {
        this.held.add(dir);
        this.queue.push(dir);
      }
    }
    if (!e.repeat) {
      this.pressed.add(e.key);
    }
    // Prevent scrolling for space/arrows
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'm', 'M'].includes(e.key)) {
      e.preventDefault();
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Shift') this.shiftHeld = false;
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

  /** Returns a direction if one was just pressed (consumed on read). For menus. */
  getDirectionPressed(): Direction | null {
    for (const [key, dir] of Object.entries(KEY_MAP)) {
      if (this.pressed.has(key)) {
        for (const [k2, d2] of Object.entries(KEY_MAP)) {
          if (d2 === dir) this.pressed.delete(k2);
        }
        return dir;
      }
    }
    return null;
  }

  /** Returns true if action key (Z/Enter/Space) was just pressed. Consumed on read. */
  getActionPressed(): boolean {
    const keys = ['z', 'Z', 'Enter', ' '];
    for (const k of keys) {
      if (this.pressed.has(k)) {
        keys.forEach((k2) => this.pressed.delete(k2));
        return true;
      }
    }
    return false;
  }

  /** Returns true if cancel key (X/Backspace/Escape) was just pressed. Consumed on read. */
  getCancelPressed(): boolean {
    const keys = ['x', 'X', 'Backspace', 'Escape'];
    for (const k of keys) {
      if (this.pressed.has(k)) {
        keys.forEach((k2) => this.pressed.delete(k2));
        return true;
      }
    }
    return false;
  }

  /** Returns true if menu key (M) was just pressed. Consumed on read. */
  getMenuPressed(): boolean {
    const keys = ['m', 'M'];
    for (const k of keys) {
      if (this.pressed.has(k)) {
        keys.forEach((k2) => this.pressed.delete(k2));
        return true;
      }
    }
    return false;
  }

  /** Returns true if Shift is held (running shoes) */
  isRunning(): boolean {
    return this.shiftHeld;
  }

  /** Returns true if run toggle key (B) was just pressed. Consumed on read. */
  getRunTogglePressed(): boolean {
    const keys = ['b', 'B'];
    for (const k of keys) {
      if (this.pressed.has(k)) {
        keys.forEach((k2) => this.pressed.delete(k2));
        return true;
      }
    }
    return false;
  }

  /** Clear all buffered input. Call when switching scenes. */
  clear() {
    this.held.clear();
    this.queue = [];
    this.pressed.clear();
  }
}
