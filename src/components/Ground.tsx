// src/components/Ground.tsx
import * as React from "react";
import { useWorld } from "../state/world.store";
import { GROUND_SIZE } from "../core/types";

/**
 * Semeia a camada de grama em y=0 de forma ADITIVA.
 * Preenche todo o range [0..GROUND_SIZE-1] x [0..GROUND_SIZE-1] apenas uma vez.
 * Nunca sobrescreve blocos existentes.
 */
export function Ground() {
  const setBlockSilent = useWorld((s) => s.setBlockSilent);
  const hasBlock       = useWorld((s) => s.hasBlock);

  const seeded = React.useRef(false);

  React.useEffect(() => {
    if (seeded.current) return;

    for (let x = 0; x < GROUND_SIZE; x++) {
      for (let z = 0; z < GROUND_SIZE; z++) {
        const pos: [number, number, number] = [x, 0, z];
        if (!hasBlock(pos)) setBlockSilent(pos, "grass");
      }
    }

    seeded.current = true;
  }, [hasBlock, setBlockSilent]);

  return null;
}
