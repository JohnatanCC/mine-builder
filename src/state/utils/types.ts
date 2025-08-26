import type { BlockData, BlockType, BlockVariant, BlockRotation } from "../../core/types";

export type HistoryOp =
  | { kind: "place"; key: string; type: BlockType; variant?: BlockVariant; rotation?: BlockRotation }
  | { kind: "remove"; key: string; prev: BlockData };

export type HistoryItem = HistoryOp | { kind: "stroke"; ops: HistoryOp[] };