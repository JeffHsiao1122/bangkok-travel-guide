import test from 'node:test';
import assert from 'node:assert/strict';
import {places,templates} from '../src/data/catalog.js';
import {createRecommendedTrip} from '../src/services/recommended-trip.js';
import {importTrips,validateTrip,writeTrips,readTrips} from '../src/services/trip-storage.js';
import {addDays} from '../src/services/planner.js';
test('3–7 日範本跨月日期正確、只用有來源地點且無重複，不變更來源與資料庫',()=>{
 const before=JSON.stringify(places);
 for(const template of templates){
  const trip=createRecommendedTrip(template,{start:'2026-12-29',people:2,mode:'transit'},places);
  validateTrip(trip);assert.equal(trip.days.length,template.days);assert.equal(trip.end,addDays(trip.start,template.days-1));
  const visits=trip.days.flatMap(d=>d.activities).filter(a=>a.placeId);
  assert.equal(new Set(visits.map(a=>a.placeId)).size,visits.length);
  for(const a of visits){const p=places.find(p=>p.id===a.placeId);assert.deepEqual(a.snapshot.fact,p.fact);assert.equal(a.snapshot.confirmedAt,null);assert.equal(a.snapshot.hoursStatus,'待確認');assert.equal(a.snapshot.ticketStatus,'待確認');assert.equal(a.cost,p.cost);}
  assert.ok(trip.days.every(d=>d.activities.every(a=>a.end<=d.endMinute)));
  assert.ok(trip.days.every(d=>!d.warnings.some(w=>w.includes('時間與前一活動／交通衝突'))));
  assert.ok(!JSON.stringify(trip).includes('範例食堂'));
  const restored=importTrips(JSON.stringify(trip))[0];assert.equal(restored.days.length,template.days);assert.equal(restored.totalPerPerson,trip.totalPerPerson);assert.deepEqual(restored.days.map(d=>d.activities.map(a=>a.snapshot?.fact??null)),trip.days.map(d=>d.activities.map(a=>a.snapshot?.fact??null)));
 }
 assert.equal(JSON.stringify(places),before);
});
test('六七日首尾保留抵離提醒，未知費用保持 null、不產生虛構景點與交通',()=>{
 for(const days of [6,7]){const trip=createRecommendedTrip(templates.find(t=>t.days===days),{start:'2026-11-01',people:1},places);
  for(const day of [trip.days[0],trip.days.at(-1)]){assert.equal(day.activities.length,1);assert.equal(day.activities[0].placeId,null);assert.equal(day.activities[0].cost,null);assert.equal(day.activities[0].localPause,true);assert.equal(day.segments.length,0);assert.ok(day.warnings.some(w=>w.includes('費用待確認')));}
 }
});
test('新範本保存與舊三日行程並存；讀取、複製及備份不覆寫舊資料',()=>{
 const old=createRecommendedTrip(templates[0],{start:'2026-11-01',people:2},places),before=JSON.stringify(old);
 const store=new Map(),storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 writeTrips(storage,[old]);const newer=createRecommendedTrip(templates.at(-1),{start:'2026-12-01',people:3},places);writeTrips(storage,[...readTrips(storage),newer]);
 assert.equal(JSON.stringify(readTrips(storage)[0]),before);assert.equal(readTrips(storage).length,2);
});
test('缺少已收錄地點或不支援天數會拒絕建立，不靜默改用示範資料',()=>{
 assert.throws(()=>createRecommendedTrip(templates[2],{start:'2026-11-01'},places.filter(p=>p.id!=='jim-thompson')),/缺少已收錄的基本來源/);
 assert.throws(()=>createRecommendedTrip({days:8},{start:'2026-11-01'},places),/尚無此天數/);
});
