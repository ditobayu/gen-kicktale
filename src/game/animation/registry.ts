import type { Action, Environment, Result } from '../types/game';

export const animationVariants = {
  dribble: ['success', 'interception'],
  shoot: ['goal', 'save', 'post'],
  pass: ['key-pass', 'interception'],
  tackle: ['success', 'foul'],
  training: ['improvement', 'struggle'],
  contract: ['signed', 'negotiation'],
  injury: ['setback', 'recover'],
  trophy: ['win'],
  bench: ['waiting', 'encouragement'],
  farewell: ['farewell'],
} as const satisfies Record<Action, readonly string[]>;

export interface AnimationDefinition {
  durationMs: number;
  loop: boolean;
  variants: readonly string[];
  environment?: Environment;
}

export const ANIMATION_REGISTRY: Record<Action, AnimationDefinition> = {
  dribble: { durationMs: 2600, loop: true, variants: animationVariants.dribble },
  shoot: { durationMs: 2600, loop: false, variants: animationVariants.shoot },
  pass: { durationMs: 2400, loop: false, variants: animationVariants.pass },
  tackle: { durationMs: 2500, loop: false, variants: animationVariants.tackle },
  training: { durationMs: 2800, loop: true, variants: animationVariants.training, environment: 'training' },
  contract: { durationMs: 3200, loop: false, variants: animationVariants.contract, environment: 'office' },
  injury: { durationMs: 3200, loop: false, variants: animationVariants.injury },
  trophy: { durationMs: 3600, loop: false, variants: animationVariants.trophy },
  bench: { durationMs: 2800, loop: true, variants: animationVariants.bench, environment: 'locker' },
  farewell: { durationMs: 3800, loop: false, variants: animationVariants.farewell },
};

export interface AnimationInstruction extends AnimationDefinition {
  action: Action;
  variant: string;
  outcome: 'success' | 'failure' | 'neutral';
}

type AnimationResult = Partial<Pick<Result, 'success' | 'variant' | 'season'>>;

/** Translates story results into visual instructions without modifying career state. */
export function playAnimation(action: Action, options: { result?: AnimationResult | null; speed?: number; reducedMotion?: boolean } = {}): AnimationInstruction {
  const raw = options.result?.variant || 'success';
  const successful = options.result?.success ?? !/miss|fail|loss|bad|unsuccess|save|post|foul|interception|struggle|setback|negotiation/.test(raw);
  const explicit = (animationVariants[action] as readonly string[]).includes(raw);
  const defaults: Record<Action, [string, string]> = {
    dribble: ['success', 'interception'], shoot: ['goal', 'save'], pass: ['key-pass', 'interception'],
    tackle: ['success', 'foul'], training: ['improvement', 'struggle'], contract: ['signed', 'negotiation'],
    injury: ['recover', 'setback'], trophy: ['win', 'win'], bench: ['encouragement', 'waiting'], farewell: ['farewell', 'farewell'],
  };
  const variant = explicit ? raw : defaults[action][successful ? 0 : 1];
  const definition = ANIMATION_REGISTRY[action];
  const neutral = action === 'bench' || action === 'farewell';
  return {
    ...definition, action, variant,
    durationMs: options.reducedMotion ? 0 : Math.round(definition.durationMs / Math.max(.25, options.speed || 1)),
    outcome: neutral ? 'neutral' : ['save', 'post', 'foul', 'interception', 'struggle', 'setback', 'negotiation'].includes(variant) ? 'failure' : 'success',
  };
}
