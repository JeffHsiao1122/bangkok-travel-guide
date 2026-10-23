// Browser print QA uses existing developer tools; no PDF or browser dependency at runtime.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {places} from '../src/data/catalog.js';
import {createFirstTrip} from '../src/services/first-trip.js';
import {blankTrip,makeActivity,recalculateTrip,uid} from '../src/services/planner.js';
import {STORE_KEY,validateTrip} from '../src/services/trip-storage.js';
const base=process.env.BANGKOK_QA_URL??'http://127.0.0.1:4175/bangkok-travel-guide/';
assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname),'列印驗收只允許本機網站。');
const output=resolve(process.env.BANGKOK_QA_OUTPUT??'docs/local/pdf-qa');await mkdir(output,{recursive:true});
const settings={start:'2026-11-01',days:3,people:2,startTime:'09:00',endTime:'20:00',area:'暹羅',prefs:['觀光'],mode:'transit'};
const real=createFirstTrip(settings,places);real.name='QA 曼谷三日列印範例';real.options.note='QA 整趟行程備註：請依航班核對時間。';real.days[0].activities.push(makeActivity(places.find(place=>place.foodGuide)));
const three=recalculateTrip(real,places);three.days[1].warnings.push('QA 必要提醒：第二天資訊尚待確認。');
const empty=blankTrip({...settings,name:'QA 空白兩日列印',days:2});
const long=blankTrip({...settings,name:'QA 十四日與長備註列印',days:14});long.days.forEach((day,index)=>{day.activities=[{id:uid(),placeId:null,snapshot:null,name:`QA 自訂活動 ${index+1}`,type:'其他活動',start:600,duration:60,cost:index?100:null,unit:'person',fixed:false,locked:false,note:index===0?'長備註測試'.repeat(900)+' QA-LONG-END':'QA 活動備註'}];});const stress=recalculateTrip(long,places);
const cases=[{id:'three-day',trip:three,warning:'QA 必要提醒：第二天資訊尚待確認。',credits:true},{id:'empty-days',trip:empty},{id:'long-trip',trip:stress,longEnd:'QA-LONG-END'}];
const {chromium}=await import(process.env.BANGKOK_BROWSER_MODULE??'playwright');const browser=await chromium.launch({headless:true,...(process.env.BANGKOK_BROWSER_EXECUTABLE?{executablePath:process.env.BANGKOK_BROWSER_EXECUTABLE}:{})});
const report={cases:[],errors:[]};
try{
 for(const item of cases){
  validateTrip(item.trip);const context=await browser.newContext({viewport:{width:item.id==='empty-days'?390:1280,height:900}});await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage();page.setDefaultTimeout(8000);page.on('pageerror',e=>report.errors.push({id:item.id,message:e.message}));
  await page.goto(base);await page.locator('main h1').waitFor();await page.evaluate(({key,trip})=>localStorage.setItem(key,JSON.stringify({version:1,trips:[trip]})),{key:STORE_KEY,trip:item.trip});
  await page.goto(base+'#/my-trips/'+item.trip.id);await page.reload();await page.getByRole('heading',{name:item.trip.name,exact:true}).waitFor();
  const before=await page.evaluate(key=>localStorage.getItem(key),STORE_KEY);
  await page.getByRole('button',{name:`第 ${item.trip.days.length} 天`,exact:true}).click();await page.getByRole('button',{name:'地圖',exact:true}).click();if(item.trip.days.at(-1).activities.some(activity=>Number.isFinite(activity.snapshot?.lat)&&Number.isFinite(activity.snapshot?.lng)))await page.locator('.map-wrap').waitFor();else await page.getByRole('heading',{name:'加入有位置資料的地點後顯示示意圖',exact:true}).waitFor();
  await page.evaluate(()=>{window.__qaPrintCalls=0;const nativePrint=window.print.bind(window);window.print=()=>{window.__qaPrintCalls++;nativePrint();};});
  await page.getByRole('button',{name:'列印／另存 PDF',exact:true}).click();assert.equal(await page.evaluate(()=>window.__qaPrintCalls),1);
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.trip-print').isVisible(),true);assert.equal(await page.locator('.trip-print input,.trip-print select,.trip-print button').count(),0);
  assert.equal(await page.locator('.trip-print .print-day').count(),item.trip.days.length);
  await page.pdf({path:join(output,`${item.id}.pdf`),preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
  await page.emulateMedia({media:'screen'});assert.equal(await page.locator('.trip-print').isVisible(),false);assert.equal(await page.evaluate(key=>localStorage.getItem(key),STORE_KEY),before);
  report.cases.push({id:item.id,title:item.trip.name,dates:item.trip.days.map(day=>day.date),activities:item.trip.days.flatMap(day=>day.activities.map(activity=>activity.name)),dailyBudgets:item.trip.days.map(day=>day.perPerson),unknownCosts:item.trip.days.flatMap(day=>day.activities).filter(activity=>activity.cost===null).length,requiredWarning:item.warning??null,credits:!!item.credits,longEnd:item.longEnd??null,nativePrintCalled:true,storedTripUnchanged:true,screenRestored:true});await context.close();
 }
 assert.deepEqual(report.errors,[]);await writeFile(join(output,'manifest.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pdfs:report.cases.length,nativePrintAndStorageChecks:'passed',errors:report.errors}));
}finally{await browser.close();}
