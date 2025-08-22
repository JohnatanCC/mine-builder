// UPDATE: src/components/Lights.tsx
import * as React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useWorld } from "../state/world.store";
import { BUILD_AREA_SIZE } from "@/core/constants";
import { ENV_PRESETS } from "@/core/constants";

const CENTER = new THREE.Vector3(BUILD_AREA_SIZE / 2, 0, BUILD_AREA_SIZE / 2);

export function Lights() {
  const env = useWorld(s => s.envPreset);
  const preset = ENV_PRESETS[env];

  const dirRef = React.useRef<THREE.DirectionalLight>(null!);
  const targetRef = React.useRef<THREE.Object3D>(new THREE.Object3D());
  const { scene } = useThree();

  const setup = React.useCallback(() => {
    const light = dirRef.current;
    if (!light) return;
    if (!targetRef.current.parent) scene.add(targetRef.current);

    // posiciona alvo
    targetRef.current.position.copy(CENTER);
    light.target = targetRef.current;
    light.target.updateMatrixWorld();

    // frustum sempre cobrindo a arena
    const cam = light.shadow.camera as THREE.OrthographicCamera;
    const d = BUILD_AREA_SIZE / 2 + 6;
    cam.left = -d; cam.right = d; cam.top = d; cam.bottom = -d;
    cam.near = 1; cam.far = BUILD_AREA_SIZE * 3;
    cam.updateProjectionMatrix();

    light.shadow.mapSize.set(2048, 2048);
    light.shadow.bias = -0.00015;
    light.shadow.normalBias = 0.03;
    light.shadow.needsUpdate = true;
  }, [scene]);

  React.useLayoutEffect(() => { setup(); }, [setup]);

  // aplica preset a cada troca (estático; sem sliders)
  React.useEffect(() => {
    const light = dirRef.current;
    if (!light) return;
    const [rx, ry, rz] = preset.dirPosition;
    light.position.set(CENTER.x + BUILD_AREA_SIZE * rx,
                       CENTER.y + BUILD_AREA_SIZE * ry,
                       CENTER.z + BUILD_AREA_SIZE * rz);
    light.color.set(preset.dirColor);
    light.intensity = preset.dirIntensity;
    light.target.position.copy(CENTER);
    light.target.updateMatrixWorld();
  }, [preset]);

  return (
    <>
      <ambientLight intensity={preset.ambient} color="#ffffff" />
      <hemisphereLight intensity={preset.hemi} color={preset.hemiSky} groundColor={preset.hemiGround} />
      <primitive object={targetRef.current} />
      <directionalLight ref={dirRef} castShadow />
    </>
  );
}
