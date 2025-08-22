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
import { WireGrid } from "./components/WireGrid";
import { WireframeAll } from "./components/WireframeAll";
import * as THREE from "three"; // ⬅️ novo
import { SkyBackdrop } from "./components/SkyBackdrop";

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
      left={<BlockCatalog />}
      right={<Inspector />}
      toolsOverlay={<ToolsRail />}
    >
      <div className="relative h-full w-full bg-transparent">
        {/* Gradiente CSS por trás do Canvas */}
        <SkyBackdrop />
        <Canvas
          gl={{ antialias: true, alpha: true }} // ⬅️ permite ver o gradiente de trás
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [50, 20, 40], fov: 30 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);          // transparente
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
          }}
        >
          {/* Opcional: se preferir o céu 3D, descomente: */}
          {/* <SkyDome top="#7ec8ff" bottom="#0b0f1a" /> */}
          <CameraControls />
          <Highlight />
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
      <AmbientAudio />
      <Keybinds />
    </AppShell>
  );
}
