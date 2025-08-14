import * as React from "react";
import { useWorld } from "../state/world.store";

const colors = {
  panel: "#1a1a1a",
  panelAlt: "#141414",
  border: "#2b2b2b",
  text: "#e8e8e8",
  dim: "#cfcfcf",
  accent: "#3aa655",
  warn: "#ffcc66",
};

const card: React.CSSProperties = {
  position: "absolute",
  right: 300,
  top: 10,
  zIndex: 10,
  pointerEvents: "none",
  color: colors.text,
  fontSize: 12,
  imageRendering: "pixelated" as any,
  background: `
    linear-gradient(180deg, ${colors.panel} 0%, ${colors.panelAlt} 100%),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 6px, rgba(0,0,0,0.03) 6px 12px)
  `,
  borderRadius: 10,
  border: `2px solid ${colors.border}`,
  padding: 10,
   width: 300,
};

const row: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: 8,
  alignItems: "center",
};

const label: React.CSSProperties = {
  textTransform: "uppercase",
  fontWeight: 800,
  letterSpacing: 0.4,
  color: colors.dim,
};

const badge: React.CSSProperties = {
  justifySelf: "end",
  fontFamily: "monospace",
  background: "#262626",
  border: `1px solid ${colors.border}`,
  padding: "2px 6px",
  borderRadius: 6,
};

export function HUDStatus() {
  const mode = useWorld((s) => s.mode);
  const current = useWorld((s) => s.current);
  const isStroke = useWorld((s) => !!s.currentStroke);
  const ctrl = useWorld((s) => s.isCtrlDown);

  return (
    <div style={card}>
      <div style={row}>
        <span style={label}>Modo</span>
        <span style={{ ...badge }}>{mode === "place" ? "PLACE" : "DELETE"}</span>
      </div>
      <div style={row}>
        <span style={label}>Bloco</span>
        <span style={{ ...badge }}>{current}</span>
      </div>
      <div style={row}>
        <span style={label}>Brush</span>
        <span
          style={{
            ...badge,
            color: isStroke ? "#0f0" : "#aaa",
            borderColor: isStroke ? "#2a7a3f" : colors.border,
          }}
        >
          {isStroke ? "ATIVO" : "—"}
        </span>
      </div>
      <div style={row}>
        <span style={label}>Ctrl</span>
        <span
          style={{
            ...badge,
            color: ctrl ? colors.warn : "#aaa",
            borderColor: ctrl ? "#66522a" : colors.border,
          }}
        >
          {ctrl ? "PRESS." : "—"}
        </span>
      </div>
    </div>
  );
}
