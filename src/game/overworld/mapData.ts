import { Tile } from './tiles';

/** 30×25 overworld map — larger than the 20×15 viewport so the camera scrolls */
// prettier-ignore
export const MAP_WIDTH = 30;
export const MAP_HEIGHT = 25;

const T = Tile.Tree;
const G = Tile.Grass;
const g = Tile.TallGrass;
const W = Tile.Water;
const P = Tile.Path;
const F = Tile.Flower;

// prettier-ignore
export const MAP_DATA: Tile[] = [
  T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
  T,G,G,G,G,G,G,T,G,G,G,g,g,G,G,G,G,T,G,G,G,G,F,G,G,G,G,G,G,T,
  T,G,P,P,P,G,G,T,G,G,g,g,g,g,G,G,G,T,G,G,G,G,G,G,G,G,G,G,G,T,
  T,G,P,G,P,G,G,G,G,G,G,g,g,G,G,G,G,G,G,G,G,F,G,G,G,G,F,G,G,T,
  T,G,P,G,P,P,P,P,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T,
  T,G,P,G,G,G,G,G,P,G,G,G,G,G,T,T,G,G,G,G,G,G,G,G,G,G,G,G,G,T,
  T,G,P,G,F,G,G,G,P,G,G,G,G,T,T,T,T,G,G,G,G,G,G,G,G,G,G,G,G,T,
  T,G,P,P,P,P,G,G,P,G,G,G,G,G,T,T,G,G,G,G,W,W,W,G,G,G,G,G,G,T,
  T,G,G,G,G,P,G,G,P,G,G,G,G,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,T,
  T,G,G,G,G,P,P,P,P,G,G,G,G,G,G,G,G,G,W,W,W,W,W,W,W,G,G,G,G,T,
  T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,W,W,W,W,W,G,G,G,g,g,T,
  T,G,G,g,g,G,G,G,G,G,G,F,G,G,G,G,G,G,G,G,W,W,W,G,G,G,g,g,g,T,
  T,G,g,g,g,g,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,g,g,G,T,
  T,G,G,g,g,G,G,G,G,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T,
  T,G,G,G,G,G,G,G,G,P,G,G,G,G,P,G,G,G,G,G,G,G,F,G,G,G,G,G,G,T,
  T,G,G,G,G,G,G,G,G,P,G,G,G,G,P,G,G,G,T,T,G,G,G,G,G,G,G,G,G,T,
  T,G,F,G,G,G,G,G,G,P,G,G,G,G,P,G,G,T,T,T,T,G,G,G,G,G,G,G,G,T,
  T,G,G,G,G,G,G,G,G,P,P,P,P,P,P,G,G,G,T,T,G,G,G,G,g,g,G,G,G,T,
  T,G,G,G,G,G,T,T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,g,g,g,g,G,G,T,
  T,G,G,G,G,T,T,T,T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,g,g,G,G,G,T,
  T,G,G,G,G,G,T,T,G,G,G,G,F,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T,
  T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,F,G,G,G,G,G,G,G,G,F,G,T,
  T,G,G,F,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T,
  T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,F,G,G,G,G,G,T,
  T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,
];
