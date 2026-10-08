# Event storming — facilitation plan

> **What this is:** how I would run the event storming on booking amendments, and why that format. **For:** the Product Owner and the people invited. **Previous:** [interview notes](../01-discovery/interview-notes.md) · **Next:** [the board](board.md).

## Why event storming here

The interviews showed that everyone describes the *same* amendment differently (N-01, N-05, N-06). A requirements document would hide those differences. On an event storming timeline they show up as stickies that do not line up, and that is where the analysis starts. It also gives developers the domain events and the language they will use in the code.

## Setup

| | |
|---|---|
| Goal | One shared timeline of a sailing change, from request to notification; list of hotspots; agreed language |
| Level | Big picture (60 min) → process level for the amendment decision (60 min) |
| Participants (8) | 2 booking agents (1 senior), 1 terminal planner, 1 gate supervisor, 1 account manager, Product Owner, 1 developer, 1 tester |
| Not invited | Management: decisions are prepared here and taken by the PO afterwards |
| Format | Hybrid: FigJam board on a big screen, everyone can add stickies; the facilitator keeps the timeline tidy |
| Preparation | Glossary draft, 3 real (anonymised) amendment examples from the interviews, empty board with the legend |

## Legend

| Colour | Meaning |
|---|---|
| Orange | Domain event — something that happened, past tense ("Amendment requested") |
| Blue | Command — an intention ("Request amendment") |
| Small yellow | Actor — who triggers the command |
| Lilac | Policy — "whenever X, then Y" |
| Pink | External system |
| Green | Read model — information someone needs to decide |
| Red | Hotspot — disagreement, question or risk |

## Agenda (2 h 15)

| Time | Block | Output |
|---|---|---|
| 0:00 | Intro, rules, legend, one example | Everyone has written one sticky |
| 0:10 | **Chaotic exploration** — everyone writes domain events, no discussion | ±60 orange stickies |
| 0:30 | **Enforce the timeline** — order, remove duplicates, agree on names | One line from "requested" to "notified" |
| 0:50 | **Hotspots** — red stickies on every disagreement | 5–8 hotspots |
| 1:05 | Break | |
| 1:15 | **Process level** — commands, actors, policies, read models, external systems around the decision | Decision flow on the board |
| 1:50 | **Walk the timeline** with the 3 real examples, one person narrates | Gaps found |
| 2:05 | **Close** — hotspots ranked by dot voting; owner for each | Hotspot list with owners |

## Facilitation notes

- Start with events, not screens. If someone says "on the screen there is a button…", ask "and what has happened after they press it?"
- Commercial and operations will disagree on key accounts (N-05). Let the disagreement land on a red sticky and move on; it is a decision for the PO, not for the room.
- Watch the senior booking agent: they know the exceptions nobody wrote down. Ask them to narrate the example walk.
- The developer listens for aggregate boundaries and states; the tester for edge cases. Both write their own red stickies.

---

Previous: [← Interview notes](../01-discovery/interview-notes.md) · Next: [Board →](board.md)
