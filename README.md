# Late booking amendments — a functional analysis

**Short-sea RoRo · one feature, from event storming to support handover**

> How a short-sea operator could turn four inconsistent amendment channels into one set of rules that developers can build, testers can test and support can explain.

> *Independent portfolio case study based on a fictional organisation (Tidewell Shortsea Lines). It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions — not real company data.*

**[Live site](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/)** · **[Start here](START-HERE.md)** · **[Evidence matrix](EVIDENCE.md)** · **[Business rules](docs/03-analysis/business-rules.md)** · **[Rule checker](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/checker/)**

## The journey

```text
Discover            interviews, stakeholders, glossary
   ↓
Event storm         timeline, hotspots, decisions by their owners
   ↓
Analyse             functional analysis, business rules + decision table
   ↓
Specify             story map, user stories, Given/When/Then, mock-ups
   ↓
Model               process (swimlanes), state machine, logical data model
   ↓
Interfaces          EDI amendment, portal API, terminal notification
   ↓
Refine & validate   definition of ready, dev/test questions, executable examples, UAT
   ↓
Hand over           release note and first-line KB article for support
```

## The problem

Customers move trailers to other sailings through the portal, EDI, e-mail and phone. Each channel applies different rules: the portal stops 24 hours early, EDI overwrites bookings without checks, and the booking desk works from memory and an Excel sheet. Trailers end up on the wrong sailing, customers call for every late change, and nobody can show who changed what.

## What I did

- **Interviewed** booking desk, terminal operations, commercial, finance and EDI customers, and wrote down the contradictions instead of smoothing them out — [interview notes](docs/01-discovery/interview-notes.md)
- **Planned and documented an event storming** that turned five different "cut-offs" and a key-account conflict into hotspots with owners — [board](docs/02-event-storming/board.md), [hotspots and decisions](docs/02-event-storming/outcomes.md)
- **Wrote one rule set** (18 rules, one decision table) that every channel uses — [business rules](docs/03-analysis/business-rules.md)
- **Specified ten user stories** with Given/When/Then criteria; the 23 decision examples **run as tests in CI** — [user stories](docs/04-backlog/user-stories.md), [feature file](docs/04-backlog/features/amendment-decision.feature)
- **Modelled** the process, the amendment state machine and the logical data model — [models](docs/05-models/process-to-be.md)
- **Described the interfaces** functionally, including duplicate EDI messages and failure paths — [EDI amendment](docs/06-interfaces/edi-amendment.md)
- **Prepared refinement, UAT and the support handover** — [refinement log](docs/07-delivery/refinement-log.md), [KB article](docs/08-handover/kb-article.md)

## What this demonstrates

| Typical functional-analyst requirement | Evidence |
|---|---|
| Functional analyses, user stories, process flows, acceptance criteria | [functional analysis](docs/03-analysis/functional-analysis.md) · [stories](docs/04-backlog/user-stories.md) · [process](docs/05-models/process-to-be.md) |
| Workshops: event storming, refinement | [facilitation plan](docs/02-event-storming/facilitation-plan.md) · [refinement log](docs/07-delivery/refinement-log.md) |
| Business rules and logical data models | [business rules](docs/03-analysis/business-rules.md) · [data model](docs/05-models/logical-data-model.md) |
| Understanding system behaviour and interfaces | [state machine](docs/05-models/state-machine.md) · [EDI interface](docs/06-interfaces/edi-amendment.md) |
| Working with developers and testers | [definition of ready](docs/07-delivery/definition-of-ready.md) · [test scenarios](docs/07-delivery/test-scenarios.md) |
| Guiding application support after release | [release note](docs/08-handover/release-note.md) · [KB article](docs/08-handover/kb-article.md) |

Full mapping, including what is *not* claimed: [EVIDENCE.md](EVIDENCE.md).

## Repository map

| Folder | Contents |
|---|---|
| [`docs/`](docs/00-documentation-map.md) | the functional documentation, numbered along the journey, with a traceability table |
| `docs/04-backlog/features/` | acceptance criteria as Gherkin; the decision examples are executable |
| `site/` | GitHub Pages site: event-storming board, rule checker, mock-ups |
| `site/assets/amendment-rules.mjs` | the business rules as one small module, used by the rule checker and the tests |
| `tests/` | runs every decision example against the rules (`node --test tests/*.test.mjs`) |
| `application-kit/` | one-page summary (EN + NL) and a 5-minute walkthrough |

## Notes on realism and assumptions

All figures, parameters and the organisation are illustrative. Message names are simplified ("IFTMIN-like"). The case deliberately includes the mess a real team would meet: EDI partners re-sending whole bookings, rules that only live in people's heads, commercial and operations wanting opposite things, a legacy model without history, customs references tied to a crossing, and experienced users who prefer the phone. The rule module is there to show that the rules are precise enough to test, not to suggest that an analyst writes the production code.
