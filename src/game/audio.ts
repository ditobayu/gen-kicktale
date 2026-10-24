let context: AudioContext | undefined;
export function sound(kind: 'click'|'kick'|'good'|'chapter'|'whistle', enabled:boolean) {
  if (!enabled) return;
  try {
    context ||= new AudioContext();
    void context.resume();
    const t=context.currentTime;
    const notes=kind==='good'?[440,554,659]:kind==='chapter'?[220,330,440,660]:kind==='whistle'?[1900,2100]:kind==='kick'?[110,65]:[520];
    notes.forEach((hz,i)=> { const o=context!.createOscillator(),g=context!.createGain(); o.type=kind==='kick'?'triangle':'sine';o.frequency.setValueAtTime(hz,t+i*.07);g.gain.setValueAtTime(.0001,t+i*.07);g.gain.exponentialRampToValueAtTime(.065,t+i*.07+.012);g.gain.exponentialRampToValueAtTime(.0001,t+i*.07+.16);o.connect(g);g.connect(context!.destination);o.start(t+i*.07);o.stop(t+i*.07+.18); });
  } catch { /* Audio is optional when browser policies or devices prevent it. */ }
}
