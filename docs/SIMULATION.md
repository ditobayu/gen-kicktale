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

Selection considers chapter, inclusive minimum/maximum ages, completed IDs, ability, reputation, club tier, injury status, and flags. Opening age 8, academy choice at 16, first contract at 18, early professional choice at 22, prime choice at 27, veteran choice at 33, and farewell at 38 are fixed milestone events. One additional conditional club negotiation may appear; the total remains 20 decisions and five or six club decisions. Other events are selected by seeded weighted sampling from eligible, uncompleted content. Authoring must preserve enough eligible choices for every scheduled age; missing content throws a descriptive error instead of selecting an inappropriate event.

Every simulation draw uses Mulberry32 and updates the saved `rng` uint32. Event selection, conditional choice outcomes, season variance, trophies, awards, and injuries all share this state. Cosmetic result variants are derived from the committed RNG checkpoint and consume no additional randomness.

## Development and match outcomes

Attributes stay between 0 and 100. Starting values and potential vary by seed; each position receives different starting strengths and overall weights. Potential is 84–94 before habits and mentor effects. Positive development slows as an attribute approaches its effective ceiling. Discipline, recurring habits, club training quality, and actual playing time determine growth; youth and academy growth is faster than prime growth. Pace and fitness decline after 30 at rates affected by fitness, injuries, habits, and age. Vision and mentality can continue benefiting from experience.

Uncertain decisions combine the relevant skill, a position-specific supporting attribute, mentality, fitness, morale, coach trust, the mentor relationship, event difficulty, age, current club pressure, and active injury burden. Success probability is bounded to 12–93%. Safe choices apply their authored trade-offs directly. Failed skill checks use authored failure copy and effects. Flags retain important choices, and later events/results reference those memories.

## Clubs, minutes, and transfers

Thirty-two original fictional clubs include three Indonesian academies, lower and top domestic clubs, Asian clubs, European development and mid-tier sides, and elite clubs in England, Spain, Italy, Germany, France, and Portugal. All original 16 IDs and display names remain available for old saves. Individual training, opportunity, pressure, and salary values overlap between regions; a European development club is not automatically better than an Indonesian contender.

Every new career starts at Cakrawala Junior in Surabaya. At 16 there are two actual academy offers and a stay option; schooling continues and no professional statistics are generated. The age-18 window contains two actual Indonesian professional offers plus Surya Kota's senior pathway near home. Professional seasons begin only after the choice, at 18. New careers cannot receive foreign offers before 21.

`prepareTransferDecision` commits two named offers and one stay option once when a transfer event is selected. `getTransferOffers` and `getOfferDecision` read that saved decision; `getEvent` materializes its exact `offer:<clubId>` / `stay:<clubId>` choices. `choose` accepts those explicit IDs. Refreshing neither samples again nor improves the offer. The accepted decision is copied into `transferDecisionLog`, and `state.contract` stores the actual club, annual salary, role, projected minutes, and signing age.

Interest considers age, position and club needs, current ability and potential, reputation, recent appearance-weighted rating and appearances, minutes, injury burden/recent setbacks, coach trust, current club, previous interest, and bounded deterministic scouting variation. Foreign development clubs require ability 68+, reputation 27+, potential 80+, recent rating 6.55+, and meaningful professional appearances. Elite offers require age 23+, ability 84+, reputation 67+, recent rating 7.05+, at least 55 appearances over the last three seasons, trust 40+, limited active injury, and sufficient interest. Staying at an already earned elite club remains possible after physical decline.

The two offers balance ambition against playing opportunity; late-career offers include a realistic home return. Accepting an offer sets its actual club, salary, trust, role, and minutes. Staying builds continuity. Club identity drives the scene's jersey and crest through the active club ID. All money values are rupiah, with salaries annual. Full transfer rules and the public API are documented in [TRANSFERS.md](./TRANSFERS.md).

## Seasons and truthful totals

Choosing a decision simulates its interval up to, but excluding, the next decision age. Youth intervals develop attributes without generating professional statistics. The professional record contains exactly one row for each age 18–37, totaling 20 seasons. The age-38 farewell does not fabricate a final extra season.

Appearances depend on minutes and injury availability. Goals emphasize strikers; assists emphasize midfielders and wingers; defensive contributions emphasize defenders. Clean sheets record the team's shutouts during the player's appearances. Ratings evaluate role-specific influence, ability relative to competition, form, and bounded variance. Trophy probability is bounded, requires meaningful appearances, and is never granted merely because an event mentions a final. Awards require sustained minutes and performance. Senior national appearances require reputation, performance, age, and availability; a first call-up is recorded in the timeline. First professional contract, actual first appearance, actual first goal, leadership, and retirement also create milestones. `getClubHistory` groups contiguous season rows into spells, preserving repeat returns and exact totals for all statistical columns.

`state.seasons` contains the individual years. `result.season` is the **aggregate of the full skipped interval**, including a rating weighted by appearances. For example, the age-30 decision may show ages 30–32 and three seasons. Career statistics equal the sum of the individual rows. The ending and export read those totals directly. Reputational growth has a visibility ceiling per club tier while preserving previously earned fame after a move to a smaller club.

Injuries reduce availability, can reduce physical attributes, and create recorded setbacks. Patient recovery reduces risk and can support a later comeback. An injury may heal during a multi-year skip; the result still retains the injury's history and consequences.

## Semantic animation output

Each committed `result` contains an `action`, `variant`, `scene`, success status, actual changes, and optional season/memory. Shooting returns `goal`, `save`, `miss`, `post`, or `blocked`; authored failure metadata and canonical shot narration keep physical outcome and text consistent; passing includes `key-pass` and `interception`; training uses `improvement`/`struggle`; injuries use `recovery`/`setback`. A real interval trophy can select `trophy`/`celebration` and add copy based on the actual trophy count. A newly suffered major injury overrides a football action with an injury scene. Contract choices retain the signing ceremony while the season text still records any later injury in the skipped interval. Results also carry the actual `clubId` and `playerName`. Milestone text never grants a trophy on its own.

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

The versioned key is `kicktale_save_v1`. `saveCareer` and `deleteCareer` return booleans; `loadCareer` returns a validated state or `null`; `hasCorruptSave` distinguishes a malformed save from no save. All accept an optional Storage-like dependency for testing. The key and version stay at v1; optional revision-2 fields extend rather than replace the schema. Current event IDs, historical authored choice IDs, 28-character legacy names, historical overseas starts, and already committed ending IDs remain readable. A legacy active transfer event receives its stable named offers when loaded, without changing its event ID or completed history. Storage access is lazy and wrapped so disabled storage, quota limits, and malformed JSON do not crash the application.

Validation checks configuration and appearance, bounded attributes, seed/RNG state, scheduled age/chapter, phase checkpoints, all event and choice IDs, duplicate event/flag prevention, transfer records, timeline fields, season chronology, and exact career-stat sums. Invalid saves are rejected and left intact until the user restarts or deletes them. This is integrity checking for a local single-player game, not an anti-cheat system.
