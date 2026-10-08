# Documentation map

> **What this is:** where every piece of functional documentation lives, who keeps it up to date, and how stories, rules, models and tests point at each other. This is the "living documentation" agreement for the feature. **Next:** [context](01-discovery/context.md).

## What lives where

| Step | Document | Kept up to date by | Changes when |
|---|---|---|---|
| Discover | [Context](01-discovery/context.md) · [Stakeholders](01-discovery/stakeholders.md) · [Interview notes](01-discovery/interview-notes.md) · [Glossary](01-discovery/glossary.md) | analyst | new scope, new term |
| Event storm | [Facilitation plan](02-event-storming/facilitation-plan.md) · [Board](02-event-storming/board.md) · [Hotspots & decisions](02-event-storming/outcomes.md) | analyst (facilitator) | after each session; decisions by their owners |
| Analyse | [Functional analysis](03-analysis/functional-analysis.md) · [**Business rules**](03-analysis/business-rules.md) | analyst; each rule has a business owner | rule or parameter change |
| Specify | [Story map](04-backlog/story-map.md) · [User stories](04-backlog/user-stories.md) · [Feature files](04-backlog/features/) · [Mock-ups](04-backlog/mockups.md) | analyst + PO | refinement |
| Model | [Process TO-BE](05-models/process-to-be.md) · [State machine](05-models/state-machine.md) · [Logical data model](05-models/logical-data-model.md) | analyst, reviewed by a developer | new state, entity or flow |
| Interfaces | [EDI amendment](06-interfaces/edi-amendment.md) · [Portal & terminal](06-interfaces/portal-and-terminal.md) | analyst + EDI team / developers | new field, reason code or partner |
| Deliver | [Definition of ready](07-delivery/definition-of-ready.md) · [Refinement log](07-delivery/refinement-log.md) · [Test scenarios](07-delivery/test-scenarios.md) | analyst + tester | every refinement |
| Hand over | [Release note](08-handover/release-note.md) · [KB article](08-handover/kb-article.md) | analyst + Application Support | every release |

**Rule of thumb:** a rule is written once, in [business rules](03-analysis/business-rules.md). Stories, models, interfaces and the KB refer to its ID. If a rule text appears anywhere else, it is a copy that will go out of date.

## Traceability

| Story | Rules | Acceptance criteria | Model / interface | UAT | Handover |
|---|---|---|---|---|---|
| US-01 Portal up to cut-off | BR-03 … BR-09, BR-12, BR-17 | AC-01.1 – 01.8 | process, state machine | UAT-01, 10 | release note, KB |
| US-02 Agent, same answer | BR-17, NFR-05 | AC-02.1, 02.2 | portal & terminal | UAT-02, 05 | KB §3 |
| US-03 EDI same rules | BR-01, BR-02, BR-17 | AC-03.1 – 03.6 | EDI amendment | UAT-06 | KB §1 |
| US-04 Late → approval | BR-08 … BR-12 | AC-04.1 – 04.6 | process, state machine | UAT-03, 05, 09 | release note |
| US-05 Approval queue | BR-10, BR-11, BR-15, BR-18 | AC-05.1 – 05.6 | state machine, data model | UAT-03, 04, 09 | release note |
| US-06 Customer told | BR-17, BR-18 | AC-06.1, 06.2 | portal & terminal | UAT-04 | release note |
| US-07 Terminal notified | BR-16 | AC-07.1, 07.2 | portal & terminal (terminal notification) | UAT-03, 11 | KB FAQ |
| US-08 Late fee flag | BR-13 | AC-08.1 – 08.3 | data model | UAT-07 | KB FAQ |
| US-09 Customs warning | BR-14 | AC-09.1 | — | UAT-08 | release note |
| US-10 History | NFR-03 | AC-10.1 | data model | UAT-12 | KB §1 |

Executable: every AC in [amendment-decision.feature](04-backlog/features/amendment-decision.feature) runs as a test (`node --test tests/*.test.mjs`).

---

Next: [Context →](01-discovery/context.md)
