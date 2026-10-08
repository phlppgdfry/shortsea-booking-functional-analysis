# Story map

> **What this is:** the user journey of an amendment as a backbone, with the stories under each step and the cut between release 1 and later. **For:** Product Owner and team in planning. **Previous:** [business rules](../03-analysis/business-rules.md) · **Next:** [user stories](user-stories.md).

## Backbone

```text
 Request          →   Decide            →   Late acceptance    →   Apply & inform       →   Look back
 ───────────────      ───────────────       ─────────────────      ─────────────────        ──────────────
 RELEASE 1
 US-01 portal         (rules BR-01…12,      US-05 approval         US-07 notify terminal    US-10 history
 US-02 agent           BR-17, shared         queue + expiry        US-08 late-fee flag
 US-03 EDI             by all channels)     US-06 customer told    US-09 customs warning
                      US-04 route late       outcome/expiry
                       cases to approval
 ─────────────────────────────────────────────────────────────────────────────────────────────────────
 RELEASE 2 (not now)
 unit details change  DG added by           approval on mobile     fee calculation          amendment
 (plate, weight)      amendment             for the gate           + waiver (Q-04)          reporting
 route change =                                                    customs integration
 cancel + rebook help                                              (H4 option c)
```

## Why this cut

- Release 1 removes the three causes of the incidents and phone calls: inconsistent rules between channels, no path for late changes, and the terminal not being told.
- Unit-detail changes have different rules (weights, DG declarations) and a different owner (DG officer). Mixing them in would double the rule set before the first release.
- Fee calculation and customs integration depend on other teams. Release 1 only flags, so it does not wait for them.

## How the first big story was split

The first ticket was *"As a customer I want to change my booking"*. In refinement it was split **by rule path, not by channel**:

| Split option | Verdict |
|---|---|
| By channel (portal story, EDI story, agent story, each with its own rules) | Rejected: three implementations of the same rules is exactly today's problem (BR-17) |
| By rule path: on time / late with unit in terminal / duplicates and no change | **Chosen**: each slice delivers value and has a clear test set |
| By screen | Rejected: says nothing about behaviour |

Channel stories (US-01, US-02, US-03) still exist, but they only cover the envelope (input and response); the decision is shared.

---

Previous: [← Business rules](../03-analysis/business-rules.md) · Next: [User stories →](user-stories.md)
