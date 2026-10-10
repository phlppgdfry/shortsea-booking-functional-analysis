# Technical review

Read [rules](../docs/03-analysis/business-rules.md), [data ownership](../docs/05-models/logical-data-model.md), [EDI behaviour](../docs/06-interfaces/edi-amendment.md) and [terminal delivery](../docs/06-interfaces/portal-and-terminal.md).

The rule checker consumes current status/capacity plus elapsed time. Approval revalidates those facts. The demo does not implement concurrency, real capacity holds, a durable outbox or partner messages. Developers must implement atomic guards and transactions, scope idempotency keys to the customer/channel and reject reuse with different payloads, preserve ordering/version checks, and reconcile lost notifications.

Tests cover 27 decision examples plus execution/state checks. Planned integration/UAT verifies real transactions and delivery. Security needs authenticated user identity, booking ownership checks, agent/approver separation and audited parameter changes.

[Tests](../tests/) · [Release plan](../docs/07-delivery/release-plan.md) · [Evidence](../EVIDENCE.md)
