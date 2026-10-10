# Review decisions — time, execution and delivery

> Independent portfolio case study based on a fictional organisation. It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions, not real company data.
> Design proposals dated 2026-10-10. No real stakeholder approval is claimed.

| ID | Problem | Proposal | Alternative and trade-off | Owner to validate |
|---|---|---|---|---|
| D-06 | T-30 could create a pending request and immediately expire it | Loading is closed at exactly T-30. Approval must commit strictly before it. Expiry wins a race. | Inclusive boundary leaves zero decision time. Earlier approval buffer might be safer but needs operational evidence. | Terminal ops + PO |
| D-07 | Gateway receipt time could allow execution after closure | Receipt determines eligibility and fee window. Current time, sailing/unit/booking status and held capacity determine execution. | Processing time for eligibility penalises customers for internal delays. Receipt time for all checks permits unsafe execution. | Ops + EDI team + developers |
| D-08 | Failed notification contradicted Applied | Applied means booking commit and durable notification enqueue. Delivery has its own state. Failed delivery alerts support and reconciliation. | Rollback on delivery failure can undo a valid booking and introduce further inconsistencies. | Developers + support |

## Examples to defend

- Sailing 22:00, closure 21:30. At 21:29 a gated-in trailer can enter approval. At 21:30 a new request is refused and an existing pending request expires.
- EDI received 20:20, processed 21:30: received before the 20:30 standard cut-off, but operationally closed at processing. Refuse without posting a fee. Investigate the internal delay.
- Booking commit succeeds, TOS delivery fails: Applied/Failed. Replay the notification by amendment ID, reconcile terminal state, and make the warning visible. Do not create another amendment.

## Build and validation boundaries

The checker evaluates current inputs and elapsed time. Automated tests cover decisions, approval revalidation and state separation. It has no real gateway, approval queue, reservation database, transaction, durable outbox or TOS. Production developers must implement atomic capacity movement, commit guards, retries and reconciliation. UAT and integration tests remain planned, not executed.

Fee flags on pending requests are previews. The ERP receives a billable flag only after a successful commit. Capacity available at approval includes the request's valid held reservation.

[Rules](business-rules.md) · [State model](../05-models/state-machine.md) · [Release plan](../07-delivery/release-plan.md)
