import type { Environment } from '../../game/types/game';
import type { TimelineFrame } from '../../game/animation/types';

const CREAM = '#EEE8CB';
export function Sky({ id, environment }: { id: string; environment: Environment }) {
  const street = environment === 'street';
  return <g><defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor={street ? '#DCA66E' : '#102F3D'} /><stop offset="1" stopColor={street ? '#F5D59A' : '#607D73'} /></linearGradient><radialGradient id={`${id}-light`}><stop stopColor="#FFF1B4" stopOpacity=".44" /><stop offset="1" stopColor="#FFF1B4" stopOpacity="0" /></radialGradient><linearGradient id={`${id}-pitch`} x2="0" y2="1"><stop stopColor="#37795D" /><stop offset="1" stopColor="#1F5944" /></linearGradient><pattern id={`${id}-grain`} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="#E4DBB5" opacity=".1" /><circle cx="5" cy="5" r=".4" fill="#142F2C" opacity=".12" /></pattern></defs><rect x="-500" y="-400" width="2000" height="1400" fill={`url(#${id}-sky)`} /><circle cx="795" cy="101" r="105" fill={`url(#${id}-light)`} /><circle cx="795" cy="101" r={street ? 43 : 19} fill="#F5D58D" opacity={street ? .85 : .14} /></g>;
}

function Light({ x, mirror = false, id }: { x: number; mirror?: boolean; id: string }) {
  return <g transform={`translate(${x} 50) scale(${mirror ? -1 : 1} 1)`}><path d="M0 0 34 275h12L13 0Z" fill="#1B3B40" /><path d="m8 40 15 20-8 16 16 18-8 14 15 21-9 15 14 17" fill="none" stroke="#7F9789" strokeWidth="2" /><path d="M-51-9 45-20l17 47-94 15Z" fill="#19313A" stroke="#B5C5A5" strokeWidth="3" />{Array.from({ length: 6 }, (_, n) => <path key={n} d={`M${-37 + n % 3 * 29 + Math.floor(n / 3) * 6} ${-2 + Math.floor(n / 3) * 19}l20-3 4 12-20 3Z`} fill="#FFF1BB" />)}<ellipse cy="14" rx="100" ry="68" fill={`url(#${id}-light)`} /></g>;
}

export function Grandstand({ id, frame, environment }: { id: string; frame: TimelineFrame; environment: Environment }) {
  const parade = frame.phase === 'reaction' || frame.phase === 'complete';
  const trophy = frame.title.includes('JUARA');
  if (environment === 'street') return <g>
    <path d="M-150 134 130 79l32 252H-150Z" fill="#B76549" stroke="#6F533E" strokeWidth="3" />
    {Array.from({ length: 7 }, (_, n) => <path key={n} d={`M-100 ${155 + n * 26}l239-48`} stroke="#DA986D" strokeWidth="2" opacity=".55" />)}
    <path d="M0 127 130 78l35 7M-20 117 132 66l47 12" fill="none" stroke="#4F5345" strokeWidth="8" />
    <path d="M172 249V156l122-47 114 48v143Z" fill="#C29A69" /><path d="m156 159 138-65 127 65" fill="none" stroke="#5B5E4B" strokeWidth="9" /><path d="M212 182h42v70h-42m68-84h68v45h-68" fill="#3C5A50" />
    <path d="M641 172 799 116l86 40v168H641Z" fill="#A17D5A" /><path d="m627 175 170-77 101 57" fill="none" stroke="#546251" strokeWidth="11" /><path d="M673 204h53v72h-53m87-84h54v39h-54" fill="#294D47" />
    <path d="M889 76 1100 22v311H878Z" fill="#6C8570" /><path d="m929 108 63-18v99l-63 11m87-117 64-19v109l-64 12" fill="#274B45" />
    <path d="M-100 97Q450 190 1100 50" fill="none" stroke="#4D6655" strokeWidth="3" />{Array.from({ length: 10 }, (_, n) => <path key={n} d={`m${220 + n * 66} ${132 - n * n * .9} 22-2-7 29Z`} fill={n % 2 ? '#D5643D' : '#21745A'} stroke="#5C624B" strokeWidth=".6" />)}
    <path d="M-100 319h1200v41H-100Z" fill="#B49B70" /><path d="m275 326 204-12 21 36H258Z" fill="#345F4E" /><text x="375" y="339" textAnchor="middle" fill="#F2DFAD" fontSize="13" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="2">LAPANGAN MIMPI · SURABAYA</text>
    {[34,596,949].map((x,n) => <g key={x} transform={`translate(${x} ${303 + n * 4})`}><path d="M0 0 2-89m-2 41-22-20m24 4 25-22" stroke="#516F4E" strokeWidth="6" fill="none" /><path d="M0-83q-58-31-47 12 18 22 44 15 29 20 48-7 12-33-29-35Z" fill="#5A7954" /></g>)}
  </g>;
  return <g><path d="M-200 198Q500 44 1200 198v157H-200Z" fill="#203F43" /><path d="M-200 196Q500 42 1200 196" fill="none" stroke="#A2AF96" strokeWidth="10" /><path d="M-200 208Q500 54 1200 208" fill="none" stroke="#172F39" strokeWidth="17" /><path d="M-200 240Q500 111 1200 240M-200 289Q500 174 1200 289" fill="none" stroke="#70847A" strokeWidth="3" />
    {Array.from({ length: 5 }, (_, row) => <g key={row}>{Array.from({ length: 57 }, (_, n) => {
      const x = -90 + n * 22 + row % 2 * 9, y = 213 + row * 26 - Math.sin((x + 90) / 1180 * Math.PI) * 50;
      const cheer = parade && Math.sin(frame.timeMs * .008 + n * .4) > -.15;
      const color = ['#BCBE97', '#5F7E72', '#D19C68', '#3B6159', '#E1CE9F'][(n * 7 + row * 3) % 5];
      return <g key={n} fill={color} opacity={.5 + row * .1} transform={`translate(${x} ${y})`}><circle r="3.7" /><path d="M-5 6q5-4 10 0l3 12h-16Z" />{(n + row) % 4 === 0 && <path d={cheer ? 'M-4 8-11-3M4 8 11-3' : 'M-4 8-9 12M4 8 9 12'} stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />}</g>;
    })}</g>)}
    <path d="M-200 338h1400v30H-200Z" fill="#E5C05F" /><path d="M-200 335h1400" stroke="#152F36" strokeWidth="5" />
    <g fill="#294D42" fontSize="14" fontWeight="900" letterSpacing="4" fontFamily="Arial,sans-serif"><text x="59" y="358">SATU HIDUP.</text><text x="380" y="358">SATU BOLA.</text><text x="698" y="358">SERIBU KEMUNGKINAN.</text></g>
    <Light x={85} id={id} /><Light x={927} mirror id={id} />
    {parade && [118,263,488,710,866].map((x,n) => {
      const a = Math.max(0, Math.sin(frame.timeMs * .015 + n * 6) - .84) * 6;
      return <g key={x} transform={`translate(${x} ${205 + n % 3 * 20})`} opacity={a * (trophy ? 1 : .7)}><path d="M-8 0h16M0-8V8" stroke="#FFF8CF" strokeWidth="2" /><circle r="4" fill="#FFF8CF" /></g>;
    })}
  </g>;
}

export function Pitch({ id, environment }: { id: string; environment: Environment }) {
  const street = environment === 'street';
  return <g><path d="M-1000 368h3000v1300H-1000Z" fill={street ? '#B49D74' : `url(#${id}-pitch)`} />
    {!street && Array.from({ length: 9 }, (_, n) => <path key={n} d={`M${-1500 + n * 360} 1000 500 368h96L${-1280 + n * 360} 1000Z`} fill="#69A16E" opacity=".14" />)}
    <path d="M-250 590 1050 401M585 800 739 369M-100 419l1210 176" stroke={street ? '#E8D8B0' : '#D5DAB6'} strokeWidth="3" opacity=".6" fill="none" />
    <path d="m746 442-49 97 359-48 25-70m-298 37-17 40 216-29 13-34" stroke={CREAM} strokeWidth="2.5" opacity=".57" fill="none" />
    <ellipse cx="674" cy="506" rx="77" ry="24" transform="rotate(-8 674 506)" fill="none" stroke={CREAM} strokeWidth="2.5" opacity=".3" />
    {Array.from({ length: 55 }, (_, n) => <path key={n} d={`m${(n * 179) % 1150 - 75} ${385 + (n * 97) % 280} 5-3m-2 4 5-2`} stroke={street ? '#8A7C5E' : '#87A775'} strokeWidth="1.1" opacity=".3" />)}
  </g>;
}

export function Room({ environment, clubName, colors }: { environment: Environment; clubName: string; colors: [string, string] }) {
  const medical = environment === 'medical';
  return <g><rect x="-600" y="-400" width="2200" height="1400" fill="#E4DDC6" /><path d="M-600 355h2200v800H-600Z" fill="#A8AD94" /><path d="M0 350h1000" stroke="#829380" strokeWidth="10" /><path d="m-200 580 1500-120m-915 330 126-435m507 435-167-435" fill="none" stroke="#D2CDB0" strokeWidth="3" />
    <rect x="52" y="62" width="310" height="242" fill="#416B61" stroke="#F5EBD1" strokeWidth="11" /><path d="M60 225q137-94 295-13v83H60Z" fill="#83A183" /><path d="M207 61v240M55 173h307" stroke="#ECE2C8" strokeWidth="8" />
    {environment === 'office' ? <g><path d="M620 33h340v294H620Z" fill={colors[0]} /><path d="M632 45h316v270H632Z" fill="none" stroke={colors[1]} strokeWidth="2" opacity=".5" /><path d="m752 71 38-19 38 19-6 58-32 24-32-24Z" fill={colors[1]} stroke="#183B3B" strokeWidth="4" /><path d="m775 89 15-7 15 7-3 22-12 9-12-9Z" fill={colors[0]} /><text x="790" y="187" textAnchor="middle" fontSize={clubName.length > 22 ? 16 : 21} fontFamily="Arial,sans-serif" fill={colors[1]} fontWeight="900">{clubName.toUpperCase()}</text><text x="790" y="215" textAnchor="middle" fontSize="10" fontFamily="Arial,sans-serif" fill={CREAM} letterSpacing="4">BABAK BARU. MIMPI YANG SAMA.</text><path d="m676 253h228" stroke={colors[1]} strokeWidth="2" opacity=".6" /></g> : medical ? <g><rect x="738" y="67" width="136" height="155" fill="#F3EAD2" stroke="#7E9B85" strokeWidth="5" /><path d="M806 98v92m-46-46h92" stroke="#B7614B" strokeWidth="24" /><path d="M664 292h270v95H664Z" fill="#8DA995" stroke="#4B6F60" strokeWidth="4" /><path d="M684 321h224m-224 27h224" stroke="#4B6F60" strokeWidth="2" /></g> : <g>{Array.from({ length: 5 }, (_, n) => <g key={n}><rect x={544+n*80} y="57" width="74" height="292" fill={n%2?'#658E76':'#5B806D'} stroke="#385F50" strokeWidth="3" /><path d={`m${559+n*80} 84h43m-43 9h43m-43 9h43`} stroke="#385F50" strokeWidth="3" /><path d={`M${600+n*80} 184v25`} stroke="#E9D9AE" strokeWidth="5" strokeLinecap="round" /></g>)}<path d="M538 397h430v19H538Z" fill="#AF8255" stroke="#3C574A" strokeWidth="4" /><path d="M561 417v86m383-86v86" stroke="#3C574A" strokeWidth="9" /></g>}
  </g>;
}

/** The same geometry as the trajectory model: y is the goal line, z is height. */
export function Goal({ frame, front = false }: { frame: TimelineFrame; front?: boolean }) {
  const g = frame.goal, y1 = g.y - g.height;
  if (front) return <g className="goal-posts"><path d={`M${g.x1} ${g.y}V${y1}H${g.x2}V${g.y}`} fill="none" stroke="#183C3F" strokeWidth="9" strokeLinejoin="round" /><path d={`M${g.x1} ${g.y}V${y1}H${g.x2}V${g.y}`} fill="none" stroke="#EEECD6" strokeWidth="6" strokeLinejoin="round" /><path d={`M${g.x1 + 1} ${g.y - 3}V${y1 + 2}H${g.x2 - 1}`} fill="none" stroke="white" strokeOpacity=".7" strokeWidth="1.5" /></g>;
  const impact = frame.netImpact;
  const ripple = (x: number, y: number) => {
    if (!impact) return { x, y };
    const sx = impact.point.x, sy = impact.point.y - impact.point.z;
    const distance = Math.hypot(x-sx,y-sy), amount = Math.max(0,1-distance/125) * impact.amount;
    return { x: x + amount * 13, y: y - amount * 9 };
  };
  const mesh = (vertical: boolean, n: number) => Array.from({ length: 14 }, (_, i) => {
    const x = vertical ? g.x1 + (g.x2-g.x1)*n/12 : g.x1 + (g.x2-g.x1)*i/13;
    const y = vertical ? y1 + g.height*i/13 : y1 + g.height*n/10;
    const q = ripple(x+g.depthX,y+g.depthY);
    return `${i?'L':'M'}${q.x} ${q.y}`;
  }).join(' ');
  return <g className="goal-net"><path d={`M${g.x1} ${g.y}l${g.depthX} ${g.depthY}H${g.x2+g.depthX}V${y1+g.depthY}l${-g.depthX} ${-g.depthY}H${g.x1}Z`} fill="#D9E6C5" fillOpacity=".06" stroke="#BDCEB6" strokeWidth="1.8" /><path d={`M${g.x1+g.depthX} ${g.y+g.depthY}V${y1+g.depthY}H${g.x2+g.depthX}V${g.y+g.depthY}`} fill="none" stroke="#9BB9A4" strokeWidth="2.4" />{Array.from({length:13},(_,n)=><path key={`v${n}`} d={mesh(true,n)} stroke="#C9D6B7" strokeWidth="1.1" opacity=".5" fill="none" />)}{Array.from({length:11},(_,n)=><path key={`h${n}`} d={mesh(false,n)} stroke="#C9D6B7" strokeWidth="1.1" opacity=".5" fill="none" />)}<path d={`M${g.x1} ${y1}l${g.depthX} ${g.depthY}m${-g.depthX} ${g.height-g.depthY} ${g.depthX} ${g.depthY}m${g.x2-g.x1-g.depthX} ${-g.height-g.depthY} ${g.depthX} ${g.depthY}m${-g.depthX} ${g.height-g.depthY} ${g.depthX} ${g.depthY}`} stroke="#C7D5B8" strokeWidth="2" fill="none" /></g>;
}
