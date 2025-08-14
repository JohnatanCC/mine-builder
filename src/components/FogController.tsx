import { useWorld } from "../state/world.store";

export function FogController() {
  const fogEnabled = useWorld(s => s.fogEnabled);
  const fogDensity = useWorld(s => s.fogDensity);

  return fogEnabled ? (
    <fogExp2 attach="fog" args={["#d0e0ff", fogDensity]} />
  ) : null;
}
