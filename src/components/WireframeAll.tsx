// UPDATE: src/components/WireframeAll.tsx
import * as React from "react";
import * as THREE from "three";
import { useWorld } from "@/state/world.store";
import { parseKey } from "@/core/keys";

const BASE_EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002));
const BASE_POS = (BASE_EDGES.attributes.position as THREE.BufferAttribute).array as Float32Array;
const VERTS_PER_BLOCK = BASE_POS.length;

function mergeEdges(positions: Array<[number, number, number]>) {
  const out = new Float32Array(VERTS_PER_BLOCK * positions.length);
  let off = 0;
  for (const [x, y, z] of positions) {
    for (let i = 0; i < BASE_POS.length; i += 3) {
      out[off++] = BASE_POS[i] + x;
      out[off++] = BASE_POS[i + 1] + y;
      out[off++] = BASE_POS[i + 2] + z;
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(out, 3));
  return geom;
}

export function WireframeAll() {
  const show = useWorld((s) => s.showWire);
  const blocks = useWorld((s) => s.blocks);

  const [geom, setGeom] = React.useState<THREE.BufferGeometry | null>(null);
  const material = React.useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    []
  );

  React.useEffect(() => {
    if (!show) { setGeom(null); return; }
    const positions: Array<[number, number, number]> = [];
    for (const k of blocks.keys()) positions.push(parseKey(k));
    const g = positions.length ? mergeEdges(positions) : null;
    setGeom(g);
    return () => { g?.dispose(); };
  }, [show, blocks]);

  if (!show || !geom) return null;
  return <lineSegments  position={[0, 0.01, 0]} geometry={geom} material={material} frustumCulled={false} renderOrder={2} />;
}
