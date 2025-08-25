import * as React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useWorld } from "../state/world.store";
import { BUILD_AREA_SIZE, ENV_PRESETS } from "@/core/constants";

const CENTER = new THREE.Vector3(BUILD_AREA_SIZE / 2, 0, BUILD_AREA_SIZE / 2);

export function Lights() {
  // Ambiente (dia/tarde/noite)
  const env = useWorld((s) => s.envPreset);
  const preset = ENV_PRESETS[env];

  // Render preset (desempenho/qualidade)
  const render = useWorld((s) => s.renderSettings); // { shadows, shadowMapSize, ... }

  const dirRef = React.useRef<THREE.DirectionalLight>(null!);
  const targetRef = React.useRef<THREE.Object3D>(new THREE.Object3D());

  const { scene, gl } = useThree();

  // Config inicial e sempre que preset de render mudar
  const setup = React.useCallback(() => {
    const light = dirRef.current;
    if (!light) return;

    // adiciona o target na cena se ainda não estiver
    if (!targetRef.current.parent) scene.add(targetRef.current);

    // alvo no centro da arena
    targetRef.current.position.copy(CENTER);
    light.target = targetRef.current;
    light.target.updateMatrixWorld();

    // renderer: liga/desliga sombras globalmente + tipo
    gl.shadowMap.enabled = !!render.shadows;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;

    // câmera de sombra cobrindo a arena
    const cam = light.shadow.camera as THREE.OrthographicCamera;
    const d = BUILD_AREA_SIZE / 2 + 6;
    cam.left = -d; cam.right = d; cam.top = d; cam.bottom = -d;
    cam.near = 1; cam.far = BUILD_AREA_SIZE * 3;
    cam.updateProjectionMatrix();

    // qualidade das sombras conforme preset
    light.castShadow = !!render.shadows;
    light.shadow.mapSize.set(render.shadowMapSize, render.shadowMapSize);
    light.shadow.bias = -0.00015;
    light.shadow.normalBias = 0.03;
    light.shadow.needsUpdate = true;
  }, [scene, gl, render.shadows, render.shadowMapSize]);

  React.useLayoutEffect(() => {
    setup();
  }, [setup]);

  // Aplica o preset de ambiente (posição/cor/intensidade da luz direcional)
  React.useEffect(() => {
    const light = dirRef.current;
    if (!light) return;

    const [rx, ry, rz] = preset.dirPosition;
    light.position.set(
      CENTER.x + BUILD_AREA_SIZE * rx,
      CENTER.y + BUILD_AREA_SIZE * ry,
      CENTER.z + BUILD_AREA_SIZE * rz
    );
    light.color.set(preset.dirColor);
    light.intensity = preset.dirIntensity;

    // garante o target no centro
    light.target.position.copy(CENTER);
    light.target.updateMatrixWorld();
  }, [preset]);

  return (
    <>
      <ambientLight intensity={preset.ambient} color="#ffffff" />
      <hemisphereLight
        intensity={preset.hemi}
        color={preset.hemiSky}
        groundColor={preset.hemiGround}
      />
      <primitive object={targetRef.current} />
      {/* castShadow controlado também no setup; manter aqui ajuda a refletir trocas imediatas */}
      <directionalLight ref={dirRef} castShadow={render.shadows} />
    </>
  );
}
