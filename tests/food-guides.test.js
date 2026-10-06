import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {places} from '../src/data/catalog.js';
import {foodGuides,foodSources,realFoodPlaces,filterFood} from '../src/data/food-guides.js';
import {blankTrip,makeActivity,recalculateTrip,generateTrip,regenerateDay} from '../src/services/planner.js';
import {writeTrips,readTrips,importTrips,validateTrip} from '../src/services/trip-storage.js';
const options={start:'2026-11-01',days:3,people:2,startTime:'09:00',endTime:'20:00'};
function mealTrip(){const t=blankTrip(options);t.days[0].activities.push(makeActivity(realFoodPlaces[0]));return recalculateTrip(t,places);}
test('六個店家參考與來源日期分開，未知營運欄位不編造',()=>{
 assert.equal(foodGuides.length,6);assert.equal(new Set(places.map(p=>p.id)).size,43);
 const notice=readFileSync('public/content-licenses.txt','utf8');
 for(const p of realFoodPlaces){
  assert.equal(p.cost,null);assert.equal(p.lat,null);assert.equal(p.lng,null);assert.equal(p.confirmedAt,null);assert.equal(p.planningEligible,false);
  assert.equal(p.foodGuide.hours,null);assert.equal(p.foodGuide.price,null);assert.equal(p.foodGuide.official,null);assert.equal(p.accessibility,null);
  const s=p.foodGuide.source;assert.equal(s.license,'CC-BY-SA-4.0');assert.equal(s.reviewedAt,'2026-10-06');
  assert.ok(s.authors&&s.modified&&s.historyUrl);assert.ok(notice.includes(s.url)&&notice.includes(s.historyUrl)&&notice.includes(String(s.revision)));
 }
 assert.equal(Object.values(foodSources).length,4);assert.equal(foodGuides.filter(g=>g.sourceUpdatedAt!==null).length,1);
 assert.equal(foodGuides.at(-1).sourceUpdatedAt,'2025-01');
});
test('店家與示範篩選、餐點／地址／別名搜尋正確，原資料保留',()=>{
 assert.equal(filterFood(places).length,6);assert.equal(filterFood(places,{data:'demo'}).length,12);assert.equal(filterFood(places,{data:'all'}).length,18);
 assert.equal(filterFood(places,{q:'  THIP  '})[0].id,'food-thip-samai');
 assert.equal(filterFood(places,{q:'Dinso'})[0].id,'food-mont-nomsod');
 assert.equal(filterFood(places,{q:'豬肉麵'})[0].id,'food-roong-roeng');
 assert.equal(filterFood(places,{q:'มนต์นมสด'})[0].id,'food-mont-nomsod');
 assert.equal(filterFood(places,{area:'素坤逸'}).length,2);
 assert.equal(filterFood(places,{category:'米其林推薦'}).length,0);
 assert.equal(filterFood(places,{area:'暹羅',category:'街頭小吃'}).length,0);
});
test('手動加入未知座標餐廳可保存、重新讀取及匯入，來源快照與未知費用保留',()=>{
 const t=mealTrip(),memory=new Map(),storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
 writeTrips(storage,[t]);const restored=readTrips(storage)[0];assert.deepEqual(restored.days[0].activities[0].snapshot,t.days[0].activities[0].snapshot);
 assert.equal(restored.days[0].activities[0].cost,null);assert.ok(restored.days[0].warnings.some(w=>w.includes('費用待確認')));
 const imported=importTrips(JSON.stringify(restored))[0];assert.notEqual(imported.id,t.id);assert.equal(imported.days[0].activities[0].snapshot.foodGuide.source.license,'CC-BY-SA-4.0');
  assert.equal(imported.days[0].activities[0].snapshot.lat,null);assert.equal(imported.days[0].activities[0].cost,null);
  imported.days[0].activities.push(makeActivity(places.find(p=>p.id==='wat-pho')));
  const withTransfer=recalculateTrip(imported,places);assert.ok(withTransfer.days[0].segments[0].unknown);assert.ok(withTransfer.days[0].warnings.some(w=>w.includes('並非已查到的路線')));
 restored.days[0].activities[0].cost=300;assert.equal(recalculateTrip(restored).totalPerPerson,300);
});
test('備份只容許成對未知或有效座標，拒絕部分未知、字串、超範圍及缺漏',()=>{
 for(const [lat,lng] of [[null,100],[13,null],['13','100'],[91,100],[13,181],[undefined,undefined]]){
  const t=mealTrip();Object.assign(t.days[0].activities[0].snapshot,{lat,lng});assert.throws(()=>validateTrip(t),/地點資料/);
 }
 const t=mealTrip();Object.assign(t.days[0].activities[0].snapshot,{lat:13.75,lng:100.5});assert.doesNotThrow(()=>validateTrip(t));
});
test('自動排程不把未知餐費當零且顯示必去未安排原因；鎖定手動餐廳仍保留',()=>{
 const t=generateTrip({...options,must:[realFoodPlaces[0].id]},places);
 assert.ok(t.days.every(d=>d.activities.every(a=>!a.snapshot?.foodGuide)));
 assert.ok(t.unassigned.some(p=>p.id===realFoodPlaces[0].id&&p.reason.includes('暫不自動安排')));
 const manual=mealTrip();manual.days[0].activities[0].locked=true;const otherDays=structuredClone(manual.days.slice(1));
 const regenerated=regenerateDay(manual,0,places);assert.deepEqual(regenerated.days.slice(1),otherDays);
 assert.ok(regenerated.days[0].activities.some(a=>a.placeId===realFoodPlaces[0].id&&a.cost===null&&a.locked));
});
test('實際元件呈現授權、未知費用與部分地圖，首頁不再精選虛構餐廳',async()=>{
 const {createServer}=await import('vite');const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',logLevel:'error'});
 try{
  const React=await import('react'),{MemoryRouter}=await import('react-router-dom'),{renderToStaticMarkup}=await import('react-dom/server');
  const {AppProvider,PlaceCard,MapView}=await server.ssrLoadModule('/src/components/shared.jsx');
  const {FoodGuideDetail}=await server.ssrLoadModule('/src/components/FoodGuide.jsx');
  const {PlacesDirectory}=await server.ssrLoadModule('/src/components/PlacesDirectory.jsx');
  const {Budget}=await server.ssrLoadModule('/src/pages/Trips.jsx');
  const {default:Home}=await server.ssrLoadModule('/src/pages/Home.jsx');
  const render=(Component,props)=>renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(AppProvider,null,React.createElement(Component,props))));
  for(const p of realFoodPlaces){const html=render(FoodGuideDetail,{place:p});assert.ok(html.includes('CC BY-SA 4.0')&&html.includes('作者與編輯歷史'));assert.ok(html.includes('餐費／價格區間'));assert.ok(!html.includes('00:00–24:00'));assert.ok(!html.includes('CC0'));assert.ok(!/href="[^\"]*bts\.co\.th/.test(html));}
  assert.ok(render(PlaceCard,{place:realFoodPlaces[0]}).includes('餐費 待確認'));
  const directory=render(PlacesDirectory,{food:true});assert.ok(directory.includes('找到 6 個'));assert.ok(!directory.includes('虛構餐廳範例，用來'));
  const trip=mealTrip(),map=render(MapView,{day:trip.days[0]});assert.ok(map.includes('座標待確認'));assert.ok(map.includes('313%20Maha%20Chai'));assert.ok(!map.includes('<polyline'));
  assert.ok(render(Budget,{trip}).includes('1 項活動費用待確認'));
  const home=render(Home);assert.ok(home.includes('food-thip-samai'));assert.ok(home.includes('指南參考／營運待確認'));
 }finally{await server.close();}
});
