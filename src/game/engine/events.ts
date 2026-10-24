import type { CareerState, StoryEvent } from '../types/game';
import { EVENTS } from '../data/events';
import { getClub } from '../data/clubs';
import { overall } from './attributes';
import { random } from './random';

export function eventEligible(state:CareerState,event:StoryEvent):boolean {
  if(state.completed.includes(event.id) || event.chapter!==state.chapter || state.age<event.minAge || state.age>event.maxAge) return false;
  const condition=event.conditions;
  if(!condition) return true;
  const tier=getClub(state.clubId).tier;
  return (condition.minOverall===undefined || overall(state)>=condition.minOverall)
    && (condition.minReputation===undefined || state.reputation>=condition.minReputation)
    && (condition.minTier===undefined || tier>=condition.minTier)
    && (condition.maxTier===undefined || tier<=condition.maxTier)
    && (!condition.flag || state.flags.includes(condition.flag))
    && (!condition.notFlag || !state.flags.includes(condition.notFlag))
    && (condition.injured===undefined || (state.injury>0)===condition.injured);
}
export function eligibleEvents(state:CareerState):StoryEvent[] { return EVENTS.filter(event=>eventEligible(state,event)); }
export function selectEvent(state:CareerState):StoryEvent {
  const eligible=eligibleEvents(state);
  const forcedByAge:Record<number,string>={8:'childhood_first',18:'professional_contract',33:'retirement_crossroads',38:'retirement_farewell'};
  const forced=eligible.find(event=>event.id===forcedByAge[state.age]);
  if(forced) return forced;
  if(!eligible.length) throw new Error(`Tidak ada peristiwa yang sesuai untuk usia ${state.age}.`);
  const total=eligible.reduce((sum,event)=>sum+Math.max(.01,event.weight),0);
  let roll=random(state)*total;
  for(const event of eligible) { roll-=Math.max(.01,event.weight); if(roll<0) return event; }
  return eligible[eligible.length-1];
}
export function getEvent(state:CareerState):StoryEvent {
  const event=EVENTS.find(event=>event.id===state.currentEventId);
  if(!event) throw new Error('Peristiwa dalam simpanan ini tidak ditemukan.');
  // Result checkpoints still refer to the just-completed event.
  if(state.phase==='decision' && !eventEligible(state,event)) throw new Error('Peristiwa ini tidak cocok dengan tahap karier.');
  return event;
}
