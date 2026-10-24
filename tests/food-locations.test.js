import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {realFoodPlaces,foodLocations,foodLocationSources} from '../src/data/food-guides.js';import {places} from '../src/data/catalog.js';
import {blankTrip,makeActivity,recalculateTrip,generateTrip,isSourcedPlace} from '../src/services/planner.js';import {importTrips,writeTrips,readTrips,validateTrip} from '../src/services/trip-storage.js';
test('五個概略定位可追溯到新指南版本，一個未知；不更新舊餐點日期及營運欄位',()=>{
 assert.equal(realFoodPlaces.filter(p=>Number.isFinite(p.lat)).length,5);assert.equal(realFoodPlaces.find(p=>p.id==='food-som-tam-nua').lat,null);
 const license=readFileSync('public/content-licenses.txt','utf8');
 for(const p of realFoodPlaces){const r=foodLocations[p.id],s=p.foodGuide.coordinateReference.source;assert.equal(s.license,'CC-BY-SA-4.0');assert.equal(s.reviewedAt,'2026-10-25');assert.equal(p.foodGuide.reviewedAt,'2026-10-06');assert.equal(p.confirmedAt,null);assert.equal(p.cost,null);assert.equal(p.planningEligible,false);assert.equal(p.accessibility,null);assert.equal(p.foodGuide.hours,null);assert.equal(p.foodGuide.price,null);assert.equal(p.foodGuide.official,null);assert.equal(isSourcedPlace(p),false);assert.ok(license.includes(String(s.revision)));assert.ok(s.authors&&s.modified&&s.historyUrl);assert.ok(r.sourceAddress);assert.equal(p.lat,r.coordinate?.lat??null);assert.equal(p.lng,r.coordinate?.lng??null);}
 assert.equal(Object.keys(foodLocationSources).length,4);assert.equal(foodLocations['food-wattana-panich'].sourceUpdatedAt,'2025-01-02');
});
test('新定位手動快照、未知費用、匯入與舊未知快照並存，不自動遷移舊行程',()=>{
 const fresh=blankTrip({start:'2026-11-01',days:1,people:2});fresh.days[0].activities=realFoodPlaces.map(p=>makeActivity(p));const current=recalculateTrip(fresh,places);validateTrip(current);
 const backup=importTrips(JSON.stringify(current))[0];assert.equal(backup.days[0].activities.filter(a=>Number.isFinite(a.snapshot.lat)).length,5);assert.equal(backup.days[0].activities.filter(a=>a.cost===null).length,6);assert.equal(backup.days[0].activities[0].snapshot.foodGuide.coordinateReference.source.revision,5394401);
 const legacy=structuredClone(current);legacy.id='legacy-food';for(const a of legacy.days[0].activities){a.snapshot.lat=a.snapshot.lng=null;delete a.snapshot.foodGuide.coordinateReference;}const before=JSON.stringify(legacy),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};writeTrips(storage,[legacy,current]);assert.equal(JSON.stringify(readTrips(storage)[0]),before);assert.equal(importTrips(JSON.stringify(legacy))[0].days[0].activities[0].snapshot.lat,null);
});
test('有位置但餐費及營運未知的餐廳仍不自動安排，沒有把未知當免費',()=>{
 for(const dataMode of ['real','demo',undefined]){const t=generateTrip({start:'2026-11-01',days:3,people:2,dataMode,must:[realFoodPlaces[0].id]},places);assert.ok(!t.days.flatMap(d=>d.activities).some(a=>a.snapshot?.foodGuide));assert.ok(t.unassigned.some(p=>p.id===realFoodPlaces[0].id));}
});
test('頁面、地圖署名及列印保留舊新兩版本，未知位置不冒充定位',async()=>{
 const {createServer}=await import('vite');const server=await createServer({optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',logLevel:'error'});try{
 const React=await import('react'),{renderToStaticMarkup}=await import('react-dom/server'),{MemoryRouter}=await import('react-router-dom');const {FoodGuideDetail}=await server.ssrLoadModule('/src/components/FoodGuide.jsx'),{FoodLocationCredit}=await server.ssrLoadModule('/src/components/FoodLocationCredit.jsx'),{TripPrint}=await server.ssrLoadModule('/src/components/TripPrint.jsx');const render=(c,props)=>renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(c,props)));
 const p=realFoodPlaces[0],detail=render(FoodGuideDetail,{place:p});for(const text of ['13.752818','2026-10-25','2026-10-06','5394401','5348590','CC BY-SA 4.0','入口／無障礙'])assert.ok(detail.includes(text),text);assert.ok(render(FoodGuideDetail,{place:realFoodPlaces[2]}).includes('來源未提供，不填入猜測值'));
 const t=blankTrip({start:'2026-11-01',days:1,people:2});t.days[0].activities=[makeActivity(p)];const ready=recalculateTrip(t,places),before=JSON.stringify(ready);const print=render(TripPrint,{trip:ready});assert.ok(print.includes('5394401')&&print.includes('5348590'));assert.ok(print.includes('CC BY-SA 4.0'));const credit=render(FoodLocationCredit,{activities:ready.days[0].activities});assert.ok(credit.includes('5394401')&&credit.includes('作者與編輯歷史'));assert.equal(JSON.stringify(ready),before);
 }finally{await server.close();}
});
