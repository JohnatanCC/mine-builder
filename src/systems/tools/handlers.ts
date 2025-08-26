import type { Tool, Pos, BlockType, BlockVariant, BlockRotation } from "@/core/types";
import { useWorld } from "@/state/world.store";
import { executeLineTool, executeFillTool, executeMirrorTool } from "./actions";
import { toast } from "sonner";

/**
 * Processa clique com uma ferramenta específica
 */
export function handleToolClick(
  tool: Tool,
  clickedPos: Pos,
  button: 0 | 1 | 2, // 0=esquerdo, 2=direito
  blockType: BlockType,
  variant: BlockVariant,
  rotation: BlockRotation
) {
  switch (tool) {
    case "brush":
      // Ferramenta padrão - lógica original
      handleBrushTool(clickedPos, button, blockType);
      break;

    case "line":
      handleLineTool(clickedPos, button, blockType, variant, rotation);
      break;

    case "fill":
      handleFillTool(clickedPos, button, blockType, variant, rotation);
      break;

    case "mirror":
      handleMirrorTool(clickedPos, button, blockType, variant, rotation);
      break;

    default:
      console.warn("Ferramenta desconhecida:", tool);
  }
}

/**
 * Ferramenta Brush (comportamento padrão)
 */
function handleBrushTool(
  pos: Pos,
  button: 0 | 1 | 2,
  blockType: BlockType
) {
  const store = useWorld.getState();
  
  if (button === 2) {
    // Botão direito - remove bloco
    store.removeBlock(pos);
  } else {
    // Botão esquerdo - coloca bloco
    store.setBlock(pos, blockType);
  }
}

/**
 * Ferramenta Line - Desenha linhas entre dois pontos
 */
function handleLineTool(
  pos: Pos,
  button: 0 | 1 | 2,
  blockType: BlockType,
  variant: BlockVariant,
  rotation: BlockRotation
) {
  const store = useWorld.getState();
  
  if (button === 2) {
    // Botão direito - cancela linha atual
    store.setLineStart(null);
    store.setLineEnd(null);
    toast("Linha cancelada");
    return;
  }

  const currentStart = store.lineStart;
  
  if (currentStart === null) {
    // Primeiro clique - define ponto inicial
    store.setLineStart(pos);
    store.setLineEnd(null);
    toast(`Linha iniciada em [${pos.join(", ")}]`);
  } else {
    // Segundo clique - define ponto final e desenha linha
    store.setLineEnd(pos);
    
    const blocksPlaced = executeLineTool(currentStart, pos, blockType, variant, rotation);
    
    // Reseta os pontos
    store.setLineStart(null);
    store.setLineEnd(null);
    
    toast(`Linha desenhada: ${blocksPlaced} blocos`);
  }
}

/**
 * Ferramenta Fill - Preenche áreas conectadas
 */
function handleFillTool(
  pos: Pos,
  button: 0 | 1 | 2,
  blockType: BlockType,
  variant: BlockVariant,
  rotation: BlockRotation
) {
  if (button === 2) {
    // Botão direito - não faz nada no fill
    return;
  }

  const blocksPlaced = executeFillTool(pos, blockType, variant, rotation);
  
  if (blocksPlaced > 0) {
    toast(`Área preenchida: ${blocksPlaced} blocos`);
  } else {
    toast("Nenhum bloco foi alterado");
  }
}

/**
 * Ferramenta Mirror - Espelha construções
 */
function handleMirrorTool(
  pos: Pos,
  button: 0 | 1 | 2,
  blockType: BlockType,
  variant: BlockVariant,
  rotation: BlockRotation
) {
  const store = useWorld.getState();
  
  if (button === 2) {
    // Botão direito - alterna eixo de espelhamento
    const newAxis = store.mirrorAxis === "x" ? "z" : "x";
    store.setMirrorAxis(newAxis);
    toast(`Eixo de espelhamento: ${newAxis.toUpperCase()}`);
    return;
  }

  // Botão esquerdo - executa espelhamento
  // Para simplicidade inicial, espelha um bloco único
  const centerLine = store.mirrorAxis === "x" ? pos[0] : pos[2];
  const sourcePoints = [pos];
  
  const blocksPlaced = executeMirrorTool(
    sourcePoints,
    store.mirrorAxis,
    centerLine,
    blockType,
    variant,
    rotation
  );
  
  if (blocksPlaced > 0) {
    toast(`Espelhamento realizado: ${blocksPlaced} blocos (eixo ${store.mirrorAxis.toUpperCase()})`);
  }
}

/**
 * Obtém informações sobre o estado atual da ferramenta
 */
export function getToolStatus(tool: Tool): string {
  const store = useWorld.getState();
  
  switch (tool) {
    case "brush":
      return "Pincel: Clique para colocar/remover blocos";
      
    case "line":
      const lineStart = store.lineStart;
      if (lineStart) {
        return `Linha: Segundo ponto (início: [${lineStart.join(", ")}])`;
      }
      return "Linha: Clique no primeiro ponto";
      
    case "fill":
      return "Preenchimento: Clique para preencher área conectada";
      
    case "mirror":
      return `Espelhar: Eixo ${store.mirrorAxis.toUpperCase()} (botão direito alterna)`;
      
    default:
      return "Ferramenta desconhecida";
  }
}
