import * as React from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useWorld } from '../../state/world.store';

const ACTION_COOLDOWN = 120; // ms entre cliques válidos
const DRAG_THRESHOLD = 4;    // px de tolerância de arrasto para ainda ser "clique"

export function useClickGuard() {
  const down = React.useRef<{ x: number; y: number; time: number; button: number } | null>(null);

  const setDown = (e: ThreeEvent<PointerEvent>) => {
    down.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      button: e.button,
    };
  };

  const isClick = (e: ThreeEvent<PointerEvent>) => {
    if (!down.current) return false;
    const dx = Math.abs(e.clientX - down.current.x);
    const dy = Math.abs(e.clientY - down.current.y);
    return dx <= DRAG_THRESHOLD && dy <= DRAG_THRESHOLD;
  };

  const getButton = () => down.current?.button ?? 0;

  const canFire = () => {
    const st = useWorld.getState();
    const now = performance.now();
    if (now - st.lastActionAt < ACTION_COOLDOWN) return false;
    st.setLastActionAt(now);
    return true;
  };

  return { setDown, isClick, getButton, canFire };
}
