export type Attribute = 'technique'|'pace'|'fitness'|'vision'|'discipline'|'mentality';
export type Attributes = Record<Attribute, number>;
export type Position = 'striker'|'winger'|'midfielder'|'defender';
export type Chapter = 'childhood'|'academy'|'professional'|'prime'|'retirement';
export type Action = 'dribble'|'shoot'|'pass'|'tackle'|'training'|'contract'|'injury'|'trophy'|'bench'|'farewell';
export type Environment = 'street'|'academy'|'stadium'|'training'|'office'|'medical'|'locker';
export interface Appearance { skin: string; hair: 'crop'|'curls'|'sweep'; preset: 'classic'|'spark'|'calm'; }
export interface PlayerConfig { name: string; position: Position; foot: 'right'|'left'; appearance: Appearance; }
export type Effects = Partial<Attributes> & { morale?:number; reputation?:number; trust?:number; injuryRisk?:number; money?:number; playingTime?:number; rival?:number; mentor?:number; family?:number };
export interface Condition { minOverall?:number; minReputation?:number; minTier?:number; maxTier?:number; flag?:string; notFlag?:string; injured?:boolean; }
export interface Choice { id:string; label:string; hint:string; effects:Effects; flags?:string[]; action?:Action; outcome:string; failure?:string; skill?:Attribute; difficulty?:number; successEffects?:Effects; failureEffects?:Effects; transfer?:'ambition'|'minutes'|'home'|'loyal'|'abroad'; injury?:'risk'|'recover'; coaching?:number; }
export interface StoryEvent { id:string; chapter:Chapter; minAge:number; maxAge:number; weight:number; title:string; description:string; scene:Environment; action:Action; conditions?:Condition; choices:Choice[]; callback?:{flag:string;text:string}; }
export interface Club { id:string; name:string; region:string; tier:number; prestige:number; training:number; difficulty:number; salary:number; youth:number; opportunity:number; colors:[string,string]; crest:string; }
export interface Season { age:number; clubId:string; appearances:number; goals:number; assists:number; defensive:number; cleanSheets:number; rating:number; trophies:number; awards:number; }
export interface TimelineEntry { age:number; title:string; text:string; kind:'decision'|'transfer'|'injury'|'trophy'|'chapter'|'national'; }
export interface Result { eventId:string; choiceId:string; title:string; text:string; success:boolean; probability?:number; changes:Effects; action:Action; variant:string; scene:Environment; season?:Season; memory?:string; }
export interface CareerState { version:1; config:PlayerConfig; seed:number; rng:number; step:number; age:number; chapter:Chapter; attributes:Attributes; potential:number; clubId:string; playingTime:number; trust:number; reputation:number; peakReputation:number; morale:number; injuryRisk:number; injury:number; majorInjuries:number; money:number; appearances:number; goals:number; assists:number; defensive:number; cleanSheets:number; trophies:number; awards:number; nationalCaps:number; coaching:number; relationships:{rival:number;mentor:number;family:number}; flags:string[]; completed:string[]; history:{eventId:string;choiceId:string;age:number}[]; transfers:{age:number;from:string;to:string}[]; timeline:TimelineEntry[]; seasons:Season[]; currentEventId:string; phase:'decision'|'result'|'ending'; result:Result|null; endingId:string|null; }
export interface Ending { id:string; title:string; subtitle:string; description:string; color:string; }
