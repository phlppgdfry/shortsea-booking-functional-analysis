# Late booking amendments — one-page summary

> Independent portfolio case study based on a fictional organisation. [Nederlandse versie](samenvatting-nl.md)

## Challenge

A short-sea RoRo operator lets customers move trailers to other sailings through four channels (portal, EDI, e-mail, phone), each with different rules. Results: trailers on the wrong sailing, a third of amendments by phone, no history for fee disputes.

## My approach

Interviews per stakeholder group → event storming to surface the contradictions → options for each hotspot, decided by its owner → one rule set for all channels → stories with executable acceptance criteria → models and interfaces → refinement with developers and testers → handover to support.

## What I delivered

| Deliverable | Link |
|---|---|
| Event-storming plan, board, hotspots and decision log | [outcomes](../../docs/02-event-storming/outcomes.md) |
| Functional analysis with alternative and exception flows | [analysis](../../docs/03-analysis/functional-analysis.md) |
| 18 business rules + one decision table | [rules](../../docs/03-analysis/business-rules.md) |
| Story map + 10 user stories, Gherkin criteria (27 run in CI) | [stories](../../docs/04-backlog/user-stories.md) |
| Process, state machine, logical data model | [models](../../docs/05-models/state-machine.md) |
| EDI and portal/terminal interface descriptions | [interfaces](../../docs/06-interfaces/edi-amendment.md) |
| Definition of ready, refinement log, UAT | [delivery](../../docs/07-delivery/test-scenarios.md) |
| Release note and first-line KB article | [handover](../../docs/08-handover/kb-article.md) |

## Solution in one line

Every request becomes an *amendment* that is evaluated by the same rules; late requests for trailers already in the terminal go to an approval queue with a deadline; the terminal, the customer and finance are informed automatically.

## Business impact

| Measure | Baseline | Target |
|---|---|---|
| Wrong-sailing incidents caused by amendments | ±6 / month | 0 |
| Amendments handled by phone | ±35% | < 10% |
| Fees without a recorded amendment | unknown | 0 |

*Illustrative assumptions — not real company data.*

## Role fit

| Functional analyst requirement | Evidence |
|---|---|
| Functional analyses, stories, flows, acceptance criteria | analysis, stories, process |
| Event storming and refinement | event-storming docs, refinement log |
| Business rules, logical data models | rules, ERD |
| System behaviour and interfaces | state machine, EDI description |
| Developers and testers | DoR, executable examples, UAT |
| Support handover | release note, KB article |

## Review and delivery

At T-30 changes and approvals close. Receipt time determines cut-off eligibility, current facts/time determine execution. Applied means booking commit plus durable notification enqueue; delivery status is separate. See [review decisions](../../docs/03-analysis/review-decisions.md) and [release plan](../../docs/07-delivery/release-plan.md). [PDF](../exports/one-pager.pdf).
