import { useWorld } from "../state/world.store";
import { Section } from "./Section";

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

  const fogEnabled = useWorld(s => s.fogEnabled);
  const setFogEnabled = useWorld(s => s.setFogEnabled);
  const fogDensity = useWorld(s => s.fogDensity);
  const setFogDensity = useWorld(s => s.setFogDensity);

  return (
    <div
      style={{
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(0,0,0,0.6)",
        padding: "12px",
        borderRadius: "8px",
        width: "220px",
        color: "#fff",
        fontSize: "14px",
        zIndex: 10,
        pointerEvents: "auto",
      }}
    >
      <Section title="Visual">
        <label>
          <input
            type="checkbox"
            checked={showWire}
            onChange={(e) => setShowWire(e.target.checked)}
          />{" "}
          Wireframe
        </label>

        <label>
          Cor do Highlight:
          <select
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value as "white" | "black")}
          >
            <option value="white">Branco</option>
            <option value="black">Preto</option>
          </select>
        </label>
      </Section>

      <Section title="Luz">
        <label>
          <input
            type="checkbox"
            checked={lightAnimate}
            onChange={(e) => setLightAnimate(e.target.checked)}
          />{" "}
          Animar luz
        </label>

        <label>
          Velocidade: {lightSpeed.toFixed(2)}
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={lightSpeed}
            onChange={(e) => setLightSpeed(parseFloat(e.target.value))}
          />
        </label>

        <label>
          Intensidade: {lightIntensity.toFixed(2)}
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
          />
        </label>
      </Section>

      <Section title="Folhagem">
        <label>
          Modo:
          <select
            value={foliageMode}
            onChange={(e) =>
              setFoliageMode(e.target.value as "block" | "cross2" | "cross3")
            }
          >
            <option value="block">Cubo</option>
            <option value="cross2">Cruz 2</option>
            <option value="cross3">Cruz 3</option>
          </select>
        </label>

        <label>
          Densidade: {leavesDensity.toFixed(2)}
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={leavesDensity}
            onChange={(e) => setLeavesDensity(parseFloat(e.target.value))}
          />
        </label>

        <label>
          Escala: {leavesScale.toFixed(2)}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={leavesScale}
            onChange={(e) => setLeavesScale(parseFloat(e.target.value))}
          />
        </label>
      </Section>

      <Section title="Vento">
        <label>
          <input
            type="checkbox"
            checked={windEnabled}
            onChange={(e) => setWindEnabled(e.target.checked)}
          />{" "}
          Habilitar
        </label>

        <label>
          Força: {windStrength.toFixed(2)}
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={windStrength}
            onChange={(e) => setWindStrength(parseFloat(e.target.value))}
          />
        </label>

        <label>
          Velocidade: {windSpeed.toFixed(2)}
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
          />
        </label>
      </Section>

      <Section title="Neblina (Fog)">
        <label style={{ color: '#ddd', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={fogEnabled} onChange={(e) => setFogEnabled(e.target.checked)} />
          Ativar fog
        </label>
        <div style={{ color: '#ddd', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span>Densidade</span>
          <span style={{ fontFamily: 'monospace' }}>{fogDensity.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min={0.0}
          max={0.06}
          step={0.001}
          value={fogDensity}
          onChange={(e) => setFogDensity(parseFloat(e.target.value))}
          disabled={!fogEnabled}
        />
      </Section>

    </div>
  );
}
