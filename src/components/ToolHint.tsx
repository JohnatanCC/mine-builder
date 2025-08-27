// src/components/ToolHint.tsx
import { AlertCircle, Copy, Palette, Minus } from 'lucide-react';
import { useWorld } from '@/state/world.store';
import { getToolStatus } from '@/systems/tools/handlers';

/**
 * Componente que mostra dicas de uso das ferramentas
 */
export function ToolHint() {
    const currentTool = useWorld(s => s.currentTool);
    const copyPreview = useWorld(s => s.copyPreview);

    // Don't show hint for brush tool
    if (currentTool === "brush") return null;

    const status = getToolStatus(currentTool);

    const getIcon = () => {
        switch (currentTool) {
            case "line": return <Minus className="h-4 w-4 text-primary" />;
            case "copy": return <Copy className="h-4 w-4 text-primary" />;
            case "paint": return <Palette className="h-4 w-4 text-primary" />;
            default: return <AlertCircle className="h-4 w-4 text-primary" />;
        }
    };

    const getExtraInfo = () => {
        switch (currentTool) {
            case "copy":
                return (
                    <span className="text-muted-foreground">
                        | <kbd className="bg-muted px-1 rounded">Ctrl</kbd> coluna | <kbd className="bg-muted px-1 rounded">Shift</kbd> camada | Detecta estruturas alinhadas
                        {copyPreview && copyPreview.length > 0 && (
                            <span> | Preview: {copyPreview.length} blocos
                            </span>
                        )}
                    </span>
                );
            case "paint":
                return (
                    <span className="text-muted-foreground">
                        | Substitui blocos existentes pelo bloco selecionado
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-card border rounded-lg px-4 py-2 shadow-lg z-50 max-w-lg">
            <div className="flex items-center gap-2 text-sm">
                {getIcon()}
                <span>{status}</span>
                {getExtraInfo()}
            </div>
        </div>
    );
}
