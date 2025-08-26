import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWorld } from "@/state/world.store";
import { getLabel } from "@/core/blocks/registry";
import { BlockIcon } from "@/ui/BlockIcon";
import FpsMeter from "@/ui/FpsMeter";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

export function PropertyInspector() {
  const { isMobile } = useResponsive();
  const current = useWorld(s => s.current);
  const blocks = useWorld(s => s.blocks);
  const hoveredKey = useWorld(s => s.hoveredKey);

  // Statistics
  const totalBlocks = blocks.size;
  const blocksByType = React.useMemo(() => {
    const counts: Record<string, number> = {};
    blocks.forEach(block => {
      counts[block.type] = (counts[block.type] || 0) + 1;
    });
    return counts;
  }, [blocks]);

  const topBlocks = React.useMemo(() => {
    return Object.entries(blocksByType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }, [blocksByType]);

  const containerWidth = isMobile ? "w-full" : "w-80";

  return (
    <div className={cn("flex flex-col bg-card", containerWidth)}>
      {/* Header */}
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-semibold">Propriedades</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-3">
        {/* Current Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Bloco Selecionado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg border bg-background">
                <BlockIcon type={current} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{getLabel(current)}</p>
                <p className="text-xs text-muted-foreground">{current}</p>
              </div>
            </div>

            {hoveredKey && (
              <div className="text-xs text-muted-foreground">
                Posição: {hoveredKey}
              </div>
            )}
          </CardContent>
        </Card>

        {/* World Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Estatísticas do Mundo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total de blocos</span>
              <Badge variant="secondary">{totalBlocks}</Badge>
            </div>

            {topBlocks.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Mais utilizados</p>
                  {topBlocks.map(([blockType, count]) => (
                    <div key={blockType} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 flex items-center justify-center rounded border">
                          <BlockIcon type={blockType as any} />
                        </div>
                        <span className="text-xs">{getLabel(blockType as any)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">FPS</span>
              <div className="text-right">
                <FpsMeter />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded border bg-muted/50">
                <div className="font-medium">1-4</div>
                <div className="text-muted-foreground">Categorias</div>
              </div>
              <div className="p-2 rounded border bg-muted/50">
                <div className="font-medium">Ctrl+Z</div>
                <div className="text-muted-foreground">Desfazer</div>
              </div>
              <div className="p-2 rounded border bg-muted/50">
                <div className="font-medium">Ctrl+Y</div>
                <div className="text-muted-foreground">Refazer</div>
              </div>
              <div className="p-2 rounded border bg-muted/50">
                <div className="font-medium">Delete</div>
                <div className="text-muted-foreground">Remover</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
