/** GBC-inspired palette */
export const COLORS = {
  bg: '#e0f8d0',         // lightest green
  light: '#88c070',      // light green
  mid: '#346856',        // dark green
  dark: '#081820',       // near-black
  water: '#3890e8',      // blue
  waterDark: '#2070b0',  // dark blue
  flower: '#d85888',     // pink accent
  roof: '#c04040',       // red roof
  wall: '#e8d8b0',       // building wall
  sign: '#b87830',       // sign/wood
} as const;

export const enum Tile {
  Grass = 0,
  TallGrass = 1,
  Water = 2,
  Tree = 3,
  Path = 4,
  Flower = 5,
  Wall = 6,
  // Buildings
  PokeCenterRoof = 7,
  PokeCenterDoor = 8,
  MartRoof = 9,
  MartDoor = 10,
  BuildingWall = 11,
  // Decoration
  Sign = 12,
  Fence = 13,
  // Route markers
  Ledge = 14,
  // Gym
  GymRoof = 15,
  GymDoor = 16,
}

/** Which tiles block movement */
export function isSolid(tile: Tile): boolean {
  return tile === Tile.Tree
    || tile === Tile.Water
    || tile === Tile.Wall
    || tile === Tile.PokeCenterRoof
    || tile === Tile.MartRoof
    || tile === Tile.BuildingWall
    || tile === Tile.Fence
    || tile === Tile.Ledge
    || tile === Tile.GymRoof;
}

/** Tiles that trigger interaction with Z key */
export function isInteractable(tile: Tile): boolean {
  return tile === Tile.PokeCenterDoor
    || tile === Tile.MartDoor
    || tile === Tile.Sign
    || tile === Tile.GymDoor;
}

const TILE_SIZE = 16;

/** Animated time for water shimmer */
let animTime = 0;
export function updateTileAnim(dt: number) {
  animTime += dt;
}

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
        const sway = Math.sin(animTime * 2 + i + px * 0.1) * 1;
        ctx.fillRect(x + sway, py + 4, 2, 8);
        ctx.fillRect(x - 1 + sway, py + 3, 4, 2);
      }
      break;

    case Tile.Water: {
      ctx.fillStyle = COLORS.water;
      ctx.fillRect(px, py, s, s);
      // Animated wave pattern
      const waveOffset = Math.sin(animTime * 3 + px * 0.2 + py * 0.1) * 2;
      ctx.fillStyle = COLORS.waterDark;
      ctx.fillRect(px + 2 + waveOffset, py + 4, 5, 2);
      ctx.fillRect(px + 9 - waveOffset, py + 10, 5, 2);
      // Sparkle
      if (Math.sin(animTime * 5 + px + py) > 0.8) {
        ctx.fillStyle = '#b0d8f8';
        ctx.fillRect(px + 6, py + 2, 2, 2);
      }
      break;
    }

    case Tile.Tree:
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = COLORS.dark;
      ctx.fillRect(px + 6, py + 10, 4, 6);
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

    // ── Buildings ──

    case Tile.PokeCenterRoof:
      ctx.fillStyle = COLORS.roof;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#e06060';
      ctx.fillRect(px + 2, py + 2, s - 4, 4);
      // P cross
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(px + 6, py + 4, 4, 8);
      ctx.fillRect(px + 4, py + 6, 8, 4);
      break;

    case Tile.PokeCenterDoor:
      ctx.fillStyle = COLORS.wall;
      ctx.fillRect(px, py, s, s);
      // Door frame
      ctx.fillStyle = COLORS.roof;
      ctx.fillRect(px + 2, py, s - 4, 2);
      // Door
      ctx.fillStyle = '#4878a0';
      ctx.fillRect(px + 3, py + 2, s - 6, s - 2);
      // Handle
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(px + 10, py + 8, 2, 2);
      break;

    case Tile.MartRoof:
      ctx.fillStyle = '#4878a0';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#5898c8';
      ctx.fillRect(px + 2, py + 2, s - 4, 4);
      // M
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(px + 3, py + 4, 2, 8);
      ctx.fillRect(px + 5, py + 6, 2, 2);
      ctx.fillRect(px + 7, py + 4, 2, 2);
      ctx.fillRect(px + 9, py + 6, 2, 2);
      ctx.fillRect(px + 11, py + 4, 2, 8);
      break;

    case Tile.MartDoor:
      ctx.fillStyle = COLORS.wall;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#4878a0';
      ctx.fillRect(px + 2, py, s - 4, 2);
      ctx.fillStyle = '#68a8d8';
      ctx.fillRect(px + 3, py + 2, s - 6, s - 2);
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(px + 10, py + 8, 2, 2);
      break;

    case Tile.BuildingWall:
      ctx.fillStyle = COLORS.wall;
      ctx.fillRect(px, py, s, s);
      // Window
      ctx.fillStyle = '#a8c8e0';
      ctx.fillRect(px + 4, py + 3, 8, 8);
      ctx.fillStyle = COLORS.dark;
      ctx.fillRect(px + 7, py + 3, 2, 8);
      ctx.fillRect(px + 4, py + 6, 8, 2);
      break;

    case Tile.Sign:
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px, py, s, s);
      // Post
      ctx.fillStyle = COLORS.sign;
      ctx.fillRect(px + 7, py + 8, 2, 8);
      // Board
      ctx.fillStyle = COLORS.sign;
      ctx.fillRect(px + 2, py + 2, 12, 8);
      ctx.fillStyle = '#d8b870';
      ctx.fillRect(px + 3, py + 3, 10, 6);
      break;

    case Tile.Fence:
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = COLORS.sign;
      // Posts
      ctx.fillRect(px + 1, py + 4, 3, 10);
      ctx.fillRect(px + 12, py + 4, 3, 10);
      // Rails
      ctx.fillRect(px, py + 5, s, 2);
      ctx.fillRect(px, py + 10, s, 2);
      break;

    case Tile.Ledge:
      ctx.fillStyle = COLORS.light;
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = COLORS.mid;
      ctx.fillRect(px, py + 12, s, 4);
      ctx.fillStyle = COLORS.dark;
      ctx.fillRect(px, py + 14, s, 2);
      break;

    case Tile.GymRoof:
      ctx.fillStyle = '#a08850';
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = '#c0a060';
      ctx.fillRect(px + 2, py + 2, s - 4, 4);
      // GYM star badge
      ctx.fillStyle = '#f8d830';
      ctx.fillRect(px + 5, py + 6, 6, 6);
      ctx.fillRect(px + 6, py + 5, 4, 8);
      break;

    case Tile.GymDoor:
      ctx.fillStyle = COLORS.wall;
      ctx.fillRect(px, py, s, s);
      // Door frame
      ctx.fillStyle = '#a08850';
      ctx.fillRect(px + 2, py, s - 4, 2);
      // Door (darker, imposing)
      ctx.fillStyle = '#705830';
      ctx.fillRect(px + 3, py + 2, s - 6, s - 2);
      // GYM label
      ctx.fillStyle = '#f8d830';
      ctx.fillRect(px + 5, py + 5, 6, 3);
      // Handle
      ctx.fillStyle = '#f8d830';
      ctx.fillRect(px + 10, py + 8, 2, 2);
      break;
  }
}
