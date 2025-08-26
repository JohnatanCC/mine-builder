// src/ui/LineToolHint.tsx
import { useWorld } from '@/state/world.store';
import { AlertCircle } from 'lucide-react';

/**
 * Componente que mostra dicas de uso da Ferramenta Linha
 */
export function LineToolHint() {
  const currentTool = useWorld(s => s.currentTool);
  const lineStart = useWorld(s => s.lineStart);
  
  if (currentTool !== "line") return null;
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card border rounded-lg px-4 py-2 shadow-lg z-50">
      <div className="flex items-center gap-2 text-sm">
        <AlertCircle className="h-4 w-4 text-primary" />
        {!lineStart ? (
          <span>Clique no primeiro ponto para iniciar a linha</span>
        ) : (
          <span>Clique no segundo ponto para finalizar a linha | <kbd className="bg-muted px-1 rounded">ESC</kbd> para cancelar</span>
        )}
      </div>
    </div>
  );
}
