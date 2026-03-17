/** Simple pixel art sprite drawing for each Pokemon species. */

type DrawFn = (ctx: CanvasRenderingContext2D, x: number, y: number) => void;

interface SpriteSet { front: DrawFn; back: DrawFn; }

const C = {
  // Bulbasaur/Ivysaur
  bGreen: '#68b838', bDark: '#307030',
  // Charmander/Charmeleon
  cOrange: '#f89838', cCream: '#f8d870', cFlame: '#f85830', cDark: '#c06028',
  // Squirtle/Wartortle
  sBlue: '#68a8d8', sShell: '#b87830', sCream: '#f8d870', sDark: '#4878a0',
  // Pidgey
  pBrown: '#c08838', pCream: '#f8d870', pBeak: '#f89838',
  // Rattata
  rPurple: '#a868a8', rCream: '#f8d870',
  // Caterpie
  catGreen: '#68b838', catDark: '#307030', catRed: '#e85050',
  // Pikachu
  pikYellow: '#f8d830', pikBrown: '#a87030', pikRed: '#e04040',
  // Zubat
  zBlue: '#7070c8', zPurple: '#5050a0', zMouth: '#e85050',
  // Geodude
  gBrown: '#a09070', gDark: '#706050', gLight: '#c8b898',
  // NidoranM
  nPurple: '#b070c0', nDark: '#805890', nCream: '#f8d870',
  // Venusaur
  vGreen: '#48a840', vDark: '#286830', vFlower: '#e85080',
  // Charizard
  czOrange: '#f87838', czWing: '#509878', czFlame: '#f8d830',
  // Blastoise
  blBlue: '#5088c8', blShell: '#a87828', blCannon: '#808898',
  // Magnemite
  mgGray: '#b0b0c0', mgDark: '#606878', mgScrew: '#f8d030',
  // Voltorb
  vtRed: '#e04040', vtWhite: '#f8f8f8',
  // Diglett
  dgBrown: '#c09060', dgDark: '#705038', dgPink: '#f0a0a0',
  // Jigglypuff
  jpPink: '#f8a0b0', jpEye: '#40c0a0',
  // Drowzee
  dzYellow: '#e8c060', dzBrown: '#906030',
  // Machop
  mcGray: '#a0b0b8', mcDark: '#607078',
  // Common
  white: '#f8f8f8', black: '#181818', red: '#e85050',
};

const SPRITES: Record<number, SpriteSet> = {};

// ── Bulbasaur (1) ──
SPRITES[1] = {
  front: (ctx, x, y) => {
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 12, y + 28, 32, 20);
    ctx.fillRect(x + 14, y + 46, 8, 8);
    ctx.fillRect(x + 34, y + 46, 8, 8);
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 18, y + 14, 20, 16);
    ctx.fillRect(x + 22, y + 10, 12, 6);
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 6, y + 28, 18, 16);
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 8, y + 32, 4, 4);
    ctx.fillRect(x + 16, y + 32, 4, 4);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 10, y + 40, 8, 2);
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 28, y + 32, 4, 4);
    ctx.fillRect(x + 36, y + 36, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 12, y + 28, 32, 20);
    ctx.fillRect(x + 14, y + 46, 8, 8);
    ctx.fillRect(x + 34, y + 46, 8, 8);
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 14, y + 10, 28, 22);
    ctx.fillRect(x + 18, y + 4, 20, 10);
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 8, y + 30, 8, 6);
    ctx.fillRect(x + 40, y + 30, 8, 6);
  },
};

// ── Ivysaur (2) ──
SPRITES[2] = {
  front: (ctx, x, y) => {
    // Larger body
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 8, y + 28, 38, 22);
    ctx.fillRect(x + 10, y + 48, 10, 8);
    ctx.fillRect(x + 34, y + 48, 10, 8);
    // Big flower bud
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 14, y + 8, 26, 22);
    ctx.fillStyle = '#e85080';
    ctx.fillRect(x + 18, y + 4, 18, 10);
    ctx.fillRect(x + 22, y + 1, 10, 6);
    // Head
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 2, y + 28, 20, 18);
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 4, y + 32, 5, 5);
    ctx.fillRect(x + 13, y + 32, 5, 5);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 6, y + 42, 10, 2);
    // Spots
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 30, y + 32, 5, 5);
    ctx.fillRect(x + 38, y + 38, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 8, y + 30, 38, 22);
    ctx.fillRect(x + 10, y + 50, 10, 6);
    ctx.fillRect(x + 34, y + 50, 10, 6);
    ctx.fillStyle = C.bDark;
    ctx.fillRect(x + 10, y + 8, 34, 26);
    ctx.fillStyle = '#e85080';
    ctx.fillRect(x + 14, y + 2, 26, 12);
    ctx.fillRect(x + 20, y + -2, 14, 8);
    ctx.fillStyle = C.bGreen;
    ctx.fillRect(x + 4, y + 32, 10, 8);
    ctx.fillRect(x + 42, y + 32, 10, 8);
  },
};

// ── Charmander (4) ──
SPRITES[4] = {
  front: (ctx, x, y) => {
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 18, y + 20, 20, 24);
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 22, y + 26, 12, 14);
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 14, y + 8, 24, 16);
    ctx.fillStyle = '#3898e8';
    ctx.fillRect(x + 18, y + 14, 4, 4);
    ctx.fillRect(x + 30, y + 14, 4, 4);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 20, 8, 2);
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 10, y + 26, 8, 4);
    ctx.fillRect(x + 38, y + 26, 8, 4);
    ctx.fillRect(x + 20, y + 44, 6, 8);
    ctx.fillRect(x + 30, y + 44, 6, 8);
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
    ctx.fillRect(x + 38, y + 36, 10, 4);
    ctx.fillStyle = C.cFlame;
    ctx.fillRect(x + 46, y + 30, 8, 12);
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 48, y + 34, 4, 4);
    ctx.fillStyle = C.cOrange;
    ctx.fillRect(x + 12, y + 8, 4, 6);
    ctx.fillRect(x + 36, y + 8, 4, 6);
  },
};

// ── Charmeleon (5) ──
SPRITES[5] = {
  front: (ctx, x, y) => {
    // Taller, more muscular
    ctx.fillStyle = C.cDark;
    ctx.fillRect(x + 16, y + 18, 24, 28);
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 20, y + 24, 16, 18);
    // Head with horn
    ctx.fillStyle = C.cDark;
    ctx.fillRect(x + 12, y + 4, 28, 18);
    ctx.fillRect(x + 24, y + 0, 6, 6);
    // Eyes
    ctx.fillStyle = '#3898e8';
    ctx.fillRect(x + 16, y + 10, 5, 5);
    ctx.fillRect(x + 31, y + 10, 5, 5);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 18, 12, 2);
    // Arms/claws
    ctx.fillStyle = C.cDark;
    ctx.fillRect(x + 6, y + 24, 10, 5);
    ctx.fillRect(x + 40, y + 24, 10, 5);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 4, y + 26, 3, 3);
    ctx.fillRect(x + 48, y + 26, 3, 3);
    // Legs
    ctx.fillStyle = C.cDark;
    ctx.fillRect(x + 18, y + 46, 8, 10);
    ctx.fillRect(x + 30, y + 46, 8, 10);
    // Tail flame (bigger)
    ctx.fillRect(x + 40, y + 36, 12, 4);
    ctx.fillStyle = C.cFlame;
    ctx.fillRect(x + 48, y + 28, 8, 14);
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 50, y + 32, 4, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.cDark;
    ctx.fillRect(x + 16, y + 18, 24, 28);
    ctx.fillRect(x + 12, y + 4, 28, 18);
    ctx.fillRect(x + 24, y + 0, 6, 6);
    ctx.fillRect(x + 18, y + 46, 8, 10);
    ctx.fillRect(x + 30, y + 46, 8, 10);
    ctx.fillRect(x + 40, y + 36, 12, 4);
    ctx.fillStyle = C.cFlame;
    ctx.fillRect(x + 48, y + 28, 10, 16);
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 50, y + 32, 6, 8);
  },
};

// ── Squirtle (7) ──
SPRITES[7] = {
  front: (ctx, x, y) => {
    ctx.fillStyle = C.sShell;
    ctx.fillRect(x + 16, y + 20, 24, 22);
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 18, y + 22, 20, 18);
    ctx.fillStyle = C.sCream;
    ctx.fillRect(x + 22, y + 26, 12, 12);
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 16, y + 8, 22, 16);
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 20, y + 14, 4, 4);
    ctx.fillRect(x + 30, y + 14, 4, 4);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 24, y + 20, 6, 2);
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 20, y + 42, 6, 8);
    ctx.fillRect(x + 30, y + 42, 6, 8);
    ctx.fillRect(x + 8, y + 32, 8, 6);
    ctx.fillRect(x + 4, y + 28, 6, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.sShell;
    ctx.fillRect(x + 14, y + 16, 28, 26);
    ctx.fillStyle = '#8b5e14';
    ctx.fillRect(x + 20, y + 20, 16, 2);
    ctx.fillRect(x + 26, y + 20, 4, 18);
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 18, y + 8, 20, 12);
    ctx.fillRect(x + 20, y + 42, 6, 8);
    ctx.fillRect(x + 30, y + 42, 6, 8);
    ctx.fillRect(x + 8, y + 34, 8, 6);
    ctx.fillRect(x + 4, y + 30, 6, 6);
  },
};

// ── Wartortle (8) ──
SPRITES[8] = {
  front: (ctx, x, y) => {
    // Bigger shell
    ctx.fillStyle = C.sShell;
    ctx.fillRect(x + 12, y + 18, 30, 26);
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 14, y + 20, 26, 22);
    ctx.fillStyle = C.sCream;
    ctx.fillRect(x + 18, y + 26, 16, 14);
    // Head with ear tufts
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 14, y + 4, 26, 18);
    // Ear tufts (fluffy)
    ctx.fillStyle = C.sDark;
    ctx.fillRect(x + 8, y + 4, 8, 8);
    ctx.fillRect(x + 38, y + 4, 8, 8);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 9, y + 5, 4, 4);
    ctx.fillRect(x + 39, y + 5, 4, 4);
    // Eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 18, y + 10, 5, 5);
    ctx.fillRect(x + 31, y + 10, 5, 5);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 18, 8, 2);
    // Legs
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 18, y + 44, 8, 10);
    ctx.fillRect(x + 30, y + 44, 8, 10);
    // Tail (fluffy)
    ctx.fillStyle = C.sDark;
    ctx.fillRect(x + 4, y + 30, 10, 10);
    ctx.fillRect(x + 0, y + 24, 8, 10);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 5, y + 31, 6, 6);
    ctx.fillRect(x + 1, y + 25, 4, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.sShell;
    ctx.fillRect(x + 10, y + 14, 34, 30);
    ctx.fillStyle = '#8b5e14';
    ctx.fillRect(x + 16, y + 18, 22, 2);
    ctx.fillRect(x + 25, y + 18, 4, 22);
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 16, y + 4, 22, 14);
    ctx.fillStyle = C.sDark;
    ctx.fillRect(x + 10, y + 4, 8, 8);
    ctx.fillRect(x + 36, y + 4, 8, 8);
    ctx.fillStyle = C.sBlue;
    ctx.fillRect(x + 18, y + 44, 8, 10);
    ctx.fillRect(x + 30, y + 44, 8, 10);
    ctx.fillStyle = C.sDark;
    ctx.fillRect(x + 4, y + 32, 10, 10);
    ctx.fillRect(x + 0, y + 26, 8, 10);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 5, y + 33, 6, 6);
  },
};

// ── Pidgey (16) ──
SPRITES[16] = {
  front: (ctx, x, y) => {
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 16, y + 24, 24, 18);
    ctx.fillStyle = C.pCream;
    ctx.fillRect(x + 20, y + 30, 16, 10);
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 18, y + 10, 18, 16);
    ctx.fillRect(x + 24, y + 4, 6, 8);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 16, 3, 3);
    ctx.fillRect(x + 30, y + 16, 3, 3);
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 25, y + 22, 6, 3);
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 8, y + 26, 10, 12);
    ctx.fillRect(x + 38, y + 26, 10, 12);
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
    ctx.fillStyle = C.rPurple;
    ctx.fillRect(x + 14, y + 26, 28, 16);
    ctx.fillStyle = C.rCream;
    ctx.fillRect(x + 18, y + 32, 20, 8);
    ctx.fillStyle = C.rPurple;
    ctx.fillRect(x + 12, y + 14, 22, 16);
    ctx.fillRect(x + 10, y + 6, 8, 10);
    ctx.fillRect(x + 28, y + 6, 8, 10);
    ctx.fillStyle = C.rCream;
    ctx.fillRect(x + 12, y + 8, 4, 6);
    ctx.fillRect(x + 30, y + 8, 4, 6);
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 16, y + 18, 4, 4);
    ctx.fillRect(x + 26, y + 18, 4, 4);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 20, y + 26, 3, 4);
    ctx.fillRect(x + 24, y + 26, 3, 4);
    ctx.fillStyle = C.rPurple;
    ctx.fillRect(x + 40, y + 28, 12, 3);
    ctx.fillRect(x + 48, y + 22, 4, 8);
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
    ctx.fillStyle = C.catGreen;
    ctx.fillRect(x + 18, y + 42, 14, 8);
    ctx.fillRect(x + 16, y + 34, 16, 10);
    ctx.fillRect(x + 14, y + 26, 18, 10);
    ctx.fillRect(x + 16, y + 18, 16, 10);
    ctx.fillStyle = C.catDark;
    ctx.fillRect(x + 14, y + 34, 18, 2);
    ctx.fillRect(x + 16, y + 26, 16, 2);
    ctx.fillStyle = C.catGreen;
    ctx.fillRect(x + 18, y + 8, 14, 12);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 12, 3, 3);
    ctx.fillRect(x + 28, y + 12, 3, 3);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 21, y + 12, 1, 1);
    ctx.fillRect(x + 29, y + 12, 1, 1);
    ctx.fillStyle = C.catRed;
    ctx.fillRect(x + 22, y + 4, 3, 6);
    ctx.fillRect(x + 28, y + 4, 3, 6);
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

// ── Pikachu (25) ──
SPRITES[25] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.pikYellow;
    ctx.fillRect(x + 16, y + 22, 24, 20);
    // Red cheeks
    ctx.fillStyle = C.pikRed;
    ctx.fillRect(x + 10, y + 30, 6, 5);
    ctx.fillRect(x + 40, y + 30, 6, 5);
    // Head
    ctx.fillStyle = C.pikYellow;
    ctx.fillRect(x + 14, y + 12, 26, 16);
    // Ears (tall, black-tipped)
    ctx.fillRect(x + 14, y + 0, 6, 14);
    ctx.fillRect(x + 34, y + 0, 6, 14);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 14, y + 0, 6, 4);
    ctx.fillRect(x + 34, y + 0, 6, 4);
    // Eyes
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 18, y + 18, 5, 5);
    ctx.fillRect(x + 31, y + 18, 5, 5);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 20, y + 19, 2, 2);
    ctx.fillRect(x + 33, y + 19, 2, 2);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 24, y + 26, 6, 2);
    // Legs
    ctx.fillStyle = C.pikYellow;
    ctx.fillRect(x + 18, y + 42, 7, 8);
    ctx.fillRect(x + 31, y + 42, 7, 8);
    // Tail (lightning bolt)
    ctx.fillStyle = C.pikBrown;
    ctx.fillRect(x + 42, y + 26, 4, 10);
    ctx.fillStyle = C.pikYellow;
    ctx.fillRect(x + 44, y + 16, 8, 12);
    ctx.fillRect(x + 48, y + 12, 6, 8);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.pikYellow;
    ctx.fillRect(x + 16, y + 22, 24, 20);
    ctx.fillRect(x + 14, y + 12, 26, 16);
    ctx.fillRect(x + 14, y + 0, 6, 14);
    ctx.fillRect(x + 34, y + 0, 6, 14);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 14, y + 0, 6, 4);
    ctx.fillRect(x + 34, y + 0, 6, 4);
    ctx.fillStyle = C.pikYellow;
    ctx.fillRect(x + 18, y + 42, 7, 8);
    ctx.fillRect(x + 31, y + 42, 7, 8);
    // Tail (prominent from behind)
    ctx.fillStyle = C.pikBrown;
    ctx.fillRect(x + 22, y + 26, 10, 4);
    ctx.fillStyle = C.pikYellow;
    ctx.fillRect(x + 18, y + 14, 18, 6);
    ctx.fillRect(x + 14, y + 8, 12, 10);
  },
};

// ── Zubat (41) ──
SPRITES[41] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.zBlue;
    ctx.fillRect(x + 20, y + 20, 16, 18);
    // Head
    ctx.fillRect(x + 18, y + 10, 20, 14);
    // Ears
    ctx.fillStyle = C.zPurple;
    ctx.fillRect(x + 16, y + 2, 8, 12);
    ctx.fillRect(x + 32, y + 2, 8, 12);
    ctx.fillStyle = C.zBlue;
    ctx.fillRect(x + 18, y + 4, 4, 8);
    ctx.fillRect(x + 34, y + 4, 4, 8);
    // Mouth
    ctx.fillStyle = C.zMouth;
    ctx.fillRect(x + 24, y + 20, 8, 4);
    // Fangs
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 25, y + 24, 2, 3);
    ctx.fillRect(x + 29, y + 24, 2, 3);
    // Wings
    ctx.fillStyle = C.zPurple;
    ctx.fillRect(x + 2, y + 16, 18, 16);
    ctx.fillRect(x + 36, y + 16, 18, 16);
    // Wing membranes
    ctx.fillStyle = C.zBlue;
    ctx.fillRect(x + 4, y + 18, 14, 12);
    ctx.fillRect(x + 38, y + 18, 14, 12);
    // Feet
    ctx.fillStyle = C.zPurple;
    ctx.fillRect(x + 22, y + 38, 4, 6);
    ctx.fillRect(x + 30, y + 38, 4, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.zBlue;
    ctx.fillRect(x + 20, y + 20, 16, 18);
    ctx.fillRect(x + 18, y + 10, 20, 14);
    ctx.fillStyle = C.zPurple;
    ctx.fillRect(x + 16, y + 2, 8, 12);
    ctx.fillRect(x + 32, y + 2, 8, 12);
    ctx.fillRect(x + 2, y + 16, 18, 16);
    ctx.fillRect(x + 36, y + 16, 18, 16);
    ctx.fillStyle = C.zBlue;
    ctx.fillRect(x + 4, y + 18, 14, 12);
    ctx.fillRect(x + 38, y + 18, 14, 12);
    ctx.fillStyle = C.zPurple;
    ctx.fillRect(x + 22, y + 38, 4, 6);
    ctx.fillRect(x + 30, y + 38, 4, 6);
  },
};

// ── Geodude (74) ──
SPRITES[74] = {
  front: (ctx, x, y) => {
    // Body (round rock)
    ctx.fillStyle = C.gBrown;
    ctx.fillRect(x + 12, y + 14, 32, 28);
    ctx.fillRect(x + 16, y + 10, 24, 4);
    ctx.fillRect(x + 16, y + 42, 24, 4);
    // Cracks/texture
    ctx.fillStyle = C.gDark;
    ctx.fillRect(x + 20, y + 18, 2, 8);
    ctx.fillRect(x + 34, y + 22, 6, 2);
    ctx.fillRect(x + 16, y + 34, 8, 2);
    // Highlights
    ctx.fillStyle = C.gLight;
    ctx.fillRect(x + 18, y + 14, 8, 4);
    ctx.fillRect(x + 30, y + 16, 6, 3);
    // Eyes (angry)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 18, y + 24, 6, 4);
    ctx.fillRect(x + 32, y + 24, 6, 4);
    // Eyebrows
    ctx.fillRect(x + 16, y + 22, 8, 2);
    ctx.fillRect(x + 32, y + 22, 8, 2);
    // Mouth
    ctx.fillRect(x + 24, y + 34, 8, 2);
    // Arms (rocky)
    ctx.fillStyle = C.gBrown;
    ctx.fillRect(x + 2, y + 22, 10, 8);
    ctx.fillRect(x + 44, y + 22, 10, 8);
    ctx.fillStyle = C.gDark;
    ctx.fillRect(x + 2, y + 24, 4, 4);
    ctx.fillRect(x + 50, y + 24, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.gBrown;
    ctx.fillRect(x + 12, y + 14, 32, 28);
    ctx.fillRect(x + 16, y + 10, 24, 4);
    ctx.fillRect(x + 16, y + 42, 24, 4);
    ctx.fillStyle = C.gDark;
    ctx.fillRect(x + 18, y + 16, 4, 8);
    ctx.fillRect(x + 30, y + 20, 8, 3);
    ctx.fillRect(x + 14, y + 32, 10, 3);
    ctx.fillRect(x + 34, y + 36, 6, 3);
    ctx.fillStyle = C.gBrown;
    ctx.fillRect(x + 2, y + 22, 10, 8);
    ctx.fillRect(x + 44, y + 22, 10, 8);
  },
};

// ── NidoranM (32) ──
SPRITES[32] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.nPurple;
    ctx.fillRect(x + 14, y + 24, 28, 18);
    // Belly
    ctx.fillStyle = C.nCream;
    ctx.fillRect(x + 18, y + 30, 18, 10);
    // Head
    ctx.fillStyle = C.nPurple;
    ctx.fillRect(x + 12, y + 12, 24, 16);
    // Horn
    ctx.fillStyle = C.nDark;
    ctx.fillRect(x + 22, y + 4, 6, 10);
    ctx.fillRect(x + 24, y + 2, 2, 4);
    // Ears
    ctx.fillStyle = C.nPurple;
    ctx.fillRect(x + 10, y + 6, 8, 10);
    ctx.fillRect(x + 30, y + 6, 8, 10);
    ctx.fillStyle = C.nCream;
    ctx.fillRect(x + 12, y + 8, 4, 6);
    ctx.fillRect(x + 32, y + 8, 4, 6);
    // Eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 16, y + 18, 4, 4);
    ctx.fillRect(x + 28, y + 18, 4, 4);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 24, 8, 2);
    // Legs
    ctx.fillStyle = C.nPurple;
    ctx.fillRect(x + 16, y + 42, 6, 8);
    ctx.fillRect(x + 34, y + 42, 6, 8);
    // Spines on back
    ctx.fillStyle = C.nDark;
    ctx.fillRect(x + 34, y + 26, 4, 4);
    ctx.fillRect(x + 38, y + 30, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.nPurple;
    ctx.fillRect(x + 14, y + 24, 28, 18);
    ctx.fillRect(x + 12, y + 12, 24, 16);
    ctx.fillStyle = C.nDark;
    ctx.fillRect(x + 22, y + 4, 6, 10);
    ctx.fillRect(x + 24, y + 2, 2, 4);
    ctx.fillStyle = C.nPurple;
    ctx.fillRect(x + 10, y + 6, 8, 10);
    ctx.fillRect(x + 30, y + 6, 8, 10);
    ctx.fillRect(x + 16, y + 42, 6, 8);
    ctx.fillRect(x + 34, y + 42, 6, 8);
    ctx.fillStyle = C.nDark;
    ctx.fillRect(x + 20, y + 20, 4, 4);
    ctx.fillRect(x + 26, y + 18, 4, 4);
    ctx.fillRect(x + 32, y + 20, 4, 4);
    ctx.fillRect(x + 24, y + 26, 4, 4);
    ctx.fillRect(x + 30, y + 28, 4, 4);
  },
};

// ── Metapod (11) ──
SPRITES[11] = {
  front: (ctx, x, y) => {
    // Cocoon shape
    ctx.fillStyle = C.catGreen;
    ctx.fillRect(x + 18, y + 8, 20, 38);
    ctx.fillRect(x + 16, y + 14, 24, 26);
    // Darker shell segments
    ctx.fillStyle = C.catDark;
    ctx.fillRect(x + 18, y + 18, 20, 2);
    ctx.fillRect(x + 18, y + 26, 20, 2);
    ctx.fillRect(x + 18, y + 34, 20, 2);
    // Highlights
    ctx.fillStyle = '#90d050';
    ctx.fillRect(x + 20, y + 12, 8, 4);
    ctx.fillRect(x + 22, y + 22, 6, 3);
    // Eyes (sleepy)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 14, 4, 3);
    ctx.fillRect(x + 30, y + 14, 4, 3);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.catGreen;
    ctx.fillRect(x + 18, y + 8, 20, 38);
    ctx.fillRect(x + 16, y + 14, 24, 26);
    ctx.fillStyle = C.catDark;
    ctx.fillRect(x + 18, y + 18, 20, 2);
    ctx.fillRect(x + 18, y + 26, 20, 2);
    ctx.fillRect(x + 18, y + 34, 20, 2);
    ctx.fillStyle = '#90d050';
    ctx.fillRect(x + 20, y + 12, 8, 4);
  },
};

// ── Butterfree (12) ──
SPRITES[12] = {
  front: (ctx, x, y) => {
    // Wings
    ctx.fillStyle = '#e8e8f8';
    ctx.fillRect(x + 2, y + 12, 20, 22);
    ctx.fillRect(x + 34, y + 12, 20, 22);
    // Wing details
    ctx.fillStyle = '#b0b0e0';
    ctx.fillRect(x + 4, y + 16, 8, 8);
    ctx.fillRect(x + 44, y + 16, 8, 8);
    ctx.fillStyle = '#4040a0';
    ctx.fillRect(x + 6, y + 18, 4, 4);
    ctx.fillRect(x + 46, y + 18, 4, 4);
    // Lower wings
    ctx.fillStyle = '#e8e8f8';
    ctx.fillRect(x + 6, y + 34, 14, 10);
    ctx.fillRect(x + 36, y + 34, 14, 10);
    // Body
    ctx.fillStyle = '#7070c8';
    ctx.fillRect(x + 24, y + 14, 8, 26);
    // Head
    ctx.fillStyle = '#7070c8';
    ctx.fillRect(x + 22, y + 6, 12, 12);
    // Eyes (big, red)
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 22, y + 10, 5, 5);
    ctx.fillRect(x + 29, y + 10, 5, 5);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 23, y + 11, 2, 2);
    ctx.fillRect(x + 30, y + 11, 2, 2);
    // Antennae
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 23, y + 2, 2, 6);
    ctx.fillRect(x + 31, y + 2, 2, 6);
    // Feet
    ctx.fillStyle = '#7070c8';
    ctx.fillRect(x + 24, y + 40, 4, 6);
    ctx.fillRect(x + 28, y + 40, 4, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#e8e8f8';
    ctx.fillRect(x + 2, y + 12, 20, 22);
    ctx.fillRect(x + 34, y + 12, 20, 22);
    ctx.fillStyle = '#b0b0e0';
    ctx.fillRect(x + 4, y + 16, 8, 8);
    ctx.fillRect(x + 44, y + 16, 8, 8);
    ctx.fillStyle = '#e8e8f8';
    ctx.fillRect(x + 6, y + 34, 14, 10);
    ctx.fillRect(x + 36, y + 34, 14, 10);
    ctx.fillStyle = '#7070c8';
    ctx.fillRect(x + 24, y + 14, 8, 26);
    ctx.fillRect(x + 22, y + 6, 12, 12);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 23, y + 2, 2, 6);
    ctx.fillRect(x + 31, y + 2, 2, 6);
    ctx.fillStyle = '#7070c8';
    ctx.fillRect(x + 24, y + 40, 4, 6);
    ctx.fillRect(x + 28, y + 40, 4, 6);
  },
};

// ── Pidgeotto (17) ──
SPRITES[17] = {
  front: (ctx, x, y) => {
    // Body (larger than Pidgey)
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 12, y + 22, 30, 20);
    ctx.fillStyle = C.pCream;
    ctx.fillRect(x + 16, y + 28, 22, 12);
    // Head with crest
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 14, y + 6, 24, 20);
    // Red/cream crest feathers
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 20, y + 0, 8, 10);
    ctx.fillRect(x + 26, y + 2, 6, 6);
    ctx.fillStyle = C.pCream;
    ctx.fillRect(x + 22, y + 2, 4, 6);
    // Eyes
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 18, y + 14, 4, 4);
    ctx.fillRect(x + 30, y + 14, 4, 4);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 19, y + 14, 2, 2);
    ctx.fillRect(x + 31, y + 14, 2, 2);
    // Beak
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 22, y + 20, 8, 4);
    ctx.fillRect(x + 24, y + 24, 4, 2);
    // Wings
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 2, y + 24, 14, 14);
    ctx.fillRect(x + 38, y + 24, 14, 14);
    // Wing tips
    ctx.fillStyle = '#a06828';
    ctx.fillRect(x + 2, y + 32, 8, 6);
    ctx.fillRect(x + 44, y + 32, 8, 6);
    // Talons
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 18, y + 42, 6, 8);
    ctx.fillRect(x + 30, y + 42, 6, 8);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 12, y + 22, 30, 20);
    ctx.fillRect(x + 14, y + 6, 24, 20);
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 20, y + 0, 8, 10);
    ctx.fillRect(x + 26, y + 2, 6, 6);
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 2, y + 24, 14, 14);
    ctx.fillRect(x + 38, y + 24, 14, 14);
    ctx.fillStyle = '#a06828';
    ctx.fillRect(x + 2, y + 32, 8, 6);
    ctx.fillRect(x + 44, y + 32, 8, 6);
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 18, y + 42, 6, 8);
    ctx.fillRect(x + 30, y + 42, 6, 8);
  },
};

// ── Raticate (20) ──
SPRITES[20] = {
  front: (ctx, x, y) => {
    // Body (larger, more muscular)
    ctx.fillStyle = '#c08848';
    ctx.fillRect(x + 10, y + 24, 34, 18);
    ctx.fillStyle = C.rCream;
    ctx.fillRect(x + 14, y + 30, 26, 10);
    // Head
    ctx.fillStyle = '#c08848';
    ctx.fillRect(x + 8, y + 12, 28, 18);
    // Ears
    ctx.fillRect(x + 6, y + 4, 10, 12);
    ctx.fillRect(x + 28, y + 4, 10, 12);
    ctx.fillStyle = C.rCream;
    ctx.fillRect(x + 8, y + 6, 6, 8);
    ctx.fillRect(x + 30, y + 6, 6, 8);
    // Eyes (fierce)
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 12, y + 16, 6, 5);
    ctx.fillRect(x + 26, y + 16, 6, 5);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 14, y + 17, 3, 3);
    ctx.fillRect(x + 28, y + 17, 3, 3);
    // Big teeth
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 18, y + 26, 4, 6);
    ctx.fillRect(x + 24, y + 26, 4, 6);
    // Whiskers
    ctx.fillStyle = '#c08848';
    ctx.fillRect(x + 2, y + 22, 8, 2);
    ctx.fillRect(x + 34, y + 22, 8, 2);
    // Tail
    ctx.fillRect(x + 42, y + 28, 12, 3);
    ctx.fillRect(x + 50, y + 22, 4, 8);
    // Legs
    ctx.fillRect(x + 14, y + 42, 8, 8);
    ctx.fillRect(x + 32, y + 42, 8, 8);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#c08848';
    ctx.fillRect(x + 10, y + 24, 34, 18);
    ctx.fillRect(x + 8, y + 12, 28, 18);
    ctx.fillRect(x + 6, y + 4, 10, 12);
    ctx.fillRect(x + 28, y + 4, 10, 12);
    ctx.fillRect(x + 42, y + 28, 12, 3);
    ctx.fillRect(x + 50, y + 22, 4, 8);
    ctx.fillRect(x + 14, y + 42, 8, 8);
    ctx.fillRect(x + 32, y + 42, 8, 8);
  },
};

// ── Onix (95) ──
SPRITES[95] = {
  front: (ctx, x, y) => {
    // Large rocky head
    ctx.fillStyle = '#a0907c';
    ctx.fillRect(x + 14, y + 4, 28, 24);
    ctx.fillRect(x + 10, y + 8, 36, 16);
    // Head crest
    ctx.fillStyle = '#807060';
    ctx.fillRect(x + 18, y + 0, 8, 8);
    ctx.fillRect(x + 30, y + 0, 8, 8);
    // Eyes (intense)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 16, y + 12, 8, 6);
    ctx.fillRect(x + 32, y + 12, 8, 6);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 18, y + 13, 4, 3);
    ctx.fillRect(x + 34, y + 13, 4, 3);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 22, 16, 4);
    // Body segments (snake-like going down)
    ctx.fillStyle = '#b0a090';
    ctx.fillRect(x + 18, y + 28, 20, 10);
    ctx.fillStyle = '#908070';
    ctx.fillRect(x + 20, y + 30, 16, 2);
    ctx.fillStyle = '#b0a090';
    ctx.fillRect(x + 22, y + 38, 16, 8);
    ctx.fillStyle = '#908070';
    ctx.fillRect(x + 24, y + 40, 12, 2);
    ctx.fillStyle = '#b0a090';
    ctx.fillRect(x + 26, y + 46, 12, 8);
    // Rock texture
    ctx.fillStyle = '#c8b8a8';
    ctx.fillRect(x + 16, y + 8, 6, 4);
    ctx.fillRect(x + 36, y + 10, 6, 3);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#a0907c';
    ctx.fillRect(x + 14, y + 4, 28, 24);
    ctx.fillRect(x + 10, y + 8, 36, 16);
    ctx.fillStyle = '#807060';
    ctx.fillRect(x + 18, y + 0, 8, 8);
    ctx.fillRect(x + 30, y + 0, 8, 8);
    ctx.fillStyle = '#b0a090';
    ctx.fillRect(x + 18, y + 28, 20, 10);
    ctx.fillRect(x + 22, y + 38, 16, 8);
    ctx.fillRect(x + 26, y + 46, 12, 8);
    ctx.fillStyle = '#908070';
    ctx.fillRect(x + 20, y + 30, 16, 2);
    ctx.fillRect(x + 24, y + 40, 12, 2);
  },
};

// ── Weedle (13) ──
SPRITES[13] = {
  front: (ctx, x, y) => {
    // Segmented caterpillar body
    ctx.fillStyle = '#d8a838';
    ctx.fillRect(x + 18, y + 42, 14, 8);
    ctx.fillRect(x + 16, y + 34, 16, 10);
    ctx.fillRect(x + 14, y + 26, 18, 10);
    ctx.fillRect(x + 16, y + 18, 16, 10);
    // Darker bands
    ctx.fillStyle = '#b08828';
    ctx.fillRect(x + 14, y + 34, 18, 2);
    ctx.fillRect(x + 16, y + 26, 16, 2);
    // Head
    ctx.fillStyle = '#d8a838';
    ctx.fillRect(x + 18, y + 8, 14, 12);
    // Horn (stinger on head)
    ctx.fillStyle = '#e85050';
    ctx.fillRect(x + 23, y + 2, 4, 8);
    ctx.fillRect(x + 24, y + 0, 2, 4);
    // Eyes
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 12, 3, 3);
    ctx.fillRect(x + 28, y + 12, 3, 3);
    // Tail stinger
    ctx.fillStyle = '#e85050';
    ctx.fillRect(x + 22, y + 48, 6, 4);
    // Feet
    ctx.fillStyle = '#b08828';
    ctx.fillRect(x + 14, y + 46, 4, 4);
    ctx.fillRect(x + 30, y + 46, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#d8a838';
    ctx.fillRect(x + 18, y + 42, 14, 8);
    ctx.fillRect(x + 16, y + 34, 16, 10);
    ctx.fillRect(x + 14, y + 26, 18, 10);
    ctx.fillRect(x + 16, y + 18, 16, 10);
    ctx.fillRect(x + 18, y + 8, 14, 12);
    ctx.fillStyle = '#b08828';
    ctx.fillRect(x + 14, y + 34, 18, 2);
    ctx.fillRect(x + 16, y + 26, 16, 2);
    ctx.fillStyle = '#e85050';
    ctx.fillRect(x + 23, y + 2, 4, 8);
    ctx.fillRect(x + 22, y + 48, 6, 4);
  },
};

// ── Kakuna (14) ──
SPRITES[14] = {
  front: (ctx, x, y) => {
    // Cocoon shape (yellow)
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 18, y + 8, 20, 38);
    ctx.fillRect(x + 16, y + 14, 24, 26);
    // Shell texture
    ctx.fillStyle = '#b0a028';
    ctx.fillRect(x + 18, y + 18, 20, 2);
    ctx.fillRect(x + 18, y + 26, 20, 2);
    ctx.fillRect(x + 18, y + 34, 20, 2);
    // Eyes (triangle/angry)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 14, 4, 3);
    ctx.fillRect(x + 30, y + 14, 4, 3);
    // Highlight
    ctx.fillStyle = '#e8d848';
    ctx.fillRect(x + 20, y + 10, 8, 3);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 18, y + 8, 20, 38);
    ctx.fillRect(x + 16, y + 14, 24, 26);
    ctx.fillStyle = '#b0a028';
    ctx.fillRect(x + 18, y + 18, 20, 2);
    ctx.fillRect(x + 18, y + 26, 20, 2);
    ctx.fillRect(x + 18, y + 34, 20, 2);
  },
};

// ── Beedrill (15) ──
SPRITES[15] = {
  front: (ctx, x, y) => {
    // Abdomen (striped)
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 20, y + 30, 16, 16);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 34, 16, 3);
    ctx.fillRect(x + 20, y + 40, 16, 3);
    // Stinger
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 25, y + 46, 6, 6);
    ctx.fillRect(x + 27, y + 50, 2, 4);
    // Thorax
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 22, y + 22, 12, 10);
    // Head
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 20, y + 10, 16, 14);
    // Eyes (red, menacing)
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 22, y + 14, 5, 5);
    ctx.fillRect(x + 29, y + 14, 5, 5);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 23, y + 15, 2, 2);
    ctx.fillRect(x + 30, y + 15, 2, 2);
    // Antennae
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 6, 2, 6);
    ctx.fillRect(x + 32, y + 6, 2, 6);
    // Wings
    ctx.fillStyle = 'rgba(200, 220, 255, 0.7)';
    ctx.fillRect(x + 4, y + 14, 18, 14);
    ctx.fillRect(x + 34, y + 14, 18, 14);
    // Drill arms
    ctx.fillStyle = '#b0a028';
    ctx.fillRect(x + 8, y + 24, 12, 4);
    ctx.fillRect(x + 36, y + 24, 12, 4);
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 4, y + 25, 6, 2);
    ctx.fillRect(x + 46, y + 25, 6, 2);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 20, y + 30, 16, 16);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 34, 16, 3);
    ctx.fillRect(x + 20, y + 40, 16, 3);
    ctx.fillRect(x + 25, y + 46, 6, 6);
    ctx.fillStyle = '#d8c038';
    ctx.fillRect(x + 22, y + 22, 12, 10);
    ctx.fillRect(x + 20, y + 10, 16, 14);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 6, 2, 6);
    ctx.fillRect(x + 32, y + 6, 2, 6);
    ctx.fillStyle = 'rgba(200, 220, 255, 0.7)';
    ctx.fillRect(x + 4, y + 14, 18, 14);
    ctx.fillRect(x + 34, y + 14, 18, 14);
  },
};

// ── Pidgeot (18) ──
SPRITES[18] = {
  front: (ctx, x, y) => {
    // Body (large, majestic)
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 10, y + 22, 34, 22);
    ctx.fillStyle = C.pCream;
    ctx.fillRect(x + 14, y + 28, 26, 14);
    // Head
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 12, y + 4, 28, 22);
    // Long crest feathers (red/yellow)
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 18, y + -2, 10, 10);
    ctx.fillRect(x + 26, y + -4, 8, 8);
    ctx.fillRect(x + 32, y + -2, 6, 6);
    ctx.fillStyle = '#f8d830';
    ctx.fillRect(x + 20, y + 0, 6, 6);
    ctx.fillRect(x + 28, y + -2, 4, 4);
    // Eyes (fierce)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 16, y + 12, 5, 5);
    ctx.fillRect(x + 31, y + 12, 5, 5);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 17, y + 12, 2, 2);
    ctx.fillRect(x + 32, y + 12, 2, 2);
    // Beak
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 20, y + 20, 12, 4);
    ctx.fillRect(x + 24, y + 24, 4, 2);
    // Wings (large, spread)
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 0, y + 22, 16, 18);
    ctx.fillRect(x + 38, y + 22, 16, 18);
    ctx.fillStyle = '#a06828';
    ctx.fillRect(x + 0, y + 34, 10, 6);
    ctx.fillRect(x + 44, y + 34, 10, 6);
    // Talons
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 16, y + 44, 8, 10);
    ctx.fillRect(x + 30, y + 44, 8, 10);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 10, y + 22, 34, 22);
    ctx.fillRect(x + 12, y + 4, 28, 22);
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 18, y + -2, 10, 10);
    ctx.fillRect(x + 26, y + -4, 8, 8);
    ctx.fillStyle = C.pBrown;
    ctx.fillRect(x + 0, y + 22, 16, 18);
    ctx.fillRect(x + 38, y + 22, 16, 18);
    ctx.fillStyle = C.pBeak;
    ctx.fillRect(x + 16, y + 44, 8, 10);
    ctx.fillRect(x + 30, y + 44, 8, 10);
  },
};

// ── Nidorino (33) ──
SPRITES[33] = {
  front: (ctx, x, y) => {
    // Body (larger than NidoranM)
    ctx.fillStyle = '#a058b0';
    ctx.fillRect(x + 10, y + 24, 34, 20);
    ctx.fillStyle = C.nCream;
    ctx.fillRect(x + 14, y + 30, 24, 12);
    // Head
    ctx.fillStyle = '#a058b0';
    ctx.fillRect(x + 8, y + 10, 28, 18);
    // Larger horn
    ctx.fillStyle = '#704880';
    ctx.fillRect(x + 20, y + 2, 8, 12);
    ctx.fillRect(x + 22, y + -2, 4, 6);
    // Ears
    ctx.fillStyle = '#a058b0';
    ctx.fillRect(x + 6, y + 4, 10, 12);
    ctx.fillRect(x + 28, y + 4, 10, 12);
    ctx.fillStyle = C.nCream;
    ctx.fillRect(x + 8, y + 6, 6, 8);
    ctx.fillRect(x + 30, y + 6, 6, 8);
    // Eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 12, y + 16, 5, 5);
    ctx.fillRect(x + 27, y + 16, 5, 5);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 18, y + 24, 10, 2);
    // Legs
    ctx.fillStyle = '#a058b0';
    ctx.fillRect(x + 14, y + 44, 8, 10);
    ctx.fillRect(x + 32, y + 44, 8, 10);
    // Spines
    ctx.fillStyle = '#704880';
    ctx.fillRect(x + 34, y + 26, 5, 5);
    ctx.fillRect(x + 38, y + 30, 5, 5);
    ctx.fillRect(x + 36, y + 34, 5, 5);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#a058b0';
    ctx.fillRect(x + 10, y + 24, 34, 20);
    ctx.fillRect(x + 8, y + 10, 28, 18);
    ctx.fillStyle = '#704880';
    ctx.fillRect(x + 20, y + 2, 8, 12);
    ctx.fillRect(x + 22, y + -2, 4, 6);
    ctx.fillStyle = '#a058b0';
    ctx.fillRect(x + 6, y + 4, 10, 12);
    ctx.fillRect(x + 28, y + 4, 10, 12);
    ctx.fillRect(x + 14, y + 44, 8, 10);
    ctx.fillRect(x + 32, y + 44, 8, 10);
    ctx.fillStyle = '#704880';
    ctx.fillRect(x + 18, y + 18, 5, 5);
    ctx.fillRect(x + 24, y + 16, 5, 5);
    ctx.fillRect(x + 30, y + 18, 5, 5);
    ctx.fillRect(x + 22, y + 24, 5, 5);
    ctx.fillRect(x + 28, y + 26, 5, 5);
  },
};

// ── Oddish (43) ──
SPRITES[43] = {
  front: (ctx, x, y) => {
    // Body (round, blue)
    ctx.fillStyle = '#4878a0';
    ctx.fillRect(x + 16, y + 26, 24, 18);
    ctx.fillRect(x + 14, y + 30, 28, 10);
    // Feet
    ctx.fillStyle = '#4878a0';
    ctx.fillRect(x + 18, y + 44, 6, 6);
    ctx.fillRect(x + 32, y + 44, 6, 6);
    // Eyes (red, round)
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 20, y + 32, 5, 5);
    ctx.fillRect(x + 31, y + 32, 5, 5);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 21, y + 33, 2, 2);
    ctx.fillRect(x + 32, y + 33, 2, 2);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 25, y + 40, 6, 2);
    // Leaves on top
    ctx.fillStyle = '#68b838';
    ctx.fillRect(x + 20, y + 10, 6, 18);
    ctx.fillRect(x + 30, y + 10, 6, 18);
    ctx.fillRect(x + 14, y + 14, 6, 14);
    ctx.fillRect(x + 36, y + 14, 6, 14);
    ctx.fillRect(x + 24, y + 6, 8, 6);
    ctx.fillStyle = '#307030';
    ctx.fillRect(x + 22, y + 14, 2, 10);
    ctx.fillRect(x + 32, y + 14, 2, 10);
    ctx.fillRect(x + 26, y + 8, 2, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#4878a0';
    ctx.fillRect(x + 16, y + 26, 24, 18);
    ctx.fillRect(x + 14, y + 30, 28, 10);
    ctx.fillRect(x + 18, y + 44, 6, 6);
    ctx.fillRect(x + 32, y + 44, 6, 6);
    ctx.fillStyle = '#68b838';
    ctx.fillRect(x + 20, y + 10, 6, 18);
    ctx.fillRect(x + 30, y + 10, 6, 18);
    ctx.fillRect(x + 14, y + 14, 6, 14);
    ctx.fillRect(x + 36, y + 14, 6, 14);
    ctx.fillRect(x + 24, y + 6, 8, 6);
  },
};

// ── Gloom (44) ──
SPRITES[44] = {
  front: (ctx, x, y) => {
    // Body (round, blue, larger)
    ctx.fillStyle = '#4068a0';
    ctx.fillRect(x + 12, y + 28, 30, 18);
    ctx.fillRect(x + 10, y + 32, 34, 10);
    // Feet
    ctx.fillStyle = '#4068a0';
    ctx.fillRect(x + 16, y + 46, 8, 6);
    ctx.fillRect(x + 32, y + 46, 8, 6);
    // Droopy eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 18, y + 34, 6, 4);
    ctx.fillRect(x + 32, y + 34, 6, 4);
    // Drool
    ctx.fillStyle = '#a0c8e8';
    ctx.fillRect(x + 24, y + 42, 4, 6);
    // Flower on top (big, open)
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 10, y + 8, 12, 10);
    ctx.fillRect(x + 34, y + 8, 12, 10);
    ctx.fillRect(x + 14, y + 4, 8, 8);
    ctx.fillRect(x + 34, y + 4, 8, 8);
    ctx.fillStyle = '#e87070';
    ctx.fillRect(x + 22, y + 6, 12, 12);
    // Center
    ctx.fillStyle = '#f8d830';
    ctx.fillRect(x + 24, y + 10, 8, 8);
    ctx.fillStyle = '#b08020';
    ctx.fillRect(x + 26, y + 12, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#4068a0';
    ctx.fillRect(x + 12, y + 28, 30, 18);
    ctx.fillRect(x + 10, y + 32, 34, 10);
    ctx.fillRect(x + 16, y + 46, 8, 6);
    ctx.fillRect(x + 32, y + 46, 8, 6);
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 10, y + 8, 12, 10);
    ctx.fillRect(x + 34, y + 8, 12, 10);
    ctx.fillRect(x + 14, y + 4, 8, 8);
    ctx.fillRect(x + 34, y + 4, 8, 8);
    ctx.fillStyle = '#e87070';
    ctx.fillRect(x + 22, y + 6, 12, 12);
    ctx.fillStyle = '#f8d830';
    ctx.fillRect(x + 24, y + 10, 8, 8);
  },
};

// ── Mankey (56) ──
SPRITES[56] = {
  front: (ctx, x, y) => {
    // Body (round, furry)
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 16, y + 24, 24, 18);
    // Head (round)
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 14, y + 10, 26, 18);
    // Pig nose
    ctx.fillStyle = '#d0a080';
    ctx.fillRect(x + 24, y + 20, 8, 5);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 25, y + 22, 2, 2);
    ctx.fillRect(x + 29, y + 22, 2, 2);
    // Eyes (angry)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 18, y + 14, 5, 5);
    ctx.fillRect(x + 33, y + 14, 5, 5);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 19, y + 15, 2, 2);
    ctx.fillRect(x + 34, y + 15, 2, 2);
    // Eyebrows (angry V)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 16, y + 12, 8, 2);
    ctx.fillRect(x + 32, y + 12, 8, 2);
    // Arms
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 6, y + 28, 10, 5);
    ctx.fillRect(x + 40, y + 28, 10, 5);
    // Hands (balled fists)
    ctx.fillStyle = '#d0a080';
    ctx.fillRect(x + 4, y + 26, 4, 8);
    ctx.fillRect(x + 48, y + 26, 4, 8);
    // Legs
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 20, y + 42, 6, 8);
    ctx.fillRect(x + 30, y + 42, 6, 8);
    // Tail
    ctx.fillStyle = '#d0a080';
    ctx.fillRect(x + 38, y + 36, 10, 3);
    ctx.fillRect(x + 46, y + 32, 4, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 16, y + 24, 24, 18);
    ctx.fillRect(x + 14, y + 10, 26, 18);
    ctx.fillRect(x + 6, y + 28, 10, 5);
    ctx.fillRect(x + 40, y + 28, 10, 5);
    ctx.fillRect(x + 20, y + 42, 6, 8);
    ctx.fillRect(x + 30, y + 42, 6, 8);
    ctx.fillStyle = '#d0a080';
    ctx.fillRect(x + 38, y + 36, 10, 3);
    ctx.fillRect(x + 46, y + 32, 4, 6);
  },
};

// ── Primeape (57) ──
SPRITES[57] = {
  front: (ctx, x, y) => {
    // Body (muscular)
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 12, y + 22, 30, 22);
    // Head (round, furry, angry)
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 10, y + 6, 32, 20);
    // Fur tuft on top
    ctx.fillStyle = '#d0b090';
    ctx.fillRect(x + 18, y + 0, 6, 8);
    ctx.fillRect(x + 28, y + 0, 6, 8);
    ctx.fillRect(x + 22, y + 2, 8, 4);
    // Eyes (rage)
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 14, y + 12, 8, 6);
    ctx.fillRect(x + 32, y + 12, 8, 6);
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 16, y + 14, 4, 4);
    ctx.fillRect(x + 34, y + 14, 4, 4);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 17, y + 15, 2, 2);
    ctx.fillRect(x + 35, y + 15, 2, 2);
    // Nose/mouth
    ctx.fillStyle = '#d0a080';
    ctx.fillRect(x + 22, y + 20, 10, 4);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 24, y + 22, 2, 2);
    ctx.fillRect(x + 28, y + 22, 2, 2);
    // Arms (muscular)
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 2, y + 24, 12, 8);
    ctx.fillRect(x + 40, y + 24, 12, 8);
    // Boxing gloves
    ctx.fillStyle = '#c08060';
    ctx.fillRect(x + 0, y + 22, 6, 10);
    ctx.fillRect(x + 48, y + 22, 6, 10);
    // Legs
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 16, y + 44, 8, 10);
    ctx.fillRect(x + 30, y + 44, 8, 10);
    // Shackle on leg
    ctx.fillStyle = '#808080';
    ctx.fillRect(x + 16, y + 48, 8, 3);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 12, y + 22, 30, 22);
    ctx.fillRect(x + 10, y + 6, 32, 20);
    ctx.fillStyle = '#d0b090';
    ctx.fillRect(x + 18, y + 0, 6, 8);
    ctx.fillRect(x + 28, y + 0, 6, 8);
    ctx.fillRect(x + 2, y + 24, 12, 8);
    ctx.fillRect(x + 40, y + 24, 12, 8);
    ctx.fillStyle = '#e8d0b0';
    ctx.fillRect(x + 16, y + 44, 8, 10);
    ctx.fillRect(x + 30, y + 44, 8, 10);
  },
};

// ── Abra (63) ──
SPRITES[63] = {
  front: (ctx, x, y) => {
    // Body (sitting, yellow)
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 16, y + 28, 24, 16);
    // Head (big)
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 14, y + 8, 26, 22);
    // Ears (pointed)
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 8, y + 4, 8, 12);
    ctx.fillRect(x + 38, y + 4, 8, 12);
    ctx.fillStyle = '#b08820';
    ctx.fillRect(x + 10, y + 6, 4, 8);
    ctx.fillRect(x + 40, y + 6, 4, 8);
    // Eyes (closed/sleeping)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 18, y + 18, 6, 2);
    ctx.fillRect(x + 30, y + 18, 6, 2);
    // Armor/chest
    ctx.fillStyle = '#b08820';
    ctx.fillRect(x + 20, y + 28, 16, 4);
    // Arms (crossed)
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 10, y + 30, 8, 4);
    ctx.fillRect(x + 38, y + 30, 8, 4);
    // Legs/feet
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 18, y + 44, 8, 6);
    ctx.fillRect(x + 30, y + 44, 8, 6);
    // Tail
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 38, y + 38, 10, 3);
    ctx.fillRect(x + 46, y + 34, 4, 8);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 16, y + 28, 24, 16);
    ctx.fillRect(x + 14, y + 8, 26, 22);
    ctx.fillRect(x + 8, y + 4, 8, 12);
    ctx.fillRect(x + 38, y + 4, 8, 12);
    ctx.fillRect(x + 18, y + 44, 8, 6);
    ctx.fillRect(x + 30, y + 44, 8, 6);
    ctx.fillStyle = '#b08820';
    ctx.fillRect(x + 10, y + 6, 4, 8);
    ctx.fillRect(x + 40, y + 6, 4, 8);
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 38, y + 38, 10, 3);
    ctx.fillRect(x + 46, y + 34, 4, 8);
  },
};

// ── Kadabra (64) ──
SPRITES[64] = {
  front: (ctx, x, y) => {
    // Body (taller)
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 18, y + 26, 20, 18);
    ctx.fillStyle = '#b08820';
    ctx.fillRect(x + 22, y + 30, 12, 10);
    // Head (larger, with mustache)
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 14, y + 6, 26, 22);
    // Ears (pointed, larger)
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 6, y + 0, 10, 14);
    ctx.fillRect(x + 38, y + 0, 10, 14);
    ctx.fillStyle = '#b08820';
    ctx.fillRect(x + 8, y + 2, 6, 10);
    ctx.fillRect(x + 40, y + 2, 6, 10);
    // Eyes (open, glowing)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 18, y + 14, 6, 5);
    ctx.fillRect(x + 30, y + 14, 6, 5);
    ctx.fillStyle = '#58a8f8';
    ctx.fillRect(x + 19, y + 15, 4, 3);
    ctx.fillRect(x + 31, y + 15, 4, 3);
    // Mustache
    ctx.fillStyle = '#b08820';
    ctx.fillRect(x + 14, y + 22, 8, 3);
    ctx.fillRect(x + 32, y + 22, 8, 3);
    // Star on forehead
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 24, y + 8, 6, 6);
    // Spoon (right hand)
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(x + 42, y + 22, 3, 16);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(x + 40, y + 18, 7, 6);
    // Arms
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 8, y + 28, 10, 4);
    ctx.fillRect(x + 38, y + 28, 10, 4);
    // Legs
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 20, y + 44, 8, 8);
    ctx.fillRect(x + 30, y + 44, 8, 8);
    // Tail
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 4, y + 36, 12, 3);
    ctx.fillRect(x + 2, y + 32, 6, 8);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 18, y + 26, 20, 18);
    ctx.fillRect(x + 14, y + 6, 26, 22);
    ctx.fillRect(x + 6, y + 0, 10, 14);
    ctx.fillRect(x + 38, y + 0, 10, 14);
    ctx.fillStyle = '#b08820';
    ctx.fillRect(x + 8, y + 2, 6, 10);
    ctx.fillRect(x + 40, y + 2, 6, 10);
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 24, y + 8, 6, 6);
    ctx.fillStyle = '#d8b040';
    ctx.fillRect(x + 20, y + 44, 8, 8);
    ctx.fillRect(x + 30, y + 44, 8, 8);
    ctx.fillRect(x + 4, y + 36, 12, 3);
    ctx.fillRect(x + 2, y + 32, 6, 8);
  },
};

// ── Staryu (120) ──
SPRITES[120] = {
  front: (ctx, x, y) => {
    // Star shape (5-pointed approximation with rectangles)
    ctx.fillStyle = '#c0a060';
    // Center
    ctx.fillRect(x + 18, y + 20, 20, 20);
    // Top point
    ctx.fillRect(x + 22, y + 4, 12, 18);
    ctx.fillRect(x + 24, y + 0, 8, 8);
    // Left point
    ctx.fillRect(x + 2, y + 24, 18, 10);
    ctx.fillRect(x + 0, y + 26, 6, 6);
    // Right point
    ctx.fillRect(x + 36, y + 24, 18, 10);
    ctx.fillRect(x + 50, y + 26, 6, 6);
    // Bottom-left
    ctx.fillRect(x + 10, y + 38, 12, 10);
    ctx.fillRect(x + 8, y + 44, 8, 8);
    // Bottom-right
    ctx.fillRect(x + 34, y + 38, 12, 10);
    ctx.fillRect(x + 40, y + 44, 8, 8);
    // Core gem (red)
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 23, y + 25, 10, 10);
    ctx.fillStyle = '#f08080';
    ctx.fillRect(x + 25, y + 27, 6, 6);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 26, y + 28, 2, 2);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#c0a060';
    ctx.fillRect(x + 18, y + 20, 20, 20);
    ctx.fillRect(x + 22, y + 4, 12, 18);
    ctx.fillRect(x + 24, y + 0, 8, 8);
    ctx.fillRect(x + 2, y + 24, 18, 10);
    ctx.fillRect(x + 36, y + 24, 18, 10);
    ctx.fillRect(x + 10, y + 38, 12, 10);
    ctx.fillRect(x + 34, y + 38, 12, 10);
    ctx.fillStyle = '#a08040';
    ctx.fillRect(x + 23, y + 25, 10, 10);
  },
};

// ── Starmie (121) ──
SPRITES[121] = {
  front: (ctx, x, y) => {
    // Back star (purple)
    ctx.fillStyle = '#8060b0';
    ctx.fillRect(x + 16, y + 18, 24, 24);
    ctx.fillRect(x + 20, y + 2, 16, 18);
    ctx.fillRect(x + 0, y + 22, 18, 14);
    ctx.fillRect(x + 38, y + 22, 18, 14);
    ctx.fillRect(x + 8, y + 38, 14, 14);
    ctx.fillRect(x + 34, y + 38, 14, 14);
    // Front star (violet)
    ctx.fillStyle = '#a078d0';
    ctx.fillRect(x + 20, y + 22, 16, 16);
    ctx.fillRect(x + 24, y + 8, 8, 16);
    ctx.fillRect(x + 6, y + 26, 16, 8);
    ctx.fillRect(x + 34, y + 26, 16, 8);
    ctx.fillRect(x + 14, y + 36, 10, 12);
    ctx.fillRect(x + 32, y + 36, 10, 12);
    // Core gem (large, jewel)
    ctx.fillStyle = '#e04040';
    ctx.fillRect(x + 22, y + 24, 12, 12);
    ctx.fillStyle = '#f07070';
    ctx.fillRect(x + 24, y + 26, 8, 8);
    ctx.fillStyle = '#f8a0a0';
    ctx.fillRect(x + 26, y + 28, 4, 4);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 27, y + 28, 2, 2);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = '#8060b0';
    ctx.fillRect(x + 16, y + 18, 24, 24);
    ctx.fillRect(x + 20, y + 2, 16, 18);
    ctx.fillRect(x + 0, y + 22, 18, 14);
    ctx.fillRect(x + 38, y + 22, 18, 14);
    ctx.fillRect(x + 8, y + 38, 14, 14);
    ctx.fillRect(x + 34, y + 38, 14, 14);
    ctx.fillStyle = '#a078d0';
    ctx.fillRect(x + 20, y + 22, 16, 16);
    ctx.fillRect(x + 24, y + 8, 8, 16);
    ctx.fillRect(x + 6, y + 26, 16, 8);
    ctx.fillRect(x + 34, y + 26, 16, 8);
    ctx.fillStyle = '#a08040';
    ctx.fillRect(x + 22, y + 24, 12, 12);
  },
};

// ── Venusaur (3) ──
SPRITES[3] = {
  front: (ctx, x, y) => {
    // Large body
    ctx.fillStyle = C.vGreen;
    ctx.fillRect(x + 4, y + 28, 48, 24);
    ctx.fillRect(x + 8, y + 50, 12, 8);
    ctx.fillRect(x + 36, y + 50, 12, 8);
    // Big flower
    ctx.fillStyle = C.vFlower;
    ctx.fillRect(x + 10, y + 4, 36, 26);
    ctx.fillRect(x + 16, y + 0, 24, 8);
    ctx.fillStyle = '#f8d060';
    ctx.fillRect(x + 22, y + 10, 12, 12);
    // Head
    ctx.fillStyle = C.vGreen;
    ctx.fillRect(x + -2, y + 28, 22, 20);
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 2, y + 34, 6, 6);
    ctx.fillRect(x + 12, y + 34, 6, 6);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 4, y + 44, 12, 2);
    // Spots
    ctx.fillStyle = C.vDark;
    ctx.fillRect(x + 32, y + 34, 6, 6);
    ctx.fillRect(x + 42, y + 40, 6, 6);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.vGreen;
    ctx.fillRect(x + 4, y + 30, 48, 24);
    ctx.fillRect(x + 8, y + 52, 12, 6);
    ctx.fillRect(x + 36, y + 52, 12, 6);
    ctx.fillStyle = C.vFlower;
    ctx.fillRect(x + 6, y + 4, 44, 28);
    ctx.fillRect(x + 14, y + 0, 28, 10);
    ctx.fillStyle = '#f8d060';
    ctx.fillRect(x + 20, y + 10, 16, 14);
    ctx.fillStyle = C.vGreen;
    ctx.fillRect(x + -2, y + 34, 10, 8);
    ctx.fillRect(x + 48, y + 34, 10, 8);
  },
};

// ── Charizard (6) ──
SPRITES[6] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.czOrange;
    ctx.fillRect(x + 16, y + 20, 24, 26);
    ctx.fillStyle = C.cCream;
    ctx.fillRect(x + 20, y + 26, 16, 16);
    // Wings
    ctx.fillStyle = C.czWing;
    ctx.fillRect(x + 0, y + 10, 16, 24);
    ctx.fillRect(x + 40, y + 10, 16, 24);
    ctx.fillStyle = '#70b898';
    ctx.fillRect(x + 2, y + 12, 12, 18);
    ctx.fillRect(x + 42, y + 12, 12, 18);
    // Head with horns
    ctx.fillStyle = C.czOrange;
    ctx.fillRect(x + 14, y + 4, 28, 18);
    ctx.fillRect(x + 14, y + 0, 6, 6);
    ctx.fillRect(x + 36, y + 0, 6, 6);
    // Eyes
    ctx.fillStyle = '#3898e8';
    ctx.fillRect(x + 18, y + 10, 6, 5);
    ctx.fillRect(x + 32, y + 10, 6, 5);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 18, 12, 2);
    // Legs
    ctx.fillStyle = C.czOrange;
    ctx.fillRect(x + 18, y + 46, 8, 10);
    ctx.fillRect(x + 30, y + 46, 8, 10);
    // Tail flame
    ctx.fillRect(x + 38, y + 38, 12, 4);
    ctx.fillStyle = C.czFlame;
    ctx.fillRect(x + 46, y + 30, 10, 16);
    ctx.fillStyle = C.cFlame;
    ctx.fillRect(x + 48, y + 34, 6, 8);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.czOrange;
    ctx.fillRect(x + 16, y + 22, 24, 26);
    ctx.fillRect(x + 14, y + 6, 28, 18);
    ctx.fillStyle = C.czWing;
    ctx.fillRect(x + 0, y + 6, 18, 28);
    ctx.fillRect(x + 38, y + 6, 18, 28);
    ctx.fillRect(x + 18, y + 48, 8, 10);
    ctx.fillRect(x + 30, y + 48, 8, 10);
    ctx.fillStyle = C.czOrange;
    ctx.fillRect(x + 38, y + 38, 12, 4);
    ctx.fillStyle = C.czFlame;
    ctx.fillRect(x + 46, y + 30, 12, 18);
  },
};

// ── Blastoise (9) ──
SPRITES[9] = {
  front: (ctx, x, y) => {
    // Shell
    ctx.fillStyle = C.blShell;
    ctx.fillRect(x + 10, y + 16, 36, 30);
    ctx.fillStyle = C.blBlue;
    ctx.fillRect(x + 14, y + 20, 28, 24);
    ctx.fillStyle = C.sCream;
    ctx.fillRect(x + 18, y + 26, 20, 16);
    // Cannons
    ctx.fillStyle = C.blCannon;
    ctx.fillRect(x + 2, y + 14, 10, 8);
    ctx.fillRect(x + 44, y + 14, 10, 8);
    ctx.fillStyle = '#606878';
    ctx.fillRect(x + 0, y + 16, 6, 4);
    ctx.fillRect(x + 50, y + 16, 6, 4);
    // Head
    ctx.fillStyle = C.blBlue;
    ctx.fillRect(x + 14, y + 2, 28, 18);
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 18, y + 8, 6, 6);
    ctx.fillRect(x + 32, y + 8, 6, 6);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 24, y + 16, 8, 2);
    // Legs
    ctx.fillStyle = C.blBlue;
    ctx.fillRect(x + 16, y + 46, 10, 10);
    ctx.fillRect(x + 30, y + 46, 10, 10);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.blShell;
    ctx.fillRect(x + 8, y + 12, 40, 34);
    ctx.fillStyle = '#8b5e14';
    ctx.fillRect(x + 16, y + 16, 24, 2);
    ctx.fillRect(x + 26, y + 16, 4, 24);
    ctx.fillStyle = C.blCannon;
    ctx.fillRect(x + 4, y + 8, 12, 10);
    ctx.fillRect(x + 40, y + 8, 12, 10);
    ctx.fillStyle = C.blBlue;
    ctx.fillRect(x + 16, y + 2, 24, 14);
    ctx.fillRect(x + 16, y + 46, 10, 10);
    ctx.fillRect(x + 30, y + 46, 10, 10);
  },
};

// ── Magnemite (81) ──
SPRITES[81] = {
  front: (ctx, x, y) => {
    // Body (sphere)
    ctx.fillStyle = C.mgGray;
    ctx.fillRect(x + 14, y + 14, 28, 28);
    ctx.fillStyle = C.mgDark;
    ctx.fillRect(x + 18, y + 18, 20, 20);
    // Eye
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 22, y + 20, 12, 12);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 26, y + 24, 6, 6);
    // Screws on sides
    ctx.fillStyle = C.mgScrew;
    ctx.fillRect(x + 4, y + 22, 10, 10);
    ctx.fillRect(x + 42, y + 22, 10, 10);
    ctx.fillStyle = C.mgDark;
    ctx.fillRect(x + 7, y + 25, 4, 4);
    ctx.fillRect(x + 45, y + 25, 4, 4);
    // Top screw/antenna
    ctx.fillStyle = C.mgGray;
    ctx.fillRect(x + 24, y + 6, 8, 10);
    ctx.fillStyle = C.mgScrew;
    ctx.fillRect(x + 26, y + 4, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.mgGray;
    ctx.fillRect(x + 14, y + 14, 28, 28);
    ctx.fillStyle = C.mgDark;
    ctx.fillRect(x + 16, y + 16, 24, 24);
    ctx.fillStyle = C.mgGray;
    ctx.fillRect(x + 20, y + 20, 16, 16);
    ctx.fillStyle = C.mgScrew;
    ctx.fillRect(x + 4, y + 22, 10, 10);
    ctx.fillRect(x + 42, y + 22, 10, 10);
    ctx.fillStyle = C.mgGray;
    ctx.fillRect(x + 24, y + 6, 8, 10);
  },
};

// ── Voltorb (100) ──
SPRITES[100] = {
  front: (ctx, x, y) => {
    // Body (ball shape)
    ctx.fillStyle = C.vtRed;
    ctx.fillRect(x + 12, y + 12, 32, 16);
    ctx.fillStyle = C.vtWhite;
    ctx.fillRect(x + 12, y + 28, 32, 16);
    // Line
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 12, y + 27, 32, 2);
    // Eyes
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 18, y + 18, 8, 8);
    ctx.fillRect(x + 30, y + 18, 8, 8);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 20, y + 20, 4, 4);
    ctx.fillRect(x + 32, y + 20, 4, 4);
    // Highlight
    ctx.fillStyle = '#f8b0b0';
    ctx.fillRect(x + 14, y + 14, 6, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.vtRed;
    ctx.fillRect(x + 12, y + 12, 32, 16);
    ctx.fillStyle = C.vtWhite;
    ctx.fillRect(x + 12, y + 28, 32, 16);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 12, y + 27, 32, 2);
  },
};

// ── Diglett (50) ──
SPRITES[50] = {
  front: (ctx, x, y) => {
    // Ground
    ctx.fillStyle = C.dgDark;
    ctx.fillRect(x + 6, y + 36, 44, 20);
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 8, y + 34, 40, 4);
    // Body (popping out)
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 18, y + 18, 20, 20);
    // Nose
    ctx.fillStyle = C.dgPink;
    ctx.fillRect(x + 26, y + 28, 4, 4);
    // Eyes
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 22, 4, 4);
    ctx.fillRect(x + 30, y + 22, 4, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.dgDark;
    ctx.fillRect(x + 6, y + 36, 44, 20);
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 8, y + 34, 40, 4);
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 18, y + 18, 20, 20);
  },
};

// ── Dugtrio (51) ──
SPRITES[51] = {
  front: (ctx, x, y) => {
    // Ground
    ctx.fillStyle = C.dgDark;
    ctx.fillRect(x + 2, y + 36, 52, 20);
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 4, y + 34, 48, 4);
    // Three digletts
    // Left
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 6, y + 22, 14, 16);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 9, y + 26, 3, 3);
    ctx.fillRect(x + 14, y + 26, 3, 3);
    ctx.fillStyle = C.dgPink;
    ctx.fillRect(x + 12, y + 30, 3, 3);
    // Center
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 21, y + 16, 14, 22);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 24, y + 20, 3, 3);
    ctx.fillRect(x + 30, y + 20, 3, 3);
    ctx.fillStyle = C.dgPink;
    ctx.fillRect(x + 27, y + 24, 3, 3);
    // Right
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 36, y + 22, 14, 16);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 39, y + 26, 3, 3);
    ctx.fillRect(x + 44, y + 26, 3, 3);
    ctx.fillStyle = C.dgPink;
    ctx.fillRect(x + 42, y + 30, 3, 3);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.dgDark;
    ctx.fillRect(x + 2, y + 36, 52, 20);
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 4, y + 34, 48, 4);
    ctx.fillStyle = C.dgBrown;
    ctx.fillRect(x + 6, y + 22, 14, 16);
    ctx.fillRect(x + 21, y + 16, 14, 22);
    ctx.fillRect(x + 36, y + 22, 14, 16);
  },
};

// ── Jigglypuff (39) ──
SPRITES[39] = {
  front: (ctx, x, y) => {
    // Body (round)
    ctx.fillStyle = C.jpPink;
    ctx.fillRect(x + 10, y + 12, 36, 34);
    ctx.fillRect(x + 14, y + 8, 28, 4);
    // Eyes
    ctx.fillStyle = C.jpEye;
    ctx.fillRect(x + 18, y + 20, 8, 10);
    ctx.fillRect(x + 30, y + 20, 8, 10);
    ctx.fillStyle = C.white;
    ctx.fillRect(x + 20, y + 22, 4, 4);
    ctx.fillRect(x + 32, y + 22, 4, 4);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 21, y + 23, 2, 2);
    ctx.fillRect(x + 33, y + 23, 2, 2);
    // Mouth
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 26, y + 34, 4, 2);
    // Tuft of hair
    ctx.fillStyle = C.jpPink;
    ctx.fillRect(x + 22, y + 4, 12, 8);
    // Feet
    ctx.fillRect(x + 16, y + 44, 10, 6);
    ctx.fillRect(x + 30, y + 44, 10, 6);
    // Ear
    ctx.fillRect(x + 6, y + 14, 6, 10);
    ctx.fillRect(x + 44, y + 14, 6, 10);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.jpPink;
    ctx.fillRect(x + 10, y + 12, 36, 34);
    ctx.fillRect(x + 14, y + 8, 28, 4);
    ctx.fillRect(x + 22, y + 4, 12, 8);
    ctx.fillRect(x + 16, y + 44, 10, 6);
    ctx.fillRect(x + 30, y + 44, 10, 6);
    ctx.fillRect(x + 6, y + 14, 6, 10);
    ctx.fillRect(x + 44, y + 14, 6, 10);
  },
};

// ── Drowzee (96) ──
SPRITES[96] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.dzBrown;
    ctx.fillRect(x + 14, y + 24, 28, 24);
    ctx.fillStyle = C.dzYellow;
    ctx.fillRect(x + 16, y + 30, 24, 16);
    // Head
    ctx.fillStyle = C.dzBrown;
    ctx.fillRect(x + 16, y + 6, 24, 22);
    // Trunk/nose
    ctx.fillStyle = C.dzYellow;
    ctx.fillRect(x + 22, y + 16, 8, 14);
    ctx.fillRect(x + 24, y + 28, 4, 4);
    // Eyes (sleepy)
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 18, y + 12, 6, 3);
    ctx.fillRect(x + 32, y + 12, 6, 3);
    // Hands
    ctx.fillStyle = C.dzBrown;
    ctx.fillRect(x + 6, y + 30, 8, 6);
    ctx.fillRect(x + 42, y + 30, 8, 6);
    // Legs
    ctx.fillRect(x + 18, y + 48, 8, 8);
    ctx.fillRect(x + 30, y + 48, 8, 8);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.dzBrown;
    ctx.fillRect(x + 14, y + 24, 28, 24);
    ctx.fillStyle = C.dzYellow;
    ctx.fillRect(x + 16, y + 30, 24, 16);
    ctx.fillStyle = C.dzBrown;
    ctx.fillRect(x + 16, y + 6, 24, 22);
    ctx.fillRect(x + 6, y + 30, 8, 6);
    ctx.fillRect(x + 42, y + 30, 8, 6);
    ctx.fillRect(x + 18, y + 48, 8, 8);
    ctx.fillRect(x + 30, y + 48, 8, 8);
  },
};

// ── Machop (66) ──
SPRITES[66] = {
  front: (ctx, x, y) => {
    // Body
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 14, y + 18, 28, 26);
    // Head
    ctx.fillRect(x + 16, y + 4, 24, 18);
    // Crest ridges
    ctx.fillStyle = C.mcDark;
    ctx.fillRect(x + 20, y + 0, 16, 6);
    // Eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 20, y + 10, 5, 5);
    ctx.fillRect(x + 31, y + 10, 5, 5);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 24, y + 18, 8, 2);
    // Arms (muscular)
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 4, y + 22, 10, 8);
    ctx.fillRect(x + 42, y + 22, 10, 8);
    // Legs
    ctx.fillRect(x + 18, y + 44, 8, 12);
    ctx.fillRect(x + 30, y + 44, 8, 12);
    // Belt
    ctx.fillStyle = C.mcDark;
    ctx.fillRect(x + 16, y + 38, 24, 4);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 14, y + 18, 28, 26);
    ctx.fillRect(x + 16, y + 4, 24, 18);
    ctx.fillStyle = C.mcDark;
    ctx.fillRect(x + 20, y + 0, 16, 6);
    ctx.fillRect(x + 16, y + 38, 24, 4);
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 4, y + 22, 10, 8);
    ctx.fillRect(x + 42, y + 22, 10, 8);
    ctx.fillRect(x + 18, y + 44, 8, 12);
    ctx.fillRect(x + 30, y + 44, 8, 12);
  },
};

// ── Machoke (67) ──
SPRITES[67] = {
  front: (ctx, x, y) => {
    // Bigger body
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 10, y + 18, 36, 28);
    // Head
    ctx.fillRect(x + 14, y + 2, 28, 20);
    ctx.fillStyle = C.mcDark;
    ctx.fillRect(x + 18, y + -2, 20, 6);
    // Eyes
    ctx.fillStyle = C.red;
    ctx.fillRect(x + 18, y + 8, 6, 6);
    ctx.fillRect(x + 32, y + 8, 6, 6);
    ctx.fillStyle = C.black;
    ctx.fillRect(x + 22, y + 18, 12, 2);
    // Big arms
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 0, y + 20, 12, 12);
    ctx.fillRect(x + 44, y + 20, 12, 12);
    // Belt
    ctx.fillStyle = '#c0a020';
    ctx.fillRect(x + 12, y + 38, 32, 6);
    ctx.fillStyle = '#f8d030';
    ctx.fillRect(x + 24, y + 38, 8, 6);
    // Legs
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 16, y + 44, 10, 12);
    ctx.fillRect(x + 30, y + 44, 10, 12);
  },
  back: (ctx, x, y) => {
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 10, y + 18, 36, 28);
    ctx.fillRect(x + 14, y + 2, 28, 20);
    ctx.fillStyle = C.mcDark;
    ctx.fillRect(x + 18, y + -2, 20, 6);
    ctx.fillStyle = '#c0a020';
    ctx.fillRect(x + 12, y + 38, 32, 6);
    ctx.fillStyle = C.mcGray;
    ctx.fillRect(x + 0, y + 20, 12, 12);
    ctx.fillRect(x + 44, y + 20, 12, 12);
    ctx.fillRect(x + 16, y + 44, 10, 12);
    ctx.fillRect(x + 30, y + 44, 10, 12);
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

// ── NPC/Trainer sprites for overworld ──

export function drawNPCSprite(ctx: CanvasRenderingContext2D, type: string, x: number, y: number, facing: string) {
  switch (type) {
    case 'youngster':
      // Blue cap, shorts
      ctx.fillStyle = '#4878a0';
      ctx.fillRect(x + 3, y + 1, 10, 3); // cap
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 5, y + 3, 6, 5); // face
      ctx.fillStyle = '#4878a0';
      ctx.fillRect(x + 4, y + 8, 8, 4); // shirt
      ctx.fillStyle = '#c8a050';
      ctx.fillRect(x + 4, y + 12, 8, 3); // shorts
      ctx.fillStyle = '#4878a0';
      if (facing === 'down') {
        ctx.fillRect(x + 6, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
      }
      break;
    case 'lass':
      // Red hair/bow
      ctx.fillStyle = '#e04040';
      ctx.fillRect(x + 4, y + 0, 8, 4);
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 5, y + 3, 6, 5);
      ctx.fillStyle = '#e04040';
      ctx.fillRect(x + 4, y + 8, 8, 5);
      ctx.fillStyle = '#e08080';
      ctx.fillRect(x + 5, y + 13, 6, 2);
      if (facing === 'down') {
        ctx.fillStyle = '#081820';
        ctx.fillRect(x + 6, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
      }
      break;
    case 'bugCatcher':
      // Green cap, net
      ctx.fillStyle = '#68b838';
      ctx.fillRect(x + 3, y + 1, 10, 3);
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 5, y + 3, 6, 5);
      ctx.fillStyle = '#f8f8f0';
      ctx.fillRect(x + 4, y + 8, 8, 4);
      ctx.fillStyle = '#68b838';
      ctx.fillRect(x + 4, y + 12, 8, 3);
      if (facing === 'down') {
        ctx.fillStyle = '#081820';
        ctx.fillRect(x + 6, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
      }
      break;
    case 'hiker':
      // Big body, brown
      ctx.fillStyle = '#8b5e14';
      ctx.fillRect(x + 3, y + 0, 10, 4); // hat
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 4, y + 3, 8, 5); // face
      ctx.fillStyle = '#8b5e14';
      ctx.fillRect(x + 3, y + 7, 10, 6); // body (wider)
      ctx.fillStyle = '#706050';
      ctx.fillRect(x + 4, y + 13, 8, 3); // pants
      if (facing === 'down') {
        ctx.fillStyle = '#081820';
        ctx.fillRect(x + 5, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
      }
      break;
    case 'nurse':
      // Pink outfit, white cap
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(x + 4, y + 0, 8, 3);
      ctx.fillStyle = '#e85080';
      ctx.fillRect(x + 6, y + 0, 4, 2);
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 5, y + 2, 6, 5);
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(x + 4, y + 7, 8, 5);
      ctx.fillStyle = '#e85080';
      ctx.fillRect(x + 6, y + 8, 4, 2);
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(x + 5, y + 12, 6, 3);
      if (facing === 'down') {
        ctx.fillStyle = '#081820';
        ctx.fillRect(x + 6, y + 4, 2, 2);
        ctx.fillRect(x + 9, y + 4, 2, 2);
      }
      break;
    case 'shopkeeper':
      // Blue apron
      ctx.fillStyle = '#081820';
      ctx.fillRect(x + 4, y + 1, 8, 3);
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 5, y + 3, 6, 5);
      ctx.fillStyle = '#4878a0';
      ctx.fillRect(x + 4, y + 7, 8, 5);
      ctx.fillStyle = '#081820';
      ctx.fillRect(x + 4, y + 12, 8, 3);
      if (facing === 'down') {
        ctx.fillStyle = '#081820';
        ctx.fillRect(x + 6, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
      }
      break;
    case 'gymLeader':
      // Brock: spiky hair, squinting eyes, muscular
      ctx.fillStyle = '#604830';
      ctx.fillRect(x + 3, y + 0, 10, 5); // spiky hair
      ctx.fillRect(x + 5, y + -1, 3, 3);
      ctx.fillRect(x + 9, y + -1, 3, 3);
      ctx.fillStyle = '#d8a870';
      ctx.fillRect(x + 4, y + 3, 8, 6); // face (tanned)
      // Squinted eyes (just lines)
      ctx.fillStyle = '#081820';
      ctx.fillRect(x + 5, y + 5, 3, 1);
      ctx.fillRect(x + 9, y + 5, 3, 1);
      // Body (muscular, brown vest)
      ctx.fillStyle = '#806040';
      ctx.fillRect(x + 3, y + 8, 10, 5);
      ctx.fillStyle = '#d8a870';
      ctx.fillRect(x + 5, y + 9, 6, 3);
      ctx.fillStyle = '#504030';
      ctx.fillRect(x + 4, y + 13, 8, 3);
      break;
    case 'gymLeader2':
      // Misty: orange hair, swimsuit
      ctx.fillStyle = '#f89838';
      ctx.fillRect(x + 3, y + 0, 10, 6); // orange hair
      ctx.fillRect(x + 2, y + 2, 4, 4); // side hair
      ctx.fillRect(x + 10, y + 2, 4, 4);
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 5, y + 3, 6, 5); // face
      ctx.fillStyle = '#4878a0';
      ctx.fillRect(x + 4, y + 8, 8, 4); // blue top
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 5, y + 12, 6, 2); // midriff
      ctx.fillStyle = '#e04040';
      ctx.fillRect(x + 4, y + 14, 8, 2); // red shorts
      if (facing === 'down') {
        ctx.fillStyle = '#3070a8';
        ctx.fillRect(x + 6, y + 5, 2, 2);
        ctx.fillRect(x + 9, y + 5, 2, 2);
      }
      break;
    case 'gymLeader3':
      // Lt. Surge: spiky blond hair, military build
      ctx.fillStyle = '#f8d830';
      ctx.fillRect(x + 3, y + 0, 10, 5); // blond spiky hair
      ctx.fillRect(x + 4, y + -1, 3, 3);
      ctx.fillRect(x + 9, y + -1, 3, 3);
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 4, y + 3, 8, 6); // face
      ctx.fillStyle = '#406048';
      ctx.fillRect(x + 3, y + 8, 10, 5); // military green top
      ctx.fillStyle = '#305038';
      ctx.fillRect(x + 4, y + 13, 8, 3); // dark pants
      if (facing === 'down') {
        ctx.fillStyle = '#081820';
        ctx.fillRect(x + 5, y + 5, 3, 2);
        ctx.fillRect(x + 9, y + 5, 3, 2);
      }
      break;
    default:
      // Generic NPC
      ctx.fillStyle = '#081820';
      ctx.fillRect(x + 4, y + 2, 8, 12);
      ctx.fillStyle = '#f8d8b0';
      ctx.fillRect(x + 5, y + 3, 6, 5);
      break;
  }
}
