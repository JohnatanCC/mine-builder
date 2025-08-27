// src/components/CopyPreview.tsx
import * as THREE from 'three';
import * as React from 'react';
import { useWorld } from '../state/world.store';

/**
 * Component to show a preview of the blocks that will be copied
 * when using the Copy Tool - optimized and subtle
 */
export function CopyPreview() {
  const currentTool = useWorld((s) => s.currentTool);
  const copyPreview = useWorld((s) => s.copyPreview);
  const blocks = useWorld((s) => s.blocks);
  
  // Only show preview if copy tool is active and we have preview positions
  const shouldShow = currentTool === "copy" && copyPreview && copyPreview.length > 0;
  
  // Filtrar apenas posições que estão vazias para mostrar no preview
  const emptyPositions = React.useMemo(() => {
    if (!copyPreview || !shouldShow) return [];
    
    return copyPreview.filter(([x, y, z]) => {
      const key = `${x},${y},${z}`;
      return !blocks.has(key);
    });
  }, [copyPreview, shouldShow, blocks]);
  
  React.useEffect(() => {
    // Clear any existing preview when conditions change
    if (!shouldShow) return;
  }, [shouldShow, copyPreview]);
  
  if (!shouldShow || emptyPositions.length === 0) return null;
  
  return (
    <group>
      {emptyPositions.map(([x, y, z], index) => (
        <mesh key={`copy-preview-${index}-${x}-${y}-${z}`} position={[x, y, z]}>
          <boxGeometry args={[0.95, 0.95, 0.95]} />
          <meshBasicMaterial 
            color="#3b82f6" // Nice blue color for copy preview
            transparent 
            opacity={0.15} // Much more subtle - was 0.4
            depthWrite={false} // Prevent z-fighting
            wireframe={true} // Use wireframe for better performance and subtlety
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
