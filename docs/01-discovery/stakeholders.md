# Stakeholders and interview guide

> **What this is:** who is affected by amendments, what each group wants, and the questions I would ask them before any workshop. **For:** the analyst and the Product Owner preparing discovery. **Previous:** [context](context.md) · **Next:** [interview notes](interview-notes.md).

## Stakeholder matrix

| Group | What they want | Pain today | Likely resistance | How I involve them |
|---|---|---|---|---|
| Booking desk (customer service) | fewer calls, clear rules, not being the "bad guy" | rules in their heads and in Excel; customers call for every late change | "On the phone I do this in 30 seconds" | interviews, event storming, UAT testers |
| Terminal operations (planners, gate supervisors) | a hard cut-off, no surprises at the gate, strict DG | late changes they hear about too late; wrong-sailing incidents | fear that the portal opens the door to more late changes | event storming, approval-screen walkthrough |
| Commercial (account managers) | flexibility for large customers | lost goodwill when a key account is refused | "We never refuse our top customers" | event storming, PO decision on hotspot H2 |
| Customers (hauliers, forwarders) | fast answers, also through EDI | no confirmation, have to call | none — but EDI changes cost them effort | 2 pilot EDI customers, portal feedback |
| Finance | correct late fees with proof | no history, disputes | — | short interview, fee flag review |
| Application Support | know what is normal behaviour after release | "is this a bug or a rule?" calls | extra work at go-live | handover session, KB article |
| Developers and testers | unambiguous rules, states and error paths | vague tickets | — | refinement, rule examples as tests |

## Interview guide (45 minutes per group)

**Opening (5 min)** — why we are here; nothing is decided yet; we want to understand your day.

**Booking desk**

1. Walk me through the last late amendment you handled. What did you check, in what order?
2. Where do you look up cut-off times? Are there exceptions you just know?
3. When do you say no? Who do you call when you are not sure?
4. What do customers get angry about?
5. If the portal did this for you, what would you still want to see?

**Terminal operations**

1. What happens at the gate when a unit arrives for a sailing it is no longer booked on?
2. Until when can you still change a loading list in practice? What makes it impossible?
3. Who decides on a late change at night or in the weekend?
4. What is different for dangerous goods?

**Commercial**

1. Which customers get exceptions today, and who grants them?
2. What would happen if a key account were refused once?
3. Would "priority in the queue" be enough instead of "always yes"?

**EDI customers (pilot)**

1. How does your system send a change today: only the changed fields or the whole booking again?
2. Can your system handle an interim "pending" status?

**Closing (5 min)** — what did I not ask that I should have? Who else should I talk to?

---

Previous: [← Context](context.md) · Next: [Interview notes →](interview-notes.md)
