# KB article — "Why was my sailing change refused?"

> **What this is:** a first-line support article, prepared by the analyst with Application Support. It separates *business rules working as designed* from *possible defects*, so first line knows when to answer and when to escalate. **Previous:** [release note](release-note.md) · **Back to:** [documentation map](../00-documentation-map.md).

## 1. Find the amendment

Open the booking → tab **History**. Every request is listed with channel, time received, outcome, reason and the rules that fired (e.g. `BR-06, BR-09`).

> No amendment in the history, but the customer says they sent an EDI message? Check the **message log**: a duplicate (BR-01) or a re-send without changes (BR-02) does not create an amendment. That is by design.

## 2. Read the reason

| Reason | Working as designed when… | Escalate to second line when… |
|---|---|---|
| CUTOFF_PASSED | received after cut-off and the unit is **not gated in** at current evaluation | the gate shows the unit was gated in **before** the request was evaluated (possible gate-feed delay, see EX-7) |
| DG_CUTOFF_PASSED | the unit carries DG and the request was < 24 h before departure | the booking shows DG but the customer says there is none (data issue → booking desk) |
| LOADING_CLOSED | evaluated/applied at T-30 or later, or sailing already closed | timely receipt followed by delayed processing: investigate internal delay, never override closure |
| NO_CAPACITY | the sailing was full at that time | the sailing shows space left now and the customer retried: let them retry |
| APPROVAL_EXPIRED | nobody in the terminal decided in time | repeated for the same terminal shift → inform the terminal ops manager |
| DECLINED_BY_TERMINAL | the planner gave a reason | — (give the reason to the customer) |
| ROUTE_CHANGE, NOT_AMENDABLE | as described | — |

**Cut-off eligibility uses receipt time** (gateway time for EDI). **Execution safety uses current time and status.** Compare receivedAt, evaluatedAt and appliedAt in the audit. A timely request processed after closure must be refused; escalate the internal delay without promising an override.

## 3. What first line can and cannot do

- **Can:** explain the reason, suggest the next sailing, help with a new request.
- **Cannot:** override a rejection or approve a late request. Approval is only for terminal operations (separation of duties, NFR-05).

## FAQ

**The customer says the portal used to allow this.** The portal used to stop 24 h before departure. It now allows *more*, up to cut-off. What changed is that the phone no longer gives exceptions the system would refuse.

**"I'm a key account, why did I get a no?"** Key accounts get priority in the terminal's approval queue. They are not approved automatically, and DG / loading-closed rules apply to everyone.

**The customer got a fee for moving to an earlier sailing.** The fee depends on how close the request was to the **original** departure (24 h), not the new one. If it was more than 24 h before the original departure and a fee was still flagged, escalate as a possible defect.

**The gate shows the old sailing.** Escalate immediately to second line with booking and unit number: the terminal notification may have failed (EX-6). The committed booking remains Applied. Check the separate notification status (QUEUED/RETRYING/FAILED/SENT), reconcile with terminal operations and replay the notification by amendment ID. Do not create a second booking amendment or manually roll back the first.

---

Previous: [← Release note](release-note.md) · Back to: [Documentation map](../00-documentation-map.md)
