import type { CareerState, Choice, Club } from '../types/game';
import { CLUBS, getClub, HOME_CLUB_ID } from '../data/clubs';
import { overall } from './attributes';
import { clamp } from './random';

export function getOffers(state:CareerState):Club[] {
  const ability=overall(state);
  return CLUBS.filter(club=>club.id!=='cakrawala' && club.id!==state.clubId && (
    club.tier===1 ||
    (club.tier===2 && ability>=58 && state.reputation>=13) ||
    (club.tier===3 && ((ability>=73 && state.reputation>=38 && state.appearances>=20) || (state.age<=22 && ability>=74 && state.reputation>=29 && state.potential>=89))) ||
    (club.tier===4 && ability>=82 && state.reputation>=58 && state.appearances>=45)
  )).sort((a,b)=>b.tier-a.tier || b.prestige-a.prestige);
}
export function expectedMinutes(state:CareerState,club:Club):number {
  // Opportunity describes a newcomer; proven ability and reputation can earn an elite starting role.
  return Math.round(clamp(club.opportunity+(overall(state)-(club.difficulty-15))*2.3+(state.reputation-40)*.35+(state.trust-50)*.20,15,98));
}
export function transferTo(state:CareerState,to:Club):string {
  const from=getClub(state.clubId);
  if(to.id===from.id) return `Kamu tetap bersama ${to.name}.`;
  state.clubId=to.id;
  state.transfers.push({age:state.age,from:from.id,to:to.id});
  state.trust=clamp(42+(state.attributes.discipline-50)*.2+(state.relationships.mentor-50)*.1);
  state.playingTime=expectedMinutes(state,to);
  state.timeline.push({age:state.age,title:`Bergabung dengan ${to.name}`,text:`${from.name} → ${to.name}. ${to.region}.`,kind:'transfer'});
  if(to.id===HOME_CLUB_ID && from.id!=='cakrawala') addFlag(state,'returnedHome');
  if(to.tier===4) addFlag(state,'eliteClub');
  if(!to.region.includes('Indonesia')) addFlag(state,'playedAbroad');
  return `Kontrak ditandatangani: ${to.name}. ${state.playingTime>=70?'Peran utama menantimu.':state.playingTime>=45?'Tempat di tim harus diperjuangkan.':'Persaingan ketat; kamu memulai dari bangku cadangan.'}`;
}
export function addFlag(state:CareerState,flag:string):void { if(!state.flags.includes(flag)) state.flags.push(flag); }
export function applyTransfer(state:CareerState,choice:Choice):string {
  if(!choice.transfer) return '';
  if(choice.transfer==='loyal') {
    addFlag(state,'loyalty');
    state.trust=clamp(state.trust+7);
    state.relationships.family=clamp(state.relationships.family+3);
    return `Kamu memperpanjang kisah bersama ${getClub(state.clubId).name}.`;
  }
  if(state.age<18) return 'Keputusan ini membuka arah berikutnya; kamu tetap menyelesaikan pendidikan di Cakrawala.';
  const offers=getOffers(state);
  let selected:Club|undefined;
  if(choice.transfer==='home') { selected=getClub(HOME_CLUB_ID); addFlag(state,'homeRoots'); }
  if(choice.transfer==='ambition') {
    selected=offers.find(club=>club.tier>=getClub(state.clubId).tier);
    if(!selected) return `Belum ada tawaran yang melampaui ${getClub(state.clubId).name}. Nara menyarankanmu menunggu sambil menambah menit bermain.`;
    addFlag(state,'ambition');
  }
  if(choice.transfer==='minutes') {
    selected=offers.filter(club=>club.tier<=Math.max(1,getClub(state.clubId).tier)).sort((a,b)=>
      (expectedMinutes(state,b)+b.training*.17)-(expectedMinutes(state,a)+a.training*.17))[0];
    addFlag(state,'minutesFirst');
  }
  if(choice.transfer==='abroad') {
    selected=offers.find(club=>!club.region.includes('Indonesia'));
    if(!selected) return 'Peminat luar negeri belum mengirim kontrak. Nara menjaga negosiasi tetap terbuka; kamu bertahan dan membangun rekam jejak.';
    addFlag(state,'adventurer');
  }
  return selected? transferTo(state,selected):'Belum ada tawaran yang cocok. Kamu bertahan dan menunggu kesempatan berikutnya.';
}
