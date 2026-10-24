import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{contents:"export * from './src/game/engine/index.ts'; export { CLUBS } from './src/game/data/clubs.ts'; export { EVENTS } from './src/game/data/events/index.ts';",resolveDir:root},bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent'});
const e=await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].contents).toString('base64')}`);
const {createCareer,choose,advance,getEvent,getTransferOffers,getOfferDecision,getClubHistory,getClub,getOffers,overall,saveCareer,loadCareer,isCareerState,SAVE_KEY,CLUBS,EVENTS}=e;
const config=(position='striker',name="Dito Dwi-Putra")=>({name,position,foot:'left',appearance:{skin:'#B87550',hair:'curls',preset:'classic'}});
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const weights={technique:1.3,pace:.5,fitness:1.1,vision:.7,discipline:1.8,mentality:.8,reputation:.55,trust:.4,morale:.15,injuryRisk:-.6,playingTime:.3};
function pick(state,profile){
  const choices=getEvent(state).choices,offers=getTransferOffers(state);
  if(profile==='average') return choices[(state.seed*17+state.step*11)%choices.length];
  if(profile==='loyal'&&offers.length) return choices.find(c=>c.offerId===offers.find(o=>o.kind==='stay').id);
  const score=choice=>{
    let value=Object.entries(choice.effects).reduce((sum,[key,n])=>sum+(weights[key]??0)*n,0);
    if(choice.flags?.includes('disciplined')) value+=6;
    if(choice.flags?.includes('neglect')) value-=20;
    if(choice.injury==='risk') value-=20;
    if(choice.injury==='recover') value+=state.injury?15:2;
    if(choice.coaching) value-=choice.coaching*3;
    const offer=offers.find(o=>o.id===choice.offerId);
    if(offer){const club=getClub(offer.clubId);value+=club.tier*26+club.training*.22+club.prestige*.12+offer.playingTime*.04+(offer.kind==='stay'?0:3);}
    if(profile==='struggling') value=-value+(choice.flags?.includes('neglect')?25:0)+(choice.injury==='risk'?30:0);
    return value;
  };
  return [...choices].sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id))[0];
}
function checkTotals(state){
  const history=getClubHistory(state);
  for(const key of ['appearances','goals','assists','defensive','cleanSheets','trophies','awards']) assert.equal(history.reduce((sum,spell)=>sum+spell[key],0),state[key],`Club history ${key}`);
  assert.equal(history.reduce((sum,spell)=>sum+spell.years,0),state.seasons.length);
  assert(isCareerState(state),`Invalid checkpoint ${state.age}/${state.phase}`);
}
const reports=[];const offerClubs=new Set(),firstProClubs=new Set(),eliteDestinations=new Set();
for(const profile of ['elite','average','struggling','loyal']){
  const careers=[];
  for(const position of ['striker','winger','midfielder','defender']) for(let seed=1;seed<=40;seed++){
    let state=createCareer(config(position),seed),decisions=0;const windows=[];const starts=[];
    while(state.phase!=='ending'){
      const event=getEvent(state),offers=getTransferOffers(state),before=JSON.stringify(state);
      if(offers.length){
        windows.push(state.age); const decision=getOfferDecision(state);
        assert.equal(decision.age,state.age);assert.equal(offers.length,3);assert.equal(offers.filter(o=>o.kind==='offer').length,2);assert.equal(offers.filter(o=>o.kind==='stay').length,1);
        assert.equal(new Set(offers.map(o=>o.clubId)).size,3);assert.deepEqual(event.choices.map(c=>c.id),offers.map(o=>o.id));
        const storage=store();assert(saveCareer(state,storage));const resumed=loadCareer(storage);
        assert.deepEqual(getTransferOffers(resumed),offers,'Offers rerolled on reload');assert.deepEqual(resumed,state,'Refresh changed career checkpoint');
        for(const offer of offers){
          const club=getClub(offer.clubId); offerClubs.add(club.id);
          assert(offer.role&&offer.development&&offer.pressure&&offer.description);assert(offer.playingTime>=18&&offer.playingTime<=98);assert(offer.salary>=0);
          if(state.age<18) assert.equal(club.level,'academy','Youth received professional offer');
          if(state.age===18){assert.equal(club.country,'Indonesia','First pro contract offered abroad');assert.notEqual(club.level,'academy');firstProClubs.add(club.id);}
          if(club.country!=='Indonesia') assert(state.age>=21,'Premature overseas opportunity');
          if(club.tier===4) assert(state.age>=23&&overall(state)>=84&&state.reputation>=67,'Unearned elite contract');
          if(profile==='elite'&&club.tier===4) eliteDestinations.add(club.id);
        }
      }
      const selected=pick(state,profile),result=choose(state,selected.id);decisions++;
      assert.equal(JSON.stringify(state),before,'Choosing mutated input');
      assert.deepEqual(choose(result,selected.id),result,'Transfer rewarded twice');
      if(offers.length){
        const chosen=offers.find(o=>o.id===selected.id);
        assert.equal(result.clubId,chosen.clubId,'Accepted offer did not select that exact club');
        assert.equal(result.contract.salary,chosen.salary);assert.equal(result.result.action,'contract');assert.equal(result.result.clubId,chosen.clubId);assert(result.result.text.includes(getClub(chosen.clubId).name));
        assert(result.result.text.includes(state.config.name));
      }
      if(state.age===18){starts.push(result.clubId);assert.equal(getClub(result.clubId).country,'Indonesia');assert(result.flags.includes('firstContract'));assert(result.timeline.some(t=>t.title==='Kontrak profesional pertama'&&t.age===18));}
      checkTotals(result);state=advance(result);checkTotals(state);
    }
    assert.equal(decisions,20);assert(windows.length>=5&&windows.length<=6,`Invalid transfer frequency ${windows}`);
    for(const age of [16,18,22,27,33]) assert(windows.includes(age),`Missing transfer milestone ${age}`);
    assert.equal(state.seasons.length,20);assert.deepEqual(state.seasons.map(s=>s.age),Array.from({length:20},(_,i)=>18+i));
    assert(state.timeline.some(t=>t.title==='Gantung sepatu'));assert(state.timeline.some(t=>t.title==='Debut profesional')===Boolean(state.appearances));assert(state.timeline.some(t=>t.title==='Gol profesional pertama')===Boolean(state.goals));
    if(profile==='loyal'){assert.equal(new Set(state.seasons.map(s=>s.clubId)).size,1);assert.equal(state.seasons[0].clubId,'surya');}
    const top=Math.max(...state.seasons.map(s=>getClub(s.clubId).tier));
    careers.push({offers:windows.length,top,overall:overall(state),abroad:state.flags.includes('playedAbroad'),moves:state.transfers.filter(t=>t.age>=18).length,ending:state.endingId,goals:state.goals,assists:state.assists,defensive:state.defensive,position});
  }
  const average=key=>Math.round(careers.reduce((sum,c)=>sum+c[key],0)/careers.length*100)/100;
  reports.push({profile,careers:careers.length,offerDecisions:average('offers'),minOffers:Math.min(...careers.map(c=>c.offers)),maxOffers:Math.max(...careers.map(c=>c.offers)),meanOverall:average('overall'),maxTier:Math.max(...careers.map(c=>c.top)),overseasCareers:careers.filter(c=>c.abroad).length,meanMoves:average('moves'),endings:[...new Set(careers.map(c=>c.ending))].join(', ')});
  if(profile==='elite'){assert(careers.some(c=>c.top===4),'Elite natural careers never reached Europe');assert(careers.some(c=>c.abroad));}
  if(profile==='struggling') assert(careers.some(c=>!c.abroad),'Every struggling career forced overseas');
  const meanStat=(pos,key)=>careers.filter(c=>c.position===pos).reduce((sum,c)=>sum+c[key],0)/40;
  assert(meanStat('striker','goals')>meanStat('defender','goals'));assert(meanStat('defender','defensive')>meanStat('striker','defensive'));assert(meanStat('midfielder','assists')>meanStat('striker','assists'));
}
assert(reports.find(r=>r.profile==='elite').meanOverall>reports.find(r=>r.profile==='struggling').meanOverall+5);
assert(offerClubs.size>=20,'World selection collapsed to a few clubs');assert(firstProClubs.size>=3);assert(eliteDestinations.size>=3,'Elite route always forces the same European club');
assert.equal(CLUBS.length,32);assert.equal(CLUBS.filter(c=>c.level==='academy').length,3);assert(EVENTS.length>=50);
for(const country of ['Inggris','Spanyol','Italia','Jerman','Prancis']) assert(CLUBS.some(c=>c.country===country&&c.level==='europe-elite'));
// Fixtures were generated by the untouched original engine at git a0f2f3a, not hand-fabricated careers.
let legacyCount=0;
for(const filename of readdirSync(new URL('./fixtures/',import.meta.url)).filter(n=>n.startsWith('legacy-v1-')&&n.endsWith('.json'))){
  const legacy=JSON.parse(readFileSync(new URL(`./fixtures/${filename}`,import.meta.url),'utf8'));
  assert.equal(legacy.version,1);assert.equal(legacy.engineRevision,undefined);assert(isCareerState(legacy),`Legacy fixture rejected: ${filename}`);
  const storage=store();storage.setItem(SAVE_KEY,JSON.stringify(legacy));let resumed=loadCareer(storage);
  assert(resumed);assert.equal(resumed.config.name,legacy.config.name);assert.deepEqual(resumed.history,legacy.history);assert.equal(resumed.currentEventId,legacy.currentEventId);assert.equal(resumed.endingId,legacy.endingId);
  let guard=0;while(resumed.phase!=='ending'&&guard++<30){resumed=resumed.phase==='decision'?choose(resumed,getEvent(resumed).choices[0].id):advance(resumed);assert(isCareerState(resumed),`Legacy continuation failed ${filename}`);}
  assert.equal(resumed.phase,'ending');legacyCount++;
}
for(const name of ['  ', 'x'.repeat(25), '<script>'])assert.throws(()=>createCareer(config('striker',name),1));
for(const name of ['  Dito Dwi-Putra  ', "M. Dwi O’Rafi", 'Éka Pratama', 'Aisyah Nur Aini'])assert.equal(createCareer(config('midfielder',name),1).config.name,name.trim());
console.table(reports);
console.log(`PASS: 640 complete legal careers, 5–6 persistent club decisions each; ${offerClubs.size} offer clubs, ${eliteDestinations.size} earned elite destinations; all positions; truthful history; four real v1 fixtures (${legacyCount} loaded); name validation.`);
