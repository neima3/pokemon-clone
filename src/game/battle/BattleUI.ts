import { COLORS } from '../overworld/tiles';
import { MoveInstance } from './Pokemon';
import { Inventory } from '../GameState';
import { ITEMS, TYPE_COLORS, PokemonType, StatusCondition, getTypeEffectiveness } from './data';
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

  /** Draw move selection menu with type colors and effectiveness indicator */
  drawMoveMenu(ctx: CanvasRenderingContext2D, moves: MoveInstance[], cursor: number, enemyTypes?: PokemonType[]) {
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

      // Effectiveness dot indicator next to each move
      if (enemyTypes && moves[i].data.power > 0) {
        const eff = getTypeEffectiveness(moves[i].data.type, enemyTypes);
        let dotColor = '';
        if (eff >= 2) dotColor = '#48b048';       // super effective — green
        else if (eff > 1) dotColor = '#88c070';    // effective
        else if (eff === 0) dotColor = '#808080';   // immune — gray
        else if (eff < 1) dotColor = '#e04040';     // not effective — red
        if (dotColor) {
          ctx.fillStyle = dotColor;
          ctx.fillRect(mx + (col === 0 ? 78 : 68), my + 3, 6, 6);
        }
      }
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

      // Effectiveness text for selected move
      if (enemyTypes && m.data.power > 0) {
        const eff = getTypeEffectiveness(m.data.type, enemyTypes);
        let effText = '';
        let effColor = '#606060';
        if (eff >= 2) { effText = 'SUPER EFF!'; effColor = '#48b048'; }
        else if (eff > 1) { effText = 'EFFECTIVE'; effColor = '#88c070'; }
        else if (eff === 0) { effText = 'NO EFFECT'; effColor = '#808080'; }
        else if (eff < 1) { effText = 'NOT EFF.'; effColor = '#e04040'; }
        if (effText) {
          ctx.fillStyle = effColor;
          ctx.font = 'bold 7px monospace';
          ctx.fillText(effText, bx + 210, by + bh - 20);
        }
      }

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

    ctx.fillStyle = COLORS.dark;
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    // Build items list from inventory
    const allItems: Array<{ key: keyof Inventory; count: number }> = [
      { key: 'pokeball', count: inventory.pokeball },
      { key: 'greatBall', count: inventory.greatBall },
      { key: 'ultraBall', count: inventory.ultraBall },
      { key: 'potion', count: inventory.potion },
      { key: 'superPotion', count: inventory.superPotion },
      { key: 'hyperPotion', count: inventory.hyperPotion },
      { key: 'maxPotion', count: inventory.maxPotion },
      { key: 'antidote', count: inventory.antidote },
      { key: 'fullHeal', count: inventory.fullHeal },
      { key: 'revive', count: inventory.revive },
    ];
    
    const visibleItems = allItems.filter((i) => i.count > 0);

    for (let i = 0; i < visibleItems.length; i++) {
      const y = by + 8 + i * 14;
      if (y > by + bh - 20) break; // Don't render outside box
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
    const cy = by + 8 + Math.min(visibleItems.length, 5) * 14;
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

  /** Draw type-colored attack flash + particle effects */
  drawAttackFlash(ctx: CanvasRenderingContext2D, moveType: PokemonType, timer: number, isPlayerAttacking: boolean) {
    if (timer < 0.1 || timer > 0.45) return;

    const color = TYPE_COLORS[moveType] ?? '#f8f8f0';
    const targetCx = isPlayerAttacking ? 240 : 80;
    const targetCy = isPlayerAttacking ? 50 : 110;

    // Base flash
    if (timer >= 0.15 && timer < 0.4) {
      const alpha = 0.35 * (1 - (timer - 0.15) / 0.25);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      if (isPlayerAttacking) ctx.fillRect(160, 0, 160, 90);
      else ctx.fillRect(0, 60, 160, 96);
      ctx.globalAlpha = 1;
    }

    // Type-specific particle effects
    const t = (timer - 0.1) / 0.35; // 0→1 normalized
    ctx.save();
    switch (moveType) {
      case 'fire': {
        // Rising flame particles
        for (let i = 0; i < 8; i++) {
          const seed = i * 137.5;
          const px = targetCx + Math.sin(seed) * 20 * t;
          const py = targetCy - t * 40 - Math.sin(seed * 0.7) * 15;
          const sz = 6 * (1 - t * 0.5);
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = i % 3 === 0 ? '#f8d030' : i % 3 === 1 ? '#f08030' : '#e04040';
          ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
        }
        break;
      }
      case 'water': {
        // Splash droplets
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2;
          const dist = t * 30 + Math.sin(i * 2) * 8;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.6 - t * 10;
          const sz = 4 * (1 - t * 0.6);
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = i % 2 === 0 ? '#6890f0' : '#98c8f8';
          ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
        }
        break;
      }
      case 'electric': {
        // Lightning bolts / sparks
        ctx.globalAlpha = (1 - t) * 0.9;
        ctx.strokeStyle = '#f8d030';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const ang = (i / 5) * Math.PI * 2 + t * 4;
          const len = 16 + Math.sin(i * 3 + t * 10) * 8;
          ctx.beginPath();
          ctx.moveTo(targetCx, targetCy);
          const mx = targetCx + Math.cos(ang) * len * 0.5 + Math.sin(t * 20 + i) * 6;
          const my = targetCy + Math.sin(ang) * len * 0.5 + Math.cos(t * 20 + i) * 6;
          ctx.lineTo(mx, my);
          ctx.lineTo(targetCx + Math.cos(ang) * len, targetCy + Math.sin(ang) * len);
          ctx.stroke();
        }
        // Bright center flash
        ctx.fillStyle = '#f8f8d0';
        const flashSz = 8 * (1 - t);
        ctx.fillRect(targetCx - flashSz / 2, targetCy - flashSz / 2, flashSz, flashSz);
        break;
      }
      case 'grass': {
        // Spinning leaves
        for (let i = 0; i < 7; i++) {
          const angle = (i / 7) * Math.PI * 2 + t * 6;
          const dist = t * 25;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.7;
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = i % 2 === 0 ? '#78c850' : '#48a030';
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(angle + t * 4);
          ctx.fillRect(-3, -1, 6, 2);
          ctx.fillRect(-1, -3, 2, 6);
          ctx.restore();
        }
        break;
      }
      case 'poison': {
        // Bubbling poison droplets
        for (let i = 0; i < 6; i++) {
          const px = targetCx + Math.sin(i * 2.5 + t * 3) * 18;
          const py = targetCy - t * 25 - i * 4 + Math.sin(t * 8 + i) * 5;
          const sz = 4 + Math.sin(i + t * 5) * 2;
          ctx.globalAlpha = (1 - t) * 0.8;
          ctx.fillStyle = i % 2 === 0 ? '#a040a0' : '#c060c0';
          ctx.beginPath();
          ctx.arc(px, py, sz, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'ground':
      case 'rock': {
        // Flying debris
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + 0.5;
          const dist = t * 28;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.5 + t * t * 30;
          const sz = 3 + (i % 3);
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = moveType === 'rock' ? (i % 2 === 0 ? '#b8a038' : '#906820') : (i % 2 === 0 ? '#e0c068' : '#c09838');
          ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
        }
        break;
      }
      case 'psychic': {
        // Pulsing rings
        for (let ring = 0; ring < 3; ring++) {
          const rt = Math.max(0, t - ring * 0.12);
          if (rt <= 0) continue;
          const radius = rt * 28;
          ctx.globalAlpha = (1 - rt) * 0.6;
          ctx.strokeStyle = ring % 2 === 0 ? '#f85888' : '#f898b8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(targetCx, targetCy, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      }
      case 'flying': {
        // Wind slashes
        ctx.globalAlpha = (1 - t) * 0.7;
        ctx.strokeStyle = '#a890f0';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const offset = (i - 1.5) * 10;
          const startX = targetCx - 20 + t * 15;
          const startY = targetCy + offset - t * 5;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(targetCx, startY - 8, startX + 40, startY + 4);
          ctx.stroke();
        }
        break;
      }
      case 'bug': {
        // Tiny swarming dots
        for (let i = 0; i < 8; i++) {
          const angle = t * 8 + (i / 8) * Math.PI * 2;
          const dist = 10 + Math.sin(t * 6 + i * 2) * 12;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.7;
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = i % 2 === 0 ? '#a8b820' : '#c8d840';
          ctx.fillRect(px - 2, py - 2, 4, 4);
        }
        break;
      }
      case 'ghost': {
        // Eerie shadow tendrils spiraling outward from target
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t * 5;
          const dist = t * 32;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.6;
          ctx.globalAlpha = (1 - t) * 0.7;
          ctx.fillStyle = i % 2 === 0 ? '#705898' : '#483868';
          // Wispy tendril shape: elongated rectangles rotated along spiral
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(angle + t * 3);
          ctx.fillRect(-5, -1, 10, 3);
          ctx.restore();
        }
        // Fading shadow orbs floating upward
        for (let i = 0; i < 5; i++) {
          const seed = i * 97.3;
          const orbX = targetCx + Math.sin(seed) * 16 + Math.cos(t * 4 + i) * 6;
          const orbY = targetCy - t * 30 - i * 5;
          const orbR = 3 + Math.sin(i + t * 6) * 1.5;
          ctx.globalAlpha = (1 - t) * 0.6;
          ctx.fillStyle = i % 2 === 0 ? '#483868' : '#705898';
          ctx.beginPath();
          ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'ice': {
        // Crystalline particles radiating outward
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t * 2;
          const dist = t * 30;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.7;
          ctx.globalAlpha = (1 - t) * 0.85;
          ctx.fillStyle = i % 3 === 0 ? '#98d8d8' : i % 3 === 1 ? '#b0f0f0' : '#ffffff';
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(Math.PI / 4 + t * 3);
          const sz = 4 * (1 - t * 0.4);
          ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
          ctx.restore();
        }
        for (let i = 0; i < 6; i++) {
          const sparkAngle = (i / 6) * Math.PI * 2 + t * 7;
          const sparkDist = 8 + t * 18;
          const sx = targetCx + Math.cos(sparkAngle) * sparkDist;
          const sy = targetCy + Math.sin(sparkAngle) * sparkDist * 0.6;
          const twinkle = Math.abs(Math.sin(t * 12 + i * 2.5));
          ctx.globalAlpha = (1 - t) * twinkle * 0.9;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(sx - 1, sy - 3, 2, 6);
          ctx.fillRect(sx - 3, sy - 1, 6, 2);
        }
        break;
      }
      case 'dragon': {
        // Dragon energy - swirling draconic aura with diamond shapes
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2 + t * 6;
          const dist = 15 + t * 25;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.6;
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = i % 3 === 0 ? '#7058a0' : i % 3 === 1 ? '#9858d8' : '#c830d0';
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(angle * 2 + t * 8);
          // Draw diamond shape instead of using stroke
          ctx.beginPath();
          ctx.moveTo(0, -6);
          ctx.lineTo(4, 0);
          ctx.lineTo(0, 6);
          ctx.lineTo(-4, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + t * 3;
          const dist = 20 + t * 20;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.5 - t * 15;
          ctx.globalAlpha = (1 - t) * 0.7;
          ctx.fillStyle = '#5838a0';
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'steel': {
        // Metallic shards spinning outward
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t * 4;
          const dist = t * 28;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.7;
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = i % 2 === 0 ? '#b8b8d0' : '#888898';
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(angle + t * 10);
          const sz = 5 * (1 - t * 0.3);
          ctx.fillRect(-sz, -sz / 2, sz * 2, sz);
          ctx.restore();
        }
        for (let i = 0; i < 5; i++) {
          const seed = i * 137.5;
          const sparkX = targetCx + (Math.sin(seed) * 0.5 + 0.5) * 40;
          const sparkY = targetCy + (Math.cos(seed) * 0.5 - 0.5) * 30;
          ctx.globalAlpha = (1 - t) * 0.5;
          ctx.fillStyle = '#d0d0d8';
          ctx.fillRect(sparkX - 2, sparkY - 2, 4, 4);
        }
        break;
      }
      case 'fighting': {
        // Martial arts impact - fist-shaped energy bursts
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const dist = t * 25;
          const px = targetCx + Math.cos(angle) * dist;
          const py = targetCy + Math.sin(angle) * dist * 0.6;
          ctx.globalAlpha = 1 - t;
          ctx.fillStyle = i % 2 === 0 ? '#c03028' : '#a04830';
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(angle + t * 5);
          ctx.fillRect(-4, -6, 8, 12);
          ctx.restore();
        }
        for (let i = 0; i < 4; i++) {
          const lineY = targetCy - 15 + i * 10;
          const lineX = targetCx - 20 + t * 40;
          ctx.globalAlpha = (1 - t) * 0.6;
          ctx.strokeStyle = '#f08030';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(lineX, lineY);
          ctx.lineTo(lineX + 15, lineY + 5);
          ctx.stroke();
        }
        break;
      }
      default: {
        // Normal type: impact lines
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const len = t * 24;
          ctx.globalAlpha = (1 - t) * 0.6;
          ctx.strokeStyle = '#f8f8f0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(targetCx + Math.cos(angle) * 4, targetCy + Math.sin(angle) * 4);
          ctx.lineTo(targetCx + Math.cos(angle) * len, targetCy + Math.sin(angle) * len);
          ctx.stroke();
        }
        break;
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  },

  /** Draw screen-wide impact flash for powerful moves */
  drawImpactFlash(ctx: CanvasRenderingContext2D, timer: number) {
    if (timer < 0.1 || timer > 0.25) return;
    const alpha = 0.6 * (1 - (timer - 0.1) / 0.15);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(0, 0, 320, 240);
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
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + (timer - 0.2) * 4;
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

export interface DamageNumber {
  x: number;
  y: number;
  value: number;
  timer: number;
  maxTimer: number;
  isPlayer: boolean;
  isHeal: boolean;
  critical: boolean;
}

export interface StatusParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'poison' | 'burn' | 'paralyze' | 'sleep';
}

export interface HealParticle {
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export interface StatChangeText {
  x: number;
  y: number;
  text: string;
  color: string;
  timer: number;
  maxTimer: number;
}

export const StatusParticles = {
  create(type: StatusCondition): StatusParticle[] {
    const particles: StatusParticle[] = []
    const count = type === 'sleep' ? 2 : 5
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 320,
        y: Math.random() * 240,
        vx: (Math.random() - 0.5) * 40,
        vy: type === 'sleep' ? -15 : -20 - Math.random() * 30,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 0.8 + Math.random() * 0.4,
        size: 2 + Math.random() * 4,
        color: type === 'poison' ? '#a040a0' : type === 'burn' ? '#f08030' : type === 'paralyze' ? '#f8d030' : '#a8a878',
        type,
      })
    }
    return particles
  },

  update(particles: StatusParticle[], dt: number): void {
    for (const p of particles) {
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.life -= dt
    }
  },

  render(ctx: CanvasRenderingContext2D, particles: StatusParticle[]): void {
    for (const p of particles) {
      if (p.life <= 0) continue
      const alpha = Math.max(0, p.life / p.maxLife)
      ctx.globalAlpha = alpha
      ctx.fillStyle = p.color

      switch (p.type) {
        case 'poison':
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break
        case 'burn':
          ctx.beginPath()
          ctx.moveTo(p.x, p.y - p.size * 2)
          ctx.lineTo(p.x + p.size, p.y + p.size)
          ctx.lineTo(p.x - p.size, p.y + p.size)
          ctx.closePath()
          ctx.fill()
          break
        case 'paralyze':
          ctx.fillRect(p.x - p.size / 2, p.y, p.size, 2)
          ctx.fillRect(p.x, p.y - p.size / 2, 2, p.size)
          break
        case 'sleep':
          ctx.font = `bold ${Math.floor(p.size * 2)}px monospace`
          ctx.fillText('z', p.x, p.y)
          break
      }
    }
    ctx.globalAlpha = 1
  },
};

export const HealParticles = {
  create(x: number, y: number, count: number = 12): HealParticle[] {
    const particles: HealParticle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + Math.random() * 30,
        vy: -30 - Math.random() * 20,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 0.8 + Math.random() * 0.4,
        size: 3 + Math.random() * 3,
      })
    }
    return particles
  },

  update(particles: HealParticle[], dt: number): void {
    for (const p of particles) {
      p.y += p.vy * dt
      p.x += Math.sin(p.y * 0.1) * 0.5
      p.life -= dt
    }
  },

  render(ctx: CanvasRenderingContext2D, particles: HealParticle[]): void {
    for (const p of particles) {
      if (p.life <= 0) continue
      const alpha = Math.max(0, p.life / p.maxLife)
      ctx.globalAlpha = alpha
      // Draw plus sign
      ctx.fillStyle = '#40c040'
      ctx.fillRect(p.x - p.size / 2, p.y - 1, p.size, 2)
      ctx.fillRect(p.x - 1, p.y - p.size / 2, 2, p.size)
      // Glow effect
      ctx.fillStyle = '#80f080'
      ctx.globalAlpha = alpha * 0.5
      ctx.fillRect(p.x - p.size / 2 - 1, p.y - 2, p.size + 2, 4)
      ctx.fillRect(p.x - 2, p.y - p.size / 2 - 1, 4, p.size + 2)
    }
    ctx.globalAlpha = 1
  },
};

export const StatChangeHelper = {
  create(x: number, y: number, stat: string, stages: number): StatChangeText {
    const text = stages > 0 ? `${stat} +${stages}` : `${stat} ${stages}`
    return {
      x,
      y,
      text,
      color: stages > 0 ? '#48b048' : '#e04040',
      timer: 0,
      maxTimer: 1.2,
    }
  },

  update(sct: StatChangeText, dt: number): void {
    sct.timer += dt
    sct.y -= dt * 20
  },

  render(ctx: CanvasRenderingContext2D, sct: StatChangeText): void {
    if (sct.timer >= sct.maxTimer) return
    const alpha = 1 - (sct.timer / sct.maxTimer)
    ctx.globalAlpha = alpha
    ctx.font = 'bold 10px monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#181818'
    ctx.fillText(sct.text, sct.x + 1, sct.y + 1)
    ctx.fillStyle = sct.color
    ctx.fillText(sct.text, sct.x, sct.y)
    ctx.textAlign = 'left'
    ctx.globalAlpha = 1
  },
};

export const DamageNumbers = {
  create(value: number, isPlayer: boolean, isHeal: boolean, critical: boolean): DamageNumber {
    return {
      x: isPlayer ? 80 : 200,
      y: isPlayer ? 60 : 30,
      value,
      timer: 0,
      maxTimer: 1,
      isPlayer,
      isHeal,
      critical,
    }
  },

  update(dn: DamageNumber, dt: number): void {
    dn.timer += dt
    dn.y -= dt * 15
  },

  render(ctx: CanvasRenderingContext2D, dn: DamageNumber): void {
    if (dn.timer >= dn.maxTimer) return
    const alpha = 1 - (dn.timer / dn.maxTimer)
    ctx.globalAlpha = alpha
    ctx.font = `bold ${dn.critical ? 14 : 12}px monospace`
    ctx.textAlign = 'center'
    if (dn.isHeal) {
      ctx.fillStyle = '#40c040'
    } else if (dn.critical) {
      ctx.fillStyle = '#f8d830'
    } else {
      ctx.fillStyle = '#f8f8f8'
    }
    ctx.fillText((dn.isHeal ? '+' : '') + dn.value.toString(), dn.x, dn.y)
    ctx.textAlign = 'left'
    ctx.globalAlpha = 1
  },
};
