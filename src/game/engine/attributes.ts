import type { Attributes, CareerState, Effects, Position } from '../types/game';
import { ATTRIBUTE_KEYS } from './constants';
import { clamp, random } from './random';
import { getClub } from '../data/clubs';

const WEIGHTS:Record<Position,Attributes> = {
  striker:{technique:.29,pace:.19,fitness:.14,vision:.10,discipline:.11,mentality:.17},
  winger:{technique:.25,pace:.28,fitness:.15,vision:.16,discipline:.08,mentality:.08},
  midfielder:{technique:.21,pace:.09,fitness:.14,vision:.30,discipline:.14,mentality:.12},
  defender:{technique:.11,pace:.12,fitness:.24,vision:.25,discipline:.17,mentality:.11},
};
export function overall(state:Pick<CareerState,'attributes'|'config'>):number {
  return Math.round(ATTRIBUTE_KEYS.reduce((sum,key)=>sum+state.attributes[key]*WEIGHTS[state.config.position][key],0));
}
export function applyEffects(state:CareerState,effects:Effects):void {
  const ceiling=clamp(state.potential+state.attributes.discipline/20+(state.flags.includes('mentor')?2:0),65,99);
  for(const key of ATTRIBUTE_KEYS) if(effects[key]) {
    const next=clamp(state.attributes[key]+effects[key]!);
    state.attributes[key]=effects[key]!>0?Math.min(Math.max(state.attributes[key],ceiling),next):next;
  }
  for(const key of ['morale','reputation','trust','injuryRisk','playingTime'] as const) if(effects[key]) state[key]=clamp(state[key]+effects[key]!);
  if(effects.money) state.money=Math.max(0,state.money+effects.money);
  for(const key of ['rival','mentor','family'] as const) if(effects[key]) state.relationships[key]=clamp(state.relationships[key]+effects[key]!);
  state.peakReputation = Math.max(state.peakReputation,state.reputation);
}
export function effectDifference(before:CareerState,after:CareerState):Effects {
  const effects:Effects={};
  for(const key of ATTRIBUTE_KEYS) { const change=Math.round((after.attributes[key]-before.attributes[key])*10)/10; if(change) effects[key]=change; }
  for(const key of ['morale','reputation','trust','injuryRisk','playingTime','money'] as const) { const change=Math.round(after[key]-before[key]); if(change) effects[key]=change; }
  for(const key of ['rival','mentor','family'] as const) { const change=after.relationships[key]-before.relationships[key]; if(change) effects[key]=change; }
  return effects;
}
/** Effective potential rewards habits without allowing age alone to produce a star. */
export function develop(state:CareerState,age:number):void {
  const club = getClub(state.clubId);
  const diligence=state.attributes.discipline/100;
  const habits=(state.flags.includes('disciplined')?.22:0)-(state.flags.includes('neglect')?.22:0);
  const minutes=age<18? .75 : .22+state.playingTime/130;
  const base=age<13?2.5:age<18?3.4:age<23?2.5:age<28?1.3:age<31?.5:0;
  const ceiling=clamp(state.potential + diligence*5 + (state.flags.includes('mentor')?2:0) - (state.flags.includes('neglect')?7:0),65,99);
  for(const key of ATTRIBUTE_KEYS) {
    const gap=Math.max(0,(ceiling-state.attributes[key])/40);
    const development=base*(.35+diligence*.65+habits)*(0.65+club.training/130)*minutes*gap;
    const variation=.8+random(state)*.4;
    let delta=development*variation;
    if(age>=30 && (key==='pace'||key==='fitness')) {
      const care=.35+(100-state.attributes.fitness)/120+state.majorInjuries*.14+(state.flags.includes('neglect')?.35:0);
      delta-=care*(age>=34?1.35:1)*(key==='pace'?1.3:1);
    }
    if(age>=32 && key==='technique') delta-=.18+state.majorInjuries*.03;
    if(age>=29 && (key==='vision'||key==='mentality')) delta+=.2+state.playingTime/500;
    if(state.injury>0 && (key==='pace'||key==='fitness')) delta-=state.injury*.13;
    // Positive development stops at the ceiling; decisions retain their meaningful immediate effects.
    if(delta>0) state.attributes[key]=Math.min(Math.max(state.attributes[key],ceiling),state.attributes[key]+delta);
    else state.attributes[key]=clamp(state.attributes[key]+delta);
    state.attributes[key]=Math.round(clamp(state.attributes[key])*10)/10;
  }
}
