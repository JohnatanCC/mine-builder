// src/core/leafMaterial.ts
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useWorld } from '../state/world.store';

type WindOpts = {
  enabled?: boolean;
  strength?: number;
  speed?: number;
};

export function useWindyLeafMaterial(
  map: THREE.Texture,
  opts?: WindOpts
) {
  // fallback para o store se opts não vier
  const enabledFromStore  = useWorld(s => s.windEnabled);
  const strengthFromStore = useWorld(s => s.windStrength);
  const speedFromStore    = useWorld(s => s.windSpeed);

  const matRef = useRef(
    new THREE.MeshStandardMaterial({
      map,
      transparent: true,
      alphaTest: 0.25,
      alphaToCoverage: true,
      side: THREE.DoubleSide,
      roughness: 1,
      metalness: 0,
      depthWrite: true,
    })
  );

  useEffect(() => {
    const mat: any = matRef.current;
    mat.onBeforeCompile = (shader: any) => {
      shader.uniforms.uTime        = { value: 0 };
      shader.uniforms.uWindEnabled = { value: 0 };
      shader.uniforms.uStrength    = { value: 0.35 };
      shader.uniforms.uSpeed       = { value: 0.6 };

      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `
          #include <common>
          uniform float uTime, uStrength, uSpeed, uWindEnabled;
        `)
        .replace('#include <begin_vertex>', `
          #include <begin_vertex>
          float mask = pow(uv.y, 1.5);
          float phase = position.x * 2.1 + position.z * 1.7;
          float w = uStrength * (0.5 + 0.5 * sin(phase + uTime * (0.5 + uSpeed)));
          vec2 dir = normalize(vec2(0.8, 0.6));
          transformed.x += uWindEnabled * mask * w * 0.20 * dir.x;
          transformed.z += uWindEnabled * mask * w * 0.20 * dir.y;
        `);
      (mat.userData as any).shader = shader;
    };
    mat.needsUpdate = true;
  }, [map]);

  useFrame(({ clock }) => {
    const shader = (matRef.current as any).userData?.shader;
    if (!shader) return;
    const enabled  = opts?.enabled  ?? enabledFromStore  ? 1 : 0;
    const strength = opts?.strength ?? strengthFromStore;
    const speed    = opts?.speed    ?? speedFromStore;
    shader.uniforms.uTime.value        = clock.elapsedTime;
    shader.uniforms.uWindEnabled.value = enabled;
    shader.uniforms.uStrength.value    = strength;
    shader.uniforms.uSpeed.value       = speed;
  });

  return matRef as React.MutableRefObject<THREE.MeshStandardMaterial>;
}
