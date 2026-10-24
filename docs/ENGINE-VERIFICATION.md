# Engine verification

Run the actual TypeScript engine tests with:

```sh
npm test
```

The test runner bundles the same engine used by the application with esbuild, imports the in-memory bundle into Node, and uses strict assertions. It does not duplicate simulation logic. No test creates an ending by editing state.

The regression matrix covers 11 policies with seeds 1–160, plus a full checkpoint-verified career at seed 1209 for each policy: **1,771 complete policy careers**, followed by focused deterministic, position, storage, and eight-ending regression careers. Policies cover disciplined elite play, inconsistent talent, a hometown career, a tactical defender, repeated injury risk, money/prestige, a comeback, coaching, club loyalty, travel, and a deterministic exploratory route. The exploratory policy broadens animation and uncertain-choice coverage beyond the strategic policies.

Checks include:

- Exactly 20 unique meaningful decisions and all five age-appropriate chapters.
- No eligible-content softlocks across the matrix; age and chapter gates are checked at every decision.
- Input state immutability, duplicate-choice guards, and duplicate-advance guards.
- Attributes remain finite and bounded; club changes refer to real catalog records.
- Exactly 20 professional rows, ages 18–37, and exact sums for every career-stat column.
- Every decision and result checkpoint passes structural save validation.
- Reloaded results and their next state are identical, including committed RNG and rewards.
- Same-seed full careers reproduce exactly; different seeds vary starting attributes.
- Corrupt JSON, missing/null nested structures, inconsistent totals, and storage exceptions recover without crashing.
- Delete removes the active save; valid finished careers can also be restored.
- Strong preparation improves probability, realistic elite-offer restrictions hold, and minutes depend on readiness.
- Defenders produce more defensive contributions and strikers more goals under comparable policies.
- All ten animation actions and representative success/failure/recovery/trophy variants occur in actual legal careers.
- All eight endings have deterministic, reproducible routes.

## Reproducible ending routes

The policy implementation and tie-breakers live in `scripts/test-engine.mjs`. Print an exact 20-choice history, final statistics, and ending without running the whole matrix:

```sh
npm test -- --route elite 1 striker
npm test -- --route inconsistent 31 winger
```

| Ending ID | Policy | Seed | Position |
| --- | --- | --- | --- |
| `goat` | `elite` | 1 | striker |
| `whatif` | `elite` | 2 | striker |
| `journeyman` | `elite` | 11 | striker |
| `comeback` | `elite` | 27 | striker |
| `oneClub` | `inconsistent` | 2 | winger |
| `wasted` | `inconsistent` | 31 | winger |
| `hometown` | `hometown` | 1 | midfielder |
| `mastermind` | `coaching` | 1 | midfielder |

These are examples of earned outcomes rather than forced branches. The same policy may reach different endings as starting attributes, content eligibility, performance, and injuries vary by seed. A seed alone does not identify a full career: position and the complete sequence of choices also matter.

## Scope of this verification

Automated tests verify engine behavior and semantic animation instructions. A separate read-only audit also completed 1,000 exploratory careers across all four positions without invalid checkpoints or replay errors. Those extra audit runs are supporting evidence, not counted in the committed 1,771-career matrix. Visual animation quality, PNG layout, touch interaction, sound, and browser refresh behavior require separate application checks; passing the engine suite does not by itself establish those UI qualities.
