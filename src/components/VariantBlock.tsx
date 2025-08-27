// src/components/VariantBlock.tsx
import * as React from 'react';
import * as THREE from 'three';
import type { BlockVariant, BlockRotation, StairShape } from '@/core/types';
import { useWorld } from '@/state/world.store';
import { key } from '@/core/keys';

interface VariantBlockProps {
  variant: BlockVariant;
  rotation?: BlockRotation;
  materials: THREE.Material | THREE.Material[];
  shape?: StairShape; // Para escadas com formas especiais
  pos?: [number, number, number]; // Posição para cálculo de conexões
}

export const VariantBlock: React.FC<VariantBlockProps> = ({ 
  variant, 
  rotation = { x: 0, y: 0, z: 0 }, 
  materials,
  shape = "straight",
  pos
}) => {
  const groupRef = React.useRef<THREE.Group>(null);
  const visualGroupRef = React.useRef<THREE.Group>(null);
  const blocks = useWorld((state) => state.blocks); // Otimização: usar hook em vez de getState

  // Calcular conexões para cercas, painéis e grades
  const getConnections = () => {
    if (!pos || (variant !== "fence" && variant !== "panel" && variant !== "grate")) {
      return { north: false, south: false, east: false, west: false };
    }

    const [x, y, z] = pos;
    
    const directions = [
      { key: 'north', offset: [0, 0, -1] },
      { key: 'south', offset: [0, 0, 1] },
      { key: 'east', offset: [1, 0, 0] },
      { key: 'west', offset: [-1, 0, 0] },
    ] as const;

    const connections = { north: false, south: false, east: false, west: false };

    for (const { key: dirKey, offset } of directions) {
      const neighborPos = [x + offset[0], y + offset[1], z + offset[2]];
      const neighborKey = key(neighborPos[0], neighborPos[1], neighborPos[2]);
      const neighbor = blocks.get(neighborKey);

      if (neighbor) {
        // Conecta se:
        // 1. Vizinho é da mesma variante (fence com fence, panel com panel)
        // 2. Vizinho é um bloco normal (variant "block")
        const canConnect = 
          neighbor.variant === variant || // Mesma variante
          neighbor.variant === "block";   // Bloco sólido

        if (canConnect) {
          connections[dirKey] = true;
        }
      }
    }

    return connections;
  };

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

  const renderStairs = (stairShape: StairShape) => {
    switch (stairShape) {
      case "straight":
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

      case "inner_left":
        return (
          <group>
            {/* Base da escada (laje inferior) */}
            <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
              <boxGeometry args={[1, 0.5, 1]} />
              {renderMaterial(materials)}
            </mesh>
            {/* Degrau da escada - formato L interno */}
            <mesh castShadow receiveShadow position={[0.25, 0.25, 0.25]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              {renderMaterial(materials)}
            </mesh>
            <mesh castShadow receiveShadow position={[-0.25, 0.25, 0.25]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              {renderMaterial(materials)}
            </mesh>
            <mesh castShadow receiveShadow position={[0.25, 0.25, -0.25]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              {renderMaterial(materials)}
            </mesh>
          </group>
        );

      case "inner_right":
        return (
          <group>
            {/* Base da escada (laje inferior) */}
            <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
              <boxGeometry args={[1, 0.5, 1]} />
              {renderMaterial(materials)}
            </mesh>
            {/* Degrau da escada - formato L interno direito */}
            <mesh castShadow receiveShadow position={[-0.25, 0.25, 0.25]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              {renderMaterial(materials)}
            </mesh>
            <mesh castShadow receiveShadow position={[0.25, 0.25, 0.25]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              {renderMaterial(materials)}
            </mesh>
            <mesh castShadow receiveShadow position={[-0.25, 0.25, -0.25]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              {renderMaterial(materials)}
            </mesh>
          </group>
        );

      default:
        // Fallback para escada reta
        return (
          <group>
            <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
              <boxGeometry args={[1, 0.5, 1]} />
              {renderMaterial(materials)}
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.25, 0.25]}>
              <boxGeometry args={[1, 0.5, 0.5]} />
              {renderMaterial(materials)}
            </mesh>
          </group>
        );
    }
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
        return renderStairs(shape);

      case "slab":
        return (
          <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
            <boxGeometry args={[1, 0.5, 1]} />
            {renderMaterial(materials)}
          </mesh>
        );

      case "fence":
        const connections = getConnections();
        return (
          <group>
            {/* Poste central */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.125, 1, 0.125]} />
              {renderMaterial(materials)}
            </mesh>
            
            {/* Conexões laterais - cada cerca renderiza meia-barra até a borda */}
            {connections.east && (
              <group>
                {/* Barra inferior para leste */}
                <mesh castShadow receiveShadow position={[0.25, -0.25, 0]}>
                  <boxGeometry args={[0.5, 0.125, 0.125]} />
                  {renderMaterial(materials)}
                </mesh>
                {/* Barra superior para leste */}
                <mesh castShadow receiveShadow position={[0.25, 0.25, 0]}>
                  <boxGeometry args={[0.5, 0.125, 0.125]} />
                  {renderMaterial(materials)}
                </mesh>
              </group>
            )}
            
            {connections.west && (
              <group>
                {/* Barra inferior para oeste */}
                <mesh castShadow receiveShadow position={[-0.25, -0.25, 0]}>
                  <boxGeometry args={[0.5, 0.125, 0.125]} />
                  {renderMaterial(materials)}
                </mesh>
                {/* Barra superior para oeste */}
                <mesh castShadow receiveShadow position={[-0.25, 0.25, 0]}>
                  <boxGeometry args={[0.5, 0.125, 0.125]} />
                  {renderMaterial(materials)}
                </mesh>
              </group>
            )}
            
            {connections.north && (
              <group>
                {/* Barra inferior para norte */}
                <mesh castShadow receiveShadow position={[0, -0.25, -0.25]}>
                  <boxGeometry args={[0.125, 0.125, 0.5]} />
                  {renderMaterial(materials)}
                </mesh>
                {/* Barra superior para norte */}
                <mesh castShadow receiveShadow position={[0, 0.25, -0.25]}>
                  <boxGeometry args={[0.125, 0.125, 0.5]} />
                  {renderMaterial(materials)}
                </mesh>
              </group>
            )}
            
            {connections.south && (
              <group>
                {/* Barra inferior para sul */}
                <mesh castShadow receiveShadow position={[0, -0.25, 0.25]}>
                  <boxGeometry args={[0.125, 0.125, 0.5]} />
                  {renderMaterial(materials)}
                </mesh>
                {/* Barra superior para sul */}
                <mesh castShadow receiveShadow position={[0, 0.25, 0.25]}>
                  <boxGeometry args={[0.125, 0.125, 0.5]} />
                  {renderMaterial(materials)}
                </mesh>
              </group>
            )}
          </group>
        );

      case "panel":
        const panelConnections = getConnections();
        return (
          <group>
            {/* Painel central */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.125, 1, 0.125]} />
              {renderMaterial(materials)}
            </mesh>
            
            {/* Conexões laterais - cada painel renderiza meia-conexão até a borda */}
            {panelConnections.east && (
              <mesh castShadow receiveShadow position={[0.25, 0, 0]}>
                <boxGeometry args={[0.5, 1, 0.125]} />
                {renderMaterial(materials)}
              </mesh>
            )}
            
            {panelConnections.west && (
              <mesh castShadow receiveShadow position={[-0.25, 0, 0]}>
                <boxGeometry args={[0.5, 1, 0.125]} />
                {renderMaterial(materials)}
              </mesh>
            )}
            
            {panelConnections.north && (
              <mesh castShadow receiveShadow position={[0, 0, -0.25]}>
                <boxGeometry args={[0.125, 1, 0.5]} />
                {renderMaterial(materials)}
              </mesh>
            )}
            
            {panelConnections.south && (
              <mesh castShadow receiveShadow position={[0, 0, 0.25]}>
                <boxGeometry args={[0.125, 1, 0.5]} />
                {renderMaterial(materials)}
              </mesh>
            )}
          </group>
        );

      case "grate":
        const grateConnections = getConnections();
        return (
          <group>
            {/* Grade central - palito vertical inicial */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.0625, 1, 0.0625]} />
              {renderMaterial(materials)}
            </mesh>
            
            {/* Conexões laterais - cada grade renderiza meia-conexão até a borda */}
            {grateConnections.east && (
              <mesh castShadow receiveShadow position={[0.25, 0, 0]}>
                <boxGeometry args={[0.5, 1, 0.0625]} />
                {renderMaterial(materials)}
              </mesh>
            )}
            
            {grateConnections.west && (
              <mesh castShadow receiveShadow position={[-0.25, 0, 0]}>
                <boxGeometry args={[0.5, 1, 0.0625]} />
                {renderMaterial(materials)}
              </mesh>
            )}
            
            {grateConnections.north && (
              <mesh castShadow receiveShadow position={[0, 0, -0.25]}>
                <boxGeometry args={[0.0625, 1, 0.5]} />
                {renderMaterial(materials)}
              </mesh>
            )}
            
            {grateConnections.south && (
              <mesh castShadow receiveShadow position={[0, 0, 0.25]}>
                <boxGeometry args={[0.0625, 1, 0.5]} />
                {renderMaterial(materials)}
              </mesh>
            )}
          </group>
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
