// NEW FILE: src/components/WireGrid.tsx
import * as React from "react";
import * as THREE from "three";
import { useWorld } from "@/state/world.store";
import { GROUND_SIZE } from "@/core/constants";
export function WireGrid() {
  const show = useWorld((s) => s.showWire);

  const size = (typeof GROUND_SIZE === "number" && GROUND_SIZE > 0) ? GROUND_SIZE : 64;
  const divisions = size; // 1 divisão por bloco

  const ref = React.useRef<THREE.GridHelper>(null);

  if (!show) return null;
  return (
    <gridHelper
      ref={ref}
    args={[size, divisions, 0x50041c, 0x777777]}
      position={[11.5, 0.5, 11.5]}
      renderOrder={1}
    />
  );
}
