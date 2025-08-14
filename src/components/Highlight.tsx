import * as THREE from 'three';
import { useWorld } from '../state/world.store';
import { parseKey } from '../core/keys';

const BOX_GEOM = new THREE.BoxGeometry(1.001, 1.001, 1.001);
const EDGE_GEOM = new THREE.EdgesGeometry(BOX_GEOM);
const EDGE_MAT_WHITE = new THREE.LineBasicMaterial({ color: '#fff' });
const EDGE_MAT_BLACK = new THREE.LineBasicMaterial({ color: '#000' });

export function Highlight() {
  const hoveredKey = useWorld(s => s.hoveredKey);
  const highlightColor = useWorld(s => s.highlightColor);
  const blocks = useWorld(s => s.blocks);
  if (!hoveredKey || !blocks.has(hoveredKey)) return null;
  const p = parseKey(hoveredKey);
  const mat = highlightColor === 'white' ? EDGE_MAT_WHITE : EDGE_MAT_BLACK;
  return <lineSegments position={p as unknown as THREE.Vector3} geometry={EDGE_GEOM} material={mat} />;
}
