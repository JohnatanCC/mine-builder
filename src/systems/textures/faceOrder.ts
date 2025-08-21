// Ordem de materiais esperada por THREE BoxGeometry:
// [right(+X), left(-X), top(+Y), bottom(-Y), front(+Z), back(-Z)]
import type { FaceName } from "@/core/constants";

export const FACE_INDEX: Record<FaceName, number> = {
  east: 0,
  west: 1,
  top: 2,
  bottom: 3,
  south: 4,
  north: 5,
};

export const SIDE_FACES: FaceName[] = ["north", "south", "east", "west"];
export const ALL_INDICES = [0, 1, 2, 3, 4, 5];
