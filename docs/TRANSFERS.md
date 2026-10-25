# Transfer decisions and club simulation

The player receives five guaranteed opportunities at ages **16, 18, 22, 27, and 33**. A conditional bench/contract negotiation may add one more. These windows occupy the existing 20-decision schedule, preserving the short career format. Accepting a move is optional; staying is a strategic choice.

| Age | Event ID | Dilemma |
| --- | --- | --- |
| 16 | `academy_club` | Academy training and prestige versus minutes, continuity, and schooling |
| 18 | `professional_contract` | Two Indonesian professional contracts versus the Surya Kota senior pathway |
| 22 | `professional_pathway` | Playing responsibility versus earned domestic, Asian, or European opportunity |
| 27 | `prime_transfer` | Higher ambition and salary versus established role and continuity |
| 33 | `retirement_crossroads` | Final challenge, hometown return, or a veteran renewal |

`professional_bench` and `retirement_last_offer` are the optional windows. At most one is selected in a new career. Existing authored content and IDs remain present, including all 50 original stories; two additional events supply the academy checkpoint and a match set-piece dilemma.

## API

```ts
const decision = getOfferDecision(career); // TransferDecision | undefined
const offers = getTransferOffers(career);  // two offers + one stay, or []
const event = getEvent(career);            // exact materialized offer choices
const committed = choose(career, offers[0].id);
const clubSpells = getClubHistory(committed);
```

An offer has `id`, `clubId`, `kind`, annual `salary`, `playingTime`, `role`, `development`, `pressure`, `description`, initial `trust`, and reputation change. Club records provide the crest, colors, country, region, league, prestige, training, and tier. The UI passes the explicit offer ID; it does not ask the engine to choose an unspecified ambitious club afterward.

`transferDecision` is generated once on entering the window. Offer generation consumes no mutable random draw: bounded seeded interest uses the player and club state at that checkpoint. The decision is serialized along with the career. Reading it and refreshing preserve the actual offers. `transferDecisionLog` records the same offers and selected ID; `contract` supplies actual annual earnings and negotiated role. `choose` and `advance` remain immutable and idempotent.

## Eligibility and consequences

All new players begin at Cakrawala Junior in Surabaya. Academy transfers at 16 remain youth education; the first professional contract at 18 is always Indonesian. Overseas development requires age 21+, actual professional playing history, ability, potential, reputation, acceptable recent form, trust, and health. European mid-tier and elite sides require stronger records; elite entrants must be at least 23. Position needs and stable scouting variation avoid a single forced destination.

The 32-club catalog has three academies, eight modest/top domestic professional sides plus two domestic contenders, three Asian clubs, seven European development sides, three European mid-tier sides, and six elite sides. The original 16 IDs and display names are preserved. All identities and procedural crests are fictional; the data does not claim trademark registration or official affiliation.

Facilities, minutes, salary, prestige, and pressure have separate values. Strong Indonesian facilities can exceed those of a European development side. The offered salary is used for subsequent season earnings; minutes affect appearances and development; club difficulty affects form; form and trust adjust later minutes; club tier and performance affect visibility and trophies. A smaller club can offer a better role, while a strong European project can provide visibility and facilities at the cost of competition.

Transfers record source, destination, and age. Season rows keep the club actually represented during each year. `getClubHistory` groups contiguous spells, so returning to an earlier club produces a separate spell and every appearance, goal, assist, defensive action, clean sheet, trophy, and award still sums exactly to career totals. Youth clubs appear through actual timeline entries rather than fabricated professional statistics.

## Compatibility

The storage key remains `kicktale_save_v1` and `version` remains `1`; revision-2 data is optional. Original completed choice IDs, current event IDs, names up to the old 28-character limit, and already committed endings are accepted. A historical v1 career that reached Europe at 18 remains valid. New career eligibility rules govern future opportunities and never rewrite old season rows.

When an old active transfer event is loaded, it receives concrete persisted offers for that same event. It can then continue using the new explicit IDs. Saves with malformed nested data, unknown clubs, invalid offer structures, inconsistent history, or incorrect season totals are rejected without deletion.

## Verification

Run `node scripts/test-transfers.mjs` and `node scripts/test-engine.mjs`. The transfer suite completes 640 careers across four player strategies and all four positions, saves/reloads every offer, verifies five or six club decisions and all five guaranteed ages, checks first-professional geography and earned elite eligibility, and continues four genuine original-engine save fixtures. The engine suite completes 1,771 policy careers and proves all eight endings through legal histories. See [ENGINE-VERIFICATION.md](./ENGINE-VERIFICATION.md) for the observed matrix and reproducible ending routes.
