// src/core/materials.ts
import * as THREE from 'three';
import type { BlockType } from './types';
import { getBlockTextures } from '../textures';
import { getMaterialForFromRegistry } from './blocks/registry';

export function getMaterialFor(type: BlockType): THREE.Material | THREE.Material[] {
  
  const tex = getBlockTextures();
  const common = { roughness: 1, metalness: 0 };
  const solid = (map: THREE.Texture, extra?: Partial<THREE.MeshStandardMaterialParameters>) =>
    new THREE.MeshStandardMaterial({ ...common, map, ...extra });

  if (type === 'glass') return solid(tex.glass, { transparent: true, opacity: 0.55, envMapIntensity: 0.25 });
  if (type === 'stone') return solid(tex.stone);
  if (type === 'grass') {
    return [
      solid(tex.grassSide), solid(tex.grassSide),
      solid(tex.grassTop),  solid(tex.dirt),
      solid(tex.grassSide), solid(tex.grassSide),
    ];
  }
  if (type === 'dirt') return solid(tex.dirt);
  if (type === 'stone_brick') return solid(tex.stoneBricks);
  if (type === 'cobblestone') return solid(tex.cobblestone);
  if (type === 'oak_planks') return solid(tex.oak);
  if (type === 'spruce_planks') return solid(tex.sprucePlanks);
  if (type === 'birch_planks') return solid(tex.birchPlanks);

  const logFaces = (bark: THREE.Texture, rings: THREE.Texture) =>
    [solid(bark), solid(bark), solid(rings), solid(rings), solid(bark), solid(bark)] as THREE.Material[];
  if (type === 'oak_log') return logFaces(tex.oakBark, tex.oakRings);
  if (type === 'spruce_log') return logFaces(tex.spruceBark, tex.spruceRings);
  if (type === 'birch_log') return logFaces(tex.birchBark, tex.birchRings);

  // legacy
  if (type === 'oak') return solid(tex.oak);

  return getMaterialForFromRegistry(type);
}
