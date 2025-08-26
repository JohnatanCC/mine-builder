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

export type BlockVariant = "block" | "stairs" | "slab" | "fence" | "panel";

export type StairShape = 
  | "straight"    // Escada reta
  | "inner_left"  // Canto interno esquerdo
  | "inner_right" // Canto interno direito
  | "outer_left"  // Canto externo esquerdo  
  | "outer_right"; // Canto externo direito

export type BlockRotation = {
  x: number; // 0, 90, 180, 270 (rotação em X - horizontal)
  y: number; // 0, 90, 180, 270 (rotação em Y - vertical)
  z: number; // 0, 90, 180, 270 (rotação em Z - profundidade)
};

export type Mode = "place" | "delete";
export type Tool = "brush" | "line" | "fill" | "mirror";
export type Pos = [number, number, number];
export type BlockData = { 
  type: BlockType;
  variant?: BlockVariant;
  rotation?: BlockRotation;
  shape?: StairShape; // Para escadas com formas especiais
};

export type EnvPreset = "day" | "dusk" | "night";

// Tipos para snapshot/serialização
export interface Voxel {
  x: number;
  y: number;
  z: number;
  type: BlockType;
  variant?: BlockVariant;
  rotation?: BlockRotation;
}

export interface WorldSnapshot {
  blocks: Voxel[];
}

// Tipos para materiais Three.js
export interface MaterialProperties {
  transparent?: boolean;
  opacity?: number;
  depthWrite?: boolean;
  alphaTest?: number;
  envMapIntensity?: number;
}
