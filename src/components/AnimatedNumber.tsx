import {useEffect,useState} from 'react';
export default function AnimatedNumber({value,from=value,active=false,reduced=false}:{value:number;from?:number;active?:boolean;reduced?:boolean}){
 const [display,setDisplay]=useState(active&&!reduced?from:value);
 useEffect(()=>{if(!active||reduced){setDisplay(value);return;}let id:number,start:number|undefined;let live=true;const frame=(now:number)=>{if(!live)return;start??=now;const t=Math.min(1,(now-start)/650);setDisplay(from+(value-from)*(1-Math.pow(1-t,3)));if(t<1)id=requestAnimationFrame(frame);};id=requestAnimationFrame(frame);return()=>{live=false;cancelAnimationFrame(id);};},[value,from,active,reduced]);
 return <span className={active&&value!==from?`number-change ${value>from?'number-up':'number-down'}`:''}>{Math.round(display)}</span>;
}
