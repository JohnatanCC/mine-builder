import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorld } from "../state/world.store";
import { getMaterialFor } from "../core/materials";
import type { BlockType } from "../core/types";

/** Clona material(ais) e garante flags de transparência controláveis */
function cloneAndPrepareMaterial(mat: THREE.Material | THREE.Material[]) {
    const prep = (m: THREE.Material) => {
        const ms = m as THREE.MeshStandardMaterial;
        ms.transparent = true;
        ms.opacity = 1;
        ms.depthWrite = true; // mantém profundidade, evita ver "através" do burst
        return ms;
    };

    if (Array.isArray(mat)) return mat.map((m) => prep(m.clone()));
    return prep(mat.clone());
}

/** Dispose seguro para material(ais) clonados */
function disposeMaterialDeep(mat: THREE.Material | THREE.Material[] | null) {
    if (!mat) return;
    if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
    } else {
        mat.dispose();
    }
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
                <RemoveBurst
                    key={e.id}
                    type={e.type}
                    pos={e.pos}
                    t0={e.t0}
                    duration={e.duration}
                />
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
    const meshRef = React.useRef<THREE.Mesh>(null!);

    // Cria os materiais clonados UMA vez por burst
    const material = React.useMemo(() => {
        const base = getMaterialFor(type);
        return cloneAndPrepareMaterial(base);
    }, [type]);

    // Dispose no unmount → evita vazamento de materiais clonados
    React.useEffect(() => {
        return () => disposeMaterialDeep(material);
    }, [material]);

    // Anima scale/opacity no intervalo [t0, t0+duration]
    useFrame(() => {
        const now = performance.now();
        const t = Math.min(1, (now - t0) / duration); // 0..1
        const k = 1 - easeOutQuad(t); // 1→0

        if (meshRef.current) {
            meshRef.current.scale.setScalar(0.2 + 0.8 * k);
        }

        const setOpacity = (m: THREE.Material) => {
            (m as THREE.MeshStandardMaterial).opacity = k;
        };
        if (Array.isArray(material)) material.forEach(setOpacity);
        else setOpacity(material);
    });

    return (
        <mesh ref={meshRef} position={pos} material={material as any}>
            <boxGeometry args={[1, 1, 1]} />
        </mesh>
    );
}
