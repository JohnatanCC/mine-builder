export type ChangelogItem = { title: string; details?: string };
export type Changelog = { version: string; date: string; items: ChangelogItem[] };

export const CHANGELOG_V010: Changelog = {
  version: "0.1.0",
  date: "2025-08-14",
  items: [
    { title: "Badge de versão + Modal de novidades" },
    { title: "Preview/ghost do bloco (place/delete)" },
    { title: "Hotbar no rodapé com ícones" },
    { title: "Base preparada para Undo/Redo e Save/Load (próximo passo)" },
  ],
};
