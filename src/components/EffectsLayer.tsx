import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorld } from "../state/world.store";
import { getMaterialFor } from "../core/materials";
import type { BlockType } from "../core/types";

function cloneMaterialDeep(mat: THREE.Material | THREE.Material[]) {
    if (Array.isArray(mat)) return mat.map((m) => m.clone());
    return mat.clone();
}

export function EffectsLayer() {
    const effects = useWorld((s) => s.effects);
    const gcEffects = useWorld((s) => s.gcEffects);

    useFrame(() => {
        gcEffects();
    });

    return (
        <>
            {effects.map((e) => (
                <RemoveBurst key={e.id} type={e.type} pos={e.pos} t0={e.t0} duration={e.duration} />
            ))}
        </>
    );
}

function easeOutQuad(x: number) {
    return 1 - (1 - x) * (1 - x);
}

function RemoveBurst({
    pos,
    type,
    t0,
    duration,
}: {
    pos: [number, number, number];
    type: BlockType;
    t0: number;
    duration: number;
}) {
    const materialRef = React.useRef<THREE.Material | THREE.Material[] | null>(null);
    const meshRef = React.useRef<THREE.Mesh>(null!);

    if (!materialRef.current) {
        const base = getMaterialFor(type);
        const cloned = cloneMaterialDeep(base);
        // garante transparência controlável
        const setTransp = (m: THREE.Material) => {
            const ms = m as THREE.MeshStandardMaterial;
            ms.transparent = true;
            ms.opacity = 1;
            ms.depthWrite = true;
        };
        if (Array.isArray(cloned)) cloned.forEach(setTransp);
        else setTransp(cloned as THREE.MeshStandardMaterial);
        materialRef.current = cloned;
    }

    useFrame(() => {
        const now = performance.now();
        const t = Math.min(1, (now - t0) / duration);
        const k = 1 - easeOutQuad(t); // 1→0
        if (meshRef.current) {
            meshRef.current.scale.setScalar(0.2 + 0.8 * k); // 1→0
        }
        const setOpacity = (m: THREE.Material) => {
            const ms = m as THREE.MeshStandardMaterial;
            ms.opacity = k;
        };
        if (Array.isArray(materialRef.current)) materialRef.current.forEach(setOpacity);
        else setOpacity(materialRef.current as THREE.MeshStandardMaterial);
    });

    return (
        <mesh ref={meshRef} position={pos} material={materialRef.current as any}>
            <boxGeometry args={[1, 1, 1]} />
        </mesh>
    );
}
