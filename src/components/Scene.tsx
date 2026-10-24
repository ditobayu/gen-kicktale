import { useId, type CSSProperties } from 'react';
import type { Action, Appearance, Environment } from '../game/types/game';
import { playAnimation } from '../game/animation/registry';
import '../styles/scene.css';

const DEFAULT_APPEARANCE: Appearance = { skin: '#B97750', hair: 'curls', preset: 'classic' };
type Pose = 'stand' | 'run' | 'kick' | 'celebrate' | 'sit' | 'hurt';
export interface FootballerProps {
  appearance?: Appearance; colors?: [string, string]; age?: number; pose?: Pose;
  number?: string | number; className?: string; compact?: boolean; hero?: boolean;
}
export interface SceneProps {
  appearance?: Appearance; age?: number; colors?: [string, string]; action?: Action;
  variant?: string; environment?: Environment; playing?: boolean; speed?: number;
  hero?: boolean; caption?: string; reducedMotion?: boolean;
}

function Figure({ appearance = DEFAULT_APPEARANCE, colors = ['#16764D', '#F4C644'], age = 22, pose = 'stand', number = 10, className = '', id, coach = false, goalkeeper = false, bandaged = false }: FootballerProps & { id: string; coach?: boolean; goalkeeper?: boolean; bandaged?: boolean }) {
  const young = age < 14;
  const older = age >= 35;
  const hair = older ? '#383C38' : '#202329';
  const skin = appearance.skin || '#B97750';
  const main = colors[0]; const trim = colors[1];
  const hairArt = appearance.hair === 'curls' ? <g fill={hair}><path d="M84 66C73 36 91 16 119 17c25-2 45 14 41 43l-10 5-6-18-15 6-15-11-16 12-6 19Z" /><circle cx="90" cy="39" r="13" /><circle cx="108" cy="28" r="14" /><circle cx="130" cy="29" r="15" /><circle cx="149" cy="40" r="13" /></g>
    : appearance.hair === 'sweep' ? <path fill={hair} d="M83 69C73 41 83 22 108 19c23-13 47-2 52 21 2 12-2 22-9 29l-5-25c-20 12-34 7-43 3l-12 27Z" />
      : <path fill={hair} d="M84 69 79 51c0-25 19-33 42-33 21-1 39 11 40 31l-7 20-8-24-48 1-7 25Z" />;
  return <g className={`footballer-figure pose-${pose} ${young ? 'is-child' : ''} ${older ? 'is-veteran' : ''} ${className}`} style={{ '--kit': main, '--trim': trim } as CSSProperties}>
    <defs><linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2=".65"><stop stopColor={skin} /><stop offset="1" stopColor={skin} stopOpacity=".84" /></linearGradient><linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="1" y2=".4"><stop stopColor={main} /><stop offset=".65" stopColor={main} /><stop offset="1" stopColor="#131E25" stopOpacity=".45" /></linearGradient></defs>
    <ellipse className="figure-ground" cx="125" cy="344" rx="70" ry="13" fill="#102D26" opacity=".19" />
    <g className="figure-body" transform={young ? 'translate(15 34) scale(.87)' : undefined}>
      <g transform="translate(94 218)"><g className="limb leg-left">
        <path d="M-24-7 23-7 22 24 13 61-9 63-23 29Z" fill={coach ? '#323A47' : '#182630'} stroke="#17202A" strokeWidth="3" />
        <path d="m-9 43 24 1-2 23-20 1Z" fill={skin} stroke="#17202A" strokeWidth="2.5" />
        <g transform="translate(3 60)"><g className="limb shin-left"><path d="m-10-2 22 0 0 23-6 37-18-1-4-28Z" fill={coach ? '#323A47' : main} stroke="#17202A" strokeWidth="3" />
          <path d="m-12 3 23 0-1 8-23-1" fill={trim} /><path d="m-12 48 19 1 1 10 19 10c9 6 7 14-2 16l-45-2c-5-7-4-16 1-24Z" fill="#18212D" stroke="#111923" strokeWidth="3" /><path d="m-21 78 46 2" fill="none" stroke="#F4EEDB" strokeWidth="5" /><path d="m7 66 6 2m-13-5 6 2" stroke={trim} strokeWidth="3" /></g></g>
      </g></g>
      <g transform="translate(148 218)"><g className="limb leg-right">
        <path d="M-23-7 24-7 22 30 8 63-23 60-25 24Z" fill={coach ? '#323A47' : '#182630'} stroke="#17202A" strokeWidth="3" />
        <path d="m-20 44 27 1-3 23-22-1Z" fill={skin} stroke="#17202A" strokeWidth="2.5" />
        {bandaged && <g><path d="m-21 44 29 1-2 18-26-1Z" fill="#F2E8CB" stroke="#6F786A" strokeWidth="2" /><path d="m-20 49 26 1m-26 6 25 1" stroke="#BABDA8" strokeWidth="2" /></g>}
        <g transform="translate(-6 61)"><g className="limb shin-right"><path d="m-12-2 24 0 4 27-5 31-23 0-6-29Z" fill={coach ? '#323A47' : main} stroke="#17202A" strokeWidth="3" /><path d="m-13 3 24 0 1 9-26-2" fill={trim} /><path d="m-10 48 22 0 3 12 23 10c7 5 6 13-3 15l-47-1c-7-5-4-16 0-24Z" fill="#18212D" stroke="#111923" strokeWidth="3" /><path d="m-14 79 50 1" stroke="#F4EEDB" strokeWidth="5" /><path d="m14 65 9 3m-17-6 8 3" stroke={trim} strokeWidth="3" /></g></g>
      </g></g>
      <g transform="translate(75 131)"><g className="limb arm-left"><path d="M-3-9c-14-2-23 9-25 26l-4 30 24 7L9 23 16 7Z" fill={`url(#${id}-skin)`} stroke="#17202A" strokeWidth="3" />
        <g transform="translate(-19 46)"><g className="limb forearm-left"><path d="m-12-6 21 5-4 31 4 22c0 10-13 13-18 4l-7-24Z" fill={skin} stroke="#17202A" strokeWidth="3" /><path d="m-7 36-3 12m10-13 1 12" stroke="#724A37" strokeWidth="1.5" opacity=".65" />{goalkeeper && <path d="m-14 30 18 3 9 9-3 16c-5 8-17 4-20-2l-7-15Z" fill="#EEE6CB" stroke="#17202A" strokeWidth="3" />}</g></g>
        <path d="M-3-14c-13 0-23 12-26 28l29 10L17 1Z" fill={main} stroke="#17202A" strokeWidth="3" /><path d="m-27 10 29 10" stroke={trim} strokeWidth="7" />
      </g></g>
      <g className="figure-torso"><path d="M96 105 76 113 66 145l10 68 17 15 58-1 17-16 9-67-15-31-20-8Z" fill={`url(#${id}-shirt)`} stroke="#17202A" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="m92 110 28 18 28-18-9-8h-39Z" fill="#17202A" /><path d="m91 112 29 17 27-17" fill="none" stroke={trim} strokeWidth="6" />
        <path d="m78 133 8 53-2 24m72-76-9 51 9 21" fill="none" stroke="#FFF8DE" strokeWidth="2.5" opacity=".2" />
        <path d="M87 208c17 6 40 6 68-1" fill="none" stroke="#141C27" strokeWidth="3" opacity=".4" />
        <path d="m141 140 7-4 7 4-1 11-6 5-6-5Z" fill={trim} stroke="#17202A" strokeWidth="1.6" /><path d="m94 144 4-6 4 6" stroke={trim} strokeWidth="2.5" fill="none" />
        <text x="120" y="191" textAnchor="middle" fill={trim} stroke="#17202A" strokeWidth=".6" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="39">{coach ? '' : number}</text>
      </g>
      <g transform="translate(166 131)"><g className="limb arm-right"><path d="M-10-4 12-8c14 10 18 30 21 52l-25 5-16-29Z" fill={`url(#${id}-skin)`} stroke="#17202A" strokeWidth="3" />
        <g transform="translate(21 44)"><g className="limb forearm-right"><path d="m-13-4 23-4 8 32-5 28c-3 10-18 8-18-2l2-23Z" fill={skin} stroke="#17202A" strokeWidth="3" /><path d="m4 35-2 13m8-14-1 11" stroke="#724A37" strokeWidth="1.5" opacity=".65" />{goalkeeper && <path d="m-5 31 20-2 9 13-5 16c-5 7-18 4-21-3l-4-12Z" fill="#EEE6CB" stroke="#17202A" strokeWidth="3" />}</g></g>
        <path d="M-11-14c17-1 29 13 34 31L-5 27-20 2Z" fill={main} stroke="#17202A" strokeWidth="3" /><path d="m-5 22 28-9" stroke={trim} strokeWidth="7" />
      </g></g>
      <path d="m105 91-3 17c8 13 27 16 37-1l-5-20" fill={skin} stroke="#17202A" strokeWidth="3" />
      <path d="m104 99 17 10 16-14" fill="#724A37" opacity=".28" />
      <g className="figure-head" transform={young ? 'translate(-7 -5) scale(1.06)' : undefined}>
        <path d="M86 61c-10-5-17 4-10 17l11 7m66-23c11-4 17 5 10 17l-11 7" fill={skin} stroke="#17202A" strokeWidth="3" />
        <path d="M84 51c0-19 73-22 73 0l-5 38c-3 15-24 25-31 26-12-2-33-14-35-30Z" fill={`url(#${id}-skin)`} stroke="#17202A" strokeWidth="3" />
        <path d="m145 56-1 29-12 15-12 6 1 8c20-3 32-15 33-31l3-30Z" fill="#714837" opacity=".2" />
        {hairArt}
        <path d={appearance.preset === 'spark' ? 'm94 66 14-3m24 0 14 5' : appearance.preset === 'calm' ? 'm94 66 14 0m24 0 14 0' : 'm93 65 16 1m23 0 15-3'} stroke="#29262A" strokeWidth="3.5" strokeLinecap="round" />
        <path d="m98 74 9 0m27 0 9 0" stroke="#F5E6CF" strokeWidth="4" strokeLinecap="round" /><circle cx="104" cy="74" r="2.5" fill="#17202A" /><circle cx="136" cy="74" r="2.5" fill="#17202A" />
        <path d="m121 73-4 14 7 2" fill="none" stroke="#724A37" strokeWidth="2" strokeLinecap="round" />
        <path d={appearance.preset === 'spark' ? 'M108 94q14 12 26-1' : 'M110 97q11 5 22-1'} fill={appearance.preset === 'spark' ? '#F4EEDB' : 'none'} stroke="#623E31" strokeWidth="2.5" strokeLinecap="round" />
        {older && <g fill="none" stroke="#66574A" strokeWidth="1.5" opacity=".6"><path d="m90 79 8 2m42 0 9-2m-42 25 25 0" /><path d="m91 92 8 11m42-12-7 12" /></g>}
      </g>
    </g>
  </g>;
}

export function Footballer(props: FootballerProps) {
  const id = useId().replace(/:/g, '');
  return <svg className={`footballer-preview ${props.className || ''}`} viewBox="0 0 240 360" role="img" aria-label="Karakter pesepak bola pilihanmu"><Figure {...props} className="" id={id} /></svg>;
}

function Ball({ x = 0, y = 0, r = 25, className = '' }: { x?: number; y?: number; r?: number; className?: string }) {
  return <g transform={`translate(${x} ${y})`}><g className={`football ${className}`}><circle r={r} fill="#F9F1D8" stroke="#17202A" strokeWidth="2.8" /><path d={`m0 ${-r * .45} ${r * .47} ${r * .34} ${-r * .18} ${r * .53} ${-r * .58} 0 ${-r * .18} ${-r * .53}Z`} fill="#17202A" /><path d={`M0 ${-r * .45} 0 ${-r}M${r * .47} ${-r * .11} ${r * .95} ${-r * .32}M${r * .29} ${r * .42} ${r * .58} ${r * .82}M${-r * .29} ${r * .42} ${-r * .58} ${r * .82}M${-r * .47} ${-r * .11} ${-r * .95} ${-r * .32}`} stroke="#17202A" strokeWidth="2" /><path d={`M${-r * .55} ${-r * .6}Q0 ${-r * .96} ${r * .52} ${-r * .61}`} stroke="white" strokeWidth="4" fill="none" opacity=".7" /></g></g>;
}

function Floodlight({ x, y = 32, flip = false }: { x: number; y?: number; flip?: boolean }) { return <g transform={`translate(${x} ${y}) ${flip ? 'scale(-1 1)' : ''}`}><path d="M0 23 44 250 55 250 11 22" fill="#203943" /><path d="m6 65 22 25-10 16 23 21-12 15 23 28" fill="none" stroke="#587775" strokeWidth="3" /><path d="M-56 0 46-15 65 38-37 54Z" fill="#182B34" stroke="#F4EEDB" strokeWidth="3" />{[0, 1, 2, 3].map(c => [0, 1].map(r => <path key={`${c}-${r}`} d={`M${-45 + c * 24 + r * 8} ${8 + r * 20}l17-3 5 13-17 3Z`} fill="#F8EDC4" opacity={.85 + r * .1} />))}</g>; }

function Stadium({ id, hero }: { id: string; hero: boolean }) { return <g>
  <rect width="1000" height="600" fill={`url(#${id}-sky)`} />
  <circle cx="768" cy="84" r="76" fill="#F4C644" opacity=".1" /><circle cx="768" cy="84" r="46" fill="#F4C644" opacity=".09" />
  <path d="M0 180Q505 75 1000 180L1000 376H0Z" fill="#253B40" />
  <path d="M0 214Q500 117 1000 214" fill="none" stroke="#819087" strokeWidth="9" /><path d="M0 244Q500 148 1000 244" fill="none" stroke="#112B30" strokeWidth="26" />
  <path d="M0 233Q500 137 1000 233" fill="none" stroke="#D6C7A2" strokeWidth="3" />
  {[0, 1, 2, 3].map(row => <g key={row} opacity={.5 + row * .1}>{Array.from({ length: 45 }, (_, n) => { const x = n * 24 + (row % 2 ? 12 : 0); const y = 225 + row * 27 - 40 * Math.sin(x / 1000 * Math.PI); const color = ['#C3AC78', '#415956', '#CE653C', '#D7C99F', '#6F8170'][(n * 7 + row) % 5]; return <g key={n} fill={color}><circle cx={x} cy={y} r="5" /><path d={`M${x - 7} ${y + 7}q7-7 14 0l3 14h-20Z`} />{n % 6 === row && <path className="crowd-arms" style={{ '--delay': `${-(n % 7) * .19}s` } as CSSProperties} d={`m${x - 6} ${y + 9}-9-11m21 11 9-11`} stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />}</g>; })}</g>)}
  <g className="crowd-flashes" fill="#FAF1D3">{[0, 1, 2, 3, 4, 5].map(n => <g key={n} className="crowd-flash" style={{ '--delay': `${-n * .49}s` } as CSSProperties} transform={`translate(${118 + n * 147} ${232 + n % 3 * 19})`}><path d="M-7 0h14M0-7V7" stroke="#FAF1D3" strokeWidth="2" /><circle r="2.5" /></g>)}</g>
  <path d="M0 345h1000v34H0Z" fill="#F4C644" /><g fill="#263B34" fontSize="16" letterSpacing="4" fontFamily="Arial,sans-serif" fontWeight="900"><text x="49" y="367">MIMPI DIMULAI DI SINI</text><text x="577" y="367">SATU BOLA. SERIBU CERITA.</text></g>
  <path d="M0 378h1000v222H0Z" fill="#257452" />
  {[0, 1, 2, 3].map(n => <path key={n} d={`M${n * 280 - 350} 600 445 378h85L${n * 280 - 130} 600Z`} fill="#3C8C5B" opacity=".42" />)}
  <path d="M0 532 1000 408M390 600 661 378M0 419l1000 93" fill="none" stroke="#DBDDAD" strokeWidth="3" opacity=".7" /><ellipse cx="658" cy="444" rx="105" ry="29" transform="rotate(-8 658 444)" fill="none" stroke="#DBDDAD" strokeWidth="3" opacity=".7" />
  <g className="goal-net"><path d="m797 291 152-9 17 134-160 30Z" fill="#B6C0AD" fillOpacity=".08" stroke="#F2E8C8" strokeWidth="6" />
  <path d="m797 291 28 20 145-11m-164 146 30-26 134-20M825 311l11 109m-11-109 145-11" fill="none" stroke="#C4CEB7" strokeWidth="2" opacity=".8" />
  {Array.from({ length: 9 }, (_, n) => <path key={n} d={`m${811 + n * 17} ${292 - n} 10 ${139 - n * 3}m-20 ${n * 15 + 303} 160-14`} fill="none" stroke="#CDD6B8" strokeWidth="1" opacity=".4" />)}</g>
  <path d={hero ? 'M247 128 384 429 692 385Z' : 'M95 65 384 429 692 385Z'} fill={`url(#${id}-beam)`} opacity=".17" /><path d={hero ? 'M761 128 427 401 741 462Z' : 'M883 66 427 401 741 462Z'} fill={`url(#${id}-beam)`} opacity=".19" />
  <Floodlight x={hero ? 247 : 100} y={hero ? 101 : 32} /><Floodlight x={hero ? 761 : 896} y={hero ? 101 : 32} flip />
  {hero && <g fill="#F4EEDB" opacity=".6"><path d="m453 80 4 14 14 4-14 4-4 14-4-14-14-4 14-4Z" /><circle cx="360" cy="117" r="2" /><circle cx="647" cy="60" r="2" /></g>}
</g>; }

function Street({ id }: { id: string }) { return <g><rect width="1000" height="600" fill="#DCC9A5" /><circle cx="769" cy="93" r="49" fill="#F4C644" /><path d="M0 100 187 45l58 255H0Z" fill="#C66C4B" /><path d="m0 126 187-57m-181 99 191-58M0 212l209-62m-198 104 207-64" stroke="#A5533D" strokeWidth="3" opacity=".6" /><path d="M821 112 1000 43v274H810Z" fill="#75866B" /><path d="m850 137 67-21v95l-67 8Zm96-32 44-15v104l-44 10Z" fill="#293F3E" /><path d="M239 184 350 142l104 41v131H239Z" fill="#BA9A6D" /><path d="m224 182 127-60 117 61" fill="none" stroke="#534C41" strokeWidth="11" /><path d="M524 213 690 169l86 36v109H524Z" fill="#C58C63" /><path d="M0 310h1000v290H0Z" fill="#BBAC87" /><path d="m0 487 1000-82m-864 195 361-289m426 289L636 311" stroke="#F0E1BA" strokeWidth="4" opacity=".65" /><path d="M51 302v116m0-116 171-10 5 115m-176 11 176-11" stroke="#EDE2BD" strokeWidth="7" fill="none" /><path d="M47 300h179v113H47Z" fill={`url(#${id}-net)`} opacity=".35" /><path d="M0 85q401 95 1000-51" stroke="#6B6552" strokeWidth="3" fill="none" />{[0, 1, 2, 3, 4, 5].map(n => <path key={n} d={`m${290 + n * 80} ${108 - n * 4} 25-2-9 35Z`} fill={n % 2 ? '#16764D' : '#E05F3A'} />)}<g opacity=".4" stroke="#5C624C" strokeWidth="5"><path d="m754 289 1-89m-1 40-24-19m25-3 27-21" /><path d="m229 293 1-74m0 30-22-19" /></g><path d="m871 325 49 0-8-19h-31Z" fill="#5E7354" /><path d="m896 307 4-61m-4 39-21-26m22 10 23-24" stroke="#4A6848" strokeWidth="5" /><text x="544" y="275" fill="#F2DFC0" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="900" letterSpacing="3">LAPANGAN MIMPI</text></g>; }

function Indoor({ environment, id }: { environment: Environment; id: string }) {
  const office = environment === 'office'; const medical = environment === 'medical';
  return <g><rect width="1000" height="600" fill="#DDDAC4" /><rect x="0" y="0" width="1000" height="350" fill="#ECE5CE" /><path d="M0 350h1000v250H0Z" fill="#ACA990" /><path d="m0 530 1000-80m-790 150 300-250m406 250L642 350" stroke="#C8C3A7" strokeWidth="3" />
    <rect x="65" y="61" width="310" height="225" rx="3" fill="#2D5952" stroke="#1D3C3B" strokeWidth="9" /><path d="M73 195q137-73 293-2v85H73Z" fill="#5C8C6D" /><path d="M73 232q137-38 293-8v54H73Z" fill="#7EA476" /><path d="M219 64v222M68 177h305" stroke="#F4EEDB" strokeWidth="9" />
    {office ? <g><path d="m686 58 178 0v205H686Z" fill="#D8B45C" stroke="#354A41" strokeWidth="8" /><path d="m702 74 146 0v172H702Z" fill="#E9DDAC" /><path d="m744 98 29 23 29-23-8 65h-43Z" fill="#C59238" /><path d="M774 160v29m-20 6h42" stroke="#C59238" strokeWidth="8" /><text x="775" y="223" textAnchor="middle" fontSize="12" fontFamily="Arial,sans-serif" fontWeight="900" fill="#4A5744">KEPERCAYAAN</text></g>
      : medical ? <g><rect x="714" y="69" width="141" height="150" fill="#F7F0DB" stroke="#728A74" strokeWidth="5" /><path d="M785 95v94m-46-47h92" stroke="#B8543C" strokeWidth="23" /><path d="M694 272h188v103H694Z" fill="#91AA95" stroke="#354A41" strokeWidth="4" /><path d="M711 296h150m-150 31h150" stroke="#496B59" strokeWidth="3" /></g>
        : <g>{[0, 1, 2, 3].map(n => <g key={n}><rect x={590 + n * 84} y="67" width="76" height="275" rx="3" fill={n % 2 ? '#66836D' : '#6D8D74'} stroke="#3F5D4D" strokeWidth="3" /><path d={`m${608 + n * 84} 89h40m-40 10h40m-40 10h40`} stroke="#345B46" strokeWidth="3" /><rect x={647 + n * 84} y="187" width="5" height="24" rx="2" fill="#E8D9B6" /></g>)}<path d="M563 392h397v19H563Z" fill="#B27B4E" stroke="#3F493C" strokeWidth="4" /><path d="M591 413v83m332-83v83" stroke="#3F493C" strokeWidth="11" /></g>}
    <path d="M0 347h1000" stroke="#586C56" strokeWidth="9" /><rect width="1000" height="600" fill={`url(#${id}-grain)`} opacity=".25" />
  </g>;
}

function Table() { return <g><path d="m238 385 414-25 98 81-458 29Z" fill="#B37A48" stroke="#273C36" strokeWidth="5" /><path d="m292 470 458-29v17l-458 30Z" fill="#845330" stroke="#273C36" strokeWidth="4" /><path d="M322 486v83m388-109v84" stroke="#273C36" strokeWidth="13" /><path d="m417 391 133-6 56 39-144 11Z" fill="#F7F0D9" stroke="#514E3C" strokeWidth="2" /><path d="m451 401 85-5m-78 12 85-5m-73 13 54-3" stroke="#898571" strokeWidth="2" /><path d="m554 411 21-13" stroke="#1F4C48" strokeWidth="4" /><path d="m591 372 23 0-3 37-17 1Z" fill="#E0C7A2" stroke="#273C36" strokeWidth="2" /><path d="m615 378c20-4 19 21-2 19" fill="none" stroke="#273C36" strokeWidth="3" /></g>; }

const POSES: Record<Action, Pose> = { dribble: 'run', shoot: 'kick', pass: 'kick', tackle: 'kick', training: 'run', contract: 'stand', injury: 'hurt', trophy: 'celebrate', bench: 'sit', farewell: 'stand' };
const SCENE_LABELS: Record<Action, string> = { dribble: 'SETIAP LANGKAH, SEBUAH PELUANG.', shoot: 'PERCAYA PADA KAKIMU.', pass: 'TAK ADA MIMPI YANG SENDIRIAN.', tackle: 'BERANI MEREBUT KESEMPATAN.', training: 'ULANGI. PERBAIKI. PERCAYA.', contract: 'BABAK BARU DIMULAI.', injury: 'JEDA BUKAN AKHIR CERITA.', trophy: 'UNTUK SEMUA YANG PERCAYA.', bench: 'KESABARAN JUGA SEBUAH LATIHAN.', farewell: 'PERMAINAN USAI. CERITA ABADI.' };

export function Scene({ appearance = DEFAULT_APPEARANCE, age = 22, colors = ['#16764D', '#F4C644'], action = 'dribble', variant = 'success', environment = 'stadium', playing = true, speed = 1, hero = false, caption, reducedMotion = false }: SceneProps) {
  const id = `scene-${useId().replace(/:/g, '')}`;
  const indoor = ['office', 'medical', 'locker'].includes(environment) || ['contract', 'bench'].includes(action);
  const actualEnv: Environment = action === 'contract' ? 'office' : action === 'bench' ? 'locker' : environment;
  const choreography = playAnimation(action, { result: { variant }, speed, reducedMotion });
  const semantic = choreography.variant;
  const fail = choreography.outcome === 'failure';
  const interception = semantic === 'interception';
  const recovering = action === 'injury' && semantic === 'recover';
  const isInjury = action === 'injury';
  const figureX = action === 'contract' ? 320 : action === 'bench' ? 445 : action === 'trophy' ? 410 : hero ? 370 : 388;
  const figureY = action === 'bench' ? 135 : action === 'contract' ? 160 : hero ? 112 : 130;
  return <div className={`scene scene--${action} variant-${semantic} ${hero ? 'scene--hero' : ''} ${playing ? 'is-playing' : 'is-paused'} ${reducedMotion ? 'reduce-motion' : ''} ${fail ? 'is-failure' : 'is-success'} environment-${actualEnv}`} data-action={action} data-variant={semantic} style={{ '--scene-duration': `${choreography.durationMs / 1000 || 3}s`, '--kit': colors[0], '--trim': colors[1] } as CSSProperties}>
    <svg className="scene-art" viewBox="0 0 1000 600" role="img" aria-label={caption || SCENE_LABELS[action]} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#102A31" /><stop offset=".64" stopColor="#36554D" /><stop offset="1" stopColor="#6B8158" /></linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FAF0BC" /><stop offset="1" stopColor="#FAF0BC" stopOpacity="0" /></linearGradient>
        <pattern id={`${id}-grain`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#17202A" /></pattern>
        <pattern id={`${id}-net`} width="18" height="18" patternUnits="userSpaceOnUse"><path d="M0 0h18v18" stroke="#EBDDB8" strokeWidth="2" fill="none" /></pattern>
        <pattern id={`${id}-halftone`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.7" fill="#0D2A27" /></pattern>
        <radialGradient id={`${id}-vignette`}><stop offset=".35" stopColor="#102A28" stopOpacity="0" /><stop offset="1" stopColor="#102A28" stopOpacity=".3" /></radialGradient>
      </defs>
      {indoor ? <Indoor environment={actualEnv} id={id} /> : actualEnv === 'street' ? <Street id={id} /> : <Stadium id={id} hero={hero} />}
      {action === 'shoot' && actualEnv === 'street' && <g className="goal-net"><path d="m797 291 152-9 17 134-160 30Z" fill={`url(#${id}-net)`} fillOpacity=".3" stroke="#F2E8C8" strokeWidth="6" /><path d="m797 291 28 20 145-11m-164 146 30-26 134-20M825 311l11 109" fill="none" stroke="#E4DBC0" strokeWidth="2" /></g>}
      {!indoor && <g className="pitch-details"><path d="m28 566 48-5m-3 12 39-4m698-83 27-4m-6 13 34-5M256 440l21-3" stroke="#C3D497" strokeWidth="3" opacity=".5" /><path d="m37 353 962-2" stroke="#112A29" strokeWidth="2" opacity=".3" /></g>}
      {action === 'training' && <g className="training-props">{[0, 1, 2, 3].map(n => <g key={n} transform={`translate(${230 + n * 165} ${467 - n * 8})`}><ellipse cx="0" cy="29" rx="25" ry="6" fill="#163E2E" opacity=".28" /><path d="m-18 21 14-45h9l15 45 9 6h-55Z" fill="#FF6536" stroke="#522F24" strokeWidth="2.5" /><path d="m-10-2 20 0m-25 14 30 0" stroke="#F4EEDB" strokeWidth="6" /></g>)}<g transform="translate(785 330)"><path d="M0 0v102" stroke="#D8D4AC" strokeWidth="5" /><path d="M0 0h54L31 22 0 22" fill="#F4C644" /></g></g>}
      {!indoor && ['dribble', 'shoot', 'pass', 'tackle'].includes(action) && <g transform={interception ? 'translate(625 187) scale(.78)' : action === 'tackle' ? 'translate(572 198) scale(.79)' : 'translate(187 213) scale(.67)'}><g className="opponent"><Figure id={`${id}-rival`} appearance={{ skin: '#D4A174', hair: 'crop', preset: 'spark' }} colors={['#D9603A', '#F3D59A']} age={age} pose={action === 'tackle' || interception ? 'run' : 'stand'} number={7} /></g></g>}
      {action === 'shoot' && !indoor && <g transform="translate(790 285) scale(.42)"><g className="goalkeeper"><Figure id={`${id}-goalkeeper`} appearance={{ skin: '#C5956B', hair: 'crop', preset: 'spark' }} colors={['#C5B97B', '#F7E4A5']} age={28} pose="stand" className="goalkeeper-figure" number={1} goalkeeper /></g></g>}
      {action === 'pass' && <g className="teammate" transform="translate(718 250) scale(.61)"><Figure id={`${id}-mate`} appearance={{ skin: '#7A523F', hair: 'crop', preset: 'calm' }} colors={colors} age={age} pose="run" number={8} /></g>}
      {action === 'contract' && <g transform="translate(593 160) scale(.87)"><Figure id={`${id}-manager`} appearance={{ skin: '#CF9D72', hair: 'sweep', preset: 'calm' }} colors={['#3B4D4B', '#D1B768']} pose="stand" age={49} coach className="contract-manager" number="" /></g>}
      {isInjury && <g className="caregiver" transform="translate(588 172) scale(.9)"><Figure id={`${id}-medic`} appearance={{ skin: '#D1A77A', hair: 'crop', preset: 'calm' }} colors={['#DDE5D5', '#47745A']} pose={recovering ? 'stand' : 'hurt'} age={32} coach number="" /><path d="m100 158h35m-17-17v35" stroke="#A64E3D" strokeWidth="9" /></g>}
      {semantic === 'foul' && <g transform="translate(215 218) scale(.64)"><Figure id={`${id}-referee`} appearance={{ skin: '#AD805C', hair: 'crop', preset: 'calm' }} colors={['#E8BD50', '#263630']} age={35} pose="stand" className="referee" number="" /><rect className="foul-card" x="143" y="4" width="27" height="38" rx="2" fill="#FF6536" stroke="#263630" strokeWidth="3" /><path d="m117 122 0 29 11 7" fill="none" stroke="#263630" strokeWidth="2" /></g>}
      {action === 'farewell' && <g opacity=".8"><path d="M75 386v90m0-90h82l-30 23 30 23H75" stroke="#F4EEDB" strokeWidth="4" fill="#D86D42" /><g fill="#D5C8A3">{[0, 1, 2, 3, 4].map(n => <g key={n} transform={`translate(${720 + n * 45} 363)`}><circle r="9" /><path d="m-13 13 26 0 6 42h-38Z" /><path d="m-13 20-12-17m36 16 17-22" stroke="#D5C8A3" strokeWidth="8" strokeLinecap="round" /></g>)}</g></g>}
      <g className="primary-placement" transform={`translate(${figureX} ${figureY}) ${hero ? 'scale(1.1)' : ''}`}><g className="primary-athlete"><Figure id={`${id}-player`} appearance={appearance} colors={colors} age={age} pose={recovering ? 'stand' : POSES[action]} number={10} className="main-figure" bandaged={isInjury} /></g></g>
      {action === 'contract' && <g className="contract-props"><g className="contract-handshake"><path d="m572 309 11-5 15 7-5 11-13-2-12-5Z" fill={appearance.skin} stroke="#25362F" strokeWidth="2.6" /><path d="m579 311 12 8m-6-11 11 7" stroke="#78553E" strokeWidth="1.5" /></g><Table /><g transform="translate(747 281) rotate(-9)"><path d="m-16 0 22-12h34L61 0l-11 28-18-6v61h-49V22l-16 6-12-28Z" fill={colors[0]} stroke="#233A32" strokeWidth="3" /><path d="m8-10 15 15 15-15" fill="none" stroke={colors[1]} strokeWidth="5" /><text x="9" y="56" fill={colors[1]} fontSize="31" fontFamily="Arial,sans-serif" fontWeight="900">10</text></g><path className="signature" d="m494 420 9-14-2 13 14-10-4 12 13-6 14 0" fill="none" stroke="#234D42" strokeWidth="2" /></g>}
      {action === 'bench' && <g><path d="m378 385 230 0v19H378Z" fill="#B27B4E" stroke="#3F493C" strokeWidth="4" /><path d="M402 404v93m182-93v93" stroke="#3F493C" strokeWidth="10" /><path d="m690 426 21-2 8 65-27 2Z" fill="#C4D2B5" stroke="#345443" strokeWidth="3" /><path d="m691 429 19-2v-10h-19Z" fill="#385D49" /><path d="m229 439 77-3 12 25-89 9Z" fill={colors[0]} stroke="#263A31" strokeWidth="3" /></g>}
      {!['contract', 'trophy', 'bench'].includes(action) && <g className="ball-journey"><ellipse className="ball-shadow" cx={hero ? 650 : 638} cy={hero ? 502 : 489} rx="32" ry="8" fill="#12392C" opacity=".3" /><g className="ball-moving"><Ball x={hero ? 650 : 638} y={hero ? 469 : 464} r={hero ? 29 : 25} /></g></g>}
      {['shoot', 'pass'].includes(action) && <g className="kick-trails" fill="none" stroke="#F4E8B9" strokeLinecap="round"><path d="m661 448 49-12m-43 23 35-3m-45-27 24-11" strokeWidth="5" /><path d="m677 420 21-14" strokeWidth="2" /></g>}
      {semantic === 'goal' && <g className="goal-flash" transform={`translate(${hero ? 727 : 863} 265) rotate(-7)`}><path d="m-47-24 89 0 12 25-12 24h-89L-59 0Z" fill="#F4C644" stroke="#172B29" strokeWidth="3" /><text y="8" textAnchor="middle" fill="#172B29" fontFamily="Arial,sans-serif" fontSize="28" fontWeight="900" fontStyle="italic">GOL!</text></g>}
      {semantic === 'post' && <g className="post-impact" stroke="#F4C644" strokeWidth="5" strokeLinecap="round"><path d="m946 352-20-11m26 25-20 7m29-37-3-18" /></g>}
      {action === 'tackle' && <g className="impact-lines" stroke="#F4C644" strokeWidth="5" strokeLinecap="round"><path d="m640 445 11-25m5 35 22-14m-44-9-5-22" /><path d="m615 470-29-3m60 15 25 11" /></g>}
      {isInjury && !recovering && <g className="injury-signals" fill="none" stroke="#FF6536" strokeWidth="5" strokeLinecap="round"><path d="m547 392 11-18m-2 29 24-2m-38-17-3-19" /><path d="m479 458-13 14m25-6-4 20" /></g>}
      {action === 'training' && <g className={`training-feedback ${semantic === 'struggle' ? 'training-feedback--struggle' : ''}`} fill="none" stroke={semantic === 'struggle' ? '#EACCA2' : '#F4C644'} strokeWidth="4" strokeLinecap="round">{semantic === 'struggle' ? <path d="m556 208 13-8m-10 23 18 0m-21 13 12 10" /> : <g><path d="m590 218 0-30m-12 12 12-12 12 12" /><path d="m620 246 0-21m-9 10 9-10 9 10" /></g>}</g>}
      {action === 'trophy' && <g className="trophy-lift"><g transform="translate(541 159)"><path d="m-30-33 60 0-8 50-21 15-22-15Z" fill="#F4C644" stroke="#443B25" strokeWidth="3.5" /><path d="M-29-23h-21c-4 29 11 38 29 28m50-28h21c4 29-11 38-29 28" fill="none" stroke="#F4C644" strokeWidth="9" /><path d="M-29-23h-21c-4 29 11 38 29 28m50-28h21c4 29-11 38-29 28" fill="none" stroke="#443B25" strokeWidth="2" /><path d="M0 28v29m-23 0h46v12h-46Z" fill="#D1A13D" stroke="#443B25" strokeWidth="4" /><path d="M-15-22 0-19 15-22l-3 26L0 13-12 4Z" fill="#FFE49B" opacity=".65" /><path d="m0-18 4 9 10 1-8 7 2 10-8-5-9 5 2-10-7-7 10-1Z" fill="#EAB03B" /></g></g>}
      {action === 'trophy' && <g className="confetti">{Array.from({ length: 37 }, (_, n) => <path key={n} className={`confetti-bit bit-${n % 5}`} style={{ '--delay': `${-(n % 9) * .31}s` } as CSSProperties} d={`m${90 + n * 23} ${41 + (n * 47) % 263} 9-5 4 12-9 5Z`} fill={['#F4C644', '#F4EEDB', '#FF6536', '#8DB68A'][n % 4]} />)}</g>}
      {hero && <g className="hero-comic-details"><path d="M310 336c-55 11-79 38-84 73m76-52c-35 9-51 24-56 43" stroke="#E4D8AE" strokeWidth="3" fill="none" opacity=".65" /><path d="m702 198 17-32m-2 39 28-12m-47-1 4-25" stroke="#F4C644" strokeWidth="4" strokeLinecap="round" /></g>}
      <path d="M0 0h1000v600H0Z" fill={`url(#${id}-vignette)`} pointerEvents="none" />
      <path d="M0 0h1000v600H0Z" fill={`url(#${id}-grain)`} opacity=".16" pointerEvents="none" />
      <path d="M0 581 1000 575v25H0Z" fill="#152F2D" opacity=".15" />
      <path d="M1 1h998v598H1Z" stroke="#17202A" strokeWidth="2" fill="none" opacity=".15" />
    </svg>
  </div>;
}

export default Scene;
