import type { Pos } from "@/core/types";

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
 * Calcula pontos para preenchimento de área conectada (flood fill)
 */
export function calculateFloodFill(
  startPos: Pos, 
  targetType: string | null, 
  blocks: Map<string, any>,
  maxBlocks: number = 1000
): Pos[] {
  const visited = new Set<string>();
  const toVisit: Pos[] = [startPos];
  const result: Pos[] = [];
  
  const makeKey = (pos: Pos) => `${pos[0]},${pos[1]},${pos[2]}`;
  const parseKey = (key: string): Pos => {
    const [x, y, z] = key.split(',').map(Number);
    return [x, y, z];
  };
  
  while (toVisit.length > 0 && result.length < maxBlocks) {
    const current = toVisit.shift()!;
    const key = makeKey(current);
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    const currentBlock = blocks.get(key);
    const currentType = currentBlock?.type || null;
    
    // Se o tipo atual não corresponde ao tipo alvo, adiciona aos resultados
    if (currentType === targetType) {
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
        const neighborKey = makeKey(neighbor);
        if (!visited.has(neighborKey)) {
          toVisit.push(neighbor);
        }
      }
    }
  }
  
  return result;
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
