import type {Action,Environment} from '../types/game';
export interface Vec3{x:number;y:number;z:number}
export type ShotType='driven'|'curled'|'lofted'|'close'|'penalty'|'header';
export type Intensity='routine'|'important'|'dramatic';
export type Celebration='arms'|'knee-slide'|'jump';
export type Phase='setup'|'anticipation'|'contact'|'flight'|'outcome'|'reaction'|'complete';
export type ActorPose='idle'|'run'|'plant'|'backswing'|'kick'|'follow'|'receive'|'tackle'|'fall'|'dive'|'land'|'celebrate'|'kneel'|'jump'|'sit'|'sign'|'handshake'|'reveal'|'wave'|'look-back'|'examine'|'hurt';
export type Emotion='calm'|'focused'|'nervous'|'tired'|'happy'|'frustrated'|'sad'|'hurt'|'proud';
export interface ActorFrame {id:string;role:'player'|'opponent'|'keeper'|'teammate'|'medic'|'official';x:number;y:number;scale:number;facing:1|-1;pose:ActorPose;cycle:number;lean:number;rotation:number;emotion:Emotion;foot?:Vec3;hands?:Vec3[];head?:Vec3;opacity?:number;}
export interface BallFrame extends Vec3{vx:number;vy:number;vz:number;rotation:number;scale:number;owner:string|null;motion:'owned'|'rolling'|'flight'|'caught'|'rebound'|'net'|'stopped';target:Vec3|null;trail:Vec3[];visible:boolean;}
export interface CameraFrame{x:number;y:number;zoom:number;shakeX:number;shakeY:number}
export interface GoalGeometry{x1:number;x2:number;y:number;height:number;depthX:number;depthY:number}
export interface ImpactFrame{kind:'kick'|'glove'|'post'|'block'|'grass'|'net'|'flash'|'whistle';point:Vec3;strength:number;}
export interface AnimationSpec{action:Action;variant:string;environment:Environment;shotType?:ShotType;intensity?:Intensity;celebration?:Celebration;foot?:'left'|'right';seed?:number;}
export interface TimelineFrame {timeMs:number;durationMs:number;progress:number;phase:Phase;actors:ActorFrame[];ball:BallFrame|null;camera:CameraFrame;goal:GoalGeometry;netImpact:{point:Vec3;amount:number}|null;impacts:ImpactFrame[];title:string;subtitle:string;score:string|null;}
export interface TimelineDefinition{spec:AnimationSpec;durationMs:number;contactMs:number;outcomeMs:number;reactionMs:number;}
export interface TimelineCue{atMs:number;kind:'kick'|'save'|'post'|'goal'|'whistle'|'sign'|'crowd'|'step'|'chapter';}
