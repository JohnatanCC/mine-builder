import type { Pos } from './types';

export const key = (x:number,y:number,z:number) => `${x},${y},${z}`;
export const parseKey = (k:string): Pos => k.split(',').map(Number) as Pos;
