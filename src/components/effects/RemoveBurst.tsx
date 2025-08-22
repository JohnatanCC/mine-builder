// UPDATE: src/components/effects/RemoveBurst.tsx
// Troca números mágicos por ANIM.duration/ANIM.remove.rise
import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorld } from '@/state/world.store';
import { ANIM } from '@/core/constants';

export const RemoveBurst: React.FC = () => {
  const effects = useWorld((s) => s.effects);
  const gc = useWorld((s) => s.gcEffects);
  const geom = React.useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  useFrame(() => { gc(); });

  return (
    <group>
      {effects.map((fx) => {
        const life = (performance.now() - fx.t0) / (fx.duration || ANIM.duration);
        if (life < 0 || life > 1) return null;

        const k = 1 - life;
        const rise = ANIM.remove.rise * life;
        const alpha = 0.6 * (1 - life * life);

        return (
          <group key={fx.id} position={[fx.pos[0], fx.pos[1] + rise, fx.pos[2]]} rotation={[0, life * 0.7, 0]}>
            <mesh geometry={geom} castShadow={false} receiveShadow={false} scale={[k, k, k]}>
              <meshStandardMaterial
                transparent
                opacity={alpha}
                depthWrite={false}
                color="#ffffff"
                metalness={0}
                roughness={1}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
