# Executive case study


> Independent portfolio case study based on a fictional organisation. It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions, not real company data.


## 1. Executive overview

### Challenge and scope

The fictional operator moves unaccompanied trailers between sailings on the same route. Portal, EDI and agents currently follow different rules. Changes can leave the gate on an old sailing and make fee evidence unavailable.

### Role and evidence

The case illustrates functional analysis: simulated discovery, event timeline, rules, stories, acceptance examples, models, interfaces and support handover. It includes 18 rules, 10 stories, 27 executable decision examples and 43 automated checks.

### Limits

All discovery quotes, stakeholder decisions and UAT sessions are fictional. Operational parameters and outcome targets are illustrative. The rule checker has no real booking database, terminal connection or capacity reservation.

### Reading route

Start with the shared decision table, then review D-06/D-07/D-08. Use the checker to discuss T-30 and delayed EDI. Review the state model and release plan for failure and implementation boundaries.

## 2. Discovery and analysis

### Stakeholders

Booking agents want quick answers. Terminal operations need safe loading decisions. Commercial wants key-account service. Finance needs proof of amendments. EDI partners need predictable responses. These are simulated stakeholder perspectives.

### Workshop proposal

An event timeline makes inconsistent cut-offs visible. The analyst prepares options, names unresolved assumptions and identifies owners. In the key-account example, queue priority preserves visibility without granting an automatic safety override.

### Traceability

A reported wrong-sailing scenario becomes a terminal-notification requirement, a story, a rule, an interface, a test and a support instruction. Requirements reference canonical rule IDs rather than copying policy into every document.

### Real-project validation

Observe actual tasks, inspect recent incidents, confirm decision authority and check whether interim pending responses work for real EDI partners. A prepared interview guide alone does not prove facilitation experience.

## 3. Shared rules and time

### One policy

Duplicate and no-change messages cause no booking change or fee. Different routes and non-amendable bookings are refused. Current loading closure takes precedence over available capacity. Cut-off eligibility then chooses automatic acceptance, refusal or terminal approval.

### D-06: one boundary

At exactly T-30, new requests are refused and pending requests expire. Approval must commit strictly before the boundary. The alternative inclusive boundary allowed pending requests with no decision time.

### D-07: two time checks

Receipt time preserves cut-off eligibility. Before execution, recheck actual status, capacity and current time. A 22:00 sailing receives a request at 20:20 but processes it at 21:30: receipt is timely, execution is closed.

### Concurrency

Capacity checks and movement require atomic reservations and commit guards. The checker demonstrates the decision, not a real race-safe transaction. Operations may require an earlier buffer or an earlier actual loading closure.

## 4. State, data and interfaces

### Amendment and booking

Booking stores the current sailing. Amendment stores requests, pending/accepted/rejected outcomes, reason, rules and timestamps. ChannelMessage stores duplicate/no-change receipt information separately.

### D-08: committed change and delivery

Applied means a successful booking commit and durable notification enqueue. Notification status can be queued, retrying, failed or sent. Failed delivery leaves Applied intact and triggers support recovery.

### Interface behaviour

All channels share decisions but present different responses. Gateway receipt remains available through retries. TOS delivery uses amendment IDs to avoid duplicate effects. Real partner messages and technical implementation guides are outside this case.

### Ownership and security

TOS owns gate status, booking owns sailing/capacity, ERP owns fee amount. Authenticated booking ownership and separation between requesting agent and approving planner are required. The technical team must implement transactional enqueue and audited configuration.

## 5. Quality and controlled delivery

### Automated evidence

The custom test parser executes 27 decision-example rows. Sixteen additional checks cover basic coverage/channel consistency, approval revalidation and separate application/delivery status. These are decision tests, not end-to-end shipping tests.

### Planned validation

UAT-01 to UAT-16 include normal requests, expiry, duplicate EDI, delivery failure, exact boundaries, internal delay and changed operational facts. Real reservations, concurrent commits, partner ordering and replay need integration testing.

### Pilot and rollback

Validate policies, pilot one route and selected EDI partners, train agents/planners/support and record go/no-go evidence. A feature flag stops new requests if safety fails. Reconcile pending reservations and preserve already committed bookings.

### Support recovery

First line explains business rejections. Delayed internal processing warrants investigation without overriding closure. Failed TOS delivery requires alerting, replay by amendment ID and reconciliation with terminal operations.

## 6. Measurement and role evidence

### Illustrative targets

Amendment-linked wrong-sailing incidents: 6/month to 0. Phone share: 35% to below 10%. Recorded evidence for fees: unknown baseline to 100%. No improvement has been measured or achieved by this portfolio.

### Measurement plan

Establish a real baseline in the pilot scope. Operations reviews incidents weekly, booking desk reviews channel mix, finance reconciles fees and support monitors delay-related rejections and failed-delivery age. Lower phone volume alone is insufficient.

### Role mapping

Discovery and workshop plan illustrate requirement gathering. Rules/stories/models illustrate functional specifications. Interfaces and tests illustrate technical collaboration. Pilot/KB illustrate delivery and support preparation.

### What remains

Actual stakeholder facilitation, production logistics knowledge and business approval remain unproven. The case is a conversation aid about analysis and judgement. It does not replace professional experience or formal hiring requirements.
