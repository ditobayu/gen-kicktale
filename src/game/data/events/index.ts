import type { StoryEvent } from '../../types/game';
import { childhoodEvents } from './childhood';
import { academyEvents } from './academy';
import { professionalEvents } from './professional';
import { primeEvents } from './prime';
import { retirementEvents } from './retirement';

/** Bundled, authored narrative. Selection and consequences belong to the engine. */
export const EVENTS: StoryEvent[] = [
  ...childhoodEvents,
  ...academyEvents,
  ...professionalEvents,
  ...primeEvents,
  ...retirementEvents,
];
