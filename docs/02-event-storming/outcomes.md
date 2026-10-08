# Event storming — hotspots, decisions and open questions

> **What this is:** what happened to every red sticky. The analyst prepares options; the owner decides. **Previous:** [board](board.md) · **Next:** [functional analysis](../03-analysis/functional-analysis.md).

## Hotspots

| ID | Hotspot | Options prepared | Decided by | Decision | Becomes |
|---|---|---|---|---|---|
| H1 | "Which cut-off?" There are at least five | (a) one cut-off for everything · (b) cut-off per unit type and DG, from one table | Terminal ops + PO | **(b)**, parameters in one place; "Friday flexibility" is a habit, not a rule | BR-06, D-01 |
| H2 | Key accounts always accepted? | (a) auto-accept late for key accounts · (b) same rules, priority in the approval queue · (c) no late acceptance at all | **Product Owner**, with ops and commercial | **(b)**. Reason: (a) puts DG and loading safety at the mercy of a customer tier; (c) moves the problem back to the phone | BR-10, BR-11, D-02 |
| H3 | EDI duplicates and full re-sends | (a) treat every message as new · (b) ignore known message references and drop re-sends without a real change | PO + EDI team | **(b)** | BR-01, BR-02, D-03 |
| H4 | Customs reference tied to the crossing | (a) block the amendment until the reference is updated · (b) warn and flag · (c) integrate with customs | PO | **(b)** now; (c) is a separate backlog item | BR-14, D-04 |
| H5 | Who approves at night? | (a) the planner on duty, through a queue · (b) automatic approval at night | Terminal ops manager | **(a)**, with an expiry so nothing waits forever | BR-18, D-05 |
| H6 | Who can waive the late fee? | — | Finance | **Open** — release 1 only flags the fee | Q-04 |

## Decision log

| ID | Date *(illustrative)* | Decision | Rationale | Consequence |
|---|---|---|---|---|
| D-01 | sprint 1 | Cut-off depends on DG yes/no only; parameters live in one table | Cut-off exceptions in heads caused the inconsistency | Ops can change values without a release (configuration) |
| D-02 | sprint 1 | Late acceptance always needs terminal approval; key accounts get priority | Safety and loading decisions stay with the terminal; commercial gets visibility | Approval queue screen in scope; commercial informed by the PO |
| D-03 | sprint 1 | Message reference + "no effective change" checks before any rule | EDI partner re-sends whole bookings | No duplicate amendments, no duplicate fees |
| D-04 | sprint 1 | Customs: warn, do not block | Blocking would make us responsible for the customer's customs data | Warning text agreed with the booking desk |
| D-05 | sprint 2 | Pending requests expire when loading closes (30 min before departure) | A request without an answer is worse than a "no" | Customer gets an explicit expiry time |

## Open questions

| ID | Question | Owner | Needed by |
|---|---|---|---|
| Q-01 | Is the Friday flexibility a rule? If yes, who owns it? | Terminal ops manager | before release 2 |
| Q-02 | Do pilot EDI customers accept an interim "pending" status (A-03)? | EDI team | sprint 2 refinement |
| Q-03 | Which clock counts for EDI: message timestamp or gateway receipt? | PO + EDI team | **answered** in [refinement](../07-delivery/refinement-log.md): gateway receipt |
| Q-04 | Fee waivers: who, and is the waiver part of the amendment? | Finance | release 2 |

---

Previous: [← Board](board.md) · Next: [Functional analysis →](../03-analysis/functional-analysis.md)
