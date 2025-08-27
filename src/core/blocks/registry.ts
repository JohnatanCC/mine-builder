// UPDATE: src/core/blocks/registry.ts
import * as THREE from "three";
import type { BlockType } from "../types";
import { BLOCK_LABEL } from "../labels";
import { resolveBlockIconURL } from "@/systems/textures/blockIcon";
export type BlockDef = {
  id: BlockType;
  label: string;
  category: "stone" | "wood" | "log" | "leaves" | "misc" | "brick" | "concrete" | "glass" | "copper" | "tuff";
  isLeaves?: boolean;
  isGlass?: boolean;
  isGrate?: boolean; // Para grades/barras com partes vazias
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

// Função auxiliar para criar entradas do registry automaticamente
function createBlockDef(
  id: BlockType, 
  category: BlockDef["category"], 
  options?: { isLeaves?: boolean; isGlass?: boolean; isGrate?: boolean }
): BlockDef {
  return {
    id,
    label: BLOCK_LABEL[id],
    category,
    ...(options?.isLeaves && { isLeaves: true }),
    ...(options?.isGlass && { isGlass: true }),
    ...(options?.isGrate && { isGrate: true }),
    preview: () => loadPreviewTextureFromFolder(id),
  };
}

export const REGISTRY: Readonly<Record<BlockType, Readonly<BlockDef>>> = Object.freeze({
  // Pedras
  stone: createBlockDef("stone", "stone"),
  stone_brick: createBlockDef("stone_brick", "stone"),
  chiseled_stone_bricks: createBlockDef("chiseled_stone_bricks", "stone"),
  cobblestone: createBlockDef("cobblestone", "stone"),
  deepslate_tiles: createBlockDef("deepslate_tiles", "stone"),
  amethyst_block: createBlockDef("amethyst_block", "stone"),
  bedrock: createBlockDef("bedrock", "stone"),

  // Vidros
  glass: createBlockDef("glass", "glass", { isGlass: true }),
  black_stained_glass: createBlockDef("black_stained_glass", "glass", { isGlass: true }),
  blue_stained_glass: createBlockDef("blue_stained_glass", "glass", { isGlass: true }),
  brown_stained_glass: createBlockDef("brown_stained_glass", "glass", { isGlass: true }),
  cyan_stained_glass: createBlockDef("cyan_stained_glass", "glass", { isGlass: true }),
  gray_stained_glass: createBlockDef("gray_stained_glass", "glass", { isGlass: true }),
  green_stained_glass: createBlockDef("green_stained_glass", "glass", { isGlass: true }),
  light_blue_stained_glass: createBlockDef("light_blue_stained_glass", "glass", { isGlass: true }),
  light_gray_stained_glass: createBlockDef("light_gray_stained_glass", "glass", { isGlass: true }),
  lime_stained_glass: createBlockDef("lime_stained_glass", "glass", { isGlass: true }),
  magenta_stained_glass: createBlockDef("magenta_stained_glass", "glass", { isGlass: true }),
  orange_stained_glass: createBlockDef("orange_stained_glass", "glass", { isGlass: true }),
  pink_stained_glass: createBlockDef("pink_stained_glass", "glass", { isGlass: true }),
  purple_stained_glass: createBlockDef("purple_stained_glass", "glass", { isGlass: true }),
  red_stained_glass: createBlockDef("red_stained_glass", "glass", { isGlass: true }),
  white_stained_glass: createBlockDef("white_stained_glass", "glass", { isGlass: true }),
  yellow_stained_glass: createBlockDef("yellow_stained_glass", "glass", { isGlass: true }),
  tinted_glass: createBlockDef("tinted_glass", "glass", { isGlass: true }),

  // Tijolos
  brick: createBlockDef("brick", "brick"),

  // Materiais básicos
  redstone_lamp_on: createBlockDef("redstone_lamp_on", "misc"),
  bookshelf: createBlockDef("bookshelf", "misc"),
  crafting_table: createBlockDef("crafting_table", "misc"),
  iron_bars: createBlockDef("iron_bars", "misc", { isGrate: true }),

  // Trapdoors
  oak_trapdoor: createBlockDef("oak_trapdoor", "wood"),

  // Pedras especiais
  mossy_cobblestone: createBlockDef("mossy_cobblestone", "stone"),
  mossy_stone_bricks: createBlockDef("mossy_stone_bricks", "stone"),
  polished_blackstone: createBlockDef("polished_blackstone", "stone"),
  polished_blackstone_bricks: createBlockDef("polished_blackstone_bricks", "stone"),
  polished_deepslate: createBlockDef("polished_deepslate", "stone"),
  polished_diorite: createBlockDef("polished_diorite", "stone"),
  polished_granite: createBlockDef("polished_granite", "stone"),
  polished_tuff: createBlockDef("polished_tuff", "tuff"),
  reinforced_deepslate: createBlockDef("reinforced_deepslate", "stone"),
  obsidian: createBlockDef("obsidian", "stone"),

  // Blocos naturais
  moss_block: createBlockDef("moss_block", "misc"),
  mud: createBlockDef("mud", "misc"),
  mud_bricks: createBlockDef("mud_bricks", "brick"),
  snow: createBlockDef("snow", "misc"),
  shroomlight: createBlockDef("shroomlight", "misc"),

  // Lãs coloridas
  white_wool: createBlockDef("white_wool", "misc"),
  light_gray_wool: createBlockDef("light_gray_wool", "misc"),
  gray_wool: createBlockDef("gray_wool", "misc"),
  black_wool: createBlockDef("black_wool", "misc"),
  red_wool: createBlockDef("red_wool", "misc"),
  orange_wool: createBlockDef("orange_wool", "misc"),
  yellow_wool: createBlockDef("yellow_wool", "misc"),
  lime_wool: createBlockDef("lime_wool", "misc"),
  green_wool: createBlockDef("green_wool", "misc"),
  cyan_wool: createBlockDef("cyan_wool", "misc"),
  light_blue_wool: createBlockDef("light_blue_wool", "misc"),
  blue_wool: createBlockDef("blue_wool", "misc"),
  purple_wool: createBlockDef("purple_wool", "misc"),
  magenta_wool: createBlockDef("magenta_wool", "misc"),
  pink_wool: createBlockDef("pink_wool", "misc"),
  brown_wool: createBlockDef("brown_wool", "misc"),

  // Terreno
  grass: createBlockDef("grass", "misc"),
  dirt: createBlockDef("dirt", "misc"),

  // Madeiras
  oak_planks: createBlockDef("oak_planks", "wood"),
  spruce_planks: createBlockDef("spruce_planks", "wood"),
  birch_planks: createBlockDef("birch_planks", "wood"),

  // Troncos
  oak_log: createBlockDef("oak_log", "log"),
  spruce_log: createBlockDef("spruce_log", "log"),
  birch_log: createBlockDef("birch_log", "log"),

  // Folhas
  oak_leaves: createBlockDef("oak_leaves", "leaves", { isLeaves: true }),
  spruce_leaves: createBlockDef("spruce_leaves", "leaves", { isLeaves: true }),
  birch_leaves: createBlockDef("birch_leaves", "leaves", { isLeaves: true }),

  // Concretos
  white_concrete: createBlockDef("white_concrete", "concrete"),
  gray_concrete: createBlockDef("gray_concrete", "concrete"),
  black_concrete: createBlockDef("black_concrete", "concrete"),
  red_concrete: createBlockDef("red_concrete", "concrete"),
  blue_concrete: createBlockDef("blue_concrete", "concrete"),
  yellow_concrete: createBlockDef("yellow_concrete", "concrete"),
  green_concrete: createBlockDef("green_concrete", "concrete"),
  orange_concrete: createBlockDef("orange_concrete", "concrete"),
  purple_concrete: createBlockDef("purple_concrete", "concrete"),
  pink_concrete: createBlockDef("pink_concrete", "concrete"),
  cyan_concrete: createBlockDef("cyan_concrete", "concrete"),
  lime_concrete: createBlockDef("lime_concrete", "concrete"),
  magenta_concrete: createBlockDef("magenta_concrete", "concrete"),
  brown_concrete: createBlockDef("brown_concrete", "concrete"),

  // Blocos de cobre
  copper_block: createBlockDef("copper_block", "copper"),
  copper_bulb: createBlockDef("copper_bulb", "copper"),
  copper_bulb_lit: createBlockDef("copper_bulb_lit", "copper"),
  copper_grate: createBlockDef("copper_grate", "copper", { isGrate: true }),
  copper_ore: createBlockDef("copper_ore", "copper"),
  copper_trapdoor: createBlockDef("copper_trapdoor", "copper"),
  cut_copper: createBlockDef("cut_copper", "copper"),
  chiseled_copper: createBlockDef("chiseled_copper", "copper"),
  exposed_copper: createBlockDef("exposed_copper", "copper"),
  exposed_chiseled_copper: createBlockDef("exposed_chiseled_copper", "copper"),
  exposed_copper_grate: createBlockDef("exposed_copper_grate", "copper", { isGrate: true }),
  oxidized_copper: createBlockDef("oxidized_copper", "copper"),
  oxidized_copper_grate: createBlockDef("oxidized_copper_grate", "copper", { isGrate: true }),
  weathered_copper: createBlockDef("weathered_copper", "copper"),
  weathered_copper_grate: createBlockDef("weathered_copper_grate", "copper", { isGrate: true }),

  // Blocos de tuff
  chiseled_tuff: createBlockDef("chiseled_tuff", "tuff"),
  chiseled_tuff_bricks: createBlockDef("chiseled_tuff_bricks", "tuff"),

} as const);

// Lista ordenada para hotbar (organizada por categorias)
export const BLOCKS_ORDER: BlockType[] = [
  // Pedras básicas
  "stone",
  "stone_brick", 
  "chiseled_stone_bricks",
  "cobblestone",
  "deepslate_tiles",
  "amethyst_block",
  "bedrock",
  
  // Materiais básicos
  "glass",
  "brick",
  "redstone_lamp_on",
  "bookshelf",
  "crafting_table",
  "iron_bars",
  
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
  "brown_concrete",

  // Vidros coloridos
  "white_stained_glass",
  "light_gray_stained_glass",
  "gray_stained_glass",
  "black_stained_glass",
  "red_stained_glass",
  "orange_stained_glass",
  "yellow_stained_glass",
  "lime_stained_glass",
  "green_stained_glass",
  "cyan_stained_glass",
  "light_blue_stained_glass",
  "blue_stained_glass",
  "purple_stained_glass",
  "magenta_stained_glass",
  "pink_stained_glass",
  "brown_stained_glass",
  "tinted_glass",

  // Blocos de cobre (por estágio de oxidação)
  "copper_block",
  "cut_copper", 
  "chiseled_copper",
  "copper_grate",
  "copper_bulb",
  "copper_bulb_lit",
  "copper_trapdoor",
  "copper_ore",
  "exposed_copper",
  "exposed_chiseled_copper",
  "exposed_copper_grate",
  "weathered_copper",
  "weathered_copper_grate",
  "oxidized_copper",
  "oxidized_copper_grate",

  // Blocos de tuff
  "chiseled_tuff",
  "chiseled_tuff_bricks",
  "polished_tuff",

  // Novos blocos de pedra
  "mossy_cobblestone",
  "mossy_stone_bricks",
  "polished_blackstone",
  "polished_blackstone_bricks",
  "polished_deepslate",
  "polished_diorite",
  "polished_granite",
  "reinforced_deepslate",
  "obsidian",

  // Trapdoors
  "oak_trapdoor",

  // Blocos naturais
  "moss_block",
  "mud",
  "mud_bricks",
  "snow",
  "shroomlight",

  // Lãs coloridas
  "white_wool",
  "light_gray_wool",
  "gray_wool",
  "black_wool",
  "red_wool",
  "orange_wool",
  "yellow_wool",
  "lime_wool",
  "green_wool",
  "cyan_wool",
  "light_blue_wool",
  "blue_wool",
  "purple_wool",
  "magenta_wool",
  "pink_wool",
  "brown_wool",
];

// Acesso helpers
export const getLabel = (t: BlockType) => REGISTRY[t]?.label ?? t;
export const getPreviewTexture = (t: BlockType) =>
  REGISTRY[t]?.preview() ?? loadPreviewTextureFromFolder(t);

/**
 * Sistema de auto-descoberta de blocos
 * Analisa a pasta de texturas e sugere novos blocos que podem ser adicionados
 */
export function discoverNewBlocks(): string[] {
  // Esta função seria chamada em desenvolvimento para descobrir novos blocos
  // Por enquanto, retorna uma lista vazia, mas pode ser expandida para
  // analisar dinamicamente a pasta de texturas
  return [];
}

/**
 * Verifica se um bloco tem texturas disponíveis
 */
export function hasTextures(blockType: string): boolean {
  // Verifica se existe pelo menos uma textura para o bloco
  const variants = ["all", "top", "side", "icon"];
  return variants.some(_variant => {
    // Esta lógica pode ser expandida para verificar arquivos reais
    // Por enquanto, assume que se o bloco está no sistema, tem texturas
    return blockType.length > 0;
  });
}

/**
 * Sistema automático de categorização baseado no nome do bloco
 */
export function autoDetectCategory(blockType: string): BlockDef["category"] {
  if (blockType.includes("concrete")) return "concrete";
  if (blockType.includes("glass")) return "glass";
  if (blockType.includes("copper")) return "copper";
  if (blockType.includes("tuff")) return "tuff";
  if (blockType.includes("planks")) return "wood";
  if (blockType.includes("log")) return "log";
  if (blockType.includes("leaves")) return "leaves";
  if (blockType.includes("brick")) return "brick";
  if (blockType.includes("stone") || blockType.includes("slate")) return "stone";
  return "misc";
}

/**
 * Detecta automaticamente se um bloco é uma grade/barra
 */
export function autoDetectIsGrate(blockType: string): boolean {
  return blockType.includes("_bars") || blockType.includes("_grate");
}

/**
 * Detecta automaticamente se um bloco é vidro
 */
export function autoDetectIsGlass(blockType: string): boolean {
  return blockType === "glass" || blockType.includes("_glass");
}

/**
 * Detecta automaticamente se um bloco são folhas
 */
export function autoDetectIsLeaves(blockType: string): boolean {
  return blockType.includes("leaves");
}
export const isLeavesType = (t: BlockType) =>
  !!(REGISTRY[t]?.isLeaves || REGISTRY[t]?.category === "leaves");
export const getMaterialForFromRegistry = (
  t: BlockType
): THREE.Material | THREE.Material[] | undefined => REGISTRY[t]?.material?.();
