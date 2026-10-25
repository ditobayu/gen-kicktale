import { useEffect, useMemo, useRef, useState } from 'react';
import { sampleTimeline, timelineCues } from '../../game/animation/timeline';
import type { TimelineCue, TimelineDefinition } from '../../game/animation/types';

interface Options { playing?:boolean; paused?:boolean; progress?:number; speed?:number; reducedMotion?:boolean; replayKey?:number; hero?:boolean; onComplete?:()=>void; onCue?:(cue:TimelineCue)=>void; }
/** One clock owns actors, ball, camera, sound cues and result presentation. */
export function useTimelinePlayer(definition:TimelineDefinition, options:Options) {
  const [time,setTime] = useState(0);
  const callbacks = useRef({onComplete:options.onComplete,onCue:options.onCue});
  callbacks.current = {onComplete:options.onComplete,onCue:options.onCue};
  const clock = useRef<{elapsed:number;complete:boolean;definition:TimelineDefinition|null;replayKey?:number}>({elapsed:0,complete:false,definition:null});
  const cues = useMemo(()=>timelineCues(definition),[definition]);
  const manual = options.progress!==undefined;
  useEffect(()=>{
    // StrictMode replays effect setup; it must not replay the completion callback.
    if(clock.current.definition!==definition||clock.current.replayKey!==options.replayKey){
      clock.current={elapsed:0,complete:false,definition,replayKey:options.replayKey};setTime(0);
    }
  },[definition,options.replayKey]);
  useEffect(()=>{
    if(manual||!options.playing||options.paused||options.reducedMotion)return;
    let raf=0,previous:number|null=null,alive=true;
    const tick=(now:number)=>{
      if(!alive)return;
      const delta=previous===null?0:Math.min(100,now-previous)*Math.max(.25,options.speed||1);previous=now;
      const before=clock.current.elapsed,after=Math.min(definition.durationMs,before+delta);clock.current.elapsed=after;
      for(const cue of cues)if(cue.atMs>before&&cue.atMs<=after)callbacks.current.onCue?.(cue);
      setTime(after);
      if(after>=definition.durationMs){
        if(!clock.current.complete){clock.current.complete=true;callbacks.current.onComplete?.();}
        if(options.hero){clock.current.elapsed=-1000;clock.current.complete=false;raf=requestAnimationFrame(tick);}
      }else raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>{alive=false;cancelAnimationFrame(raf);};
  },[definition,cues,manual,options.playing,options.paused,options.speed,options.reducedMotion,options.hero,options.replayKey]);
  useEffect(()=>{
    if(options.reducedMotion&&options.playing&&!manual&&!clock.current.complete){clock.current.complete=true;callbacks.current.onComplete?.();}
  },[definition,manual,options.playing,options.reducedMotion,options.replayKey]);
  const actualTime=options.reducedMotion?definition.durationMs:manual?Math.min(1,Math.max(0,options.progress||0))*definition.durationMs:options.playing?Math.max(0,time):0;
  return sampleTimeline(definition,actualTime);
}
