# Context — Tidewell Shortsea Lines and the amendment problem

> **What this is:** the fictional organisation, the problem, the scope and the assumptions behind this case. **For:** anyone opening the case for the first time. **Next:** [stakeholders](stakeholders.md).

*Independent portfolio case study based on a fictional organisation. It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions — not real company data.*

## The organisation

| | |
|---|---|
| Business | RoRo short-sea operator between a Belgian continental terminal, two UK terminals and one Irish terminal. Mostly **unaccompanied trailers**, plus new cars and some project cargo. |
| Size | 9 vessels, ±60 sailings a week, ±900 staff *(illustrative)* |
| Customers | ±400 hauliers and forwarders. The 20 largest book through **EDI**; the rest through the **customer portal**, e-mail or phone. |
| Systems | In-house booking system (15-year-old core model, new modules in a modern stack) · customer portal (2 years old) · EDI gateway · terminal operating system (TOS) with a gate module · ERP for invoicing |
| IT | IT Development with three Scrum teams; Application Support (first and second line) |
| Product | Product Owner *Booking & Portal* owns the backlog this case belongs to |

## Why now

- Large customers complain that amendments "disappear" or are confirmed too late.
- Last quarter a trailer sailed on the wrong vessel after a phone amendment was typed into the wrong booking (incident).
- The team is splitting the old booking model into smaller parts. **Booking amendments** is the first part to be redesigned.

## The problem today

| Channel | What happens today |
|---|---|
| Portal | Changes allowed up to 24 h before departure; after that the customer has to call |
| EDI | A change message **overwrites** the booking. No check on cut-off, capacity or dangerous goods |
| E-mail / phone | The booking desk checks cut-off, capacity and DG rules from memory and an Excel sheet per route |
| Terminal | The gate sometimes still shows the old sailing |

Consequences *(illustrative)*: ±180 amendments a week, ±35% of them after the portal limit and therefore by phone; ±6 wrong-sailing incidents a month; no history of who changed what, so invoicing disputes are hard to settle.

## Scope

**In scope (release 1):** moving an unaccompanied trailer to another sailing on the **same route**, through portal, EDI and booking desk; late acceptance with terminal approval; customer and terminal notification; late-fee and customs flags; amendment history.

**Out of scope:** route changes (cancel and rebook), changing unit details (plate, weight, adding DG — release 2), calculating fees (only the flag), submitting customs data, accompanied freight, cars, project cargo, stowage planning.

## Assumptions

| ID | Assumption | Why it matters | Check with |
|---|---|---|---|
| A-01 | Capacity per sailing is available as a single "space left" figure | BR-05 can be a simple check | Capacity planning |
| A-02 | The gate knows whether a unit is gated in, in near real time | BR-09/BR-10 depend on it | Terminal IT |
| A-03 | EDI customers can receive an interim "pending" status | otherwise late acceptance needs another route for EDI | EDI team + 2 pilot customers |
| A-04 | The fee itself is calculated in the ERP | we only flag | Finance |

---

[Documentation map](../00-documentation-map.md) · Next: [Stakeholders →](stakeholders.md)
