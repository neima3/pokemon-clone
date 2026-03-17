import { Tile } from './tiles';
import { NPCData } from './NPC';

/** 50×76 overworld map — expanded with Pokemon League area */
export const MAP_WIDTH = 50;
export const MAP_HEIGHT = 76;

const T = Tile.Tree;
const G = Tile.Grass;
const g = Tile.TallGrass;
const W = Tile.Water;
const P = Tile.Path;
const F = Tile.Flower;
const R = Tile.PokeCenterRoof;
const D = Tile.PokeCenterDoor;
const M = Tile.MartRoof;
const m = Tile.MartDoor;
const B = Tile.BuildingWall;
const S = Tile.Sign;
const E = Tile.Fence;
const L = Tile.Ledge;
const Y = Tile.GymRoof;
const y = Tile.GymDoor;

// prettier-ignore
export const MAP_DATA: Tile[] = [
// 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49
  T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 0
  T, G, G, G, G, G, T, T, g, g, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, G, G, G, G, T,  // 1
  T, G, G, g, g, G, G, T, g, g, g, G, G, G, G, F, G, G, G, T, T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, g, g, G, G, G, T,  // 2
  T, G, g, g, g, g, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, F, G, G, G, G, G, T, T, G, G, g, g, g, G, G, G, T,  // 3
  T, G, G, g, g, G, G, G, G, G, G, G, G, G, P, P, P, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, F, G, T, T, G, G, g, g, G, G, G, G, T,  // 4
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, G, G, F, G, T,  // 5
  T, G, G, G, G, G, G, G, G, G, E, E, E, E, P, G, G, P, E, E, E, E, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, G, G, G, G, T,  // 6
  T, G, F, G, G, G, G, G, G, G, E, R, R, R, P, G, G, M, M, M, E, G, G, G, W, W, W, G, G, E, Y, Y, Y, E, G, G, G, G, G, T, T, G, E, Y, Y, Y, E, G, G, T,  // 7
  T, G, G, G, G, G, G, G, G, G, E, B, D, B, P, G, G, B, m, B, E, G, G, W, W, W, W, W, G, E, B, y, B, E, G, G, G, G, G, T, T, G, E, B, y, B, E, G, G, T,  // 8
  T, T, T, G, G, G, G, G, G, G, E, E, P, E, P, G, G, E, P, E, E, G, G, G, W, W, W, G, G, E, E, P, E, E, G, G, G, G, G, T, T, G, E, E, P, E, E, G, G, T,  // 9
  T, G, G, G, G, G, G, G, G, G, G, G, P, P, P, G, G, P, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, P, G, G, G, G, T,  // 10
  T, G, G, G, P, P, P, P, P, P, P, P, P, G, G, G, G, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, T,  // 11
  T, G, G, G, P, G, G, G, G, G, G, G, S, G, G, F, G, G, S, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T, T, G, G, G, G, P, G, G, G, T,  // 12
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, F, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T, T, G, G, G, G, P, G, F, G, T,  // 13
  T, G, F, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, F, G, T, T, G, G, F, G, P, G, G, G, T,  // 14
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T, T, G, G, G, G, P, G, G, G, T,  // 15
  T, T, T, T, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, T, T, T, T, T, G, G, G, G, P, G, G, G, T,  // 16
  T, G, G, G, P, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, G, G, G, P, G, G, G, T, T, G, g, g, G, P, G, G, G, T,  // 17
  T, G, G, G, P, g, g, g, g, G, G, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, g, g, g, g, G, G, G, G, P, G, G, G, T, T, G, g, g, g, P, G, G, G, T,  // 18
  T, G, G, G, P, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, F, G, G, P, G, G, G, T, T, G, g, g, G, P, G, G, G, T,  // 19
  T, G, F, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T, T, G, G, G, G, P, G, G, G, T,  // 20
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, E, Y, Y, Y, E, G, G, G, G, G, G, G, P, G, G, G, T, T, G, G, G, G, P, G, G, G, T,  // 21
  T, G, G, G, P, G, G, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, E, B, y, B, E, G, G, G, G, G, G, G, P, G, G, G, T, T, G, G, G, g, P, g, G, G, T,  // 22
  T, G, G, G, P, G, G, G, G, g, g, g, G, G, G, G, G, G, G, G, G, G, G, E, E, P, E, E, G, G, G, g, g, G, G, P, G, G, G, T, T, G, G, g, g, P, g, g, G, T,  // 23
  T, G, G, G, P, G, G, G, G, G, g, g, G, G, G, G, F, G, G, G, G, G, G, G, G, P, G, G, G, G, g, g, g, g, G, P, G, G, G, T, T, G, G, G, g, P, g, G, G, T,  // 24
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W, W, G, G, G, G, P, P, P, P, P, P, g, g, G, G, P, G, G, G, T, T, G, G, G, G, P, G, G, G, T,  // 25
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, W, W, W, W, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T, T, G, G, G, G, P, G, G, G, T,  // 26
  T, G, G, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, W, W, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, T,  // 27
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, P, G, G, G, T,  // 28
  T, T, T, T, P, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, P, T, T, T, T,  // 29
  T, G, G, G, P, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, P, G, G, T, T,  // 30
  T, G, G, G, P, G, g, g, g, g, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, T, T, G, E, Y, Y, Y, E, T, 17, T,  // 31
  T, G, F, G, P, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, g, g, G, G, G, F, G, G, G, G, G, T, T, G, E, B, y, B, E, G, G, T,  // 32
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, W, W, W, G, G, G, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, T, T, G, E, E, P, E, E, G, G, T,  // 33
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, W, W, W, W, W, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, P, G, G, F, G, T,  // 34
  T, G, G, G, P, P, P, P, P, P, P, P, S, P, P, P, P, P, W, W, W, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, T, T, G, g, g, P, G, W, W, G, T,  // 35
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W, G, G, G, G, G, G, G, G, G, E, Y, Y, Y, E, G, P, G, G, G, T, T, G, g, g, P, G, W, W, G, T,  // 36
  T, G, G, G, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, E, B, y, B, E, G, P, G, G, G, T, T, G, G, F, P, G, G, G, G, T,  // 37
  T, G, G, G, G, G, g, g, g, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, F, G, E, E, P, E, E, G, P, G, G, G, T, T, G, G, G, P, G, G, G, G, T,  // 38
  T, T, T, T, P, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 39
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 40
  T, G, G, g, P, g, g, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, F, G, G, G, G, G, G, G, G, G, G, T,  // 41
  T, G, g, g, P, g, g, g, G, G, G, G, G, G, G, G, G, G, G, W, W, G, G, G, G, G, G, G, G, G, G, G, G, g, g, g, G, G, G, G, E, Y, Y, Y, E, G, G, G, G, T,  // 42
  T, G, G, g, P, g, g, G, G, G, G, G, G, G, G, G, G, G, W, W, W, W, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, G, G, E, B, y, B, E, G, G, G, G, T,  // 43
  T, G, G, G, P, P, P, P, P, P, P, P, S, P, P, P, P, P, P, W, W, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, E, E, P, E, E, G, G, G, G, T,  // 44
  T, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, F, G, G, G, T,  // 45
  T, G, G, G, G, G, g, g, G, G, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, G, T,  // 46
  T, T, T, T, P, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 47
// ── Route 8: Volcanic Fire Zone ──
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 48
  T, G, G, g, P, g, g, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 49
  T, G, g, g, P, g, g, g, G, G, G, G, G, G, G, G, G, G, G, W, W, G, G, G, G, G, G, G, G, G, G, G, G, g, g, g, G, G, G, G, G, G, G, G, G, G, F, G, G, T,  // 50
  T, G, G, g, P, g, g, G, G, G, G, G, G, G, G, G, G, G, W, W, W, W, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 51
  T, G, G, G, P, P, P, P, P, P, P, P, S, P, P, P, P, P, P, W, W, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, G, G, G, G, T,  // 52
  T, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, E, Y, Y, Y, E, G, P, G, G, G, G, G, P, G, G, G, G, G, G, G, T,  // 53
  T, G, G, G, G, G, g, g, G, G, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, E, B, y, B, E, G, P, G, G, G, G, G, P, G, G, F, G, G, G, G, T,  // 54
  T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, P, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 55
// ── Route 9: Viridian City & Giovanni's Gym ──
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, P, g, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 56
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, P, g, g, G, G, G, G, G, G, G, G, G, G, G, T,  // 57
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, g, P, g, g, g, G, G, G, G, G, G, G, G, G, G, T,  // 58
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, E, Y, Y, Y, E, G, g, P, g, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 59
  T, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, E, B, y, B, E, G, g, P, g, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 60
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, E, E, P, E, E, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 61
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, P, P, P, P, P, P, P, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 62
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 63
  T, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, P, g, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 64
  T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 65
// ── Victory Road entrance path ──
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 66
  T, G, G, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, G, G, T,  // 67
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, T,  // 68
  T, G, G, G, P, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, T,  // 69
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, T,  // 70
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, T,  // 71
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, T,  // 72
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, T,  // 73
  T, G, G, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, G, G, T,  // 74
  T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 75
// ── Cerulean Cave (post-game area) ──
  T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 76
  T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 77
];

/** Get the route zone for a given grid position */
export function getRouteZone(gx: number, gy: number): string {
  // Pokemon League: rows 66+
  if (gy >= 66) return 'pokemonLeague';
  // Cerulean Cave: specific location near top-right
  if (gy >= 30 && gy <= 31 && gx >= 46 && gx <= 48) return 'ceruleanCave';
  // Town area: roughly rows 4-15, cols 8-22
  if (gy >= 4 && gy <= 15 && gx >= 8 && gx <= 22) return 'town';
  // Route 9: rows 56+ (Viridian City / Giovanni's Gym)
  if (gy >= 56) return 'route9';
  // Route 8: rows 48+ (volcanic fire zone)
  if (gy >= 48) return 'route8';
  // Route 7: rows 39-47 (poison swamp area)
  if (gy >= 39) return 'route7';
  // Route 6: bottom-right area
  if (gy >= 29 && gx >= 39) return 'route6';
  // Route 5: bottom section rows 29-38
  if (gy >= 29) return 'route5';
  // Route 4: far east section
  if (gx >= 38) return 'route4';
  // Route 3: far south-east section (near Misty's gym)
  if (gy >= 20 && gx >= 22) return 'route3';
  // Route 2: bottom section rows 16+
  if (gy >= 16) return 'route2';
  // Route 1: top/side areas
  return 'route1';
}

/** NPC definitions for the map */
export const MAP_NPCS: NPCData[] = [
  // Town NPCs
  {
    id: 'nurse',
    gx: 12, gy: 7,
    sprite: 'nurse',
    facing: 'down',
    dialogue: ['Welcome to the POKéMON CENTER!', 'Let me heal your POKéMON.', '...', 'Your POKéMON are fully healed!'],
    isTrainer: false,
  },
  {
    id: 'shopkeeper',
    gx: 18, gy: 7,
    sprite: 'shopkeeper',
    facing: 'down',
    dialogue: ['Welcome to the POKé MART!', 'Take a look at our wares.'],
    isTrainer: false,
  },
  {
    id: 'townPerson1',
    gx: 15, gy: 13,
    sprite: 'lass',
    facing: 'down',
    dialogue: ['This is PALLET TOWN.', 'The tall grass has wild POKéMON!', 'Be careful out there!'],
    isTrainer: false,
  },
  // Route 1 trainers
  {
    id: 'trainer_joey',
    gx: 8, gy: 3,
    sprite: 'youngster',
    facing: 'right',
    dialogue: ['My RATTATA is in the top percentage of all RATTATA!'],
    isTrainer: true,
    trainerId: 'youngster_joey',
  },
  {
    id: 'trainer_sally',
    gx: 26, gy: 5,
    sprite: 'lass',
    facing: 'left',
    dialogue: ['I love bird POKéMON!', 'Let me show you mine!'],
    isTrainer: true,
    trainerId: 'lass_sally',
  },
  // Route 2 trainers
  {
    id: 'trainer_rick',
    gx: 9, gy: 19,
    sprite: 'bugCatcher',
    facing: 'right',
    dialogue: ['Bugs rule! Let me show you!'],
    isTrainer: true,
    trainerId: 'bugCatcher_rick',
  },
  {
    id: 'trainer_dave',
    gx: 30, gy: 23,
    sprite: 'hiker',
    facing: 'left',
    dialogue: ['These rocks are tough, just like me!'],
    isTrainer: true,
    trainerId: 'hiker_dave',
  },
  // Helpful NPC
  {
    id: 'route1_helper',
    gx: 4, gy: 20,
    sprite: 'youngster',
    facing: 'right',
    dialogue: ['TIP: Your POKéMON gain EXP from battles.', 'Level them up to learn new moves!', 'Some POKéMON even evolve at higher levels!'],
    isTrainer: false,
  },
  // Gym Leader — Brock
  {
    id: 'gym_leader_brock',
    gx: 31, gy: 10,
    sprite: 'gymLeader',
    facing: 'down',
    dialogue: ['I am BROCK, the GYM LEADER!', 'My rock-hard determination is my style!', 'Show me your best!'],
    isTrainer: true,
    trainerId: 'gym_brock',
  },
  // Route 3 trainers
  {
    id: 'trainer_marina',
    gx: 20, gy: 22,
    sprite: 'lass',
    facing: 'right',
    dialogue: ['I love water POKéMON!', 'Let\'s see how you handle them!'],
    isTrainer: true,
    trainerId: 'lass_marina',
  },
  {
    id: 'trainer_kyle',
    gx: 15, gy: 24,
    sprite: 'youngster',
    facing: 'down',
    dialogue: ['Fighting types are the coolest!', 'Come at me!'],
    isTrainer: true,
    trainerId: 'youngster_kyle',
  },
  // Route 3 helper NPC
  {
    id: 'route3_helper',
    gx: 28, gy: 20,
    sprite: 'lass',
    facing: 'down',
    dialogue: ['MISTY\'s GYM is just south of here.', 'Her Water-type POKéMON are tough!', 'Make sure you have Grass or Electric types!'],
    isTrainer: false,
  },
  // Gym Leader — Misty
  {
    id: 'gym_leader_misty',
    gx: 25, gy: 22,
    sprite: 'gymLeader2',
    facing: 'down',
    dialogue: ['I\'m MISTY, the GYM LEADER!', 'My water POKéMON will wash you away!', 'Prepare yourself!'],
    isTrainer: true,
    trainerId: 'gym_misty',
  },
  // PC NPC in PokéCenter
  {
    id: 'pc_npc',
    gx: 14, gy: 13,
    sprite: 'shopkeeper',
    facing: 'up',
    dialogue: ['This is the POKéMON STORAGE SYSTEM.', 'You can deposit or withdraw POKéMON here.'],
    isTrainer: false,
  },
  // Route 4 trainers
  {
    id: 'trainer_tom',
    gx: 43, gy: 15,
    sprite: 'hiker',
    facing: 'left',
    dialogue: ['Electric types are the future!', 'Let me show you!'],
    isTrainer: true,
    trainerId: 'engineer_tom',
  },
  {
    id: 'trainer_jenny',
    gx: 42, gy: 20,
    sprite: 'lass',
    facing: 'right',
    dialogue: ['My POKéMON are so adorable!', 'Battle me!'],
    isTrainer: true,
    trainerId: 'lass_jenny',
  },
  // Route 4 helper
  {
    id: 'route4_helper',
    gx: 46, gy: 12,
    sprite: 'youngster',
    facing: 'down',
    dialogue: ['LT. SURGE\'s GYM is north of here.', 'His Electric-type POKéMON are intense!', 'Ground types are your best bet!'],
    isTrainer: false,
  },
  // Gym Leader — Lt. Surge
  {
    id: 'gym_leader_surge',
    gx: 44, gy: 8,
    sprite: 'gymLeader3',
    facing: 'down',
    dialogue: ['I\'m LT. SURGE, the Lightning American!', 'My Electric POKéMON will zap you!', 'Let\'s battle, soldier!'],
    isTrainer: true,
    trainerId: 'gym_surge',
  },
  // Route 5 trainers
  {
    id: 'trainer_lily',
    gx: 8, gy: 32,
    sprite: 'lass',
    facing: 'right',
    dialogue: ['Flowers and grass go together!', 'Let me show you!'],
    isTrainer: true,
    trainerId: 'lass_lily',
  },
  {
    id: 'trainer_sam',
    gx: 24, gy: 31,
    sprite: 'youngster',
    facing: 'left',
    dialogue: ['Fire types are the hottest!', 'Literally!'],
    isTrainer: true,
    trainerId: 'youngster_sam',
  },
  {
    id: 'trainer_greg',
    gx: 16, gy: 34,
    sprite: 'hiker',
    facing: 'down',
    dialogue: ['I\'ve been training in these mountains!', 'Let\'s see what you\'ve got!'],
    isTrainer: true,
    trainerId: 'hiker_greg',
  },
  // Route 5 helper
  {
    id: 'route5_helper',
    gx: 4, gy: 33,
    sprite: 'lass',
    facing: 'right',
    dialogue: ['ERIKA\'s GYM is to the east.', 'She uses Grass-type POKéMON.', 'Fire or Flying types work great!'],
    isTrainer: false,
  },
  // Fisherman NPC — gives OLD ROD
  {
    id: 'fisherman',
    gx: 17, gy: 33,
    sprite: 'hiker',
    facing: 'down',
    dialogue: ['I love fishing!', 'Here, take this OLD ROD!', 'Use it near water to catch POKéMON!'],
    isTrainer: false,
  },
  // Gym Leader — Erika
  {
    id: 'gym_leader_erika',
    gx: 31, gy: 37,
    sprite: 'gymLeader4',
    facing: 'down',
    dialogue: ['I am ERIKA, the nature-loving princess.', 'My Grass-type POKéMON are elegant and strong.', 'Let us battle gracefully!'],
    isTrainer: true,
    trainerId: 'gym_erika',
  },
  // Route 6 trainers
  {
    id: 'trainer_sarah',
    gx: 43, gy: 35,
    sprite: 'lass',
    facing: 'left',
    dialogue: ['Psychic types are mysterious!', 'Can you handle them?'],
    isTrainer: true,
    trainerId: 'lass_sarah',
  },
  {
    id: 'trainer_matt',
    gx: 46, gy: 36,
    sprite: 'youngster',
    facing: 'left',
    dialogue: ['I train hard every day!', 'Let\'s see who\'s stronger!'],
    isTrainer: true,
    trainerId: 'youngster_matt',
  },
  {
    id: 'trainer_ben',
    gx: 42, gy: 37,
    sprite: 'hiker',
    facing: 'right',
    dialogue: ['These mountains hide many secrets!', 'Battle me if you dare!'],
    isTrainer: true,
    trainerId: 'hiker_ben',
  },
  // Route 6 helper
  {
    id: 'route6_helper',
    gx: 47, gy: 30,
    sprite: 'lass',
    facing: 'down',
    dialogue: ['SABRINA\'s GYM is just to the west.', 'She uses Psychic-type POKéMON!', 'Bug, Ghost, or Dark types are super effective!'],
    isTrainer: false,
  },
  // Gym Leader — Sabrina
  {
    id: 'gym_leader_sabrina',
    gx: 44, gy: 32,
    sprite: 'gymLeader5',
    facing: 'down',
    dialogue: ['I am SABRINA, the master of Psychic POKéMON.', 'I foresaw your arrival...', 'Your mind is no match for mine!'],
    isTrainer: true,
    trainerId: 'gym_sabrina',
  },
  // Route 7 trainers
  {
    id: 'trainer_claire',
    gx: 8, gy: 42,
    sprite: 'lass',
    facing: 'right',
    dialogue: ['The air here is so thick!', 'My Poison POKéMON love it!'],
    isTrainer: true,
    trainerId: 'lass_claire',
  },
  {
    id: 'trainer_kai',
    gx: 25, gy: 41,
    sprite: 'youngster',
    facing: 'left',
    dialogue: ['Poison types are underrated!', 'Let me show you their power!'],
    isTrainer: true,
    trainerId: 'youngster_kai',
  },
  {
    id: 'trainer_bruce',
    gx: 35, gy: 45,
    sprite: 'hiker',
    facing: 'left',
    dialogue: ['Even the rocks here are toxic!', 'My POKéMON thrive in this!'],
    isTrainer: true,
    trainerId: 'hiker_bruce',
  },
  // Route 7 helper
  {
    id: 'route7_helper',
    gx: 4, gy: 45,
    sprite: 'youngster',
    facing: 'right',
    dialogue: ['KOGA\'s GYM is to the east.', 'He uses Poison-type POKéMON!', 'Ground and Psychic types work well!'],
    isTrainer: false,
  },
  // Gym Leader — Koga
  {
    id: 'gym_leader_koga',
    gx: 42, gy: 43,
    sprite: 'gymLeader6',
    facing: 'down',
    dialogue: ['I am KOGA, the Poisonous Ninja Master!', 'My toxic arts will leave you paralyzed!', 'Prepare for the ultimate poison trap!'],
    isTrainer: true,
    trainerId: 'gym_koga',
  },
  // Route 8 trainers
  {
    id: 'trainer_ember',
    gx: 8, gy: 50,
    sprite: 'lass',
    facing: 'right',
    dialogue: ['The heat here makes my Fire POKéMON stronger!', 'Let me show you!'],
    isTrainer: true,
    trainerId: 'lass_ember',
  },
  {
    id: 'trainer_ash',
    gx: 25, gy: 49,
    sprite: 'youngster',
    facing: 'left',
    dialogue: ['I found amazing POKéMON in the volcanic caves!', 'Battle me!'],
    isTrainer: true,
    trainerId: 'youngster_ash',
  },
  {
    id: 'trainer_magma',
    gx: 35, gy: 53,
    sprite: 'hiker',
    facing: 'left',
    dialogue: ['The earth trembles with power here!', 'My Rock POKéMON are unbeatable!'],
    isTrainer: true,
    trainerId: 'hiker_magma',
  },
  // Route 8 helper
  {
    id: 'route8_helper',
    gx: 4, gy: 53,
    sprite: 'youngster',
    facing: 'right',
    dialogue: ['BLAINE\'s GYM is to the east.', 'He uses Fire-type POKéMON!', 'Water, Ground, and Rock types are your best bet!'],
    isTrainer: false,
  },
  // Exp Share NPC
  {
    id: 'exp_share_npc',
    gx: 15, gy: 49,
    sprite: 'shopkeeper',
    facing: 'down',
    dialogue: ['I\'m a POKéMON researcher!', 'Take this EXP. SHARE!', 'It lets all your team POKéMON gain experience!'],
    isTrainer: false,
  },
  // Gym Leader — Blaine
  {
    id: 'gym_leader_blaine',
    gx: 31, gy: 54,
    sprite: 'gymLeader7',
    facing: 'down',
    dialogue: ['I am BLAINE, the hotheaded quiz master!', 'My fiery POKéMON will burn you to a crisp!', 'Can you withstand the heat?!'],
    isTrainer: true,
    trainerId: 'gym_blaine',
  },
  // Route 9 trainers
  {
    id: 'trainer_anya',
    gx: 9, gy: 58,
    sprite: 'lass',
    facing: 'right',
    dialogue: ['I\'ve trained under the best!', 'My team is finely tuned for battle!'],
    isTrainer: true,
    trainerId: 'cooltrainer_anya',
  },
  {
    id: 'trainer_rex',
    gx: 22, gy: 57,
    sprite: 'hiker',
    facing: 'down',
    dialogue: ['Ground types can crush anything!', 'I\'ve been training on this route for months!'],
    isTrainer: true,
    trainerId: 'cooltrainer_rex',
  },
  {
    id: 'trainer_vera',
    gx: 40, gy: 60,
    sprite: 'lass',
    facing: 'left',
    dialogue: ['Normal types may seem plain, but they\'re reliable!', 'Let\'s battle!'],
    isTrainer: true,
    trainerId: 'cooltrainer_vera',
  },
  // Route 9 helper NPC
  {
    id: 'route9_helper',
    gx: 4, gy: 61,
    sprite: 'youngster',
    facing: 'right',
    dialogue: ['GIOVANNI\'s GYM is just to the east!', 'He\'s the strongest GYM LEADER!', 'His Ground-type POKéMON are merciless!', 'You\'ll need Water, Grass, or Ice types!'],
    isTrainer: false,
  },
  // Gym Leader — Giovanni
  {
    id: 'gym_leader_giovanni',
    gx: 30, gy: 62,
    sprite: 'gymLeader8',
    facing: 'right',
    dialogue: ['Hmph! So you made it this far.', 'I am GIOVANNI, the final GYM LEADER!', 'My Ground-type POKéMON will bury you!', 'Now face the true power of TEAM ROCKET!'],
    isTrainer: true,
    trainerId: 'gym_giovanni',
  },
  // ── Pokemon League — Elite Four ──
  // Elite Four — Lorelei (Ice type)
  {
    id: 'elite_lorelei',
    gx: 10, gy: 68,
    sprite: 'gymLeader7',
    facing: 'down',
    dialogue: ['Welcome to the POKéMON LEAGUE!', 'I am LORELEI of the ELITE FOUR!', 'No one can beat my ICE POKéMON!', 'Prepare to freeze!'],
    isTrainer: true,
    trainerId: 'elite_lorelei',
  },
  // Elite Four — Agatha (Ghost type)
  {
    id: 'elite_agatha',
    gx: 40, gy: 68,
    sprite: 'gymLeader6',
    facing: 'down',
    dialogue: ['I am AGATHA of the ELITE FOUR!', 'POKéMON and I have grown old together...', 'But my GHOST POKéMON are ageless!', 'Let me show you their power!'],
    isTrainer: true,
    trainerId: 'elite_agatha',
  },
  // Elite Four — Bruno (Fighting type)
  {
    id: 'elite_bruno',
    gx: 10, gy: 72,
    sprite: 'gymLeader5',
    facing: 'down',
    dialogue: ['I am BRUNO of the ELITE FOUR!', 'Through rigorous training...', 'My FIGHTING POKéMON have become unstoppable!', 'Have you got what it takes?!'],
    isTrainer: true,
    trainerId: 'elite_bruno',
  },
  // Elite Four — Lance (Dragon type)
  {
    id: 'elite_lance',
    gx: 40, gy: 72,
    sprite: 'gymLeader4',
    facing: 'down',
    dialogue: ['I am LANCE, the DRAGON MASTER!', 'For years I have trained DRAGON POKéMON...', 'They are nearly indestructible!', 'Show me your spirit!'],
    isTrainer: true,
    trainerId: 'elite_lance',
  },
  // Champion — Gary
  {
    id: 'champion_gary',
    gx: 25, gy: 70,
    sprite: 'gymLeader8',
    facing: 'down',
    dialogue: ['So you made it this far...', 'I am the POKéMON LEAGUE CHAMPION!', 'I\'ve been waiting for this moment!', 'Let\'s see who the real master is!'],
    isTrainer: true,
    trainerId: 'champion_gary',
  },
  // Pokemon League helper NPC
  {
    id: 'league_helper',
    gx: 25, gy: 67,
    sprite: 'shopkeeper',
    facing: 'down',
    dialogue: ['Welcome to the POKéMON LEAGUE!', 'Defeat the ELITE FOUR and CHAMPION to become a POKéMON MASTER!', 'Good luck, trainer!'],
    isTrainer: false,
  },
  // Cerulean Cave guard — blocks entrance until post-game
  {
    id: 'cave_guard',
    gx: 47, gy: 31,
    sprite: 'hiker',
    facing: 'left',
    dialogue: ['This is CERULEAN CAVE.', 'Only POKéMON LEAGUE CHAMPIONS may enter.', 'It\'s dangerous inside!'],
    isTrainer: false,
    blocksCave: true,
  },
];
