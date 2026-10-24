# KICKTALE

**Satu hidup. Satu bola. Seribu kemungkinan.**

A complete Indonesian football career comic, built as an independent sibling of AFTERLIGHT, WOBBLE!, and BAYSTRIX LAB. No existing sibling project is modified.

## Run

Requires Node 18+ and npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`dist/` is the standalone static website. Upload its contents to any static host, including the proposed `kicktale.baystrix.com`. No server, database, login, paid API, or runtime environment variables are used. Vite's relative asset base supports a subdirectory deployment. Service-worker offline support requires HTTPS or localhost; the game logic and all content remain local regardless.

## Play

Create a player, select a position, and make 20 choices over five chapters (ages 8–38). A run is designed for approximately 5–10 minutes of reading and decisions; animations last about three seconds and can be skipped. The library contains 50 authored scenarios, with four selected per chapter, recurring characters, eligibility checks, delayed consequences, and seeded randomness. Actual duration depends on reading speed; no human timing study has been performed.

Every choice commits its effects, seeded RNG state, seasonal results and result checkpoint in one versioned localStorage write. Reload from a result to see the same result; clicking onward never reapplies a reward. Invalid or outdated saves are rejected with a restart message. Browser storage denial is reported without stopping the active session. One active career is retained per browser. Completed careers remain available until replaced or deleted.

The six attributes, playing time, age, potential, morale, coach trust, injuries, club facilities and competition all influence development and performance. Attackers, creators and defenders use different contribution weights. A defender is evaluated by defensive contributions, not goals. Eight deterministic ending archetypes consider actual seasons, choices, injuries, coaching, loyalty and reputation. The retirement card reads those records and exports a real 1200×1600 PNG locally; file sharing uses the native Web Share API when supported, otherwise downloads the PNG.

## Architecture

- `src/game/types/game.ts`: shared types and event contract.
- `src/game/data/events/`: authored Indonesian narrative, separate from logic.
- `src/game/data/clubs.ts`: 16 original clubs, tier 1 through 4.
- `src/game/engine/`: pure career, event selection, probabilities, progression, transfer, season, ending and persistence modules.
- `src/components/Scene.tsx`, `src/styles/scene.css`: an original modular articulated SVG footballer and ten choreographed scene categories.
- `src/App.tsx`: menu, creation, chapters, story, results, journal, recap, settings and retirement.
- `src/game/card.ts`: canvas PNG generator, without third-party image services.
- `src/game/audio.ts`: optional synthesized Web Audio cues, activated only by a user action.
- `scripts/test-engine.mjs`: reproducible automated career and persistence validation.
- `scripts/make-offline.mjs`: hashed production asset precache, generated after each build.

All fonts are bundled locally under their open licenses in `public/fonts/`. All artwork and sound are authored in source. There are no hotlinked images, analytics, fabricated global statistics, or network gameplay calls. The artist rig supports skin tones, three hairstyles, three face presets, childhood proportions, veteran detail, and club colors. SVG choreography includes dribbling, shooting, passing, tackling, training, signing, injury, trophies, bench disappointment and farewell.

## Controls and accessibility

Mouse, touch and standard keyboard buttons work throughout. Tab focus is visible, dialogs trap focus and close with Escape. Reduced motion follows the device setting and can also be selected in settings. Audio starts muted. Fast play shortens the result wait, and every scene has a skip control. Journal/settings never alter simulation outcomes.

## Extend

Read [docs/EVENTS.md](docs/EVENTS.md) for event authoring and [docs/SIMULATION.md](docs/SIMULATION.md) for formulas, ending priorities and validation. A ready-to-add archive record lives at `docs/baystrix-lab-project.json`; it is deliberately not inserted into BAYSTRIX LAB. Replace its proposed website URL with the real publication URL and copy its cover asset before adding it to the archive.

The product is a stylized football fiction. Club identity search findings are documented in `docs/IDENTITY-AUDIT.md`.
