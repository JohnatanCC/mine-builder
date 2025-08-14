// src/components/Ground.tsx
import { useWorld } from '../state/world.store';
import { GROUND_SIZE } from '../core/constants';
import React from 'react';

export function Ground() {
  const setBlockSilent = useWorld(s => s.setBlockSilent);
  React.useEffect(() => {
    for (let x = -GROUND_SIZE/2; x < GROUND_SIZE/2; x++) {
      for (let z = -GROUND_SIZE/2; z < GROUND_SIZE/2; z++) {
        setBlockSilent([x, 0, z], 'grass');
      }
    }
  }, [setBlockSilent]);
  return null;
}
