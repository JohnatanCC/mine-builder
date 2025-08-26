import type { Pos } from './types';

// Posições/coordenadas (mantido para compatibilidade)
export const key = (x:number,y:number,z:number) => `${x},${y},${z}`;
export const parseKey = (k:string): Pos => k.split(',').map(Number) as Pos;

// Hotkeys centralizadas
export const HOTKEYS = {
  // Undo/Redo
  UNDO: ['z', 'Z'],
  REDO: ['y', 'Y'],
  
  // Ferramentas
  TOGGLE_WIREFRAME: ['g', 'G'],
  CYCLE_ENV: ['l', 'L'],
  TOGGLE_HUD: ['h', 'H'],
  COMMAND_MENU: ['k', 'K'],
  
  // Hotbar (slots de blocos)
  HOTBAR_SLOTS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  
  // Modificadores
  CTRL: 'ctrlKey',
  SHIFT: 'shiftKey',
  ALT: 'altKey',
  META: 'metaKey',
  
  // Mouse
  EYEDROPPER: 'middle', // clique do meio
  EYEDROPPER_ALT: 'alt+click', // alt+clique
  
  // Navegação
  ESCAPE: ['Escape'],
} as const;

// Helper para verificar se uma tecla corresponde a um hotkey
export const isHotkey = (event: KeyboardEvent, hotkey: string | readonly string[]): boolean => {
  const keys = Array.isArray(hotkey) ? hotkey : [hotkey];
  return keys.some(key => 
    key.toLowerCase() === event.key.toLowerCase() || 
    key === event.code
  );
};

// Helper para verificar modificadores
export const hasModifier = (event: KeyboardEvent, modifier: keyof typeof HOTKEYS): boolean => {
  switch (modifier) {
    case 'CTRL': return event.ctrlKey || event.metaKey;
    case 'SHIFT': return event.shiftKey;
    case 'ALT': return event.altKey;
    case 'META': return event.metaKey;
    default: return false;
  }
};
