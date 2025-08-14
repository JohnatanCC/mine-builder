import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useWorld } from '../state/world.store';

export function Lights() {
  const animate = useWorld(s => s.lightAnimate);
  const speed = useWorld(s => s.lightSpeed);
  const intensity = useWorld(s => s.lightIntensity);
  const dir = React.useRef<THREE.DirectionalLight>(null!);
  const angle = React.useRef(0);

  React.useEffect(() => {
    if (!dir.current) return;
    const d = 40;
    const cam = dir.current.shadow.camera as THREE.OrthographicCamera;
    cam.left = -d; cam.right = d; cam.top = d; cam.bottom = -d;
    cam.near = 1; cam.far = 120;
    cam.updateProjectionMatrix();
    dir.current.shadow.mapSize.set(2048, 2048);
    dir.current.shadow.bias = -0.0002;
    dir.current.shadow.normalBias = 0.02;
  }, []);

  useFrame((_, delta) => {
    if (!dir.current) return;
    dir.current.intensity = intensity;
    if (!animate) return;
    angle.current += delta * speed;
    const r = 20, y = 14;
    dir.current.position.set(Math.cos(angle.current) * r, y, Math.sin(angle.current) * r);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight ref={dir} position={[12,14,10]} castShadow />
    </>
  );
}
