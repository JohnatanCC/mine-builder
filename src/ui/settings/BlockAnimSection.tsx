// src/ui/settings/BlockAnimSection.tsx
import { useWorld } from "../../state/world.store";
import { groupStyle, titleStyle } from "./theme";
import { Row, Toggle, Slider } from "./ui";

export function BlockAnimSection() {
  const blockAnimEnabled = useWorld((s) => s.blockAnimEnabled);
  const setBlockAnimEnabled = useWorld((s) => s.setBlockAnimEnabled);
  const blockAnimDuration = useWorld((s) => s.blockAnimDuration);
  const setBlockAnimDuration = useWorld((s) => s.setBlockAnimDuration);
  const blockAnimBounce = useWorld((s) => s.blockAnimBounce);
  const setBlockAnimBounce = useWorld((s) => s.setBlockAnimBounce);

  return (
    <div style={groupStyle}>
      <div style={titleStyle}>Animação de Blocos</div>
      <Row label="Ativar">
        <Toggle checked={blockAnimEnabled} onChange={setBlockAnimEnabled} label={blockAnimEnabled ? "ON" : "OFF"} />
      </Row>
      <Slider
        label="Duração (ms)" min={80} max={600} step={10}
        value={blockAnimDuration} onChange={(n) => setBlockAnimDuration(Math.round(n))}
        fmt={(n) => `${Math.round(n)} ms`} disabled={!blockAnimEnabled}
      />
      <Slider
        label="Bounce" min={0} max={1} step={0.01}
        value={blockAnimBounce} onChange={setBlockAnimBounce}
        fmt={(n) => n.toFixed(2)} disabled={!blockAnimEnabled}
      />
    </div>
  );
}
