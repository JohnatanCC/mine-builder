// src/ui/settings/FogSection.tsx
import { useWorld } from "../../state/world.store";
import { groupStyle, titleStyle } from "./theme";
import { Row, Toggle, Slider } from "./ui";

export function FogSection() {
  const fogEnabled = useWorld((s) => s.fogEnabled);
  const setFogEnabled = useWorld((s) => s.setFogEnabled);
  const fogDensity = useWorld((s) => s.fogDensity);
  const setFogDensity = useWorld((s) => s.setFogDensity);

  return (
    <div style={groupStyle}>
      <div style={titleStyle}>Neblina (Fog)</div>
      <Row label="Ativar fog">
        <Toggle checked={fogEnabled} onChange={setFogEnabled} label={fogEnabled ? "ON" : "OFF"} />
      </Row>
      <Slider label="Densidade" min={0.0} max={0.06} step={0.001}
        value={fogDensity} onChange={setFogDensity} fmt={(n) => n.toFixed(3)} disabled={!fogEnabled} />
    </div>
  );
}
