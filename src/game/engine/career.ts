import type { Action, CareerState, Choice, PlayerConfig } from '../types/game';
import { AGE_SCHEDULE, ATTRIBUTE_KEYS, CHAPTERS, chapterForAge } from './constants';
import { applyEffects, effectDifference } from './attributes';
import { clamp, random, randomInt } from './random';
import { getEvent, selectEvent } from './events';
import { applyTransfer, addFlag, transferTo } from './transfers';
import { getClub, HOME_CLUB_ID } from '../data/clubs';
import { successProbability } from './probability';
import { simulateInterval } from './seasons';
import { endingId } from './endings';

export function copyCareer(state:CareerState):CareerState { return JSON.parse(JSON.stringify(state)) as CareerState; }

export function createCareer(config:PlayerConfig,seed?:number):CareerState {
  const initialSeed=(seed ?? (Date.now()^Math.floor(Math.random()*4294967296)))>>>0;
  const state:CareerState={
    version:1,config:{...config,name:config.name.trim().slice(0,28)||'Bintang',appearance:{...config.appearance}},seed:initialSeed,rng:initialSeed,
    step:0,age:8,chapter:'childhood',attributes:{technique:0,pace:0,fitness:0,vision:0,discipline:0,mentality:0},potential:0,
    clubId:'cakrawala',playingTime:75,trust:48,reputation:5,peakReputation:5,morale:65,injuryRisk:12,injury:0,majorInjuries:0,
    money:0,appearances:0,goals:0,assists:0,defensive:0,cleanSheets:0,trophies:0,awards:0,nationalCaps:0,coaching:0,
    relationships:{rival:35,mentor:45,family:75},flags:[],completed:[],history:[],transfers:[],timeline:[],seasons:[],
    currentEventId:'',phase:'decision',result:null,endingId:null,
  };
  for(const key of ATTRIBUTE_KEYS) state.attributes[key]=randomInt(state,39,52);
  if(config.position==='striker') { state.attributes.technique+=5; state.attributes.mentality+=3; }
  if(config.position==='winger') { state.attributes.pace+=6; state.attributes.technique+=3; }
  if(config.position==='midfielder') { state.attributes.vision+=6; state.attributes.technique+=3; }
  if(config.position==='defender') { state.attributes.vision+=4; state.attributes.fitness+=5; state.attributes.discipline+=2; }
  state.potential=randomInt(state,84,94);
  state.currentEventId=selectEvent(state).id;
  state.timeline.push({age:8,title:'Mimpi dimulai',text:'Sepasang sepatu, bola di kaki, dan lapangan Cakrawala Junior di Surabaya.',kind:'chapter'});
  return state;
}

function resolveInjury(state:CareerState,choice:Choice):string {
  if(choice.injury==='recover') {
    const recovering=state.injury>0;
    state.injury=Math.max(0,state.injury-5);
    state.injuryRisk=clamp(state.injuryRisk-10,4,94);
    if(state.majorInjuries>0) { addFlag(state,'resilience'); addFlag(state,'comeback'); }
    if(recovering && !state.injury) addFlag(state,'recovered');
    return recovering?'Kamu mengikuti program pemulihan; beban cedera dan risiko berikutnya berkurang.':'Tes kebugaranmu menjadi bekal pencegahan. Kamu menjaga tubuh untuk musim berikutnya.';
  }
  if(choice.injury==='risk') {
    state.injuryRisk=clamp(state.injuryRisk+8,4,94);
    addFlag(state,'riskTaker');
    const danger=clamp(.19+state.injuryRisk*.004+state.injury*.025-(state.attributes.fitness-50)*.002,.12,.80);
    if(random(state)<danger) {
      state.injury=randomInt(state,5,10);
      state.majorInjuries++;
      applyEffects(state,{fitness:-5,pace:-2,morale:-4});
      addFlag(state,'majorSetback');
      state.timeline.push({age:state.age,title:'Harga sebuah risiko',text:'Cedera besar mengubah rencana. Tim medis menyusun program kembali bertahap.',kind:'injury'});
      return 'Tubuhmu memberi tanda berhenti. Cedera besar membatasi menit bermain; pemulihan kini menjadi bagian dari perjalanan.';
    }
    return 'Kamu melewati pertandingan tanpa cedera besar, tetapi risikonya masih terbawa ke musim berikutnya.';
  }
  return '';
}

function memoryFor(state:CareerState):string|undefined {
  if(state.age<23) return undefined;
  const memories:[string,string][]=[
    ['homeRoots','Bima masih menyimpan foto lapangan masa kecilmu. Jalan pulang itu tidak pernah hilang.'],
    ['disciplined','Coach Ratih masih mengingat kebiasaan latihanmu sejak akademi. Kebiasaan kecil itu menjadi bekal bertahun-tahun.'],
    ['mentor','Nasihat Coach Ratih kembali terngiang sebelum kamu mengambil keputusan besar.'],
    ['moneyFirst','Nara membuka lagi kontrak lamamu: angka besar membawa peluang, sekaligus persaingan untuk setiap menit.'],
    ['loyalty','Coach Ratih mengingatkanmu: orang-orang di klub tidak melupakan saat kamu memilih bertahan.'],
    ['friendship','Pesan Bima masuk sebelum laga: “Apa pun stadionnya, kamu tetap teman main bolaku.”'],
    ['neglect','Kebiasaan lama tidak langsung hilang. Kali ini kamu tahu apa yang perlu dibenahi.'],
  ];
  const available=memories.filter(([flag])=>state.flags.includes(flag));
  return available.length?available[Math.floor(state.step/2)%available.length][1]:undefined;
}

function animationVariant(action:Action,success:boolean,checkpoint:number):string {
  if(action==='shoot') return success?'goal':['save','miss','post'][checkpoint%3];
  if(action==='pass') return success?(checkpoint%2?'key-pass':'success'):'interception';
  if(action==='dribble'||action==='tackle') return success?'success':'failure';
  if(action==='training') return success?'improvement':'struggle';
  if(action==='injury') return success?'recovery':'setback';
  if(action==='trophy') return 'celebration';
  if(action==='contract') return 'signed';
  if(action==='bench') return 'waiting';
  return 'farewell';
}

function resultTitle(action:Action,success:boolean,newMajorInjury:boolean):string {
  if(newMajorInjury) return 'SAATNYA MENDENGARKAN TUBUH.';
  if(!success) return action==='shoot'?'BELUM MENEMUKAN SASARAN.':action==='pass'?'RUANG ITU SUDAH TERTUTUP.':'SATU PELAJARAN LAGI.';
  const titles:Record<Action,string>={shoot:'SATU SENTUHAN BERARTI.',pass:'RUANG SELALU ADA.',dribble:'BERANI MENCARI JALAN.',tackle:'BACA GERAK, JAGA RUANG.',training:'SEDIKIT DEMI SEDIKIT.',contract:'TINTA DAN KEPUTUSAN.',injury:'KEMBALI, PELAN-PELAN.',trophy:'MALAM MILIK KITA.',bench:'DI TEPI GARIS, TETAP SIAP.',farewell:'TERIMA KASIH, SEPAK BOLA.'};
  return titles[action];
}

/** The committed result and every season reward form one immutable checkpoint. */
export function choose(input:CareerState,choiceId:string):CareerState {
  if(input.phase!=='decision') return copyCareer(input);
  const event=getEvent(input);
  const choice=event.choices.find(option=>option.id===choiceId);
  if(!choice) throw new Error('Pilihan ini tidak tersedia.');
  const state=copyCareer(input);
  const uncertain=choice.skill!==undefined || choice.difficulty!==undefined;
  const probability=uncertain?successProbability(state,choice):undefined;
  const success=probability===undefined || random(state)<probability;
  applyEffects(state,choice.effects);
  applyEffects(state,success?(choice.successEffects??{}):(choice.failureEffects??{}));
  for(const flag of choice.flags??[]) addFlag(state,flag);
  if(choice.coaching) { state.coaching+=choice.coaching; addFlag(state,'coaching'); }
  const transferText=applyTransfer(state,choice);
  const injuryText=resolveInjury(state,choice);
  state.history.push({eventId:event.id,choiceId:choice.id,age:state.age});
  state.completed.push(event.id);
  const intervalEnd=AGE_SCHEDULE[state.step+1]??state.age;
  const season=simulateInterval(state,state.age,intervalEnd);
  const newMajorInjury=state.majorInjuries>input.majorInjuries;
  const outcome=success?choice.outcome:(choice.failure??'Rencanamu belum berhasil. Kamu membawa pelajaran ini ke latihan berikutnya.');
  const trophyText=season?.trophies?`Dalam rentang musim ini, ${getClub(state.clubId).name} meraih ${season.trophies} piala dengan kontribusimu di lapangan.`:'';
  const intervalInjuryText=!injuryText&&newMajorInjury?'Sebuah cedera besar juga mengganggu rentang musim ini. Masa pemulihan tercatat dalam perjalanan dan menit bermainmu.':'';
  const text=[outcome,transferText,injuryText,intervalInjuryText,trophyText].filter(Boolean).join(' ');
  const callback=event.callback && input.flags.includes(event.callback.flag)?event.callback.text:undefined;
  const memory=callback??memoryFor(input);
  const celebratesTrophy=Boolean(season?.trophies && !choice.transfer && !choice.injury && !newMajorInjury);
  const intendedAction=choice.action??(choice.transfer?'contract':choice.injury==='recover'?'injury':event.action);
  const action=newMajorInjury?'injury':celebratesTrophy?'trophy':intendedAction==='trophy'?'training':intendedAction;
  state.result={eventId:event.id,choiceId:choice.id,title:resultTitle(action,success,newMajorInjury),text,success,
    ...(probability===undefined?{}:{probability}),changes:effectDifference(input,state),action,
    variant:newMajorInjury?'setback':animationVariant(action,success,state.rng),scene:celebratesTrophy?'stadium':event.scene,...(season?{season}:{}),...(memory?{memory}:{})};
  state.timeline.push({age:state.age,title:event.title,text:outcome,kind:'decision'});
  if(state.age===38 && state.coaching>=12 && state.attributes.vision>=60) state.timeline.push({age:38,title:'Bab baru di pinggir lapangan',text:`Bekal kepelatihan ${state.coaching} poin: kamu mulai mendampingi latihan pemain muda Cakrawala bersama Coach Ratih.`,kind:'chapter'});
  state.timeline.sort((a,b)=>a.age-b.age);
  state.phase='result';
  return state;
}

/** Advancing a result cannot reapply its decision or its season statistics. */
export function advance(input:CareerState):CareerState {
  if(input.phase!=='result') return copyCareer(input);
  const state=copyCareer(input);
  if(state.step===AGE_SCHEDULE.length-1) {
    state.phase='ending';
    state.endingId=endingId(state);
    return state;
  }
  const previousChapter=state.chapter;
  state.step++;
  state.age=AGE_SCHEDULE[state.step];
  state.chapter=chapterForAge(state.age);
  state.phase='decision';
  state.result=null;
  if(state.age===18 && state.clubId==='cakrawala') transferTo(state,getClub(HOME_CLUB_ID));
  if(previousChapter!==state.chapter) state.timeline.push({age:state.age,title:CHAPTERS.find(chapter=>chapter.id===state.chapter)!.name,text:`Bab baru dimulai pada usia ${state.age}.`,kind:'chapter'});
  state.currentEventId=selectEvent(state).id;
  return state;
}
