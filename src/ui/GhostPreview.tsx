import * as THREE from "three";
import { useWorld } from "../state/world.store";
import type { Pos } from "../core/types";

const BOX_G = new THREE.BoxGeometry(1.001, 1.001, 1.001);

const MAT_PLACE = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  transparent: true,
  opacity: 0.35,
  roughness: 1,
  metalness: 0,
  depthWrite: false,
});

const MAT_DELETE = new THREE.MeshStandardMaterial({
  color: "#ff4d4d",
  transparent: true,
  opacity: 0.28,
  roughness: 1,
  metalness: 0,
  depthWrite: false,
});

export function GhostPreview() {
  const mode = useWorld((s) => s.mode);
  const hoveredKey = useWorld((s) => s.hoveredKey);
  const hoveredAdj = useWorld((s) => s.hoveredAdj);
  const hasBlock = useWorld((s) => s.hasBlock);

  // PLACE: mostrar no voxel adjacente ao bloco sob o cursor, se vazio
  if (mode === "place" && hoveredAdj && !hasBlock(hoveredAdj)) {
    return (
      <mesh
        position={hoveredAdj as unknown as THREE.Vector3}
        geometry={BOX_G}
        material={MAT_PLACE}
        renderOrder={999}
       raycast={(/* r: THREE.Raycaster, i: THREE.Intersection[] */) => {}} 
        frustumCulled={false}
      />
    );
  }

  // DELETE: mostrar sobre o bloco alvo
  if (mode === "delete" && hoveredKey) {
    const p = hoveredKey.split(",").map(Number) as Pos;
    return (
      <mesh
        position={p as unknown as THREE.Vector3}
        geometry={BOX_G}
        material={MAT_DELETE}
        renderOrder={999}
        raycast={(/* r: THREE.Raycaster, i: THREE.Intersection[] */) => {}}
        frustumCulled={false}
      />
    );
  }

  return null;
}
