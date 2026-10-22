import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BookingSimulation, pilotGate, PILOT_BASELINE } from '../site/assets/delivery-model.mjs';
import { evaluate, RULE_VERSIONS } from '../site/assets/amendment-rules.mjs';
const base = { channel:'PORTAL', sameRoute:true, bookingStatus:'ACTIVE', unitStatus:'GATED_IN', statusAgeMinutes:0, dangerousGoods:false, customerTier:'STANDARD', minutesToTargetDeparture:75, minutesToCurrentDeparture:2000, crossesCustomsBorder:false };
const submit = (m,id,bookingId='B1',extra={}) => m.submit({id,bookingId,request:base,...extra});
for (const order of [['B1','B2'],['B2','B1']]) test(`last slot held once: ${order.join(' then ')}`,()=>{
 const m=new BookingSimulation();
 assert.equal(submit(m,'A',order[0]).state,'PENDING_APPROVAL');
 assert.equal(submit(m,'B',order[1]).reason,'NO_CAPACITY');
 assert.equal(m.approve('A').state,'APPLIED'); assert.equal(m.free.NEW,0); assert.equal(m.history.length,1);
});
test('new version changes T-75; pending v1 keeps v1 eligibility and reservation',()=>{
 assert.equal(evaluate({...base,targetCapacity:'AVAILABLE'},RULE_VERSIONS.v1).outcome,'PENDING_APPROVAL');
 assert.equal(evaluate({...base,targetCapacity:'AVAILABLE'},RULE_VERSIONS.v2).outcome,'ACCEPTED');
 const m=new BookingSimulation(); submit(m,'A');
 assert.equal(m.approve('A',{version:'v2'}).version,'v1');
});
test('double submit and duplicate approval cannot consume capacity twice',()=>{
 const m=new BookingSimulation(); submit(m,'A');
 const replay=submit(m,'A2','B1',{messageRef:'A'}); assert.equal(replay.id,'A');
 m.approve('A'); m.approve('A'); assert.equal(m.history.length,1); assert.equal(m.outbox.size,1);
});
test('expired approval releases hold exactly once and another booking can use it',()=>{
 const m=new BookingSimulation(); submit(m,'A');
 assert.equal(m.approve('A',{processingDelayMinutes:45}).state,'EXPIRED'); m.approve('A');
 assert.equal(m.free.NEW,1); assert.equal(submit(m,'B','B2',{version:'v2'}).state,'APPLIED');
});
test('same booking replacement releases old hold and cannot overwrite a changed revision',()=>{
 const m=new BookingSimulation(); submit(m,'A'); submit(m,'B','B1',{target:'LATER',version:'v2'});
 assert.equal(m.requests.get('A').state,'SUPERSEDED'); assert.equal(m.free.NEW,1);
 assert.equal(submit(m,'C','B1').reason,'BOOKING_CHANGED'); assert.equal(m.bookings.B1.sailing,'LATER');
});
test('competing external booking change invalidates pending approval and releases its hold',()=>{
 const m=new BookingSimulation(); submit(m,'A'); m.bookings.B1.revision++;
 assert.equal(m.approve('A').reason,'BOOKING_CHANGED'); assert.equal(m.free.NEW,1); assert.equal(m.outbox.size,0);
});
for (const [status,age,reason] of [['UNKNOWN',0,'TERMINAL_STATUS_UNKNOWN'],['GATED_IN',6,'TERMINAL_STATUS_STALE'],['GATED_IN',-1,'TERMINAL_STATUS_STALE']]) test(`no commit with ${status} age ${age}`,()=>{
 const m=new BookingSimulation(); submit(m,'A'); assert.equal(m.approve('A',{unitStatus:status,statusAgeMinutes:age}).reason,reason);
 assert.equal(m.free.NEW,1); assert.equal(m.outbox.size,0);
});
test('freshness boundary is inclusive; fresh retry can commit',()=>{
 assert.equal(evaluate({...base,targetCapacity:'AVAILABLE',statusAgeMinutes:5}).outcome,'PENDING_APPROVAL');
 const m=new BookingSimulation(); submit(m,'A','B1',{request:{...base,unitStatus:'UNKNOWN'}});
 assert.equal(submit(m,'B','B1',{version:'v2'}).state,'APPLIED');
});
test('terminal failure preserves commit, detects mismatch, and replay repairs once',()=>{
 const m=new BookingSimulation(); submit(m,'A','B1',{version:'v2'});
 for(let i=0;i<3;i++)m.deliver('A',false);
 assert.equal(m.requests.get('A').state,'APPLIED'); assert.equal(m.outbox.get('A').status,'FAILED');
 assert.equal(m.reconcile()[0].amendmentId,'A');
 assert.equal(m.deliver('A',true).status,'SENT'); assert.equal(m.deliver('A',true).attempts,4);
 assert.deepEqual(m.reconcile(),[]); assert.equal(m.history.length,1);
});
test('replaying an old notification cannot restore an obsolete sailing',()=>{
 const m=new BookingSimulation(); submit(m,'A','B1',{version:'v2'});
 submit(m,'B','B1',{target:'LATER',expectedRevision:2,version:'v2'});
 assert.equal(m.deliver('A',true).status,'SUPERSEDED'); assert.equal(m.reconcile()[0].amendmentId,'B');
});
for (const [m,want] of [[{requests:200,phoneRequests:12,wrongSailing:0,unresolvedMismatches:0},'GO'],[{requests:200,phoneRequests:20,wrongSailing:0,unresolvedMismatches:0},'ADJUST'],[{requests:99,phoneRequests:0,wrongSailing:0,unresolvedMismatches:0},'EXTEND'],[{requests:200,phoneRequests:0,wrongSailing:1,unresolvedMismatches:0},'ROLL_BACK']]) test(`pilot gate ${want}`,()=>assert.equal(pilotGate({...PILOT_BASELINE,...m,...(m.requests===99?{successfulAmendments:89,refusedRequests:5,abandonedRequests:5}:{})}),want));

test('sent but not applied is replayed and verified against independent terminal state',()=>{
 const m=new BookingSimulation();submit(m,'A','B1',{version:'v2'});
 m.deliver('A',true,{applied:false});assert.equal(m.outbox.get('A').status,'SENT');assert.equal(m.terminal.B1.sailing,'OLD');
 assert.equal(m.reconcile().length,1);m.deliver('A',true);assert.equal(m.outbox.get('A').attempts,2);assert.equal(m.reconcile().length,0);
 m.deliver('A',true);assert.equal(m.outbox.get('A').attempts,2);
});
test('clock ages observations and expires reservations without an approval call',()=>{
 const m=new BookingSimulation();submit(m,'A');m.advanceClock(40);assert.equal(m.approve('A').reason,'TERMINAL_STATUS_STALE');
 const n=new BookingSimulation();submit(n,'A');n.advanceClock(40);assert.equal(n.approve('A',{unitStatus:'GATED_IN',statusAgeMinutes:0}).state,'APPLIED');
 const x=new BookingSimulation();submit(x,'A');x.advanceClock(45);assert.equal(x.requests.get('A').state,'EXPIRED');assert.equal(x.free.NEW,1);x.advanceClock(10);assert.equal(x.free.NEW,1);
});
test('capacity and typed fields fail closed',()=>{
 for(const patch of [{targetCapacity:undefined},{targetCapacity:'UNKNOWN'},{dangerousGoods:'false'},{sameRoute:1},{channel:'OTHER'},{unitStatus:'TYPO'},{customerTier:'VIP'}]) assert.equal(evaluate({...base,targetCapacity:'AVAILABLE',...patch}).reason,'INVALID_REQUEST');
});
test('low calls cannot hide refusals, abandonment, slow cycles or recovery effort',()=>{
 const ok={...PILOT_BASELINE,requests:200,phoneRequests:0,wrongSailing:0,unresolvedMismatches:0};
 for(const patch of [{successfulAmendments:10,refusedRequests:180},{successfulAmendments:10,abandonedRequests:180},{p95CycleMinutes:11},{recoveryMinutes:51}]) assert.equal(pilotGate({...ok,...patch}),'ADJUST');
 assert.equal(pilotGate({...ok,complete:false}),'EXTEND');
});
