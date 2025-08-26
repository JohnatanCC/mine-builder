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
