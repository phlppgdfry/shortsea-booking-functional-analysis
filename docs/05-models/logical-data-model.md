# Logical data model — booking amendments

> **What this is:** the information the feature needs, as entities, attributes and relationships — not tables or columns. The development team decides the physical model. **For:** developers, testers, data and reporting people. **Previous:** [state machine](state-machine.md) · **Next:** [EDI amendment interface](../06-interfaces/edi-amendment.md).

```mermaid
erDiagram
  CUSTOMER ||--o{ BOOKING : places
  ROUTE ||--o{ SAILING : has
  SAILING ||--o{ BOOKING : "currently on"
  BOOKING ||--|| UNIT : carries
  BOOKING ||--o{ AMENDMENT : "is changed by"
  SAILING ||--o{ AMENDMENT : "is requested in"
  CHANNEL_MESSAGE }o--o| AMENDMENT : "creates (0 or 1)"
  AMENDMENT ||--o| APPROVAL_TASK : "may need"
  AMENDMENT ||--o{ NOTIFICATION : triggers

  CUSTOMER {
    string customerId
    string name
    enum tier "STANDARD / KEY_ACCOUNT"
  }
  ROUTE {
    string routeCode "e.g. BE-UK East"
    string originTerminal
    string destinationTerminal
    boolean crossesCustomsBorder
  }
  SAILING {
    string sailingId
    datetime departure
    enum status "OPEN / LOADING_CLOSED / DEPARTED"
    number spaceLeft "lane metres"
  }
  BOOKING {
    string bookingNumber
    enum status "ACTIVE / CANCELLED"
    string customsReference "optional"
  }
  UNIT {
    string unitNumber "trailer ID"
    boolean dangerousGoods
    enum terminalStatus "NOT_ARRIVED / GATED_IN / LOADED"
  }
  AMENDMENT {
    string amendmentId
    enum channel "PORTAL / EDI / AGENT"
    string requestedBy
    datetime receivedAt
    datetime evaluatedAt
    datetime appliedAt "optional"
    datetime targetDeparture
    enum state "see state machine"
    string reasonCode
    string rulesFired "e.g. BR-06, BR-10"
    string flags "LATE_FEE, CUSTOMS_REF_UPDATE, ..."
    string previousSailingId
  }
  CHANNEL_MESSAGE {
    enum channel
    string externalReference "customer message ref"
    string contentHash
    datetime receivedAt
    string responseSent
  }
  APPROVAL_TASK {
    datetime deadline "loading closed"
    boolean priority
    string decidedBy
    datetime decidedAt
    enum decision "APPROVED / DECLINED / EXPIRED"
    string declineReason
  }
  NOTIFICATION {
    enum target "CUSTOMER / TOS / ERP"
    enum status "QUEUED / SENT / FAILED / RETRYING"
    int attempts
  }
```

## Modelling decisions

| Decision | Why | Alternative considered |
|---|---|---|
| **Amendment is its own entity**, the booking only points to its current sailing | History (US-10), fees with proof (BR-13), and pending states (BR-10) all need the request to exist next to the booking. Today's model overwrites the booking. | Audit columns on Booking: loses pending and rejected requests |
| **Channel message is separate from amendment** | Duplicates and "no change" (BR-01, BR-02) must be logged without becoming amendments | Flag on Amendment: would create amendments that are not real |
| `previousSailingId` on Amendment | Answers "where did it come from?" without walking the history | Derive from the previous amendment: fragile when the first booking was never amended |
| `rulesFired` stored | Support can answer "why was this rejected?" by rule ID, matching the [KB article](../08-handover/kb-article.md) | Recompute: rules and parameters may have changed since |
| **Notification state is independent** | A committed booking stays Applied while TOS delivery is queued, retrying or failed. Support sees both states. | Roll back on delivery failure: can undo a valid customer change |
| **Receipt and execution times are separate** | Cut-off eligibility uses receivedAt; execution checks use the current time and actual loading status. | Receipt time for everything: can execute after closure |
| Unit terminal status is **read**, not owned | The TOS is the system of record for gate status (A-02) | Copy into booking: goes stale (that is incident N-08) |

## System of record

| Information | System of record | Used here for |
|---|---|---|
| Sailing schedule, space left | Booking system (capacity module) | BR-05, BR-06 |
| Unit terminal status | TOS | BR-04, BR-09, BR-10 |
| Customer tier | CRM / commercial master data | BR-11 |
| Amendment, approval task | Booking system (this feature) | everything |
| Fee amount | ERP | BR-13 (flag only) |

---

Previous: [← State machine](state-machine.md) · Next: [EDI amendment →](../06-interfaces/edi-amendment.md)
