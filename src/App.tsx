// src/App.tsx
import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useWorld } from "./state/world.store";
import { GROUND_SIZE } from "./core/constants";

import { World } from "./components/World";
import { Ground } from "./components/Ground";
import { Highlight } from "./components/Highlight";
import { WireframeAll } from "./components/WireframeAll";
import { Lights } from "./components/Lights";
import FpsMeter from "./ui/FpsMeter";
import { SettingsPanel } from "./ui/SettingsPanel";
import { VersionBadge } from "./ui/VersionBadge";
import { Hotbar } from "./ui/Hotbar";
import { SaveLoadPanel } from "./ui/SaveLoadPanel";
import { GhostPreview } from "./ui/GhostPreview";

// novos
import { ControlsGuide } from "./ui/ControlsGuide";
import { HUDStatus } from "./ui/HUDStatus";
import { FogController } from "./components/FogController";
import { EffectsLayer } from "./components/EffectsLayer";

export default function App() {
  const setCurrent = useWorld((s) => s.setCurrent);
  const isCtrlDown = useWorld((s) => s.isCtrlDown);
  const setCtrlDown = useWorld((s) => s.setCtrlDown);
  const buildSize = useWorld((s) => s.buildSize);

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    useWorld.getState().setMouse(e.clientX, e.clientY);
  };

  // Atalhos de teclado (Undo/Redo, Ajuda, seleção rápida 1..0)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) useWorld.getState().redo(); // Cmd/Ctrl+Shift+Z
        else useWorld.getState().undo();            // Cmd/Ctrl+Z
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        useWorld.getState().redo();                 // Ctrl/Cmd+Y
        return;
      }

      // Seleção rápida 1..0
      switch (e.key) {
        case "1": setCurrent("stone"); return;
        case "2": setCurrent("stone_brick"); return;
        case "3": setCurrent("cobblestone"); return;
        case "4": setCurrent("glass"); return;
        case "5": setCurrent("oak_planks"); return;
        case "6": setCurrent("spruce_planks"); return;
        case "7": setCurrent("birch_planks"); return;
        case "8": setCurrent("oak_log"); return;
        case "9": setCurrent("spruce_log"); return;
        case "0": setCurrent("birch_log"); return;
      }

      // Ajuda (H / ? / Shift+/) e fechar com Esc
      const setShowHelp = useWorld.getState().setShowHelp;
      if (e.key === "h" || e.key === "H" || e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        const cur = useWorld.getState().showHelp;
        setShowHelp(!cur);
        return;
      }
      if (e.key === "Escape" && useWorld.getState().showHelp) {
        e.preventDefault();
        setShowHelp(false);
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCurrent]);

  // Rastreamento do Ctrl — trava a câmera e habilita brush
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") setCtrlDown(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") setCtrlDown(false);
    };
    const onBlur = () => setCtrlDown(false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [setCtrlDown]);

  return (
    <div
      style={{ width: "100vw", height: "100vh", position: "relative" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* UI sobre o Canvas */}
      <SettingsPanel />
      <FpsMeter />
      <VersionBadge />
      <Hotbar />
      <SaveLoadPanel />
      <ControlsGuide />
      <HUDStatus />

      {/* Cena 3D */}
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [10, 12, 14], fov: 50 }}
        onPointerMove={handleCanvasPointerMove}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <Lights />
        <OrbitControls
          target={[0, 0.5, 0]}
          enableDamping
          dampingFactor={0.1}
          enabled={!isCtrlDown} // ← trava a câmera enquanto Ctrl está pressionado
        />

        <gridHelper
          args={[buildSize, buildSize, "#ffffff", "#303030"]}
          position={[-0.5, 0.5, -0.5]}
        />

        <World />
        <EffectsLayer />
        <GhostPreview />
        <Highlight />
        <WireframeAll />
        <Ground />
        <FogController />
      </Canvas>
    </div>
  );
}
