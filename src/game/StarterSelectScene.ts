import type { Scene } from '@/engine/Scene';
import { Input } from '@/engine/Input';
import { SFX } from '@/engine/Audio';
import { COLORS } from './overworld/tiles';
import { STARTERS, SPECIES } from './battle/data';
import { Pokemon } from './battle/Pokemon';
import { drawPokemonFront } from './battle/sprites';

const W = 320;
const H = 240;
const FONT = 'bold 9px monospace';
const FONT_LG = 'bold 11px monospace';

export class StarterSelectScene implements Scene {
  private input: Input;
  private onChoose: (pokemon: Pokemon) => void;
  private cursor = 0;
  private confirmed = false;
  private confirmTimer = 0;

  constructor(input: Input, onChoose: (pokemon: Pokemon) => void) {
    this.input = input;
    this.onChoose = onChoose;
  }

  onEnter() {
    this.input.clear();
  }

  update(dt: number) {
    if (this.confirmed) {
      this.confirmTimer += dt;
      if (this.confirmTimer >= 1.0) {
        const key = STARTERS[this.cursor];
        const pokemon = new Pokemon(key, 5);
        this.onChoose(pokemon);
      }
      return;
    }

    const dir = this.input.getDirectionPressed();
    if (dir === 'left' && this.cursor > 0) {
      this.cursor--;
      SFX.menuSelect();
    }
    if (dir === 'right' && this.cursor < 2) {
      this.cursor++;
      SFX.menuSelect();
    }

    if (this.input.getActionPressed()) {
      SFX.menuConfirm();
      this.confirmed = true;
      this.confirmTimer = 0;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Background
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = COLORS.bg;
    ctx.font = FONT_LG;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Choose your partner!', W / 2, 16);

    // Draw 3 starters
    const spacing = 100;
    const startX = W / 2 - spacing;

    for (let i = 0; i < 3; i++) {
      const cx = startX + i * spacing;
      const species = SPECIES[STARTERS[i]];
      const selected = i === this.cursor;

      // Selection highlight
      if (selected) {
        ctx.fillStyle = this.confirmed ? COLORS.light : COLORS.mid;
        ctx.fillRect(cx - 36, 44, 72, 100);
      }

      // Pokemon sprite
      drawPokemonFront(ctx, species.id, cx - 28, 48);

      // Name
      ctx.fillStyle = selected ? '#f8f8f0' : COLORS.light;
      ctx.font = FONT;
      ctx.textAlign = 'center';
      ctx.fillText(species.name, cx, 114);

      // Types
      ctx.fillStyle = selected ? COLORS.bg : COLORS.mid;
      ctx.font = 'bold 7px monospace';
      ctx.fillText(species.types.map((t) => t.toUpperCase()).join('/'), cx, 128);
    }

    // Selection arrow
    if (!this.confirmed) {
      const arrowX = startX + this.cursor * spacing;
      const bounce = Math.sin(Date.now() / 200) * 2;
      ctx.fillStyle = COLORS.bg;
      ctx.font = FONT;
      ctx.textAlign = 'center';
      ctx.fillText('\u25bc', arrowX, 38 + bounce);
    }

    // Instructions
    ctx.fillStyle = COLORS.light;
    ctx.font = FONT;
    ctx.textAlign = 'center';
    if (this.confirmed) {
      const name = SPECIES[STARTERS[this.cursor]].name;
      ctx.fillText(`You chose ${name}!`, W / 2, 180);
    } else {
      ctx.fillText('\u2190 \u2192 to select, Z to choose', W / 2, 180);
    }

    // Base stats preview
    const species = SPECIES[STARTERS[this.cursor]];
    ctx.fillStyle = COLORS.mid;
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`HP:${species.baseHp}  ATK:${species.baseAtk}  DEF:${species.baseDef}  SPD:${species.baseSpd}`, W / 2, 200);

    // Evolution info
    if (species.evolution) {
      ctx.fillStyle = '#88c070';
      ctx.fillText(`Evolves at Lv.${species.evolution.level}`, W / 2, 215);
    }

    ctx.textAlign = 'left';
  }
}
