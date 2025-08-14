# Mine Builder

Simulador de construção voxel (estilo Minecraft) em **React + Three.js (@react-three/fiber)**, com hotbar, ghost/preview de blocos, brush com arrasto e Undo/Redo por “stroke”.

> **Status:** beta — focado em prototipagem rápida e UX clara.


## 🏷️ Versão
**Atual:** `v0.1.0 (beta)`  
A versão aparece no app via **VersionBadge**. Ao clicar, abre o **ChangelogModal**. O modal respeita `localStorage` (`seen-version`) para não reaparecer até a próxima atualização.

---

## ✨ Novidades da v0.1.0 (beta)

### UX
- **VersionBadge + ChangelogModal** (usa `localStorage: "seen-version"`).
- **Ghost/Preview** do bloco alvo (voxel adjacente, sem interceptar raycast).
- **Hotbar + HUD** no rodapé *(toggle nas configurações)*.

### Recursos
- **Conta‑gotas** *(middle click / Alt+click)*.
- **Brush com arrasto** *(segurando **Ctrl**)* para construir e destruir rapidamente.
- **Undo/Redo** *(Ctrl/Cmd + Z / Ctrl/Cmd + Y ou Shift+Z)* com **agrupamento por stroke**.
- **Salvar / Carregar / Exportar / Importar** snapshots (serializer).

### Arquitetura & Performance
- **Block Registry** (centraliza tipos/labels/materiais — facilita expansão da paleta).
- **Zustand slices + selectors** (estado modular, renders mais leves).
- **Wireframe OFF por padrão** + versão mesclada quando ON (mais leve).
- **Fog opcional** com **slider de intensidade**.


---

## 🚀 Início Rápido

### Requisitos
- Node 18+
- pnpm (recomendado) ou yarn/npm

### Instalação
```bash
pnpm install
# ou: yarn install
# ou: npm install
```

### Desenvolvimento
```bash
pnpm dev
# normalmente em http://localhost:5173
```

### Build
```bash
pnpm build
pnpm preview
```


---

## 🎮 Controles

### Mouse
- **Esquerdo**: coloca **1** bloco (no voxel adjacente ao bloco mirado).
- **Direito**: apaga **1** bloco.
- **Middle / Alt+Clique (esquerdo)**: **Conta‑gotas** (seleciona o tipo do bloco mirado).
- **Ctrl + Arrastar (Esquerdo)**: **Brush de construção** (contínuo, agrupado no Undo).
- **Ctrl + Arrastar (Direito)**: **Brush de destruição** (contínuo, agrupado no Undo).
- **Scroll + arrasto**: OrbitControls (girar/zoom).  
  > **Segurar Ctrl trava a câmera** (Orbit desabilita enquanto Ctrl está pressionado).

### Teclado
- **1..0**: seleção rápida de blocos.
- **Ctrl/Cmd + Z**: **Undo** (desfaz um stroke inteiro).
- **Ctrl/Cmd + Shift + Z** ou **Ctrl/Cmd + Y**: **Redo**.
- **H / ? (Shift+/)**: abre/fecha o **Guia de Controles**.
- **Esc**: fecha o guia.

> **Anti-clique acidental:** cliques simples só disparam no **pointerup** se o movimento for pequeno (≤ 4px) e com **cooldown** (120 ms).


---

## 💾 Snapshots (Salvar / Carregar / Exportar / Importar)

Use o painel de **Save/Load**:
- **Salvar [1..3]** → grava snapshot no `localStorage`.
- **Carregar [1..3]** → restaura snapshot.
- **Exportar JSON** → baixa o mundo atual (JSON).
- **Importar JSON** → carrega um snapshot.
- **Limpar Mundo** → limpa tudo.

Notas:
- O **Ground** usa setters “silenciosos” → não polui histórico (Undo começa limpo).
- **Carregar / Importar / Limpar** zera o histórico (**Undo/Redo**).


---

## 🧱 Registro de Blocos (Block Registry)

Centraliza **tipos/labels/materiais**, incluindo faces especiais (ex.: grama topo/lado; troncos casca/anéis).  
Objetivos:
- Adicionar/alterar blocos sem mexer em múltiplos arquivos;
- Manter consistência visual e de comportamento;
- Servir como “fonte única da verdade” para UI/Hotbar/Preview.


---

## 🧠 Estado & Histórico (Zustand)

- **Slices + selectors** para evitar renders desnecessários.
- Histórico por **stroke**: `beginStroke()` / `endStroke()` agrupam ações do brush em um único item.
- **Undo/Redo** operam tanto em ações simples quanto em strokes.


---

## ⚙️ Performance

- **Wireframe OFF** por padrão (quando ligado, usa versão mesclada/leve).
- **Fog opcional** com **slider** (ajuste para máquinas mais modestas).
- Texturas procedurais com `CanvasTexture` (sRGB, filtros `Nearest*`).
- Luz direcional com shadow map configurado + ambient leve.
- **Ghost/Highlight** com raycast no‑op (não interferem na seleção).


---

## 🔧 Estrutura de Pastas (sugerida)

```
src/
  core/
    blocks/              # registro e helpers
    materials.ts         # materiais p/ blocos (não-folha)
    leafMaterial.ts      # shader/hook de vento para folhas
    constants.ts         # GROUND_SIZE, etc.
    keys.ts              # key(x,y,z), parseKey
    types.ts             # BlockType, Pos, etc.
    version.ts           # APP_VERSION ("0.1.0")
  state/
    world.store.ts       # Zustand (slices, histórico por stroke)
  systems/
    input/useClickGuard.ts  # drag threshold + cooldown
    world/serializer.ts     # snapshots, JSON, localStorage
  components/            # World, Block, Ground, Lights, ...
  ui/                    # Hotbar, HUD, SettingsPanel, ControlsGuide, ...
  textures.ts            # texturas procedurais
```


---

## 🗺️ Roadmap (curto prazo)

- Registry carregável por **JSON** (adicionar blocos via arquivo).
- Ferramentas: **balde/preencher**, **linha/retângulo**, **pipeta avançada**.
- **Camadas** (colidir/ocultar, duplicar, export por layer).
- **Atalhos configuráveis**; modificador alternativo ao **Ctrl** (ex.: Shift).
- Snapshots nomeados (com miniatura) + galeria.


---

## 🗃️ Changelog

### [v0.1.0] — 2025-08-14 (beta)
**UX**
- VersionBadge + ChangelogModal (usa `localStorage: "seen-version"`).
- Ghost/Preview de bloco; Hotbar/HUD (toggle nas configs).

**Recursos**
- Conta‑gotas (middle/Alt+click).
- Brush com arrasto (apenas com **Ctrl**).
- Undo/Redo por stroke; Save/Load/Export/Import (serializer).

**Arquitetura/Perf**
- Block Registry; Zustand slices + selectors.
- Wireframe OFF por padrão (versão leve quando ON).
- Fog opcional + slider.

### [v0.0.0] — 2025-08-10 (beta)
- Primeira versão pública com ambiente 3D, blocos básicos e grid.

> Para histórico detalhado, veja **Releases** no GitHub ou `CHANGELOG.md` (opcional).


---

## 🤝 Contribuindo
1. Faça um fork.
2. Crie sua branch: `feat/minha-feature`.
3. Commits: `feat(ui): adiciona tooltip na hotbar` (padrão *Conventional Commits*).
4. Abra um Pull Request.


## 📄 Licença
Defina a licença (ex.: MIT) e inclua `LICENSE` na raiz.


## 📬 Suporte
Abra uma **Issue** com:
- Passos para reproduzir,
- Prints/logs,
- Navegador/SO,
- Versão do app (veja o **VersionBadge**).
