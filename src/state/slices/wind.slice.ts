export type WindSlice = {
  windEnabled: boolean;
  setWindEnabled: (v: boolean) => void;
  windStrength: number;
  setWindStrength: (v: number) => void;
  windSpeed: number;
  setWindSpeed: (v: number) => void;
};

export const createWindSlice = (set: any): WindSlice => ({
  windEnabled: true,
  setWindEnabled: (v) => set({ windEnabled: v }),
  windStrength: 0.35,
  setWindStrength: (v) => set({ windStrength: v }),
  windSpeed: 0.6,
  setWindSpeed: (v) => set({ windSpeed: v }),
});
