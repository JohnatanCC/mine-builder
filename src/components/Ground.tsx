// src/components/Ground.tsx
import * as React from "react";
import { useWorld } from "../state/world.store";

export function Ground() {
  const setBlockSilent = useWorld((s) => s.setBlockSilent);
  const hasBlock       = useWorld((s) => s.hasBlock);
  const buildSize      = useWorld((s) => s.buildSize);

  const lastApplied = React.useRef<number>(0);

  React.useEffect(() => {
    const prev = lastApplied.current || 0;
    const curr = buildSize;
    if (curr <= prev) return; // só aumenta

    const halfPrev = Math.floor(prev / 2);
    const halfCurr = Math.floor(curr / 2);

    // se é a primeira vez, prev = 0 → preenche tudo
    const xMin = -halfCurr;
    const xMax = +halfCurr - 1;
    const zMin = -halfCurr;
    const zMax = +halfCurr - 1;

    const shouldFillAll = prev === 0;

    // Função para pintar (x,z) no nível 0 se não houver bloco
    const paint = (x: number, z: number) => {
      const pos: [number, number, number] = [x, 0, z];
      if (!hasBlock(pos)) setBlockSilent(pos, "grass");
    };

    if (shouldFillAll) {
      for (let x = xMin; x <= xMax; x++) {
        for (let z = zMin; z <= zMax; z++) paint(x, z);
      }
    } else {
      // Pinta só o anel novo: bordas externas do quadrado curr
      // Topo e base
      for (let x = xMin; x <= xMax; x++) {
        for (let z = zMin; z < zMin + (halfCurr - halfPrev); z++) paint(x, z);         // faixa superior
        for (let z = zMax - (halfCurr - halfPrev) + 1; z <= zMax; z++) paint(x, z);    // faixa inferior
      }
      // Laterais (sem repintar cantos já cobertos)
      for (let z = zMin + (halfCurr - halfPrev); z <= zMax - (halfCurr - halfPrev); z++) {
        for (let x = xMin; x < xMin + (halfCurr - halfPrev); x++) paint(x, z);         // esquerda
        for (let x = xMax - (halfCurr - halfPrev) + 1; x <= xMax; x++) paint(x, z);    // direita
      }
    }

    lastApplied.current = curr;
  }, [buildSize, hasBlock, setBlockSilent]);

  return null;
}
