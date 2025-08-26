// NEW FILE: src/components/Highlight.tsx
import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorld } from '@/state/world.store';
import { ANIM } from '@/core/constants';
import { clamp } from '@/core/anim';

// Geometrias personalizadas para highlight mais preciso
const createStairsHighlightGeometry = () => {
  const group = new THREE.Group();
  
  // Parte inferior da escada (laje)
  const bottomGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 0.51, 1.02));
  const bottomLines = new THREE.LineSegments(bottomGeom);
  bottomLines.position.set(0, -0.25, 0);
  group.add(bottomLines);
  
  // Parte superior da escada (degrau)
  const topGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 0.51, 0.51));
  const topLines = new THREE.LineSegments(topGeom);
  topLines.position.set(0, 0.25, -0.25);
  group.add(topLines);
  
  // Converter para uma única geometria
  group.updateMatrixWorld();
  const mergedGeometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  
  group.traverse((child) => {
    if (child instanceof THREE.LineSegments) {
      const geom = child.geometry;
      const pos = geom.attributes.position.array;
      const matrix = child.matrixWorld;
      
      for (let i = 0; i < pos.length; i += 3) {
        const vertex = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
        vertex.applyMatrix4(matrix);
        positions.push(vertex.x, vertex.y, vertex.z);
      }
    }
  });
  
  mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return mergedGeometry;
};

// Geometrias pré-calculadas para melhor performance
const HIGHLIGHT_GEOMETRIES = {
  block: new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 1.02, 1.02)),
  slab: new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 0.51, 1.02)),
  stairs: createStairsHighlightGeometry(),
};

/**
 * Ghost/Highlight da posição alvo (hoveredAdj).
 * Mostra a geometria correta baseada na variante selecionada.
 */
export const Highlight: React.FC = () => {
  const adj = useWorld((s) => s.hoveredAdj);
  const currentVariant = useWorld((s) => s.currentVariant);
  const currentRotation = useWorld((s) => s.currentRotation);
  const visible = !!adj;

  const matRef = React.useRef<THREE.LineBasicMaterial>(null!);
  const grpRef = React.useRef<THREE.Group>(null!);

  // Selecionar geometria baseada na variante (memoizado para performance)
  const geometry = React.useMemo(() => {
    return HIGHLIGHT_GEOMETRIES[currentVariant as keyof typeof HIGHLIGHT_GEOMETRIES] || HIGHLIGHT_GEOMETRIES.block;
  }, [currentVariant]);

  useFrame(({ clock }) => {
    if (!matRef.current || !grpRef.current) return;
    
    // Pulso sutil (alpha) —  sin²
    const t = clock.getElapsedTime() * ANIM.hover.pulseSpeed * Math.PI;
    const a = ANIM.hover.min + (ANIM.hover.max - ANIM.hover.min) * (0.5 * (1 + Math.sin(t)));
    matRef.current.opacity = clamp(a, 0, 1);
    
    grpRef.current.visible = visible;
    
    if (adj) {
      grpRef.current.position.set(adj[0], adj[1], adj[2]);
      
      // Aplicar rotação baseada no currentRotation
      if (currentRotation) {
        grpRef.current.rotation.set(
          (currentRotation.x * Math.PI) / 180,
          (currentRotation.y * Math.PI) / 180,
          (currentRotation.z * Math.PI) / 180
        );
      } else {
        grpRef.current.rotation.set(0, 0, 0);
      }
      
      // Ajustar posição Y para slabs (posicionar corretamente)
      if (currentVariant === 'slab') {
        grpRef.current.position.y = adj[1] - 0.25;
      }
    }
  });

  return (
    <group ref={grpRef} visible={false}>
      <lineSegments geometry={geometry}>
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
