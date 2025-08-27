// UPDATE: src/components/CameraControls.tsx
import * as React from "react";
import { OrbitControls, type OrbitControlsProps } from "@react-three/drei";
import { useWorld } from "@/state/world.store";
import type { Mode } from "@/core/types";

export const CameraControls: React.FC<OrbitControlsProps> = (props) => {
  const mode = useWorld((s) => s.mode as Mode);

  // Travar câmera se estiver em brush fixo
  const lockCamera = String(mode) === "brush";

  React.useEffect(() => {
    const prev = document.body.style.cursor;
    if (lockCamera) document.body.style.cursor = "crosshair";
    return () => { document.body.style.cursor = prev; };
  }, [lockCamera]);

  return (
    <OrbitControls
      makeDefault
      enablePan={!lockCamera}
      enableRotate={!lockCamera}
      // Se quiser, também bloqueie zoom em brush:
      // enableZoom={!lockCamera}
      enableZoom={true}
      enableDamping
      dampingFactor={0.08}
      {...props}
    />
  );
};
