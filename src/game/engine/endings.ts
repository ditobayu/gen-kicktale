import type { CareerState, Ending } from '../types/game';
import { ENDINGS } from '../data/endings';
import { getClub, HOME_CLUB_ID } from '../data/clubs';
import { overall } from './attributes';
import { EVENTS } from '../data/events';

export function professionalClubs(state:CareerState):string[] {
  return [...new Set(state.seasons.map(season=>season.clubId))];
}
export function endingId(state:CareerState):string {
  const flags=state.flags;
  const clubs=professionalClubs(state);
  const eliteSeasons=state.seasons.filter(season=>getClub(season.clubId).tier===4 && season.appearances>=18).length;
  const careerRating=state.seasons.reduce((sum,season)=>sum+season.rating*season.appearances,0)/Math.max(1,state.appearances);
  // Priority is intentional: a fully pursued second vocation overrides a playing-career archetype.
  if(state.coaching>=12 && flags.includes('coaching') && state.attributes.vision>=60) return 'mastermind';
  if(eliteSeasons>=5 && state.peakReputation>=88 && state.appearances>=400 && state.trophies>=3 && state.awards>=3 && careerRating>=7.25) return 'goat';
  const neglectedDecisions=state.history.filter(entry=>EVENTS.find(event=>event.id===entry.eventId)?.choices.find(choice=>choice.id===entry.choiceId)?.flags?.includes('neglect')).length;
  if(state.potential>=84 && neglectedDecisions>=3 && state.attributes.discipline<76 && state.potential-overall(state)>=9) return 'wasted';
  if(state.majorInjuries>=1 && state.injuryRisk<=45 && flags.includes('successfulComeback') && (flags.includes('comeback')||flags.includes('resilience')) && state.appearances>=220 && state.peakReputation>=50) return 'comeback';
  const hometownSeasons=state.seasons.filter(season=>season.clubId===HOME_CLUB_ID && season.appearances>=15).length;
  if(state.clubId===HOME_CLUB_ID && flags.includes('homeRoots') && hometownSeasons>=3 && (flags.includes('captain')||flags.includes('returnedHome')) && state.appearances>=230) return 'hometown';
  if(clubs.length===1 && flags.includes('loyalty') && state.appearances>=320 && state.peakReputation>=45) return 'oneClub';
  if(clubs.length>=4 && state.appearances>=240 && flags.includes('playedAbroad')) return 'journeyman';
  return 'whatif';
}
export function getEnding(state:CareerState):Ending {
  const template=ENDINGS.find(ending=>ending.id===(state.endingId??endingId(state))) ?? ENDINGS[7];
  let description=template.description;
  if(template.id==='mastermind') description+=` ${state.config.name} menuntaskan bekal kepelatihan (${state.coaching} poin), lalu kembali membimbing pemain muda bersama Coach Ratih. Sekarang mimpimu tumbuh lewat kaki orang lain.`;
  else if(template.id==='hometown') description+=` Di ${getClub(HOME_CLUB_ID).name}, kamu meninggalkan lebih dari angka: anak-anak baru berani bermimpi.`;
  else if(template.id==='comeback') description+=` ${state.majorInjuries} cedera besar dan ${state.appearances} penampilan menjadi bukti perjalanan itu.`;
  else if(template.id==='oneClub') description+=` ${getClub(state.seasons[0]?.clubId??state.clubId).name} menyimpan ${state.appearances} penampilanmu dalam arsipnya.`;
  else description+=` ${state.config.name}: ${state.appearances} penampilan, ${state.trophies} piala, satu perjalanan yang tidak bisa diulang persis sama.`;
  return {...template,description};
}
