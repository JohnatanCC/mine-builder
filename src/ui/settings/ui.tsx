// src/ui/settings/ui.tsx
import * as React from "react";
import { colors, rowStyle, badgeStyle } from "./theme";
import './slider.css'

export function Toggle({
    checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 10px", borderRadius: 8,
                border: `1px solid ${checked ? colors.accent : colors.borderDark}`,
                background: checked
                    ? `linear-gradient(180deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`
                    : `linear-gradient(180deg, #1e1e1e 0%, #141414 100%)`,
                color: checked ? "#0b1f0f" : colors.textDim,
                cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4,
            }}
            title={label}
        >
            <span
                style={{
                    width: 14, height: 14, borderRadius: 3,
                    background: checked ? "#eaffea" : "#444",
                    border: `1px solid ${checked ? "#b9f1bf" : "#333"}`,
                    boxShadow: checked ? "inset 0 0 0 2px #2a7a3f" : "none",
                }}
            />
            {label}
        </button>
    );
}

// src/ui/settings/ui.tsx (apenas ajuste do Select)
export function Select<T extends string>({
  value, onChange, options, title,
}: {
  value: T; onChange: (v: T) => void;
  options: { value: T; label: string }[]; title?: string;
}) {
  return (
    <div style={{ position: "relative", width: "100%" }} title={title}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          padding: "8px 30px 8px 10px",
          borderRadius: 8,
          border: `1px solid ${colors.borderDark}`,
          background: `linear-gradient(180deg, #1f1f1f 0%, #151515 100%)`,
          color: colors.text,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            style={{
              background: colors.panel,
              color: colors.text,
              fontWeight: 600,
              textTransform: "uppercase",
              padding: "6px 10px",
            }}
          >
            {o.label}
          </option>
        ))}
      </select>
      <div
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          fontSize: 10,
          opacity: 0.8,
        }}
      >
        ▼
      </div>
    </div>
  );
}


export function Slider({
  min, max, step, value, onChange, label, fmt = (n) => `${n}`, disabled,
}: {
  min: number; max: number; step: number;
  value: number; onChange: (n: number) => void;
  label: string; fmt?: (n: number) => string; disabled?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 6, opacity: disabled ? 0.5 : 1 }}>
      <div style={rowStyle}>
        <span>{label}</span>
        <span style={badgeStyle}>{fmt(value)}</span>
      </div>
      <input
        className="mb-range"     // 👈 aplica estilo do slider
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: "100%",
          cursor: disabled ? "not-allowed" : "pointer",
          /* deixamos o background para o CSS cuidar */
        }}
      />
    </div>
  );
}

export function Row({ label, children }: React.PropsWithChildren<{ label: string }>) {
    return (
        <div style={rowStyle}>
            <span>{label}</span>
            <div style={{ minWidth: 120 }}>{children}</div>
        </div>
    );
}
