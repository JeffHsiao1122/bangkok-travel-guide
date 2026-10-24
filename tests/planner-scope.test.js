import test from 'node:test';
import assert from 'node:assert/strict';
import {places,templates} from '../src/data/catalog.js';
import {generateTrip,regenerateDay,isSourcedPlace,normaliseOptions,makeActivity,recalculateTrip,addDays} from '../src/services/planner.js';
import {createRecommendedTrip} from '../src/services/recommended-trip.js';
import {validateTrip,importTrips,readTrips,writeTrips} from '../src/services/trip-storage.js';
const defaults={start:'2026-11-01',days:5,people:2,prefs:['觀光','美食','文化體驗','購物'],dataMode:'real'};
test('有來源模式跨日期、人數、交通、預算只使用既有基本來源，不以示範填滿',()=>{
 const before=JSON.stringify(places);
 for(const days of [1,3,7,14])for(const offset of [0,1,5])for(const mode of ['transit','taxi'])for(const people of [1,3])for(const budget of [0,700,3000]){
  const t=generateTrip({...defaults,days,start:addDays(defaults.start,offset),mode,people,dailyBudget:budget,totalBudget:budget*days},places);validateTrip(t);
  const ids=[];for(const d of t.days){assert.ok(d.perPerson<=budget);for(const a of d.activities){if(a.placeId){ids.push(a.placeId);assert.ok(isSourcedPlace(a.snapshot));assert.equal(a.snapshot.hoursStatus,'待確認');assert.equal(a.snapshot.confirmedAt,null);}else{assert.equal(a.localPause,true);assert.match(a.name,/自行選擇/);}assert.ok(a.end<=d.endMinute);}}
  assert.equal(new Set(ids).size,ids.length);assert.ok(t.totalPerPerson<=budget*days);
 }
 assert.equal(JSON.stringify(places),before);
});
test('資料不足的長行程保留空白日；示範必去有清楚原因，排除仍有效',()=>{
 const t=generateTrip({...defaults,days:14,must:['flower-market'],excluded:['wat-pho']},places);
 assert.ok(t.days.some(d=>d.activities.length===0&&d.reasons.some(r=>r.includes('資料範圍'))));assert.ok(t.unassigned.some(p=>p.id==='flower-market'&&p.reason.includes('有基本來源')));
 assert.ok(!t.days.flatMap(d=>d.activities).some(a=>['flower-market','wat-pho'].includes(a.placeId)));
 const real=generateTrip({...defaults,days:1,must:['wat-pho']},places);assert.ok(real.days[0].activities.some(a=>a.placeId==='wat-pho'));
});
test('示範模式保留原體驗能力，明確標示虛構資料；無範圍的舊設定不改寫',()=>{
 const t=generateTrip({...defaults,days:1,dataMode:'demo',must:['flower-market']},places);assert.ok(t.days[0].activities.some(a=>a.placeId==='flower-market'));assert.ok(t.reasons.some(r=>r.includes('虛構')));
 const legacy={...defaults};delete legacy.dataMode;const old=generateTrip({...legacy,days:1,must:['flower-market']},places);assert.equal(old.options.dataMode,undefined);assert.ok(old.days[0].activities.some(a=>a.placeId==='flower-market'));
 const map=new Map(),s={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};writeTrips(s,[old]);assert.deepEqual(readTrips(s)[0],old);assert.ok(!Object.hasOwn(readTrips(s)[0].options,'dataMode'));
});
test('單日重排沿用資料範圍，其他天與鎖定手動範例不變',()=>{
 let t=generateTrip({...defaults,days:3},places);const other=JSON.stringify(t.days.slice(1));const manual=makeActivity(places.find(p=>p.id==='flower-market'),1100);manual.locked=true;manual.fixed=true;t.days[0].activities=[manual];t=recalculateTrip(t,places);
 const copy=JSON.stringify(t);const r=regenerateDay(t,0,places);assert.equal(JSON.stringify(t),copy);assert.equal(JSON.stringify(r.days.slice(1)),other);assert.deepEqual(r.days[0].activities.find(a=>a.id===manual.id),t.days[0].activities[0]);assert.ok(r.days[0].activities.filter(a=>a.placeId&&a.id!==manual.id).every(a=>isSourcedPlace(a.snapshot)));assert.equal(r.options.dataMode,'real');
});
test('六七日推薦副本及所有新推薦重排不會補入範例地點',()=>{
 for(const template of templates){const t=createRecommendedTrip(template,{start:defaults.start,people:2},places);assert.equal(t.options.dataMode,'real');const r=regenerateDay(t,0,places);assert.ok(r.days[0].activities.filter(a=>a.placeId).every(a=>isSourcedPlace(a.snapshot)));assert.deepEqual(r.days.slice(1),t.days.slice(1));}
});
test('有來源模式備份往返保持範圍與來源，非法範圍拒絕而非悄悄退回示範',()=>{
 const t=generateTrip(defaults,places);const restored=importTrips(JSON.stringify(t))[0];assert.equal(restored.options.dataMode,'real');assert.deepEqual(restored.days.map(d=>d.activities.map(a=>a.snapshot?.fact??null)),t.days.map(d=>d.activities.map(a=>a.snapshot?.fact??null)));
 for(const dataMode of ['all','',null,{},[],123]){assert.throws(()=>normaliseOptions({...defaults,dataMode}),/資料範圍/);const bad=structuredClone(t);bad.options.dataMode=dataMode;assert.throws(()=>importTrips(JSON.stringify(bad)),/資料範圍/);}
});
test('無障礙未知與深夜抵離限制仍保留空檔，不假裝真實地點即可搭配',()=>{
 for(const patch of [{accessible:true},{days:1,arrivalTime:'23:59'},{days:1,departureTime:'02:00'}]){const t=generateTrip({...defaults,...patch},places);validateTrip(t);assert.equal(t.days.flatMap(d=>d.activities).length,0);}
});
