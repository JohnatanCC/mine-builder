import { useWorld, type WorldState } from "../world.store";


// Selectors compatíveis (podem ser usados com useWorld(select))
export const selectWindEnabled = (s: WorldState) => s.windEnabled;
export const selectWindStrength = (s: WorldState) => s.windStrength;
export const selectWindSpeed = (s: WorldState) => s.windSpeed;

// Setters delegando para o slice oficial (visual/combined no world.store)
export function setWindEnabled(v: boolean) {
  useWorld.getState().setWindEnabled(v);
}
export function setWindStrength(v: number) {
  useWorld.getState().setWindStrength(v);
}
export function setWindSpeed(v: number) {
  useWorld.getState().setWindSpeed(v);
}