import type { BlockData } from '../../core/types';
import { useWorld } from '../../state/world.store';



export type WorldSnapshotV1 = {
  version: 1;
  // pares [key "x,y,z", { type }]
  blocks: Array<[string, BlockData]>;
};

const VERSION: WorldSnapshotV1['version'] = 1;

/** Tira um snapshot do estado atual (Map -> array serializável) */
export function takeSnapshot(): WorldSnapshotV1 {
  const { blocks } = useWorld.getState();
  return { version: VERSION, blocks: Array.from(blocks.entries()) };
}

/** Carrega um snapshot no estado */
export function loadSnapshot(
  snap: WorldSnapshotV1,
  opts: { merge?: boolean } = {}
) {
  const st = useWorld.getState();
  const base = opts.merge ? new Map(st.blocks) : new Map<string, BlockData>();
  for (const [k, data] of snap.blocks) base.set(k, data);
useWorld.setState({ blocks: base, past: [], future: [], currentStroke: null });
}

/** Exporta para JSON (string) */
export function exportJSON(space: number = 0): string {
  return JSON.stringify(takeSnapshot(), null, space);
}

/** Importa de JSON (string) */
export function importJSON(json: string, opts?: { merge?: boolean }) {
  const parsed = JSON.parse(json) as WorldSnapshotV1;
  if (parsed?.version !== 1 || !Array.isArray(parsed.blocks)) {
    throw new Error('Snapshot inválido ou versão não suportada.');
  }
  loadSnapshot(parsed, opts);
}

/** Limpa o mundo (remove todos os blocos) */
export function clearWorld() {
  useWorld.setState({ blocks: new Map() });
}

/** Helpers com LocalStorage */
const DEFAULT_KEY = 'worldSnapshot';

export function saveToLocalStorage(key = DEFAULT_KEY) {
  localStorage.setItem(key, exportJSON());
}

export function loadFromLocalStorage(key = DEFAULT_KEY, opts?: { merge?: boolean }) {
  const raw = localStorage.getItem(key);
  if (!raw) throw new Error(`Nada salvo em localStorage com a chave "${key}".`);
  importJSON(raw, opts);
}



