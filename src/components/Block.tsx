// UPDATE: src/components/Block.tsx
import * as THREE from 'three';
import * as React from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { getMaterialFor } from '../core/materials';
import { key } from '../core/keys';
import type { BlockType, Pos, MaterialProperties, BlockVariant, BlockRotation } from '../core/types';
import { useWorld } from '../state/world.store';
import { useClickGuard } from '../systems/input/useClickGuard';
import { getBlockMaterialsCached } from '@/systems/textures/blockTextures';
import { decideAction } from '@/systems/input/placement';
import { ANIM } from '@/core/constants';
import { easeOutCubic, normTime } from '@/core/anim';
import { VariantBlock } from './VariantBlock';

const BRUSH_INTERVAL_MS = 22; // ~45 Hz

// Função helper para aplicar propriedades de material de forma type-safe
function applyMaterialProperties(material: THREE.Material, properties: MaterialProperties): void {
  const mat = material as THREE.Material & MaterialProperties;
  Object.assign(mat, properties);
}

export function Block({ pos, type, variant = "block", rotation = { x: 0, y: 0, z: 0 } }: { 
  pos: Pos; 
  type: BlockType; 
  variant?: BlockVariant;
  rotation?: BlockRotation;
}) {
  const setBlock = useWorld((s) => s.setBlock);
  const removeBlock = useWorld((s) => s.removeBlock);
  const hasBlock = useWorld((s) => s.hasBlock);

  const current = useWorld((s) => s.current);
  const setCurrent = useWorld((s) => s.setCurrent);

  const mode = useWorld((s) => s.mode);
  const isCtrlDown = useWorld((s) => s.isCtrlDown);

  const setHoveredKey = useWorld((s) => s.setHoveredKey);
  const setHoveredAdj = useWorld((s) => s.setHoveredAdj);

  const beginStroke = useWorld((s) => s.beginStroke);
  const endStroke = useWorld((s) => s.endStroke);

  // animações
  const blockAnimEnabled = useWorld((s) => s.blockAnimEnabled);
  const addRemoveEffect = useWorld((s) => s.addRemoveEffect);

  const idKey = React.useMemo(() => key(...pos), [pos]);

  // ===== Helpers de superfície =====
  const faceFromEvent = (e: ThreeEvent<PointerEvent>): THREE.Vector3 | null => {
    const n = e.face?.normal as THREE.Vector3 | undefined;
    if (!n) return null;
    return new THREE.Vector3(Math.sign(Math.round(n.x)), Math.sign(Math.round(n.y)), Math.sign(Math.round(n.z)));
  };

  const computeAdjacentByNormal = (n: THREE.Vector3): Pos => [pos[0] + n.x, pos[1] + n.y, pos[2] + n.z];

  const computeAdjacentFallback = (e: ThreeEvent<PointerEvent>): Pos => {
    const center = new THREE.Vector3(pos[0], pos[1], pos[2]);
    const hit = (e.point as THREE.Vector3).clone();
    const d = hit.sub(center);
    const ax = Math.abs(d.x), ay = Math.abs(d.y), az = Math.abs(d.z);
    if (ax >= ay && ax >= az) return [pos[0] + (d.x >= 0 ? 1 : -1), pos[1], pos[2]];
    if (ay >= ax && ay >= az) return [pos[0], pos[1] + (d.y >= 0 ? 1 : -1), pos[2]];
    return [pos[0], pos[1], pos[2] + (d.z >= 0 ? 1 : -1)];
  };

  const computeAdjacentPos = (e: ThreeEvent<PointerEvent>): Pos => {
    const n = faceFromEvent(e);
    return n ? computeAdjacentByNormal(n) : computeAdjacentFallback(e);
  };

  // ===== Brush state =====
  const strokeVisitedPlace = React.useRef<Set<string>>(new Set());
  const strokeVisitedDelete = React.useRef<Set<string>>(new Set());
  const strokeNormalLock = React.useRef<THREE.Vector3 | null>(null);
  const lastBrushAt = React.useRef(0);

  const resetStroke = () => {
    strokeVisitedPlace.current.clear();
    strokeVisitedDelete.current.clear();
    strokeNormalLock.current = null;
  };

  const tryPlaceAt = (p: Pos) => {
    const k = key(...p);
    if (strokeVisitedPlace.current.has(k)) return;
    if (!hasBlock(p)) {
      setBlock(p, current);
      strokeVisitedPlace.current.add(k);

      // (opcional) se quiser o "ghost" também ao colocar, descomente:
      // if (useWorld.getState().blockAnimEnabled) {
      //   addRemoveEffect(p, current, ANIM.duration);
      // }
    }
  };

  const tryDeleteHere = () => {
    if (strokeVisitedDelete.current.has(idKey)) return;
    if (useWorld.getState().blockAnimEnabled) {

      addRemoveEffect(pos, type, ANIM.duration);
    }
    removeBlock(pos);
    strokeVisitedDelete.current.add(idKey);
  };

  // ==== Conta-gotas ====
  const isEyedrop = (e: ThreeEvent<PointerEvent>) =>
    e.button === 1 || (e.button === 0 && (e.nativeEvent as PointerEvent).altKey);

  // ==== Guarda de clique ====
  const { setDown, isClick, getButton, canFire } = useClickGuard();

  // ===== Handlers =====
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const native = e.nativeEvent as PointerEvent;
    const ctrl = native.ctrlKey || isCtrlDown;

    setDown(e);

    if (isEyedrop(e)) {
      native.preventDefault?.();
      setCurrent(type);
      resetStroke();
      return;
    }

    const button = (e.button === 2 ? 2 : 0) as 0 | 2;
    const action = decideAction({ button, mode, ctrlDown: ctrl });

    if (action === "brush") {
      beginStroke();
      const n = faceFromEvent(e);
      strokeNormalLock.current = n ? n.clone().normalize() : null;

      if (button === 2) {
        tryDeleteHere();
      } else {
        const ok = !strokeNormalLock.current || (!!faceFromEvent(e) && faceFromEvent(e)!.dot(strokeNormalLock.current) > 0.5);
        if (ok) {
          const adj = computeAdjacentPos(e);
          tryPlaceAt(adj);
          setHoveredAdj(adj);
        }
      }
      return;
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const adj = computeAdjacentPos(e);
    setHoveredAdj(adj);

    const native = e.nativeEvent as PointerEvent;
    const ctrl = native.ctrlKey || isCtrlDown;
    const btns = native.buttons;
    const isDragging = (btns & 1) || (btns & 2);
    if (!isDragging) return;

    const button: 0 | 2 = (btns & 2) ? 2 : 0;
    const action = decideAction({ button, mode, ctrlDown: ctrl });
    if (action !== "brush") return;

    const now = performance.now();
    if (now - lastBrushAt.current < BRUSH_INTERVAL_MS) return;
    lastBrushAt.current = now;

    const n = faceFromEvent(e);
    if (strokeNormalLock.current && n && n.dot(strokeNormalLock.current) <= 0.5) return;

    if (!useWorld.getState().currentStroke) beginStroke();
    if (btns & 2) { tryDeleteHere(); return; }
    if (btns & 1) { tryPlaceAt(adj); }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const native = e.nativeEvent as PointerEvent;
    const ctrl = native.ctrlKey || isCtrlDown;

    if (useWorld.getState().currentStroke) {
      endStroke();
      resetStroke();
      return;
    }

    if (!isClick(e) || !canFire()) { resetStroke(); return; }

    const button = getButton(); // 0 | 2
    const action = decideAction({ button: (button === 2 ? 2 : 0) as 0 | 2, mode, ctrlDown: ctrl });

    if (action === "delete") {
      tryDeleteHere();
    } else if (action === "place") {
      const n = faceFromEvent(e);
      if (n && strokeNormalLock.current && n.dot(strokeNormalLock.current) <= 0.5) {
        resetStroke(); return;
      }
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

  // ====== ANIMAÇÃO DE ENTRADA: sutil (padronizada) ======
  const grpRef = React.useRef<THREE.Group>(null!);
  const t0Ref = React.useRef<number | null>(null);
  const baseYRef = React.useRef<number>(pos[1]);

  React.useEffect(() => {
    if (!blockAnimEnabled) return;
    t0Ref.current = performance.now();
    baseYRef.current = pos[1];

    if (grpRef.current) {
      grpRef.current.scale.setScalar(ANIM.place.scaleStart);
      grpRef.current.position.y = baseYRef.current + (ANIM.remove.rise * ANIM.place.riseFactor);
      const r = ANIM.place.rotMax;
      grpRef.current.rotation.set(r, r, r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // apenas no mount

  useFrame(() => {
    if (!blockAnimEnabled) return;
    const t0 = t0Ref.current;
    if (t0 === null) return;

    const lin = normTime(t0, ANIM.duration);
    const t = easeOutCubic(lin);

    if (grpRef.current) {
      // escala: scaleStart → 1
      const s = ANIM.place.scaleStart + (1 - ANIM.place.scaleStart) * t;
      grpRef.current.scale.setScalar(s);

      // rotação: rotMax → 0
      const r = ANIM.place.rotMax * (1 - t);
      grpRef.current.rotation.set(r, r, r);

      // Y: alto → base (fração do rise)
      const y = baseYRef.current + (ANIM.remove.rise * ANIM.place.riseFactor) * (1 - t);
      grpRef.current.position.y = y;

      if (lin >= 1) {
        grpRef.current.scale.setScalar(1);
        grpRef.current.rotation.set(0, 0, 0);
        grpRef.current.position.y = baseYRef.current;
        t0Ref.current = null;
      }
    }
  });
  // ====== Materiais ======
  const fallbackMaterial = React.useMemo(() => getMaterialFor(type), [type]);

  const [faceMaterials, setFaceMaterials] = React.useState<THREE.Material[] | null>(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mats = await getBlockMaterialsCached(type);
        if (alive) setFaceMaterials(mats);
      } catch {
        if (alive) setFaceMaterials(null);
      }
    })();
    return () => { alive = false; setFaceMaterials(null); };
  }, [type]);

  const materialToUse = React.useMemo(() => {
    const tune = (m: THREE.Material) => {
      if (type === 'glass') {
        applyMaterialProperties(m, {
          transparent: true,
          opacity: 0.86,
          depthWrite: false
        });
        return;
      }
      if (type === 'oak_leaves' || type === 'spruce_leaves' || type === 'birch_leaves') {
        applyMaterialProperties(m, {
          transparent: true,
          alphaTest: 0.25,
          depthWrite: true
        });
        const matAny = m as any; // Propriedades específicas do Three.js não tipadas
        matAny.alphaToCoverage = true;
        matAny.side = THREE.DoubleSide;
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
      <VariantBlock 
        variant={variant}
        rotation={rotation}
        materials={materialToUse}
      />
    </group>
  );
}
