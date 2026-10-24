import type { CareerState, Choice } from '../types/game';
import { getClub } from '../data/clubs';
import { overall } from './attributes';
import { clamp } from './random';

/** Preparation moves the odds far more than the bounded random outcome. */
export function successProbability(state:CareerState,choice:Choice):number {
  const skill=choice.skill? state.attributes[choice.skill]:overall(state);
  const support=state.config.position==='defender'?state.attributes.vision:state.config.position==='winger'?state.attributes.pace:state.config.position==='midfielder'?state.attributes.vision:state.attributes.technique;
  const readiness=skill*.57+support*.16+state.attributes.mentality*.14+state.attributes.fitness*.13;
  const difficulty=choice.difficulty ?? (getClub(state.clubId).difficulty-5);
  const form=(state.morale-50)*.0018+(state.trust-50)*.001+(state.relationships.mentor-50)*.0006;
  const injuryPenalty=state.injury*.035;
  const experience=state.age<16?-.025:state.age>=24 && state.age<=31?.02:state.age>=35?-.02:0;
  const clubPressure=(getClub(state.clubId).tier-1)*.018;
  return Math.round(clamp(.57+(readiness-difficulty)*.008+form+experience-injuryPenalty-clubPressure,.12,.93)*100)/100;
}
