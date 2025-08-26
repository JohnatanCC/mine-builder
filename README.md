*# 🟩 Mine Builder

Simulador de construção voxel moderno inspirado no Minecraft, desenvolvido em **React + Three.js**.  
Focado em **prototipagem rápida**, **UX intuitiva** e **performance otimizada**.

> **Versão atual:** v0.4.1 | **Status:** Em desenvolvimento ativo 🚀

## ✨ Principais Recursos

### 🧱 Sistema de Blocos Avançado
- **Variantes Completas**: Blocos, escadas, lajes, cercas e painéis
- **Conectividade Automática**: Cercas e painéis se conectam inteligentemente
- **Rotação Precisa**: Sistema de orientação com separação visual/colisão
- **Persistência Total**: Save/load com suporte completo a variantes e rotações

### 🌍 Mundo Interativo
- **Terreno 24x24**: Área de construção expandida para maior criatividade
- **Sistema de Física**: Colisões precisas e interações realistas
- **Áudio Ambiente**: Sons imersivos com controles de volume
- **Múltiplos Mundos**: Suporte a diferentes cenários salvos

### 🎮 Interface Moderna
- **UI Responsiva**: Adaptada para desktop e mobile
- **Paleta de Blocos**: Seleção intuitiva com preview visual
- **Inspetor de Propriedades**: Configuração detalhada de elementos
- **Controles Otimizados**: Keybinds customizáveis e gestos touch

---

## 🛠️ Stack Tecnológica

- **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- **Estado Global**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Áudio**: Web Audio API

---

## 📥 Instalação & Execução

### Pré-requisitos
- **Node.js** 18+ 
- **npm**, **pnpm** (recomendado) ou **yarn**

### Configuração Rápida
```bash
# Clone o repositório
git clone https://github.com/JohnatanCC/mine-builder.git
cd mine-builder

# Instalar dependências
npm install
# ou
pnpm install

# Executar em modo desenvolvimento
npm run dev
# Acesse: http://localhost:5173

# Build para produção
npm run build
npm run preview
```

### Scripts Disponíveis
```bash
npm run dev     # Servidor de desenvolvimento
npm run build   # Build otimizado para produção
npm run preview # Preview do build de produção
npm run lint    # Verificação de código com ESLint
```

---

## 🆕 Últimas Atualizações

### v0.4.1 — 26/08/2025
**🎯 Sistema Completo de Conectividade de Variantes**

#### Novidades
- **Variantes de Blocos**: Sistema completo com block, stairs, slab, fence, panel
- **Conectividade Automática**: Cercas e painéis se conectam como no Minecraft
- **Rotação Inteligente**: Sistema corrigido com separação visual/colisão
- **Persistência Avançada**: Save/load com suporte total a variantes

#### Melhorias Técnicas
- **Colisão Precisa**: Hitbox invisível 1x1x1 para interação consistente
- **Performance**: Sistema otimizado para construções grandes
- **Escadas Aprimoradas**: Formas automáticas (inner/outer corners)
- **Atualização Reativa**: Vizinhos se atualizam automaticamente

---

## 🎮 Como Usar

### Controles Básicos
- **Movimento**: `WASD` ou `Arrow Keys`
- **Câmera**: `Mouse` para rotacionar
- **Zoom**: `Scroll` do mouse
- **Colocar Bloco**: `Click Esquerdo`
- **Remover Bloco**: `Click Direito`
- **Rotacionar**: `R` antes de colocar
- **Menu**: `Esc` ou `Tab`

### Funcionalidades Avançadas
- **Paleta de Blocos**: Acesse diferentes tipos e variantes
- **Inspetor**: Configure propriedades específicas dos blocos
- **Configurações**: Ajuste áudio, controles e qualidade gráfica
- **Salvar/Carregar**: Gerencie seus mundos criados

---

## 📁 Estrutura do Projeto

```
mine-builder/
├── src/
│   ├── components/     # Componentes 3D (blocos, terreno, efeitos)
│   ├── ui/            # Interface do usuário
│   ├── core/          # Lógica central (blocos, entidades, constantes)
│   ├── state/         # Gerenciamento de estado (Zustand)
│   ├── systems/       # Sistemas (input, texturas, saves)
│   ├── hooks/         # React hooks customizados
│   └── utils/         # Utilitários e helpers
├── public/
│   ├── worlds/        # Mundos pré-construídos
│   └── textures/      # Texturas dos blocos
└── CHANGELOG/         # Histórico de versões
```

---

## 🔮 Roadmap

### v0.5.0 - Sistema de Entidades
- [ ] NPCs e animações
- [ ] Sistema de física avançado
- [ ] Materiais procedurais
- [ ] Texturas dinâmicas

### v0.6.0 - Multiplayer
- [ ] Colaboração em tempo real
- [ ] Chat integrado
- [ ] Permissões de edição

### v0.7.0 - Conteúdo Expandido
- [ ] Novos tipos de blocos
- [ ] Biomas diferentes
- [ ] Sistema de clima

---

## 🤝 Contribuição

Contribuições são muito bem-vindas! 

### Como Contribuir
1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

### Reportar Bugs
- Use as [Issues](https://github.com/JohnatanCC/mine-builder/issues) para reportar bugs
- Inclua passos para reproduzir o problema
- Mencione sua versão do navegador e sistema operacional

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Johnatan Cavalcante**
- GitHub: [@JohnatanCC](https://github.com/JohnatanCC)
- Desenvolvimento assistido por IA

---

<div align="center">

**⭐ Se você gostou do projeto, deixe uma estrela! ⭐**

*Desenvolvido com ❤️ usando React + Three.js*

</div>
*