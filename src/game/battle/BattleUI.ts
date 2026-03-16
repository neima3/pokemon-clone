import { COLORS } from '../overworld/tiles';
import { MoveInstance } from './Pokemon';
import { Inventory } from '../GameState';
import { ITEMS, TYPE_COLORS, PokemonType, StatusCondition } from './data';
import { Pokemon } from './Pokemon';

const W = 320;
const FONT = 'bold 9px monospace';
const FONT_SM = 'bold 8px monospace';

function hpColor(pct: number): string {
  if (pct > 0.5) return '#48b048';
  if (pct > 0.2) return '#f8c830';
  return '#e04040';
}

const STATUS_COLORS: Record<StatusCondition, { bg: string; text: string; label: string }> = {
  poison:   { bg: '#a040a0', text: '#f8f8f0', label: 'PSN' },
  burn:     { bg: '#f08030', text: '#f8f8f0', label: 'BRN' },
  paralyze: { bg: '#f8d030', text: '#081820', label: 'PAR' },
  sleep:    { bg: '#a8a878', text: '#f8f8f0', label: 'SLP' },
};

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
  drawEnemyInfo(ctx: CanvasRenderingContext2D, name: string, level: number, hpPct: number, status?: StatusCondition | null) {
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

    // Status badge
    if (status) {
      const s = STATUS_COLORS[status];
      ctx.fillStyle = s.bg;
      ctx.fillRect(bx + 6, by + 16, 22, 9);
      ctx.fillStyle = s.text;
      ctx.font = 'bold 7px monospace';
      ctx.fillText(s.label, bx + 8, by + 17);
    }

    // HP label
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT_SM;
    ctx.fillText('HP', bx + 6, by + 26);

    // HP bar background
    const barX = bx + 22, barY = by + 26, barW = 108, barH = 6;
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#303030';
    ctx.fillRect(barX + 1, barY + 1, barW - 2, barH - 2);

    // HP bar fill
    const fillW = Math.max(0, (barW - 4) * Math.max(0, hpPct));
    ctx.fillStyle = hpColor(hpPct);
    ctx.fillRect(barX + 2, barY + 2, fillW, barH - 4);
  },

  /** Draw player info box (bottom-right) with EXP bar */
  drawPlayerInfo(
    ctx: CanvasRenderingContext2D,
    name: string,
    level: number,
    hp: number,
    maxHp: number,
    hpPct: number,
    expPct: number,
    status?: StatusCondition | null,
  ) {
    const bx = 156, by = 92, bw = 156, bh = 58;

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

    // Status badge
    if (status) {
      const s = STATUS_COLORS[status];
      ctx.fillStyle = s.bg;
      ctx.fillRect(bx + bw - 62, by + 4, 22, 9);
      ctx.fillStyle = s.text;
      ctx.font = 'bold 7px monospace';
      ctx.fillText(s.label, bx + bw - 60, by + 5);
    }

    // HP label
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT_SM;
    ctx.fillText('HP', bx + 6, by + 18);

    // HP bar
    const barX = bx + 22, barY = by + 18, barW = 120, barH = 6;
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
    ctx.fillText(`${Math.ceil(hp)}/${maxHp}`, bx + bw - 8, by + 30);
    ctx.textAlign = 'left';

    // EXP bar
    ctx.font = 'bold 7px monospace';
    ctx.fillStyle = '#606060';
    ctx.fillText('EXP', bx + 6, by + 42);
    const expBarX = bx + 26, expBarY = by + 42, expBarW = 116, expBarH = 5;
    ctx.fillStyle = COLORS.dark;
    ctx.fillRect(expBarX, expBarY, expBarW, expBarH);
    ctx.fillStyle = '#303030';
    ctx.fillRect(expBarX + 1, expBarY + 1, expBarW - 2, expBarH - 2);
    const expFillW = Math.max(0, (expBarW - 4) * Math.min(1, Math.max(0, expPct)));
    ctx.fillStyle = '#58a8f8';
    ctx.fillRect(expBarX + 2, expBarY + 2, expFillW, expBarH - 4);
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

  /** Draw 2x2 action menu (FIGHT / BAG / POKéMON / RUN) */
  drawActionMenu(ctx: CanvasRenderingContext2D, cursor: number) {
    const bx = 176, by = 156, bw = 140, bh = 80;

    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    const items = ['FIGHT', 'BAG', 'POKéMON', 'RUN'];
    for (let i = 0; i < items.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = bx + 20 + col * 66;
      const y = by + 14 + row * 28;
      if (i === cursor) {
        ctx.fillText('\u25b6', x - 14, y);
      }
      ctx.fillText(items[i], x, y);
    }
  },

  /** Draw "What will X do?" prompt on the left side of the text box */
  drawActionPrompt(ctx: CanvasRenderingContext2D, name: string) {
    const bx = 4, by = 156, bw = 172, bh = 80;

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

  /** Draw move selection menu with type colors */
  drawMoveMenu(ctx: CanvasRenderingContext2D, moves: MoveInstance[], cursor: number) {
    const bx = 4, by = 156, bw = 312, bh = 80;

    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.textBaseline = 'top';

    // 2x2 grid of moves
    for (let i = 0; i < moves.length && i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const mx = bx + 22 + col * 150;
      const my = by + 10 + row * 24;

      if (i === cursor) {
        ctx.fillStyle = COLORS.dark;
        ctx.font = FONT;
        ctx.fillText('\u25b6', mx - 14, my);
      }

      // Type-colored move name
      const typeColor = TYPE_COLORS[moves[i].data.type as PokemonType] ?? COLORS.dark;
      ctx.fillStyle = i === cursor ? typeColor : COLORS.dark;
      ctx.font = FONT;
      ctx.fillText(moves[i].data.name, mx, my);
    }

    // PP display and type for selected move
    if (cursor < moves.length) {
      const m = moves[cursor];
      const typeColor = TYPE_COLORS[m.data.type as PokemonType] ?? '#808080';

      // Type badge
      ctx.fillStyle = typeColor;
      ctx.fillRect(bx + 150, by + bh - 22, 50, 11);
      ctx.fillStyle = '#f8f8f0';
      ctx.font = 'bold 7px monospace';
      ctx.fillText(m.data.type.toUpperCase(), bx + 153, by + bh - 20);

      // PP
      ctx.fillStyle = m.pp <= 0 ? '#e04040' : COLORS.dark;
      ctx.font = FONT_SM;
      ctx.fillText(`PP ${m.pp}/${m.data.maxPp}`, bx + 22, by + bh - 18);

      // Power
      if (m.data.power > 0) {
        ctx.fillStyle = '#606060';
        ctx.fillText(`POW ${m.data.power}`, bx + 90, by + bh - 18);
      }
    }
  },

  /** Draw bag/item menu */
  drawBagMenu(ctx: CanvasRenderingContext2D, inventory: Inventory, cursor: number) {
    const bx = 4, by = 156, bw = 312, bh = 80;

    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Title
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    const items: Array<{ key: keyof Inventory; count: number }> = [
      { key: 'pokeball', count: inventory.pokeball },
      { key: 'potion', count: inventory.potion },
      { key: 'superPotion', count: inventory.superPotion },
    ];
    // Filter to items with count > 0, plus CANCEL
    const visibleItems = items.filter((i) => i.count > 0);

    for (let i = 0; i < visibleItems.length; i++) {
      const y = by + 8 + i * 16;
      const item = ITEMS[visibleItems[i].key];
      if (i === cursor) {
        ctx.fillText('\u25b6', bx + 8, y);
      }
      ctx.fillText(`${item.name}`, bx + 22, y);
      ctx.font = FONT_SM;
      ctx.textAlign = 'right';
      ctx.fillText(`x${visibleItems[i].count}`, bx + bw - 12, y);
      ctx.textAlign = 'left';
      ctx.font = FONT;
    }

    // CANCEL option
    const cancelIdx = visibleItems.length;
    const cy = by + 8 + cancelIdx * 16;
    if (cursor === cancelIdx) {
      ctx.fillText('\u25b6', bx + 8, cy);
    }
    ctx.fillText('CANCEL', bx + 22, cy);
  },

  /** Draw party/switch menu */
  drawPartyMenu(ctx: CanvasRenderingContext2D, team: Pokemon[], activeIndex: number, cursor: number) {
    const bx = 4, by = 4, bw = 312, bh = 232;

    // Full-screen overlay
    ctx.fillStyle = '#e8e0d0';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = COLORS.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.fillText('POKéMON', bx + 120, by + 6);

    for (let i = 0; i < team.length; i++) {
      const mon = team[i];
      const y = by + 24 + i * 30;

      // Highlight active
      if (i === activeIndex) {
        ctx.fillStyle = '#c8d8a8';
        ctx.fillRect(bx + 4, y - 2, bw - 8, 26);
      }

      // Cursor
      if (i === cursor) {
        ctx.fillStyle = COLORS.dark;
        ctx.fillText('\u25b6', bx + 8, y + 2);
      }

      // Name and level
      ctx.fillStyle = mon.isAlive ? COLORS.dark : '#a08080';
      ctx.font = FONT;
      ctx.fillText(mon.name, bx + 24, y + 2);
      ctx.font = FONT_SM;
      ctx.fillText(`Lv${mon.level}`, bx + 110, y + 3);

      // Status badge
      if (mon.status) {
        const s = STATUS_COLORS[mon.status];
        ctx.fillStyle = s.bg;
        ctx.fillRect(bx + 130, y + 2, 22, 9);
        ctx.fillStyle = s.text;
        ctx.font = 'bold 7px monospace';
        ctx.fillText(s.label, bx + 132, y + 3);
      }

      // HP bar
      const barX = bx + 160, barW = 80, barH = 5;
      ctx.fillStyle = COLORS.dark;
      ctx.fillRect(barX, y + 4, barW, barH);
      ctx.fillStyle = '#303030';
      ctx.fillRect(barX + 1, y + 5, barW - 2, barH - 2);
      const fillW = Math.max(0, (barW - 4) * mon.hpPercent);
      ctx.fillStyle = hpColor(mon.hpPercent);
      ctx.fillRect(barX + 2, y + 5, fillW, barH - 2);

      // HP numbers
      ctx.fillStyle = COLORS.dark;
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${mon.hp}/${mon.maxHp}`, bx + bw - 12, y + 14);
      ctx.textAlign = 'left';
    }

    // CANCEL at bottom
    const cancelY = by + 24 + team.length * 30;
    if (cursor === team.length) {
      ctx.fillStyle = COLORS.dark;
      ctx.font = FONT;
      ctx.fillText('\u25b6', bx + 8, cancelY + 2);
    }
    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.fillText('CANCEL', bx + 24, cancelY + 2);
  },

  /** Draw pokeball during catch animation */
  drawPokeball(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number = 0) {
    ctx.save();
    ctx.translate(x + 8, y + 8);
    ctx.rotate(wobble);
    // Top half (red)
    ctx.fillStyle = '#e04040';
    ctx.fillRect(-7, -7, 14, 7);
    // Bottom half (white)
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(-7, 0, 14, 7);
    // Line
    ctx.fillStyle = '#181818';
    ctx.fillRect(-7, -1, 14, 2);
    // Center button
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(-3, -3, 6, 6);
    ctx.fillStyle = '#181818';
    ctx.fillRect(-2, -2, 4, 4);
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(-1, -1, 2, 2);
    // Border
    ctx.strokeStyle = '#181818';
    ctx.lineWidth = 1;
    ctx.strokeRect(-7, -7, 14, 14);
    ctx.restore();
  },

  /** Draw type-colored attack flash effect */
  drawAttackFlash(ctx: CanvasRenderingContext2D, moveType: PokemonType, timer: number, isPlayerAttacking: boolean) {
    if (timer < 0.15 || timer > 0.4) return;
    const color = TYPE_COLORS[moveType] ?? '#f8f8f0';
    const alpha = 0.4 * (1 - (timer - 0.15) / 0.25);

    if (isPlayerAttacking) {
      // Flash on enemy side
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(160, 0, 160, 90);
      ctx.globalAlpha = 1;
    } else {
      // Flash on player side
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, 60, 160, 96);
      ctx.globalAlpha = 1;
    }
  },

  /** Draw critical hit star burst effect */
  drawCriticalEffect(ctx: CanvasRenderingContext2D, timer: number, isPlayerAttacking: boolean) {
    if (timer < 0.2 || timer > 0.4) return;
    const cx = isPlayerAttacking ? 240 : 80;
    const cy = isPlayerAttacking ? 40 : 110;
    const size = 12 * ((timer - 0.2) / 0.2);
    ctx.fillStyle = '#f8d830';
    ctx.globalAlpha = 1 - (timer - 0.2) / 0.2;
    // Star pattern
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.fillRect(
        cx + Math.cos(angle) * size - 2,
        cy + Math.sin(angle) * size - 2,
        4, 4,
      );
    }
    ctx.globalAlpha = 1;
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
