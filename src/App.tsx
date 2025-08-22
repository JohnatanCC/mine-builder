// UPDATE: src/App.tsx
import { Canvas } from "@react-three/fiber";
import * as React from "react";

import { World } from "./components/World";
import { Ground } from "./components/Ground";
import { Highlight } from "./components/Highlight";
import { Lights } from "./components/Lights";
import FpsMeter from "./ui/FpsMeter";
import { AppShell } from "./components/AppShell";
import { TopBar } from "./ui/TopBar";
import { Inspector } from "./ui/Inspector";
import { CommandMenu } from "./ui/CommandMenu";
import { BlockCatalog } from "./ui/BlockCatalog";
import { ToolsRail } from "./ui/ToolsRail";
import { AmbientAudio } from "./components/AmbientAudio";
import { Keybinds } from "./components/Keybinds";
import { CameraControls } from "./components/CameraControls";
import { RemoveBurst } from "./components/effects/RemoveBurst";

// função de importação já existente
import { importWorld } from "@/state/world.store";

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

  return (
    <AppShell
      topBar={<TopBar />}
      left={<BlockCatalog />}         // catálogo fixo
      right={<Inspector />}           // inspector
      toolsOverlay={<ToolsRail />}    // ferramentas absolutas
    >
      <Canvas camera={{ position: [12, 12, 12], fov: 50 }}>
        <Lights />
        <CameraControls />
        <World />
        <Ground />
        <Highlight />
        <RemoveBurst />
      </Canvas>

      <FpsMeter />
      <CommandMenu /> {/* Ctrl+K */}
      <AmbientAudio />
      <Keybinds />
    </AppShell>
  );
}
