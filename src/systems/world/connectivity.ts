// src/systems/world/connectivity.ts
import type { BlockType, BlockVariant, BlockRotation, Pos } from '@/core/types';
import type { WorldState } from '@/state/world.store';
import { key } from '@/core/keys';

// Direções de vizinhança (4 direções cardinais no plano XZ)
const NEIGHBORS = [
  [1, 0, 0],   // Este
  [-1, 0, 0],  // Oeste  
  [0, 0, 1],   // Sul
  [0, 0, -1],  // Norte
] as const;

// Tipos de conexão para diferentes variantes
export type ConnectionInfo = {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};

export type StairShape = 
  | "straight"    // Escada reta
  | "inner_left"  // Canto interno esquerdo
  | "inner_right" // Canto interno direito
  | "outer_left"  // Canto externo esquerdo  
  | "outer_right"; // Canto externo direito

export type FenceConnection = {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};

/**
 * Verifica se dois blocos são compatíveis para conexão
 */
function canConnect(
  blockA: { type: BlockType; variant: BlockVariant },
  blockB: { type: BlockType; variant: BlockVariant }
): boolean {
  // Só conecta blocos do mesmo tipo e variante
  return blockA.type === blockB.type && blockA.variant === blockB.variant;
}

/**
 * Obtém informações de conexão para uma posição específica
 */
export function getConnectionInfo(
  pos: Pos,
  blocks: Map<string, any>,
  targetType: BlockType,
  targetVariant: BlockVariant
): ConnectionInfo {
  const [x, y, z] = pos;
  
  const connections = {
    north: false,
    south: false,
    east: false,
    west: false,
  };

  // Verifica cada direção
  const directions = [
    { key: 'east', offset: [1, 0, 0] },
    { key: 'west', offset: [-1, 0, 0] },
    { key: 'south', offset: [0, 0, 1] },
    { key: 'north', offset: [0, 0, -1] },
  ] as const;

  for (const { key: dirKey, offset } of directions) {
    const neighborPos: Pos = [x + offset[0], y + offset[1], z + offset[2]];
    const neighborKey = key(...neighborPos);
    const neighbor = blocks.get(neighborKey);

    if (neighbor && canConnect(
      { type: targetType, variant: targetVariant }, 
      { type: neighbor.type, variant: neighbor.variant || "block" }
    )) {
      connections[dirKey] = true;
    }
  }

  return connections;
}

/**
 * Calcula a forma ideal de uma escada baseada nos vizinhos
 */
export function calculateStairShape(connections: ConnectionInfo): {
  shape: StairShape;
  rotation: BlockRotation;
} {
  const { north, south, east, west } = connections;

  // Escada reta - conecta em direções opostas
  if ((north && south) || (east && west)) {
    const rotation = north && south 
      ? { x: 0, y: 0, z: 0 }   // Norte-Sul
      : { x: 0, y: 90, z: 0 }; // Leste-Oeste
    return { shape: "straight", rotation };
  }

  // Cantos internos (escada em L)
  if (north && east) {
    return { shape: "inner_right", rotation: { x: 0, y: 0, z: 0 } };
  }
  if (north && west) {
    return { shape: "inner_left", rotation: { x: 0, y: 90, z: 0 } };
  }
  if (south && east) {
    return { shape: "inner_left", rotation: { x: 0, y: 270, z: 0 } };
  }
  if (south && west) {
    return { shape: "inner_right", rotation: { x: 0, y: 180, z: 0 } };
  }

  // Escada simples (apenas uma direção ou nenhuma)
  if (north) return { shape: "straight", rotation: { x: 0, y: 0, z: 0 } };
  if (south) return { shape: "straight", rotation: { x: 0, y: 180, z: 0 } };
  if (east) return { shape: "straight", rotation: { x: 0, y: 90, z: 0 } };
  if (west) return { shape: "straight", rotation: { x: 0, y: 270, z: 0 } };

  // Sem conexões - orientação padrão
  return { shape: "straight", rotation: { x: 0, y: 0, z: 0 } };
}

/**
 * Calcula rotação para cerca baseada nas conexões
 */
export function calculateFenceRotation(connections: ConnectionInfo): BlockRotation {
  const { north, south, east, west } = connections;

  // Se conecta em ambas as direções Norte-Sul, mantém orientação padrão
  if (north && south && !east && !west) {
    return { x: 0, y: 0, z: 0 };
  }

  // Se conecta em ambas as direções Leste-Oeste, rotaciona 90°
  if (east && west && !north && !south) {
    return { x: 0, y: 90, z: 0 };
  }

  // Para casos com múltiplas conexões ou cantos, mantém orientação padrão
  // (a cerca se conectará visualmente de qualquer forma)
  return { x: 0, y: 0, z: 0 };
}

/**
 * Calcula rotação para painel baseada nas conexões
 */
export function calculatePanelRotation(connections: ConnectionInfo): BlockRotation {
  const { north, south, east, west } = connections;

  // Se há conexões Norte-Sul, o painel fica na direção Leste-Oeste
  if ((north || south) && !(east || west)) {
    return { x: 0, y: 90, z: 0 };
  }

  // Se há conexões Leste-Oeste, o painel fica na direção Norte-Sul
  if ((east || west) && !(north || south)) {
    return { x: 0, y: 0, z: 0 };
  }

  // Para casos ambíguos, mantém orientação padrão
  return { x: 0, y: 0, z: 0 };
}

/**
 * Função principal que atualiza automaticamente a rotação e forma de um bloco
 * baseado em seus vizinhos
 */
export function calculateAutoRotation(
  pos: Pos,
  type: BlockType,
  variant: BlockVariant,
  state: WorldState
): { rotation: BlockRotation; shape?: StairShape } {
  // Só aplica auto-rotação para variantes específicas (excluindo escadas por ora)
  if (variant === "block" || variant === "stairs" || variant === "slab") {
    return { rotation: state.currentRotation || { x: 0, y: 0, z: 0 } };
  }

  // Para cercas e painéis, sempre mantém rotação zero
  // A conectividade é manejada visualmente no VariantBlock.tsx
  if (variant === "fence" || variant === "panel") {
    return { rotation: { x: 0, y: 0, z: 0 } };
  }

  return { rotation: state.currentRotation || { x: 0, y: 0, z: 0 } };
}

/**
 * Obtém todas as posições vizinhas que precisam ser atualizadas
 * quando um bloco é colocado ou removido
 */
export function getNeighborPositions(pos: Pos): Pos[] {
  const [x, y, z] = pos;
  return NEIGHBORS.map(([dx, dy, dz]) => [x + dx, y + dy, z + dz] as Pos);
}
