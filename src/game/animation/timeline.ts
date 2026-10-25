import type {ActorFrame,ActorPose,AnimationSpec,BallFrame,Emotion,GoalGeometry,ImpactFrame,TimelineCue,TimelineDefinition,TimelineFrame,Vec3} from './types';
import {ANIMATION_REGISTRY,animationVariants} from './registry';
import {arc,clamp,ground,hermite,mix,sampleBall,segment,smooth,vMix} from './ball';
import {sampleCamera,type CameraKey} from './camera';

/** World coordinates: x/y are on the pitch; z is height. SVG projects (x, y − z). */
export const GOAL:GoalGeometry={x1:790,x2:960,y:440,height:155,depthX:28,depthY:-24};
const shotTypes=['driven','curled','lofted','close','penalty','header'] as const;
const celebrations=['arms','knee-slide','jump'] as const;
const p=(x:number,y:number,z=0):Vec3=>({x,y,z});
const e=(time:number,start:number,end:number)=>smooth(segment(time,start,end));
const sinTouch=(time:number)=>Math.sin(time*.018)*9;
const intensity=(spec:AnimationSpec)=>spec.intensity==='dramatic'?1.4:spec.intensity==='routine'?.7:1;
export function createTimeline(input:AnimationSpec):TimelineDefinition{
 const seed=Math.abs(input.seed??7),spec={...input,seed,shotType:input.shotType??shotTypes[seed%shotTypes.length],celebration:input.celebration??celebrations[seed%3],intensity:input.intensity??'important'};
 if(!(animationVariants[spec.action] as readonly string[]).includes(spec.variant))spec.variant=spec.action==='shoot'?(/save|post|block/.test(spec.variant)?(/save/.test(spec.variant)?'save':/post/.test(spec.variant)?'post':'blocked'):/miss|fail/.test(spec.variant)?'miss':'goal'):animationVariants[spec.action][0];
 const durationMs=ANIMATION_REGISTRY[spec.action].durationMs;
 const timing:Record<AnimationSpec['action'],[number,number,number]>={shoot:[2100,3500,4350],pass:[1400,2650,3250],dribble:[1800,2700,3500],tackle:[2050,2600,3350],training:[3200,4300,4600],injury:[1800,2700,4100],contract:[1800,3100,4100],trophy:[2100,3000,3800],bench:[1300,2400,3000],farewell:[2600,4400,5400]};
 const [contactMs,outcomeMs,reactionMs]=timing[spec.action];return{spec,durationMs,contactMs,outcomeMs,reactionMs};
}
function actor(id:string,role:ActorFrame['role'],x:number,y:number,pose:ActorPose='idle',emotion:Emotion='focused',extra:Partial<ActorFrame>={}):ActorFrame{return{id,role,x,y,scale:.76,facing:1,pose,cycle:0,lean:0,rotation:0,emotion,...extra};}
function phase(def:TimelineDefinition,t:number):TimelineFrame['phase']{if(t>=def.durationMs)return'complete';if(t>=def.reactionMs)return'reaction';if(t>=def.outcomeMs)return'outcome';if(t>=def.contactMs+100)return'flight';if(t>=def.contactMs-70)return'contact';if(t>=def.contactMs-600)return'anticipation';return'setup';}
function impact(t:number,at:number,kind:ImpactFrame['kind'],point:Vec3,strength=1):ImpactFrame[]{return t>=at&&t<at+200?[{kind,point,strength:strength*(1-segment(t,at,at+200))}]:[];}
function base(def:TimelineDefinition,t:number):TimelineFrame{return{timeMs:t,durationMs:def.durationMs,progress:t/def.durationMs,phase:phase(def,t),actors:[],ball:null,camera:{x:500,y:300,zoom:1,shakeX:0,shakeY:0},goal:GOAL,netImpact:null,impacts:[],title:'',subtitle:'',score:null};}
function outcomeText(frame:TimelineFrame,t:number,at:number,title:string,subtitle:string,score:string|null=null){if(t>=at){frame.title=title;frame.subtitle=subtitle;frame.score=score;}}
function celebrationPose(kind:AnimationSpec['celebration'],t:number,start:number):Partial<ActorFrame>{const q=segment(t,start,start+1300);if(kind==='knee-slide')return{pose:q<.75?'kneel':'celebrate',lean:mix(-12,0,q),emotion:'happy'};if(kind==='jump')return{pose:q<.6?'jump':'celebrate',y:-Math.sin(Math.PI*segment(t,start,start+750))*46,emotion:'happy'};return{pose:'celebrate',emotion:'happy'};}

interface ShotLayout{contact:Vec3;line:Vec3;collision:Vec3;rest:Vec3;shooterX:number;keeperStart:Vec3;}
function shotLayout(def:TimelineDefinition):ShotLayout{
 const type=def.spec.shotType,seed=def.spec.seed??7,right=seed%2===0;
 const shooterX=type==='close'?580:type==='penalty'?475:type==='lofted'?300:388;
 const contact=p(shooterX+(type==='header'?28:50),510,type==='header'?150:12);
 const z=type==='lofted'?112:type==='curled'?96:type==='header'?75:type==='close'?32:24;
 const line=p(right?925:825,GOAL.y,z);
 const variant=def.spec.variant;
 let collision={...line},rest=p(line.x+12,GOAL.y-19,10);
 if(variant==='save'){collision=p(right?915:835,450,z+7);rest=p(collision.x+5,470,55);}
 if(variant==='miss'){collision=p(right?1005:755,GOAL.y,z+15);rest=p(right?1080:740,405,10);}
 if(variant==='post'){collision=p(right?GOAL.x2:GOAL.x1,GOAL.y,type==='driven'?20:77);rest=p(right?720:650,530,10);}
 if(variant==='blocked'){collision=p(mix(contact.x,line.x,.58),475,28);rest=p(collision.x-130,550,10);}
 return{contact,line,collision,rest,shooterX,keeperStart:p(875,438)};
}
function shot(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{spec,contactMs:c,outcomeMs:o,reactionMs:r}=def,v=spec.variant,L=shotLayout(def),isHeader=spec.shotType==='header';
 const run=e(t,0,1500),settle=e(t,1500,1800),celebrate=e(t,r,r+1200);
 const playerX=mix(L.shooterX-175,L.shooterX,run)+(v==='goal'?celebrate*92:celebrate*15);
 const playerY=mix(526,510,run)+(v==='goal'?celebrate*15:0);
 const actorPose:ActorPose=t<1500?'run':t<1770?'plant':t<c-95?'backswing':t<c+100?(isHeader?'jump':'kick'):t<c+530?'follow':t<r?'idle':v==='goal'?'celebrate':'idle';
 const kicker=actor('player','player',playerX,playerY,actorPose,t<r?'focused':v==='goal'?'happy':'frustrated',{cycle:t/140,lean:t<c?mix(8,-8,settle):t<c+550?14:0});
 const preBall=(time:number):Vec3=>{
  if(isHeader){const q=segment(time,0,c);return arc(p(L.shooterX-100,495,35),L.contact,q,72);}
  if(time>=1550)return L.contact;
  const rr=e(time,0,1500),blend=e(time,1350,1550);return vMix(p(mix(L.shooterX-175,L.shooterX,rr)+45+sinTouch(time)*(1-blend),mix(526,510,rr),12+Math.abs(Math.sin(time*.018))*4*(1-blend)),L.contact,blend);
 };
 const postCatch=(time:number):Vec3=>{const q=e(time,o,o+650);return vMix(L.collision,L.rest,q);};
 const ballPath=(time:number):Vec3=>{
  if(time<=c)return preBall(time);
  if(time<=o){const q=segment(time,c,o),a=L.contact,b=L.collision,height=spec.shotType==='lofted'?95:spec.shotType==='curled'?47:isHeader?28:spec.shotType==='close'?11:18;return arc(a,b,q,height,spec.shotType==='curled'?(spec.seed!%2?25:-25):0);}
  if(v==='save')return postCatch(time);
  if(v==='goal'){
   const hit=o+330,drop=o+820,net=p(L.line.x+20,GOAL.y-22,Math.max(16,L.line.z-18));
   if(time<hit)return hermite(L.line,net,segment(time,o,hit),p(30,-26,-8),p(0,0,0));
   if(time<drop)return arc(net,L.rest,smooth(segment(time,hit,drop)),8);
   return L.rest;
  }
  // A collision reverses velocity immediately, then friction slows the loose ball.
  // Smoothstep would incorrectly stop at the post and accelerate away from it.
  const end=o+(v==='miss'?900:1100),progress=segment(time,o,end),q=1-(1-progress)**3;
  if(v==='post')return arc(L.collision,L.rest,q,38);
  if(v==='blocked')return arc(L.collision,L.rest,q,56);
  return arc(L.collision,L.rest,q,18);
 };
 // Author the kicking toe in the same world coordinates as the football.
 if(!isHeader){if(t<1550)kicker.foot=preBall(t);else if(t<c-260)kicker.foot=vMix(L.contact,p(L.shooterX-30,510,18),e(t,1550,c-260));else if(t<=c)kicker.foot=vMix(p(L.shooterX-30,510,18),L.contact,e(t,c-260,c));else if(t<c+330)kicker.foot=vMix(L.contact,p(L.shooterX+68,505,58),e(t,c,c+330));else if(t<c+700)kicker.foot=vMix(p(L.shooterX+68,505,58),p(L.shooterX+14,510,0),e(t,c+330,c+700));}
 if(isHeader&&t>=c-400&&t<=c+400){
  const jump=Math.sin(Math.PI*segment(t,c-400,c+400));kicker.pose='jump';kicker.y-=jump*18;
  const lean=clamp(kicker.lean/45,-.7,.7),neutralForehead=p(kicker.x+.76*(37*lean+8.255),kicker.y,131.824);
  kicker.head=vMix(neutralForehead,L.contact,jump);
 }
 if(t>=r&&v==='goal'){const cp=celebrationPose(spec.celebration,t,r);if(cp.y!==undefined)kicker.y+=cp.y;delete cp.y;Object.assign(kicker,cp);}
 f.actors.push(kicker);
 const diveStart=c+300,dive=v==='blocked'?0:e(t,diveStart,o),isSave=v==='save',targetX=L.collision.x;
 const recovery=e(t,o+200,o+900),keeperAngle=(targetX<875?-1:1)*55*Math.sin(dive*Math.PI*.5)*(1-recovery);
 const keeper=actor('keeper','keeper',875,438,v==='blocked'||t<diveStart?'idle':t<o+200?'dive':t<o+800?'land':isSave?'kneel':'sit',v==='blocked'||t<o?'focused':isSave?'proud':'sad',{facing:-1,rotation:keeperAngle,lean:0,scale:.8});
 if(v!=='blocked'&&t>=diveStart){
  const handsTarget=isSave?postCatch(Math.max(o,t)):p(L.collision.x+(targetX<875?35:-35),L.collision.y+15,L.collision.z-15),hand=vMix(p(855,438,95),handsTarget,dive);
  keeper.hands=[hand,vMix(p(885,438,95),p(handsTarget.x+9,handsTarget.y,handsTarget.z-8),dive)];
  // Place the diving body beneath its authored glove rather than stretching arms
  // across the goal. This is the forward transform inverse of the rig's IK.
  const localHand=p(mix(25,0,dive),mix(-118.75,mix(-140,-100,recovery),dive));
  const theta=keeperAngle*Math.PI/180,lx=-localHand.x*.8,ly=localHand.y*.8;
  keeper.x=hand.x-(lx*Math.cos(theta)-ly*Math.sin(theta));
  keeper.y=hand.y-hand.z-(lx*Math.sin(theta)+ly*Math.cos(theta));
 }
 f.actors.push(keeper);
 if(v==='blocked'){
  const approach=e(t,c-200,o-40),bx=mix(L.collision.x+70,L.collision.x-10,approach),by=mix(430,490,approach);
  f.actors.push(actor('blocker','opponent',bx,by,t<o-180?'run':t<o+450?'tackle':'land',t<o?'focused':'proud',{facing:-1,cycle:t/140,foot:t>=o-100&&t<o+180?L.collision:undefined,lean:t>o-180?-12:5}));
 }
 if(v==='goal')for(let i=0;i<2;i++){const q=e(t,r-300,r+1400);f.actors.push(actor(`mate-${i}`,'teammate',mix(225-i*85,playerX-75-i*60,q),mix(440+i*40,500+i*20,q),t<r+1000?'run':'celebrate','happy',{cycle:t/130,scale:.7}));}
 const state=t<c?{owner:isHeader?null:'player',motion:isHeader?'flight' as const:'owned' as const}:t<o?{owner:null,motion:'flight' as const}:v==='save'?{owner:'keeper',motion:'caught' as const}:v==='goal'?{owner:null,motion:'net' as const}:t<o+1100?{owner:null,motion:'rebound' as const}:{owner:null,motion:'stopped' as const};
 f.ball=sampleBall(ballPath,t,{...state,target:t<o?L.collision:L.rest});
 if(t>=o+330&&v==='goal')f.netImpact={point:p(L.line.x+20,GOAL.y-22,Math.max(16,L.line.z-18)),amount:Math.exp(-(t-o-330)/650)*Math.abs(Math.sin((t-o-330)*.024))};
 f.impacts=[...impact(t,c,'kick',L.contact,intensity(spec)),...impact(t,v==='goal'?o+330:o,v==='save'?'glove':v==='post'?'post':v==='blocked'?'block':v==='goal'?'net':'grass',v==='goal'?p(L.line.x+20,GOAL.y-22,Math.max(16,L.line.z-18)):L.collision,intensity(spec))];
 const key:CameraKey[]=[{at:0,x:560,y:338,zoom:1},{at:1500,x:585,y:336,zoom:1.02},{at:c,x:585,y:336,zoom:1.04},{at:o-150,x:700,y:325,zoom:1.08},{at:o+650,x:720,y:334,zoom:1.12},{at:r+500,x:v==='miss'?680:610,y:340,zoom:1.02},{at:def.durationMs,x:v==='miss'?680:590,y:340,zoom:1}];
 f.camera=sampleCamera(key,t,[{at:c,strength:3*intensity(spec)},{at:o,strength:(v==='post'?6:3)*intensity(spec)}]);
 const text:Record<string,[string,string]>={goal:['GOOOOOOL!','Sentuhan. Tembakan. Jala bergetar.'],save:['PENYELAMATAN!','Sarung tangan menjangkau sudut gawang.'],miss:['TIPIS DI SAMPING!','Bola melewati sisi luar tiang.'],post:['TIANG GAWANG!','Dentang keras. Bola memantul kembali.'],blocked:['DIBLOK!','Bek menutup ruang tembak tepat waktu.']};
 outcomeText(f,t,o+170,...text[v],v==='goal'?'1 — 0':null);return f;
}

function passing(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{contactMs:c,outcomeMs:o,reactionMs:r}=def,failed=def.spec.variant==='interception';
 const approach=e(t,0,c-400),passerX=mix(265,340,approach),start=p(390,510,12),target=failed?p(625,485,12):p(790,485,12);
 const receive=e(t,o,o+750),receiverX=failed?mix(655,720,receive):mix(820,875,receive),receiverY=485;
 const player=actor('player','player',passerX,510,t<c-400?'run':t<c-100?'backswing':t<c+180?'kick':t<c+500?'follow':'idle',t<r?'focused':failed?'frustrated':'happy',{cycle:t/140,lean:t>c-200&&t<c+500?10:0});
 const pre=(time:number)=>vMix(p(mix(265,340,e(time,0,c-400))+50,510,12),start,e(time,c-450,c));
 if(t<c)player.foot=t<c-330?pre(t):vMix(p(315,510,10),start,e(t,c-330,c));else if(t<c+400)player.foot=vMix(start,p(413,505,48),e(t,c,c+400));
 const receiver=actor(failed?'opponent':'receiver',failed?'opponent':'teammate',receiverX,receiverY,t<o-220?'run':t<o+370?'receive':t<r+100?'run':'celebrate',failed?'proud':'happy',{facing:-1,cycle:t/145,foot:t>=o-150? p(receiverX-30,485,12):undefined});
 f.actors=[player,receiver];
 if(failed)f.actors.push(actor('receiver','teammate',820,455,t>o?'idle':'run',t>o?'frustrated':'focused',{facing:-1,cycle:t/160}));
 const path=(time:number)=>time<c?pre(time):time<=o?arc(start,target,segment(time,c,o),12):p((failed?mix(655,720,e(time,o,o+750)):mix(820,875,e(time,o,o+750)))-30,485,12);
 f.ball=sampleBall(path,t,{owner:t<c?'player':t<o?null:receiver.id,motion:t<c||t>=o?'owned':'rolling',target});
 f.impacts=[...impact(t,c,'kick',start,.6),...impact(t,o,'grass',target,.4)];
 f.camera=sampleCamera([{at:0,x:500,y:340,zoom:1},{at:c,x:520,y:340,zoom:1.03},{at:o,x:635,y:340,zoom:1.06},{at:r+600,x:650,y:340,zoom:1}],t,[{at:c,strength:2}]);
 outcomeText(f,t,o+200,failed?'DIPOTONG!':'UMPAN TERUKUR',failed?'Lawan membaca jalur bola dan mengambil alih.':'Rekan menerima bola tepat di depan kaki.');return f;
}
function dribbling(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{outcomeMs:o,reactionMs:r}=def,fail=def.spec.variant==='interception';
 const q=e(t,0,o),escape=e(t,o,r+650),x=mix(250,fail?455:540,q)+(fail?0:escape*195),y=510-32*Math.sin(q*Math.PI)+(fail?0:-18*escape);
 const player=actor('player','player',x,y,t<o+500?'run':fail?'idle':'celebrate',t<o?'focused':fail?'frustrated':'happy',{cycle:t/125,lean:t<o?8:0});
 const dx=mix(580,fail?515:490,e(t,750,o)),dy=mix(450,fail?510:475,e(t,750,o));
 const opponent=actor('opponent','opponent',dx+(fail?e(t,o,r+650)*120:0),dy, t<o?'run':fail?'run':'fall',t<o?'focused':fail?'proud':'frustrated',{facing:fail?1:-1,cycle:t/140,lean:fail?10:-22});
 const owned=(time:number)=>{const a=e(time,0,o),b=e(time,o,r+650);return p(mix(250,fail?455:540,a)+(fail?0:b*195)+30+sinTouch(Math.min(time,o))*(1-e(time,o-250,o)),510-32*Math.sin(a*Math.PI)+(fail?0:-18*b),12+Math.abs(Math.sin(time*.018))*3*(1-e(time,o-250,o)));};
 const collision=owned(o),path=(time:number)=>time<=o||!fail?owned(time):p(collision.x+e(time,o,r+650)*120,collision.y,12);
 player.foot=t<o||!fail?owned(t):undefined;if(fail&&t>=o)opponent.foot=path(t);
 f.actors=[player,opponent];f.ball=sampleBall(path,t,{owner:fail&&t>=o?'opponent':'player',motion:'owned',target:null});
 f.impacts=impact(t,o,fail?'block':'grass',collision,.6);
 f.camera=sampleCamera([{at:0,x:500,y:335,zoom:1},{at:o,x:555,y:335,zoom:1.12},{at:r+700,x:625,y:330,zoom:1.05}],t);
 outcomeText(f,t,o+300,fail?'DIREBUT!':'LEWATI PENJAGA!',fail?'Lawan menutup ruang dan membawa bola pergi.':'Satu perubahan arah. Ruang terbuka.');return f;
}
function tackling(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{contactMs:c,outcomeMs:o,reactionMs:r}=def,foul=def.spec.variant==='foul',approach=e(t,0,c),after=e(t,c,r+550),contact=p(550,510,12);
 const player=actor('player','player',mix(280,500,approach)+(foul?0:after*95),510,t<c-150?'run':t<c+500?'tackle':foul?'kneel':'run',t<c?'focused':foul?'nervous':'proud',{cycle:t/135,lean:t>c-150&&t<c+500?-28:7});
 const opponent=actor('opponent','opponent',mix(670,580,approach),510,t<c?'run':foul?'fall':'idle',t<c?'focused':foul?'hurt':'frustrated',{facing:-1,cycle:t/145,lean:t>c?-23:6});
 const path=(time:number)=>time<c?p(mix(670,580,e(time,0,c))-30,510,12):foul?arc(contact,p(705,545,10),smooth(segment(time,c,o+1000)),22):p(550+e(time,c,r+550)*95,510,12);
 if(t<c)opponent.foot=path(t);else if(!foul)player.foot=path(t);if(t>=c-100&&t<=c)player.foot=vMix(p(510,510,8),contact,e(t,c-100,c));
 f.actors=[player,opponent];if(foul)f.actors.push(actor('official','official',mix(850,675,e(t,o,r+500)),470,t<r?'run':'reveal','focused',{facing:-1,cycle:t/150}));
 f.ball=sampleBall(path,t,{owner:t<c?'opponent':foul?null:'player',motion:t<c||!foul?'owned':t<o+1000?'rolling':'stopped',target:null});f.impacts=[...impact(t,c,'block',contact,.8),...(foul?impact(t,o,'whistle',p(680,470,100),.8):[])];
 f.camera=sampleCamera([{at:0,x:525,y:345,zoom:1},{at:c,x:565,y:345,zoom:1.12},{at:r+500,x:585,y:340,zoom:1.04}],t,[{at:c,strength:4}]);
 outcomeText(f,t,o,foul?'PELANGGARAN!':'TEKEL BERSIH',foul?'Wasit meniup peluit. Lawan terjatuh.':'Bola direbut. Serangan berganti arah.');return f;
}
function training(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{contactMs:c,outcomeMs:o}=def,struggle=def.spec.variant==='struggle';
 const run=segment(t,0,c-300),x=mix(220,600,smooth(run)),y=510+Math.sin(run*Math.PI*6)*28*(1-e(t,c-500,c));
 const player=actor('player','player',x,y,t<c-300?'run':t<c-70?'backswing':t<c+180?'kick':t<o?'follow':struggle?'kneel':'celebrate',t<o?'focused':struggle?'tired':'happy',{cycle:t/120,lean:t<c?8:0});
 const start=p(650,510,12),target=p(825,470,12);
 const before=(time:number)=>{const a=segment(time,0,c-300);return vMix(p(mix(220,600,smooth(a))+35+sinTouch(time)*(1-e(time,c-600,c-300)),510+Math.sin(a*Math.PI*6)*28*(1-e(time,c-500,c)),12),start,e(time,c-350,c));};
 const path=(time:number)=>time<c?before(time):time<o?arc(start,target,segment(time,c,o),20):target;
 if(t<c-300)player.foot=before(t);else if(t<=c)player.foot=vMix(p(580,510,10),start,e(t,c-300,c));else if(t<c+300)player.foot=vMix(start,p(670,510,46),e(t,c,c+300));
 f.actors=[player,actor('trainer','teammate',855,470,t>=o?'receive':'idle','focused',{facing:-1,foot:t>=o?target:undefined,scale:.73})];
 f.ball=sampleBall(path,t,{owner:t<c?'player':t<o?null:'trainer',motion:t<c||t>=o?'owned':'rolling',target});f.impacts=impact(t,c,'kick',start,.45);
 f.camera=sampleCamera([{at:0,x:500,y:345,zoom:1},{at:c,x:565,y:340,zoom:1.03},{at:o,x:605,y:340,zoom:1.03}],t);
 outcomeText(f,t,o,struggle?'ULANGI. TUMBUH.':'LATIHAN MENJADI NALURI',struggle?'Tarik napas. Sentuhan berikutnya lebih baik.':'Kontrol kerucut, perubahan arah, umpan tepat.');return f;
}
function injury(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{contactMs:c,outcomeMs:o,reactionMs:r}=def,recover=def.spec.variant==='recover',run=e(t,0,c-300),fall=e(t,c-300,c+450);
 if(recover){
  const walk=e(t,r,def.durationMs),x=480+walk*110;
  f.actors=[actor('player','player',x,510,t<o?'sit':t<o+550?'plant':t<r?'idle':'run',t<o?'hurt':t<r?'calm':'proud',{cycle:t/230,lean:t<o?-6:3}),actor('medic','medic',mix(735,575,e(t,0,c)),510,t<c?'run':t<r?'examine':'idle','focused',{facing:-1,cycle:t/160,hands:t>=c&&t<r?[p(500,510,45)]:undefined}),actor('teammate','teammate',660,470,t<r?'idle':'celebrate',t<r?'calm':'happy',{facing:-1,scale:.7})];
  f.camera=sampleCamera([{at:0,x:540,y:365,zoom:1.12},{at:o,x:540,y:365,zoom:1.17},{at:def.durationMs,x:565,y:350,zoom:1.05}],t);
  outcomeText(f,t,r,'LANGKAH KEMBALI','Pemeriksaan selesai. Berdiri perlahan, kembali percaya.');return f;
 }
 const player=actor('player','player',mix(300,470,run)+fall*30,510,t<c-300?'run':t<c+500?'fall':t<r?'hurt':'sit',t<r?'hurt':'sad',{cycle:t/160,lean:t<c-300?8:mix(0,-28,fall),rotation:t<c+500?fall*-15:0});
 const before=(time:number)=>p(mix(300,470,e(time,0,c-300))+35,510,12),contact=before(c-300),path=(time:number)=>time<c-300?before(time):arc(contact,p(670,535,10),smooth(segment(time,c-300,o+400)),18);
 if(t<c-300)player.foot=before(t);
 const medicProgress=e(t,o-400,r+400),medic=actor('medic','medic',mix(880,590,medicProgress),mix(460,510,medicProgress),t<r?'run':'examine','focused',{facing:-1,cycle:t/145,hands:t>=r?[p(520,510,45)]:undefined});
 f.actors=[player,medic,actor('teammate','teammate',mix(780,650,e(t,c,o)),470,t<o?'run':'idle','nervous',{facing:-1,cycle:t/160})];
 f.ball=sampleBall(path,t,{owner:t<c-300?'player':null,motion:t<c-300?'owned':t<o+400?'rolling':'stopped',target:p(670,535,10)});f.impacts=impact(t,c,'grass',p(495,510,0),.5);
 f.camera=sampleCamera([{at:0,x:530,y:345,zoom:1},{at:o,x:555,y:365,zoom:1.16},{at:r+500,x:560,y:365,zoom:1.2}],t);
 outcomeText(f,t,r,'WAKTU UNTUK PULIH','Rekan mendampingi. Tim medis datang.');return f;
}
function contract(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{contactMs:c,outcomeMs:o,reactionMs:r}=def,signed=def.spec.variant!=='negotiation';
 const handshake=e(t,c+500,o),reveal=e(t,o+650,r+600),playerX=mix(395,480,handshake)+reveal*30;
 const player=actor('player','player',playerX,515,t<c-400?'idle':t<c+450?'sign':t<o+650?'handshake':signed?'reveal':'idle',t<o?'focused':signed?'proud':'nervous');
 if(t>=c-400&&t<c+450)player.hands=[p(450+Math.sin(t*.055)*5,490,68),p(420,490,68)];
 else if(t<o+650&&t>=c+450)player.hands=[vMix(p(445,515,85),p(540,515,96),handshake)];
 else if(signed&&t>=o+650)player.hands=[p(475,515,mix(86,139,reveal)),p(555,515,mix(86,139,reveal))];
 const official=actor('official','official',mix(660,600,handshake),515,t<c+450?'idle':t<o+650?'handshake':'celebrate','happy',{facing:-1,hands:t>=c+450&&t<o+650?[vMix(p(625,515,85),p(540,515,96),handshake)]:undefined});
 f.actors=[player,official];f.camera=sampleCamera([{at:0,x:520,y:350,zoom:1},{at:c,x:520,y:355,zoom:1.14},{at:o+450,x:540,y:355,zoom:1.12},{at:def.durationMs,x:535,y:340,zoom:1}],t);
 f.impacts=[...impact(t,c,'flash',p(450,490,68),.6),...impact(t,r+350,'flash',p(510,515,120),1),...impact(t,r+800,'flash',p(550,515,130),.7)];
 outcomeText(f,t,o+400,signed?'BAB BARU DIMULAI':'DI MEJA NEGOSIASI',signed?'Tanda tangan. Jabat tangan. Seragam baru.':'Percakapan berlanjut. Masa depan sedang ditimbang.');return f;
}
function trophy(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{contactMs:c,outcomeMs:o,reactionMs:r}=def,lift=e(t,c-450,o),z=mix(68,177,lift),jump=t>r?Math.sin(Math.PI*segment(t,r,r+700))*22:0;
 f.actors=[actor('player','player',500,510-jump,t<c?'idle':'reveal',t<c?'nervous':'proud',{hands:[p(475,510-jump,z),p(525,510-jump,z)]})];
 for(let i=0;i<4;i++){const x=[355,645,250,750][i],j=t>o+100*i?Math.sin(Math.PI*segment(t,o+100*i,o+700+100*i))*18:0;f.actors.push(actor(`mate-${i}`,'teammate',x,510-j+(i>1?-25:0),t<o?'idle':'celebrate','happy',{scale:i>1?.68:.76,facing:i%2?1:-1}));}
 f.camera=sampleCamera([{at:0,x:500,y:345,zoom:1},{at:c,x:500,y:335,zoom:1.17},{at:o,x:500,y:315,zoom:1.22},{at:r+500,x:500,y:325,zoom:1},{at:def.durationMs,x:500,y:310,zoom:.94}],t,[{at:o,strength:3}]);
 f.impacts=[...impact(t,o,'flash',p(500,510,177),1),...impact(t,o+450,'flash',p(650,400,50),.8)];outcomeText(f,t,o+200,'BERSAMA, KITA JUARA!','Trofi terangkat. Satu tim, satu perjalanan.');return f;
}
function bench(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{outcomeMs:o}=def,encourage=def.spec.variant==='encouragement',rise=e(t,o-250,o+600);
 f.actors=[actor('player','player',430,510,t<o?'sit':encourage?'celebrate':'sit',t<o?'nervous':encourage?'focused':'sad',{lean:t<o?-8:0}),actor('mentor','teammate',mix(700,540,e(t,200,o-300)),510,t<o-300?'run':'idle','calm',{facing:-1,cycle:t/160,hands:t>o?[p(460,510,105)]:undefined})];
 f.camera=sampleCamera([{at:0,x:520,y:355,zoom:1},{at:o,x:515,y:355,zoom:1.15},{at:def.durationMs,x:515,y:355,zoom:1.12}],t);if(encourage)f.actors[0].y-=Math.sin(rise*Math.PI)*3;
 outcomeText(f,t,o+300,encourage?'KESEMPATAN AKAN DATANG':'DARI TEPI LAPANGAN',encourage?'Dukungan rekan membuatmu kembali siap.':'Mengamati. Belajar. Menunggu panggilan.');return f;
}
function farewell(def:TimelineDefinition,t:number):TimelineFrame{
 const f=base(def,t),{contactMs:c,outcomeMs:o,reactionMs:r}=def,walk=e(t,0,c),exit=e(t,r,def.durationMs),x=mix(320,545,walk)+exit*125;
 const player=actor('player','player',x,510,t<c?'run':t<o?'wave':t<r?'look-back':'run',t<c?'calm':t<r?'sad':'proud',{cycle:t/230,lean:0,facing:t>=o&&t<r?-1:1});
 f.actors=[player,actor('teammate-a','teammate',200,470,'celebrate','proud',{scale:.68}),actor('teammate-b','teammate',815,470,'celebrate','proud',{scale:.68,facing:-1})];
 f.ball=sampleBall(()=>p(515,525,12),t,{owner:null,motion:'stopped',target:null});
 f.camera=sampleCamera([{at:0,x:500,y:345,zoom:1.08},{at:c,x:535,y:345,zoom:1.14},{at:o,x:535,y:345,zoom:1.12},{at:def.durationMs,x:520,y:315,zoom:.82}],t);
 outcomeText(f,t,o+250,'SATU HIDUP. SERIBU KENANGAN.','Langkah berhenti. Sekali menoleh. Tribun tetap bersuara.');return f;
}
/** Pure sampling: pause, seeking, playback speed and replay cannot accumulate scene drift. */
export function sampleTimeline(def:TimelineDefinition,timeMs:number):TimelineFrame{
 const t=clamp(Number.isFinite(timeMs)?timeMs:0,0,def.durationMs);
 switch(def.spec.action){case'shoot':return shot(def,t);case'pass':return passing(def,t);case'dribble':return dribbling(def,t);case'tackle':return tackling(def,t);case'training':return training(def,t);case'injury':return injury(def,t);case'contract':return contract(def,t);case'trophy':return trophy(def,t);case'bench':return bench(def,t);case'farewell':return farewell(def,t);}
}
export function timelineCues(def:TimelineDefinition):TimelineCue[]{const {action,variant}=def.spec,c=def.contactMs,o=def.outcomeMs;if(action==='shoot')return[{atMs:c,kind:'kick'},{atMs:o,kind:variant==='goal'?'goal':variant==='post'?'post':variant==='save'?'save':'step'},...(variant==='goal'?[{atMs:def.reactionMs,kind:'crowd' as const}]:[])];if(action==='contract')return[{atMs:c,kind:'sign'},{atMs:o+400,kind:'crowd'}];if(action==='trophy')return[{atMs:o,kind:'crowd'}];if(action==='tackle')return[{atMs:c,kind:'kick'},...(variant==='foul'?[{atMs:o,kind:'whistle' as const}]:[])];if(action==='farewell')return[{atMs:def.reactionMs,kind:'crowd'}];if(['pass','training'].includes(action))return[{atMs:c,kind:'kick'},{atMs:o,kind:'step'}];return[{atMs:c,kind:'step'}];}
