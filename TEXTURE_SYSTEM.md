# Sistema de Texturas Mine Builder

## Sistema Dinâmico de Mapeamento de Texturas

O sistema foi completamente modernizado para suportar automaticamente novos blocos e texturas com nomenclaturas flexíveis.

### Nomenclatura de Texturas Suportadas

#### Básicas (existentes)
- `all.png` - Aplicada em todas as faces
- `top.png` - Face superior
- `bottom.png` - Face inferior  
- `side.png` - Todas as faces laterais
- `icon.png` - Ícone de preview

#### Novas (implementadas)
- `top-bottom.png` - Face superior E inferior (como oak-log)
- `side1.png` / `north.png` - Face norte (frente)
- `side2.png` / `south.png` - Face sul (trás)
- `side3.png` / `east.png` - Face leste (direita)
- `side4.png` / `west.png` - Face oeste (esquerda)

### Sistema de Prioridade de Fallback

1. **Face específica** (side1, side2, etc.)
2. **Padrão da face** (top, bottom, side)
3. **Texturas gerais** (top-bottom, all)
4. **Fallback final** (icon, placeholder)

### Categorias de Blocos

#### Por Material
- `stone` - Pedras e rochas
- `wood` - Madeiras processadas
- `log` - Troncos naturais
- `leaves` - Folhagens (transparência especial)
- `glass` - Vidros (transparência)
- `concrete` - Concretos
- `copper` - Blocos de cobre
- `tuff` - Blocos de tufo
- `brick` - Tijolos
- `misc` - Outros

#### Por Propriedades Especiais
- `isLeaves: true` - Aplica transparência com alphaTest
- `isGlass: true` - Aplica transparência total
- `isGrate: true` - Grades/barras com partes vazias (nova)

### Como Adicionar Novos Blocos

#### 1. Adicionar Texturas
Crie uma pasta em `src/assets/textures/blocks/` com o nome do bloco:
```
src/assets/textures/blocks/
├── meu_novo_bloco/
│   ├── all.png          # OU
│   ├── top.png          # Textura superior
│   ├── bottom.png       # Textura inferior  
│   ├── side.png         # OU sides específicos
│   ├── side1.png        # Norte
│   ├── side2.png        # Sul
│   ├── side3.png        # Leste
│   └── side4.png        # Oeste
```

#### 2. Adicionar Tipo
Em `src/core/types.ts`:
```typescript
export type BlockType = 
  // ... tipos existentes
  | "meu_novo_bloco";
```

#### 3. Adicionar Label
Em `src/core/labels.ts`:
```typescript
export const BLOCK_LABEL: Record<BlockType, string> = {
  // ... labels existentes
  meu_novo_bloco: "Meu Novo Bloco",
};
```

#### 4. Adicionar ao Registry
Em `src/core/blocks/registry.ts`:
```typescript
export const REGISTRY = Object.freeze({
  // ... blocos existentes
  meu_novo_bloco: createBlockDef("meu_novo_bloco", "stone", { 
    isGlass: true,  // Se for vidro
    isGrate: true,  // Se for grade
    isLeaves: true, // Se for folha
  }),
});
```

#### 5. Adicionar à Ordem (opcional)
Em `src/core/blocks/registry.ts`:
```typescript
export const BLOCKS_ORDER: BlockType[] = [
  // ... blocos existentes
  "meu_novo_bloco",
];
```

### Detecção Automática

O sistema inclui funções de auto-detecção baseadas no nome:

```typescript
// Detecta categoria automaticamente
autoDetectCategory("copper_grate") // → "copper"
autoDetectCategory("oak_planks")   // → "wood"

// Detecta propriedades especiais
autoDetectIsGrate("iron_bars")     // → true
autoDetectIsGlass("red_stained_glass") // → true
autoDetectIsLeaves("oak_leaves")   // → true
```

### Exemplos de Uso

#### Bloco com faces diferentes
```
my_complex_block/
├── top.png       # Textura única no topo
├── bottom.png    # Textura única na base
├── side1.png     # Norte - porta
├── side2.png     # Sul - janela  
├── side3.png     # Leste - parede
└── side4.png     # Oeste - parede
```

#### Bloco com top-bottom
```
log_block/
├── top-bottom.png  # Topo e base (anéis)
└── side.png        # Laterais (casca)
```

#### Grade/Barras
```
custom_bars/
└── all.png         # Com transparência alpha
```
- Sistema detecta `_bars` no nome
- Aplica transparência automática
- Usa `alphaTest` para cortar partes vazias

### Melhorias Implementadas

1. **Sistema Dinâmico**: Não precisa mais hardcodar cada bloco
2. **Fallback Inteligente**: Busca automaticamente texturas alternativas
3. **Suporte Completo**: top-bottom, sides individuais, grades
4. **Auto-detecção**: Categorias e propriedades baseadas no nome
5. **Organização**: Blocos agrupados por categoria no palette
6. **Performance**: Cache de materiais e texturas
7. **Transparência**: Suporte automático para vidros e grades

### Próximos Passos

Para futuras expansões:
1. Implementar `discoverNewBlocks()` para scan automático de pastas
2. Adicionar suporte a texture packs
3. Implementar rotação de texturas direcionais
4. Suporte a animações de textura
5. Sistema de variants (damaged, weathered, etc.)
