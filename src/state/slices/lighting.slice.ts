export type LightingSlice = {
  lightAnimate: boolean;
  setLightAnimate: (v: boolean) => void;
  lightSpeed: number;
  setLightSpeed: (v: number) => void;
  lightIntensity: number;
  setLightIntensity: (v: number) => void;
};

export const createLightingSlice = (set: any): LightingSlice => ({
  lightAnimate: true,
  setLightAnimate: (v) => set({ lightAnimate: v }),
  lightSpeed: 0.15,
  setLightSpeed: (v) => set({ lightSpeed: v }),
  lightIntensity: 0.9,
  setLightIntensity: (v) => set({ lightIntensity: v }),
});
