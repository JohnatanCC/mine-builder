import type { Tool, Pos, BlockType, BlockVariant, BlockRotation } from "@/core/types";
import { useWorld } from "@/state/world.store";
import { executeLineTool, executeCopyTool, executeDeleteConnectedTool } from "./actions";
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
  rotation: BlockRotation,
  faceNormal?: Pos, // Normal da face clicada
  ctrlDown?: boolean,
  shiftDown?: boolean
) {
  switch (tool) {
    case "brush":
      // Ferramenta padrão - lógica original
      handleBrushTool(clickedPos, button, blockType);
      break;

    case "line":
      handleLineTool(clickedPos, button, blockType, variant, rotation);
      break;

    case "copy":
      handleCopyTool(clickedPos, button, blockType, variant, rotation, faceNormal, ctrlDown, shiftDown);
      break;

    case "paint":
      handlePaintTool(clickedPos, button, blockType, variant, rotation);
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
 * Ferramenta Copy - Copia estruturas conectadas de forma inteligente com um clique
 */
function handleCopyTool(
  pos: Pos,
  button: 0 | 1 | 2,
  blockType: BlockType,
  variant: BlockVariant,
  rotation: BlockRotation,
  faceNormal?: Pos,
  ctrlDown?: boolean,
  shiftDown?: boolean
) {
  const store = useWorld.getState();
  
  if (button === 2) {
    // Botão direito - deleta estrutura conectada
    const blocksDeleted = executeDeleteConnectedTool(pos, blockType, variant, rotation);
    
    if (blocksDeleted > 0) {
      toast(`Estrutura removida: ${blocksDeleted} blocos`);
    } else {
      toast("Nenhuma estrutura encontrada para remover");
    }
    
    // Limpa preview
    store.setCopyPreview(null);
    return;
  }

  // Se não temos a normal da face, usa padrão (direção Y+)
  const normal: Pos = faceNormal || [0, 1, 0];
  
  // Determina o modo de cópia baseado nas teclas modificadoras
  let copyMode: 'full' | 'vertical' | 'horizontal' = 'full';
  
  if (ctrlDown && !shiftDown) {
    copyMode = 'vertical';
  } else if (shiftDown && !ctrlDown) {
    copyMode = 'horizontal';
  }
  // Se ambas ou nenhuma estão pressionadas, usa modo completo
  
  // Executa cópia com um clique
  const blocksPlaced = executeCopyTool(pos, normal, blockType, variant, rotation, copyMode);
  
  const modeText = copyMode === 'vertical' ? ' (vertical)' : 
                   copyMode === 'horizontal' ? ' (horizontal)' : '';
  
  if (blocksPlaced > 0) {
    toast(`Estrutura copiada: ${blocksPlaced} blocos${modeText}`);
  } else {
    toast("Nenhuma posição válida para copiar ou estrutura não encontrada");
  }
}

/**
 * Ferramenta Paint - Troca o tipo de blocos existentes
 */
function handlePaintTool(
  pos: Pos,
  button: 0 | 1 | 2,
  blockType: BlockType,
  variant: BlockVariant,
  rotation: BlockRotation
) {
  const store = useWorld.getState();
  
  if (button === 2) {
    // Botão direito - não faz nada no paint
    return;
  }

  // Verifica se existe um bloco na posição (usa a posição exata do bloco clicado)
  if (store.hasBlock(pos)) {
    // Remove o bloco antigo e coloca o novo
    store.removeBlock(pos);
    store.setBlock(pos, blockType);
    toast("Bloco substituído");
  } else {
    toast("Nenhum bloco para substituir nesta posição");
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
      
    case "copy":
      return "Cópia inteligente: Ctrl (coluna) | Shift (camada) | Detecta estruturas alinhadas";
      
    case "paint":
      return "Pintura: Clique em um bloco para substituí-lo pelo bloco selecionado";
      
    default:
      return "Ferramenta desconhecida";
  }
}
