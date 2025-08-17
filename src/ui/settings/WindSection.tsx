// src/ui/settings/WindSection.tsx
import { useWorld } from "../../state/world.store";
import { groupStyle, titleStyle } from "./theme";
import { Row, Toggle, Slider } from "./ui";

export function WindSection() {
  const windEnabled = useWorld((s) => s.windEnabled);
  const setWindEnabled = useWorld((s) => s.setWindEnabled);
  const windStrength = useWorld((s) => s.windStrength);
  const setWindStrength = useWorld((s) => s.setWindStrength);
  const windSpeed = useWorld((s) => s.windSpeed);
  const setWindSpeed = useWorld((s) => s.setWindSpeed);

  return (
    <div style={groupStyle}>
      <div style={titleStyle}>Vento</div>
      <Row label="Habilitar">
        <Toggle checked={windEnabled} onChange={setWindEnabled} label={windEnabled ? "ON" : "OFF"} />
      </Row>
      <Slider label="Força" min={0} max={2} step={0.05}
        value={windStrength} onChange={setWindStrength} fmt={(n) => n.toFixed(2)} disabled={!windEnabled} />
      <Slider label="Velocidade" min={0} max={2} step={0.05}
        value={windSpeed} onChange={setWindSpeed} fmt={(n) => n.toFixed(2)} disabled={!windEnabled} />
    </div>
  );
}
