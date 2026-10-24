export type SoundKind='click'|'kick'|'good'|'chapter'|'whistle'|'save'|'post'|'goal'|'sign'|'crowd'|'step';
let context:AudioContext|undefined;
export function sound(kind:SoundKind,enabled:boolean){
 if(!enabled)return;
 try{context??=new AudioContext();void context.resume();const ctx=context,t=ctx.currentTime;
  const tone=(hz:number,start:number,duration:number,level:number,type:OscillatorType='sine',end=hz)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(hz,t+start);osc.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+start+duration);gain.gain.setValueAtTime(.0001,t+start);gain.gain.exponentialRampToValueAtTime(level,t+start+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+start+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start(t+start);osc.stop(t+start+duration+.015);};
  const noise=(duration:number,level:number,frequency:number)=>{const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.6;gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(level,t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start(t);};
  if(kind==='kick'){tone(155,0,.16,.15,'triangle',48);noise(.09,.07,760);}
  else if(kind==='post'){[780,1120,1640].forEach((hz,i)=>tone(hz,i*.002,.42-i*.06,.06,'sine',hz*.96));noise(.04,.04,2100);}
  else if(kind==='save'){tone(115,0,.16,.09,'triangle',65);noise(.16,.10,520);}
  else if(kind==='whistle'){tone(1850,0,.23,.035,'sine',2200);tone(2100,.26,.18,.025,'sine',1900);}
  else if(kind==='goal'||kind==='crowd'){noise(kind==='goal'?1.5:1,.13,1100);[392,494,587,784].forEach((hz,i)=>tone(hz,i*.075,.32,.028,'triangle'));}
  else if(kind==='sign'){noise(.14,.035,2400);tone(700,.12,.04,.015);}
  else if(kind==='step'){noise(.07,.025,350);}
  else if(kind==='chapter'){[220,330,440,660].forEach((hz,i)=>tone(hz,i*.08,.24,.04));}
  else if(kind==='good'){[440,554,659].forEach((hz,i)=>tone(hz,i*.07,.18,.035));}
  else tone(520,0,.07,.035,'sine',420);
 }catch{/* Sound remains optional under browser audio policies. */}
}
