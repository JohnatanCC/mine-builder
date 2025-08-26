// Sidebar esquerda integrada - ToolsRail + BlockCatalog
import * as React from "react";
import { BlockCatalog } from "./BlockCatalog";
import { ToolsRail } from "./ToolsRail";

export const LeftSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-fit gap-2">
      {/* Ferramentas */}
      <div className="flex-shrink-0">
        <ToolsRail />
      </div>
      
      {/* Catálogo de Blocos */}
      <div className="flex-1 min-h-0">
        <BlockCatalog />
      </div>
    </div>
  );
};
