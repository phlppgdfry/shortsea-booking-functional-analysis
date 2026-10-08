# User stories — release 1

> **What this is:** the backlog items for release 1, ready for refinement. Each story names its rules and acceptance criteria; the criteria live in the [`features/`](features/) folder and the decision examples run as tests. **For:** the Scrum team. **Previous:** [story map](story-map.md) · **Next:** [process model](../05-models/process-to-be.md).

## Epic E1 — One decision for every channel

### US-01 Change sailing in the portal up to cut-off

**As a** customer using the portal, **I want** to move my trailer to another sailing on the same route until that sailing's cut-off, **so that** I don't have to call the booking desk.

- Rules: BR-03 … BR-09, BR-12, BR-17
- Acceptance criteria: AC-01.1 … AC-01.8 in [amendment-decision.feature](features/amendment-decision.feature)
- Notes: the sailing list only shows sailings on the same route; full sailings are shown but not selectable, with the next free one highlighted (BR-05).
- Mock-up: [portal and agent screens](mockups.md)

### US-02 Agent requests on behalf of a customer

**As a** booking agent, **I want** to submit a sailing change for a customer and get the same outcome the portal would give, **so that** phone and portal never give different answers.

- Rules: BR-17, NFR-05 (no override, no approval of own requests)
- Acceptance criteria: AC-02.1 (decision), AC-02.2 (no override button) in [late-acceptance.feature](features/late-acceptance.feature)

### US-03 EDI amendments follow the same rules

**As an** EDI customer, **I want** my amendment messages to be processed with the same rules and to get a clear response, **so that** my transport management system stays in sync.

- Rules: BR-01, BR-02, BR-17
- Acceptance criteria: AC-03.1 … AC-03.3 (decision); AC-03.4 … AC-03.6 (responses) in [edi-amendments.feature](features/edi-amendments.feature)
- Interface: [EDI amendment](../06-interfaces/edi-amendment.md)

### US-04 Late requests for units in the terminal go to approval

**As** terminal operations, **I want** changes after cut-off for units already in the terminal to come to us for approval, **so that** we never load something we have not agreed to.

- Rules: BR-08 … BR-12
- Acceptance criteria: AC-04.1 … AC-04.6

## Epic E2 — Late acceptance

### US-05 Approval queue with deadline

**As a** terminal ops planner, **I want** a queue of pending requests sorted by deadline, with key accounts marked, **so that** I can decide before loading closes.

- Rules: BR-10, BR-11, BR-15, BR-18
- Acceptance criteria: AC-05.1 … AC-05.5 in [late-acceptance.feature](features/late-acceptance.feature)

### US-06 Customer is told what happens to a pending request

**As a** customer, **I want** to know that my request is pending, until when, and the final outcome, **so that** I can plan my haulier.

- Rules: BR-17, BR-18
- Acceptance criteria: AC-06.1, AC-06.2

## Epic E3 — Consequences of an applied amendment

### US-07 Terminal is notified when a gated-in unit moves

**As** the terminal, **I want** to receive the new sailing for a gated-in unit as soon as an amendment is applied, **so that** the gate and the loading list are right.

- Rules: BR-16; exception flow EX-6 in the [functional analysis](../03-analysis/functional-analysis.md#6-exception-flows)
- Acceptance criteria: AC-07.1; AC-07.2 (retry and alert) in [late-acceptance.feature](features/late-acceptance.feature)
- Interface: [terminal notification](../06-interfaces/portal-and-terminal.md#terminal-notification)

### US-08 Late fee flagged

**As** finance, **I want** late amendments flagged with fee code LAF, **so that** invoicing is correct and provable.

- Rules: BR-13 · Acceptance criteria: AC-08.1 … AC-08.3

### US-09 Customs reference warning

**As a** customer on a customs-border route, **I want** a warning that my customs reference must be updated, **so that** my trailer is not stopped at the border.

- Rules: BR-14 · Acceptance criteria: AC-09.1

### US-10 Amendment history

**As a** booking agent, **I want** to see every amendment of a booking with who, when, channel, outcome and reason, **so that** I can answer "who changed this?" in one look.

- Rules: NFR-03 · Acceptance criteria: AC-10.1 in [late-acceptance.feature](features/late-acceptance.feature)

## INVEST check

| Story | I | N | V | E | S | T | Note |
|---|---|---|---|---|---|---|---|
| US-01 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | depends on the shared decision, built first |
| US-02 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| US-03 | ✓ | ✓ | ✓ | ~ | ✓ | ✓ | estimate depends on Q-02 (pending status for EDI) |
| US-04 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| US-05 | ✓ | ✓ | ✓ | ✓ | ~ | ✓ | could be split: queue first, expiry second |
| US-06 … US-10 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |

---

Previous: [← Story map](story-map.md) · Next: [Process model →](../05-models/process-to-be.md)
