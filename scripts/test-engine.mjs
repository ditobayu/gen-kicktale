import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

// Bundle the actual TypeScript game engine: the test does not maintain a second simulation.
const root=fileURLToPath(new URL('../',import.meta.url));
const bundled=await build({stdin:{contents:"export * from './src/game/engine/index.ts'; export { EVENTS } from './src/game/data/events/index.ts'; export { CLUBS } from './src/game/data/clubs.ts'; export { ENDINGS } from './src/game/data/endings.ts';",resolveDir:root},bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent'});
const engine=await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].contents).toString('base64')}`);
const {createCareer,choose,advance,getEvent,getEnding,overall,getClub,getOffers,getTransferOffers,getOfferDecision,getClubHistory,expectedMinutes,successProbability,saveCareer,loadCareer,deleteCareer,hasCorruptSave,isCareerState,AGE_SCHEDULE,EVENTS,CLUBS,ENDINGS,SAVE_KEY}=engine;
const config=(position='striker')=>({name:'Bintang Uji',position,foot:'right',appearance:{skin:'#B87550',hair:'crop',preset:'classic'}});
const clone=value=>JSON.parse(JSON.stringify(value));
const weights={technique:1,pace:.5,fitness:.8,vision:.6,discipline:1.5,mentality:.8,reputation:.55,trust:.35,morale:.15,injuryRisk:-.3,playingTime:.3};
const policyNames=['elite','inconsistent','hometown','defender','injuries','money','comeback','coaching','loyal','traveler','exploratory'];
const observedActions=new Set(); const observedVariants=new Set();
function score(choice,state,policy){
  let score=Object.entries({...choice.effects}).reduce((sum,[key,value])=>sum+(weights[key]??0)*value,0);
  const flags=choice.flags??[];
  if(flags.includes('disciplined')) score+=3;
  if(flags.includes('neglect')) score-=7;
  if(choice.injury==='recover') score+=state.injury>0?10:1;
  if(choice.injury==='risk') score-=4;
  if(choice.skill) score+=(successProbability(state,choice)-.5)*5;
  if(choice.coaching) score-=choice.coaching*2;
  if(choice.transfer){
    const available=getOffers(state); const highest=available[0];
    if(choice.transfer==='ambition') score+=highest&&highest.tier>getClub(state.clubId).tier?20:-5;
    if(choice.transfer==='home') score-=5;
    if(choice.transfer==='loyal') score+=2;
    if(choice.transfer==='abroad') score-=2;
  }
  if(choice.offerId){
    const offer=getTransferOffers(state).find(offer=>offer.id===choice.offerId),club=getClub(offer.clubId),current=getClub(state.clubId);
    score+=offer.kind==='stay'?0:(club.tier-current.tier)*13+(club.training-current.training)*.2+offer.playingTime*.04;
    if(policy==='elite'||policy==='defender') score+=club.tier*10+club.training*.15;
    if(policy==='hometown') score+=club.id==='surya'?120:offer.kind==='stay'?35:0;
    if(policy==='loyal') score+=offer.kind==='stay'?200:-100;
    if(policy==='traveler') score+=offer.kind==='offer'?150:0;
    if(policy==='money') score+=Math.log10(Math.max(1,offer.salary))*8;
  }
  if(policy==='elite') { if(flags.includes('ambition')) score+=5; if(choice.coaching)score-=10; }
  if(policy==='inconsistent') { if(flags.includes('neglect'))score+=26; score+=(choice.effects.pace??0)*1.5+(choice.effects.technique??0); if(choice.injury==='risk')score+=10; }
  if(policy==='hometown') { if(choice.transfer==='home')score+=60; if(choice.transfer==='loyal')score+=35; if(['ambition','abroad','minutes'].includes(choice.transfer))score-=30; for(const flag of ['homeRoots','captain','loyalty'])if(flags.includes(flag))score+=12; }
  if(policy==='defender') { score+=(choice.effects.vision??0)*1.4+(choice.effects.fitness??0)*1.2; if(choice.transfer==='ambition')score+=7; }
  if(policy==='injuries') { if(choice.injury==='risk')score+=100; if(choice.injury==='recover')score-=25; if(flags.includes('neglect'))score+=20; }
  if(policy==='money') { if(choice.transfer==='ambition')score+=35; if(flags.includes('moneyFirst'))score+=35; score+=(choice.effects.money??0)/1_000_000*4; if(choice.transfer==='loyal')score-=15; }
  if(policy==='comeback') { if(!state.majorInjuries && choice.injury==='risk')score+=100; if(state.majorInjuries && choice.injury==='recover')score+=80; if(state.majorInjuries && choice.injury==='risk')score-=30; if(flags.includes('resilience')||flags.includes('comeback'))score+=14; }
  if(policy==='coaching') { score+=(choice.coaching??0)*30; if(flags.includes('coaching'))score+=20; score+=(choice.effects.vision??0)*2; }
  if(policy==='loyal') { if(choice.transfer==='loyal')score+=70; if(['ambition','minutes','abroad'].includes(choice.transfer))score-=70; if(choice.transfer==='home')score+=20; if(flags.includes('loyalty'))score+=10; if(flags.includes('homeRoots')||flags.includes('captain'))score-=10; }
  if(policy==='traveler') { if(choice.transfer==='abroad')score+=80; if(choice.transfer==='ambition')score+=40; if(choice.transfer==='minutes')score+=20; if(choice.transfer==='loyal'||choice.transfer==='home')score-=50; }
  return score;
}
function select(state,policy){const choices=getEvent(state).choices;return policy==='exploratory'?choices[state.rng%choices.length]:[...choices].sort((a,b)=>score(b,state,policy)-score(a,state,policy)||a.id.localeCompare(b.id))[0];}
function validateTotals(state){
  for(const key of ['appearances','goals','assists','defensive','cleanSheets','trophies','awards'])assert.equal(state[key],state.seasons.reduce((sum,season)=>sum+season[key],0),`Incorrect career ${key}`);
  for(const value of Object.values(state.attributes))assert(value>=0&&value<=100&&Number.isFinite(value));
  assert(isCareerState(state),`Invalid generated state age=${state.age} phase=${state.phase}`);
}
function run(seed,policy,position='striker',checkpoints=false){
  let state=createCareer(config(position),seed);
  let decisions=0;
  while(state.phase!=='ending'){
    assert.equal(state.phase,'decision');
    const event=getEvent(state);
    assert(event.minAge<=state.age&&event.maxAge>=state.age,'Age-ineligible event');
    assert.equal(event.chapter,state.chapter);
    assert(!state.completed.includes(event.id),'Repeated event');
    const before=JSON.stringify(state);
    const decision=select(state,policy);
    const result=choose(state,decision.id);
    observedActions.add(result.result.action);observedVariants.add(`${result.result.action}:${result.result.variant}`);
    assert.equal(JSON.stringify(state),before,'choose mutated its input');
    assert.equal(result.phase,'result');
    assert.equal(result.history.length,++decisions);
    assert.deepEqual(choose(result,decision.id),result,'Duplicate decision was rewarded');
    validateTotals(result);
    if(checkpoints){
      const storage=memoryStorage(); assert(saveCareer(result,storage));
      const resumed=loadCareer(storage); assert.deepEqual(resumed,result,'Result checkpoint rerolled');
      assert.deepEqual(advance(resumed),advance(result),'Reload changed progression');
    }
    state=advance(result);
    assert.deepEqual(advance(state),state,'Advance applied more than once');
    validateTotals(state);
  }
  assert.equal(decisions,20);
  assert.equal(state.age,38);
  assert.equal(state.seasons.length,20);
  assert.deepEqual(state.seasons.map(season=>season.age),Array.from({length:20},(_,index)=>18+index));
  assert(ENDINGS.some(ending=>ending.id===getEnding(state).id));
  return state;
}
function memoryStorage(){const memory=new Map();return {getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)};}

if(process.argv[2]==='--route'){
  const policy=process.argv[3]??'elite';const seed=Number(process.argv[4]??1);const position=process.argv[5]??'striker';
  assert(policyNames.includes(policy),'Unknown policy');assert(Number.isInteger(seed)&&seed>=0&&seed<=4294967295,'Seed must be uint32');assert(['striker','winger','midfielder','defender'].includes(position),'Unknown position');
  const state=run(seed,policy,position,true);
  console.log(JSON.stringify({policy,seed,position,ending:state.endingId,overall:overall(state),appearances:state.appearances,goals:state.goals,assists:state.assists,trophies:state.trophies,awards:state.awards,history:state.history},null,2));
  process.exit(0);
}

assert.equal(CLUBS.length,32);
assert.equal(new Set(CLUBS.map(club=>club.id)).size,CLUBS.length);
assert(EVENTS.length>=40);
assert.equal(new Set(EVENTS.map(event=>event.id)).size,EVENTS.length);
for(const event of EVENTS){assert(event.choices.length>=2&&event.choices.length<=3);assert.equal(new Set(event.choices.map(choice=>choice.id)).size,event.choices.length);assert(event.minAge<=event.maxAge);}
assert.deepEqual(AGE_SCHEDULE,[8,10,11,12,13,14,16,17,18,19,21,22,23,25,27,29,30,33,35,38]);

const reports=[]; const endings=new Map(); let closestGoat=null; let lowestDiscipline=null;
// Test all required routes, all positions, and hundreds of seeds. Every resulting ending is real.
for(const policy of policyNames){
  const position=policy==='inconsistent'?'winger':policy==='hometown'||policy==='coaching'?'midfielder':policy==='defender'?'defender':'striker';
  const career=run(1209,policy,position,true);
  reports.push({policy,ending:career.endingId,overall:overall(career),appearances:career.appearances,trophies:career.trophies,clubs:new Set(career.seasons.map(season=>season.clubId)).size});
  for(let seed=1;seed<=160;seed++){
    const finished=run(seed,policy,position);
    const eliteYears=finished.seasons.filter(season=>getClub(season.clubId).tier===4&&season.appearances>=18).length;
    const rating=finished.seasons.reduce((sum,season)=>sum+season.rating*season.appearances,0)/Math.max(1,finished.appearances);
    const diagnostic={policy,seed,position,eliteYears,rating,rep:finished.peakReputation,awards:finished.awards,trophies:finished.trophies,discipline:finished.attributes.discipline,neglect:finished.flags.includes('neglect')};
    if(!closestGoat||eliteYears>closestGoat.eliteYears||eliteYears===closestGoat.eliteYears&&finished.awards>closestGoat.awards)closestGoat=diagnostic;
    if(diagnostic.neglect&&(!lowestDiscipline||diagnostic.discipline<lowestDiscipline.discipline))lowestDiscipline=diagnostic;
    if(!endings.has(finished.endingId))endings.set(finished.endingId,{policy,seed,position});
  }
}

// Save/load at both checkpoints; JSON edits and malformed nested structures cannot crash load.
let saved=createCareer(config(),98765); const memory=memoryStorage();
assert(saveCareer(saved,memory)); assert.deepEqual(loadCareer(memory),saved);
assert.deepEqual(run(321,'elite'),run(321,'elite'),'Seed is not reproducible');
assert.notDeepEqual(createCareer(config(),321).attributes,createCareer(config(),322).attributes,'Seeds do not vary attributes');
assert.equal(hasCorruptSave(memory),false);
for(const malformed of ['{oops','null','{}','[]',JSON.stringify({...saved,attributes:null}),JSON.stringify({...saved,history:[null]}),JSON.stringify({...saved,phase:'ending',step:19,age:38,chapter:'retirement',endingId:'goat',seasons:[null]})]){
  memory.setItem(SAVE_KEY,malformed); assert.equal(loadCareer(memory),null); assert.equal(hasCorruptSave(memory),true);
}
saved=run(48,'hometown','midfielder'); memory.setItem(SAVE_KEY,JSON.stringify({...saved,appearances:saved.appearances+1}));assert.equal(loadCareer(memory),null,'Inconsistent career sums accepted');
memory.setItem(SAVE_KEY,JSON.stringify(saved));assert.deepEqual(loadCareer(memory),saved);assert(deleteCareer(memory));assert.equal(loadCareer(memory),null);assert.equal(hasCorruptSave(memory),false);
const denied={getItem(){throw new Error('Denied');},setItem(){throw new Error('Denied');},removeItem(){throw new Error('Denied');}};
assert.equal(loadCareer(denied),null);assert.equal(saveCareer(saved,denied),false);assert.equal(deleteCareer(denied),false);

// Position identity and input quality materially affect outputs and probabilities.
const comparable=createCareer(config(),500);
const weak=clone(comparable); const strong=clone(comparable);
for(const key of Object.keys(weak.attributes)){weak.attributes[key]=35;strong.attributes[key]=85;}
const attempt={id:'test',label:'test',hint:'',effects:{},outcome:'',skill:'technique',difficulty:65};
assert(successProbability(strong,attempt)>successProbability(weak,attempt)+.25);
assert(getOffers(comparable).every(club=>club.tier<4),'Child received elite offers');
assert(expectedMinutes(strong,getClub('surya'))>expectedMinutes(weak,getClub('monteluz')));
const defenders=run(1209,'defender','defender');const striker=run(1209,'defender','striker');
assert(defenders.defensive>striker.defensive);assert(striker.goals>defenders.goals);

// Deterministic ending reachability must come from legal complete careers, never edited state.
console.table(reports);
console.log('Reachable endings:',Object.fromEntries(endings));
if(endings.size<8)console.log('Balance diagnostics:',{closestGoat,lowestDiscipline});
assert.equal(endings.size,8,`Only ${endings.size}/8 endings reached: ${JSON.stringify(Object.fromEntries(endings))}`);
for(const [ending,route]of endings){assert.equal(run(route.seed,route.policy,route.position).endingId,ending);}
assert.equal(observedActions.size,10,`Missing semantic animations: ${[...observedActions]}`);
for(const variant of ['shoot:goal','shoot:save','shoot:miss','shoot:post','shoot:blocked','pass:key-pass','pass:interception','dribble:failure','tackle:failure','training:improvement','injury:recovery','injury:setback','trophy:celebration','contract:signed','bench:waiting','farewell:farewell'])assert(observedVariants.has(variant),`Untested result variant ${variant}`);
console.log(`PASS: ${policyNames.length*161} policy careers plus focused regression careers, all eight endings, all ten animation actions, deterministic RNG, age eligibility, immutable decisions, truthful totals, position weighting, checkpoint reload, corruption recovery.`);
