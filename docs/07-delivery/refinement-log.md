# Refinement log — sprint 1 and 2 *(fictional)*

> **What this is:** the questions developers and testers asked during refinement, the answers, and what changed in the stories as a result. It shows how analysis continues during the sprint, not only before it. **Previous:** [definition of ready](definition-of-ready.md) · **Next:** [test scenarios](test-scenarios.md).

## Questions and answers

| # | Asked by | Question | Answer | Decided by | Changed |
|---|---|---|---|---|---|
| R-01 | Developer | Which time counts for an EDI message: the timestamp in the message or when it reached us? | Gateway receipt time. The customer's clock cannot be trusted, and our own delays must not push a customer past cut-off. | PO + EDI team (Q-03) | BR parameters note; [EDI interface](../06-interfaces/edi-amendment.md#error-handling) |
| R-02 | Tester | A request at *exactly* 90 minutes: on time or late? | On time. "Cut-off is the last moment that is still on time." Same for 30 min (still late window) and 24 h fee window (no fee at exactly 24 h). | Terminal ops | BR-06, BR-12, BR-13; boundary rows AC-01.2, AC-04.3, AC-08.2 |
| R-03 | Developer | Do we hold space while a request is pending? | Yes. Otherwise the planner approves something that no longer fits. | Terminal ops + capacity planning | BR-10; AC-05.1 |
| R-04 | Tester | What if a unit is not in the terminal but the gate feed is down? | Treat as not gated in → late requests rejected. Support explains it (KB). | PO | EX-7; [KB article](../08-handover/kb-article.md) |
| R-05 | Developer | Is a key-account request after cut-off with the unit still on the road also pending? | No. Key accounts only change the queue order (D-02). It is rejected like any other. | PO | AC-04.6 added |
| R-06 | Tester | A "replace" message that changes the sailing **and** the trailer ID? | Sailing change evaluated, unit change rejected with UNIT_CHANGE_NOT_SUPPORTED. Unit changes are release 2. | PO | [EDI interface](../06-interfaces/edi-amendment.md#replace-messages-and-real-changes) |
| R-07 | Developer | Should "loading closed" be checked before or after "sailing full"? | Before. "Closed" is the reason the customer can act on. | Analyst proposal, PO agreed | decision-table order in [business rules](../03-analysis/business-rules.md#why-rows-are-in-this-order) |
| R-08 | Senior booking agent (UAT preview) | Can I still see why something was rejected when the customer calls back tomorrow? | Yes: reason and rules fired are stored on the amendment. | — | `rulesFired` in [data model](../05-models/logical-data-model.md) |

## Story changes after refinement

| Story | Before | After |
|---|---|---|
| "Customer changes booking" | one story, all channels, all rules | split by rule path (see [story map](../04-backlog/story-map.md#how-the-first-big-story-was-split)) |
| US-05 | queue + expiry + supersede in one story | estimate too high: expiry and supersede kept, but marked as candidates to split if the sprint is full |
| US-03 | "EDI amendments" | estimate depends on Q-02 (pending status for EDI); spike with the 2 pilot customers in sprint 1 |

---

Previous: [← Definition of ready](definition-of-ready.md) · Next: [Test scenarios →](test-scenarios.md)
