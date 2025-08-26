// UPDATE: src/App.tsx
import { Canvas } from "@react-three/fiber";
import * as React from "react";

import { World } from "./components/World";
import { Ground } from "./components/Ground";
import { Highlight } from "./components/Highlight";
import { Lights } from "./components/Lights";
import { LinePreview } from "./components/LinePreview";
import FpsMeter from "./ui/FpsMeter";
import { AppShell } from "./components/AppShell";
import { TopBar } from "./ui/TopBar";
import { Inspector } from "./ui/Inspector";
import { CommandMenu } from "./ui/CommandMenu";
import { BlockCatalog } from "./ui/BlockCatalog";
import { ToolsRail } from "./ui/ToolsRail";
import { SelectedBlock } from "./ui/SelectedBlock";
import { LineToolHint } from "./ui/LineToolHint";
import { AmbientAudio } from "./components/AmbientAudio";
import { Keybinds } from "./components/Keybinds";
import { CameraControls } from "./components/CameraControls";
import { RemoveBurst } from "./components/effects/RemoveBurst";

// função de importação já existente
import { importWorld, useWorld } from "@/state/world.store";
import { WireGrid } from "./components/WireGrid";
import { WireframeAll } from "./components/WireframeAll";
import { SkyBackdrop } from "./components/SkyBackdrop";
import { LoadingOverlay } from "./ui/LoadingOverlay";

export default function App() {
  React.useEffect(() => {
    // carrega a ilha padrão ao iniciar
    fetch("/worlds/default-island.json")
      .then(res => res.json())
      .then(data => {
        importWorld(data);
      })
      .catch(err => {
        console.error("Falha ao carregar terreno padrão:", err);
      });
  }, []);
  const preset = useWorld(s => s.renderPreset);
  const render = useWorld(s => s.renderSettings);

  return (
    <AppShell
      topBar={<TopBar />}
      left={<BlockCatalog />}
      right={<Inspector />}
      toolsOverlay={
        <div className="flex flex-col gap-2">
          <ToolsRail />
          <SelectedBlock />
        </div>
      }
    >
      <div className="relative h-full w-full bg-transparent">
        <SkyBackdrop />
        <Canvas
          key={`cv-${preset}`}
          camera={{ position: [50, 20, 40], fov: 30 }}
          shadows={render.shadows}
          dpr={render.dpr}
          gl={{ antialias: render.antialias, powerPreference: preset === "performance" ? "low-power" : "high-performance" }}
        >


          <CameraControls />
          <Highlight />
          <LinePreview />
          <Lights />
          <World />
          <Ground />
          <RemoveBurst />
          <WireGrid />
          <WireframeAll />
        </Canvas>

      </div>
      <FpsMeter />
      <CommandMenu /> {/* Ctrl+K */}
      <LineToolHint />
      <AmbientAudio />
      <Keybinds />
      <LoadingOverlay />
    </AppShell>
  );
}
