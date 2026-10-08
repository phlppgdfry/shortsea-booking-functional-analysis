# Definition of Ready — for stories in this feature

> **What this is:** the checklist a story must pass before the team takes it into a sprint. The analyst prepares stories against it; the team can refuse a story that fails it. **Previous:** [portal API and terminal notification](../06-interfaces/portal-and-terminal.md) · **Next:** [refinement log](refinement-log.md).

| # | Criterion | How we check |
|---|---|---|
| 1 | Story in "As a … I want … so that …", with a real user | read it aloud in refinement |
| 2 | Rules referenced by ID, not rewritten in the story | links to [business rules](../03-analysis/business-rules.md) |
| 3 | Acceptance criteria in Given/When/Then, **including at least one boundary and one negative case** | tester confirms they can test it without asking the analyst |
| 4 | Decision examples added to the executable feature file where the story touches the decision table | `node --test` runs; new rows fail before development, pass after |
| 5 | Data needed is in the [logical data model](../05-models/logical-data-model.md) or the gap is named | developer confirms |
| 6 | Interfaces touched are described ([EDI](../06-interfaces/edi-amendment.md), [portal/terminal](../06-interfaces/portal-and-terminal.md)) | developer confirms |
| 7 | Mock-up attached if a screen changes | [mock-ups](../04-backlog/mockups.md) |
| 8 | Open questions answered, or explicitly parked with an owner | none in "open" without owner |
| 9 | Support impact noted (new message, new reason code, new KB entry) | line in the [release note](../08-handover/release-note.md) draft |
| 10 | Estimated by the team; fits in one sprint | planning poker |

## Definition of Done (analyst's part)

- Business rules page and feature files reflect what was built (living documentation).
- Release note and KB article updated.
- Support handover done for every story that changes customer-facing behaviour.

---

Previous: [← Portal API and terminal notification](../06-interfaces/portal-and-terminal.md) · Next: [Refinement log →](refinement-log.md)
