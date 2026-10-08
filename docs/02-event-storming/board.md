# Event storming — the board

> **What this is:** the result of the process-level session as a readable timeline. The visual board is on the [case site](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/event-storming/). **Previous:** [facilitation plan](facilitation-plan.md) · **Next:** [hotspots and decisions](outcomes.md).

## Timeline

| # | Actor / trigger | Command | Domain event(s) | Policy | Read model / external system | Hotspot |
|---|---|---|---|---|---|---|
| 1 | Customer (portal), EDI partner system, booking agent | Request amendment | **Amendment requested** | — | EDI gateway | H3 duplicates |
| 2 | — | — | **Duplicate message ignored** | *Whenever the same message reference arrives again, re-send the first answer* | Channel message log | H3 |
| 3 | — | Evaluate amendment | **Amendment evaluated** | — | Sailing capacity · cut-off times · unit terminal status | H1 which cut-off? |
| 4a | — | — | **Amendment accepted** | *Whenever accepted, move the booking* | — | — |
| 4b | — | — | **Amendment rejected** | *Whenever rejected, tell the requester why and suggest a sailing* | Next sailing with space | — |
| 4c | — | — | **Late acceptance requested** | *Whenever late acceptance is requested, hold the space and queue it for the terminal* | Approval queue | H2 key accounts |
| 5 | Terminal ops planner | Approve / decline late acceptance | **Late acceptance approved** / **declined** | — | Yard status, loading progress | H5 who approves at night? |
| 6 | Clock | — | **Late acceptance expired** | *Whenever 30 min before departure is reached, expire pending requests* | — | — |
| 7 | — | — | **Booking moved to sailing** | *Whenever a gated-in unit moves, notify the terminal* | TOS (gate, loading list) | — |
| 8 | — | — | **Terminal notified** | — | TOS | — |
| 9 | — | — | **Customs reference warning raised** | *Whenever the sailing changes on a customs-border route, warn the customer* | Customs platform (not integrated) | H4 |
| 10 | — | — | **Late fee flagged** | *Whenever applied within 24 h of the original departure, flag the fee* | ERP billing | H6 fee waivers |
| 11 | — | — | **Customer notified** | — | Portal, e-mail, EDI gateway | — |

## What changed on the board during the session

- "Booking changed" was split into *Amendment requested*, *Amendment evaluated* and *Booking moved to sailing*. The old system did all three in one step, which is why there was no history.
- The developer proposed **Amendment** as its own concept, separate from Booking. That became the core of the [data model](../05-models/logical-data-model.md).
- The tester added the clock as an actor (event 6): nobody had thought about requests that wait too long.

---

Previous: [← Facilitation plan](facilitation-plan.md) · Next: [Hotspots and decisions →](outcomes.md)
