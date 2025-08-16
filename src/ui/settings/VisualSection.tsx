// src/ui/settings/VisualSection.tsx
import { useWorld } from "../../state/world.store";
import { groupStyle, titleStyle } from "./theme";
import { Row, Toggle, Select } from "./ui";

export function VisualSection() {
  const showWire = useWorld((s) => s.showWire);
  const setShowWire = useWorld((s) => s.setShowWire);
  const highlightColor = useWorld((s) => s.highlightColor);
  const setHighlightColor = useWorld((s) => s.setHighlightColor);

  return (
    <div style={groupStyle}>
      <div style={titleStyle}>Visual</div>
      <Row label="Wireframe">
        <Toggle checked={showWire} onChange={setShowWire} label={showWire ? "ON" : "OFF"} />
      </Row>
      <Row label="Highlight">
        <Select
          value={highlightColor}
          onChange={(v) => setHighlightColor(v as "white" | "black")}
          options={[
            { value: "white", label: "Branco" },
            { value: "black", label: "Preto" },
          ]}
          title="Cor do contorno ao mirar"
        />
      </Row>
    </div>
  );
}
