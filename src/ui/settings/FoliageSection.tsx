// src/ui/settings/FoliageSection.tsx
import { useWorld } from "../../state/world.store";
import { groupStyle, titleStyle } from "./theme";
import { Row, Select, Slider } from "./ui";

export function FoliageSection() {
  const foliageMode = useWorld((s) => s.foliageMode);
  const setFoliageMode = useWorld((s) => s.setFoliageMode);
  const leavesDensity = useWorld((s) => s.leavesDensity);
  const setLeavesDensity = useWorld((s) => s.setLeavesDensity);
  const leavesScale = useWorld((s) => s.leavesScale);
  const setLeavesScale = useWorld((s) => s.setLeavesScale);

  return (
    <div style={groupStyle}>
      <div style={titleStyle}>Folhagem</div>
      <Row label="Modo">
        <Select
          value={foliageMode}
          onChange={(v) => setFoliageMode(v as "block" | "cross2" | "cross3")}
          options={[
            { value: "block", label: "Cubo" },
            { value: "cross2", label: "Cruz 2" },
            { value: "cross3", label: "Cruz 3" },
          ]}
        />
      </Row>
      <Slider label="Densidade" min={0.1} max={1} step={0.05}
        value={leavesDensity} onChange={setLeavesDensity} fmt={(n) => n.toFixed(2)} />
      <Slider label="Escala" min={0.5} max={2} step={0.05}
        value={leavesScale} onChange={setLeavesScale} fmt={(n) => n.toFixed(2)} />
    </div>
  );
}
