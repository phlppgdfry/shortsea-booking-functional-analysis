# Business rules — sailing-change amendments

> **What this is:** every rule that decides what happens to a sailing-change request, with an ID, owner and example. Stories and tests refer to these IDs instead of repeating the rule. **For:** developers, testers, support and the business owners of each rule. **Previous:** [functional analysis](functional-analysis.md) · **Next:** [story map](../04-backlog/story-map.md).

The rules are implemented once in [`site/assets/amendment-rules.mjs`](../../site/assets/amendment-rules.mjs) and checked by the acceptance examples in [`amendment-decision.feature`](../04-backlog/features/amendment-decision.feature). Try them in the [rule checker](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/checker/).

## Parameters *(illustrative assumptions — not real company data)*

| Parameter | Value | Owner | Used by |
|---|---|---|---|
| Standard cut-off (unaccompanied trailer) | 90 min before departure | Terminal operations | BR-06 |
| Dangerous-goods cut-off | 1 440 min (24 h) before departure | Terminal operations (DG officer) | BR-06 |
| Loading closed | 30 min before departure | Terminal operations | BR-12, BR-18 |
| Late-fee window | 1 440 min (24 h) before the **current** departure | Finance | BR-13 |

Cut-off eligibility and the fee window are measured from **receipt of the request**: the portal or agent screen submit time, or the EDI gateway receipt time (not the timestamp inside the message — decided in [refinement](../07-delivery/refinement-log.md), Q-03).

**Execution safety uses the current time and current operational facts.** Immediately before applying an automatic decision or approving a pending request, recheck booking status, unit status, target sailing status and available/held capacity. At exactly T-30 or later, no request can be applied or approved. A pending request expires at T-30. An early gateway receipt never permits execution after loading closes. Hold/reserve capacity and move the booking atomically. These are fictional design assumptions requiring operations, capacity planning and developer validation.

## Rules

| ID | Rule | Owner | Example |
|---|---|---|---|
| BR-01 | A request whose channel message reference was already processed is ignored; the first answer is sent again. No new amendment is created. | IT / EDI team | Customer system sends message 4711 twice → second one gets the same confirmation |
| BR-02 | A request that asks for the sailing the booking is already on is "no change". No amendment, no fee. | PO | EDI "replace" with identical content |
| BR-03 | Only sailings on the **same route** can be requested. A route change is a cancellation plus a new booking. | Commercial | BE-UK East → BE-IE: rejected, reason ROUTE_CHANGE |
| BR-04 | Bookings that are cancelled, or whose unit is already loaded, cannot be amended. | Terminal operations | Unit loaded 20 min before departure: rejected |
| BR-05 | The requested sailing must have space. If full, reject and suggest the next sailing on the route with space. | Capacity planning | Requested 22:00 full → suggest 06:00 |
| BR-06 | The cut-off for the requested sailing is 90 min, or 24 h when the unit carries dangerous goods. A request **exactly at** cut-off is on time. | Terminal operations | Request 90 min before departure: on time |
| BR-07 | On time for the requested sailing (BR-06) → **accepted** and applied automatically, in every channel. | PO | Portal request 5 h before departure: accepted |
| BR-08 | After the DG cut-off, a DG unit is **rejected**. No late acceptance, no exceptions. | Terminal operations (DG officer) | DG unit, 10 h before departure: rejected |
| BR-09 | After cut-off, a unit that is **not in the terminal** is **rejected**. | Terminal operations | Trailer still on the road, 60 min before departure: rejected |
| BR-10 | After cut-off, a unit that **is gated in**, more than 30 min before departure at evaluation → **pending approval** by terminal operations. Space on the requested sailing is held while pending. | Terminal operations | Gated-in trailer, 60 min before departure: pending |
| BR-11 | Key accounts get **priority** in the approval queue. They are never approved automatically. | PO (decision D-02) | Key account, 45 min before departure: pending, top of queue |
| BR-12 | At or after loading closure (30 min or less before the requested departure **at execution time**), every new request is **rejected**. Pending requests cannot be approved. Recheck before the booking commit. This is checked before capacity and cut-off. | Terminal operations | 29 min before departure: rejected, even for a key account |
| BR-13 | If receipt is less than 24 h before the booking's **original/current-at-request** departure (or after it), preview a late-amendment fee (LAF). Post it only after successful booking commit; rejected/expired/superseded requests post no fee. The fee is calculated in the ERP. | Finance | Trailer missed its sailing, rolled to the next one: fee flagged |
| BR-14 | If the route crosses a customs border and the booking has a customs reference, the customer is warned that the reference must be updated. The amendment is not blocked. | PO (decision D-04) | BE → UK sailing changed: warning shown and sent |
| BR-15 | A new request on a booking with a pending request supersedes the pending one. Only the newest request is decided. | PO | Customer asks for 18:00, then 20:00 while 18:00 is pending → 18:00 superseded |
| BR-16 | When an applied amendment moves a gated-in unit, a durable terminal notification is queued with the booking commit and delivered asynchronously. | Terminal operations | Gated-in trailer moved to the 22:00 sailing: gate and loading list update when delivery succeeds |
| BR-17 | The channel (portal, EDI, booking agent) never changes the outcome. Only the form of the response differs. Agents cannot override a rejection. | PO | Same request by phone and portal: same answer |
| BR-18 | A pending request expires when loading closes for the requested sailing (BR-12). Expired = rejected, with reason APPROVAL_EXPIRED. | Terminal operations manager (D-05) | Nobody decided by T-30 min: customer informed it expired |

## Decision table — outcome of a sailing-change request

Evaluated top to bottom; the first matching row wins. "–" means "does not matter".

| # | Duplicate ref | No change | Same route | Booking active & unit not loaded | Min. to requested departure | Space | DG | Unit gated in | Outcome | Reason | Rule |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | yes | – | – | – | – | – | – | – | Duplicate ignored | DUPLICATE_MESSAGE | BR-01 |
| 2 | no | yes | – | – | – | – | – | – | No change | NO_EFFECTIVE_CHANGE | BR-02 |
| 3 | no | no | no | – | – | – | – | – | Rejected | ROUTE_CHANGE | BR-03 |
| 4 | no | no | yes | no | – | – | – | – | Rejected | NOT_AMENDABLE | BR-04 |
| 5 | no | no | yes | yes | ≤ 30 now | – | – | – | Rejected | LOADING_CLOSED | BR-12 |
| 6 | no | no | yes | yes | > 30 now | full | – | – | Rejected | NO_CAPACITY | BR-05 |
| 7 | no | no | yes | yes | ≥ cut-off (BR-06) | space | – | – | **Accepted** | BEFORE_CUTOFF | BR-07 |
| 8 | no | no | yes | yes | receipt < cut-off; now > 30 | space | yes | – | Rejected | DG_CUTOFF_PASSED | BR-08 |
| 9 | no | no | yes | yes | receipt < cut-off; now > 30 | space | no | no | Rejected | CUTOFF_PASSED | BR-09 |
| 10 | no | no | yes | yes | receipt < cut-off; now > 30 | space | no | yes | **Pending approval** | LATE_ACCEPTANCE | BR-10 |

Rows 7–10 require current remaining time > 30. Their cut-off comparisons use the remaining time at receipt. Duplicate/no-change rows perform no booking change.

Flags added to rows 7 and 10: `LATE_FEE` (BR-13), `CUSTOMS_REF_UPDATE` (BR-14), `TERMINAL_NOTIFY` (row 7 with a gated-in unit, BR-16; for row 10 the terminal is notified on approval), `PRIORITY` (row 10 for key accounts, BR-11).

## Why rows are in this order

- Duplicates and "no change" first: they are not decisions, and they must never create a fee (D-03).
- Loading closed (row 5) before capacity: a full sailing that closes in 10 minutes should say "closed", which is the reason the customer can act on.
- Cut-off last: it is the only rule with a human decision behind it (row 10).

---

Previous: [← Functional analysis](functional-analysis.md) · Next: [Story map →](../04-backlog/story-map.md)
