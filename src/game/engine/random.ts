import type { CareerState } from '../types/game';

/** Mulberry32. All randomness belongs to state, including event selection. */
export function random(state: Pick<CareerState,'rng'>): number {
  state.rng = (state.rng + 0x6D2B79F5) >>> 0;
  let t = state.rng;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
export function randomInt(state: Pick<CareerState,'rng'>, min:number, max:number):number {
  return Math.floor(random(state) * (max-min+1)) + min;
}
export function clamp(value:number, min=0, max=100):number { return Math.max(min,Math.min(max,value)); }
