import type { Pos, BlockType, BlockVariant, BlockRotation } from "@/core/types";
import { calculateLineBetweenPoints, findAlignedBlocks, calculateCopyPositionsFromFace } from "./geometry";
import { useWorld } from "@/state/world.store";

// Helper function for creating position keys
const makeKey = (...pos: Pos) => `${pos[0]},${pos[1]},${pos[2]}`;

/**
 * Executa a ferramenta Line Tool
 */
export function executeLineTool(start: Pos, end: Pos, blockType: BlockType, variant: BlockVariant, rotation: BlockRotation) {
  const points = calculateLineBetweenPoints(start, end);
  const store = useWorld.getState();
  
  // Salva configuração atual temporariamente
  const originalVariant = store.currentVariant;
  const originalRotation = store.currentRotation;
  
  // Define a variante e rotação temporariamente
  store.setCurrentVariant(variant);
  store.setCurrentRotation(rotation);
  
  // Inicia um stroke para histórico
  store.beginStroke();
  
  // Coloca blocos em todos os pontos da linha
  points.forEach(pos => {
    store.setBlock(pos, blockType);
  });
  
  // Finaliza o stroke
  store.endStroke();
  
  // Restaura configuração original
  store.setCurrentVariant(originalVariant);
  store.setCurrentRotation(originalRotation);
  
  return points.length;
}

/**
 * Executa a ferramenta Copy - copia estruturas conectadas baseado na face clicada
 */
export function executeCopyTool(
  clickPos: Pos, 
  faceNormal: Pos, 
  blockType: BlockType, 
  variant: BlockVariant, 
  rotation: BlockRotation,
  copyMode: 'full' | 'vertical' | 'horizontal' = 'full'
) {
  const store = useWorld.getState();
  const blocks = store.blocks;
  
  // Encontra blocos alinhados do mesmo tipo (detecta estruturas separadas mas alinhadas)
  const connectedBlocks = findAlignedBlocks(clickPos, blocks, copyMode);
  
  if (connectedBlocks.length === 0) {
    return 0;
  }
  
  // Calcula novas posições baseadas na face normal e modo
  const newPositions = calculateCopyPositionsFromFace(connectedBlocks, faceNormal, copyMode);
  
  // Filtra apenas posições vazias (não duplicar blocos existentes)
  const emptyPositions: { pos: Pos; originalIndex: number }[] = [];
  
  newPositions.forEach((pos: Pos, index: number) => {
    const key = makeKey(...pos);
    const isEmpty = !blocks.has(key);
    if (isEmpty) {
      emptyPositions.push({ pos, originalIndex: index });
    }
  });

  if (emptyPositions.length === 0) {
    console.log("Todas as posições de destino já estão ocupadas");
    return 0;
  }
  
  // Salva configuração atual temporariamente
  const originalVariant = store.currentVariant;
  const originalRotation = store.currentRotation;
  
  // Define a variante e rotação temporariamente
  store.setCurrentVariant(variant);
  store.setCurrentRotation(rotation);
  
  // Inicia um stroke para histórico
  store.beginStroke();
  
  // Copia os blocos apenas para as posições vazias
  emptyPositions.forEach(({ pos, originalIndex }) => {
    const originalBlock = blocks.get(makeKey(...connectedBlocks[originalIndex]));
    if (originalBlock) {
      // Usa o blockType fornecido ou mantém o tipo original se blockType não for especificado
      const typeToUse = blockType || originalBlock.type;
      store.setBlock(pos, typeToUse);
    }
  });
  
  // Finaliza o stroke
  store.endStroke();
  
  // Restaura configuração original
  store.setCurrentVariant(originalVariant);
  store.setCurrentRotation(originalRotation);
  
  return emptyPositions.length;
}

/**
 * Executa a remoção de estruturas conectadas
 */
export function executeDeleteConnectedTool(clickPos: Pos) {
  const store = useWorld.getState();
  const blocks = store.blocks;
  
  // Encontra blocos alinhados do mesmo tipo (detecta estruturas separadas mas alinhadas)
  const connectedBlocks = findAlignedBlocks(clickPos, blocks);
  
  if (connectedBlocks.length === 0) {
    return 0;
  }
  
  // Inicia um stroke para histórico
  store.beginStroke();
  
  // Remove todos os blocos conectados
  connectedBlocks.forEach((pos: Pos) => {
    if (store.hasBlock(pos)) {
      store.removeBlock(pos);
    }
  });
  
  // Finaliza o stroke
  store.endStroke();
  
  return connectedBlocks.length;
}

/**
 * Obtém todos os blocos de uma seleção retangular
 */
export function getBlocksInSelection(start: Pos, end: Pos): Pos[] {
  const [x1, y1, z1] = start;
  const [x2, y2, z2] = end;
  
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const minZ = Math.min(z1, z2);
  const maxZ = Math.max(z1, z2);
  
  const points: Pos[] = [];
  
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        points.push([x, y, z]);
      }
    }
  }
  
  return points;
}
