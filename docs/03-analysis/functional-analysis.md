# Functional analysis — sailing-change amendments (release 1)

> **What this is:** the functional description of the feature the team builds in release 1: what the system does, for whom, in which order, and what happens when things go wrong. Business rules are referenced by ID, not repeated. **For:** developers, testers, the Product Owner and support. **Previous:** [hotspots and decisions](../02-event-storming/outcomes.md) · **Next:** [business rules](business-rules.md).

## 1. Summary

A customer, an EDI partner system or a booking agent can ask to move one unaccompanied trailer to another sailing on the same route. The system decides with one set of rules ([BR-01 … BR-18](business-rules.md)), applies the change or routes it to terminal operations for approval, and informs the customer, the terminal and finance. Every request is kept as an **amendment** with its outcome, so the booking has a history.

## 2. Actors

| Actor | Role in this feature |
|---|---|
| Customer (portal user) | requests a sailing change, sees outcome and history |
| EDI partner system | sends amendment messages, receives acknowledgements and confirmations |
| Booking agent | requests on behalf of a customer (phone, e-mail); sees outcome, history, script line |
| Terminal ops planner | approves or declines late acceptances in the approval queue |
| Clock | expires pending requests (BR-18) |
| TOS (gate, loading list) | receives "unit moved" for gated-in units (BR-16) |
| ERP (billing) | receives the late-fee flag (BR-13) |

## 3. Preconditions

- The booking exists and belongs to the requesting customer (portal/EDI) or is opened by an authorised agent.
- Sailing schedule, space left per sailing and unit terminal status are available (assumptions A-01, A-02 in [context](../01-discovery/context.md)).

## 4. Main flow — request before cut-off

1. The requester selects (portal/agent) or sends (EDI) the booking and the requested sailing.
2. The system records the request with channel, channel message reference and receipt time.
3. The system checks duplicates and "no change" (BR-01, BR-02).
4. The system evaluates the request with the decision table ([business rules](business-rules.md#decision-table--outcome-of-a-sailing-change-request)).
5. Outcome **accepted** (BR-07): the booking moves to the requested sailing; the old space is released.
6. The system adds flags: late fee (BR-13), customs warning (BR-14), terminal notification (BR-16).
7. The system informs the requester in the channel's form (BR-17), the terminal if the unit is gated in, and finance if a fee is flagged.
8. The amendment appears in the booking history with requester, channel, times, outcome and reason.

## 5. Alternative flows

| ID | Condition | Flow |
|---|---|---|
| AF-1 | After cut-off, unit gated in, ≥ 30 min to departure (BR-10) | Amendment becomes **pending approval**; space is held; the request appears in the terminal approval queue, key accounts on top (BR-11); the requester gets "pending" with the expiry time |
| AF-2 | Planner approves | Booking moves (step 5–8); terminal notification at approval time |
| AF-3 | Planner declines | Amendment rejected with the planner's reason; held space released; requester informed |
| AF-4 | Nobody decides before loading closes | Amendment **expired** (BR-18), treated as rejected; requester informed |
| AF-5 | New request while one is pending | The pending one is **superseded** (BR-15); the new one is evaluated from step 2 |

## 6. Exception flows

| ID | Situation | Behaviour |
|---|---|---|
| EX-1 | Duplicate EDI message reference (BR-01) | No new amendment; the first response is sent again |
| EX-2 | Full re-send without a real change (BR-02) | No amendment; positive acknowledgement only |
| EX-3 | Requested sailing full (BR-05) | Rejected; next sailing with space suggested |
| EX-4 | Different route (BR-03) | Rejected; message explains cancel + rebook |
| EX-5 | Unit loaded or booking cancelled (BR-04) | Rejected |
| EX-6 | TOS notification fails | Amendment stays applied; notification retried; after 3 failed attempts *(illustrative)* an alert goes to Application Support with the booking and unit ID. The gate must not show the old sailing without a warning. |
| EX-7 | Unit status unknown (gate feed down) | Treated as "not gated in" → late requests rejected (BR-09). Safer to refuse than to load a unit we cannot see. Support KB covers the customer question. |

## 7. Information shown per channel

| Information | Portal | Agent screen | EDI |
|---|---|---|---|
| Outcome + plain-language reason | yes | yes + script line | reason code |
| Expiry time (pending) | yes | yes | in interim status |
| Suggested next sailing (no capacity) | yes | yes | no (customer system decides) |
| Customs warning | yes | yes | free-text remark |
| Late fee flagged | "a late-amendment fee applies" | fee code LAF | not sent (invoice) |
| History | own bookings | all bookings | — |

## 8. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | Portal and agent screen show the outcome within 2 s for 95% of requests *(illustrative)* |
| NFR-02 | EDI acknowledgement within 5 min of gateway receipt |
| NFR-03 | Every amendment is kept for 7 years with requester, channel, times, outcome, reason, rules fired *(retention to confirm with finance)* |
| NFR-04 | Rule parameters (cut-offs, windows) changeable by an authorised ops role without a release, with change history |
| NFR-05 | An agent can request amendments for any customer but cannot approve late acceptances (separation of duties) |

## 9. Traceability (one pain point, end to end)

| Pain point | Root cause | Requirement | Story | Rule | Test | Measure *(illustrative target)* |
|---|---|---|---|---|---|---|
| "Trailer sailed on the wrong vessel after a phone change" (incident, N-08) | Gate not told when a gated-in unit moves; phone changes typed manually | Terminal is notified when a gated-in unit moves; agent changes use the same rules | US-07, US-02 | BR-16, BR-17 | AC-07.1, AC-02.1 | Wrong-sailing incidents from amendments: 6/month → 0 |
| "Customers call for every late change" (N-02) | Portal stops 24 h before departure | Portal allows changes up to cut-off; late cases go to a queue | US-01, US-04 | BR-07, BR-10 | AC-01.1, AC-04.1 | Share of amendments by phone: 35% → < 10% |
| "Nobody knows who changed it" (N-07) | Booking overwritten in place | Every request kept as an amendment, with requester and channel | US-10, US-08 | NFR-03, BR-13 | AC-10.1, AC-08.1 | Fee disputes without proof: → 0 |

The full mapping of stories to rules and tests is in the [documentation map](../00-documentation-map.md#traceability).

---

Previous: [← Hotspots and decisions](../02-event-storming/outcomes.md) · Next: [Business rules →](business-rules.md)
