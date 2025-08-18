import type { BlockData, BlockType } from "../../core/types";

export type HistoryOp =
  | { kind: "place"; key: string; type: BlockType }
  | { kind: "remove"; key: string; prev: BlockData };

export type HistoryItem = HistoryOp | { kind: "stroke"; ops: HistoryOp[] };