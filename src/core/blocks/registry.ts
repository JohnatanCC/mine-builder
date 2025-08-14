import * as THREE from 'three';
import type { BlockType } from '../types';
import { getBlockTextures } from '../../textures';

// Definição de um bloco no registro
export type BlockDef = {
  id: BlockType;
  label: string;
  category: 'stone' | 'wood' | 'log' | 'leaves' | 'misc';
  isLeaves?: boolean;
  // material gerado sob demanda
  material: () => THREE.Material | THREE.Material[];
  // textura usada na hotbar/preview
  preview: () => THREE.Texture;
};

// helpers locais
const solid = (map: THREE.Texture, extra?: Partial<THREE.MeshStandardMaterialParameters>) =>
  new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0, map, ...extra });

const logFaces = (bark: THREE.Texture, rings: THREE.Texture) =>
  [solid(bark), solid(bark), solid(rings), solid(rings), solid(bark), solid(bark)] as THREE.Material[];

export const REGISTRY: Record<BlockType, BlockDef> = (() => {
  const t = getBlockTextures();
  const r: Record<BlockType, BlockDef> = {
    // pedras
    stone: {
      id: 'stone', label: 'Pedra', category: 'stone',
      material: () => solid(t.stone),
      preview: () => t.stone
    },
    stone_brick: {
      id: 'stone_brick', label: 'Tijolo de Pedra', category: 'stone',
      material: () => solid(t.stoneBricks),
      preview: () => t.stoneBricks
    },
    cobblestone: {
      id: 'cobblestone', label: 'Pedregulho', category: 'stone',
      material: () => solid(t.cobblestone),
      preview: () => t.cobblestone
    },
    glass: {
      id: 'glass', label: 'Vidro', category: 'misc',
      material: () => solid(t.glass, { transparent: true, opacity: 0.55, envMapIntensity: 0.25 }),
      preview: () => t.glass
    },

    // chão/misc
    grass: {
      id: 'grass', label: 'Grama', category: 'misc',
      material: () => ([
        solid(t.grassSide), solid(t.grassSide),
        solid(t.grassTop),  solid(t.dirt),
        solid(t.grassSide), solid(t.grassSide),
      ]),
      preview: () => t.grassTop
    },
    dirt: {
      id: 'dirt', label: 'Terra', category: 'misc',
      material: () => solid(t.dirt),
      preview: () => t.dirt
    },

    // pranchas
    oak_planks:    { id: 'oak_planks',    label: 'Madeira Carvalho', category: 'wood', material: () => solid(t.oak),          preview: () => t.oak },
    spruce_planks: { id: 'spruce_planks', label: 'Madeira Pinheiro', category: 'wood', material: () => solid(t.sprucePlanks), preview: () => t.sprucePlanks },
    birch_planks:  { id: 'birch_planks',  label: 'Madeira Bétula',   category: 'wood', material: () => solid(t.birchPlanks),  preview: () => t.birchPlanks },

    // troncos
    oak_log:    { id: 'oak_log',    label: 'Tronco Carvalho', category: 'log', material: () => logFaces(t.oakBark,    t.oakRings),    preview: () => t.oakBark },
    spruce_log: { id: 'spruce_log', label: 'Tronco Pinheiro', category: 'log', material: () => logFaces(t.spruceBark, t.spruceRings), preview: () => t.spruceBark },
    birch_log:  { id: 'birch_log',  label: 'Tronco Bétula',   category: 'log', material: () => logFaces(t.birchBark,  t.birchRings),  preview: () => t.birchBark },

    // folhas
    oak_leaves:    { id: 'oak_leaves',    label: 'Folhas Carvalho', category: 'leaves', isLeaves: true, material: () => solid(t.oakLeaves,    { transparent: true, alphaTest: 0.25, side: THREE.DoubleSide, alphaToCoverage: true }), preview: () => t.oakLeaves },
    spruce_leaves: { id: 'spruce_leaves', label: 'Folhas Pinheiro', category: 'leaves', isLeaves: true, material: () => solid(t.spruceLeaves, { transparent: true, alphaTest: 0.25, side: THREE.DoubleSide, alphaToCoverage: true }), preview: () => t.spruceLeaves },
    birch_leaves:  { id: 'birch_leaves',  label: 'Folhas Bétula',   category: 'leaves', isLeaves: true, material: () => solid(t.birchLeaves,  { transparent: true, alphaTest: 0.25, side: THREE.DoubleSide, alphaToCoverage: true }), preview: () => t.birchLeaves },

    // legacy (compat)
    oak: { id: 'oak', label: 'Carvalho (legacy)', category: 'wood', material: () => solid(t.oak), preview: () => t.oak },
  };
  return r;
})();

// Lista ordenada para hotbar (ajuste como quiser)
export const BLOCKS_ORDER: BlockType[] = [
  'stone','stone_brick','cobblestone','glass',
  'oak_planks','spruce_planks','birch_planks',
  'oak_log','spruce_log','birch_log',
  'oak_leaves','spruce_leaves','birch_leaves',
  'grass','dirt'
];

// Acesso helpers
export const getLabel = (t: BlockType) => REGISTRY[t].label;
export const getPreviewTexture = (t: BlockType) => REGISTRY[t].preview();
export const isLeavesType = (t: BlockType) => !!REGISTRY[t].isLeaves;
export const getMaterialForFromRegistry = (t: BlockType) => REGISTRY[t].material();
