import type { CareerState, Choice, Club, ClubHistory, StoryEvent, TransferDecision, TransferOffer } from '../types/game';
import { CLUBS, getClub, HOME_CLUB_ID } from '../data/clubs';
import { overall } from './attributes';
import { clamp } from './random';

export const TRANSFER_MILESTONES:Record<number,string>={16:'academy_club',18:'professional_contract',22:'professional_pathway',27:'prime_transfer',33:'retirement_crossroads'};
const scheduledIds=new Set(Object.values(TRANSFER_MILESTONES));
const optionalIds=new Set(['professional_bench','retirement_last_offer']);
export function isTransferEvent(event:StoryEvent|string):boolean { const id=typeof event==='string'?event:event.id; return scheduledIds.has(id)||optionalIds.has(id); }
export function scheduledTransferAge(id:string):number|undefined { const entry=Object.entries(TRANSFER_MILESTONES).find(([,eventId])=>eventId===id); return entry?Number(entry[0]):undefined; }
export function isAcademy(club:Club):boolean { return club.level==='academy'; }
function hash(value:string):number { let h=2166136261; for(let i=0;i<value.length;i++) h=Math.imul(h^value.charCodeAt(i),16777619); return (h>>>0)/4294967296; }
function recentForm(state:CareerState):{rating:number;appearances:number;injuries:number} {
  const seasons=state.seasons.slice(-3);
  const appearances=seasons.reduce((sum,season)=>sum+season.appearances,0);
  return {rating:appearances?seasons.reduce((sum,s)=>sum+s.rating*s.appearances,0)/appearances:6.5,appearances,injuries:state.timeline.filter(entry=>entry.kind==='injury'&&entry.age>=state.age-3).length};
}
/** Stable interest combines club needs with the player's actual recent career, never refresh RNG. */
function interest(state:CareerState,club:Club):number {
  const form=recentForm(state);
  const positionalNeed=hash(`${club.id}:${state.config.position}`)*12-6;
  const variance=hash(`${state.seed}:${state.age}:${club.id}:scout`)*16-8;
  const continuity=state.scoutInterest?.[club.id]??50;
  return Math.round(clamp(30+(overall(state)-club.difficulty)*.9+state.reputation*.27+(form.rating-6.5)*9+(state.potential-85)*.5+(state.trust-50)*.12+(state.playingTime-60)*.1-state.injury*2-form.injuries*2+positionalNeed+variance+(continuity-50)*.08));
}
export function getOffers(state:CareerState):Club[] {
  const ability=overall(state),form=recentForm(state);
  return CLUBS.filter(club=>{
    if(club.id===state.clubId) return false;
    if(state.age<18) return isAcademy(club);
    if(isAcademy(club)) return false;
    const domestic=club.country==='Indonesia';
    if(domestic) return club.tier===1 || (club.tier===2&&ability>=55&&state.reputation>=10) || (club.tier===3&&ability>=69&&state.reputation>=29);
    // First professional years always take place in Indonesia, even for exceptional youth seeds.
    if(state.age<21 || form.appearances<25 || state.injury>6 || form.injuries>=3 || state.trust<28) return false;
    const scouting=interest(state,club);
    if(club.level==='asia') return ability>=61&&state.reputation>=20&&form.rating>=6.3&&scouting>=34 && (club.tier<3||ability>=71&&state.reputation>=35);
    if(club.level==='europe-development') return ability>=68&&state.reputation>=27&&form.rating>=6.55&&state.potential>=80&&scouting>=40;
    if(club.level==='europe-mid') return ability>=76&&state.reputation>=43&&form.rating>=6.8&&form.appearances>=40&&state.trust>=36&&state.injury<=4&&scouting>=45;
    return state.age>=23&&ability>=84&&state.reputation>=67&&form.rating>=7.05&&form.appearances>=55&&state.trust>=40&&state.injury<=3&&scouting>=45;
  }).sort((a,b)=>b.tier-a.tier||interest(state,b)-interest(state,a)||b.prestige-a.prestige||a.id.localeCompare(b.id));
}
export function expectedMinutes(state:CareerState,club:Club):number {
  if(state.age<18) return Math.round(clamp(club.opportunity+(overall(state)-70)*.3+(state.trust-50)*.1,30,96));
  return Math.round(clamp(club.opportunity+(overall(state)-(club.difficulty+8))*1.1+(state.reputation-40)*.2+(state.trust-50)*.12-(state.injury>3?12:0),18,98));
}
function roleFor(minutes:number,age:number):string { return age<18?minutes>=78?'Andalan tim akademi':'Prospek pengembangan':minutes>=82?'Pemain inti':minutes>=65?'Rotasi utama':minutes>=45?'Penantang tim utama':'Prospek / pelapis'; }
function offerFor(state:CareerState,club:Club,kind:'offer'|'stay'):TransferOffer {
  const playingTime=kind==='stay'&&state.age!==18?Math.round(clamp(state.playingTime+5,18,98)):expectedMinutes(state,club);
  const role=roleFor(playingTime,state.age);
  const salary=state.age<18?0:Math.round(club.salary*(.78+Math.min(100,state.reputation)/260+(playingTime>=80?.07:0))/1000000)*1000000;
  const pressure=club.difficulty>=85?'Sangat tinggi':club.difficulty>=70?'Tinggi':club.difficulty>=55?'Sedang':'Terukur';
  const development=state.age<18?`Latihan ${club.training}/100 · pendidikan sekolah tetap berjalan`:`Latihan ${club.training}/100 · ${playingTime>=75?'berkembang lewat menit rutin':club.training>=80?'fasilitas kuat; menit harus direbut':'program individu dan rotasi'}`;
  let description=kind==='stay'?`Pelatih ${club.name} menawarkan kesinambungan, kepercayaan, dan target peran yang jelas.`:club.level==='academy'?`${club.name} menyiapkan sekolah dan latihan ${club.youth>=95?'individual':'kompetitif'}; ${playingTime>=78?'ruang tampil lebih luas':'persaingan mendorong teknikmu'}.`:club.country==='Indonesia'?`${club.name} membutuhkan ${state.config.position==='defender'?'pembaca pertahanan':state.config.position==='midfielder'?'pengatur tempo':'penyerang ruang'}; tanggung jawab nyata di sepak bola Indonesia.`:`Pencari bakat ${club.name} menilai ${recentForm(state).appearances} penampilan terakhirmu. Adaptasi, fasilitas, dan persaingan datang bersama kontrak ini.`;
  if(state.age===18&&kind==='stay') description=`Jalur senior Cakrawala menawarkan kontrak profesional pertama di ${club.name}, dekat rumah di Surabaya.`;
  if(state.age>=33&&club.id===HOME_CLUB_ID) description='Pulang ke Surabaya, memimpin pemain muda, dan membayar kepercayaan kota yang membesarkanmu.';
  return {id:`${kind==='stay'?'stay':'offer'}:${club.id}`,clubId:club.id,kind,salary,playingTime,role,development,pressure,description,trust:kind==='stay'?Math.round(clamp(state.trust+9)):Math.round(clamp(44+(state.attributes.discipline-50)*.22+(club.youth-70)*.1)),reputation:(Math.round(clamp((club.prestige-getClub(state.clubId).prestige)/24,-3,4))||0)};
}
function stageFor(state:CareerState):TransferDecision['stage'] { return state.age===16?'academy':state.age===18?'first-pro':state.age===22?'early-pro':state.age===27?'prime':state.age===33?'veteran':'conditional'; }
/** Called only when selecting/loading a decision. Committed offers are data in the save. */
export function prepareTransferDecision(state:CareerState):TransferDecision|undefined {
  if(!isTransferEvent(state.currentEventId)) { delete state.transferDecision; return undefined; }
  if(state.transferDecision?.eventId===state.currentEventId&&state.transferDecision.age===state.age) return state.transferDecision;
  const available=getOffers(state),current=getClub(state.clubId);
  const stage=stageFor(state);
  const stayClub=state.age===18&&isAcademy(current)?getClub(HOME_CLUB_ID):current;
  let candidates=available.filter(club=>club.id!==stayClub.id);
  const rank=(club:Club)=>interest(state,club)+club.prestige*.35+hash(`${state.seed}:${state.age}:${club.id}:rank`)*18;
  candidates.sort((a,b)=>rank(b)-rank(a));
  const chosen:Club[]=[];
  if(state.age<18) {
    chosen.push(...candidates.filter(isAcademy).sort((a,b)=>b.training-a.training).slice(0,2));
  } else if(state.age===18) {
    // Salary ambition versus a genuine first-team route; both signed offers are domestic.
    const ambitious=[...candidates].sort((a,b)=>b.tier-a.tier||b.training-a.training||rank(b)-rank(a))[0];
    if(ambitious) chosen.push(ambitious);
    const minutes=[...candidates].filter(club=>!chosen.includes(club)).sort((a,b)=>(expectedMinutes(state,b)+b.training*.18)-(expectedMinutes(state,a)+a.training*.18)||rank(b)-rank(a))[0];
    if(minutes) chosen.push(minutes);
  } else {
    if(stage==='veteran'&&state.clubId!==HOME_CLUB_ID) chosen.push(getClub(HOME_CLUB_ID));
    const ambitious=[...candidates].filter(club=>!chosen.includes(club)).sort((a,b)=>b.tier-a.tier||rank(b)-rank(a))[0];
    if(ambitious) chosen.push(ambitious);
    const alternative=[...candidates].filter(club=>!chosen.includes(club)).sort((a,b)=>{
      const contrast=(club:Club)=>expectedMinutes(state,club)+club.training*.22+(club.country==='Indonesia'&&chosen.some(c=>c.country!=='Indonesia')?12:0)+hash(`${state.seed}:${state.age}:${club.id}:fit`)*15;
      return contrast(b)-contrast(a);
    })[0];
    if(chosen.length<2&&alternative) chosen.push(alternative);
  }
  // Local professional clubs remain willing to offer a realistic role to struggling players.
  for(const fallback of candidates) if(chosen.length<2&&!chosen.includes(fallback)) chosen.push(fallback);
  const headlines={academy:'DUA AKADEMI. SATU LANGKAH.', 'first-pro':'KONTRAK PERTAMA. AKAR INDONESIA.', 'early-pro':'MENIT ATAU CAKRAWALA BARU?',prime:'AMBISI ATAU RUMAH YANG DIBANGUN?',veteran:'SATU KONTRAK. WARISAN PANJANG.',conditional:'TEMPAT BERMAIN, ARAH PERJALANAN.'};
  const descriptions={academy:'Sekolah tetap menjadi bagian perjalanan. Pilih lingkungan latihan dan peranmu sebelum sepak bola profesional.', 'first-pro':'Sesudah sepak bola usia muda, dua klub Indonesia menawarkan jalan profesional yang berbeda. Jalur senior dekat rumah juga tetap terbuka.', 'early-pro':`Rekam jejak ${state.config.name} kini dibaca dari menit, penampilan, kondisi tubuh, dan kepercayaan pelatih. Tawaran ini benar-benar tersedia.`,prime:'Fasilitas, bayaran, tanggung jawab, dan kebersamaan tidak selalu menunjuk ke tempat yang sama.',veteran:'Masa depanmu kini juga menyangkut pemain yang akan mengikuti jejakmu. Tentukan peran untuk tahun-tahun terakhir.',conditional:'Nara membawa dua kontrak konkret. Bertahan juga berarti memilih pekerjaan yang perlu dituntaskan.'};
  const decision:TransferDecision={eventId:state.currentEventId,age:state.age,stage,headline:headlines[stage],description:descriptions[stage],offers:[...chosen.slice(0,2).map(club=>offerFor(state,club,'offer')),offerFor(state,stayClub,'stay')]};
  state.transferDecision=decision;
  state.scoutInterest={...state.scoutInterest}; for(const club of CLUBS) state.scoutInterest[club.id]=interest(state,club);
  return decision;
}
export function getOfferDecision(state:CareerState):TransferDecision|undefined { return state.transferDecision?.eventId===state.currentEventId&&state.transferDecision.age===state.age?state.transferDecision:undefined; }
export function getTransferOffers(state:CareerState):TransferOffer[] { return getOfferDecision(state)?.offers??[]; }
export function transferChoices(state:CareerState):Choice[] {
  return getTransferOffers(state).map(offer=>{
    const club=getClub(offer.clubId),stay=offer.kind==='stay';
    return {id:offer.id,offerId:offer.id,label:stay?state.age===18?`Terima jalur senior ${club.name}`:`Bertahan di ${club.name}`:`Terima ${club.name}`,hint:`${offer.role} · ${offer.playingTime}% menit · ${offer.pressure.toLowerCase()}`,effects:stay?{discipline:2,morale:2}:{mentality:2,morale:-1},transfer:stay?'loyal':club.id===HOME_CLUB_ID?'home':club.country!=='Indonesia'?'abroad':'ambition',flags:stay?['loyalty']:club.id===HOME_CLUB_ID?['homeRoots']:['ambition'],action:'contract',outcome:`${state.config.name} memilih ${club.name}. ${offer.description}`};
  });
}
export function addFlag(state:CareerState,flag:string):void { if(!state.flags.includes(flag)) state.flags.push(flag); }
export function transferTo(state:CareerState,to:Club):string {
  const from=getClub(state.clubId);
  if(to.id===from.id) return `${state.config.name} memperpanjang kontrak bersama ${to.name}.`;
  state.clubId=to.id;
  state.transfers.push({age:state.age,from:from.id,to:to.id});
  state.trust=clamp(44+(state.attributes.discipline-50)*.22+(state.relationships.mentor-50)*.1);
  state.playingTime=expectedMinutes(state,to);
  state.timeline.push({age:state.age,title:state.age<18?'Masuk akademi pengembangan':`Bergabung dengan ${to.name}`,text:`${state.config.name}: ${from.name} → ${to.name}. ${to.region}.${state.age<18?' Sekolah dan pembinaan tetap berjalan.':''}`,kind:'transfer'});
  if(to.id===HOME_CLUB_ID&&!isAcademy(from)) addFlag(state,'returnedHome');
  if(to.tier===4) addFlag(state,'eliteClub');
  if(to.country!=='Indonesia') addFlag(state,'playedAbroad');
  return `${state.config.name} menandatangani kontrak ${to.name}. Seragam baru dan peran ${roleFor(state.playingTime,state.age).toLowerCase()} menanti.`;
}
export function applyTransfer(state:CareerState,choice:Choice):string {
  if(!choice.transfer) return '';
  const offer=choice.offerId?getTransferOffers(state).find(item=>item.id===choice.offerId):undefined;
  if(offer) {
    const club=getClub(offer.clubId),decision=getOfferDecision(state)!;
    const text=transferTo(state,club);
    state.trust=offer.trust; state.playingTime=offer.playingTime; state.reputation=clamp(state.reputation+offer.reputation); state.peakReputation=Math.max(state.peakReputation,state.reputation);
    state.contract={clubId:club.id,salary:offer.salary,role:offer.role,playingTime:offer.playingTime,signedAge:state.age};
    const record={...decision,selectedId:offer.id};
    state.transferDecisionLog??=[];
    if(!state.transferDecisionLog.some(entry=>entry.eventId===record.eventId&&entry.age===record.age)) state.transferDecisionLog.push(record);
    if(offer.kind==='stay') addFlag(state,'loyalty');
    if(state.age===18&&!state.flags.includes('firstContract')) {
      addFlag(state,'firstContract'); state.timeline.push({age:18,title:'Kontrak profesional pertama',text:`${state.config.name} menandatangani kontrak di Indonesia bersama ${club.name}. Peran: ${offer.role}.`,kind:'milestone'});
    }
    if(state.age>=33&&club.id===HOME_CLUB_ID) { addFlag(state,'homeRoots'); addFlag(state,'captain'); }
    return `${text} Peran: ${offer.role}; proyeksi menit ${offer.playingTime}%.`;
  }
  // Older v1 checkpoints retain their authored choice ids, evaluated against today's plausible pool.
  if(choice.transfer==='loyal') { addFlag(state,'loyalty'); state.trust=clamp(state.trust+7); state.relationships.family=clamp(state.relationships.family+3); return `${state.config.name} melanjutkan kisah bersama ${getClub(state.clubId).name}.`; }
  if(state.age<18) return 'Pendidikan dan pembinaan usia muda tetap menjadi prioritas sampai kontrak profesional tersedia.';
  const offers=getOffers(state);
  let selected:Club|undefined;
  if(choice.transfer==='home') { selected=getClub(HOME_CLUB_ID); addFlag(state,'homeRoots'); }
  if(choice.transfer==='ambition') { selected=offers[0]; addFlag(state,'ambition'); }
  if(choice.transfer==='minutes') { selected=[...offers].sort((a,b)=>expectedMinutes(state,b)-expectedMinutes(state,a))[0]; addFlag(state,'minutesFirst'); }
  if(choice.transfer==='abroad') { selected=offers.find(club=>club.country!=='Indonesia'); addFlag(state,'adventurer'); }
  return selected?transferTo(state,selected):`${state.config.name} bertahan di ${getClub(state.clubId).name}; tawaran yang sesuai belum tersedia.`;
}
/** Contiguous spells come directly from season rows; repeated returns remain separate spells. */
export function getClubHistory(state:CareerState):ClubHistory[] {
  const spells:ClubHistory[]=[];
  for(const season of state.seasons) {
    let spell=spells[spells.length-1];
    if(!spell||spell.clubId!==season.clubId||spell.toAge!==season.age) {
      spell={clubId:season.clubId,club:getClub(season.clubId),fromAge:season.age,toAge:season.age,years:0,appearances:0,goals:0,assists:0,defensive:0,cleanSheets:0,trophies:0,awards:0,role:''}; spells.push(spell);
    }
    spell.toAge=season.age+1; spell.years++;
    for(const key of ['appearances','goals','assists','defensive','cleanSheets','trophies','awards'] as const) spell[key]+=season[key];
    spell.role=spell.appearances/Math.max(1,spell.years)>=26?'Pilar skuad':spell.appearances/Math.max(1,spell.years)>=17?'Rotasi utama':'Peran pengembangan';
    if(spell.trophies) spell.role+=` · ${spell.trophies} piala`;
  }
  return spells;
}
