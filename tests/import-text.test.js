import test from 'node:test';
import assert from 'node:assert/strict';
import {blankTrip,makeActivity} from '../src/services/planner.js';
import {places} from '../src/data/catalog.js';
import {importTrips,writeTrips,readTrips,STORE_KEY} from '../src/services/trip-storage.js';
const trip=()=>{const t=blankTrip({start:'2026-11-01',days:1});t.days[0].activities=[{id:'qa-custom',name:'QA 自訂活動',type:'休息',start:540,duration:60,cost:null,unit:'person',note:'',snapshot:null,placeId:null}];return t;};
test('拒絕可能破壞畫面的非文字備註與活動類別，既有行程保持原始內容',()=>{
 const memory=new Map();const storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};writeTrips(storage,[trip()]);const before=storage.getItem(STORE_KEY);
 for(const key of ['name','note','hotelNote','area','arrivalAirport','departureAirport','wake'])for(const value of [{text:'錯誤結構'},['錯誤結構'],42,true]){const bad=trip();bad.options[key]=value;assert.throws(()=>importTrips(JSON.stringify(bad)),/文字欄位/);assert.equal(storage.getItem(STORE_KEY),before);}
 for(const value of [{text:'錯誤結構'},['錯誤結構'],42,true]){const bad=trip();bad.days[0].activities[0].type=value;assert.throws(()=>importTrips(JSON.stringify(bad)),/活動資料/);}
 assert.deepEqual(readTrips(storage),[JSON.parse(before).trips[0]]);
});
test('正常自訂文字及舊版缺省類別仍可往返，未自動刪改字串或來源快照',()=>{
 const t=trip();t.options.note='旅遊備註 <img src=x onerror=alert(1)> javascript:alert(1)';t.days[0].activities[0].note='旅遊自填文字';delete t.days[0].activities[0].type;t.days[0].activities.push(makeActivity(places.find(p=>p.foodGuide)));
 const before=structuredClone(t),result=importTrips(JSON.stringify(t))[0];assert.equal(result.options.note,t.options.note);assert.equal(result.days[0].activities[0].note,t.days[0].activities[0].note);assert.deepEqual(result.days[0].activities[1].snapshot,t.days[0].activities[1].snapshot);assert.deepEqual(t,before);
});
test('多份備份中任何一筆文字結構錯誤時整批拒絕，沒有局部匯入',()=>{const good=trip(),bad=trip();bad.options.note={bad:true};assert.throws(()=>importTrips(JSON.stringify({version:1,trips:[good,bad]})),/文字欄位/);});
