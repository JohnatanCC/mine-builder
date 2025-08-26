// UPDATE: src/components/SkyBackdrop.tsx
import * as React from "react";
import { useWorld } from "@/state/world.store";
import { ENV_PRESETS } from "@/core/constants";

/** Gradiente atrás do Canvas guiado pelo preset atual */
export const SkyBackdrop: React.FC = () => {
  const env = useWorld(s => s.envPreset);
  const preset = ENV_PRESETS[env];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background: `linear-gradient(180deg, ${preset.skyTop} 0%, ${preset.skyBottom} 100%)`,
      }}
    />
  );
};
