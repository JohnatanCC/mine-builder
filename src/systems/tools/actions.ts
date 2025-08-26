import type { Pos, BlockType, BlockVariant, BlockRotation } from "@/core/types";
import { calculateLineBetweenPoints, calculateFloodFill, calculateMirrorPoints } from "./geometry";
import { useWorld } from "@/state/world.store";
import { key as makeKey } from "@/core/keys";

/**
 * Executa a ferramenta Line Tool
 */
export function executeLineTool(start: Pos, end: Pos, blockType: BlockType, variant: BlockVariant, rotation: BlockRotation) {
  const points = calculateLineBetweenPoints(start, end);
  const store = useWorld.getState();
  
  // Inicia um stroke para histórico
  store.beginStroke();
  
  // Coloca blocos em todos os pontos da linha
  points.forEach(pos => {
    store.setBlock(pos, blockType);
  });
  
  // Finaliza o stroke
  store.endStroke();
  
  return points.length;
}

/**
 * Executa a ferramenta Fill/Bucket
 */
export function executeFillTool(startPos: Pos, blockType: BlockType, variant: BlockVariant, rotation: BlockRotation) {
  const store = useWorld.getState();
  const blocks = store.blocks;
  
  // Determina o tipo do bloco que está sendo substituído
  const startKey = makeKey(...startPos);
  const targetBlock = blocks.get(startKey);
  const targetType = targetBlock?.type || null;
  
  // Se já é do mesmo tipo, não faz nada
  if (targetType === blockType) {
    return 0;
  }
  
  // Calcula os pontos para preencher
  const points = calculateFloodFill(startPos, targetType, blocks);
  
  if (points.length === 0) {
    return 0;
  }
  
  // Inicia um stroke para histórico
  store.beginStroke();
  
  // Substitui todos os blocos
  points.forEach(pos => {
    if (targetType === null) {
      // Se não havia bloco, coloca um novo
      store.setBlock(pos, blockType);
    } else {
      // Se havia bloco, remove o antigo e coloca o novo
      store.removeBlock(pos);
      store.setBlock(pos, blockType);
    }
  });
  
  // Finaliza o stroke
  store.endStroke();
  
  return points.length;
}

/**
 * Executa a ferramenta Mirror/Flip
 */
export function executeMirrorTool(
  sourcePoints: Pos[], 
  axis: "x" | "z", 
  centerLine: number,
  blockType: BlockType, 
  variant: BlockVariant, 
  rotation: BlockRotation
) {
  const store = useWorld.getState();
  
  // Calcula os pontos espelhados
  const mirrorPoints = calculateMirrorPoints(sourcePoints, axis, centerLine);
  
  if (mirrorPoints.length === 0) {
    return 0;
  }
  
  // Inicia um stroke para histórico
  store.beginStroke();
  
  // Coloca blocos nos pontos espelhados
  mirrorPoints.forEach(pos => {
    store.setBlock(pos, blockType);
  });
  
  // Finaliza o stroke
  store.endStroke();
  
  return mirrorPoints.length;
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
