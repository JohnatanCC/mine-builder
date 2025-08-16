// src/ui/settings/TerrainSection.tsx
import * as React from "react";
import { useWorld } from "../../state/world.store";
import { groupStyle, titleStyle, badgeStyle } from "./theme";
import { Row, Slider } from "./ui";

export function TerrainSection() {
  const buildSize = useWorld(s => s.buildSize);
  const setBuildSize = useWorld(s => s.setBuildSize);

  // estado local para pré-visualizar sem aplicar de cara
  const [pending, setPending] = React.useState(buildSize);
  React.useEffect(() => setPending(buildSize), [buildSize]);

  return (
    <div style={groupStyle}>
      <div style={titleStyle}>Terreno</div>

      <Row label="Tamanho (N×N)">
        <span style={badgeStyle}>{buildSize}×{buildSize}</span>
      </Row>

      <Slider
        label="Pré-visualizar"
        min={8}     
        max={24}
        step={1}
        value={pending}
       onChange={(n) => setPending(Math.round(n))}
        fmt={(n) => `${n}×${n}`}
      />

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={() => setPending(buildSize)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #2b2b2b",
            background: "linear-gradient(180deg,#1f1f1f 0%,#151515 100%)",
            color: "#e8e8e8",
            cursor: "pointer",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Reset
        </button>

        <button
          onClick={() => setBuildSize(pending)}
          disabled={pending === buildSize}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #2a7a3f",
            background: "linear-gradient(180deg,#3aa655 0%,#2a7a3f 100%)",
            color: "#0b1f0f",
            cursor: pending === buildSize ? "not-allowed" : "pointer",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            opacity: pending === buildSize ? 0.6 : 1,
          }}
          title={pending === buildSize ? "Nada para aplicar" : `Aplicar ${pending}×${pending}`}
        >
          Aplicar {pending}×{pending}
        </button>
      </div>
    </div>
  );
}
