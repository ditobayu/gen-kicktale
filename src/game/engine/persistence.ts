import type { CareerState, Result, Season } from '../types/game';
import { EVENTS } from '../data/events';
import { CLUBS } from '../data/clubs';
import { ENDINGS } from '../data/endings';
import { AGE_SCHEDULE, ATTRIBUTE_KEYS, chapterForAge } from './constants';
import { eventEligible } from './events';
import { endingId } from './endings';

export const SAVE_KEY='kicktale_save_v1';
export interface CareerStorage { getItem(key:string):string|null; setItem(key:string,value:string):void; removeItem(key:string):void; }
type Obj=Record<string,unknown>;
const object=(value:unknown):value is Obj=>typeof value==='object' && value!==null && !Array.isArray(value);
const number=(value:unknown,min=0,max=Number.MAX_SAFE_INTEGER):value is number=>typeof value==='number' && Number.isFinite(value) && value>=min && value<=max;
const integer=(value:unknown,min=0,max=Number.MAX_SAFE_INTEGER):value is number=>number(value,min,max) && Number.isInteger(value);
const string=(value:unknown,max=10000):value is string=>typeof value==='string' && value.length<=max;
const hasClub=(id:unknown):id is string=>typeof id==='string' && CLUBS.some(club=>club.id===id);
const values=(value:unknown,min:number,max:number,keys:readonly string[]):boolean=>object(value) && keys.every(key=>number(value[key],min,max));
const lists=(value:unknown,max=200):value is unknown[]=>Array.isArray(value) && value.length<=max;

function validSeason(value:unknown,aggregate=false):value is Season {
  if(!object(value) || !integer(value.age,18,37) || !hasClub(value.clubId)) return false;
  const maximum=aggregate?160:49;
  if(!integer(value.appearances,0,maximum) || !number(value.rating,0,10)) return false;
  if(!['goals','assists','defensive','cleanSheets','trophies','awards'].every(key=>integer(value[key],0,aggregate?1000:400))) return false;
  return (value.cleanSheets as number)<=value.appearances && (value.appearances!==0 || value.rating===0);
}
function validResult(value:unknown):value is Result {
  if(!object(value)||!string(value.eventId,100)||!string(value.choiceId,100)||!string(value.title,500)||!string(value.text)||typeof value.success!=='boolean'||!object(value.changes)) return false;
  if(value.probability!==undefined && !number(value.probability,0,1)) return false;
  if(!Object.values(value.changes).every(change=>typeof change==='number'&&Number.isFinite(change))) return false;
  if(!['dribble','shoot','pass','tackle','training','contract','injury','trophy','bench','farewell'].includes(value.action as string) || !['street','academy','stadium','training','office','medical','locker'].includes(value.scene as string) || !string(value.variant,100)) return false;
  if(value.season!==undefined && !validSeason(value.season,true)) return false;
  return value.memory===undefined || string(value.memory);
}

/** Reject partial, outdated, and inconsistent saves before any UI dereferences nested fields. */
export function isCareerState(value:unknown):value is CareerState {
  if(!object(value) || value.version!==1 || !object(value.config)) return false;
  const config=value.config;
  if(!string(config.name,28)||!config.name.trim()||!['striker','winger','midfielder','defender'].includes(config.position as string)||!['right','left'].includes(config.foot as string)||!object(config.appearance)) return false;
  if(!string(config.appearance.skin,50)||!['crop','curls','sweep'].includes(config.appearance.hair as string)||!['classic','spark','calm'].includes(config.appearance.preset as string)) return false;
  if(!integer(value.seed,0,4294967295)||!integer(value.rng,0,4294967295)||!integer(value.step,0,19)||value.age!==AGE_SCHEDULE[value.step]||value.chapter!==chapterForAge(value.age as number)) return false;
  if(!values(value.attributes,0,100,ATTRIBUTE_KEYS)||!number(value.potential,65,99)||!hasClub(value.clubId)) return false;
  if(!['playingTime','trust','reputation','peakReputation','morale','injuryRisk'].every(key=>number(value[key],0,100))) return false;
  if((value.peakReputation as number)<(value.reputation as number)||!number(value.injury,0,14)) return false;
  if(!['majorInjuries','money','appearances','goals','assists','defensive','cleanSheets','trophies','awards','nationalCaps','coaching'].every(key=>integer(value[key]))) return false;
  if(!values(value.relationships,0,100,['rival','mentor','family'])) return false;
  if(!lists(value.flags,150)||!value.flags.every(flag=>string(flag,100))||new Set(value.flags).size!==value.flags.length) return false;
  if(!lists(value.completed,20)||!value.completed.every(id=>string(id,100))||new Set(value.completed).size!==value.completed.length||!lists(value.history,20)||!lists(value.transfers,30)||!lists(value.timeline,200)||!lists(value.seasons,20)) return false;
  const state=value as unknown as CareerState;
  if((state.age<18 && state.clubId!=='cakrawala') || (state.age>=18 && state.clubId==='cakrawala')) return false;
  if(!['decision','result','ending'].includes(state.phase)) return false;
  const count=state.phase==='decision'?state.step:state.step+1;
  if(state.history.length!==count||state.completed.length!==count) return false;
  if(state.phase==='ending' && (state.step!==19||!ENDINGS.some(ending=>ending.id===state.endingId))) return false;
  if(state.phase!=='ending' && state.endingId!==null) return false;
  if(!state.history.every((entry,index)=>object(entry)&&entry.age===AGE_SCHEDULE[index]&&entry.eventId===state.completed[index]&&EVENTS.some(event=>event.id===entry.eventId&&event.chapter===chapterForAge(entry.age)&&entry.age>=event.minAge&&entry.age<=event.maxAge&&event.choices.some(choice=>choice.id===entry.choiceId)))) return false;
  const current=EVENTS.find(event=>event.id===state.currentEventId);
  if(!current || current.chapter!==state.chapter || state.age<current.minAge || state.age>current.maxAge) return false;
  if(state.phase==='decision' && (!eventEligible(state,current)||state.result!==null)) return false;
  if(state.phase!=='decision' && (!validResult(state.result)||state.result.eventId!==state.currentEventId||state.history[count-1].eventId!==state.currentEventId||state.history[count-1].choiceId!==state.result.choiceId)) return false;
  if(!state.transfers.every(transfer=>object(transfer)&&integer(transfer.age,18,38)&&hasClub(transfer.from)&&hasClub(transfer.to)&&transfer.from!==transfer.to)) return false;
  if(!state.timeline.every(entry=>object(entry)&&integer(entry.age,8,38)&&string(entry.title,500)&&string(entry.text)&&['decision','transfer','injury','trophy','chapter','national'].includes(entry.kind))) return false;
  if(!state.seasons.every(season=>validSeason(season))) return false;
  // A decision checkpoint contains seasons through age−1; a result includes the interval it just simulated.
  const through=state.phase==='decision'?state.age:(AGE_SCHEDULE[state.step+1]??38);
  const seasonCount=Math.max(0,through-18);
  if(state.seasons.length!==seasonCount||!state.seasons.every((season,index)=>season.age===18+index)) return false;
  for(const key of ['appearances','goals','assists','defensive','cleanSheets','trophies','awards'] as const) if(state[key]!==state.seasons.reduce((sum,season)=>sum+season[key],0)) return false;
  if(state.phase==='ending' && state.endingId!==endingId(state)) return false;
  return true;
}

function storageOrNull(provided?:CareerStorage):CareerStorage|null {
  if(provided) return provided;
  try { return typeof globalThis.localStorage==='undefined'?null:globalThis.localStorage; } catch { return null; }
}
export function saveCareer(state:CareerState,provided?:CareerStorage):boolean {
  const storage=storageOrNull(provided);
  if(!storage || !isCareerState(state)) return false;
  try { storage.setItem(SAVE_KEY,JSON.stringify(state)); return true; } catch { return false; }
}
export function loadCareer(provided?:CareerStorage):CareerState|null {
  const storage=storageOrNull(provided);
  if(!storage) return null;
  try { const raw=storage.getItem(SAVE_KEY); if(!raw) return null; const parsed:unknown=JSON.parse(raw); return isCareerState(parsed)?parsed:null; } catch { return null; }
}
export function hasCorruptSave(provided?:CareerStorage):boolean {
  const storage=storageOrNull(provided);
  if(!storage) return false;
  try { const raw=storage.getItem(SAVE_KEY); return raw!==null && loadCareer(storage)===null; } catch { return false; }
}
export function deleteCareer(provided?:CareerStorage):boolean {
  const storage=storageOrNull(provided);
  if(!storage) return false;
  try { storage.removeItem(SAVE_KEY); return true; } catch { return false; }
}
