// UPDATE: src/core/blocks/registry.ts
import * as THREE from "three";
import type { BlockType } from "../types";
import { BLOCK_LABEL } from "../labels";
import { resolveBlockIconURL } from "@/systems/textures/blockIcon";
export type BlockDef = {
  id: BlockType;
  label: string;
  category: "stone" | "wood" | "log" | "leaves" | "misc" | "brick" | "concrete";
  isLeaves?: boolean;
  material?: () => THREE.Material | THREE.Material[];
  preview: () => THREE.Texture;
};

// Helpers locais
function makePlaceholderTex(hex = 0x9c9c9c): THREE.Texture {
  const data = new Uint8Array([
    (hex >> 16) & 255,
    (hex >> 8) & 255,
    hex & 255,
    255,
  ]);
  const tex = new THREE.DataTexture(data, 1, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

const loader = new THREE.TextureLoader();
function loadPreviewTextureFromFolder(type: BlockType): THREE.Texture {
  const url = resolveBlockIconURL(type); // icon.png -> top.png -> side.png -> all.png -> faces
  if (url) {
    const t = loader.load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestMipmapNearestFilter;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.generateMipmaps = true;
    return t;
  }
  return makePlaceholderTex();
}

export const REGISTRY: Record<BlockType, BlockDef> = {
  // pedras
  stone: {
    id: "stone",
    label: BLOCK_LABEL.stone,
    category: "stone",
    preview: () => loadPreviewTextureFromFolder("stone"),
  },
  stone_brick: {
    id: "stone_brick",
    label: BLOCK_LABEL.stone_brick,
    category: "stone",
    preview: () => loadPreviewTextureFromFolder("stone_brick"),
  },
  chiseled_stone_bricks: {
    id: "chiseled_stone_bricks",
    label: BLOCK_LABEL.chiseled_stone_bricks,
    category: "stone",
    preview: () => loadPreviewTextureFromFolder("chiseled_stone_bricks"),
  },
  cobblestone: {
    id: "cobblestone",
    label: BLOCK_LABEL.cobblestone,
    category: "stone",
    preview: () => loadPreviewTextureFromFolder("cobblestone"),
  },
  deepslate_tiles: {
    id: "deepslate_tiles",
    label: BLOCK_LABEL.deepslate_tiles,
    category: "stone",
    preview: () => loadPreviewTextureFromFolder("deepslate_tiles"),
  },
  amethyst_block: {
    id: "amethyst_block",
    label: BLOCK_LABEL.amethyst_block,
    category: "stone",
    preview: () => loadPreviewTextureFromFolder("amethyst_block"),
  },
  glass: {
    id: "glass",
    label: BLOCK_LABEL.glass,
    category: "misc",
    preview: () => loadPreviewTextureFromFolder("glass"),
  },

  //brick
  brick: {
    id: "brick",
    label: BLOCK_LABEL.brick,
    category: "brick",
    preview: () => loadPreviewTextureFromFolder("brick"),
  },
  redstone_lamp_on: {
    id: "redstone_lamp_on",
    label: BLOCK_LABEL.redstone_lamp_on,
    category: "misc",
    preview: () => loadPreviewTextureFromFolder("redstone_lamp_on"),
  },

  // chão/misc
  grass: {
    id: "grass",
    label: BLOCK_LABEL.grass,
    category: "misc",
    preview: () => loadPreviewTextureFromFolder("grass"),
  },
  dirt: {
    id: "dirt",
    label: BLOCK_LABEL.dirt,
    category: "misc",
    preview: () => loadPreviewTextureFromFolder("dirt"),
  },

  // concretos
  white_concrete: {
    id: "white_concrete",
    label: BLOCK_LABEL.white_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("white_concrete"),
  },
  gray_concrete: {
    id: "gray_concrete",
    label: BLOCK_LABEL.gray_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("gray_concrete"),
  },
  black_concrete: {
    id: "black_concrete",
    label: BLOCK_LABEL.black_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("black_concrete"),
  },
  red_concrete: {
    id: "red_concrete",
    label: BLOCK_LABEL.red_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("red_concrete"),
  },
  blue_concrete: {
    id: "blue_concrete",
    label: BLOCK_LABEL.blue_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("blue_concrete"),
  },
  yellow_concrete: {
    id: "yellow_concrete",
    label: BLOCK_LABEL.yellow_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("yellow_concrete"),
  },
  green_concrete: {
    id: "green_concrete",
    label: BLOCK_LABEL.green_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("green_concrete"),
  },
  orange_concrete: {
    id: "orange_concrete",
    label: BLOCK_LABEL.orange_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("orange_concrete"),
  },
  purple_concrete: {
    id: "purple_concrete",
    label: BLOCK_LABEL.purple_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("purple_concrete"),
  },
  pink_concrete: {
    id: "pink_concrete",
    label: BLOCK_LABEL.pink_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("pink_concrete"),
  },
  cyan_concrete: {
    id: "cyan_concrete",
    label: BLOCK_LABEL.cyan_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("cyan_concrete"),
  },
  lime_concrete: {
    id: "lime_concrete",
    label: BLOCK_LABEL.lime_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("lime_concrete"),
  },
  magenta_concrete: {
    id: "magenta_concrete",
    label: BLOCK_LABEL.magenta_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("magenta_concrete"),
  },
  brown_concrete: {
    id: "brown_concrete",
    label: BLOCK_LABEL.brown_concrete,
    category: "concrete",
    preview: () => loadPreviewTextureFromFolder("brown_concrete"),
  },

  // pranchas
  oak_planks: {
    id: "oak_planks",
    label: BLOCK_LABEL.oak_planks,
    category: "wood",
    preview: () => loadPreviewTextureFromFolder("oak_planks"),
  },
  spruce_planks: {
    id: "spruce_planks",
    label: BLOCK_LABEL.spruce_planks,
    category: "wood",
    preview: () => loadPreviewTextureFromFolder("spruce_planks"),
  },
  birch_planks: {
    id: "birch_planks",
    label: BLOCK_LABEL.birch_planks,
    category: "wood",
    preview: () => loadPreviewTextureFromFolder("birch_planks"),
  },

  // troncos
  oak_log: {
    id: "oak_log",
    label: BLOCK_LABEL.oak_log,
    category: "log",
    preview: () => loadPreviewTextureFromFolder("oak_log"),
  },
  spruce_log: {
    id: "spruce_log",
    label: BLOCK_LABEL.spruce_log,
    category: "log",
    preview: () => loadPreviewTextureFromFolder("spruce_log"),
  },
  birch_log: {
    id: "birch_log",
    label: BLOCK_LABEL.birch_log,
    category: "log",
    preview: () => loadPreviewTextureFromFolder("birch_log"),
  },

  // folhas
  oak_leaves: {
    id: "oak_leaves",
    label: BLOCK_LABEL.oak_leaves,
    category: "leaves",
    isLeaves: true,
    preview: () => loadPreviewTextureFromFolder("oak_leaves"),
  },
  spruce_leaves: {
    id: "spruce_leaves",
    label: BLOCK_LABEL.spruce_leaves,
    category: "leaves",
    isLeaves: true,
    preview: () => loadPreviewTextureFromFolder("spruce_leaves"),
  },
  birch_leaves: {
    id: "birch_leaves",
    label: BLOCK_LABEL.birch_leaves,
    category: "leaves",
    isLeaves: true,
    preview: () => loadPreviewTextureFromFolder("birch_leaves"),
  },

};

// Lista ordenada para hotbar (ajuste como quiser)
export const BLOCKS_ORDER: BlockType[] = [
  // Pedras
  "stone",
  "stone_brick", 
  "chiseled_stone_bricks",
  "cobblestone",
  "deepslate_tiles",
  "amethyst_block",
  
  // Materiais básicos
  "glass",
  "brick",
  "redstone_lamp_on",
  
  // Madeiras
  "oak_planks",
  "spruce_planks", 
  "birch_planks",
  
  // Troncos
  "oak_log",
  "spruce_log",
  "birch_log",
  
  // Folhas
  "oak_leaves",
  "spruce_leaves",
  "birch_leaves",
  
  // Terreno
  "grass",
  "dirt",
  
  // Concretos neutros
  "white_concrete",
  "gray_concrete", 
  "black_concrete",
  
  // Concretos primários
  "red_concrete",
  "blue_concrete",
  "yellow_concrete",
  
  // Concretos secundários
  "green_concrete",
  "orange_concrete",
  "purple_concrete",
  
  // Concretos especiais
  "pink_concrete",
  "cyan_concrete",
  "lime_concrete",
  "magenta_concrete",
  "brown_concrete"
];

// Acesso helpers
export const getLabel = (t: BlockType) => REGISTRY[t]?.label ?? t;
export const getPreviewTexture = (t: BlockType) =>
  REGISTRY[t]?.preview() ?? loadPreviewTextureFromFolder(t);
export const isLeavesType = (t: BlockType) =>
  !!(REGISTRY[t]?.isLeaves || REGISTRY[t]?.category === "leaves");
export const getMaterialForFromRegistry = (
  t: BlockType
): THREE.Material | THREE.Material[] | undefined => REGISTRY[t]?.material?.();
