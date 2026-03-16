/** Simple pixel art sprite drawing for each Pokemon species. */

type DrawFn = (ctx: CanvasRenderingContext2D, x: number, y: number) => void;

interface SpriteSet { front: DrawFn; back: DrawFn; }

const C = {
  // Bulbasaur
  bGreen: '#68b838', bDark: '#307030',
  // Charmander
  cOrange: '#f89838', cCream: '#f8d870', cFlame: '#f85830',
  // Squirtle
  sBlue: '#68a8d8', sShell: '#b87830', sCream: '#f8d870',
  // Pidgey
  pBrown: '#c08838', pCream: '#f8d870', pBeak: '#f89838',
  // Rattata
  rPurple: '#a868a8', rCream: '#f8d870',
  // Caterpie
  catGreen: '#68b838', catDark: '#307030', catRed: '#e85050',
  // Common
  white: '#f8f8f8', black: '#181818', red: '#e85050',
};

const SPRITES: Record<number, SpriteSet> = {};

// ── Bulbasaur (1) ──
SPRITES[1] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 12, y + 28, 32, 20);
    // Legs
    ctx.fillRect(x + 14, y + 46, 8, 8);
    ctx.fillRect(x + 34, y + 46, 8, 8);
    // Bulb
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 18, y + 14, 20, 16);
    ctx.fillRect(x + 22, y + 10, 12, 6);
    // Head
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 6, y + 28, 18, 16);
    // Eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 8, y + 32, 4, 4);
    ctx.fillRect(x + 16, y + 32, 4, 4);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 10, y + 40, 8, 2);
    // Spots
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 28, y + 32, 4, 4);
    ctx.fillRect(x + 36, y + 36, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 12, y + 28, 32, 20);
    ctx.fillRect(x + 14, y + 46, 8, 8);
    ctx.fillRect(x + 34, y + 46, 8, 8);
    // Large bulb from behind
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 14, y + 10, 28, 22);
    ctx.fillRect(x + 18, y + 4, 20, 10);
    // Ears
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 8, y + 30, 8, 6);
    ctx.fillRect(x + 40, y + 30, 8, 6);
  },
};

// ── Charmander (4) ──
SPRITES[4] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 18, y + 20, 20, 24);
    // Belly
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 22, y + 26, 12, 14);
    // Head
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 14, y + 8, 24, 16);
    // Eyes
    ctx.fillStyle = '#3898e8';
    ctx.fillRect(x + 18, y + 14, 4, 4);
    ctx.fillRect(x + 30, y + 14, 4, 4);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 20, 8, 2);
    // Arms
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 10, y + 26, 8, 4);
    ctx.fillRect(x + 38, y + 26, 8, 4);
    // Legs
    ctx.fillRect(x + 20, y + 44, 6, 8);
    ctx.fillRect(x + 30, y + 44, 6, 8);
    // Tail flame
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 38, y + 36, 10, 4);
    ctx.fillStyle = C.cFlame;
    ctx.fillRect(x + 46, y + 30, 6, 10);
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 48, y + 34, 2, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 18, y + 20, 20, 24);
    ctx.fillRect(x + 14, y + 8, 24, 16);
    ctx.fillRect(x + 20, y + 44, 6, 8);
    ctx.fillRect(x + 30, y + 44, 6, 8);
    // Tail flame (visible from behind)
    ctx.fillRect(x + 38, y + 36, 10, 4);
    ctx.fillStyle = C.cFlame;
    ctx.fillRect(x + 46, y + 30, 8, 12);
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 48, y + 34, 4, 4);
    // Head horns/ears
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 12, y + 8, 4, 6);
    ctx.fillRect(x + 36, y + 8, 4, 6);
  },
};

// ── Squirtle (7) ──
SPRITES[7] = {
  front: (ctx, x, y) => {
    // Shell
    ctx.fillStyle = C.sShell;
    ctx.fillRect(x + 16, y + 20, 24, 22);
    // Body over shell
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 18, y + 22, 20, 18);
    // Belly
    ctx.fillStyle = C.sCream;
    ctx.fillRect(x + 22, y + 26, 12, 12);
    // Head
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 16, y + 8, 22, 16);
    // Eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 20, y + 14, 4, 4);
    ctx.fillRect(x + 30, y + 14, 4, 4);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 24, y + 20, 6, 2);
    // Legs
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 20, y + 42, 6, 8);
    ctx.fillRect(x + 30, y + 42, 6, 8);
    // Tail
    ctx.fillRect(x + 8, y + 32, 8, 6);
    ctx.fillRect(x + 4, y + 28, 6, 6);
  },
  back: (ctx, x, y) => {
    // Shell (prominent from behind)
    ctx.fillStyle = C.sShell;
    ctx.fillRect(x + 14, y + 16, 28, 26);
    // Shell pattern
    ctx.fillStyle = '#8b5e14';
    ctx.fillRect(x + 20, y + 20, 16, 2);
    ctx.fillRect(x + 26, y + 20, 4, 18);
    // Head
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 18, y + 8, 20, 12);
    // Legs
    ctx.fillRect(x + 20, y + 42, 6, 8);
    ctx.fillRect(x + 30, y + 42, 6, 8);
    // Tail
    ctx.fillRect(x + 8, y + 34, 8, 6);
    ctx.fillRect(x + 4, y + 30, 6, 6);
  },
};

// ── Pidgey (16) ──
SPRITES[16] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 16, y + 24, 24, 18);
    // Belly
    ctx.fillStyle = C.pCream;
    ctx.fillRect(x + 20, y + 30, 16, 10);
    // Head
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 18, y + 10, 18, 16);
    // Crest
    ctx.fillRect(x + 24, y + 4, 6, 8);
    // Eyes
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 16, 3, 3);
    ctx.fillRect(x + 30, y + 16, 3, 3);
    // Beak
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 25, y + 22, 6, 3);
    // Wings
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 8, y + 26, 10, 12);
    ctx.fillRect(x + 38, y + 26, 10, 12);
    // Feet
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 22, y + 42, 4, 6);
    ctx.fillRect(x + 30, y + 42, 4, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 16, y + 24, 24, 18);
    ctx.fillRect(x + 18, y + 10, 18, 16);
    ctx.fillRect(x + 24, y + 4, 6, 8);
    ctx.fillRect(x + 8, y + 26, 10, 12);
    ctx.fillRect(x + 38, y + 26, 10, 12);
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 22, y + 42, 4, 6);
    ctx.fillRect(x + 30, y + 42, 4, 6);
  },
};

// ── Rattata (19) ──
SPRITES[19] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.rPurple;
    ctx.fillRect(x + 14, y + 26, 28, 16);
    // Belly
    ctx.fillStyle = C.rCream;
    ctx.fillRect(x + 18, y + 32, 20, 8);
    // Head
    ctx.fillStyle = C.rPurple;
    ctx.fillRect(x + 12, y + 14, 22, 16);
    // Ears
    ctx.fillRect(x + 10, y + 6, 8, 10);
    ctx.fillRect(x + 28, y + 6, 8, 10);
    // Inner ears
    ctx.fillStyle = C.rCream;
    ctx.fillRect(x + 12, y + 8, 4, 6);
    ctx.fillRect(x + 30, y + 8, 4, 6);
    // Eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 16, y + 18, 4, 4);
    ctx.fillRect(x + 26, y + 18, 4, 4);
    // Teeth
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 20, y + 26, 3, 4);
    ctx.fillRect(x + 24, y + 26, 3, 4);
    // Tail
    ctx.fillStyle = C.rPurple;
    ctx.fillRect(x + 40, y + 28, 12, 3);
    ctx.fillRect(x + 48, y + 22, 4, 8);
    // Legs
    ctx.fillRect(x + 16, y + 42, 6, 6);
    ctx.fillRect(x + 34, y + 42, 6, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.rPurple;
    ctx.fillRect(x + 14, y + 26, 28, 16);
    ctx.fillRect(x + 12, y + 14, 22, 16);
    ctx.fillRect(x + 10, y + 6, 8, 10);
    ctx.fillRect(x + 28, y + 6, 8, 10);
    ctx.fillRect(x + 40, y + 28, 12, 3);
    ctx.fillRect(x + 48, y + 22, 4, 8);
    ctx.fillRect(x + 16, y + 42, 6, 6);
    ctx.fillRect(x + 34, y + 42, 6, 6);
  },
};

// ── Caterpie (10) ──
SPRITES[10] = {
  front: (ctx, x, y) => {
    // Segments (bottom to top)
    ctx.fillStyle = C.catGreen;
    ctx.fillRect(x + 18, y + 42, 14, 8);
    ctx.fillRect(x + 16, y + 34, 16, 10);
    ctx.fillRect(x + 14, y + 26, 18, 10);
    ctx.fillRect(x + 16, y + 18, 16, 10);
    // Segment lines
    ctx.fillStyle = C.catDark;
    ctx.fillRect(x + 14, y + 34, 18, 2);
    ctx.fillRect(x + 16, y + 26, 16, 2);
    // Head
    ctx.fillStyle = C.catGreen;
    ctx.fillRect(x + 18, y + 8, 14, 12);
    // Eyes
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 12, 3, 3);
    ctx.fillRect(x + 28, y + 12, 3, 3);
    // White eye dots
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 21, y + 12, 1, 1);
    ctx.fillRect(x + 29, y + 12, 1, 1);
    // Antenna
    ctx.fillStyle = C.catRed;
    ctx.fillRect(x + 22, y + 4, 3, 6);
    ctx.fillRect(x + 28, y + 4, 3, 6);
    // Feet (small bumps)
    ctx.fillStyle = C.catDark;
    ctx.fillRect(x + 14, y + 46, 4, 4);
    ctx.fillRect(x + 30, y + 46, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.catGreen;
    ctx.fillRect(x + 18, y + 42, 14, 8);
    ctx.fillRect(x + 16, y + 34, 16, 10);
    ctx.fillRect(x + 14, y + 26, 18, 10);
    ctx.fillRect(x + 16, y + 18, 16, 10);
    ctx.fillRect(x + 18, y + 8, 14, 12);
    ctx.fillStyle = C.catDark;
    ctx.fillRect(x + 14, y + 34, 18, 2);
    ctx.fillRect(x + 16, y + 26, 16, 2);
    ctx.fillStyle = C.catRed;
    ctx.fillRect(x + 22, y + 4, 3, 6);
    ctx.fillRect(x + 28, y + 4, 3, 6);
    ctx.fillStyle = C.catDark;
    ctx.fillRect(x + 14, y + 46, 4, 4);
    ctx.fillRect(x + 30, y + 46, 4, 4);
  },
};

export function drawPokemonFront(ctx: CanvasRenderingContext2D, speciesId: number, x: number, y: number, visible = true) {
  if (!visible) return;
  SPRITES[speciesId]?.front(ctx, x, y);
}

export function drawPokemonBack(ctx: CanvasRenderingContext2D, speciesId: number, x: number, y: number, visible = true) {
  if (!visible) return;
  SPRITES[speciesId]?.back(ctx, x, y);
}
