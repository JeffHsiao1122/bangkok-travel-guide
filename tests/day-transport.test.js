import test from 'node:test';import assert from 'node:assert/strict';
import {dayTransportEntries,unpairedActivityCount} from '../src/services/day-transport.js';
import {firstVisitPlaces} from '../src/data/first-visit.js';import {places} from '../src/data/catalog.js';
import {blankTrip,makeActivity} from '../src/services/planner.js';
test('每日車站對照沿用活動順序、重複到訪及固定資料，不讀取私人備註或改寫快照',()=>{
 const trip=blankTrip({start:'2026-11-01',days:1,people:2});trip.days[0].activities=[makeActivity(places.find(p=>p.id==='terminal21')), {id:'pause',localPause:true,name:'午餐'},makeActivity(places.find(p=>p.id==='wat-arun')),makeActivity(places.find(p=>p.id==='terminal21'))];
 trip.days[0].activities[0].name='私人標記';trip.days[0].activities[0].note='PRIVATE_TRIP_NOTE';const before=JSON.stringify(trip);
 const entries=dayTransportEntries(trip.days[0]);assert.deepEqual(entries.map(e=>e.activityIndex),[0,2,3]);assert.deepEqual(entries.map(e=>e.placeId),['terminal21','wat-arun','terminal21']);assert.deepEqual(entries[0].stations.map(s=>s.network),['BTS','MRT']);assert.deepEqual(entries[1].stations,[]);assert.ok(!JSON.stringify(entries).includes('PRIVATE_TRIP_NOTE'));assert.ok(!JSON.stringify(entries).includes('私人標記'));assert.equal(JSON.stringify(trip),before);
});
test('全部十個地點可對照，未知活動、範例、特殊物件名稱不推測車站',()=>{
 for(const p of firstVisitPlaces){const e=dayTransportEntries({activities:[{placeId:p.id}]});assert.equal(e.length,1);assert.equal(e[0].placeId,p.id);}
 const day={activities:[{placeId:'__proto__'},{placeId:'constructor'},{placeId:'flower-market'},{placeId:null},{placeId:null,localPause:true}]};assert.deepEqual(dayTransportEntries(day),[]);assert.equal(unpairedActivityCount(day),4);assert.deepEqual(dayTransportEntries(),[]);assert.equal(unpairedActivityCount({activities:[]}),0);
});
test('實際交通卡保留分別授權、日期與未知代碼；外連不附帶行程文字',async()=>{
 const {createServer}=await import('vite');const server=await createServer({optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',logLevel:'error'});
 try{const React=await import('react'),{renderToStaticMarkup}=await import('react-dom/server'),{MemoryRouter}=await import('react-router-dom');const {default:DayTransport}=await server.ssrLoadModule('/src/components/DayTransport.jsx');
 const day={date:'2026-11-01',activities:[{placeId:'terminal21',name:'PRIVATE_NAME',note:'PRIVATE_NOTE'},{placeId:'wat-arun'},{placeId:'__proto__'},{placeId:null,localPause:true}]};const before=JSON.stringify(day);
 const html=renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(DayTransport,{day})));
 for(const word of ['Asok','Sukhumvit','CC0','CC BY-SA 4.0','作者與編輯歷史','2026-10-23','2026-10-05','代碼 待確認','不代表沒有大眾運輸','另有 1 項活動'])assert.ok(html.includes(word),word);
 for(const word of ['PRIVATE_NAME','PRIVATE_NOTE','7 SUK','destination=__proto__'])assert.ok(!html.includes(word));assert.equal(JSON.stringify(day),before);
 const empty=renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(DayTransport,{day:{date:'2026-11-01',activities:[]}})));assert.ok(empty.includes('尚無可對照'));assert.ok(!empty.includes('google.com'));
 }finally{await server.close();}
});
