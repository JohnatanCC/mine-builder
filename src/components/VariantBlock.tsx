// src/components/VariantBlock.tsx
import * as React from 'react';
import * as THREE from 'three';
import type { BlockVariant, BlockRotation } from '@/core/types';

interface VariantBlockProps {
  variant: BlockVariant;
  rotation?: BlockRotation;
  materials: THREE.Material | THREE.Material[];
}

export const VariantBlock: React.FC<VariantBlockProps> = ({ 
  variant, 
  rotation = { x: 0, y: 0, z: 0 }, 
  materials 
}) => {
  const groupRef = React.useRef<THREE.Group>(null);
  const visualGroupRef = React.useRef<THREE.Group>(null);

  // Aplicar rotações apenas no grupo visual (não na hitbox)
  React.useEffect(() => {
    if (visualGroupRef.current) {
      visualGroupRef.current.rotation.set(
        (rotation.x * Math.PI) / 180,
        (rotation.y * Math.PI) / 180,
        (rotation.z * Math.PI) / 180
      );
    }
  }, [rotation]);

  const renderMaterial = (material: THREE.Material | THREE.Material[]) => {
    if (Array.isArray(material)) {
      return material.map((m, i) => (
        <primitive key={i} object={m} attach={`material-${i}`} />
      ));
    }
    return <primitive object={material} attach="material" />;
  };

  const renderVariant = () => {
    switch (variant) {
      case "block":
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {renderMaterial(materials)}
          </mesh>
        );

      case "stairs":
        return (
          <group>
            {/* Base da escada (laje inferior) */}
            <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
              <boxGeometry args={[1, 0.5, 1]} />
              {renderMaterial(materials)}
            </mesh>
            {/* Degrau da escada */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0.25]}>
              <boxGeometry args={[1, 0.5, 0.5]} />
              {renderMaterial(materials)}
            </mesh>
          </group>
        );

      case "slab":
        return (
          <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
            <boxGeometry args={[1, 0.5, 1]} />
            {renderMaterial(materials)}
          </mesh>
        );

      case "fence":
        return (
          <group>
            {/* Poste central */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.125, 1, 0.125]} />
              {renderMaterial(materials)}
            </mesh>
            {/* Barra horizontal inferior */}
            <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
              <boxGeometry args={[0.9, 0.125, 0.125]} />
              {renderMaterial(materials)}
            </mesh>
            {/* Barra horizontal superior */}
            <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
              <boxGeometry args={[0.9, 0.125, 0.125]} />
              {renderMaterial(materials)}
            </mesh>
          </group>
        );

      case "panel":
        return (
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 0.125]} />
            {renderMaterial(materials)}
          </mesh>
        );

      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {renderMaterial(materials)}
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef}>
      {/* Hitbox invisível para colisão - NUNCA rotaciona */}
      <mesh visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Grupo visual que aplica rotação */}
      <group ref={visualGroupRef}>
        {renderVariant()}
      </group>
    </group>
  );
};
