import type { BallFrame, TimelineDefinition, TimelineFrame } from '../../game/animation/types';

export function Football({ball}:{ball:BallFrame}) {
  const r=12*ball.scale;
  return <g className="scene-ball" data-motion={ball.motion} data-owner={ball.owner||'none'} data-world-x={ball.x.toFixed(2)} data-world-y={ball.y.toFixed(2)} data-world-z={ball.z.toFixed(2)}>
    <ellipse cx={ball.x} cy={ball.y+2} rx={r*(1+ball.z/180)} ry={r*.25} fill="#102F2E" opacity={Math.max(.06,.31-ball.z/650)} />
    {ball.trail.length>1&&['flight','rebound','rolling'].includes(ball.motion)&&<g fill="none" strokeLinecap="round"><polyline points={ball.trail.map(p=>`${p.x},${p.y-p.z}`).join(' ')} stroke="#F6E5AA" strokeWidth={r*.82} opacity=".13" /><polyline points={ball.trail.slice(-5).map(p=>`${p.x},${p.y-p.z}`).join(' ')} stroke="#FFF5D1" strokeWidth={r*.28} opacity=".45" /></g>}
    <g transform={`translate(${ball.x} ${ball.y-ball.z}) rotate(${ball.rotation})`}><circle r={r} fill="#F5ECD1" stroke="#19363B" strokeWidth="1.7" /><path d={`M0 ${-r*.48} ${r*.46} ${-r*.12} ${r*.28} ${r*.43} ${-r*.28} ${r*.43} ${-r*.46} ${-r*.12}Z`} fill="#243C42" /><path d={`M0 ${-r*.48}V${-r}M${r*.46} ${-r*.12} ${r*.94} ${-r*.31}M${r*.28} ${r*.43} ${r*.59} ${r*.81}M${-r*.28} ${r*.43} ${-r*.59} ${r*.81}M${-r*.46} ${-r*.12} ${-r*.94} ${-r*.31}`} stroke="#243C42" strokeWidth="1.2" fill="none" /><path d={`M${-r*.58} ${-r*.55}Q0 ${-r*.92} ${r*.48} ${-r*.56}`} stroke="#FFFBE7" strokeWidth="2.3" fill="none" /></g>
  </g>;
}

export function Impacts({frame}:{frame:TimelineFrame}) {
  return <g className="scene-impacts">{frame.impacts.filter(i=>i.kind!=='flash').map(({point,strength,kind},index)=><g key={`${kind}-${index}`} transform={`translate(${point.x} ${point.y-point.z})`} opacity={Math.min(1,strength)}>
    <ellipse rx={14+(1-strength)*27} ry={6+(1-strength)*10} fill="none" stroke={kind==='post'?'#FFF3B4':'#F2DB8E'} strokeWidth="2" opacity=".7" />
    {Array.from({length:7},(_,n)=><path key={n} transform={`rotate(${n*51.4})`} d={`M${17+(1-strength)*8} 0h${7+strength*11}`} stroke={kind==='block'?'#EBCB9A':'#FFF0B1'} strokeWidth={2.2*strength} strokeLinecap="round" />)}
    {kind==='grass'&&Array.from({length:5},(_,n)=><path key={n} d={`M${(n-2)*8} ${-5-n%3*3}l${(n-2)*3} ${-10-(1-strength)*21}`} stroke="#92B979" strokeWidth="2.5" />)}
  </g>)}</g>;
}

export function Trophy({frame}:{frame:TimelineFrame}) {
  const player=frame.actors.find(a=>a.id==='player'),hands=player?.hands;
  if(!player||!hands?.length)return null;
  const x=hands.reduce((a,h)=>a+h.x,0)/hands.length,y=hands.reduce((a,h)=>a+h.y-h.z,0)/hands.length;
  return <g className="scene-trophy" transform={`translate(${x} ${y-12})`}><path d="M-25-26h50l-5 28Q0 27-20 2Z" fill="#EBC05E" stroke="#654F2F" strokeWidth="3" /><path d="M-23-17h-16q-3 27 24 28m38-28h16q3 27-24 28" fill="none" stroke="#EBC05E" strokeWidth="8" /><path d="M-23-17h-16q-3 27 24 28m38-28h16q3 27-24 28" fill="none" stroke="#654F2F" strokeWidth="2" /><path d="M0 16v24m-19 6h38l-4-10h-30Z" fill="#EBC05E" stroke="#654F2F" strokeWidth="3" /><path d="m-13-22-3 21Q-9 11-3 12" fill="none" stroke="#FFF0A2" strokeWidth="5" /><path d="m1-15 4 9 10 2-8 6 2 11-8-5-9 5 2-10-7-7 10-2Z" fill="#F7DF83" /></g>;
}

function CeremonyTable({frame,definition,name}:{frame:TimelineFrame;definition:TimelineDefinition;name:string}) {
  const amount=Math.min(1,Math.max(0,(frame.timeMs-definition.contactMs+200)/650));
  return <g className="ceremony-table"><path d="M279 440 506 420l74 42-259 24Z" fill="#B98B59" stroke="#29483E" strokeWidth="3" /><path d="m321 486 259-24v12l-259 24Z" fill="#8D603D" stroke="#29483E" strokeWidth="2.5" /><path d="M341 497v73m220-94v80" stroke="#29483E" strokeWidth="9" /><path d="m397 435 80-6 44 25-88 9Z" fill="#F9EED4" stroke="#7D8168" strokeWidth="1" /><path d="m421 437 40-3m-34 7 42-3m-36 8 31-2" stroke="#ACAA8E" strokeWidth="1.5" /><path d="m442 452q4-8 7-2t9-4q-4 11 6 2t11 0" stroke="#254A4A" strokeWidth="1.7" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1-amount} /><text x="443" y="461" fontSize="5.5" fontFamily="Arial,sans-serif" fill="#6F7963" transform="rotate(-5 443 461)">{name.slice(0,22)}</text></g>;
}

export function ChoreographyProps({frame,definition,name}:{frame:TimelineFrame;definition:TimelineDefinition;name:string}) {
  const action=definition.spec.action;
  return <g>{action==='training'&&[280,370,460,550].map((x,n)=><g key={x} transform={`translate(${x} ${518+(n%2?-24:24)})`}><ellipse rx="15" ry="4" cy="2" fill="#163D33" opacity=".24" /><path d="M-12 0 0-25 12 0Z" fill="#DC8A42" stroke="#6C6543" strokeWidth="1.5" /><path d="m-5-11 10 0" stroke="#F9DAB0" strokeWidth="4" /></g>)}
    {action==='bench'&&<g><path d="M349 461h274v12H349Z" fill="#BC8D5A" stroke="#3D5848" strokeWidth="3" /><path d="M373 475v55m227-55v55" stroke="#3D5848" strokeWidth="7" /><path d="M349 426h274v15H349Z" fill="#BA8856" stroke="#3D5848" strokeWidth="3" /></g>}
    {action==='contract'&&<CeremonyTable frame={frame} definition={definition} name={name} />}
    {action==='tackle'&&definition.spec.variant==='foul'&&frame.timeMs>definition.reactionMs&&(()=>{const a=frame.actors.find(a=>a.role==='official');return a?<g transform={`translate(${a.x-28} ${a.y-142})`}><path d="M-9-19h19v29H-9Z" fill="#E7C859" stroke="#243E37" strokeWidth="2" /></g>:null;})()}
    {action==='injury'&&frame.timeMs>definition.reactionMs&&<g transform="translate(601 501)"><path d="M-17-10h34v24h-34Z" fill="#E5DCC1" stroke="#3F6553" strokeWidth="2" /><path d="M-8-10v-6H8v6" fill="none" stroke="#3F6553" strokeWidth="2" /><path d="M0-5V9m-7-7H7" stroke="#B95E47" strokeWidth="4" /></g>}
  </g>;
}

export function CelebrationEffects({frame,definition}:{frame:TimelineFrame;definition:TimelineDefinition}) {
  const trophy=definition.spec.action==='trophy',goal=definition.spec.action==='shoot'&&definition.spec.variant==='goal';
  const elapsed=frame.timeMs-(trophy?definition.outcomeMs:definition.reactionMs);
  if((!trophy&&!goal)||elapsed<0)return null;
  return <g className="celebration-particles">{Array.from({length:trophy?65:21},(_,n)=>{
    const start=(n*73)%900,progress=Math.max(0,(elapsed-start)/2200),x=140+(n*167)%760+Math.sin(progress*5+n)*32,y=-40+progress*560+(n*59)%80;
    return progress>0&&progress<1.4?<path key={n} d="M-3-7h6V7h-6Z" transform={`translate(${x} ${y}) rotate(${n*33+progress*360})`} fill={['#ECCC6F','#F3EAD0','#C96548','#74A48C'][n%4]} opacity={Math.min(1,progress*9,Math.max(0,1.4-progress)*3)} />:null;
  })}</g>;
}
