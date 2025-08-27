// UPDATE: src/core/materials.ts
import * as THREE from 'three';
import type { BlockType } from './types';
// ❌ removido: atlas procedural antigo
// import { getBlockTextures } from '../textures';
import { getMaterialForFromRegistry } from './blocks/registry';

const COMMON: Pick<THREE.MeshStandardMaterialParameters, 'roughness' | 'metalness'> = {
  roughness: 1,
  metalness: 0,
};

const COLOR: Partial<Record<BlockType, number>> = {
  // básicos
  stone: 0x888888,
  stone_brick: 0x7f7f7f,
  cobblestone: 0x757575,
  dirt: 0x6f472d,
  grass: 0x56a73e,
  bedrock: 0x2d2d2d,

  // madeira/pranchas
  oak_planks: 0xb0703c,
  spruce_planks: 0x7a5732,
  birch_planks: 0xdbcfa4,

  // troncos (cor média)
  oak_log: 0x9a6a3a,
  spruce_log: 0x6b4e2a,
  birch_log: 0xdedcc8,

  // folhas
  oak_leaves: 0x3f8f3f,
  spruce_leaves: 0x3a7540,
  birch_leaves: 0x6ec26d,

  // pedras especiais
  deepslate_tiles: 0x4a4a4a,
  amethyst_block: 0x9966cc,
  chiseled_stone_bricks: 0x737373,

  // materiais básicos
  glass: 0xaed4ff,
  brick: 0xb74f3c,
  redstone_lamp_on: 0xffaa44,
  bookshelf: 0x8b4513,
  iron_bars: 0x6e6e6e,

  // vidros coloridos (transparentes)
  black_stained_glass: 0x1a1a1a,
  blue_stained_glass: 0x3333cc,
  brown_stained_glass: 0x8b4513,
  cyan_stained_glass: 0x00cccc,
  gray_stained_glass: 0x808080,
  green_stained_glass: 0x33cc33,
  light_blue_stained_glass: 0x6699ff,
  light_gray_stained_glass: 0xcccccc,
  lime_stained_glass: 0x99ff33,
  magenta_stained_glass: 0xff33cc,
  orange_stained_glass: 0xff6600,
  pink_stained_glass: 0xff99cc,
  purple_stained_glass: 0x9933cc,
  red_stained_glass: 0xcc3333,
  white_stained_glass: 0xffffff,
  yellow_stained_glass: 0xffff33,
  tinted_glass: 0x666666,

  // concretos
  white_concrete: 0xf0f0f0,
  gray_concrete: 0x808080,
  black_concrete: 0x1a1a1a,
  red_concrete: 0xcc3333,
  blue_concrete: 0x3333cc,
  yellow_concrete: 0xffff33,
  green_concrete: 0x33cc33,
  orange_concrete: 0xff6600,
  purple_concrete: 0x9933cc,
  pink_concrete: 0xff99cc,
  cyan_concrete: 0x00cccc,
  lime_concrete: 0x99ff33,
  magenta_concrete: 0xff33cc,
  brown_concrete: 0x8b4513,

  // cobre (por estágio de oxidação)
  copper_block: 0xd2691e,
  cut_copper: 0xd2691e,
  chiseled_copper: 0xd2691e,
  copper_grate: 0xd2691e,
  copper_bulb: 0xd2691e,
  copper_bulb_lit: 0xffa500,
  copper_trapdoor: 0xd2691e,
  copper_ore: 0x8b7355,
  exposed_copper: 0xb87333,
  exposed_chiseled_copper: 0xb87333,
  exposed_copper_grate: 0xb87333,
  weathered_copper: 0x8fbc8f,
  weathered_copper_grate: 0x8fbc8f,
  oxidized_copper: 0x4a9b8e,
  oxidized_copper_grate: 0x4a9b8e,

  // tuff
  chiseled_tuff: 0x6b6b6b,
  chiseled_tuff_bricks: 0x5f5f5f,
};

// Cache de materiais para evitar criação excessiva e memory leaks
const materialCache = new Map<string, THREE.Material>();

function getCachedMaterial(key: string, factory: () => THREE.Material): THREE.Material {
  if (!materialCache.has(key)) {
    materialCache.set(key, factory());
  }
  return materialCache.get(key)!;
}

function solidColor(hex: number, extra?: Partial<THREE.MeshStandardMaterialParameters>) {
  const key = `solid_${hex}_${JSON.stringify(extra || {})}`;
  return getCachedMaterial(key, () => 
    new THREE.MeshStandardMaterial({ color: hex, ...COMMON, ...extra })
  );
}

export function getMaterialFor(type: BlockType): THREE.Material | THREE.Material[] {
  // 1) Tenta pegar de um registry (ex.: itens especiais/procedurais)
  const reg = getMaterialForFromRegistry(type);
  if (reg) return reg;

  // 2) Fallback por cor — simples, síncrono e estável
  //    (o Block ainda aplica ajustes de transparência para glass/folhas)
  const hex = COLOR[type] ?? 0x9c9c9c;

  // Verifica se é um tipo de vidro (transparente)
  const isGlass = type === 'glass' || type.includes('_glass');
  
  // Verifica se é uma grade (barras com partes vazias/transparentes)
  const isGrate = type.includes('_bars') || type.includes('_grate');
  
  if (isGlass || isGrate) {
    // leve transparência; o Block faz fine-tune (depthWrite/opacity) depois
    return solidColor(hex, { transparent: true, opacity: 0.55, envMapIntensity: 0.25 });
  }

  // Para a maioria dos blocos retornamos um material único (todas as faces)
  return solidColor(hex);
}

/**
 * Limpa o cache de materiais (útil para testes ou limpeza de memória)
 */
export function clearMaterialCache(): void {
  for (const material of materialCache.values()) {
    material.dispose();
  }
  materialCache.clear();
}

/**
 * Retorna estatísticas do cache de materiais
 */
export function getMaterialCacheStats(): { size: number; keys: string[] } {
  return {
    size: materialCache.size,
    keys: Array.from(materialCache.keys())
  };
}
