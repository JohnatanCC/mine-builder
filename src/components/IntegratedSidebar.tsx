import * as React from "react";
import { ToolsRail } from "@/ui/ToolsRail";
import { BlockCatalog } from "@/ui/BlockCatalog";
import { SelectedBlock } from "@/ui/SelectedBlock";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const IntegratedSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className={`transition-all duration-300 ${isExpanded ? 'w-80' : 'w-16'} h-full bg-card border-r flex flex-col`}>
      {/* Header com toggle */}
      <div className="flex items-center justify-between p-3 border-b">
        {isExpanded && (
          <h2 className="font-semibold text-sm">Ferramentas & Blocos</h2>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded ? (
        <>
          {/* Bloco selecionado */}
          <div className="p-3 border-b">
            <SelectedBlock />
          </div>

          {/* Ferramentas */}
          <div className="p-3 border-b">
            <div className="scale-90 origin-left">
              <ToolsRail />
            </div>
          </div>

          {/* Catálogo de blocos */}
          <div className="flex-1 min-h-0">
            <BlockCatalog />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 p-2">
          {/* Versão compacta - apenas os ícones principais */}
          <div className="text-xs text-muted-foreground rotate-90 whitespace-nowrap">
            Ferramentas
          </div>
        </div>
      )}
    </div>
  );
};
