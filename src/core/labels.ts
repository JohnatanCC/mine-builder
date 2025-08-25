import type { BlockType } from "./types";

export const BLOCK_LABEL: Record<BlockType, string> = {
  stone: "Pedra",
  glass: "Vidro",
  grass: "Grama",
  dirt: "Terra",
  stone_brick: "Tijolo de pedra",
  cobblestone: "Pedregulho",
  oak_planks: "Madeira Carvalho",
  spruce_planks: "Madeira Pinheiro",
  birch_planks: "Madeira Bétula",
  oak_log: "Tronco Carvalho",
  spruce_log: "Tronco Pinheiro",
  birch_log: "Tronco Bétula",
  oak_leaves: "Folhas Carvalho",
  spruce_leaves: "Folhas Pinheiro",
  birch_leaves: "Folhas Bétula",
  brick: "Tijolos",
  white_concrete: "Concreto Branco",
};

/**
 * Retorna o label de um bloco com fallback seguro.
 * Se o label não existir, retorna o nome formatado do tipo do bloco.
 */
export const getBlockLabel = (blockType: BlockType): string => {
  if (blockType in BLOCK_LABEL) {
    return BLOCK_LABEL[blockType];
  }
  
  // Fallback: formatar o nome do tipo (ex: "oak_planks" -> "Oak Planks")
  return blockType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Verifica se um label existe para o tipo de bloco.
 */
export const hasBlockLabel = (blockType: BlockType): boolean => {
  return blockType in BLOCK_LABEL;
};

/**
 * Retorna todos os tipos de blocos que possuem labels definidos.
 */
export const getLabeledBlockTypes = (): BlockType[] => {
  return Object.keys(BLOCK_LABEL) as BlockType[];
};
