// NEW FILE: src/components/SkyDome.tsx  (opcional)
import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Céu em shader simples (gradiente vertical). Renderizado como uma esfera gigante
 * invertida (BackSide). Sem custo quase nenhum e não interfere na luz.
 */
export const SkyDome: React.FC<{
  top?: THREE.ColorRepresentation;
  bottom?: THREE.ColorRepresentation;
  radius?: number;
}> = ({ top = "#7ec8ff", bottom = "#0b0f1a", radius = 200 }) => {
  const matRef = React.useRef<THREE.ShaderMaterial>(null!);

  const uniforms = React.useMemo(
    () => ({
      topColor: { value: new THREE.Color(top) },
      bottomColor: { value: new THREE.Color(bottom) },
      offset: { value: 0.0 },
      exponent: { value: 1.2 }, // 1.0~2.0 = mais suave
    }),
    [top, bottom]
  );

  // (opcional) leeeve variação no tempo para “pulsar” quase imperceptível:
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.uniforms.offset.value = 0.0 + Math.sin(t * 0.05) * 0.01;
    }
  });

  return (
    <mesh scale={[radius, radius, radius]} renderOrder={-100}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPos;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPos;
          void main() {
            float h = normalize(vWorldPos).y;
            float f = pow(max(h + offset, 0.0), exponent);
            vec3 col = mix(bottomColor, topColor, f);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
};
