// src/ui/settings/theme.ts
export const colors = {
  bg: "#111",
  panel: "#1a1a1a",
  panelAlt: "#141414",
  borderLight: "#cacaca",
  borderDark: "#2b2b2b",
  accent: "#3aa655",
  accentDark: "#2a7a3f",
  text: "#e8e8e8",
  textDim: "#cfcfcf",
  track: "#2a2a2a",
};

export const cardStyle: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: "0",
  maxHeight: "100vh",
  minHeight: "100%",
  width: 280,
  color: colors.text,
  fontSize: 14,
  zIndex: 10,
  pointerEvents: "auto",
  imageRendering: "pixelated" as any,
  background: `
    linear-gradient(180deg, ${colors.panel} 0%, ${colors.panelAlt} 100%),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 6px, rgba(248, 227, 227, 0.03) 6px 12px)
  `,
  borderRadius: 10,
  boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
  border: `2px solid ${colors.borderDark}`,
  overflow: "hidden",
};

export const headerStyle: React.CSSProperties = {
  padding: "10px 12px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0) 100%)",
  borderBottom: `1px solid ${colors.borderDark}`,
  fontWeight: 800,
  letterSpacing: 0.5,
  textTransform: "uppercase",
};

export const bodyStyle: React.CSSProperties = {
  padding: 12,
  display: "grid",
  gap: 12,
  maxHeight: "90vh",
  overflowY: "auto",
};

export const groupStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  padding: 10,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.05) 100%)",
  borderRadius: 8,
  border: `1px solid ${colors.borderDark}`,
};

export const titleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: colors.text,
  opacity: 0.95,
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

export const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};

export const badgeStyle: React.CSSProperties = {
  fontFamily: "monospace",
  padding: "2px 6px",
  borderRadius: 6,
  border: `1px solid ${colors.borderDark}`,
  background: colors.track,
  color: colors.text,
  fontSize: 12,
};
