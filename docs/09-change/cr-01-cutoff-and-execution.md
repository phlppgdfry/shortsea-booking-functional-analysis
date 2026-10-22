# CR-01 — a safe 60-minute cut-off pilot

Status: proposed change in a fictional case, 2026-10-17. v1 (90 minutes) remains the baseline. v2 (60 minutes) is an explicit pilot option; no real operational approval or pilot result is claimed.

## Need, scope and decision

Booking agents want fewer calls for standard trailers received 60–89 minutes before the requested sailing. Compare doing nothing, reducing the cut-off on one pilot route, and adding staff. Propose the limited pilot: same-route standard cargo only. Dangerous goods retain 24 hours; operational closure remains T-30. Terminal operations and the PO must validate the 30-minute execution margin before activation. Suspend v2 for new requests if safety indicators fail.

## Change impact and acceptance

| Artefact | Before → after | Acceptance evidence |
|---|---|---|
| BR-06/07 | 90-minute standard cut-off → versioned 90/60-minute policy | T-75 pending under v1, accepted under v2; boundary at T-60 inclusive |
| Stories | US-01/04 automatic vs approval paths; add US-12 below | shared rule checker and version tests |
| State model | same states, different entry into Pending | approval of a v1 request remains v1 after v2 activation |
| Data model | add ruleVersion, bookingRevision, statusObservedAt and reservation | delivery simulation records version/revision per commit |
| Portal/agent screens | show rule version and distinguish Unknown from Not arrived | checker plus four-frame flow in design/ |
| Interfaces | request identity + expected booking revision; version pinned server-side | duplicate, stale version and last-slot tests |
| Support | unknown/stale status, mismatch replay, pilot stop conditions | recovery runbook below |
| Tests | new boundary, concurrency, recovery and gate examples | tests/delivery-model.test.mjs |

### US-12 — explain and preserve a versioned decision

As a booking agent I can see the rule version and receipt-time cut-off so that I can explain the decision after a policy change.

- Given v1 at receipt and T-75, when v2 activates, then the pending request remains v1 and needs terminal approval.
- Given a new standard request under v2 at exactly T-60, then it is accepted if execution safety permits; T-59 requires approval for a gated-in unit.
- Given dangerous goods, then both versions retain the 24-hour boundary.
- Given UNKNOWN or an observation older than 5 minutes, then reject with TERMINAL_STATUS_UNKNOWN or TERMINAL_STATUS_STALE, keep the old booking and show a recovery action.
- Given two requests for the last slot, only one may hold/consume it; expiry frees it once.
- Given a stale expected booking revision, reject BOOKING_CHANGED and reload; do not silently overwrite.

## Rule additions and model changes

**BR-19:** terminal observation must be known and at most 5 minutes old, inclusive. UNKNOWN is distinct from NOT_ARRIVED. A known LOADED status remains a hard refusal. Production must supply the observation timestamp from the trusted TOS feed and recompute age at execution; the checker defaults to a fresh observation for demonstration.

**BR-20:** pin the immutable ruleset at trusted receipt. Record its version on Amendment and audit history. Pending requests keep their version; current loading closure, unit status and capacity are always rechecked. A policy rollback stops v2 intake; pending v2 requests are not silently reclassified. A safety emergency may explicitly cancel them, release holds, notify requesters and record the operator/reason.

**BR-21:** hold capacity once for Pending; release once on expiry, refusal or supersession. Commit capacity, booking revision, history and outbox as one transaction. Production uses row locks or compare-and-swap; the synchronous in-memory simulation demonstrates the observable contract and does not prove distributed transaction safety.

```mermaid
sequenceDiagram
  actor A as Agent
  participant B as Booking
  participant T as Terminal feed
  participant O as Outbox
  A->>B: request(id, expectedRevision)
  B->>B: pin ruleVersion at receipt
  B->>T: current status + observedAt
  alt unknown or stale
    B-->>A: refuse with recovery action; booking unchanged
  else valid
    B->>B: atomic reserve or commit; compare revision
    B->>O: enqueue only with successful commit
    B-->>A: Pending or Applied; delivery state separate
  end
```

Logical extensions: Amendment.ruleVersion, Amendment.expectedBookingRevision; Booking.revision; TerminalObservation(status, observedAt, source); Reservation(amendmentId, targetSailing, expiresAt, state); Notification(bookingRevision, targetSailing, attempts). Persist rule parameters with their version. Terminal consumers reject a lower booking revision; idempotency is scoped by booking, channel and external reference. The reference model assumes one slot per trailer; real lane-metre reservations require the same atomic invariant with actual demand.

## Support recovery: booking applied, terminal disagrees

1. Look up amendment ID, booking revision and delivery status. Never resubmit the booking change to repair delivery.
2. For UNKNOWN/STALE refresh the TOS observation; if unavailable contact terminal IT and explain the booking has not changed. A new request gets a new message reference and is re-evaluated against current safety conditions.
3. Reconciliation compares the latest committed booking revision with the terminal's observed sailing AND revision. Unknown terminal state is a mismatch, not proof of success.
4. Retry delivery with the same amendment ID and revision. After three failures the simulation marks Failed; support investigates. A successful send is not proof of terminal application: read back and compare.
5. Suppress obsolete outbox entries when a newer booking revision exists. Replay only the latest snapshot. Clear the mismatch after read-back agrees; record operator, time and evidence. Terminal gate warnings remain until that check succeeds.
6. At any safety incident or unresolved mismatch, stop pilot intake and follow the existing rollback plan. Committed bookings remain; reconcile them individually.

## Pilot decision, with illustrative observations

Baseline phone share: 35% (case assumption). Proposed evaluation: at least 100 requests, phone share strictly below 10%, zero wrong-sailing incidents and zero unresolved mismatches. Counts use all pilot amendment requests, including refusals; deduplicate retries. Measure over one complete proposed pilot week before a GO decision; include peak/off-hours and report sample limits. The automated gate verifies explicit windowDays ≥ 7 and complete=true. In addition require ≥90% successfully applied requests, ≤5% refused, ≤5% abandoned, P95 receipt-to-commit cycle ≤10 minutes, and total support recovery effort ≤0.25 minutes per request. Successful + refused + abandoned must equal all unique requests; pending cases mean the window is incomplete. The cycle sample must cover every successfully applied request in that window; report refusals and abandonment separately. These are proposed pilot thresholds, not measured baselines.

| Demo observations | Decision | Action |
|---|---|---|
| 200 requests: 180 applied / 10 refused / 10 abandoned; 12 phone; P95 5 min; recovery 20 min; complete 7 days, no safety findings | GO | propose wider rollout, subject to ops approval |
| 200 requests, 20 phone, no safety findings | ADJUST | target not reached; inspect reasons, repeat pilot |
| 99 requests, no findings | EXTEND | insufficient sample |
| any wrong-sailing incident or unresolved mismatch | ROLL_BACK | stop v2 intake, reconcile applied bookings |

These are fixture scenarios, not measured customer results. The delivery lab evaluates the same gate as the tests. Rollback is an operational decision with an owner, not permission to undo valid bookings automatically.

## Ownership exercise

Without AI: change v2 to 70 minutes, predict T-69/T-70/T-71, update one criterion, run tests, explain why DG/closure do not move, and diagnose a stale terminal notification. Record your actual diff and explanation. No ownership score is granted by generating this exercise.

Reference naming: `BookingSimulation.version` maps to Amendment.ruleVersion; `expectedRevision` maps to expectedBookingRevision. Callers supply current terminal-status observations at approval. The fixture supplies a fresh status by default; it does not connect to a feed.

## P1/P2 verification — 2026-10-22

The simulation has one monotonic minute clock. Each amendment records receivedAt and observedAt; approval derives elapsed processing time and status age from those timestamps. Advancing the clock expires pending holds at T-30 without an approval call. A unit-status value alone does not refresh the observation: supply a new trusted observation age explicitly. The pure checker retains its documented fresh-fixture default; the simulation ages that snapshot automatically. Identity and receipt/version remain immutable.

Notification SENT means transport accepted the message, not that the terminal applied it. The independently stored terminal snapshot includes sailing and revision. Delivery can be received but unapplied. Reconciliation marks a latest-revision mismatch replayable even after SENT, and a replay clears it only after actual read-back matches. Older revisions cannot overwrite the simulated terminal. The lab demonstrates both transport failure and successful transport without application.

Missing/unknown capacity, invalid channel/tier/status enums and non-boolean business flags fail closed with INVALID_REQUEST. UNKNOWN remains a valid terminal-status value with its own operational refusal.

Pilot fixtures also demonstrate no calls with 180 refusals (ADJUST) and an incomplete window (EXTEND). All four non-safety service metrics are evaluated alongside phone share, never inferred from a reduction in calls. Tests: tests/delivery-model.test.mjs; interactive evidence: delivery-lab/.

Executed verification on 2026-10-22: all 72 Node tests passed. Desktop (1366px) and mobile (390px) checks exercised both rule versions, the last-slot race, automatic clock expiry, stale/refreshed observations, SENT-but-unapplied recovery with revision read-back, and all six pilot fixtures. No JavaScript errors or axe WCAG A/AA violations occurred in those lab checks. Relative links pass. All terminal observations, capacity and pilot measurements are simulated.
