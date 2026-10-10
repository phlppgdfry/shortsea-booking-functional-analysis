# Late booking amendments — case study

> Independent portfolio case study based on a fictional organisation (Tidewell Shortsea Lines). All figures are illustrative assumptions — not real company data. About 10 minutes.

## 1. The business problem

Tidewell runs RoRo sailings between a Belgian terminal and terminals in the UK and Ireland, mostly for unaccompanied trailers. Customers often need to move a trailer to another sailing: the haulier is late, the cargo is not ready, or the customer wants an earlier departure. Four channels handle this, each in its own way. The portal stops 24 hours before departure. EDI messages overwrite bookings without any check. The booking desk applies rules from memory and an Excel sheet. The terminal sometimes hears about a change too late. The visible results: trailers on the wrong sailing, a third of amendments done by phone, and fee disputes nobody can settle because the booking keeps no history.

## 2. How I started: people, not screens

I created fictional interview notes for each group: booking desk, terminal operations, commercial, finance, the EDI team and two EDI customers ([interview guide](docs/01-discovery/stakeholders.md)). I recorded hypothetical statements, including where they contradicted each other ([notes](docs/01-discovery/interview-notes.md)). Three contradictions stood out: there was not one cut-off but at least five; commercial wanted key accounts never to be refused while operations wanted hard limits; and the biggest EDI customer re-sent the whole booking for every change.

## 3. Event storming: making the disagreements visible

Because everyone described the same amendment differently, I chose event storming over a requirements workshop ([plan](docs/02-event-storming/facilitation-plan.md)). On a timeline of domain events, the differences show up as red hotspots instead of disappearing into a document. The session split "booking changed" into *requested → evaluated → moved*, introduced the **amendment** as a concept of its own, and found an actor nobody had thought of: the clock that must expire requests that wait too long ([board](docs/02-event-storming/board.md)).

The hotspots did not get decided in the room. For each one I prepared options and consequences and took them to the person who owns that decision ([hotspots and decisions](docs/02-event-storming/outcomes.md)). The key-account conflict, for example, went to the Product Owner. The decision: late changes always need terminal approval, and key accounts get priority in the queue, not automatic approval.

## 4. One rule set, written once

The core of the analysis is a single set of [18 business rules](docs/03-analysis/business-rules.md), each with an owner and an example, and one decision table that every channel uses. The order of the rows is a design decision in itself: duplicates and "no change" first (so they never create fees), "loading closed" before "sailing full" (so the customer gets the reason they can act on), and the human decision last.

To prove the rules are precise enough to build and test, I wrote the 27 decision examples as Gherkin ([feature file](docs/04-backlog/features/amendment-decision.feature)) and made them run in CI against a small rule module. The same module powers the [rule checker](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/checker/) on the case site.

## 5. Stories, models and interfaces

The first ticket, "customer changes booking", was split **by rule path, not by channel**: three channel-specific stories with their own rules would rebuild today's problem ([story map](docs/04-backlog/story-map.md)). Ten stories make up release 1 ([stories](docs/04-backlog/user-stories.md)).

The models answer what developers ask first: which states exist and which transitions are allowed ([state machine](docs/05-models/state-machine.md)), which information is needed and who owns it ([logical data model](docs/05-models/logical-data-model.md)), and how the flow crosses teams ([process](docs/05-models/process-to-be.md)). The interface descriptions focus on behaviour: what counts as a duplicate, what a "replace" message without real changes does, which clock decides whether an EDI request was on time ([EDI](docs/06-interfaces/edi-amendment.md), [portal and terminal](docs/06-interfaces/portal-and-terminal.md)).

## 6. Refinement, validation and handover

Refinement is where the analysis continues ([log](docs/07-delivery/refinement-log.md)). A tester asked whether a request at *exactly* 90 minutes is on time; a developer asked whether space is held while a request is pending. Each answer went back into the rules and the examples, not into a side conversation. The UAT plan uses realistic roles, including the senior booking agent who prefers the phone ([test scenarios](docs/07-delivery/test-scenarios.md)). The handover gives Application Support a release note and a first-line KB article that separates "working as designed" from "escalate" ([release note](docs/08-handover/release-note.md), [KB](docs/08-handover/kb-article.md)).

## 7. Result and what it says about me

*Illustrative targets:* wrong-sailing incidents from amendments from about 6 a month to zero; the share of amendments handled by phone from 35% to under 10%; every fee backed by a recorded amendment.

What the case shows about how I work: I start with the people and their contradictions, make disagreements visible and let the right person decide, write each rule once and make it testable, and I don't consider a feature done until the people who support it can explain it.

Review update: [deadline, execution and delivery decisions](docs/03-analysis/review-decisions.md) · [pilot and measurement plan](docs/07-delivery/release-plan.md).
