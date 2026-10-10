// Amendment decision rules for Tidewell Shortsea Lines (fictional).
// Single source for the rule checker on the site and for the acceptance tests in /tests.
// Rule IDs match docs/03-analysis/business-rules.md. All parameters are illustrative assumptions.

export const PARAMETERS = {
  standardCutoffMinutes: 90,    // BR-06: unaccompanied trailer, standard cargo
  dgCutoffMinutes: 1440,        // BR-06: dangerous goods (24 h)
  loadingClosedMinutes: 30,     // BR-12: no amendments at all inside this window
  lateFeeWindowMinutes: 1440,   // BR-13: request < 24 h before the current departure
};

export const OUTCOMES = ["ACCEPTED", "PENDING_APPROVAL", "REJECTED", "NO_CHANGE", "DUPLICATE_IGNORED"];

/**
 * Evaluate one sailing-change request. The channel never changes the outcome (BR-17).
 * @param {object} r
 * @param {"PORTAL"|"EDI"|"AGENT"} r.channel
 * @param {boolean} r.duplicateMessage   same channel message reference already processed
 * @param {boolean} r.noEffectiveChange  requested sailing equals the current sailing
 * @param {boolean} r.sameRoute
 * @param {"ACTIVE"|"CANCELLED"} r.bookingStatus
 * @param {"NOT_ARRIVED"|"GATED_IN"|"LOADED"} r.unitStatus
 * @param {boolean} r.dangerousGoods
 * @param {"STANDARD"|"KEY_ACCOUNT"} r.customerTier
 * @param {"AVAILABLE"|"FULL"} r.targetCapacity
 * @param {number} r.minutesToTargetDeparture   from receipt of the request (BR-17: gateway time for EDI)
 * @param {number} r.minutesToCurrentDeparture  negative when the current sailing already left
 * @param {number} [r.processingDelayMinutes=0] minutes elapsed since receipt, including approval wait
 * @param {boolean} r.crossesCustomsBorder      route crosses a customs border and the booking has a customs reference
 */
export function evaluate(r, p = PARAMETERS) {
  const fired = [];
  const done = (outcome, reason, flags = []) => ({ outcome, reason, rulesFired: fired, flags: flags.sort() });

  if (r.duplicateMessage) { fired.push("BR-01"); return done("DUPLICATE_IGNORED", "DUPLICATE_MESSAGE"); }
  if (r.noEffectiveChange) { fired.push("BR-02"); return done("NO_CHANGE", "NO_EFFECTIVE_CHANGE"); }
  if (!r.sameRoute) { fired.push("BR-03"); return done("REJECTED", "ROUTE_CHANGE"); }
  if (r.bookingStatus !== "ACTIVE" || r.unitStatus === "LOADED") { fired.push("BR-04"); return done("REJECTED", "NOT_AMENDABLE"); }
  const remainingNow = r.minutesToTargetDeparture - (r.processingDelayMinutes ?? 0);
  if (remainingNow <= p.loadingClosedMinutes || (r.targetSailingStatus ?? "OPEN") !== "OPEN") { fired.push("BR-12"); return done("REJECTED", "LOADING_CLOSED"); }
  if (r.targetCapacity === "FULL") { fired.push("BR-05"); return done("REJECTED", "NO_CAPACITY"); }

  const cutoff = r.dangerousGoods ? p.dgCutoffMinutes : p.standardCutoffMinutes;
  fired.push("BR-06");

  const consequences = (outcome) => {
    const flags = [];
    if (r.minutesToCurrentDeparture < p.lateFeeWindowMinutes) { fired.push("BR-13"); flags.push("LATE_FEE"); }
    if (r.crossesCustomsBorder) { fired.push("BR-14"); flags.push("CUSTOMS_REF_UPDATE"); }
    if (outcome === "ACCEPTED" && r.unitStatus === "GATED_IN") { fired.push("BR-16"); flags.push("TERMINAL_NOTIFY"); }
    if (outcome === "PENDING_APPROVAL" && r.customerTier === "KEY_ACCOUNT") { fired.push("BR-11"); flags.push("PRIORITY"); }
    return flags;
  };

  if (r.minutesToTargetDeparture >= cutoff) { fired.push("BR-07"); return done("ACCEPTED", "BEFORE_CUTOFF", consequences("ACCEPTED")); }
  if (r.dangerousGoods) { fired.push("BR-08"); return done("REJECTED", "DG_CUTOFF_PASSED"); }
  if (r.unitStatus !== "GATED_IN") { fired.push("BR-09"); return done("REJECTED", "CUTOFF_PASSED"); }
  fired.push("BR-10");
  return done("PENDING_APPROVAL", "LATE_ACCEPTANCE", consequences("PENDING_APPROVAL"));
}

/** Revalidate an existing pending request using current status/capacity and elapsed time.
 * Receipt-time cut-off eligibility is retained. Operational closure cannot be overridden.
 * Production must reserve/move capacity atomically; this module demonstrates decisions only.
 */
export function approve(r, p = PARAMETERS) {
  if (r.minutesToTargetDeparture - (r.processingDelayMinutes ?? 0) <= p.loadingClosedMinutes) {
    return { outcome: "REJECTED", reason: "APPROVAL_EXPIRED", rulesFired: ["BR-18", "BR-12"], flags: [] };
  }
  const result = evaluate(r, p);
  if (result.outcome !== "PENDING_APPROVAL") return result;
  const flags = result.flags.filter((flag) => flag !== "PRIORITY");
  if (r.unitStatus === "GATED_IN") flags.push("TERMINAL_NOTIFY");
  return { ...result, outcome: "ACCEPTED", reason: "APPROVED_BY_TERMINAL", flags: flags.sort(), rulesFired: [...result.rulesFired, "BR-16"] };
}

/** Booking commit and delivery are independent. A failed commit creates no notification. */
export function applicationResult({ bookingCommitted, notificationStatus = "QUEUED" }) {
  return { amendmentState: bookingCommitted ? "APPLIED" : "ACCEPTED", notificationStatus: bookingCommitted ? notificationStatus : null };
}

/** What each channel sends back for the same decision (BR-17: same rule, different envelope). */
export function channelResponse(channel, result) {
  const { outcome, reason } = result;
  if (channel === "EDI") {
    if (outcome === "DUPLICATE_IGNORED") return "Re-send the original acknowledgement. No new booking confirmation.";
    if (outcome === "NO_CHANGE") return "Positive acknowledgement (APERAK-style), no booking confirmation: nothing changed.";
    if (outcome === "ACCEPTED") return "Booking confirmation (IFTMBC-style) with the new sailing.";
    if (outcome === "PENDING_APPROVAL") return "Interim status 'received – pending terminal approval' with the expiry time; final confirmation or rejection follows.";
    return `Rejection (APERAK-style) with reason code ${reason}.`;
  }
  if (channel === "PORTAL") {
    if (outcome === "DUPLICATE_IGNORED") return "Show the result of the first request (double click / retry).";
    if (outcome === "NO_CHANGE") return "“This booking is already on that sailing.”";
    if (outcome === "ACCEPTED") return "“Your trailer is now booked on the new sailing.” + updated booking.";
    if (outcome === "PENDING_APPROVAL") return "“The terminal is checking your request. You will hear from us before <expiry>.”";
    return `Plain-language rejection for ${reason} + the next sailing with space, if any.`;
  }
  // AGENT
  if (outcome === "PENDING_APPROVAL") return "Agent sees ‘Sent to terminal for approval’ and the deadline; cannot approve it themselves.";
  if (outcome === "REJECTED") return `Agent sees reason ${reason} and the script line for the customer; no override button.`;
  return `Agent sees outcome ${outcome}; booking history shows the agent as requester.`;
}
