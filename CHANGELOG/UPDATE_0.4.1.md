# Changelog v0.4.1

## [v0.4.1] — 2025-08-26

### Sistema Completo de Conectividade de Variantes

#### Novas Funcionalidades

- **Variantes de Blocos**: Sistema completo com block, stairs, slab, fence, panel
- **Conectividade Automática**: Cercas e painéis se conectam automaticamente
- **Rotação Precisa**: Sistema de rotação corrigido com separação visual/colisão
- **Persistência Completa**: Save/load com suporte a variant, rotation e shape

#### Melhorias no Sistema de Cercas

- **Conectividade Lateral**: Cercas se conectam como no Minecraft
- **Sem Duplicação**: Sistema inteligente evita barras duplicadas
- **Conexão com Blocos**: Cercas/painéis se conectam a blocos sólidos
- **Renderização Otimizada**: Cada bloco renderiza apenas sua parte da conexão

#### Melhorias no Sistema de Painéis

- **Painéis Conectivos**: Sistema similar às cercas para painéis
- **Paredes Contínuas**: Painéis formam paredes contínuas quando adjacentes
- **Integração com Blocos**: Painéis se conectam a estruturas existentes

#### Correções Técnicas

- **Colisão Precisa**: Hitbox invisível 1x1x1 para interação consistente
- **Rotação Separada**: Visual e colisão independentes para precisão
- **Atualização Reativa**: Vizinhos atualizam automaticamente
- **Performance**: Sistema otimizado para grandes construções

#### Sistema de Escadas Aprimorado

- **Formas Automáticas**: inner_left, inner_right, outer_left, outer_right
- **Rotação Inteligente**: Escadas se orientam baseadas no contexto
- **Integração Visual**: Escadas se adaptam a estruturas complexas

#### Preparação v0.5.0

Esta versão estabelece a base sólida para:
- Sistema de entidades
- Materiais avançados  
- Texturas procedurais
- Física aprimorada
