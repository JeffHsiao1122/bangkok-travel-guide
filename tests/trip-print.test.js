import test from 'node:test';
import assert from 'node:assert/strict';
import {places} from '../src/data/catalog.js';
import {blankTrip,makeActivity,recalculateTrip} from '../src/services/planner.js';

test('列印保留所有日期、每日預算、收合提醒及未知費用，不依目前畫面或改寫行程',async()=>{
 const {createServer}=await import('vite');const server=await createServer({optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',logLevel:'error'});
 try{
  const React=await import('react'),{renderToStaticMarkup}=await import('react-dom/server');const {TripPrint}=await server.ssrLoadModule('/src/components/TripPrint.jsx');
  let trip=blankTrip({start:'2026-11-01',days:3,people:2,startTime:'09:00',endTime:'20:00',area:'暹羅',mode:'transit'});
  trip.days[1].activities=[makeActivity(places.find(place=>place.foodGuide))];trip=recalculateTrip(trip,places);trip.days[2].warnings.push('第三天不可遺漏的提醒');trip.options.note='完整旅程備註';
  const before=structuredClone(trip);const html=renderToStaticMarkup(React.createElement(TripPrint,{trip}));
  for(const day of trip.days)assert.ok(html.includes(day.date));assert.equal((html.match(/class="print-day"/g)??[]).length,3);
  assert.ok(html.includes('第三天不可遺漏的提醒'));assert.ok(html.includes('完整旅程備註'));assert.ok(html.includes('1 項活動費用待確認'));
  assert.ok(html.includes('尚未填寫'));assert.ok(html.includes('作者與編輯歷史'));assert.ok(html.includes('CC BY-SA 4.0'));assert.ok(html.includes('https://creativecommons.org/licenses/by-sa/4.0/'));
  assert.doesNotMatch(html,/<(?:input|select|button|details)\b/);assert.deepEqual(trip,before);
 }finally{await server.close();}
});
