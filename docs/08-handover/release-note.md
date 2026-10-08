# Release note (functional) — Sailing-change amendments, release 1

> **What this is:** what changes for users after the release, written for Application Support and key users, not for developers. Support uses it to prepare end-user communication and first-line answers. **Previous:** [test scenarios](../07-delivery/test-scenarios.md) · **Next:** [KB article](kb-article.md).

## In one sentence

Customers, EDI partners and booking agents can now move a trailer to another sailing on the same route **up to that sailing's cut-off**, and later requests for trailers already in the terminal go to terminal operations for approval — with the same rules in every channel.

## What changes, per user group

| Who | Before | After |
|---|---|---|
| Customers (portal) | changes until 24 h before departure, then call | changes until the cut-off of the requested sailing; late requests for trailers in the terminal show "pending" with an expiry time |
| EDI customers | change messages overwrote the booking | changes are checked; you get a confirmation, a rejection with a reason code, or "pending" |
| Booking agents | rules from memory and Excel; typed changes in | same screen logic as the portal; reason and script line shown; **no override** |
| Terminal planners | phone calls for late changes | an approval queue with deadlines; key accounts on top |
| Gate | sometimes the old sailing | updated immediately when a gated-in trailer moves |
| Finance | no history | fee code LAF on late amendments; full history per booking |

## New messages users will see

| Reason code | Customer text (portal) | What the customer can do |
|---|---|---|
| CUTOFF_PASSED | The cut-off for this sailing has passed and your trailer is not in our terminal yet. | choose a later sailing |
| DG_CUTOFF_PASSED | Dangerous-goods bookings must be changed at least 24 hours before departure. | choose a sailing more than 24 h away |
| LOADING_CLOSED | Loading has closed for this sailing. | choose a later sailing |
| NO_CAPACITY | This sailing is full. The next sailing with space is …. | take the suggestion |
| ROUTE_CHANGE | Another route is a new booking. | cancel and rebook |
| NOT_AMENDABLE | This booking can no longer be changed. | contact the booking desk |
| APPROVAL_EXPIRED | The terminal could not confirm your request before loading closed. | choose a later sailing |
| DECLINED_BY_TERMINAL | The terminal could not accept the change: [planner's reason]. | choose a later sailing |

## Known limitations (release 1)

- Changing the trailer, weight or adding dangerous goods: still through the booking desk, as today.
- The late fee is flagged, not calculated; waivers follow the current finance process (open question Q-04).
- Customs references are not updated by us; customers get a warning.

## For the senior booking agents

You keep a fast route: the agent screen asks for booking number and sailing, nothing else. What disappears is the need to remember every exception — and the phone call to the planner, which is now a queue item they answer in their own screen.

---

Previous: [← Test scenarios](../07-delivery/test-scenarios.md) · Next: [KB article →](kb-article.md)
