import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { SFX } from '@/engine/Audio';
import { COLORS } from './overworld/tiles';
import { drawPokemonFront } from './battle/sprites';

const W = 320;
const H = 240;
const FONT = 'bold 9px monospace';
const FONT_LG = 'bold 11px monospace';

const VERSION = 'v0.1.0';

// Pokemon IDs to cycle through on the title screen
const SHOWCASE_POKEMON = [6, 9, 3]; // Charizard, Blastoise, Venusaur
const POKEMON_CYCLE_INTERVAL = 3.0; // seconds between switches

// Pixel-art letter definitions for "POKeMON" title
// Each letter is defined as an array of [x, y, w, h] rectangles on a 5x7 grid
type PixelRect = [number, number, number, number];
const PIXEL_LETTERS: Record<string, PixelRect[]> = {
  P: [[0,0,1,7],[1,0,4,1],[4,1,1,2],[1,3,4,1],[1,1,3,1],[1,4,1,3]],
  O: [[1,0,3,1],[0,1,1,5],[4,1,1,5],[1,6,3,1]],
  K: [[0,0,1,7],[3,0,1,1],[2,1,1,1],[1,2,1,2],[2,4,1,1],[3,5,1,1],[4,6,1,1]],
  e: [[1,2,3,1],[0,3,1,2],[4,3,1,1],[1,5,3,1],[0,2,1,1],[4,2,1,1],[1,4,4,1]],
  M: [[0,0,1,7],[4,0,1,7],[1,1,1,1],[3,1,1,1],[2,2,1,1]],
  N: [[0,0,1,7],[4,0,1,7],[1,1,1,1],[2,2,1,1],[3,3,1,1]],
};

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  brightness: number;
}

export class TitleScene implements Scene {
  private input: Input;
  private onNewGame: () => void;
  private onContinue: () => void;
  private hasSave: boolean;

  private cursor = 0;
  private time = 0;
  private pokemonTimer = 0;
  private currentPokemonIndex = 0;
  private stars: Star[] = [];
  private fadeInAlpha = 0;

  constructor(
    input: Input,
    onNewGame: () => void,
    onContinue: () => void,
    hasSave: boolean,
  ) {
    this.input = input;
    this.onNewGame = onNewGame;
    this.onContinue = onContinue;
    this.hasSave = hasSave;

    // Initialize stars
    for (let i = 0; i < 30; i++) {
      this.stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() < 0.3 ? 2 : 1,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        brightness: Math.random(),
      });
    }

    // If no save, cursor starts on NEW GAME (index 0)
    // If save exists, cursor starts on CONTINUE (index 0 = CONTINUE)
    this.cursor = 0;
  }

  onEnter() {
    this.input.clear();
    this.fadeInAlpha = 0;
  }

  update(dt: number) {
    this.time += dt;
    this.pokemonTimer += dt;
    this.fadeInAlpha = Math.min(1, this.fadeInAlpha + dt * 2);

    // Cycle showcased Pokemon
    if (this.pokemonTimer >= POKEMON_CYCLE_INTERVAL) {
      this.pokemonTimer -= POKEMON_CYCLE_INTERVAL;
      this.currentPokemonIndex = (this.currentPokemonIndex + 1) % SHOWCASE_POKEMON.length;
    }

    // Update stars
    for (const star of this.stars) {
      star.brightness = 0.3 + 0.7 * ((Math.sin(this.time * star.speed * 3 + star.phase) + 1) / 2);
    }

    // Menu navigation
    const menuItems = this.getMenuItems();
    const dir = this.input.getDirectionPressed();

    if (dir === 'up' && this.cursor > 0) {
      this.cursor--;
      SFX.menuSelect();
    }
    if (dir === 'down' && this.cursor < menuItems.length - 1) {
      this.cursor++;
      SFX.menuSelect();
    }

    // Confirm selection
    if (this.input.getActionPressed()) {
      SFX.menuConfirm();
      const selected = menuItems[this.cursor];
      if (selected === 'NEW GAME') {
        this.onNewGame();
      } else if (selected === 'CONTINUE') {
        this.onContinue();
      }
    }
  }

  private getMenuItems(): string[] {
    const items: string[] = [];
    if (this.hasSave) {
      items.push('CONTINUE');
    }
    items.push('NEW GAME');
    return items;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Background
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(0, 0, W, H);

    // Stars / sparkles
    this.renderStars(ctx);

    // Decorative border lines
    ctx.fillStyle = COLORS.mid;
    ctx.fillRect(0, 0, W, 2);
    ctx.fillRect(0, H - 2, W, 2);
    ctx.fillRect(0, 0, 2, H);
    ctx.fillRect(W - 2, 0, 2, H);

    // Title with bounce animation
    this.renderTitle(ctx);

    // Pokemon showcase
    this.renderPokemon(ctx);

    // Menu
    this.renderMenu(ctx);

    // Version string
    ctx.fillStyle = COLORS.mid;
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(VERSION, W / 2, H - 8);

    // Press start prompt (blinking)
    if (Math.sin(this.time * 3) > 0) {
      ctx.fillStyle = COLORS.light;
      ctx.font = FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('Z / ENTER to select', W / 2, H - 20);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  private renderStars(ctx: CanvasRenderingContext2D) {
    for (const star of this.stars) {
      const alpha = star.brightness;
      // Cycle between dim green and bright green/white
      if (alpha > 0.7) {
        ctx.fillStyle = COLORS.bg;
      } else if (alpha > 0.4) {
        ctx.fillStyle = COLORS.light;
      } else {
        ctx.fillStyle = COLORS.mid;
      }

      ctx.fillRect(
        Math.floor(star.x),
        Math.floor(star.y),
        star.size,
        star.size,
      );

      // Cross sparkle for bright/large stars
      if (star.size === 2 && alpha > 0.6) {
        ctx.fillRect(Math.floor(star.x) - 1, Math.floor(star.y), 1, star.size);
        ctx.fillRect(Math.floor(star.x) + star.size, Math.floor(star.y), 1, star.size);
        ctx.fillRect(Math.floor(star.x), Math.floor(star.y) - 1, star.size, 1);
        ctx.fillRect(Math.floor(star.x), Math.floor(star.y) + star.size, star.size, 1);
      }
    }
  }

  private renderTitle(ctx: CanvasRenderingContext2D) {
    const titleY = 24;
    const bounce = Math.sin(this.time * 2) * 3;
    const letters = ['P', 'O', 'K', 'e', 'M', 'O', 'N'];
    const pixelSize = 3;
    const letterWidth = 5 * pixelSize + 2; // 5 grid cells + 2px gap
    const totalWidth = letters.length * letterWidth - 2;
    const startX = Math.floor((W - totalWidth) / 2);

    for (let li = 0; li < letters.length; li++) {
      const letter = letters[li];
      const letterBounce = Math.sin(this.time * 2 + li * 0.3) * 3;
      const lx = startX + li * letterWidth;
      const ly = titleY + Math.floor(letterBounce);
      const rects = PIXEL_LETTERS[letter];

      if (!rects) continue;

      // Shadow
      ctx.fillStyle = COLORS.mid;
      for (const [rx, ry, rw, rh] of rects) {
        ctx.fillRect(
          lx + rx * pixelSize + 1,
          ly + ry * pixelSize + 1,
          rw * pixelSize,
          rh * pixelSize,
        );
      }

      // Letter body — alternate yellow/gold for a classic Pokemon look
      ctx.fillStyle = '#f8d830';
      for (const [rx, ry, rw, rh] of rects) {
        ctx.fillRect(
          lx + rx * pixelSize,
          ly + ry * pixelSize,
          rw * pixelSize,
          rh * pixelSize,
        );
      }

      // Highlight on top portion
      ctx.fillStyle = '#f8f088';
      for (const [rx, ry, rw, rh] of rects) {
        if (ry < 3) {
          const highlightH = Math.min(rh, 3 - ry);
          ctx.fillRect(
            lx + rx * pixelSize,
            ly + ry * pixelSize,
            rw * pixelSize,
            Math.max(1, highlightH) * pixelSize,
          );
        }
      }
    }

    // Subtitle
    ctx.fillStyle = COLORS.light;
    ctx.font = FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('PIXEL EDITION', W / 2, titleY + 28 + Math.floor(bounce));
  }

  private renderPokemon(ctx: CanvasRenderingContext2D) {
    const pokemonId = SHOWCASE_POKEMON[this.currentPokemonIndex];

    // Draw a subtle platform/frame
    const frameX = W / 2 - 36;
    const frameY = 76;

    // Background frame
    ctx.fillStyle = COLORS.mid;
    ctx.fillRect(frameX - 2, frameY - 2, 72, 72);
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(frameX, frameY, 68, 68);

    // Inner border glow
    ctx.fillStyle = COLORS.mid;
    ctx.fillRect(frameX + 1, frameY + 1, 66, 1);
    ctx.fillRect(frameX + 1, frameY + 1, 1, 66);

    // Draw the pokemon centered in frame
    drawPokemonFront(ctx, pokemonId, frameX + 6, frameY + 4);

    // Dot indicators showing which pokemon is displayed
    const dotY = frameY + 74;
    for (let i = 0; i < SHOWCASE_POKEMON.length; i++) {
      const dotX = W / 2 - 8 + i * 8;
      ctx.fillStyle = i === this.currentPokemonIndex ? COLORS.bg : COLORS.mid;
      ctx.fillRect(dotX, dotY, 3, 3);
    }
  }

  private renderMenu(ctx: CanvasRenderingContext2D) {
    const menuItems = this.getMenuItems();
    const menuY = 170;
    const lineHeight = 18;

    ctx.font = FONT_LG;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = 0; i < menuItems.length; i++) {
      const y = menuY + i * lineHeight;
      const selected = i === this.cursor;

      if (selected) {
        // Highlight bar
        ctx.fillStyle = COLORS.mid;
        ctx.fillRect(W / 2 - 50, y - 2, 100, 16);

        // Selection arrow with bounce
        const arrowBounce = Math.sin(this.time * 5) * 2;
        ctx.fillStyle = COLORS.bg;
        ctx.font = FONT;
        ctx.textAlign = 'right';
        ctx.fillText('\u25b6', W / 2 - 36 + arrowBounce, y);
        ctx.font = FONT_LG;
        ctx.textAlign = 'center';
      }

      ctx.fillStyle = selected ? COLORS.bg : COLORS.light;
      ctx.fillText(menuItems[i], W / 2, y);
    }
  }
}
