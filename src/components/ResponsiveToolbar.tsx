import * as React from "react";
import { ToolsRail } from "@/ui/ToolsRail";
import { SelectedBlock } from "@/ui/SelectedBlock";
import { useResponsive } from "@/hooks/useResponsive";

export const ResponsiveToolbar: React.FC = () => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    // Em dispositivos móveis, coloca a toolbar na parte inferior
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex flex-col gap-2 max-w-[calc(100vw-2rem)]">
        <div className="overflow-x-auto">
          <ToolsRail />
        </div>
        <div className="flex justify-center">
          <SelectedBlock />
        </div>
      </div>
    );
  }

  // Em desktop, mantém no topo centralizado
  return (
    <div className="flex flex-col gap-2">
      <ToolsRail />
      <SelectedBlock />
    </div>
  );
};
