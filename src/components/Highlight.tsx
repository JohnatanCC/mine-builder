// NEW FILE: src/components/Highlight.tsx
import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorld } from '@/state/world.store';
import { ANIM } from '@/core/constants';
import { clamp } from '@/core/anim';

/**
 * Cria wireframe para diferentes variações de bloco
 */
const createVariantWireframe = (variant: string): THREE.BufferGeometry => {
  switch (variant) {
    case "stairs": {
      // Criar wireframe das escadas (base + degrau)
      
      // Base da escada
      const base = new THREE.BoxGeometry(1.02, 0.51, 1.02);
      base.translate(0, -0.25, 0);
      
      // Degrau da escada  
      const step = new THREE.BoxGeometry(1.02, 0.51, 0.51);
      step.translate(0, 0.25, 0.25);
      
      // Combinar geometrias
      const baseEdges = new THREE.EdgesGeometry(base);
      const stepEdges = new THREE.EdgesGeometry(step);
      
      // Mesclar as geometrias
      const positions: number[] = [];
      const basePos = baseEdges.attributes.position.array as Float32Array;
      const stepPos = stepEdges.attributes.position.array as Float32Array;
      
      positions.push(...Array.from(basePos));
      positions.push(...Array.from(stepPos));
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      
      baseEdges.dispose();
      stepEdges.dispose();
      base.dispose();
      step.dispose();
      
      return geometry;
    }
    
    case "slab": {
      const slab = new THREE.BoxGeometry(1.02, 0.51, 1.02);
      slab.translate(0, -0.25, 0);
      return new THREE.EdgesGeometry(slab);
    }
    
    case "fence": {
      // Poste central
      const post = new THREE.BoxGeometry(0.135, 1.02, 0.135);
      
      // Barras horizontais
      const barLower = new THREE.BoxGeometry(0.92, 0.135, 0.135);
      barLower.translate(0, -0.25, 0);
      
      const barUpper = new THREE.BoxGeometry(0.92, 0.135, 0.135);
      barUpper.translate(0, 0.25, 0);
      
      // Criar wireframes
      const postEdges = new THREE.EdgesGeometry(post);
      const barLowerEdges = new THREE.EdgesGeometry(barLower);
      const barUpperEdges = new THREE.EdgesGeometry(barUpper);
      
      // Combinar geometrias
      const positions: number[] = [];
      const postPos = postEdges.attributes.position.array as Float32Array;
      const barLowerPos = barLowerEdges.attributes.position.array as Float32Array;
      const barUpperPos = barUpperEdges.attributes.position.array as Float32Array;
      
      positions.push(...Array.from(postPos));
      positions.push(...Array.from(barLowerPos));
      positions.push(...Array.from(barUpperPos));
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      
      // Cleanup
      postEdges.dispose();
      barLowerEdges.dispose();
      barUpperEdges.dispose();
      post.dispose();
      barLower.dispose();
      barUpper.dispose();
      
      return geometry;
    }
    
    case "panel": {
      const panel = new THREE.BoxGeometry(1.02, 1.02, 0.135);
      return new THREE.EdgesGeometry(panel);
    }
    
    default: // "block"
      return new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 1.02, 1.02));
  }
};

/**
 * Ghost/Highlight da posição alvo (hoveredAdj).
 * Não raycasteia: apenas renderiza de acordo com o estado global.
 */
export const Highlight: React.FC = () => {
  const adj = useWorld((s) => s.hoveredAdj);
  const currentVariant = useWorld((s) => s.currentVariant);
  const currentRotation = useWorld((s) => s.currentRotation);
  const visible = !!adj;

  const matRef = React.useRef<THREE.LineBasicMaterial>(null!);
  const grpRef = React.useRef<THREE.Group>(null!);

  // Gerar wireframe baseado na variação atual
  const geom = React.useMemo(() => {
    return createVariantWireframe(currentVariant);
  }, [currentVariant]);

  useFrame(({ clock }) => {
    if (!matRef.current || !grpRef.current) return;
    
    // Aplicar rotação
    if (currentRotation) {
      grpRef.current.rotation.set(
        (currentRotation.x * Math.PI) / 180,
        (currentRotation.y * Math.PI) / 180,
        (currentRotation.z * Math.PI) / 180
      );
    }
    
    // Pulso sutil (alpha) —  sin²
    const t = clock.getElapsedTime() * ANIM.hover.pulseSpeed * Math.PI;
    const a = ANIM.hover.min + (ANIM.hover.max - ANIM.hover.min) * (0.5 * (1 + Math.sin(t)));
    matRef.current.opacity = clamp(a, 0, 1);
    grpRef.current.visible = visible;
    if (adj) grpRef.current.position.set(adj[0], adj[1], adj[2]);
  });

  // Cleanup da geometria quando o componente é desmontado
  React.useEffect(() => {
    return () => {
      geom.dispose();
    };
  }, [geom]);

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
