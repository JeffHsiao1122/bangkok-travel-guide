import test from 'node:test';
import assert from 'node:assert/strict';
import {places} from '../src/data/catalog.js';
import {firstVisitPlaces,openFacts,airportGuides} from '../src/data/first-visit.js';
import {createFirstTrip} from '../src/services/first-trip.js';
import {importTrips} from '../src/services/trip-storage.js';
test('首次內容僅十個地點，基本來源有版本、CC0，營運保持未知',()=>{
 assert.equal(firstVisitPlaces.length,10);
 assert.equal(new Set(firstVisitPlaces.map(p=>p.id)).size,10);
 for(const g of firstVisitPlaces){const p=places.find(p=>p.id===g.id);assert.ok(p);assert.equal(p.fact.license,'CC0-1.0');assert.ok(p.fact.revision>0);assert.equal(p.confirmedAt,null);assert.equal(p.hoursStatus,'待確認');assert.equal(p.ticketStatus,'待確認');assert.ok(p.lat>13&&p.lat<14&&p.lng>100&&p.lng<101);assert.ok(p.caution.length>20);assert.equal(p.cost,p.planningCost);}
 assert.equal(openFacts[airportGuides.bkk.qid].props.P238[0].value,'BKK');
 assert.equal(openFacts[airportGuides.dmk.qid].props.P238[0].value,'DMK');
});
test('原創三日動線使用有來源地點、自選午餐，日期與備份相容',()=>{
 const trip=createFirstTrip({start:'2026-11-01',end:'2026-11-03',people:2,mode:'transit'},places);
 assert.deepEqual(trip.days.map(d=>d.date),['2026-11-01','2026-11-02','2026-11-03']);
 assert.deepEqual(trip.days.map(d=>d.activities.filter(a=>a.placeId).map(a=>a.placeId)),[['grand-palace','wat-pho'],['wat-arun','lumphini'],['art-center','siam-paragon']]);
 for(const day of trip.days){assert.ok(day.activities.every(a=>a.end<=day.endMinute));assert.equal(day.activities.filter(a=>a.localPause).length,1);assert.ok(day.activities.every(a=>!a.placeId||a.snapshot.fact));assert.ok(day.warnings.some(w=>w.includes('營業時段待確認')));assert.ok(day.segments.every(s=>s.status==='預估資料'));}
 assert.ok(!JSON.stringify(trip).includes('範例食堂'));
 const restored=importTrips(JSON.stringify(trip));assert.equal(restored[0].days.length,3);assert.equal(restored[0].days[0].activities[0].snapshot.fact.license,'CC0-1.0');assert.equal(restored[0].totalPerPerson,trip.totalPerPerson);
});
test('來源缺漏時不悄悄產生看似完整的三日行程',()=>{
 assert.throws(()=>createFirstTrip({start:'2026-11-01',people:1},places.filter(p=>p.id!=='grand-palace')),/缺少已收錄的基本來源/);
});
