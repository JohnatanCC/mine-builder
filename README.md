# 🟩 Mine Builder

Simulador de construção voxel (estilo Minecraft) feito em **React + Three.js (@react-three/fiber)**.  
Focado em **prototipagem rápida** e **UX clara**, criação por Johnatan Cavalcante, codigos por GPT5.

> **Status:** beta — em evolução constante 🚀

---

## 🛠️ Tecnologias Utilizadas
- [React](https://react.dev/)
- [Three.js](https://threejs.org/) + [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- [Zustand](https://github.com/pmndrs/zustand) (estado global)
- Vite (build & dev server)

---

## 📥 Instalação & Execução

### Pré-requisitos
- Node.js **18+**
- pnpm (recomendado) ou npm/yarn

### Passos
```bash
# Instalar dependências
pnpm install
# ou: yarn install
# ou: npm install

# Ambiente de desenvolvimento
pnpm dev
# acessível em http://localhost:5173

# Build para produção
pnpm build
pnpm preview
```

---

## 📖 Changelog

### [v0.1.3] — 2025-08-16
**Novidades**
- Ajuste dinâmico do terreno (8×8 até 24×24).
- UI de configuração do terreno no painel lateral.
- Melhorias visuais e UX do painel.

---

### [v0.1.2] — 2025-08-15
**Novidades**
- Anti-clique acidental: suavização no clique para evitar blocos indesejados.
- Preview “ghost” vermelho para exclusão.
- Correções no comportamento do Ctrl (brush de construção e destruição).

---

### [v0.1.1] — 2025-08-15
**Novidades**
- **Conta-gotas**: selecionar tipo de bloco com clique do meio ou Alt+clique.
- Brush contínuo com **Ctrl+arrasto** (place/delete).
- Undo/Redo por stroke aprimorado.

---

### [v0.1.0] — 2025-08-14
**Primeira release beta**
- **UX**: VersionBadge + ChangelogModal; Hotbar/HUD (toggle).
- **Recursos**: conta-gotas, Undo/Redo, Save/Load/Export/Import.
- **Arquitetura**: Block Registry, Zustand slices + selectors.
- **Performance**: Wireframe OFF por padrão; fog opcional.

---

### [v0.0.0] — 2025-08-10
**Protótipo inicial**
- funções basicas, ambiente 3d, colocar e deletar blocos;

---

## 📄 Licença
Defina a licença (ex.: MIT) no arquivo `LICENSE`.

---

## 📬 Suporte & Contribuição
- Abra uma **Issue** para bugs ou sugestões.
- Pull Requests são bem-vindos 🎉
