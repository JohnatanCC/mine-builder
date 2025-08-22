// NEW FILE: src/components/Highlight.tsx
import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorld } from '@/state/world.store';
import { ANIM } from '@/core/constants';
import { clamp } from '@/core/anim';

/**
 * Ghost/Highlight da posição alvo (hoveredAdj).
 * Não raycasteia: apenas renderiza de acordo com o estado global.
 */
export const Highlight: React.FC = () => {
  const adj = useWorld((s) => s.hoveredAdj);
  const visible = !!adj;

  const matRef = React.useRef<THREE.LineBasicMaterial>(null!);
  const grpRef = React.useRef<THREE.Group>(null!);

  // wireframe de um cubo (linhas)
  const geom = React.useMemo(() => {
    const g = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 1.02, 1.02));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!matRef.current || !grpRef.current) return;
    // Pulso sutil (alpha) —  sin²
    const t = clock.getElapsedTime() * ANIM.hover.pulseSpeed * Math.PI;
    const a = ANIM.hover.min + (ANIM.hover.max - ANIM.hover.min) * (0.5 * (1 + Math.sin(t)));
    matRef.current.opacity = clamp(a, 0, 1);
    grpRef.current.visible = visible;
    if (adj) grpRef.current.position.set(adj[0], adj[1], adj[2]);
  });

  return (
    <group ref={grpRef} visible={false}>
      <lineSegments geometry={geom}>
        <lineBasicMaterial
          ref={matRef}
          color="white"
          transparent
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
};
