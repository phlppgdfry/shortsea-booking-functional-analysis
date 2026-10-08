# 5-minute walkthrough

> A guided path through the case, for an interview or for a reader on their own. Times are a guide.

| # | Time | Say | Show |
|---|---|---|---|
| 1 | 0:30 | "Trailers move to other sailings through four channels with four sets of rules. Result: wrong sailings, phone calls, no history." | [site: the challenge](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/#challenge) |
| 2 | 0:45 | "I started with interviews. The interesting part was where people contradicted each other: five cut-offs, key accounts vs. hard limits, EDI re-sends." | [interview notes](../../docs/01-discovery/interview-notes.md) N-01, N-05, N-06 |
| 3 | 0:45 | "Event storming made those contradictions visible as hotspots. I prepared the options; the owner decided. Key accounts: priority, not automatic approval." | [board](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/event-storming/) → [hotspot H2](../../docs/02-event-storming/outcomes.md) |
| 4 | 0:45 | "Everything comes together in one decision table that every channel uses. The row order is a design decision." | [business rules](../../docs/03-analysis/business-rules.md#decision-table--outcome-of-a-sailing-change-request) |
| 5 | 0:45 | "Let me show it: trailer in the terminal, 60 minutes before departure → pending approval. Same request via EDI, sent twice → the second is ignored." | [rule checker](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/checker/) |
| 6 | 0:45 | "The stories refer to the rules; the examples in the acceptance criteria run as tests. A developer's question about state, the state machine; about data, the ERD." | [feature file](../../docs/04-backlog/features/amendment-decision.feature), [state machine](../../docs/05-models/state-machine.md) |
| 7 | 0:30 | "And it's not done until support can explain it: this KB article tells first line what is a rule and what is a bug." | [KB article](../../docs/08-handover/kb-article.md) |

## Likely follow-up questions

- *Why event storming and not BPMN first?* — The disagreement was about *what happens*, not about the order of tasks. Events surface that faster; the process model came after.
- *Why did you write code as an analyst?* — I didn't build the feature. The small rule module shows the rules are unambiguous: if I can't make an example fail or pass, the rule is not ready for a developer.
- *What is the riskiest assumption?* — A-02: that the terminal status of a unit is reliable in near real time. If it is not, late acceptance becomes unsafe; that is why EX-7 treats "unknown" as "not in the terminal".
