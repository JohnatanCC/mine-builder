// src/components/LinePreview.tsx
import * as THREE from 'three';
import * as React from 'react';
import { useWorld } from '../state/world.store';
import { calculateLineBetweenPoints } from '@/systems/tools/geometry';

/**
 * Component to show a preview of the line that will be drawn
 * when using the Line Tool
 */
export function LinePreview() {
  const currentTool = useWorld((s) => s.currentTool);
  const lineStart = useWorld((s) => s.lineStart);
  const hoveredAdj = useWorld((s) => s.hoveredAdj);
  
  // Only show preview if line tool is active and we have a start point
  const shouldShow = currentTool === "line" && lineStart && hoveredAdj;
  
  React.useEffect(() => {
    // Clear any existing preview when conditions change
    if (!shouldShow) return;
  }, [shouldShow, lineStart, hoveredAdj]);
  
  if (!shouldShow) return null;
  
  const linePoints = calculateLineBetweenPoints(lineStart, hoveredAdj);
  
  return (
    <group>
      {linePoints.map(([x, y, z], index) => (
        <mesh key={`line-preview-${index}-${x}-${y}-${z}`} position={[x, y, z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial 
            color="#4ade80" // Nice green color
            transparent 
            opacity={0.4} // More visible than wireframe
            depthWrite={false} // Prevent z-fighting
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Start point indicator */}
      {lineStart && (
        <mesh position={lineStart}>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshBasicMaterial 
            color="#22c55e" // Darker green for start
            transparent 
            opacity={0.6}
            wireframe={true}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
