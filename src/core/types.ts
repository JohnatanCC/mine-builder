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

export type EnvPreset = "day" | "dusk" | "night";
