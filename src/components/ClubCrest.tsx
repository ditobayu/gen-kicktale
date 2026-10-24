import {useId} from 'react';
import type {Club} from '../game/types/game';
export default function ClubCrest({club,size=48}:{club:Club;size?:number}){
 const id=useId().replace(/:/g,'');const seed=[...club.id].reduce((n,c)=>n+c.charCodeAt(0),0);const shape=seed%4;
 const path=shape===0?'M8 5h48v33Q56 54 32 63 8 54 8 38Z':shape===1?'M32 3 59 18v31L32 63 5 49V18Z':shape===2?'M32 3a29 29 0 1 1 0 58 29 29 0 1 1 0-58Z':'M7 5h50v47L32 63 7 52Z';
 return <svg width={size} height={size*1.03} viewBox="0 0 64 66" role="img" aria-label={`Lambang ${club.name}`}><defs><clipPath id={id}><path d={path}/></clipPath></defs><path d={path} fill={club.colors[0]} stroke="#171B26" strokeWidth="2"/><g clipPath={`url(#${id})`}><path d={seed%2?'M-4 57 62-8l12 14L6 73Z':'M-4 12h72v9H-4Zm0 34h72v6H-4Z'} fill={club.colors[1]} opacity=".23"/><path d="m32 9 2 5 6 1-5 3 2 5-5-3-5 3 2-5-5-3 6-1Z" fill={club.colors[1]}/><text x="32" y="43" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize={club.crest.length>2?15:20} fontWeight="900" letterSpacing="-1" fill={club.colors[1]}>{club.crest}</text><path d="M23 50h18m-14 4h10" stroke={club.colors[1]} strokeWidth="2"/></g></svg>;
}
