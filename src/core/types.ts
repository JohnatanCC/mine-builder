// core/types.ts
export type CameraMode = "orbit" | "fps";
export type BlockType =
  | "stone"
  | "glass"
  | "grass"
  | "dirt"
  | "stone_brick"
  | "cobblestone"
  | "oak_planks"
  | "spruce_planks"
  | "birch_planks"
  | "oak_log"
  | "spruce_log"
  | "birch_log"
  | "oak_leaves"
  | "spruce_leaves"
  | "brick"
  | "white_concrete"
  | "birch_leaves";
export type Mode = "place" | "delete";
export type Pos = [number, number, number];
export type BlockData = { type: BlockType };

// core/constants.ts
export const GROUND_SIZE = 24;
export const ACTION_COOLDOWN = 120;
export const DRAG_THRESHOLD = 4;

// core/keys.ts
export const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
export const parseKey = (k: string) => k.split(",").map(Number) as Pos;
