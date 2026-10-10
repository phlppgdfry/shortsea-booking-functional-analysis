import { test } from 'node:test';
import assert from 'node:assert/strict';
import { approve, evaluate, applicationResult } from '../site/assets/amendment-rules.mjs';
const pending = { channel: 'EDI', duplicateMessage: false, noEffectiveChange: false, sameRoute: true,
  bookingStatus: 'ACTIVE', unitStatus: 'GATED_IN', dangerousGoods: false, customerTier: 'KEY_ACCOUNT',
  targetCapacity: 'AVAILABLE', minutesToTargetDeparture: 60, minutesToCurrentDeparture: 2000,
  processingDelayMinutes: 0, crossesCustomsBorder: false };
for (const [delay, outcome, reason] of [[29,'ACCEPTED','APPROVED_BY_TERMINAL'],[30,'REJECTED','APPROVAL_EXPIRED'],[31,'REJECTED','APPROVAL_EXPIRED']]) {
 test(`approval at T-${60-delay}: ${reason}`, () => {
  const r=approve({...pending, processingDelayMinutes:delay});
  assert.equal(r.outcome,outcome);assert.equal(r.reason,reason);
  assert.deepEqual(r.flags,outcome==='ACCEPTED'?['TERMINAL_NOTIFY']:[]);
 });
}
for(const [change,reason] of [[{unitStatus:'LOADED'},'NOT_AMENDABLE'],[{bookingStatus:'CANCELLED'},'NOT_AMENDABLE'],[{targetCapacity:'FULL'},'NO_CAPACITY']]) {
 test(`approval revalidates current ${reason}`,()=>assert.equal(approve({...pending,...change}).reason,reason));
}
test('receipt eligibility survives delay while execution stays open',()=>{
 const r=evaluate({...pending,minutesToTargetDeparture:100,processingDelayMinutes:69});
 assert.equal(r.outcome,'ACCEPTED');
});
for(const state of ['QUEUED','RETRYING','FAILED','SENT']) {
 test(`committed booking remains APPLIED with notification ${state}`,()=>{
  assert.deepEqual(applicationResult({bookingCommitted:true,notificationStatus:state}),{amendmentState:'APPLIED',notificationStatus:state});
 });
}
test('failed booking commit cannot publish a notification or show APPLIED',()=>{
 assert.deepEqual(applicationResult({bookingCommitted:false,notificationStatus:'SENT'}),{amendmentState:'ACCEPTED',notificationStatus:null});
});
test('actual loading closure overrides the scheduled time',()=>{
 assert.equal(evaluate({...pending,minutesToTargetDeparture:300,targetSailingStatus:'LOADING_CLOSED'}).reason,'LOADING_CLOSED');
});
test('approval cannot move a unit to a departed sailing',()=>{
 assert.equal(approve({...pending,targetSailingStatus:'DEPARTED'}).reason,'LOADING_CLOSED');
});
