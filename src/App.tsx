// UPDATE: src/App.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { World } from "./components/World";
import { Ground } from "./components/Ground";
import { Highlight } from "./components/Highlight";
import { Lights } from "./components/Lights";
import FpsMeter from "./ui/FpsMeter";
import { Hotbar } from "./ui/Hotbar";
import { AppShell } from "./components/AppShell";
import { TopBar } from "./ui/TopBar";
import { LeftTools } from "./ui/LeftTools";
import { RightInspector } from "./ui/RightInspector";
import { CommandMenu } from "./ui/CommandMenu";
import { tryRestoreAutoOnBoot } from "@/systems/localSaves";
import { toast } from "sonner";
import React from "react";

export default function App() {
   React.useEffect(() => {
    const restored = tryRestoreAutoOnBoot();
    if (restored) toast("♻️ Auto‑save restaurado automaticamente.");
  }, []);
  return (
    <AppShell
      topBar={<TopBar />}
      left={<LeftTools />}
      right={<RightInspector />}
      bottom={<Hotbar />}
    >
      <Canvas camera={{ position: [12, 12, 12], fov: 50 }}>
        <Lights />
        <OrbitControls makeDefault />
        <World />
        <Ground />
        <Highlight />
      </Canvas>

      {/* HUD / Overlays */}
      <FpsMeter />
      <CommandMenu /> {/* NEW: Ctrl+K */}
    </AppShell>
  );
}
