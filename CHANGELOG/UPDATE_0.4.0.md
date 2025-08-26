# Changelog v0.4.0

## [v0.4.0] — 2025-08-25

### Versão de Estabilização e Otimização

#### Correções Críticas

- **Centralização de Hotkeys**: Todos atalhos agora centralizados em `core/keys.ts` com helpers de verificação
- **Labels Seguros**: Sistema de fallback para labels de blocos ausentes, evita quebras na UI
- **Material Pooling**: Cache de materiais para evitar memory leaks e melhorar performance
- **Registry Imutável**: Block Registry agora é readonly, prevenindo modificações acidentais
- **Versionamento Aprimorado**: Saves incluem metadados completos de versão e compatibilidade

#### Melhorias de Arquitetura

- **Error Handler**: Sistema centralizado de gestão de erros com logs estruturados
- **Tipagem Melhorada**: Correções em tipos readonly e constantes
- **Performance**: Otimizações em materiais e texturas
- **Compatibilidade**: Melhor validação de versões em import/export

#### Ajustes Técnicos

- Atualização da versão para 0.4.0 em todos os arquivos relevantes
- Melhoria na gestão de erros de áudio com feedback claro
- Logs estruturados para debugging em desenvolvimento
- Código mais robusto e maintível

#### Preparação v1.0.0

- Base sólida para features futuras
- Arquitetura estabilizada e otimizada
- Sistema de erros e logging preparado para produção
- Compatibilidade e versionamento robustos

---

#### Notas Técnicas

- Esta versão foca em estabilidade e preparação para v1.0.0
- Nenhuma nova feature visual foi adicionada
- Melhorias internas significativas para performance e manutenibilidade
- Base preparada para implementação de features avançadas
