// src/ui/settings/LightSection.tsx
import { useWorld } from "../../state/world.store";
import { groupStyle, titleStyle } from "./theme";
import { Row, Toggle, Slider } from "./ui";

export function LightSection() {
  const lightAnimate = useWorld((s) => s.lightAnimate);
  const setLightAnimate = useWorld((s) => s.setLightAnimate);
  const lightSpeed = useWorld((s) => s.lightSpeed);
  const setLightSpeed = useWorld((s) => s.setLightSpeed);
  const lightIntensity = useWorld((s) => s.lightIntensity);
  const setLightIntensity = useWorld((s) => s.setLightIntensity);

  return (
    <div style={groupStyle}>
      <div style={titleStyle}>Luz</div>
      <Row label="Animar sombra">
        <Toggle checked={lightAnimate} onChange={setLightAnimate} label={lightAnimate ? "ON" : "OFF"} />
      </Row>
      <Slider label="Velocidade" min={0.01} max={1} step={0.01}
        value={lightSpeed} onChange={setLightSpeed} fmt={(n) => n.toFixed(2)} />
      <Slider label="Intensidade" min={0.1} max={2} step={0.1}
        value={lightIntensity} onChange={setLightIntensity} fmt={(n) => n.toFixed(2)} />
    </div>
  );
}
