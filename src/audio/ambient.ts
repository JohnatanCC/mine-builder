import Ambient1 from "../assets/sounds/ambient/AMBIENT1.ogg";
import Ambient2 from "../assets/sounds/ambient/AMBIENT2.ogg";
import Ambient3 from "../assets/sounds/ambient/AMBIENT3.ogg";


export type AmbientId = string;

// Mapa "nome-do-arquivo" -> URL resolvida (pelo bundler)
export const AMBIENT_TRACKS: Record<AmbientId, string> = {
  "AMBIENTT1": Ambient1,
  "AMBIENTT2": Ambient2,
  "AMBIENTT3": Ambient3,
};

// Lista de IDs (mesmo texto que aparece no select do painel)
export const AMBIENT_IDS: AmbientId[] = Object.keys(AMBIENT_TRACKS);
