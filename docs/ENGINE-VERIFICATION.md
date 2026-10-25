# Engine verification

Run the actual TypeScript engine tests with:

```sh
npm test
node scripts/test-transfers.mjs
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
| `whatif` | `elite` | 4 | striker |
| `journeyman` | `elite` | 3 | striker |
| `comeback` | `elite` | 7 | striker |
| `oneClub` | `exploratory` | 42 | striker |
| `wasted` | `inconsistent` | 31 | winger |
| `hometown` | `hometown` | 1 | midfielder |
| `mastermind` | `coaching` | 2 | midfielder |

These are examples of earned outcomes rather than forced branches. The same policy may reach different endings as starting attributes, content eligibility, performance, and injuries vary by seed. A seed alone does not identify a full career: position and the complete sequence of choices also matter.

## Phase 2 transfer matrix

`node scripts/test-transfers.mjs` additionally runs **640 complete legal careers**: elite, average, struggling, and loyal strategies, each across four positions and seeds 1–40. Every career offers all five guaranteed windows, exactly two competing clubs plus one stay route, and five or six total club decisions. The runner saves and reloads every offer checkpoint and confirms exact offer identity, salary, role, subsequent club, immutable choices, actual contract animation identity, and statistics summed from contiguous club spells.

| Profile | Careers | Mean offer decisions | Overseas careers | Mean final overall | Highest tier |
| --- | ---: | ---: | ---: | ---: | ---: |
| Elite | 160 | 5.43 | 160 | 83.83 | 4 |
| Average | 160 | 5.54 | 78 | 74.76 | 4 |
| Struggling | 160 | 5.55 | 0 | 63.67 | 1 |
| Loyal | 160 | 5.40 | 0 | 83.35 | 1 |

The matrix observes all **32 offer clubs** and **six earned elite destinations**. All new careers begin professionally in Indonesia at 18. No foreign offer is generated before 21. Elite eligibility assertions apply to new offers; a veteran already at an elite club can renew after physical decline. Loyal careers retain one professional club, and struggling careers still have plausible domestic offers.

Four committed JSON fixtures were produced by bundling the untouched original engine from Git revision `a0f2f3a`: age-17 decision, age-22 result, an original age-18 overseas result, and a completed ending. The revised engine validates all four, preserves their names, event IDs, completed choices, and stored endings, then continues each unfinished career legally. These fixtures also preserve the original 28-character name. They live in `scripts/fixtures/legacy-v1-*.json`; they are actual old engine outputs rather than edited states.

Together, the two committed matrices exercise **2,411 complete strategy careers**, plus focused regressions and legacy continuations. Both suites passed after the transfer overhaul; all eight endings remain naturally reachable.

## Scope of this verification

Automated tests verify engine behavior and semantic animation instructions. Visual animation quality, PNG layout, touch interaction, sound, and browser refresh behavior require separate application checks; passing the engine suite does not by itself establish those UI qualities.
