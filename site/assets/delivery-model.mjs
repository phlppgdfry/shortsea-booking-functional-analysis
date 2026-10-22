// In-memory functional reference, NOT a production transaction engine.
// Each method is one synchronous unit of work; production needs DB transactions/CAS + durable outbox.
import { evaluate, approve, RULE_VERSIONS } from './amendment-rules.mjs';

export class BookingSimulation {
  constructor() {
    this.now = 0;
    this.terminal = { B1: { sailing: "OLD", revision: 1 }, B2: { sailing: "OLD", revision: 1 } };
    this.free = { OLD: 0, NEW: 1, LATER: 1 };
    this.bookings = { B1: { sailing: 'OLD', revision: 1 }, B2: { sailing: 'OLD', revision: 1 } };
    this.requests = new Map(); this.messages = new Map(); this.outbox = new Map(); this.history = [];
  }
  submit({ id, bookingId, target = 'NEW', expectedRevision = 1, version = 'v1', request, messageRef = id }) {
    if (!RULE_VERSIONS[version] || !this.bookings[bookingId] || !(target in this.free)) throw new Error('Invalid request identity');
    const key = JSON.stringify([bookingId, request.channel, messageRef]);
    if (this.messages.has(key)) return structuredClone(this.requests.get(this.messages.get(key)));
    if (this.requests.has(id)) throw new Error('Amendment ID already used with another message');
    const booking = this.bookings[bookingId];
    const amendment = { id, bookingId, target, expectedRevision, version, receivedAt: this.now - (request.processingDelayMinutes ?? 0), observedAt: this.now - (request.statusAgeMinutes ?? 0), request: structuredClone(request), held: false, state: 'RECEIVED' };
    this.requests.set(id, amendment); this.messages.set(key, id);
    if (booking.revision !== expectedRevision) return this.reject(amendment, 'BOOKING_CHANGED');
    // A new request supersedes an outstanding approval, even if the replacement is refused.
    for (const a of this.requests.values()) if (a !== amendment && a.bookingId === bookingId && a.state === 'PENDING_APPROVAL') {
      this.release(a); a.state = 'SUPERSEDED'; a.reason = 'NEW_REQUEST';
    }
    const result = evaluate({ ...request, noEffectiveChange: target === booking.sailing, targetCapacity: this.free[target] > 0 ? 'AVAILABLE' : 'FULL' }, RULE_VERSIONS[version]);
    Object.assign(amendment, { reason: result.reason, decision: result });
    if (result.outcome === 'NO_CHANGE' || result.outcome === 'REJECTED' || result.outcome === 'DUPLICATE_IGNORED') {
      amendment.state = result.outcome; return structuredClone(amendment);
    }
    this.free[target]--; amendment.held = true;
    if (result.outcome === 'PENDING_APPROVAL') { amendment.state = 'PENDING_APPROVAL'; return structuredClone(amendment); }
    return this.commit(amendment);
  }
  release(a) { if (a.held) { this.free[a.target]++; a.held = false; } }
  reject(a, reason) { this.release(a); a.state = reason === 'APPROVAL_EXPIRED' ? 'EXPIRED' : 'REJECTED'; a.reason = reason; return structuredClone(a); }
  advanceClock(minutes) {
    if (!Number.isFinite(minutes) || minutes < 0) throw new Error('Invalid clock advance');
    this.now += minutes;
    for (const a of this.requests.values()) if (a.state === 'PENDING_APPROVAL' && a.request.minutesToTargetDeparture - (this.now - a.receivedAt) <= RULE_VERSIONS[a.version].loadingClosedMinutes) this.reject(a, 'APPROVAL_EXPIRED');
  }
  approve(id, live = {}) {
    const a = this.requests.get(id);
    if (!a) throw new Error('Unknown amendment');
    if ('processingDelayMinutes' in live) {
      if (!Number.isFinite(live.processingDelayMinutes) || live.processingDelayMinutes < 0) throw new Error('Invalid elapsed time');
      this.advanceClock(Math.max(0, a.receivedAt + live.processingDelayMinutes - this.now));
    }
    if (a.state !== 'PENDING_APPROVAL') return structuredClone(a);
    if (this.bookings[a.bookingId].revision !== a.expectedRevision) return this.reject(a, 'BOOKING_CHANGED');
    // Identity, receipt time and original rule version cannot be replaced by approval input.
    const current = { ...a.request };
    for (const field of ['unitStatus', 'targetSailingStatus', 'bookingStatus']) {
      if (field in live) current[field] = live[field];
    }
    if ('statusAgeMinutes' in live) a.observedAt = this.now - live.statusAgeMinutes;
    current.statusAgeMinutes = this.now - a.observedAt;
    current.processingDelayMinutes = this.now - a.receivedAt;
    current.targetCapacity = a.held ? 'AVAILABLE' : 'FULL';
    const decision = approve(current, RULE_VERSIONS[a.version]);
    if (decision.outcome !== 'ACCEPTED') return this.reject(a, decision.reason);
    a.decision = decision; return this.commit(a);
  }
  commit(a) {
    const b = this.bookings[a.bookingId];
    if (b.revision !== a.expectedRevision) return this.reject(a, 'BOOKING_CHANGED');
    if (!a.held) return this.reject(a, 'NO_CAPACITY');
    this.free[b.sailing]++; b.sailing = a.target; b.revision++; a.held = false; a.state = 'APPLIED';
    // History and outbox enqueue are part of the same simulated commit.
    this.history.push({ amendmentId: a.id, bookingId: a.bookingId, revision: b.revision, version: a.version, sailing: b.sailing });
    this.outbox.set(a.id, { amendmentId: a.id, bookingId: a.bookingId, revision: b.revision, sailing: b.sailing, status: 'QUEUED', attempts: 0 });
    return structuredClone(a);
  }
  deliver(id, available, { applied = true } = {}) {
    const n = this.outbox.get(id);
    if (!n) throw new Error('No committed notification');
    if (this.bookings[n.bookingId].revision > n.revision) { n.status = 'SUPERSEDED'; return structuredClone(n); }
    if (n.status === 'SUPERSEDED' || (n.status === 'SENT' && !n.repairRequired)) return structuredClone(n);
    n.attempts++; n.status = available ? 'SENT' : n.attempts >= 3 ? 'FAILED' : 'RETRYING';
    if (available) {
      n.received = true;
      const old = this.terminal[n.bookingId];
      if (applied && (!old || old.revision <= n.revision)) this.terminal[n.bookingId] = { sailing:n.sailing, revision:n.revision };
    }
    const observed = this.terminal[n.bookingId];
    n.verified = observed?.revision === n.revision && observed?.sailing === n.sailing;
    n.repairRequired = !n.verified;
    return structuredClone(n);
  }
  reconcile(terminal = this.terminal) {
    return [...this.outbox.values()].filter(n => {
      if (n.revision !== this.bookings[n.bookingId].revision) return false;
      const observed = terminal[n.bookingId];
      n.verified = typeof observed === 'object' && observed?.sailing === n.sailing && observed?.revision === n.revision;
      n.repairRequired = !n.verified;
      return !n.verified;
    }).map(n => ({ amendmentId:n.amendmentId, bookingId:n.bookingId, expected:n.sailing, expectedRevision:n.revision, observed:terminal[n.bookingId] ?? 'UNKNOWN', action:'REPLAY_LATEST_AND_VERIFY' }));
  }
}

// Proposed pilot thresholds; one complete seven-day observation window, not production evidence.
export const PILOT_BASELINE = Object.freeze({windowDays:7, complete:true, successfulAmendments:180, refusedRequests:10, abandonedRequests:10, p95CycleMinutes:5, recoveryMinutes:20});
export function pilotGate(m) {
  const counts = ['requests','phoneRequests','wrongSailing','unresolvedMismatches','successfulAmendments','refusedRequests','abandonedRequests'];
  if (counts.some(k => !Number.isInteger(m[k]) || m[k] < 0) || m.phoneRequests > m.requests || m.successfulAmendments + m.refusedRequests + m.abandonedRequests !== m.requests || ![m.windowDays,m.p95CycleMinutes,m.recoveryMinutes].every(v=>Number.isFinite(v)&&v>=0) || typeof m.complete !== 'boolean') throw new Error('Invalid measurement');
  if (m.wrongSailing > 0 || m.unresolvedMismatches > 0) return 'ROLL_BACK';
  if (!m.complete || m.windowDays < 7 || m.requests < 100) return 'EXTEND';
  return m.phoneRequests / m.requests < .1 && m.successfulAmendments / m.requests >= .9 && m.refusedRequests / m.requests <= .05 && m.abandonedRequests / m.requests <= .05 && m.p95CycleMinutes <= 10 && m.recoveryMinutes / m.requests <= .25 ? 'GO' : 'ADJUST';
}
