import type {CameraFrame,Vec3} from './types';
import {clamp,mix,smooth} from './ball';
export interface CameraKey {at:number;x:number;y:number;zoom:number;}
/** A seekable virtual camera. It uses no frame history and therefore also supports scrubbing. */
export function sampleCamera(keys:CameraKey[],time:number,impacts:{at:number;strength:number}[]=[]):CameraFrame{
 let a=keys[0],b=keys[keys.length-1];for(let i=1;i<keys.length;i++){if(time<=keys[i].at){a=keys[i-1];b=keys[i];break;}a=keys[i];}
 const p=b.at===a.at?1:smooth((time-a.at)/(b.at-a.at));let shakeX=0,shakeY=0;
 for(const impact of impacts){const t=time-impact.at;if(t>=0&&t<180){const decay=(1-t/180)**2;shakeX+=Math.sin(t*.18)*impact.strength*decay;shakeY+=Math.cos(t*.23)*impact.strength*.55*decay;}}
 return{x:mix(a.x,b.x,p),y:mix(a.y,b.y,p),zoom:mix(a.zoom,b.zoom,p),shakeX,shakeY};
}
export function project(point:Vec3,camera:CameraFrame){return{x:500+(point.x-camera.x)*camera.zoom+camera.shakeX,y:300+(point.y-point.z-camera.y)*camera.zoom+camera.shakeY};}
/** Fit all important world points in the 1000 × 600 composition. */
export function fitCamera(points:Vec3[],zoom=1,padding=70):Pick<CameraFrame,'x'|'y'|'zoom'>{const xs=points.map(p=>p.x),ys=points.map(p=>p.y-p.z);const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);return{x:(left+right)/2,y:(top+bottom)/2,zoom:clamp(Math.min(zoom,(1000-padding*2)/Math.max(1,right-left),(600-padding*2)/Math.max(1,bottom-top)),.7,1.45)};}
