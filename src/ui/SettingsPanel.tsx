// src/ui/SettingsPanel.tsx
import { bodyStyle, cardStyle, headerStyle } from "./settings/theme";
import { VisualSection } from "./settings/VisualSection";
import { LightSection } from "./settings/LightSection";
import { FoliageSection } from "./settings/FoliageSection";
import { WindSection } from "./settings/WindSection";
import { FogSection } from "./settings/FogSection";
import { BlockAnimSection } from "./settings/BlockAnimSection";
import { TerrainSection } from "./settings/TerrainSection";

export function SettingsPanel() {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>Configurações</div>
      <div style={bodyStyle}>
        <VisualSection />
        <LightSection />
        <FoliageSection />
        <WindSection />
        <FogSection />
        <BlockAnimSection />
        <TerrainSection />
      </div>
    </div>
  );
}

export default SettingsPanel;
