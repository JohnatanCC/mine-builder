import * as THREE from 'three';
import * as React from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { getBlockTextures } from '../textures';
import { getMaterialFor } from '../core/materials';
import { useWindyLeafMaterial } from '../core/leafMaterial';
import { key } from '../core/keys';
import type { BlockType, Pos } from '../core/types';
import { useWorld } from '../state/world.store';
import { useClickGuard } from '../systems/input/useClickGuard';

const isLeaves = (t: BlockType) =>
  t === 'oak_leaves' || t === 'spruce_leaves' || t === 'birch_leaves';

export function Block({ pos, type }: { pos: Pos; type: BlockType }) {
  const setBlock = useWorld((s) => s.setBlock);
  const removeBlock = useWorld((s) => s.removeBlock);
  const hasBlock = useWorld((s) => s.hasBlock);

  const current = useWorld((s) => s.current);
  const setCurrent = useWorld((s) => s.setCurrent); // conta-gotas
  const foliageMode = useWorld((s) => s.foliageMode);

  const setHoveredKey = useWorld((s) => s.setHoveredKey);
  const setHoveredAdj = useWorld((s) => s.setHoveredAdj);

  const beginStroke = useWorld((s) => s.beginStroke);
  const endStroke   = useWorld((s) => s.endStroke);

  const idKey = React.useMemo(() => key(...pos), [pos]);

  // ==== voxel adjacente estável (via ponto de impacto) ====
  const computeAdjacentPos = (e: ThreeEvent<PointerEvent>): Pos => {
    const center = new THREE.Vector3(pos[0], pos[1], pos[2]);
    const hit = (e.point as THREE.Vector3).clone();
    const d = hit.sub(center);
    const ax = Math.abs(d.x), ay = Math.abs(d.y), az = Math.abs(d.z);
    if (ax >= ay && ax >= az) return [pos[0] + (d.x >= 0 ? 1 : -1), pos[1], pos[2]];
    if (ay >= ax && ay >= az) return [pos[0], pos[1] + (d.y >= 0 ? 1 : -1), pos[2]];
    return [pos[0], pos[1], pos[2] + (d.z >= 0 ? 1 : -1)];
  };

  // ==== Brush (dedup por "stroke") ====
  const strokeLastKey = React.useRef<string | null>(null);
  const resetStroke = () => { strokeLastKey.current = null; };

  const tryPlaceAt = (p: Pos) => {
    const k = key(...p);
    if (strokeLastKey.current === k) return;
    if (!hasBlock(p)) {
      setBlock(p, current);
      strokeLastKey.current = k;
    }
  };

  const tryDeleteHere = () => {
    if (strokeLastKey.current === idKey) return;
    removeBlock(pos);
    strokeLastKey.current = idKey;
  };

  // ==== Conta-gotas ====
  const isEyedrop = (e: ThreeEvent<PointerEvent>) =>
    e.button === 1 || (e.button === 0 && (e.nativeEvent as PointerEvent).altKey);

  // ==== Guarda de clique (anti-acidente) ====
  const { setDown, isClick, getButton, canFire } = useClickGuard();

  // ==== Handlers (sem modos; brush só com Ctrl) ====
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    const native = e.nativeEvent as PointerEvent;
    const ctrl = native.ctrlKey || useWorld.getState().isCtrlDown;

    setDown(e); // registra para diferenciar clique de arrasto

    // Conta-gotas
    if (isEyedrop(e)) {
      native.preventDefault?.(); // evita auto-scroll do botão do meio
      setCurrent(type);
      resetStroke();
      return;
    }

    // Brush só com Ctrl: inicia stroke e executa a primeira ação
    if (ctrl) {
      beginStroke();
      if (e.button === 2) {
        tryDeleteHere();
      } else if (e.button === 0) {
        const adj = computeAdjacentPos(e);
        tryPlaceAt(adj);
        setHoveredAdj(adj);
      }
      return;
    }

    // Sem Ctrl: não faz nada agora; a ação acontecerá no PointerUp se for "clique"
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    // atualiza ghost/preview sempre
    const adj = computeAdjacentPos(e);
    setHoveredAdj(adj);

    const native = e.nativeEvent as PointerEvent;
    const ctrl = native.ctrlKey || useWorld.getState().isCtrlDown;
    const btns = native.buttons; // bitmask

    if (!ctrl) return; // sem Ctrl: sem brush no arrasto

    // segurança: se começou a arrastar já com Ctrl, abre stroke
    if ((btns & 3) && !useWorld.getState().currentStroke) beginStroke();

    // Ctrl + Direito (bit 2) → apagar contínuo
    if (btns & 2) { tryDeleteHere(); return; }

    // Ctrl + Esquerdo (bit 1) → colocar contínuo
    if (btns & 1) { tryPlaceAt(adj); }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    const native = e.nativeEvent as PointerEvent;
    const ctrl = native.ctrlKey || useWorld.getState().isCtrlDown;

    if (ctrl) {
      // finaliza brush
      endStroke();
      resetStroke();
      return;
    }

    // Sem Ctrl: dispara ação apenas se for um clique (não arrasto) e respeitando cooldown
    if (!isClick(e) || !canFire()) { resetStroke(); return; }

    const button = getButton();
    if (button === 2) {
      // clique direito: apagar 1
      tryDeleteHere();
    } else if (button === 0) {
      // clique esquerdo: colocar 1 no adjacente
      const adj = computeAdjacentPos(e);
      tryPlaceAt(adj);
      setHoveredAdj(adj);
    }

    resetStroke();
  };

  const handlePointerOut = () => {
    setHoveredKey(null);
    setHoveredAdj(null);
    endStroke();
    resetStroke();
  };

  // ====== Folhas (cubo + planos com vento) ======
  if (isLeaves(type)) {
    const t = getBlockTextures();
    const leafMap =
      type === 'oak_leaves' ? t.oakLeaves :
      type === 'spruce_leaves' ? t.spruceLeaves : t.birchLeaves;

    const leavesDensity = useWorld((s) => s.leavesDensity);
    const leavesScale = useWorld((s) => s.leavesScale);

    const rotations =
      foliageMode === 'cross3' ? [0, Math.PI / 3, -Math.PI / 3] :
      foliageMode === 'cross2' ? [0, Math.PI / 2] : [];

    const cubeMat = React.useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          map: leafMap,
          transparent: true,
          alphaTest: 0.25,
          alphaToCoverage: true,
          side: THREE.DoubleSide,
          roughness: 1,
          metalness: 0,
          depthWrite: true,
          opacity: leavesDensity,
        }),
      [leafMap, leavesDensity]
    );

    const windyMatRef = useWindyLeafMaterial(leafMap, {
      enabled: useWorld.getState().windEnabled,
      strength: useWorld.getState().windStrength,
      speed: useWorld.getState().windSpeed,
    });

    return (
      <group
        position={pos}
        onPointerOver={() => setHoveredKey(idKey)}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* cubo base */}
        <mesh castShadow receiveShadow material={cubeMat}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>

        {/* planos com vento */}
        {rotations.map((r, i) => (
          <mesh key={i} rotation={[0, r, 0]} material={windyMatRef.current} renderOrder={1}>
            <planeGeometry args={[leavesScale, leavesScale, 1, 1]} />
          </mesh>
        ))}
      </group>
    );
  }

  // ====== Demais blocos (cubo) ======
  const material = React.useMemo(() => getMaterialFor(type), [type]);

  return (
    <mesh
      position={pos}
      onPointerOver={() => setHoveredKey(idKey)}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      {Array.isArray(material)
        ? material.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)
        : <primitive object={material} attach="material" />}
    </mesh>
  );
}
