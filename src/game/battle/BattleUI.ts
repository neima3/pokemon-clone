import { COLORS } from '../overworld/tiles';
import { MoveInstance } from './Pokemon';

const W = 320;
const FONT = 'bold 9px monospace';
const FONT_SM = 'bold 8px monospace';

function hpColor(pct: number): string {
  if (pct > 0.5) return '#48b048';
  if (pct > 0.2) return '#f8c830';
  return '#e04040';
}

export const BattleUI = {
  /** Draw battle background with platforms */
  drawBackground(ctx: CanvasRenderingContext2D) {
    // Sky / light background
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(0, 0, W, 156);

    // Enemy platform (top-right)
    ctx.fillStyle = '#a8d878';
    ctx.fillRect(180, 74, 100, 8);
    ctx.fillStyle = '#88b858';
    ctx.fillRect(185, 82, 90, 4);

    // Player platform (bottom-left)
    ctx.fillStyle = '#a8d878';
    ctx.fillRect(16, 138, 120, 8);
    ctx.fillStyle = '#88b858';
    ctx.fillRect(22, 146, 108, 6);
  },

  /** Draw enemy info box (top-left) */
  drawEnemyInfo(ctx: CanvasRenderingContext2D, name: string, level: number, hpPct: number) {
    const bx = 8, by = 8, bw = 144, bh = 38;

    // Box background
    ctx.fillStyle = '#f0f0e8';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Name
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.fillText(name, bx + 6, by + 4);

    // Level
    ctx.font = FONT_SM;
    ctx.fillText(`Lv${level}`, bx + bw - 34, by + 5);

    // HP label
    ctx.fillText('HP', bx + 6, by + 20);

    // HP bar background
    const barX = bx + 22, barY = by + 20, barW = 108, barH = 6;
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#303030';
    ctx.fillRect(barX + 1, barY + 1, barW - 2, barH - 2);

    // HP bar fill
    const fillW = Math.max(0, (barW - 4) * Math.max(0, hpPct));
    ctx.fillStyle = hpColor(hpPct);
    ctx.fillRect(barX + 2, barY + 2, fillW, barH - 4);
  },

  /** Draw player info box (bottom-right) */
  drawPlayerInfo(
    ctx: CanvasRenderingContext2D,
    name: string,
    level: number,
    hp: number,
    maxHp: number,
    hpPct: number,
  ) {
    const bx = 156, by = 98, bw = 156, bh = 50;

    // Box background
    ctx.fillStyle = '#f0f0e8';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Name
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.fillText(name, bx + 6, by + 4);

    // Level
    ctx.font = FONT_SM;
    ctx.fillText(`Lv${level}`, bx + bw - 34, by + 5);

    // HP label
    ctx.fillText('HP', bx + 6, by + 20);

    // HP bar
    const barX = bx + 22, barY = by + 20, barW = 120, barH = 6;
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#303030';
    ctx.fillRect(barX + 1, barY + 1, barW - 2, barH - 2);

    const fillW = Math.max(0, (barW - 4) * Math.max(0, hpPct));
    ctx.fillStyle = hpColor(hpPct);
    ctx.fillRect(barX + 2, barY + 2, fillW, barH - 4);

    // HP numbers
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT_SM;
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.ceil(hp)}/${maxHp}`, bx + bw - 8, by + 34);
    ctx.textAlign = 'left';
  },

  /** Draw the text box at the bottom of the screen */
  drawTextBox(ctx: CanvasRenderingContext2D, text: string, charIndex: number) {
    const bx = 4, by = 156, bw = 312, bh = 80;

    // Box
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Text (typewriter effect)
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    const shown = text.substring(0, Math.floor(charIndex));
    const lines = wrapText(shown, 34);
    for (let i = 0; i < lines.length && i < 3; i++) {
      ctx.fillText(lines[i], bx + 12, by + 10 + i * 16);
    }

    // Blinking advance indicator when text fully shown
    if (charIndex >= text.length && Math.floor(Date.now() / 400) % 2 === 0) {
      ctx.fillText('\u25bc', bx + bw - 20, by + bh - 18);
    }
  },

  /** Draw action menu (FIGHT / RUN) */
  drawActionMenu(ctx: CanvasRenderingContext2D, cursor: number) {
    const bx = 216, by = 156, bw = 100, bh = 80;

    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    const items = ['FIGHT', 'RUN'];
    for (let i = 0; i < items.length; i++) {
      const y = by + 12 + i * 24;
      if (i === cursor) {
        ctx.fillText('\u25b6', bx + 8, y);
      }
      ctx.fillText(items[i], bx + 22, y);
    }
  },

  /** Draw "What will X do?" prompt on the left side of the text box */
  drawActionPrompt(ctx: CanvasRenderingContext2D, name: string) {
    const bx = 4, by = 156, bw = 212, bh = 80;

    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.fillText(`What will`, bx + 12, by + 16);
    ctx.fillText(`${name} do?`, bx + 12, by + 36);
  },

  /** Draw move selection menu */
  drawMoveMenu(ctx: CanvasRenderingContext2D, moves: MoveInstance[], cursor: number) {
    const bx = 4, by = 156, bw = 312, bh = 80;

    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    // 2×2 grid of moves
    for (let i = 0; i < moves.length && i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const mx = bx + 22 + col * 150;
      const my = by + 10 + row * 24;

      if (i === cursor) {
        ctx.fillText('\u25b6', mx - 14, my);
      }
      ctx.fillText(moves[i].data.name, mx, my);
    }

    // PP display for selected move
    if (cursor < moves.length) {
      const m = moves[cursor];
      ctx.font = FONT_SM;
      ctx.fillText(`PP ${m.pp}/${m.data.maxPp}`, bx + 22, by + bh - 18);
      ctx.fillText(`TYPE/${m.data.type.toUpperCase()}`, bx + 150, by + bh - 18);
    }
  },
};

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (line.length + word.length + 1 > maxChars && line.length > 0) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
