import * as React from 'react';
import * as THREE from 'three';
import { useWorld } from '../state/world.store';

const BASE_GEOM = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.001, 1.001, 1.001));
const MATERIAL = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });

function mergeEdges(positions: Array<[number, number, number]>) {
  // concatena posições transformadas
  const basePos = (BASE_GEOM.attributes.position as THREE.BufferAttribute).array as Float32Array;
  const vertsPerBlock = basePos.length; // 3 * nVertices

  const out = new Float32Array(vertsPerBlock * positions.length);
  let off = 0;
  for (const [x, y, z] of positions) {
    for (let i = 0; i < basePos.length; i += 3) {
      out[off++] = basePos[i] + x;
      out[off++] = basePos[i + 1] + y;
      out[off++] = basePos[i + 2] + z;
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(out, 3));
  return geom;
}

export function WireframeAll() {
  const show = useWorld(s => s.showWire);
  const blocks = useWorld(s => s.blocks);

  const [geom, setGeom] = React.useState<THREE.BufferGeometry | null>(null);

  React.useEffect(() => {
    if (!show) { setGeom(null); return; }
    const positions: Array<[number, number, number]> = [];
    for (const k of blocks.keys()) {
      const [x, y, z] = k.split(',').map(Number);
      positions.push([x, y, z]);
    }
    const g = positions.length ? mergeEdges(positions) : null;
    setGeom(g);
    return () => { g?.dispose(); };
  }, [show, blocks]);

  if (!show || !geom) return null;
  return <lineSegments geometry={geom} material={MATERIAL} frustumCulled={false} />;
}
