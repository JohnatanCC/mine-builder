// core/types.ts
export type CameraMode = "orbit" | "fps";
export type BlockType =
  | "stone"
  | "glass"
  | "grass"
  | "dirt"
  | "stone_brick"
  | "chiseled_stone_bricks"
  | "cobblestone"
  | "deepslate_tiles"
  | "amethyst_block"
  | "oak_planks"
  | "spruce_planks"
  | "birch_planks"
  | "oak_log"
  | "spruce_log"
  | "birch_log"
  | "oak_leaves"
  | "spruce_leaves"
  | "birch_leaves"
  | "brick"
  | "redstone_lamp_on"
  | "white_concrete"
  | "gray_concrete"
  | "black_concrete"
  | "red_concrete"
  | "blue_concrete"
  | "yellow_concrete"
  | "green_concrete"
  | "orange_concrete"
  | "purple_concrete"
  | "pink_concrete"
  | "cyan_concrete"
  | "lime_concrete"
  | "magenta_concrete"
  | "brown_concrete";
export type Mode = "place" | "delete";
export type Pos = [number, number, number];
export type BlockData = { type: BlockType };

export type EnvPreset = "day" | "dusk" | "night";
