// src/ui/SettingsPanel.tsx
import * as React from "react";
import { useWorld } from "../state/world.store";
import { Section } from "./Section";

/** ========= Estilos "Minecraft-like" (inline, sem libs) ========= */
const px = (n: number) => `${n}px`;

const colors = {
  bg: "#111",          // fundo geral
  panel: "#1a1a1a",    // cartão
  panelAlt: "#141414",
  borderLight: "#cacaca",
  borderDark: "#2b2b2b",
  accent: "#3aa655",   // verde "minecraft"
  accentDark: "#2a7a3f",
  text: "#e8e8e8",
  textDim: "#cfcfcf",
  track: "#2a2a2a",
};

const cardStyle: React.CSSProperties = {
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
    repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 6px, rgba(0,0,0,0.03) 6px 12px)
  `,
  borderRadius: 10,
  boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
  border: `2px solid ${colors.borderDark}`,
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  padding: "10px 12px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0) 100%)",
  borderBottom: `1px solid ${colors.borderDark}`,
  fontWeight: 800,
  letterSpacing: 0.5,
  textTransform: "uppercase",
};

const bodyStyle: React.CSSProperties = {
  padding: 12,
  display: "grid",
  gap: 12,
  maxHeight: "90vh",
  overflowY: "auto",
};

const groupStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  padding: 10,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.05) 100%)",
  borderRadius: 8,
  border: `1px solid ${colors.borderDark}`,
};

const titleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: colors.text,
  opacity: 0.95,
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};

const badgeStyle: React.CSSProperties = {
  fontFamily: "monospace",
  padding: "2px 6px",
  borderRadius: 6,
  border: `1px solid ${colors.borderDark}`,
  background: colors.track,
  color: colors.text,
  fontSize: 12,
};

/** Botão toggle estilizado */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 8,
        border: `1px solid ${checked ? colors.accent : colors.borderDark}`,
        background: checked
          ? `linear-gradient(180deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`
          : `linear-gradient(180deg, #1e1e1e 0%, #141414 100%)`,
        color: checked ? "#0b1f0f" : colors.textDim,
        cursor: "pointer",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
      title={label}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          background: checked ? "#eaffea" : "#444",
          border: `1px solid ${checked ? "#b9f1bf" : "#333"}`,
          boxShadow: checked ? "inset 0 0 0 2px #2a7a3f" : "none",
        }}
      />
      {label}
    </button>
  );
}

/** Select estilizado */
function Select<T extends string>({
  value,
  onChange,
  options,
  title,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  title?: string;
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
          <option key={o.value} value={o.value}>
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

/** Slider com cabeçalho e valor em monospace */
function Slider({
  min,
  max,
  step,
  value,
  onChange,
  label,
  fmt = (n) => `${n}`,
  disabled,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  label: string;
  fmt?: (n: number) => string;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 6, opacity: disabled ? 0.5 : 1 }}>
      <div style={rowStyle}>
        <span>{label}</span>
        <span style={badgeStyle}>{fmt(value)}</span>
      </div>
      <input
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
          accentColor: colors.accent,
          background: colors.track,
          borderRadius: 6,
          height: 6,
        }}
      />
    </div>
  );
}

/** Linha simples com label à esquerda e controle à direita */
function Row({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) {
  return (
    <div style={rowStyle}>
      <span>{label}</span>
      <div style={{ minWidth: 120 }}>{children}</div>
    </div>
  );
}

/** ========= Painel ========= */
export function SettingsPanel() {
  const showWire = useWorld((s) => s.showWire);
  const setShowWire = useWorld((s) => s.setShowWire);

  const highlightColor = useWorld((s) => s.highlightColor);
  const setHighlightColor = useWorld((s) => s.setHighlightColor);

  const lightAnimate = useWorld((s) => s.lightAnimate);
  const setLightAnimate = useWorld((s) => s.setLightAnimate);
  const lightSpeed = useWorld((s) => s.lightSpeed);
  const setLightSpeed = useWorld((s) => s.setLightSpeed);
  const lightIntensity = useWorld((s) => s.lightIntensity);
  const setLightIntensity = useWorld((s) => s.setLightIntensity);

  const foliageMode = useWorld((s) => s.foliageMode);
  const setFoliageMode = useWorld((s) => s.setFoliageMode);

  const leavesDensity = useWorld((s) => s.leavesDensity);
  const setLeavesDensity = useWorld((s) => s.setLeavesDensity);
  const leavesScale = useWorld((s) => s.leavesScale);
  const setLeavesScale = useWorld((s) => s.setLeavesScale);

  const windEnabled = useWorld((s) => s.windEnabled);
  const setWindEnabled = useWorld((s) => s.setWindEnabled);
  const windStrength = useWorld((s) => s.windStrength);
  const setWindStrength = useWorld((s) => s.setWindStrength);
  const windSpeed = useWorld((s) => s.windSpeed);
  const setWindSpeed = useWorld((s) => s.setWindSpeed);

  const fogEnabled = useWorld((s) => s.fogEnabled);
  const setFogEnabled = useWorld((s) => s.setFogEnabled);
  const fogDensity = useWorld((s) => s.fogDensity);
  const setFogDensity = useWorld((s) => s.setFogDensity);

  const blockAnimEnabled = useWorld((s) => s.blockAnimEnabled);
  const setBlockAnimEnabled = useWorld((s) => s.setBlockAnimEnabled);
  const blockAnimDuration = useWorld((s) => s.blockAnimDuration);
  const setBlockAnimDuration = useWorld((s) => s.setBlockAnimDuration);
  const blockAnimBounce = useWorld((s) => s.blockAnimBounce);
  const setBlockAnimBounce = useWorld((s) => s.setBlockAnimBounce);

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>Configurações</div>
      <div style={bodyStyle}>
        {/* VISUAL */}
        <div style={groupStyle}>
          <div style={titleStyle}>Visual</div>
          <Row label="Wireframe">
            <Toggle
              checked={showWire}
              onChange={setShowWire}
              label={showWire ? "ON" : "OFF"}
            />
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

        {/* LUZ */}
        <div style={groupStyle}>
          <div style={titleStyle}>Luz</div>
          <Row label="Animar sombra">
            <Toggle
              checked={lightAnimate}
              onChange={setLightAnimate}
              label={lightAnimate ? "ON" : "OFF"}
            />
          </Row>
          <Slider
            label="Velocidade"
            min={0.01}
            max={1}
            step={0.01}
            value={lightSpeed}
            onChange={setLightSpeed}
            fmt={(n) => n.toFixed(2)}
          />
          <Slider
            label="Intensidade"
            min={0.1}
            max={2}
            step={0.1}
            value={lightIntensity}
            onChange={setLightIntensity}
            fmt={(n) => n.toFixed(2)}
          />
        </div>

        {/* FOLHAGEM */}
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
          <Slider
            label="Densidade"
            min={0.1}
            max={1}
            step={0.05}
            value={leavesDensity}
            onChange={setLeavesDensity}
            fmt={(n) => n.toFixed(2)}
          />
          <Slider
            label="Escala"
            min={0.5}
            max={2}
            step={0.05}
            value={leavesScale}
            onChange={setLeavesScale}
            fmt={(n) => n.toFixed(2)}
          />
        </div>

        {/* VENTO */}
        <div style={groupStyle}>
          <div style={titleStyle}>Vento</div>
          <Row label="Habilitar">
            <Toggle
              checked={windEnabled}
              onChange={setWindEnabled}
              label={windEnabled ? "ON" : "OFF"}
            />
          </Row>
          <Slider
            label="Força"
            min={0}
            max={2}
            step={0.05}
            value={windStrength}
            onChange={setWindStrength}
            fmt={(n) => n.toFixed(2)}
            disabled={!windEnabled}
          />
          <Slider
            label="Velocidade"
            min={0}
            max={2}
            step={0.05}
            value={windSpeed}
            onChange={setWindSpeed}
            fmt={(n) => n.toFixed(2)}
            disabled={!windEnabled}
          />
        </div>

        {/* NEBLINA */}
        <div style={groupStyle}>
          <div style={titleStyle}>Neblina (Fog)</div>
          <Row label="Ativar fog">
            <Toggle
              checked={fogEnabled}
              onChange={setFogEnabled}
              label={fogEnabled ? "ON" : "OFF"}
            />
          </Row>
          <Slider
            label="Densidade"
            min={0.0}
            max={0.06}
            step={0.001}
            value={fogDensity}
            onChange={setFogDensity}
            fmt={(n) => n.toFixed(3)}
            disabled={!fogEnabled}
          />
        </div>

        {/* ANIMAÇÃO DE BLOCOS */}
        <div style={groupStyle}>
          <div style={titleStyle}>Animação de Blocos</div>
          <Row label="Ativar">
            <Toggle
              checked={blockAnimEnabled}
              onChange={setBlockAnimEnabled}
              label={blockAnimEnabled ? "ON" : "OFF"}
            />
          </Row>
          <Slider
            label="Duração (ms)"
            min={80}
            max={600}
            step={10}
            value={blockAnimDuration}
            onChange={(n) => setBlockAnimDuration(Math.round(n))}
            fmt={(n) => `${Math.round(n)} ms`}
            disabled={!blockAnimEnabled}
          />
          <Slider
            label="Bounce"
            min={0}
            max={1}
            step={0.01}
            value={blockAnimBounce}
            onChange={setBlockAnimBounce}
            fmt={(n) => n.toFixed(2)}
            disabled={!blockAnimEnabled}
          />
        </div>
      </div>
    </div>
  );
}
