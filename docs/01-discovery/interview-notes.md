# Interview notes (condensed)

> **What this is:** what came out of the interviews, including contradictions. These notes set the agenda for the event storming. **Previous:** [stakeholders](stakeholders.md) · **Next:** [event storming facilitation plan](../02-event-storming/facilitation-plan.md).

*Fictional notes for a fictional organisation.*

## What we heard

| # | Source | Statement | What it means for the analysis |
|---|---|---|---|
| N-01 | Booking desk | "Cut-off is 90 minutes. Except for DG, that's the day before. And for the late sailing on Fridays we're more flexible." | There is not one cut-off. The Friday exception has no owner → open question Q-01 |
| N-02 | Booking desk | "When a trailer is already in the terminal, I call the planner and usually it's fine." | Late acceptance already exists, informally, by phone → make it explicit (BR-10) |
| N-03 | Terminal ops | "Inside half an hour before departure, nothing moves. Not even for the CEO." | Hard floor → BR-12 |
| N-04 | Terminal ops | "DG after the DG cut-off is not negotiable. The declaration has gone." | BR-08 |
| N-05 | Commercial | "Our top-20 customers should never get a no from a computer." | Conflicts with N-03/N-04 → hotspot H2 |
| N-06 | EDI team | "Customer X sends the whole booking again for every change. Sometimes twice." | Duplicates and "no real change" → BR-01, BR-02 |
| N-07 | Finance | "We charge a late-amendment fee, but nobody knows who changed it or when." | History is a requirement (US-10); fee flag BR-13 |
| N-08 | Gate supervisor | "The screen at the gate showed the old sailing. The driver had the new one on his phone." | Terminal must be told when a gated-in unit moves → BR-16 |
| N-09 | Booking desk | "If the UK sailing changes, the customer's customs reference no longer matches. They always forget." | Customs warning (BR-14); the customs integration itself is out of scope |
| N-10 | Senior booking agent | "Honestly, the phone is faster. Don't take that away from us." | Keep the agent screen as fast as the phone; agents test in UAT (see [release note](../08-handover/release-note.md)) |

## Contradictions to resolve (not by the analyst alone)

1. **Key accounts vs. hard rules** (N-05 vs. N-03/N-04) → decision for the Product Owner, with operations and commercial in the room.
2. **"Friday flexibility"** (N-01) → is it a rule or a habit? Nobody could name the owner.
3. **Who approves at night?** (N-02) → the planner on duty, but there is no queue today.

---

Previous: [← Stakeholders](stakeholders.md) · Next: [Event storming →](../02-event-storming/facilitation-plan.md)
