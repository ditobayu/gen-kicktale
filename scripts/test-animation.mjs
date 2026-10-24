import assert from 'node:assert/strict';
import {build} from 'esbuild';
const compiled=await build({stdin:{contents:"export * from './src/game/animation/timeline.ts'; export * from './src/game/animation/registry.ts'; export * from './src/game/animation/camera.ts';",resolveDir:process.cwd(),sourcefile:'animation-test-entry.ts'},bundle:true,platform:'node',format:'esm',write:false});
const {createTimeline,sampleTimeline,timelineCues,GOAL,animationVariants,playAnimation,project}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const approx=(a,b,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<tolerance,`${a} ≠ ${b}`);
const finite=(value,path='frame')=>{if(typeof value==='number')assert.ok(Number.isFinite(value),`${path} must be finite`);else if(value&&typeof value==='object')for(const [key,child]of Object.entries(value))finite(child,`${path}.${key}`);};
let frameCount=0,sequenceCount=0;
for(const [action,variants]of Object.entries(animationVariants))for(const variant of variants)for(const seed of [2,7,11]){
 const def=createTimeline({action,variant,environment:'stadium',seed});let previous=null;
 for(let time=0;time<=def.durationMs;time+=16){const frame=sampleTimeline(def,time);finite(frame);frameCount++;assert.equal(frame.goal,GOAL);assert.ok(frame.camera.zoom>=.7&&frame.camera.zoom<=1.45);if(frame.ball){assert.equal(frame.ball.visible,true,`${action}/${variant} ball disappears`);if(previous?.ball)assert.ok(distance(frame.ball,previous.ball)<32,`${action}/${variant} ball jumps at ${time}: ${distance(frame.ball,previous.ball)}`);const screen=project(frame.ball,frame.camera);assert.ok(screen.x>25&&screen.x<975&&screen.y>35&&screen.y<575,`${action}/${variant} ball outside frame at ${time}: ${JSON.stringify(screen)}`);}previous=frame;}
 for(const at of [def.contactMs,def.outcomeMs,def.reactionMs,def.durationMs,1550,def.outcomeMs+330,def.outcomeMs+820]){if(at<=0||at>=def.durationMs)continue;const before=sampleTimeline(def,at-.001),after=sampleTimeline(def,at+.001);if(before.ball&&after.ball)assert.ok(distance(before.ball,after.ball)<.01,`${action}/${variant} discontinuity at ${at}`);}
 const final=sampleTimeline(def,def.durationMs);assert.equal(final.phase,'complete');assert.ok(final.title.length>0,`${action}/${variant} missing consequence title`);
 assert.deepEqual(sampleTimeline(def,2345),sampleTimeline(def,2345),'seeking must be deterministic');
 assert.deepEqual(sampleTimeline(def,-100),sampleTimeline(def,0));assert.deepEqual(sampleTimeline(def,Infinity),sampleTimeline(def,0));assert.deepEqual(sampleTimeline(def,def.durationMs+500),final);
 const cues=timelineCues(def);assert.ok(cues.every(c=>c.atMs>=0&&c.atMs<=def.durationMs));sequenceCount++;
}
for(const shotType of ['driven','curled','lofted','close','penalty','header'])for(const variant of animationVariants.shoot)for(const seed of [2,3]){
 const def=createTimeline({action:'shoot',variant,environment:'stadium',shotType,seed}),c=def.contactMs,o=def.outcomeMs;
 const before=sampleTimeline(def,c-.001),contact=sampleTimeline(def,c),outcome=sampleTimeline(def,o),final=sampleTimeline(def,def.durationMs),shooter=contact.actors.find(a=>a.id==='player');
 if(shotType!=='header'){assert.equal(before.ball.owner,'player');assert.equal(contact.ball.owner,null);assert.ok(distance(shooter.foot,contact.ball)<1e-8,`${shotType}/${variant} toe misses ball`);}else{assert.ok(distance(shooter.head,contact.ball)<1e-8,'Header must meet the ball with head');}
 assert.ok(final.ball.visible,'outcome must retain visible ball');
 if(variant==='goal'){approx(outcome.ball.y,GOAL.y);assert.ok(outcome.ball.x>GOAL.x1&&outcome.ball.x<GOAL.x2);assert.ok(outcome.ball.z>0&&outcome.ball.z<GOAL.height);assert.ok(final.ball.y<GOAL.y);assert.ok(sampleTimeline(def,o+420).netImpact.amount>0);assert.equal(final.ball.motion,'net');assert.equal(final.ball.owner,null);}
 if(variant==='save'){assert.equal(outcome.ball.owner,'keeper');assert.equal(outcome.ball.motion,'caught');assert.ok(outcome.ball.y>GOAL.y);const glove=outcome.actors.find(a=>a.role==='keeper').hands[0];assert.ok(distance(glove,outcome.ball)<1e-8,'Glove must make physical contact');assert.equal(final.ball.owner,'keeper');}
 if(variant==='miss'){assert.ok(outcome.ball.x<GOAL.x1||outcome.ball.x>GOAL.x2);assert.equal(final.netImpact,null);assert.equal(final.ball.owner,null);}
 if(variant==='post'){assert.ok(Math.min(Math.abs(outcome.ball.x-GOAL.x1),Math.abs(outcome.ball.x-GOAL.x2))<1e-8);approx(outcome.ball.y,GOAL.y);assert.ok(outcome.ball.z<GOAL.height);assert.ok(sampleTimeline(def,o+30).ball.x<outcome.ball.x,'post rebound should reverse horizontal travel');}
 if(variant==='blocked'){assert.ok(outcome.ball.y>GOAL.y);assert.ok(distance(outcome.actors.find(a=>a.id==='blocker').foot,outcome.ball)<1e-8);assert.ok(final.ball.x<outcome.ball.x);}
 for(let time=c-200;time<=def.durationMs;time+=8){const a=sampleTimeline(def,time),b=sampleTimeline(def,time+8);assert.ok(distance(a.ball,b.ball)<20,`${shotType}/${variant} has discontinuous flight at ${time}`);const screen=project(a.ball,a.camera);assert.ok(screen.x>20&&screen.x<980&&screen.y>20&&screen.y<580,`${shotType}/${variant} camera loses ball`);frameCount++;}
 sequenceCount++;
}
for(const [action,variant,receiver]of [['pass','key-pass','receiver'],['pass','interception','opponent'],['dribble','interception','opponent'],['tackle','success','player']]){const def=createTimeline({action,variant,environment:'stadium'}),frame=sampleTimeline(def,def.outcomeMs+100);assert.equal(frame.ball.owner,receiver,`${action}/${variant} must change possession`);}
for(const variant of ['goal','save','miss','post','blocked']){const r=playAnimation('shoot',{result:{variant,success:variant==='goal'}});assert.equal(r.variant,variant);assert.equal(r.outcome,variant==='goal'?'success':'failure');assert.equal(r.loop,false);}
assert.equal(playAnimation('shoot',{result:{success:false,variant:'failure'}}).variant,'miss');
assert.equal(playAnimation('shoot',{speed:2}).durationMs,3250);assert.equal(playAnimation('shoot',{reducedMotion:true}).durationMs,0);assert.equal(playAnimation('farewell').loop,false);
console.log(`Animation acceptance passed: ${sequenceCount} deterministic sequences, ${frameCount.toLocaleString()} sampled frames; all shot outcomes, physical contact, ownership, net/post geometry, camera, boundaries, speed and replay.`);
