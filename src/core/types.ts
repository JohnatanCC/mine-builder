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
  | "bedrock"
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
  | "bookshelf"
  // Concretos
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
  | "brown_concrete"
  // Vidros coloridos
  | "black_stained_glass"
  | "blue_stained_glass"
  | "brown_stained_glass"
  | "cyan_stained_glass"
  | "gray_stained_glass"
  | "green_stained_glass"
  | "light_blue_stained_glass"
  | "light_gray_stained_glass"
  | "lime_stained_glass"
  | "magenta_stained_glass"
  | "orange_stained_glass"
  | "pink_stained_glass"
  | "purple_stained_glass"
  | "red_stained_glass"
  | "white_stained_glass"
  | "yellow_stained_glass"
  | "tinted_glass"
  // Blocos de cobre
  | "copper_block"
  | "copper_bulb"
  | "copper_bulb_lit"
  | "copper_grate"
  | "copper_ore"
  | "copper_trapdoor"
  | "cut_copper"
  | "chiseled_copper"
  | "exposed_copper"
  | "exposed_chiseled_copper"
  | "exposed_copper_grate"
  | "oxidized_copper"
  | "oxidized_copper_grate"
  | "weathered_copper"
  | "weathered_copper_grate"
  // Blocos de tuff
  | "chiseled_tuff"
  | "chiseled_tuff_bricks"
  | "polished_tuff"
  // Novos blocos
  | "crafting_table"
  | "oak_trapdoor"
  | "mossy_cobblestone"
  | "mossy_stone_bricks"
  | "polished_blackstone"
  | "polished_blackstone_bricks"
  | "polished_deepslate"
  | "polished_diorite"
  | "polished_granite"
  | "reinforced_deepslate"
  | "obsidian"
  | "moss_block"
  | "mud"
  | "mud_bricks"
  | "snow"
  | "shroomlight"
  // Lãs coloridas
  | "white_wool"
  | "light_gray_wool"
  | "gray_wool"
  | "black_wool"
  | "red_wool"
  | "orange_wool"
  | "yellow_wool"
  | "lime_wool"
  | "green_wool"
  | "cyan_wool"
  | "light_blue_wool"
  | "blue_wool"
  | "purple_wool"
  | "magenta_wool"
  | "pink_wool"
  | "brown_wool"
  // Outros
  | "iron_bars";

export type BlockVariant = "block" | "stairs" | "slab" | "fence" | "panel" | "grate";

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
export type Tool = "brush" | "line" | "copy" | "paint";
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
