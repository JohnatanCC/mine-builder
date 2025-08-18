import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import { AMBIENT_IDS, AMBIENT_TRACKS, type AmbientId } from "../../audio/ambient";

export const createAudioSlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set) => ({
  audioEnabled: true,
  setAudioEnabled: (v) => set({ audioEnabled: v }),

  audioVolume: 0.5,
  setAudioVolume: (v) => set({ audioVolume: Math.max(0, Math.min(1, v)) }),

  audioTracks: AMBIENT_IDS as AmbientId[],
  currentTrack: (AMBIENT_IDS[0] ?? "") as AmbientId,

  setCurrentTrack: (id: AmbientId) => {
    const exists = id && AMBIENT_TRACKS[id];
    set({ currentTrack: (exists ? id : (AMBIENT_IDS[0] ?? "")) as AmbientId });
  },
});
