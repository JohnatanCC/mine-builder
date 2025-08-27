import type { Pos } from "@/core/types";

// Helper function for creating position keys
const makeKey = (...pos: Pos) => `${pos[0]},${pos[1]},${pos[2]}`;

/**
 * Calcula os pontos de uma linha 3D entre dois pontos usando algoritmo de Bresenham 3D
 */
export function calculateLineBetweenPoints(start: Pos, end: Pos): Pos[] {
  const [x1, y1, z1] = start;
  const [x2, y2, z2] = end;
  
  const points: Pos[] = [];
  
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const dz = Math.abs(z2 - z1);
  
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  const sz = z1 < z2 ? 1 : -1;
  
  let x = x1;
  let y = y1;
  let z = z1;
  
  // Algoritmo de Bresenham 3D
  if (dx >= dy && dx >= dz) {
    // X é a direção dominante
    let err_y = dx / 2;
    let err_z = dx / 2;
    
    while (true) {
      points.push([x, y, z]);
      
      if (x === x2) break;
      
      err_y += dy;
      if (err_y >= dx) {
        err_y -= dx;
        y += sy;
      }
      
      err_z += dz;
      if (err_z >= dx) {
        err_z -= dx;
        z += sz;
      }
      
      x += sx;
    }
  } else if (dy >= dx && dy >= dz) {
    // Y é a direção dominante
    let err_x = dy / 2;
    let err_z = dy / 2;
    
    while (true) {
      points.push([x, y, z]);
      
      if (y === y2) break;
      
      err_x += dx;
      if (err_x >= dy) {
        err_x -= dy;
        x += sx;
      }
      
      err_z += dz;
      if (err_z >= dy) {
        err_z -= dy;
        z += sz;
      }
      
      y += sy;
    }
  } else {
    // Z é a direção dominante
    let err_x = dz / 2;
    let err_y = dz / 2;
    
    while (true) {
      points.push([x, y, z]);
      
      if (z === z2) break;
      
      err_x += dx;
      if (err_x >= dz) {
        err_x -= dz;
        x += sx;
      }
      
      err_y += dy;
      if (err_y >= dz) {
        err_y -= dz;
        y += sy;
      }
      
      z += sz;
    }
  }
  
  return points;
}

/**
 * Encontra todos os blocos iguais conectados a partir de um ponto inicial
 */
export function findConnectedBlocks(
  startPos: Pos,
  blocks: Map<string, any>,
  maxBlocks: number = 200
): Pos[] {
  const startKey = makeKey(...startPos);
  const startBlock = blocks.get(startKey);
  
  if (!startBlock) {
    return []; // Não há bloco no ponto inicial
  }
  
  const targetType = startBlock.type;
  const visited = new Set<string>();
  const toVisit: Pos[] = [startPos];
  const result: Pos[] = [];
  
  while (toVisit.length > 0 && result.length < maxBlocks) {
    const current = toVisit.shift()!;
    const key = makeKey(...current);
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    const currentBlock = blocks.get(key);
    
    // Se o bloco atual é do mesmo tipo que o inicial
    if (currentBlock && currentBlock.type === targetType) {
      result.push(current);
      
      // Adiciona vizinhos adjacentes (6 direções)
      const neighbors: Pos[] = [
        [current[0] + 1, current[1], current[2]], // +X
        [current[0] - 1, current[1], current[2]], // -X
        [current[0], current[1] + 1, current[2]], // +Y
        [current[0], current[1] - 1, current[2]], // -Y
        [current[0], current[1], current[2] + 1], // +Z
        [current[0], current[1], current[2] - 1], // -Z
      ];
      
      for (const neighbor of neighbors) {
        const neighborKey = makeKey(...neighbor);
        if (!visited.has(neighborKey)) {
          toVisit.push(neighbor);
        }
      }
    }
  }
  
  return result;
}

/**
 * Encontra blocos conectados localizados - área limitada a partir do clique
 */
export function findLocalConnectedBlocks(
  startPos: Pos,
  blocks: Map<string, any>,
  maxDistance: number = 3, // Distância máxima do ponto inicial
  maxBlocks: number = 50   // Limite de blocos para performance
): Pos[] {
  const startKey = makeKey(...startPos);
  const startBlock = blocks.get(startKey);
  
  if (!startBlock) {
    return []; // Não há bloco no ponto inicial
  }
  
  const targetType = startBlock.type;
  const visited = new Set<string>();
  const toVisit: Pos[] = [startPos];
  const result: Pos[] = [];
  
  // Função para calcular distância Manhattan
  const distance = (pos: Pos): number => {
    return Math.abs(pos[0] - startPos[0]) + 
           Math.abs(pos[1] - startPos[1]) + 
           Math.abs(pos[2] - startPos[2]);
  };
  
  while (toVisit.length > 0 && result.length < maxBlocks) {
    const current = toVisit.shift()!;
    const key = makeKey(...current);
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    // Verifica se está dentro da distância máxima
    if (distance(current) > maxDistance) continue;
    
    const currentBlock = blocks.get(key);
    
    // Se o bloco atual é do mesmo tipo que o inicial
    if (currentBlock && currentBlock.type === targetType) {
      result.push(current);
      
      // Adiciona vizinhos adjacentes (6 direções)
      const neighbors: Pos[] = [
        [current[0] + 1, current[1], current[2]], // +X
        [current[0] - 1, current[1], current[2]], // -X
        [current[0], current[1] + 1, current[2]], // +Y
        [current[0], current[1] - 1, current[2]], // -Y
        [current[0], current[1], current[2] + 1], // +Z
        [current[0], current[1], current[2] - 1], // -Z
      ];
      
      for (const neighbor of neighbors) {
        const neighborKey = makeKey(...neighbor);
        if (!visited.has(neighborKey) && distance(neighbor) <= maxDistance) {
          toVisit.push(neighbor);
        }
      }
    }
  }
  
  return result;
}

/**
 * Encontra blocos alinhados do mesmo tipo - detecta estruturas não conectadas mas alinhadas
 */
export function findAlignedBlocks(
  startPos: Pos,
  blocks: Map<string, any>,
  copyMode: 'full' | 'vertical' | 'horizontal' = 'full',
  maxDistance: number = 8, // Alcance maior para detectar estruturas separadas
  maxBlocks: number = 100
): Pos[] {
  const startKey = makeKey(...startPos);
  const startBlock = blocks.get(startKey);
  
  if (!startBlock) {
    return [];
  }
  
  const targetType = startBlock.type;
  const result: Pos[] = [];
  const [startX, startY, startZ] = startPos;
  
  // Define área de busca baseada no modo
  let searchArea: Pos[] = [];
  
  if (copyMode === 'vertical') {
    // Busca em coluna vertical (mesma X,Z, variando Y)
    for (let y = startY - maxDistance; y <= startY + maxDistance; y++) {
      searchArea.push([startX, y, startZ]);
    }
  } else if (copyMode === 'horizontal') {
    // Busca em camada horizontal (mesma Y, variando X,Z)
    for (let x = startX - maxDistance; x <= startX + maxDistance; x++) {
      for (let z = startZ - maxDistance; z <= startZ + maxDistance; z++) {
        searchArea.push([x, startY, z]);
      }
    }
  } else {
    // Modo completo - busca conectada tradicional + extensão para estruturas próximas
    const connectedBlocks = findLocalConnectedBlocks(startPos, blocks, 4, maxBlocks);
    
    // Adiciona busca por blocos alinhados próximos aos conectados
    const extendedResult = new Set<string>();
    
    connectedBlocks.forEach(([x, y, z]) => {
      extendedResult.add(makeKey(x, y, z));
      
      // Busca blocos do mesmo tipo em linha reta nas 6 direções
      const directions: Pos[] = [
        [1, 0, 0], [-1, 0, 0], // X
        [0, 1, 0], [0, -1, 0], // Y  
        [0, 0, 1], [0, 0, -1]  // Z
      ];
      
      directions.forEach(([dx, dy, dz]) => {
        for (let i = 1; i <= 3; i++) { // Busca até 3 blocos na direção
          const checkPos: Pos = [x + dx * i, y + dy * i, z + dz * i];
          const checkKey = makeKey(...checkPos);
          const checkBlock = blocks.get(checkKey);
          
          if (checkBlock && checkBlock.type === targetType) {
            extendedResult.add(checkKey);
          }
        }
      });
    });
    
    // Converte de volta para array de posições
    return Array.from(extendedResult).map(key => {
      const [x, y, z] = key.split(',').map(Number);
      return [x, y, z] as Pos;
    }).slice(0, maxBlocks);
  }
  
  // Para modos vertical e horizontal, verifica cada posição na área de busca
  for (const pos of searchArea) {
    const key = makeKey(...pos);
    const block = blocks.get(key);
    
    if (block && block.type === targetType) {
      result.push(pos);
      
      if (result.length >= maxBlocks) break;
    }
  }
  
  return result;
}

/**
 * Calcula posições para copiar uma estrutura em uma direção específica
 */
export function calculateCopyPositions(
  sourceBlocks: Pos[],
  direction: Pos
): Pos[] {
  const [dx, dy, dz] = direction;
  
  return sourceBlocks.map(([x, y, z]) => [
    x + dx,
    y + dy, 
    z + dz
  ] as Pos);
}

/**
 * Detecta direção de cópia baseada na normal da face clicada
 */
export function detectCopyDirection(
  faceNormal: Pos
): Pos {
  // A normal da face já indica a direção para onde copiar
  const [nx, ny, nz] = faceNormal;
  
  return [
    Math.round(nx),
    Math.round(ny), 
    Math.round(nz)
  ] as Pos;
}

/**
 * Calcula posições para copiar uma estrutura baseada na normal da face e modificadores
 */
export function calculateCopyPositionsFromFace(
  sourceBlocks: Pos[],
  faceNormal: Pos,
  copyMode: 'full' | 'vertical' | 'horizontal' = 'full'
): Pos[] {
  const direction = detectCopyDirection(faceNormal);
  
  if (copyMode === 'vertical') {
    // Copia apenas uma linha vertical
    const firstBlock = sourceBlocks[0];
    if (!firstBlock) return [];
    
    // Encontra apenas os blocos na mesma coluna X,Z
    const verticalBlocks = sourceBlocks.filter(([x, , z]) => 
      x === firstBlock[0] && z === firstBlock[2]
    );
    
    return calculateCopyPositions(verticalBlocks, direction);
  }
  
  if (copyMode === 'horizontal') {
    // Copia apenas uma linha horizontal
    const firstBlock = sourceBlocks[0];
    if (!firstBlock) return [];
    
    // Encontra apenas os blocos na mesma altura Y
    const horizontalBlocks = sourceBlocks.filter(([, y]) => 
      y === firstBlock[1]
    );
    
    return calculateCopyPositions(horizontalBlocks, direction);
  }
  
  // Modo normal - copia toda a estrutura
  return calculateCopyPositions(sourceBlocks, direction);
}

/**
 * Calcula pontos espelhados baseado em um eixo
 */
export function calculateMirrorPoints(
  points: Pos[],
  axis: "x" | "z",
  centerLine: number = 0
): Pos[] {
  return points.map(([x, y, z]) => {
    if (axis === "x") {
      // Espelha no eixo X
      const newX = centerLine * 2 - x;
      return [newX, y, z] as Pos;
    } else {
      // Espelha no eixo Z  
      const newZ = centerLine * 2 - z;
      return [x, y, newZ] as Pos;
    }
  });
}
