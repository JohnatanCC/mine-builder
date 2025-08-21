// UPDATE: src/App.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

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
export default function App() {
  return (
    <AppShell
      topBar={<TopBar />}
      left={<BlockCatalog />}         // catálogo fixo
      right={<Inspector />}           // inspector
      toolsOverlay={<ToolsRail />}    // ferramentas absolutas
      // bottom={<HotbarDock />}         // hotbar acoplada ao rodapé
    >
      <Canvas camera={{ position: [12, 12, 12], fov: 50 }}>
        <Lights />
        <OrbitControls makeDefault />
        <World />
        <Ground />
        <Highlight />
      </Canvas>

      {/* <LoadingOverlay/> */}
      <FpsMeter />
      <CommandMenu /> {/* NEW: Ctrl+K */}
    </AppShell>
  );
}
