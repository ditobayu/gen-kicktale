import type { CareerState, Season } from '../types/game';
import { getClub } from '../data/clubs';
import { develop, overall } from './attributes';
import { clamp, random, randomInt } from './random';
import { addFlag, expectedMinutes } from './transfers';

function nationalCall(state:CareerState,rating:number,age:number):void {
  if(age<19 || age>36 || state.reputation<49 || rating<6.6 || state.injury>4) return;
  const debut=state.nationalCaps===0;
  state.nationalCaps+=randomInt(state,3,9);
  if(debut) state.timeline.push({age,title:'Panggilan Merah Putih',text:`${state.config.name} menjalani debut senior Indonesia setelah penampilan kompetitif bersama ${getClub(state.clubId).name}.`,kind:'national'});
}

/** One row per actual year. No rewards are ever computed on the ending screen. */
export function simulateSeason(state:CareerState,age:number):Season {
  const club=getClub(state.clubId);
  const ability=overall(state);
  const attr=state.attributes;
  const availability=clamp(1-state.injury/14,.12,1);
  const chemistry=.87+state.trust/650+state.morale/1000;
  const appearances=Math.round(clamp((31+club.tier*3)*(state.playingTime/100)*availability*(.87+random(state)*.19),0,49));
  const quality=clamp((ability-club.difficulty+90)/100,.2,1.05);
  const form=(.8+state.morale/250)*chemistry;
  const variance=.8+random(state)*.4;
  const contribution=quality*form*variance;
  const attack=state.config.position==='striker'?.66:state.config.position==='winger'?.36:state.config.position==='midfielder'?.20:.075;
  const creation=state.config.position==='midfielder'?.43:state.config.position==='winger'?.35:state.config.position==='striker'?.18:.12;
  const defending=state.config.position==='defender'?3.5:state.config.position==='midfielder'?1.6:.65;
  const goals=Math.round(appearances*attack*contribution*(.65+attr.technique/190));
  const assists=Math.round(appearances*creation*contribution*(.60+attr.vision/180));
  const defensive=Math.round(appearances*defending*contribution*(.6+(attr.vision+attr.discipline)/300));
  const cleanSheets=Math.round(appearances*clamp(.12+(attr.fitness+attr.vision)/750+(ability-club.difficulty)/600,.08,.55)*(.85+random(state)*.3));
  const roleInfluence=state.config.position==='defender'? defensive/Math.max(1,appearances)/4:
    state.config.position==='midfielder'?assists/Math.max(1,appearances)*1.7:(goals+assists*.6)/Math.max(1,appearances);
  const rating=appearances===0?0:Math.round(clamp(5.35+quality*1.15+roleInfluence*.9+(state.morale-50)/200+random(state)*.5,4.5,9.6)*10)/10;
  const trophyChance=appearances<8?0:clamp(.025+club.tier*.019+(rating-6.3)*.075,.01,.35);
  const trophies=random(state)<trophyChance?1:0;
  const awards=appearances>=20 && rating>=7.35 && random(state)<clamp((rating-7)*.4,0,.65)?1:0;
  const season:Season={age,clubId:state.clubId,appearances,goals,assists,defensive,cleanSheets,rating,trophies,awards};
  if(state.appearances===0&&appearances>0) state.timeline.push({age,title:'Debut profesional',text:`${state.config.name} menjalani penampilan profesional pertama bersama ${club.name}.`,kind:'milestone'});
  if(state.goals===0&&goals>0) state.timeline.push({age,title:'Gol profesional pertama',text:`${state.config.name} mencetak gol profesional pertama untuk ${club.name}.`,kind:'milestone'});
  state.seasons.push(season);
  for(const key of ['appearances','goals','assists','defensive','cleanSheets','trophies','awards'] as const) state[key]+=season[key];
  state.money+=Math.round((state.contract?.clubId===club.id?state.contract.salary:club.salary)*(.75+state.playingTime/200));
  const publicity=club.tier>=3?1.35:club.tier===2?1.05:.75;
  const repChange=appearances<8? -1.5:(rating-5.9)*2.8*publicity+trophies*3+awards*2;
  const visibilityCeiling=club.tier===1?72:club.tier===2?82:club.tier===3?92:100;
  // Moving to a smaller league preserves a hard-earned name but cannot inflate global fame forever.
  state.reputation=clamp(state.reputation+repChange,0,Math.max(state.reputation,visibilityCeiling));
  state.peakReputation=Math.max(state.peakReputation,state.reputation);
  state.trust=clamp(state.trust+(rating-6.4)*3+(attr.discipline-60)/40-(state.injury>6?2:0));
  const target=expectedMinutes(state,club);
  state.playingTime=Math.round(clamp(state.playingTime*.60+target*.40+(rating-6.6)*5,8,98));
  state.morale=clamp(state.morale+(rating-6.5)*2+(state.playingTime<35?-3:1));
  if(trophies) state.timeline.push({age,title:club.tier>=3?'Malam juara':'Piala untuk kota',text:`${club.name} mengangkat ${club.tier>=3?'Continental Crown':'Piala Kepulauan'}. ${appearances} penampilanmu ikut membangun musim ini.`,kind:'trophy'});
  if(state.injury>0) {
    state.injury=Math.max(0,state.injury-7);
    if(state.injury===0 && state.majorInjuries>0) addFlag(state,'recovered');
  } else {
    const risk=clamp(.016+state.injuryRisk*.0012+(100-attr.fitness)*.00035,0,.23);
    if(random(state)<risk) {
      const serious=random(state)<.18+state.injuryRisk/400;
      state.injury=serious?randomInt(state,5,9):randomInt(state,1,3);
      if(serious) {
        state.majorInjuries++;
        addFlag(state,'majorSetback');
        state.timeline.push({age,title:'Musim yang terhenti',text:'Cedera memaksa jeda. Menit bermain musim berikutnya menyesuaikan masa pemulihan.',kind:'injury'});
      }
    }
  }
  if(state.majorInjuries>0 && state.flags.includes('recovered') && appearances>=18 && rating>=6.7) addFlag(state,'successfulComeback');
  nationalCall(state,rating,age);
  return season;
}

export function simulateInterval(state:CareerState,start:number,end:number):Season|undefined {
  const interval:Season[]=[];
  for(let age=start;age<end;age++) {
    if(age>=18) interval.push(simulateSeason(state,age));
    develop(state,age);
    if(age<18 && state.injury>0) {
      state.injury=Math.max(0,state.injury-7);
      if(state.injury===0 && state.majorInjuries>0) addFlag(state,'recovered');
    }
    state.injuryRisk=clamp(state.injuryRisk+(state.flags.includes('neglect')?.5:-.4)+(state.attributes.fitness<50?.4:0),4,94);
  }
  if(!interval.length) return undefined;
  const aggregate:Season={age:start,clubId:interval[0].clubId,appearances:0,goals:0,assists:0,defensive:0,cleanSheets:0,rating:0,trophies:0,awards:0};
  for(const season of interval) for(const key of ['appearances','goals','assists','defensive','cleanSheets','trophies','awards'] as const) aggregate[key]+=season[key];
  aggregate.rating=Math.round(interval.reduce((sum,s)=>sum+s.rating*s.appearances,0)/Math.max(1,aggregate.appearances)*10)/10;
  return aggregate;
}
