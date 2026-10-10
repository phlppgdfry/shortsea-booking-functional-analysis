# What this case demonstrates

> Mapping from typical **IT functional analyst** requirements (Agile team, logistics/shipping domain) to concrete evidence in this repository.
> **Shown here / not claimed** separates what this case demonstrates from production experience that is not claimed.

| Job requirement | Evidence in this repository | See it in 30 seconds | Shown here / not claimed |
|---|---|---|---|
| Analyse business requirements and operational processes; write functional analyses | [Functional analysis](docs/03-analysis/functional-analysis.md): actors, main/alternative/exception flows, NFRs, traceability | §5–6 of the analysis | Shown: structure and depth of an FA document. Not claimed: this feature was built at a real operator |
| Gather requirements from users with complex needs | [Stakeholders + interview guide](docs/01-discovery/stakeholders.md), [interview notes with contradictions](docs/01-discovery/interview-notes.md) | N-05 vs. N-03 | Shown: how I prepare and record discovery. Notes are fictional |
| User stories and acceptance criteria | [Story map](docs/04-backlog/story-map.md), [10 stories](docs/04-backlog/user-stories.md), [Gherkin criteria](docs/04-backlog/features/) incl. boundaries and negatives | AC-01.2 / AC-01.3 (exactly at vs. one minute after cut-off) | Shown |
| Facilitate event storming and refinement | [Facilitation plan](docs/02-event-storming/facilitation-plan.md), [board](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/event-storming/), [hotspots → decisions](docs/02-event-storming/outcomes.md), [refinement log](docs/07-delivery/refinement-log.md) | hotspot H2 (key accounts) | Shown: the plan and a realistic output. Not claimed: having facilitated this session with real participants |
| Process flows; UML; process modelling | [TO-BE with swimlanes](docs/05-models/process-to-be.md), [UML state machine](docs/05-models/state-machine.md), [UML sequence](docs/06-interfaces/edi-amendment.md#sequence) | state machine | Shown (Mermaid; tool-agnostic) |
| Mock-ups (Figma where useful) | [Low-fidelity mock-ups](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/mockups/) linked to stories | agent view: no override | Shown as HTML wireframes here; I design UI in Figma for my own products |
| Business rules and logical data models | [18 rules + decision table](docs/03-analysis/business-rules.md), [ERD with modelling decisions](docs/05-models/logical-data-model.md) | decision table | Shown |
| Understand system behaviour, data structures and interfaces | [EDI amendment](docs/06-interfaces/edi-amendment.md) (duplicates, replace vs. change, receipt time), [portal & terminal](docs/06-interfaces/portal-and-terminal.md) | duplicate message at the end of the sequence | Shown functionally; message formats simplified |
| Work with developers and testers; solution validation | [Definition of ready](docs/07-delivery/definition-of-ready.md), [refinement Q&A](docs/07-delivery/refinement-log.md), [test scenarios + UAT](docs/07-delivery/test-scenarios.md), **[27 executable examples](tests/amendment-rules.test.mjs) in CI** | rule checker + green CI run | Shown |
| Guide application support after release | [Functional release note](docs/08-handover/release-note.md), [first-line KB article](docs/08-handover/kb-article.md) | "working as designed vs. escalate" table | Shown |
| Agile ceremonies | refinement log, story splitting, DoR/DoD | [story split](docs/04-backlog/story-map.md#how-the-first-big-story-was-split) | Shown as artefacts. Not claimed: years in a professional Scrum team |
| Functional documentation, kept consistent | [Documentation map + traceability](docs/00-documentation-map.md): rules written once, referenced by ID | traceability table | Shown |
| Domain: short-sea / RoRo logistics | [Context](docs/01-discovery/context.md), [glossary](docs/01-discovery/glossary.md) | glossary | Shown from public, generic domain knowledge. Not claimed: work experience at a shipping line |

Review update: [deadline, execution and delivery decisions](docs/03-analysis/review-decisions.md) · [pilot and measurement plan](docs/07-delivery/release-plan.md).
