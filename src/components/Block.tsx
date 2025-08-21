// UPDATE: src/components/Block.tsx
import * as THREE from 'three';
import * as React from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { getMaterialFor } from '../core/materials';
import { key } from '../core/keys';
import type { BlockType, Pos } from '../core/types';
import { useWorld } from '../state/world.store';
import { useClickGuard } from '../systems/input/useClickGuard';
import { easeOutBack } from '../state/utils/blockanim';
import { getBlockMaterialsCached } from '@/systems/textures/blockTextures';

export function Block({ pos, type }: { pos: Pos; type: BlockType }) {
  const setBlock = useWorld((s) => s.setBlock);
  const removeBlock = useWorld((s) => s.removeBlock);
  const hasBlock = useWorld((s) => s.hasBlock);

  const current = useWorld((s) => s.current);
  const setCurrent = useWorld((s) => s.setCurrent); // conta-gotas

  const setHoveredKey = useWorld((s) => s.setHoveredKey);
  const setHoveredAdj = useWorld((s) => s.setHoveredAdj);

  const beginStroke = useWorld((s) => s.beginStroke);
  const endStroke   = useWorld((s) => s.endStroke);

  // animações v0.1.1
  const blockAnimEnabled   = useWorld((s) => s.blockAnimEnabled);
  const blockAnimDuration  = useWorld((s) => s.blockAnimDuration);
  const blockAnimBounce    = useWorld((s) => s.blockAnimBounce);
  const addRemoveEffect    = useWorld((s) => s.addRemoveEffect);

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
    if (useWorld.getState().blockAnimEnabled) {
      addRemoveEffect(pos, type, useWorld.getState().blockAnimDuration);
    }
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

    setDown(e);

    if (isEyedrop(e)) {
      native.preventDefault?.();
      setCurrent(type);
      resetStroke();
      return;
    }

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
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    const adj = computeAdjacentPos(e);
    setHoveredAdj(adj);

    const native = e.nativeEvent as PointerEvent;
    const ctrl = native.ctrlKey || useWorld.getState().isCtrlDown;
    const btns = native.buttons;

    if (!ctrl) return;

    if ((btns & 3) && !useWorld.getState().currentStroke) beginStroke();
    if (btns & 2) { tryDeleteHere(); return; }
    if (btns & 1) { tryPlaceAt(adj); }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    const native = e.nativeEvent as PointerEvent;
    const ctrl = native.ctrlKey || useWorld.getState().isCtrlDown;

    if (ctrl) {
      endStroke();
      resetStroke();
      return;
    }

    if (!isClick(e) || !canFire()) { resetStroke(); return; }

    const button = getButton();
    if (button === 2) {
      tryDeleteHere();
    } else if (button === 0) {
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

  // ====== ANIMAÇÃO DE ENTRADA (v0.1.1) ======
  const grpRef = React.useRef<THREE.Group>(null!);
  const t0Ref = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!blockAnimEnabled) return;
    t0Ref.current = performance.now();
    if (grpRef.current) grpRef.current.scale.setScalar(0.01);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    if (!blockAnimEnabled) return;
    if (t0Ref.current === null) return;
    const now = performance.now();
    const t = Math.min(1, (now - t0Ref.current) / blockAnimDuration);
    const k = easeOutBack(t, blockAnimBounce);
    const s = 0.01 + 0.99 * k;
    if (grpRef.current) grpRef.current.scale.setScalar(s);
  });

  // ====== Demais blocos (cubo) ======
  const fallbackMaterial = React.useMemo(() => getMaterialFor(type), [type]);

  const [faceMaterials, setFaceMaterials] = React.useState<THREE.Material[] | null>(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mats = await getBlockMaterialsCached(type); // /blocks/<type>
        if (alive) setFaceMaterials(mats);
      } catch {
        if (alive) setFaceMaterials(null);
      }
    })();
    return () => { alive = false; setFaceMaterials(null); };
  }, [type]);

  // 🔧 Pós-processamento de materiais para tipos translúcidos
  const materialToUse = React.useMemo(() => {
    const tune = (m: THREE.Material) => {
      if (type === 'glass') {
        (m as any).transparent = true;
        (m as any).opacity = 0.86;
        (m as any).depthWrite = false; // evita flicker entre faces transparentes
        return;
      }
      if (type === 'oak_leaves' || type === 'spruce_leaves' || type === 'birch_leaves') {
        (m as any).transparent = true;
        (m as any).alphaTest = 0.25; // recorte “dura” para folhas
        (m as any).depthWrite = true;
        (m as any).alphaToCoverage = true; // se MSAA, melhora bordas
        (m as any).side = THREE.DoubleSide;
      }
    };

    const base = faceMaterials ?? fallbackMaterial;
    if (Array.isArray(base)) {
      base.forEach(tune);
      return base;
    }
    tune(base as THREE.Material);
    return base;
  }, [faceMaterials, fallbackMaterial, type]);

  return (
    <group
      ref={grpRef}
      position={pos}
      onPointerOver={() => setHoveredKey(idKey)}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        {Array.isArray(materialToUse)
          ? materialToUse.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)
          : <primitive object={materialToUse as THREE.Material} attach="material" />}
      </mesh>
    </group>
  );
}
