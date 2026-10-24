# KICKTALE cinematic animation system

The original CSS loops moved actors, ball and keeper independently. They could not express contact, possession, goal boundaries or an unambiguous consequence. The replacement is an authored, deterministic world-space timeline. Rendering and sound sample the same event clock.

## Public API

```ts
import {createTimeline, sampleTimeline, timelineCues, GOAL} from '../game/animation/timeline';
const timeline=createTimeline({
  action:'shoot', variant:'goal', environment:'stadium',
  shotType:'curled', intensity:'dramatic', celebration:'knee-slide',
  foot:'right', seed:17,
});
const frame=sampleTimeline(timeline,3500);
const cues=timelineCues(timeline);
```

`createTimeline` returns the normalized spec, duration and exact contact, outcome and reaction times. `sampleTimeline` is a pure function. It supports seeking, replay, pause, cleanup and speed changes without frame history or accumulated drift. Input time clamps to the scene duration; terminal frames remain stable. `timelineCues` identifies the exact kick, glove, post, goal, whistle, signing and crowd moments for the audio controller.

No animation modifies career state. Story result handling remains responsible for applying a decision exactly once. A skipped/reduced-motion sequence samples its complete frame, which retains the correct outcome.

## World, body and camera contract

- A world point is `{x,y,z}`. Pitch coordinates use x/y; height is z. Screen projection before camera is `(x, y-z)`.
- Actor x/y anchor both feet at ground level. Scale controls stature; the layered body is approximately 180 local units high. `facing` is 1 or -1; lean and rotation use degrees. Cycle is a deterministic running phase, independent from React renders.
- An actor's optional foot, hands and head are **absolute world-space contact targets**. The rig converts these into local inverse-kinematic targets. Foot designates the active shooting/controlling foot; head supports genuine headers.
- The ball appears once, from `frame.ball`. Owned balls still use that world position. No CSS animation separately translates a ball or goal.
- Ball frames contain position, three velocity components (world units per second), spin, scale, ownership, motion, target and sampled prior positions for a finite motion trail.
- The camera center defaults to `(500,300)` in a 1000 × 600 composition. Rendering uses `translate(500,300) scale(zoom) translate(-x,-y)`. Shake offsets are transient and deterministic. See `project()` for the exact world-to-camera projection.
- Goal mouth is `x=[790,960], y=440, z=[0,155]`. Depth is `(28,-24)`. A goal crosses that plane inside those boundaries before travelling into the net. Posts and ball collide at the same coordinates.

## Complete choreography inventory

| Action | Setup / contact | Consequence | Reaction |
| --- | --- | --- | --- |
| Shoot | Controlled dribble or delivered header, plant, backswing, exact toe/head contact | Goal, save, wide, post rebound, defender block | Keeper landing, visible held/resting ball, celebration or frustration |
| Dribble | Touches and lateral direction changes; defender closes | Escape beyond defender or explicit opponent possession | Attacker celebrates or reacts; opponent carries stolen ball |
| Pass | Approach, backswing, contact | Ground trajectory to teammate or intercepting opponent; receiving foot | Receiver controls and carries, passer responds |
| Tackle | Opponent owns ball; defender accelerates | Physical contact and possession transfer, or foul/fall and loose ball | Clean recovery or referee whistle |
| Training | Cone slalom with controlled touches | Plant, pass and teammate reception | Progress celebration or tired recovery |
| Injury | Running, slowing, stumble/fall, loose ball | Player pauses; medic approaches | Examination, slow recovery or seated aftermath |
| Contract | Club presentation and pen action | Document signing and synchronized handshake | Jersey reveal and photography |
| Trophy | Team waits around captain | Both hands raise trophy above head | Teammate celebration, close view then stadium pullback |
| Bench | Seated player, teammate approaches | Encouragement or patient waiting | Readiness or subdued posture |
| Farewell | Slow walk and fan applause | Wave, pause, deliberate look back | Continued walk and gradual camera pullaway |

All ten scenes are finite. A hero preview may replay externally; career results never loop. Shots last 6.5 seconds, ordinary actions 4–6 seconds and farewell 7.4 seconds. Playback speed scales the shared clock, including sound.

## Shooting geometry and timing

Foot shots retain player ownership until exactly 2100 ms. The active toe equals the ball position at that instant; ownership releases and the trajectory begins from that same point. Header delivery begins unowned and meets the explicit head target at contact. Driven, curled, lofted, close-range, penalty and header specs vary contact location, flight height and curvature without duplicating outcome logic.

At 3500 ms, goal crosses the line; save touches an explicit keeper hand in front of the line; miss passes outside a post; post touches the actual post; block touches an explicit defender foot before the goal. Catches transfer ownership to the keeper. Rebounds and deflections continue visibly. Goals enter the net, deform it locally, fall and remain in the terminal frame. Celebration variants are deterministic from the career seed or may be explicitly selected.

At every shot the camera first frames the approach and goal, tracks the flight and outcome, then opens back toward the attacker. Keyframes use smooth interpolation; impact shake decays over 180 ms. Every important ball position remains within the frame in automated tests.

## Verification and extending

Run `node scripts/test-animation.mjs`. The test bundles the TypeScript modules in memory with the project's existing esbuild, samples all variants and shot primitives, verifies finite values, pure seeking, boundaries, exact contacts and ownership, goal/post geometry, save collision, outcome titles, terminal ball visibility, camera framing, speed and reduced motion. The development animation gallery provides replay, variants, shot types, speed and timeline seeking for visual review.

Add new choreography by extending `AnimationSpec` only when needed, defining time-normalized world paths, and emitting an outcome whose physical result agrees with the narrative. Reuse `arc`, `hermite`, `sampleBall`, `sampleCamera`, impact envelopes and actor targets. Do not add unrelated CSS world movement. Every new physical outcome needs a numerical assertion plus visual review in the gallery.
