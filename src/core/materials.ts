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

  // vidro
  glass: 0xaed4ff,

  brick: 0xb74f3c

};

function solidColor(hex: number, extra?: Partial<THREE.MeshStandardMaterialParameters>) {
  return new THREE.MeshStandardMaterial({ color: hex, ...COMMON, ...extra });
}

export function getMaterialFor(type: BlockType): THREE.Material | THREE.Material[] {
  // 1) Tenta pegar de um registry (ex.: itens especiais/procedurais)
  const reg = getMaterialForFromRegistry(type);
  if (reg) return reg;

  // 2) Fallback por cor — simples, síncrono e estável
  //    (o Block ainda aplica ajustes de transparência para glass/folhas)
  const hex = COLOR[type] ?? 0x9c9c9c;

  if (type === 'glass') {
    // leve transparência; o Block faz fine-tune (depthWrite/opacity) depois
    return solidColor(hex, { transparent: true, opacity: 0.55, envMapIntensity: 0.25 });
  }

  // Para a maioria dos blocos retornamos um material único (todas as faces)
  return solidColor(hex);
}
