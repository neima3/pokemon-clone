import { Tile } from './tiles';
import { NPCData } from './NPC';

/** 40×30 overworld map — expanded with a town, two routes, and buildings */
export const MAP_WIDTH = 40;
export const MAP_HEIGHT = 30;

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
// 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39
  T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 0
  T, G, G, G, G, G, T, T, g, g, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 1
  T, G, G, g, g, G, G, T, g, g, g, G, G, G, G, F, G, G, G, T, T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 2
  T, G, g, g, g, g, G, G, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, F, G, G, G, G, G, T,  // 3
  T, G, G, g, g, G, G, G, G, G, G, G, G, G, P, P, P, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, F, G, T,  // 4
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 5
  T, G, G, G, G, G, G, G, G, G, E, E, E, E, P, G, G, P, E, E, E, E, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 6
  T, G, F, G, G, G, G, G, G, G, E, R, R, R, P, G, G, M, M, M, E, G, G, G, W, W, W, G, G, E, Y, Y, Y, E, G, G, G, G, G, T,  // 7
  T, G, G, G, G, G, G, G, G, G, E, B, D, B, P, G, G, B, m, B, E, G, G, W, W, W, W, W, G, E, B, y, B, E, G, G, G, G, G, T,  // 8
  T, T, T, G, G, G, G, G, G, G, E, E, P, E, P, G, G, E, P, E, E, G, G, G, W, W, W, G, G, E, E, P, E, E, G, G, G, G, G, T,  // 9
  T, G, G, G, G, G, G, G, G, G, G, G, P, P, P, G, G, P, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 10
  T, G, G, G, P, P, P, P, P, P, P, P, P, G, G, G, G, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, T,  // 11
  T, G, G, G, P, G, G, G, G, G, G, G, S, G, G, F, G, G, S, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T,  // 12
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, F, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T,  // 13
  T, G, F, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, F, G, T,  // 14
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T,  // 15
  T, T, T, T, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, T, T, T, T,  // 16
  T, G, G, G, P, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, G, G, G, P, G, G, G, T,  // 17
  T, G, G, G, P, g, g, g, g, G, G, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, g, g, g, g, G, G, G, G, P, G, G, G, T,  // 18
  T, G, G, G, P, G, g, g, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, G, G, F, G, G, P, G, G, G, T,  // 19
  T, G, F, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T,  // 20
  T, G, G, G, P, G, G, G, G, G, G, T, T, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, G, G, G, G, G, P, G, G, G, T,  // 21
  T, G, G, G, P, G, G, G, G, G, T, T, T, T, G, G, G, G, G, G, G, G, G, T, T, T, T, G, G, G, G, G, G, G, G, P, G, G, G, T,  // 22
  T, G, G, G, P, G, G, G, G, G, G, T, T, G, G, G, G, G, G, G, G, G, G, G, T, T, G, G, G, G, G, g, g, G, G, P, G, G, G, T,  // 23
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, F, G, G, G, G, G, G, G, G, G, G, G, G, G, g, g, g, g, G, P, G, G, G, T,  // 24
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, W, W, G, G, G, G, G, G, G, G, G, G, g, g, G, G, P, G, G, G, T,  // 25
  T, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, W, W, W, W, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T,  // 26
  T, G, G, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, W, W, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, G, T,  // 27
  T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T,  // 28
  T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,  // 29
];

/** Get the route zone for a given grid position */
export function getRouteZone(gx: number, gy: number): string {
  // Town area: roughly rows 4-15, cols 8-22
  if (gy >= 4 && gy <= 15 && gx >= 8 && gx <= 22) return 'town';
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
  // Gym Leader
  {
    id: 'gym_leader_brock',
    gx: 31, gy: 10,
    sprite: 'gymLeader',
    facing: 'down',
    dialogue: ['I am BROCK, the GYM LEADER!', 'My rock-hard determination is my style!', 'Show me your best!'],
    isTrainer: true,
    trainerId: 'gym_brock',
  },
];
