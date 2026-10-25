import { useId, useMemo } from 'react';
import type { Action, Appearance, Environment } from '../game/types/game';
import { createTimeline } from '../game/animation/timeline';
import type { ActorFrame, Celebration, Intensity, ShotType, TimelineCue } from '../game/animation/types';
import { FootballerRig } from './animation/FootballerRig';
import { Goal, Grandstand, Pitch, Room, Sky } from './animation/Scenery';
import { CelebrationEffects, ChoreographyProps, Football, Impacts, Trophy } from './animation/SceneEffects';
import { useTimelinePlayer } from './animation/useTimelinePlayer';
import '../styles/scene.css';

const DEFAULT_APPEARANCE: Appearance = {skin:'#B97750',hair:'curls',preset:'classic'};
const DEFAULT_COLORS: [string,string] = ['#16764D','#F4C644'];
type Pose='stand'|'run'|'kick'|'celebrate'|'sit'|'hurt';
export interface FootballerProps {appearance?:Appearance;colors?:[string,string];age?:number;pose?:Pose;number?:string|number;className?:string;compact?:boolean;hero?:boolean;}
export interface SceneProps {
  appearance?:Appearance;age?:number;colors?:[string,string];action?:Action;variant?:string;environment?:Environment;playing?:boolean;speed?:number;
  hero?:boolean;caption?:string;reducedMotion?:boolean;name?:string;clubName?:string;clubCrest?:string;foot?:'left'|'right';shotType?:ShotType;intensity?:Intensity;
  celebration?:Celebration;seed?:number;progress?:number;paused?:boolean;onComplete?:()=>void;onCue?:(cue:TimelineCue)=>void;replayKey?:number;
}

export function Footballer({appearance=DEFAULT_APPEARANCE,colors=DEFAULT_COLORS,age=22,pose='stand',number=10,className=''}:FootballerProps) {
  const id=useId().replace(/:/g,'');
  const actor:ActorFrame={id:'portrait',role:'player',x:120,y:335,scale:age<14?1.58:1.65,facing:1,rotation:0,lean:pose==='kick'?11:0,pose:pose==='stand'?'idle':pose,cycle:.16,emotion:pose==='celebrate'?'proud':pose==='hurt'?'hurt':'calm'};
  return <svg className={`footballer-preview ${className}`} viewBox="0 0 240 360" role="img" aria-label="Karakter pesepak bola pilihanmu"><ellipse cx="123" cy="345" rx="69" ry="10" fill="#173F37" opacity=".18" /><FootballerRig actor={actor} appearance={appearance} colors={colors} age={age} id={id} number={number} /></svg>;
}

export function Scene({appearance=DEFAULT_APPEARANCE,age=22,colors=DEFAULT_COLORS,action='dribble',variant='success',environment='stadium',playing=true,speed=1,hero=false,caption,reducedMotion=false,name='',clubName='Klub barumu',clubCrest,foot='right',shotType,intensity,celebration,seed=7,progress,paused=false,onComplete,onCue,replayKey=0}:SceneProps) {
  const id=useId().replace(/:/g,'');
  const definition=useMemo(()=>createTimeline({action,variant,environment,foot,shotType,intensity,celebration,seed}),[action,variant,environment,foot,shotType,intensity,celebration,seed]);
  const frame=useTimelinePlayer(definition,{playing,speed,hero,reducedMotion,progress,paused,onComplete,onCue,replayKey});
  const indoor=['office','medical','locker'].includes(environment),camera=frame.camera;
  const transform=`translate(${500+camera.shakeX} ${300+camera.shakeY}) scale(${camera.zoom}) translate(${-camera.x} ${-camera.y})`;
  const hasGoal=!indoor&&!['trophy','bench'].includes(action);
  const subtitle=action==='contract'&&frame.title?`${name?`${name} · `:''}${clubName}. ${frame.subtitle}`:frame.subtitle&&name?`${name}. ${frame.subtitle}`:frame.subtitle;
  const titleOpacity=Math.min(1,Math.max(0,(frame.timeMs-definition.outcomeMs-120)/230));
  const mainColor=colors[0].replace('#',''),rgb=[0,2,4].map(i=>parseInt(mainColor.slice(i,i+2),16));
  const opponentColors:[string,string]=rgb[0]>rgb[1]&&rgb[0]>rgb[2]?['#356D87','#EEE0B9']:['#AB5544','#EEE0B9'];
  return <div className={`scene scene--${action} variant-${definition.spec.variant} ${hero?'scene--hero':''} ${playing&&!paused?'is-playing':'is-paused'} ${reducedMotion?'reduce-motion':''}`} data-phase={frame.phase} data-progress={frame.progress.toFixed(3)} data-duration={definition.durationMs} data-action={action} data-outcome={definition.spec.variant}>
    <svg className="scene-art" viewBox={hero?'0 -90 1000 780':'0 0 1000 600'} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${caption||`${name?`${name}: `:''}${action}`}${frame.title?` — ${frame.title}`:''}`}>
      <title>{caption||'Satu bola. Seribu kemungkinan.'}</title><desc>{subtitle||'Saksikan persiapan, sentuhan bola, hasil, dan reaksi para pemain.'}</desc>
      <Sky id={id} environment={environment} />
      {!indoor&&<g transform={`translate(${-(camera.x-500)*.16} ${-(camera.y-300)*.09})`}><Grandstand id={id} frame={frame} environment={environment} /></g>}
      <g className="scene-world" transform={transform}>
        {indoor?<Room environment={environment} clubName={clubName} colors={colors} />:<Pitch id={id} environment={environment} />}
        {hasGoal&&<Goal frame={frame} />}
        {frame.actors.map(actor=><ellipse key={`shadow-${actor.id}`} cx={actor.x} cy={actor.y+4} rx={(Math.abs(actor.rotation)>25?46:26)*actor.scale} ry={5*actor.scale} fill="#122F2D" opacity={.23*(actor.opacity??1)} />)}
        {action==='training'&&<ChoreographyProps frame={frame} definition={definition} name={name} />}
        {[...frame.actors].sort((a,b)=>a.y-b.y).map(actor=><FootballerRig key={actor.id} actor={actor} id={`${id}-${actor.id}`} appearance={actor.role==='player'?appearance:{skin:['#A76C48','#C48F66','#865E46'][actor.id.length%3],hair:actor.role==='keeper'?'crop':actor.id.length%2?'sweep':'curls',preset:'classic'}} colors={actor.role==='keeper'?['#E1B95C','#304D44']:actor.role==='opponent'?opponentColors:actor.role==='official'?['#333D42','#C3B58B']:colors} age={actor.role==='player'?age:26} foot={foot} crest={actor.role==='player'||actor.role==='teammate'||actor.role==='keeper'?clubCrest:undefined} jersey={action==='contract'&&actor.role==='player'} number={actor.role==='keeper'?1:actor.role==='player'?10:actor.id.length+2} />)}
        {frame.ball?.visible&&<Football ball={frame.ball} />}
        <Impacts frame={frame} />
        {hasGoal&&<Goal frame={frame} front />}
        {action!=='training'&&<ChoreographyProps frame={frame} definition={definition} name={name} />}
        {action==='trophy'&&<Trophy frame={frame} />}
      </g>
      <CelebrationEffects frame={frame} definition={definition} />
      {frame.impacts.some(i=>i.kind==='flash')&&<rect x="-100" y="-180" width="1200" height="1000" fill="#FFF7DA" opacity={Math.min(.14,frame.impacts.filter(i=>i.kind==='flash').reduce((n,i)=>n+i.strength,0)*.11)} />}
      <rect x="-100" y="-180" width="1200" height="1000" fill={`url(#${id}-grain)`} pointerEvents="none" />
      <g className="scene-cinematic-label" transform="translate(28 26)"><path d="M0 0h124v22H0Z" fill="#173D38" fillOpacity=".86" /><circle cx="12" cy="11" r="3" fill={frame.phase==='complete'?'#D6BC72':'#F1D277'} /><text x="24" y="15" fill="#ECE7CE" fontSize="9" fontWeight="800" fontFamily="Arial,sans-serif" letterSpacing="1.2">{action==='contract'?'PENGUMUMAN':action==='farewell'?'PELUIT TERAKHIR':action==='training'?'LATIHAN':'KICKTALE LIVE'}</text><text x="137" y="15" fill="#F0E6BF" stroke="#213D36" strokeWidth=".2" fontSize="9" fontWeight="800" fontFamily="Arial,sans-serif" letterSpacing="1.5">{shotType&&action==='shoot'?({driven:'TEMBAKAN DATAR',curled:'TEMBAKAN MELENGKUNG',lofted:'BOLA LAMBUNG',close:'PENYELESAIAN DEKAT',penalty:'TITIK PUTIH',header:'SUNDULAN'}[shotType]):clubName==='Klub barumu'?'':clubName.toUpperCase()}</text></g>
      {frame.title&&<g className={`scene-outcome scene-outcome--${definition.spec.variant}`} opacity={titleOpacity} transform={`translate(500 ${80+(1-titleOpacity)*-12})`}><path d="M-232-28 239-35 227 27-241 34Z" fill="#173D37" fillOpacity=".94" stroke="#E3C572" strokeWidth="2" /><text x="0" y="11" textAnchor="middle" fill={definition.spec.variant==='goal'?'#F0CC68':'#F0E8CD'} fontFamily="Impact,Arial Black,Arial,sans-serif" fontSize={frame.title.length>25?22:frame.title.length>18?27:37} fontWeight="900" letterSpacing="1">{frame.title}</text>{frame.score&&<g transform="translate(275 0)"><rect x="-31" y="-26" width="84" height="53" rx="3" fill="#E6C572" /><text x="11" y="10" textAnchor="middle" fill="#173D37" fontFamily="Arial,sans-serif" fontSize="24" fontWeight="900">{frame.score}</text></g>}</g>}
      {subtitle&&frame.title&&!hero&&<g className="scene-commentary" opacity={titleOpacity}><path d="M18 551h964v36H18Z" fill="#173D37" fillOpacity=".93" /><path d="M18 551h5v36h-5Z" fill="#E4C46C" /><text x="37" y="574" fill="#F1E8CB" fontSize={subtitle.length>110?11:13} fontFamily="Arial,sans-serif" fontWeight="600">{subtitle.slice(0,145)}</text></g>}
      <path d="M1 1h998v598H1Z" stroke="#17362F" strokeWidth="2" fill="none" opacity=".14" />
    </svg>
  </div>;
}

export default Scene;
