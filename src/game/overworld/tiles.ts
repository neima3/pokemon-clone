/** GBC-inspired palette */
export const COLORS = {
  bg: '#e0f8d0',         // lightest green
  light: '#88c070',      // light green
  mid: '#346856',        // dark green
  dark: '#081820',       // near-black
  water: '#3890e8',      // blue
  waterDark: '#2070b0',  // dark blue
  flower: '#d85888',     // pink accent
} as const;

export const enum Tile {
  Grass = 0,
  TallGrass = 1,
  Water = 2,
  Tree = 3,
  Path = 4,
  Flower = 5,
  Wall = 6,
}

/** Which tiles block movement */
export function isSolid(tile: Tile): boolean {
  return tile === Tile.Tree || tile === Tile.Water || tile === Tile.Wall;
}

const TILE_SIZE = 16;

/** Draw a single tile at pixel position */
export function drawTile(
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  px: number,
  py: number,
) {
  const s = TILE_SIZE;
  switch (tile) {
    case Tile.Grass:
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px, py, s, s);
      // subtle dots
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(px + 3, py + 4, 2, 2);
      ctx.fillRect(px + 10, py + 11, 2, 2);
      break;

    case Tile.TallGrass:
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = COLORS.mid;
      for (let i = 0; i < 3; i++) {
        const x = px + 2 + i * 5;
        ctx.fillRect(x, py + 4, 2, 8);
        ctx.fillRect(x - 1, py + 3, 4, 2);
      }
      break;

    case Tile.Water:
      ctx.fillStyle = COLORS.water;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = COLORS.waterDark;
      ctx.fillRect(px + 2, py + 6, 5, 2);
      ctx.fillRect(px + 9, py + 10, 5, 2);
      break;

    case Tile.Tree:
      // ground
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px, py, s, s);
      // trunk
      ctx.fillStyle = COLORS.dark;
      ctx.fillRect(px + 6, py + 10, 4, 6);
      // canopy
      ctx.fillStyle = COLORS.mid;
      ctx.fillRect(px + 2, py + 1, 12, 10);
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px + 4, py + 3, 3, 3);
      break;

    case Tile.Path:
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px + 1, py + 7, 2, 2);
      ctx.fillRect(px + 12, py + 3, 2, 2);
      break;

    case Tile.Flower:
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = COLORS.flower;
      ctx.fillRect(px + 3, py + 5, 3, 3);
      ctx.fillRect(px + 10, py + 9, 3, 3);
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(px + 4, py + 6, 1, 1);
      ctx.fillRect(px + 11, py + 10, 1, 1);
      break;

    case Tile.Wall:
      ctx.fillStyle = COLORS.dark;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = COLORS.mid;
      ctx.fillRect(px + 1, py + 1, 6, 6);
      ctx.fillRect(px + 9, py + 9, 6, 6);
      break;
  }
}
