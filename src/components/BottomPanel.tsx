import * as React from "react";
import { SelectedBlock } from "@/ui/SelectedBlock";
import { CompactToolbar } from "@/components/CompactToolbar";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BottomPanel: React.FC = () => {
  const [isMinimized, setIsMinimized] = React.useState(false);

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t shadow-lg z-40 transition-all duration-300 ${
      isMinimized ? 'h-12' : 'h-20'
    }`}>
      {/* Toggle button */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsMinimized(!isMinimized)}
          className="h-6 w-8 rounded-full bg-background border shadow-sm"
        >
          {isMinimized ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </div>

      {!isMinimized && (
        <div className="flex items-center justify-between px-4 py-3 h-full">
          {/* Bloco selecionado */}
          <div className="flex items-center">
            <SelectedBlock />
          </div>

          {/* Ferramentas centralizadas */}
          <div className="flex-1 flex justify-center">
            <CompactToolbar />
          </div>

          {/* Espaço para futuras expansões */}
          <div className="w-24" />
        </div>
      )}

      {isMinimized && (
        <div className="flex items-center justify-center h-full">
          <div className="text-xs text-muted-foreground">
            Clique para expandir ferramentas
          </div>
        </div>
      )}
    </div>
  );
};
