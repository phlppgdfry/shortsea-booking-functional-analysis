# Pilot, release and measurement plan

> Independent portfolio case study based on a fictional organisation. It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions, not real company data.
> Proposed plan for the fictional operator. No rollout or measured benefit is claimed.

## Readiness and pilot

1. Ops validates D-06/D-07 and checks whether actual loading closure can precede the scheduled T-30.
2. Developers/testers validate atomic reservation and commit, concurrent requests, gateway retries and TOS idempotency.
3. Pilot on one route, with two EDI partners and booking/terminal/finance key users. Confirm interim pending support before enabling EDI late acceptance.
4. Replay anonymised historical patterns in a test environment. UAT-01–16 require recorded results and owner sign-off.
5. Train agents using the KB; terminal planners rehearse expiry and failed delivery. Support rehearses replay and reconciliation.
6. Enable portal/agent first behind a feature flag, then pilot EDI. Review each channel's outcomes before expansion.

## Go / no-go

| Gate | Evidence required | Owner |
|---|---|---|
| Rules | business owners approve time boundaries and fee policy | PO + ops + finance |
| Safety | no loaded-unit moves, overbooking or commits after closure in integration/concurrency tests | developers + tester + ops |
| Delivery | durable notification enqueue and replay demonstrated, support can find failed deliveries | developers + support |
| Users | key users sign UAT and support reviews KB | key users + PO |
| Observability | receipt/evaluation/application times and notification failures visible | support + developers |

## Rollback and hypercare

Disable new requests through the feature flag if safety checks or reconciliation fail. Keep existing committed bookings and audit history. Drain/reconcile pending requests and held reservations with operations. Replay queued notifications after reconciliation. Do not reverse committed amendments simply because delivery failed. Support and ops monitor each pilot shift for three working days (illustrative), with a named incident owner and daily PO review.

## Proposed metrics

| Metric | Illustrative baseline / target | Method | Owner / frequency |
|---|---|---|---|
| Wrong-sailing incidents linked to amendments | 6/month / 0 | link terminal incidents to amendment IDs and compare pilot route exposure | ops / weekly |
| Phone share of amendment requests | 35% / below 10% | unique requests by channel, excluding duplicates; same scope/time window | booking desk / weekly |
| Fees with recorded applied amendments | unknown / 100% | ERP LAF reconciliation to Applied amendments | finance / weekly |
| Internal delay causing closure rejection | unknown / establish baseline | on-time receivedAt plus LOADING_CLOSED at evaluatedAt | EDI + support / daily |
| Failed TOS notifications awaiting reconciliation | unknown / no unresolved critical cases | separate delivery states and alert age | support / each shift |

Targets require a measured baseline and pilot review. Lower phone volume alone does not prove a better process if rejections or safety incidents rise.
