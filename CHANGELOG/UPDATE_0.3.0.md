# Changelog v0.3.0

## [v0.3.0] — 2025-08-20

### Sistema de Variações de Blocos e Interface Aprimorada

#### Novas Funcionalidades Principais

- **Sistema de Variações de Blocos**: Implementação completa de 5 tipos de blocos
  - ✅ **Bloco** - Cubo completo tradicional
  - ✅ **Escada** - Formato de degrau com laje + step
  - ✅ **Laje** - Bloco achatado (metade da altura)
  - ✅ **Cerca** - Poste central com barras horizontais
  - ✅ **Painel** - Painel fino vertical

- **Sistema de Rotação de Blocos**: Controle completo de orientação
  - ✅ **Rotação Horizontal (Y)**: 0°, 90°, 180°, 270°
  - ✅ **Rotação Vertical (X)**: Para lajes horizontais/verticais
  - ✅ **Estado Persistente**: currentRotation no store global

#### Melhorias na Interface do Usuario

- **Catálogo de Blocos Renovado** (`BlockCatalog_NEW.tsx`)
  - ✅ **Múltiplos Tamanhos de Grid**: Compacto, Normal, Grande
  - ✅ **Sistema de Busca Aprimorado**: Filtro em tempo real
  - ✅ **Ordenação Alfabética**: Toggle A-Z
  - ✅ **Categorias Organizadas**: Stone, Wood, Concrete, Misc
  - ✅ **Tooltips Informativos**: Descrições detalhadas

- **Painel de Bloco Selecionado** (`SelectedBlock.tsx`)
  - ✅ **Seletor de Variantes**: 5 botões com ícones Lucide
  - ✅ **Preview Visual**: Mostra tipo e categoria do bloco
  - ✅ **Feedback Interativo**: Ring de seleção e tooltips
  - ✅ **Design Compacto**: Layout otimizado

#### Ferramentas de Construção

- **Ferramentas de Rotação**: Botões dedicados na toolbar
  - ✅ **Rotação Horizontal** (R): Ícone RotateCw
  - ✅ **Rotação Vertical** (T): Ícone RotateCcw
  - ✅ **Ação Instantânea**: Não ficam "ativas" como outras ferramentas
  - ✅ **Indicadores Visuais**: Ponto azul para ferramentas ativas

- **Atalhos de Teclado Expandidos**:
  - ✅ **R**: Rotação Horizontal (Y)
  - ✅ **T**: Rotação Vertical (X)
  - ✅ **Q/W/E**: Modos de construção
  - ✅ **G/F**: Wireframe e ambiente

#### Arquitetura e Performance

- **Tipos TypeScript Robustos**:
  ```typescript
  export type BlockVariant = "block" | "stairs" | "slab" | "fence" | "panel";
  export type BlockRotation = { x: number; y: number; z: number };
  ```

- **Geometrias 3D Otimizadas**:
  - **Escada**: Base (1x0.5x1) + Degrau (1x0.5x0.5)
  - **Laje**: Cubo achatado (1x0.5x1)
  - **Cerca**: Poste (0.125x1x0.125) + Barras (0.9x0.125x0.125)
  - **Painel**: Painel fino (1x1x0.125)

- **Sistema de Persistência Expandido**:
  - ✅ **Histórico Completo**: Inclui variant e rotation
  - ✅ **Undo/Redo Aprimorado**: Restaura estado completo
  - ✅ **Compatibilidade**: Fallback para saves v0.2.x

#### Melhorias de UX/UI

- **Feedback Visual Aprimorado**:
  - ✅ **Indicadores de Estado**: Highlight de seleções
  - ✅ **Tooltips Contextuais**: Atalhos e descrições
  - ✅ **Animações Suaves**: Transições em hover/select
  - ✅ **Cores Semânticas**: Categorização visual

- **Layout Responsivo**:
  - ✅ **Grid Adaptável**: 3 tamanhos de visualização
  - ✅ **Scrolling Otimizado**: Custom scrollbar
  - ✅ **Compactação Inteligente**: Melhor uso do espaço

#### Preparação v0.4.0

- Base sólida para conectividade automática
- Arquitetura preparada para escadas complexas
- Sistema de variantes extensível para novos tipos
- Interface escalável para múltiplas categorias

---

#### Notas Técnicas

- **Compatibilidade**: Saves v0.2.x continuam funcionando
- **Performance**: Otimizações em renderização de grids
- **Extensibilidade**: Sistema preparado para variantes futuras
- **UX**: Foco em facilidade de uso e descoberta de recursos
