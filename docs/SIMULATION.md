# Simulation and state contract

The game engine is pure TypeScript and does not import React or touch browser storage at module import. `src/game/engine/index.ts` is the public entry point.

```ts
const start = createCareer(config, 123); // optional uint32 seed
const event = getEvent(start);
const committed = choose(start, event.choices[0].id);
saveCareer(committed);                 // persist the complete result checkpoint
const next = advance(committed);
saveCareer(next);
```

`createCareer`, `choose`, and `advance` return new state objects. A repeated `choose` during a result or ending and a repeated `advance` during a decision or ending return unchanged clones. Choices use identifiers from the current event only. The UI saves after each committed state transition. Refreshing a result restores its complete attributes, RNG state, history, season totals, and animation instruction without computing the choice again.

## Progression

There are exactly 20 decisions in five chapters, four per chapter:

| Chapter | Decision ages |
| --- | --- |
| Childhood | 8, 10, 11, 12 |
| Academy | 13, 14, 16, 17 |
| Professional | 18, 19, 21, 22 |
| Prime | 23, 25, 27, 29 |
| Retirement | 30, 33, 35, 38 |

Selection considers chapter, inclusive minimum/maximum ages, completed IDs, ability, reputation, club tier, injury status, and flags. Opening age 8, the first contract at 18, the crossroads at 33, and farewell at 38 are fixed milestone events. Other events are selected by seeded weighted sampling from eligible, uncompleted content. Authoring must preserve enough eligible choices for every scheduled age; missing content throws a descriptive error instead of selecting an inappropriate event.

Every simulation draw uses Mulberry32 and updates the saved `rng` uint32. Event selection, conditional choice outcomes, season variance, trophies, awards, and injuries all share this state. Cosmetic result variants are derived from the committed RNG checkpoint and consume no additional randomness.

## Development and match outcomes

Attributes stay between 0 and 100. Starting values and potential vary by seed; each position receives different starting strengths and overall weights. Potential is 84–94 before habits and mentor effects. Positive development slows as an attribute approaches its effective ceiling. Discipline, recurring habits, club training quality, and actual playing time determine growth; youth and academy growth is faster than prime growth. Pace and fitness decline after 30 at rates affected by fitness, injuries, habits, and age. Vision and mentality can continue benefiting from experience.

Uncertain decisions combine the relevant skill, a position-specific supporting attribute, mentality, fitness, morale, coach trust, the mentor relationship, event difficulty, age, current club pressure, and active injury burden. Success probability is bounded to 12–93%. Safe choices apply their authored trade-offs directly. Failed skill checks use authored failure copy and effects. Flags retain important choices, and later events/results reference those memories.

## Clubs, minutes, and transfers

Sixteen club records use tier 1 for local clubs and tier 4 for elite international contenders. Cakrawala is the youth school and is excluded from professional club counts. At 18 the player enters Surya Kota's professional pathway before selecting a first contract.

Interest is filtered using ability, reputation, age, potential, and professional appearances. Tier 4 requires overall 82+, reputation 58+, and 45 professional appearances. A transfer choice selects only among actual interested clubs. A request for foreign opportunities may produce no contract if no foreign club is interested. Staying loyal preserves the current club; returning home transfers to Surya Kota if necessary. Every actual move records its source, destination, and age.

Expected minutes combine a club's newcomer opportunity, the player's ability relative to the competition, reputation, and trust. An elite newcomer can begin behind established starters, while strong performances and growing trust can earn a leading role. Minutes feed appearances, development, form, and subsequent performance. Salaries and all `money` effects use **rupiah**, with club salary expressed annually.

## Seasons and truthful totals

Choosing a decision simulates its interval up to, but excluding, the next decision age. Youth intervals develop attributes without generating professional statistics. The professional record contains exactly one row for each age 18–37, totaling 20 seasons. The age-38 farewell does not fabricate a final extra season.

Appearances depend on minutes and injury availability. Goals emphasize strikers; assists emphasize midfielders and wingers; defensive contributions emphasize defenders. Clean sheets record the team's shutouts during the player's appearances. Ratings evaluate role-specific influence, ability relative to competition, form, and bounded variance. Trophy probability is bounded, requires meaningful appearances, and is never granted merely because an event mentions a final. Awards require sustained minutes and performance. Senior national appearances require reputation, performance, age, and availability; a first call-up is recorded in the timeline.

`state.seasons` contains the individual years. `result.season` is the **aggregate of the full skipped interval**, including a rating weighted by appearances. For example, the age-30 decision may show ages 30–32 and three seasons. Career statistics equal the sum of the individual rows. The ending and export read those totals directly. Reputational growth has a visibility ceiling per club tier while preserving previously earned fame after a move to a smaller club.

Injuries reduce availability, can reduce physical attributes, and create recorded setbacks. Patient recovery reduces risk and can support a later comeback. An injury may heal during a multi-year skip; the result still retains the injury's history and consequences.

## Semantic animation output

Each committed `result` contains an `action`, `variant`, `scene`, success status, actual changes, and optional season/memory. Shooting returns `goal`, `save`, `miss`, or `post`; passing includes `key-pass` and `interception`; training uses `improvement`/`struggle`; injuries use `recovery`/`setback`. A real interval trophy can select `trophy`/`celebration` and add copy based on the actual trophy count. A newly suffered major injury overrides the immediate action with an injury scene. Milestone text never grants a trophy on its own.

## Ending priorities

Rules are deterministic, in this priority order:

1. **Mastermind:** 12 coaching points, coaching intent, vision 60+. Coaching decisions build a real final epilogue of assisting Cakrawala youth sessions.
2. **GOAT:** five elite seasons with 18+ appearances, peak reputation 88+, 400 career appearances, three trophies, three awards, and an appearance-weighted rating of at least 7.25.
3. **Wasted talent:** three separate neglect decisions, discipline below 76, and a final overall at least nine points below natural potential. A single early mistake cannot trigger this ending.
4. **Comeback:** a major injury, actual recovery and subsequent successful season, a resilience/comeback path, manageable final injury risk, 220 appearances, and reputation 50+.
5. **Hometown:** a meaningful home connection, leadership or an actual return, three substantial Surya Kota seasons, a current home club, and 230 appearances.
6. **One club:** exactly one professional club, loyalty, 320 appearances, and reputation 45+.
7. **Journeyman:** four professional clubs, foreign experience, and 240 appearances.
8. **What-if:** the reflective fallback for other real careers.

Each ending uses the actual state in its personalized description. The rules deliberately permit satisfying careers centered on home, loyalty, recovery, travel, or teaching as well as international success.

## Persistence

The versioned key is `kicktale_save_v1`. `saveCareer` and `deleteCareer` return booleans; `loadCareer` returns a validated state or `null`; `hasCorruptSave` distinguishes a malformed save from no save. All accept an optional Storage-like dependency for testing. Storage access is lazy and wrapped so disabled storage, quota limits, and malformed JSON do not crash the application.

Validation checks configuration and appearance, bounded attributes, seed/RNG state, scheduled age/chapter, phase checkpoints, all event and choice IDs, duplicate event/flag prevention, transfer records, timeline fields, season chronology, and exact career-stat sums. Invalid saves are rejected and left intact until the user restarts or deletes them. This is integrity checking for a local single-player game, not an anti-cheat system.
