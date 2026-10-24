import type {BallFrame,Vec3} from './types';

export const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const smooth=(t:number)=>{const p=clamp(t);return p*p*(3-2*p)};
export const segment=(time:number,start:number,end:number)=>clamp((time-start)/(end-start));
export const vMix=(a:Vec3,b:Vec3,t:number):Vec3=>({x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),z:mix(a.z,b.z,t)});
export const arc=(a:Vec3,b:Vec3,t:number,height=0,curve=0):Vec3=>{const p=clamp(t),bump=4*p*(1-p);return{x:mix(a.x,b.x,p)+curve*Math.sin(Math.PI*p),y:mix(a.y,b.y,p),z:mix(a.z,b.z,p)+height*bump}};
/** Cubic world-space trajectory. Tangents describe displacement per normalized segment. */
export function hermite(a:Vec3,b:Vec3,t:number,va:Vec3,vb:Vec3):Vec3{const p=clamp(t),p2=p*p,p3=p2*p;const h00=2*p3-3*p2+1,h10=p3-2*p2+p,h01=-2*p3+3*p2,h11=p3-p2;return{x:h00*a.x+h10*va.x+h01*b.x+h11*vb.x,y:h00*a.y+h10*va.y+h01*b.y+h11*vb.y,z:h00*a.z+h10*va.z+h01*b.z+h11*vb.z}}
export const ground=(x:number,y:number):Vec3=>({x,y,z:10});
export interface BallState {owner:string|null;motion:BallFrame['motion'];target:Vec3|null;visible?:boolean;}
/** Samples the same authored curve for position, velocity, spin and its finite trail. */
export function sampleBall(position:(t:number)=>Vec3,time:number,state:BallState):BallFrame{
 const at=position(time),before=position(Math.max(0,time-4)),after=position(time+4),dt=time<4?(time+4)/1000:.008;
 const vx=(after.x-before.x)/dt,vy=(after.y-before.y)/dt,vz=(after.z-before.z)/dt;
 const moving=Math.hypot(vx,vy,vz)>12;
 const trail:Vec3[]=moving&&state.owner===null?Array.from({length:7},(_,i)=>position(Math.max(0,time-(i+1)*27))):[];
 return{...at,vx,vy,vz,rotation:(at.x*1.5+at.y*.6+at.z*.8),scale:clamp(1-(510-at.y)*.0011,.65,1.1)*(1+Math.min(at.z,180)*.00045),owner:state.owner,motion:state.motion,target:state.target,trail,visible:state.visible!==false};
}
