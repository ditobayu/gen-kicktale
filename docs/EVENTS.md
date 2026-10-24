# Authoring KICKTALE events

The game bundles 50 original Indonesian scenarios in `src/game/data/events/`, ten per chapter. A career chooses four decisions per chapter, for 20 in total. Most scenarios cover the full chapter age range; healthy, injured, elite, and ordinary careers therefore have fallback stories. The pure simulation engine owns selection, random outcomes, transfers, and accumulated statistics. Event copy never invents an actual season result, a cap, or a trophy.

## Files and schema

Add a scenario to the appropriate chapter module. `index.ts` combines the exported arrays as `EVENTS: StoryEvent[]`. The authoritative TypeScript schema is `src/game/types/game.ts`.

```ts
{
  id: 'prime_example',          // Unique, stable, saved in career history.
  chapter: 'prime',
  minAge: 23,
  maxAge: 29,                  // Inclusive age eligibility.
  weight: 8,                  // Relative selection weight among eligible stories.
  title: 'Sebuah keputusan',
  description: 'Set up a concrete situation in 2–4 Indonesian sentences.',
  scene: 'training',
  action: 'pass',
  conditions: { minTier: 3, injured: false },
  callback: { flag: 'loyalty', text: 'Acknowledge an actual earlier choice.' },
  choices: [
    {
      id: 'example_try',
      label: 'Ambil tanggung jawab lebih besar',
      hint: 'Visi diuji · peluang sorotan dengan beban tambahan',
      effects: { fitness: -3 },
      skill: 'vision',
      difficulty: 58,
      successEffects: { reputation: 4, trust: 3 },
      failureEffects: { morale: -3, trust: -2 },
      flags: ['captain'],
      action: 'pass',
      outcome: 'Describe what a successful action actually accomplished.',
      failure: 'Describe failure without inventing a career-ending punishment.',
    },
    {
      id: 'example_support',
      label: 'Bantu tim dengan tugas yang lebih tenang',
      hint: 'Kepercayaan dan pemulihan · sorotan berkurang',
      effects: { trust: 3, fitness: 2, reputation: -2 },
      outcome: 'A safe choice still gives up a meaningful opportunity.',
    },
  ],
}
```

The example's instructional sentences must be replaced by natural Indonesian before shipping. Code and documentation may remain English.

Core attribute effects are `technique`, `pace`, `fitness`, `vision`, `discipline`, and `mentality`. Additional supported effects are `morale`, `reputation`, `trust`, `injuryRisk`, `money`, `playingTime`, `rival`, `mentor`, and `family`. Keep each point change modest (usually 2–7) and give every choice a cost. `money` uses actual rupiah, so a two-million-rupiah change is `money: 2000000`, not `money: 2`. For an uncertain choice, `effects` apply regardless of outcome and `successEffects` or `failureEffects` add the relevant branch. Use a `skill` plus a difficulty around 40–65, and supply both result texts. The engine seeds randomness, so authors must never use `Math.random()` in event data.

`action` is an animation instruction, not an achievement award. The ten supported actions are `dribble`, `shoot`, `pass`, `tackle`, `training`, `contract`, `injury`, `trophy`, `bench`, and `farewell`. Valid scenes are `street`, `academy`, `stadium`, `training`, `office`, `medical`, and `locker`. A `trophy` animation alone does not add a cup to career records.

## Conditions, callbacks, and continuity

Conditions are combined as requirements: `minOverall`, `minReputation`, `minTier`, `maxTier`, `flag`, `notFlag`, and `injured`. For a major competition, use both club and player requirements. For example, `prime_continental` requires tier 4, overall 64, reputation 55, and a healthy player. `prime_national` is an invitation to a selection camp and requires overall 66, reputation 60, and health; it does not guarantee a national appearance. Injury rehabilitation stories require `injured: true`.

To add a conditional scenario, copy a broad chapter event, give it a unique ID, add the needed `conditions`, and keep enough broad events available when those conditions fail. A `callback` adds text only if its flag was genuinely recorded. Do not write a generic scene as if a player definitely won a trophy, rejected a specific club, or suffered a major injury. Use conditions or an actual engine milestone for those statements.

Recurring characters are Bima (childhood friend), Raka (rival, potentially a friend), Coach Ratih (mentor), Ibu (family), and Nara (agent). The opening is at fictional Cakrawala Junior in Surabaya. Other institution and competition names are fictional.

Shared memory flags include:

| Flag | Meaning and use |
| --- | --- |
| `disciplined` | Chose structure, preparation, or recovery. Used by later development and callbacks. |
| `mentor`, `friendship` | Maintained relationships with Coach Ratih, Bima, Raka, or younger players. |
| `homeRoots` | Valued family or the childhood community. A home transfer additionally records the engine's actual return state. |
| `loyalty` | Chose to stay or serve the current team. Transfer history still determines actual club continuity. |
| `minutesFirst` | Prioritized an opportunity to play. A later transfer event acknowledges it. |
| `moneyFirst` | Prioritized commercial or contract earnings. Later stories acknowledge the competing demands. |
| `neglect` | Repeatedly accepted costs to health or preparation. One flag alone must not doom a career. |
| `riskTaker` | Willingly accepted a difficult sporting choice. |
| `resilience`, `comeback` | Rebuilt after setbacks; rehabilitation choices provide a factual basis. |
| `captain` | Accepted a leadership role. |
| `coaching` | Pursued teaching. Choices must also award numeric `coaching` to build a real pathway. |
| `journeyman`, `ambition` | Chose new environments or more demanding opportunities. Actual club records matter. |

`transfer` expresses intent: `ambition`, `minutes`, `home`, `loyal`, or `abroad`. The engine resolves intent against realistic eligibility and available clubs. Labels should describe the path rather than promise a named elite club. Outcome copy must remain true if the best eligible path is a modest one. `injury: 'risk'` asks the engine to resolve risk; `injury: 'recover'` supports recovery. Never claim a major injury solely because a risk was taken. Numeric `coaching` is separate from attributes and flags.

## Scheduling and checks

The fixed decision ages are childhood `8, 10, 11, 12`; academy `13, 14, 16, 17`; professional `18, 19, 21, 22`; prime `23, 25, 27, 29`; retirement `30, 33, 35, 38`. These story IDs are deliberate engine checkpoints and must remain stable:

- `childhood_first` at 8: Bima's opening pass; the player chooses a shot or a pass-and-return.
- `professional_contract` at 18: first professional pathway.
- `retirement_crossroads` at 33: stay, home, or abroad.
- `retirement_farewell` at 38: final decision before the ending.

Before adding or narrowing eligibility, check that every decision age has at least four broad eligible events before completion filtering. Run the repository's typecheck/build and simulation test commands from `README.md`/`package.json`. The simulation checks should cover the seeded elite striker, inconsistent winger, loyal midfielder, tactical defender, injury, money, comeback, and coaching paths. Inspect a complete played career too: result text, semantic action, attribute changes, callback, and actual season statistics must tell the same story. Confirm save/reload preserves the selected event and committed result.
