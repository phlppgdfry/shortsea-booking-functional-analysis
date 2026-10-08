# Test scenarios and solution validation

> **What this is:** how the acceptance criteria turn into tests, who tests what, and how the business validates the result before release. **For:** testers, developers, PO, key users. **Previous:** [refinement log](refinement-log.md) · **Next:** [release note](../08-handover/release-note.md).

## Who tests what

| Level | What | Who | Source |
|---|---|---|---|
| Rule examples (automated) | every row of the decision table, boundaries included | runs in CI on every change | [amendment-decision.feature](../04-backlog/features/amendment-decision.feature) → `tests/amendment-rules.test.mjs` |
| Functional (manual / automated by the tester) | approval queue, expiry, supersede, notifications, history | tester | [late-acceptance.feature](../04-backlog/features/late-acceptance.feature) |
| Interface | EDI responses, duplicate handling with the pilot customer's real message pattern (anonymised) | tester + EDI team | [edi-amendments.feature](../04-backlog/features/edi-amendments.feature) |
| Business validation (UAT) | end-to-end with real people and realistic cases | 2 booking agents (incl. the senior one), 1 terminal planner, 1 finance user | scenarios below |

In this case the decision examples really run: **23 examples + 2 checks** pass in CI against the same rule module the [rule checker](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/checker/) uses.

## UAT scenarios

| ID | Scenario | Who | Expected |
|---|---|---|---|
| UAT-01 | Customer moves a trailer in the portal 5 h before departure | booking agent as customer | applied, no fee, history shows PORTAL |
| UAT-02 | Same change by phone through the agent screen | senior booking agent | same answer as UAT-01; time on screen ≤ phone today |
| UAT-03 | Trailer in terminal, request 60 min before departure | agent + planner | pending in queue; planner approves; gate shows new sailing |
| UAT-04 | Planner does nothing until loading closes | planner | expired; customer informed |
| UAT-05 | DG trailer, request 10 h before departure | agent | rejected DG_CUTOFF_PASSED, no override |
| UAT-06 | Pilot customer re-sends a full booking twice | EDI team | one confirmation, no amendment for the second, no fee |
| UAT-07 | Trailer missed its sailing, rolled to the next | agent | applied, LATE_FEE flagged; finance sees code LAF |
| UAT-08 | UK-bound booking with customs reference changes sailing | agent | applied with customs warning in portal and e-mail |
| UAT-09 | Key account, 45 min before departure, unit in terminal | planner | top of queue, not auto-approved |
| UAT-10 | Requested sailing full | agent | rejected, next sailing with space suggested |
| UAT-11 | Terminal notification fails (simulated) | tester + support | amendment applied; support alerted after 3 attempts |
| UAT-12 | Agent opens history of a booking with 3 requests | finance user | accepted and declined amendments visible; duplicate only in message log |

## Defect example *(fictional)*

| ID | Found in | Description | Severity | Root cause | Fix |
|---|---|---|---|---|---|
| DEF-03 | UAT-07 | Fee flagged when the customer moved to an *earlier* sailing 30 h before the current departure | medium | the fee window was measured against the **requested** sailing instead of the **current** one | rule text clarified (BR-13 "current departure"); row AC-08.2/08.3 added as boundary |

## Exit criteria for release

- All automated examples green; no open defects of severity high.
- UAT-01 … UAT-10 passed and signed off by the PO and one key user per group.
- Release note and KB article reviewed by Application Support.

---

Previous: [← Refinement log](refinement-log.md) · Next: [Release note →](../08-handover/release-note.md)
