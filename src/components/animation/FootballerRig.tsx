import type { Appearance } from '../../game/types/game';
import type { ActorFrame, AnimationSpec, Vec3 } from '../../game/animation/types';

type Point = { x: number; y: number };
const p = (x: number, y: number): Point => ({ x, y });
const rad = (degrees: number) => degrees * Math.PI / 180;

/** A two bone joint solver. Targets and bones share the same local space. */
export function solveJoint(root: Point, target: Point, upper: number, lower: number, bend = 1): Point {
  const dx = target.x - root.x, dy = target.y - root.y;
  const distance = Math.max(.01, Math.hypot(dx, dy));
  // A small stretch preserves literal foot/glove contact on exaggerated impact frames.
  const stretch = Math.max(1, distance / (upper + lower - .01));
  const a = upper * stretch, b = lower * stretch;
  const along = (a * a - b * b + distance * distance) / (2 * distance);
  const height = Math.sqrt(Math.max(0, a * a - along * along));
  return p(root.x + dx / distance * along + dy / distance * height * bend, root.y + dy / distance * along - dx / distance * height * bend);
}

interface RigProps {
  actor: ActorFrame; appearance: Appearance; colors: [string, string]; age: number;
  id: string; number?: string | number; foot?: AnimationSpec['foot']; crest?: string; jersey?: boolean;
}

function limb(a: Point, b: Point, c: Point) { return `M${a.x} ${a.y}Q${b.x} ${b.y} ${b.x} ${b.y}L${c.x} ${c.y}`; }
function towards(a: Point, b: Point, amount: number) { return p(a.x + (b.x - a.x) * amount, a.y + (b.y - a.y) * amount); }

export function FootballerRig({ actor, appearance, colors, age, id, number = 10, foot = 'right', crest, jersey = false }: RigProps) {
  const { pose, cycle, emotion, facing, rotation, scale } = actor;
  const skin = appearance.skin || '#B97750';
  const keeper = actor.role === 'keeper', official = actor.role === 'official', medic = actor.role === 'medic';
  const kit = medic ? '#E7E8CF' : official ? '#303A42' : colors[0];
  const trim = medic ? '#B65B43' : colors[1];
  const tired = emotion === 'tired' || emotion === 'hurt';
  const happy = ['happy', 'proud'].includes(emotion), sad = ['frustrated', 'sad', 'hurt', 'nervous'].includes(emotion);
  const running = ['run', 'receive'].includes(pose);
  // Choreography supplies a phase in radians, shared by opposite arms and legs.
  const phase = cycle, stride = Math.sin(phase), bounce = running ? -Math.abs(Math.cos(phase)) * 4 : 0;
  const crouch = ['plant', 'backswing', 'dive', 'land', 'kneel', 'sit', 'hurt'].includes(pose);
  const lift = pose === 'jump' ? -Math.max(0, Math.sin(phase)) * 5 : 0;
  const lean = Math.max(-.7, Math.min(.7, actor.lean / 45));
  const hip = p(lean * 15, -80 + bounce + lift + (crouch ? 12 : 0));
  const shoulder = p(hip.x + lean * 18 + (tired ? 6 : 0), hip.y - 50 + (tired ? 5 : 0));
  let head = p(shoulder.x + lean * 4, shoulder.y - 29 + (tired ? 3 : 0));
  let nearFoot = p(17, 0), farFoot = p(-15, 0);
  if (running) {
    nearFoot = p(7 + stride * 35, -Math.max(0, Math.cos(phase)) * 22);
    farFoot = p(-5 - stride * 35, -Math.max(0, -Math.cos(phase)) * 22);
  }
  if (pose === 'backswing') nearFoot = p(-48, -28);
  if (pose === 'kick') nearFoot = p(55, -31);
  if (pose === 'follow') nearFoot = p(44, -31);
  if (pose === 'tackle') { nearFoot = p(72, -8); farFoot = p(-39, -12); }
  if (pose === 'fall' || pose === 'land') { nearFoot = p(47, -20); farFoot = p(-32, -22); }
  if (pose === 'kneel') { nearFoot = p(30, -7); farFoot = p(-24, -7); hip.y = -43; }
  if (pose === 'sit') { nearFoot = p(41, -2); farFoot = p(-11, 0); hip.y = -62; }
  if (pose === 'hurt') { nearFoot = p(38, -12); farFoot = p(-12, 0); }
  if (pose === 'jump') { nearFoot = p(27, -10); farFoot = p(-25, -17); }
  if (pose === 'dive') { nearFoot = p(32, -7); farFoot = p(-21, -20); }
  if (foot === 'left' && ['plant','backswing','kick','follow'].includes(pose)) { farFoot = nearFoot; nearFoot = p(17,0); }
  const worldToLocal = (world: Vec3): Point => {
    const x = (world.x - actor.x) / scale, y = (world.y - world.z - actor.y) / scale;
    const theta = -rad(rotation);
    return p((x * Math.cos(theta) - y * Math.sin(theta)) * facing, x * Math.sin(theta) + y * Math.cos(theta));
  };
  const headAngle = actor.head ? -3 : pose === 'look-back' ? -18 : tired ? 10 : happy ? -5 : -3;
  if (actor.head) {
    const target = worldToLocal(actor.head);
    // A header contacts the forehead rather than the centre of the face.
    const a = rad(headAngle), forehead = p(9 * Math.cos(a) + 14 * Math.sin(a), 9 * Math.sin(a) - 14 * Math.cos(a));
    head = p(target.x - forehead.x, target.y - forehead.y);
  }
  const bootAngle = pose === 'kick' || pose === 'follow' ? -19 : 0;
  const bootRadians = rad(bootAngle);
  // A model foot is the toe, not the ankle: solve backwards through the boot's
  // own rotation before the leg IK. This keeps impact physically coincident.
  const toeOffset = p(26 * Math.cos(bootRadians) - 5 * Math.sin(bootRadians), 26 * Math.sin(bootRadians) + 5 * Math.cos(bootRadians));
  if (actor.foot) {
    const target = worldToLocal(actor.foot);
    const ankle = p(target.x - toeOffset.x, target.y - toeOffset.y);
    if (foot === 'left') farFoot = ankle; else nearFoot = ankle;
  }
  let farHand = p(shoulder.x - 29 + (running ? stride * 25 : 0), shoulder.y + 47 - (running ? Math.abs(stride) * 17 : 0));
  let nearHand = p(shoulder.x + 30 - (running ? stride * 25 : 0), shoulder.y + 47 - (running ? Math.abs(stride) * 16 : 0));
  if (['backswing', 'plant', 'kick', 'follow'].includes(pose)) { farHand = p(shoulder.x - 53, shoulder.y + 4); nearHand = p(shoulder.x + 43, shoulder.y + 17); }
  if (['celebrate', 'jump'].includes(pose)) { farHand = p(shoulder.x - 48, shoulder.y - 42); nearHand = p(shoulder.x + 48, shoulder.y - 45); }
  if (pose === 'kneel') { farHand = p(shoulder.x - 55, shoulder.y - 6); nearHand = p(shoulder.x + 55, shoulder.y - 6); }
  if (pose === 'wave') { nearHand = p(shoulder.x + 37 + Math.sin(phase) * 7, shoulder.y - 50); }
  if (pose === 'look-back') { nearHand = p(shoulder.x + 32, shoulder.y + 17); }
  if (pose === 'sign') nearHand = p(shoulder.x + 51, shoulder.y + 37 + Math.sin(phase * 3) * 2);
  if (pose === 'handshake') nearHand = p(shoulder.x + 54, shoulder.y + 34);
  if (pose === 'reveal') { farHand = p(shoulder.x - 43, shoulder.y + 3); nearHand = p(shoulder.x + 43, shoulder.y + 3); }
  if (pose === 'examine') { nearHand = p(shoulder.x + 41, shoulder.y + 57); farHand = p(shoulder.x + 8, shoulder.y + 55); }
  if (emotion === 'frustrated') { nearHand = p(head.x + 25, head.y - 8); farHand = p(head.x - 30, head.y - 4); }
  if (emotion === 'sad') { nearHand.y += 5; farHand.y += 5; }
  if (pose === 'dive') { nearHand = p(shoulder.x + 47, shoulder.y - 27); farHand = p(shoulder.x + 26, shoulder.y - 40); }
  if (actor.hands?.[0]) nearHand = worldToLocal(actor.hands[0]);
  if (actor.hands?.[1]) farHand = worldToLocal(actor.hands[1]);
  const nearHip = p(hip.x + 12, hip.y), farHip = p(hip.x - 12, hip.y + 1);
  const nearKnee = solveJoint(nearHip, nearFoot, 45, 49, -1), farKnee = solveJoint(farHip, farFoot, 45, 49, -1);
  const nearShoulder = p(shoulder.x + 22, shoulder.y + 2), farShoulder = p(shoulder.x - 22, shoulder.y + 2);
  const nearElbow = solveJoint(nearShoulder, nearHand, 30, 31, 1), farElbow = solveJoint(farShoulder, farHand, 30, 31, -1);
  const hair = age > 36 ? '#424742' : '#202B31';
  const stroke = '#172E32';
  const leg = (root: Point, knee: Point, target: Point, far: boolean) => {
    const active = far ? foot==='left' : foot!=='left';
    const angle = active ? bootAngle : 0;
    const a = rad(angle), toe = p(26*Math.cos(a)-5*Math.sin(a),26*Math.sin(a)+5*Math.cos(a));
    return <g opacity={far ? .9 : 1}>
    <path d={limb(root, knee, target)} fill="none" stroke={stroke} strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" />
    <path d={limb(root, knee, target)} fill="none" stroke={skin} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M${root.x} ${root.y}L${towards(root, knee, .55).x} ${towards(root, knee, .55).y}`} stroke="#213B3B" strokeWidth="22" strokeLinecap="round" />
    <path d={`M${towards(knee, target, .33).x} ${towards(knee, target, .33).y}L${target.x} ${target.y - 6}`} stroke={kit} strokeWidth="17" strokeLinecap="round" />
    <path d={`M${towards(knee, target, .4).x - 6} ${towards(knee, target, .4).y}l12 1`} stroke={trim} strokeWidth="4" />
    <g className="rig-boot" data-contact={actor.foot && active?'toe':undefined} data-toe-x={target.x+toe.x} data-toe-y={target.y+toe.y} transform={`translate(${target.x} ${target.y}) rotate(${angle})`}><path d="M-10-9 7-10 11-4 24 1Q26 2 26 5L22 9-12 8Q-16 4-10-9Z" fill="#1D2B35" stroke={stroke} strokeWidth="2" /><path d="m-10 6 34 0" stroke="#EEE7CF" strokeWidth="3" /><path d="m3-4 8 3m-4-6 8 3" stroke={trim} strokeWidth="2" /></g>
  </g>;
  };
  const arm = (root: Point, elbow: Point, hand: Point, far: boolean) => <g opacity={far ? .9 : 1}>
    <path d={limb(root, elbow, hand)} fill="none" stroke={stroke} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    <path d={limb(root, elbow, hand)} fill="none" stroke={skin} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M${root.x} ${root.y}L${towards(root, elbow, .5).x} ${towards(root, elbow, .5).y}`} stroke={kit} strokeWidth="20" strokeLinecap="round" />
    <path d={`M${towards(root, elbow, .49).x - 5} ${towards(root, elbow, .49).y}l10 1`} stroke={trim} strokeWidth="4" />
    <ellipse cx={hand.x} cy={hand.y} rx={keeper ? 10 : 6.5} ry={keeper ? 11 : 8} fill={keeper ? '#F1E6BD' : skin} stroke={stroke} strokeWidth="2" />
    {keeper && <path d={`m${hand.x - 6} ${hand.y + 1} 11-3m-8-4 3 11`} stroke="#71A69D" strokeWidth="3" />}
  </g>;
  return <g className={`rig rig--${pose} rig--${actor.role}`} data-actor={actor.id} data-pose={pose} data-emotion={emotion} transform={`translate(${actor.x} ${actor.y}) rotate(${rotation}) scale(${scale * facing} ${scale})`} opacity={actor.opacity ?? 1}>
    {leg(farHip, farKnee, farFoot, true)}{arm(farShoulder, farElbow, farHand, true)}
    <path d={`M${shoulder.x - 19} ${shoulder.y - 7}Q${shoulder.x} ${shoulder.y - 15} ${shoulder.x + 19} ${shoulder.y - 7}L${shoulder.x + 29} ${shoulder.y + 11}L${hip.x + 22} ${hip.y + 6}Q${hip.x} ${hip.y + 13} ${hip.x - 23} ${hip.y + 5}L${shoulder.x - 29} ${shoulder.y + 12}Z`} fill={`url(#${id}-shirt)`} stroke={stroke} strokeWidth="2.7" strokeLinejoin="round" />
    <path d={`M${shoulder.x - 13} ${shoulder.y - 8}q13 22 26 0`} fill={stroke} stroke={trim} strokeWidth="3.5" />
    <path d={`m${shoulder.x - 17} ${shoulder.y + 15} 3 23m31-23-4 22m-34 10q20 7 39 0`} fill="none" stroke="#F7EDCC" strokeWidth="1.5" opacity=".2" />
    <path d={`m${shoulder.x + 10} ${shoulder.y + 13} 6-3 6 3-1 9-5 4-5-4Z`} fill={trim} stroke={stroke} strokeWidth="1" />
    <text x={shoulder.x - 5} y={shoulder.y + 36} textAnchor="middle" fill={trim} fontSize="23" fontWeight="900" fontFamily="Arial,sans-serif" transform={`translate(${(shoulder.x - 5) * (1 - facing)} 0) scale(${facing} 1)`}>{official || medic ? (medic ? '+' : '') : number}</text>
    {leg(nearHip, nearKnee, nearFoot, false)}
    <path d={`M${head.x - 7} ${head.y + 15}v13q8 7 16-1v-13`} fill={skin} stroke={stroke} strokeWidth="2" />
    {arm(nearShoulder, nearElbow, nearHand, false)}
    <g className="rig-head" data-contact={actor.head?'forehead':undefined} transform={`translate(${head.x} ${head.y}) rotate(${headAngle})`}>
      <path d="M-18-1q-10-7-8 4 0 8 10 8m32-11q10-7 9 5-1 6-9 7" fill={skin} stroke={stroke} strokeWidth="2" />
      <path d="M-20-16Q0-31 20-16l-2 28Q10 28 0 29-13 26-19 13Z" fill={`url(#${id}-skin)`} stroke={stroke} strokeWidth="2.3" />
      <path d="M14-14 12 12Q6 24-2 27l3 2q14-3 17-18l2-26Z" fill="#734E3A" opacity=".23" />
      {appearance.hair === 'curls' ? <g fill={hair}><path d="M-21-1Q-30-33-3-34 25-37 23-7l-8 6-3-14-14 4-13-6-5 19Z" />{[-19,-10,0,11,19].map((x,n)=><circle key={x} cx={x} cy={-22 - Math.sin(n/4*Math.PI)*10} r="8" />)}</g> : appearance.hair === 'sweep' ? <path d="M-21 2Q-31-28-7-32 17-42 24-14l-5 16-6-20Q-3-5-14-16L-18 4Z" fill={hair} /> : <path d="M-22 2-24-13Q-24-32 0-32 25-30 23-12l-4 14-5-20h-30l-3 21Z" fill={hair} />}
      {age > 36 && <path d="m-21-16 5 6m31-9 5 5" stroke="#C4C4AA" strokeWidth="2" />}
      <path d={sad ? 'm-14-2 10-3m11 0 9 4' : happy ? 'm-14-4 10-2m11 0 10 1' : 'm-15-5 11 2m10 0 11-4'} stroke={hair} strokeWidth="2.5" strokeLinecap="round" />
      {tired ? <path d="m-13 5 9 1m11 0 9-1" stroke={stroke} strokeWidth="2" /> : <g><path d="m-13 3 9 0m11 0 9 0" stroke="#FFF1D6" strokeWidth="4" strokeLinecap="round" /><circle cx="-6" cy="3" r="2" fill={stroke} /><circle cx="13" cy="3" r="2" fill={stroke} /></g>}
      <path d="m2 4-3 10 5 1" stroke="#744E3B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={happy ? 'M-8 18q10 12 20-1Z' : sad ? 'M-7 23q10-6 18 0' : 'M-6 21q8 3 16-1'} fill={happy ? '#FFF0D0' : 'none'} stroke="#734332" strokeWidth="1.8" strokeLinecap="round" />
      {emotion === 'nervous' && <path d="M24-7q-5 7-1 9 5 0 1-9" fill="#A2D7D8" stroke={stroke} strokeWidth="1" />}
      {emotion === 'proud' && <path d="m-13 13 4 1m18 0 4-1" stroke="#B4674C" strokeWidth="2" />}
    </g>
    {pose === 'sign' && <path d={`m${nearHand.x - 1} ${nearHand.y + 5} 9 13`} stroke="#17373C" strokeWidth="3" strokeLinecap="round" />}
    {pose === 'reveal' && jersey && <g className="ceremony-jersey" transform={`translate(${(nearHand.x+farHand.x)/2} ${(nearHand.y+farHand.y)/2}) scale(${Math.max(.6,Math.abs(nearHand.x-farHand.x)/86)} 1)`}><path d="M-24-9-43 0-34 18-22 14-21 62h45l-1-48 13 4 10-18L25-9l-14 8h-21Z" fill={kit} stroke={stroke} strokeWidth="2.8" /><path d="M-11-8q12 17 23 0" stroke={trim} strokeWidth="4" fill="none" /><text x="1" y="43" fill={trim} textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26">{number}</text>{crest && <text x="16" y="16" textAnchor="middle" fontSize="8" fill={trim}>{crest.slice(0,2)}</text>}</g>}
    <defs><linearGradient id={`${id}-skin`}><stop stopColor={skin} /><stop offset="1" stopColor={skin} stopOpacity=".84" /></linearGradient><linearGradient id={`${id}-shirt`}><stop stopColor={kit} /><stop offset=".65" stopColor={kit} /><stop offset="1" stopColor="#172E32" stopOpacity=".8" /></linearGradient></defs>
  </g>;
}
