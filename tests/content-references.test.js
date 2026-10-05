import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {placeReferences,railReferences,guideSources,referenceSourcesFor} from '../src/data/content-references.js';
import {places,transport} from '../src/data/catalog.js';
import originalRows from '../src/data/places.json' with {type:'json'};
import {firstVisitPlaces,openFacts} from '../src/data/first-visit.js';
import {makeActivity} from '../src/services/planner.js';
import {createFirstTrip} from '../src/services/first-trip.js';
import {importTrips} from '../src/services/trip-storage.js';

test('十個地點逐欄可追溯，未知與來源閱讀日期不冒充官方核實',()=>{
 assert.deepEqual(Object.keys(placeReferences).sort(),firstVisitPlaces.map(p=>p.id).sort());
 for(const record of [...Object.values(placeReferences),...Object.values(railReferences)]){
  for(const f of Object.values(record).filter(v=>v&&typeof v==='object'&&!Array.isArray(v))){
   assert.equal(f.confirmedAt,null);
   if(f.value===null){assert.equal(f.status,'待確認');assert.ok(f.reason);continue;}
   assert.equal(f.status,'社群指南參考');assert.ok(guideSources[f.sourceId]);assert.ok(f.section);assert.ok(f.reviewedAt);
   assert.ok(Object.hasOwn(f,'sourceUpdatedAt'));
  }
  assert.ok(referenceSourcesFor(record).length>=1);
 }
 assert.equal(placeReferences['art-center'].hours.value,null);
 assert.equal(placeReferences['chatuchak-park'].hours.value,null);
 assert.equal(placeReferences['wat-arun'].admission.value,null);
 assert.equal(railReferences.bts.fare.value,null);
 assert.equal(railReferences.mrt.fare.value,null);
 assert.equal(railReferences['red-line'].fare.value,null);
});
test('參考列價與時段不改變排程費用、時段、星期或使用者備份',()=>{
 for(const g of firstVisitPlaces){
  const p=places.find(p=>p.id===g.id),r=originalRows.find(r=>r[0]===g.id),a=makeActivity(p);
  assert.equal(p.cost,r[8]);assert.equal(p.open,r[9]*60);assert.equal(p.close,r[10]*60);
  assert.deepEqual(p.weekdays,r[12]??[0,1,2,3,4,5,6]);assert.equal(a.cost,p.planningCost);
  assert.equal(a.snapshot.hoursStatus,'待確認');assert.equal(a.snapshot.ticketStatus,'待確認');
  assert.equal(a.snapshot.reference,undefined);
 }
 const trip=createFirstTrip({start:'2026-11-01',people:2},places);
 const restored=importTrips(JSON.stringify(trip))[0];
 assert.equal(restored.totalPerPerson,trip.totalPerPerson);
 assert.ok(restored.days.every(d=>d.warnings.some(w=>w.includes('營業時段待確認'))));
});
test('兩筆泰文地址維持原 CC0 來源版本，新增紅線未知費用不當成免費',()=>{
 for(const id of ['Q873769','Q972334']){const f=openFacts[id];assert.equal(f.license,'CC0-1.0');assert.equal(f.props.P6375[0].value.language,'th');assert.ok(f.props.P6375[0].value.text.length>30);}
 assert.equal(transport.find(t=>t.id==='red-line').cost,null);
});
test('所有改寫來源保留授權、作者歷史與閱讀版本，發布授權檔包含相同內容',()=>{
 const notice=readFileSync('public/content-licenses.txt','utf8');
 for(const s of Object.values(guideSources)){assert.equal(s.license,'CC-BY-SA-4.0');assert.ok(s.authors);assert.ok(s.modified.includes('翻譯'));assert.ok(notice.includes(s.url));assert.ok(notice.includes(s.historyUrl));assert.ok(notice.includes(String(s.revision)));}
 assert.ok(notice.includes('https://creativecommons.org/licenses/by-sa/4.0/'));
});
test('實際頁面呈現逐欄日期與授權，已核實欄位仍未知，不含 BTS 外連',async()=>{
 const {createServer}=await import('vite');const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',logLevel:'error'});
 try{
  const {PlaceReference,RailReference,ContentSources}=await server.ssrLoadModule('/src/components/ContentReference.jsx');
  const {AppProvider}=await server.ssrLoadModule('/src/components/shared.jsx');
  const React=await import('react'),{MemoryRouter}=await import('react-router-dom'),{renderToStaticMarkup}=await import('react-dom/server');
  const render=(component,props)=>renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(AppProvider,null,React.createElement(component,props))));
  for(const p of firstVisitPlaces){const html=render(PlaceReference,{place:p});assert.ok(html.includes('官方核實：尚未確認')||html.includes('待確認'));assert.ok(html.includes('CC BY-SA 4.0'));assert.ok(html.includes('作者與編輯歷史'));assert.ok(html.includes('content-licenses.txt'));}
  const bacc=render(PlaceReference,{place:firstVisitPlaces.find(p=>p.id==='art-center')});assert.ok(!bacc.includes('22:00'));assert.ok(bacc.includes('暫不採用關館時間'));
  for(const id of Object.keys(railReferences)){const html=render(RailReference,{id});assert.ok(html.includes('不是')||html.includes('非即時'));assert.ok(!/href="[^"]*bts\.co\.th/.test(html));assert.ok(html.includes('各站首末班')||html.includes('當日服務'));}
  const sourceHtml=render(ContentSources);assert.ok(sourceHtml.includes('CC BY-SA 4.0'));assert.ok(sourceHtml.includes('沒有匯入'));assert.ok(!/href="[^"]*bts\.co\.th/.test(sourceHtml));
 }finally{await server.close();}
});
