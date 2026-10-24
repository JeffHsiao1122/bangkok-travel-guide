// Local-only isolated browser QA; no personal data or external requests.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {templates} from '../src/data/catalog.js';
import {validateTrip} from '../src/services/trip-storage.js';
const base=process.env.BANGKOK_QA_URL??'http://127.0.0.1:4175/bangkok-travel-guide/';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname));
const {chromium}=await import(process.env.BANGKOK_BROWSER_MODULE??'playwright');
const browser=await chromium.launch({headless:true,...(process.env.BANGKOK_BROWSER_EXECUTABLE?{executablePath:process.env.BANGKOK_BROWSER_EXECUTABLE}:{})});
const out='docs/local/recommended-trips-qa';await mkdir(out,{recursive:true});
const report={widths:[],dailyViews:0,savedCopies:0,errors:[],unexpectedRequests:[]};
try{for(const width of [390,768,1280]){
 const context=await browser.newContext({viewport:{width,height:1000}});
 await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 context.on('request',r=>{if(new URL(r.url()).origin!==new URL(base).origin||!['GET','HEAD'].includes(r.method()))report.unexpectedRequests.push(r.method());});
 const page=await context.newPage();page.setDefaultTimeout(8000);page.on('pageerror',e=>report.errors.push(e.message));
 const go=async path=>{await page.goto(base+'#'+path);await page.locator('main h1').waitFor();};
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('bangkok-trips-v1')||'{"trips":[]}').trips);
 await go('/trips/bangkok-3');await page.getByRole('button',{name:'使用此行程並修改',exact:true}).click();await page.locator('.trip-name-input').waitFor();
 const old=(await saved())[0],before=await page.evaluate(()=>localStorage.getItem('bangkok-trips-v1'));
 for(const t of templates){
  await go('/trips/'+t.id);await page.getByLabel('預計出發日期',{exact:true}).fill('2026-12-29');assert.equal(await page.locator('.day-tabs button').count(),t.days);
  for(let day=0;day<t.days;day++){await page.getByRole('button',{name:`第 ${day+1} 天`,exact:true}).click();await page.locator('.timeline-heading h2').waitFor();assert.equal(await page.locator('.timeline-row').count()>0,true);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));report.dailyViews++;}
  if(t.days>=6){assert.match(await page.locator('.timeline-row').innerText(),/前往機場/);assert.match(await page.locator('.timeline-row').innerText(),/待確認/);}
 }
 assert.equal(await page.evaluate(()=>localStorage.getItem('bangkok-trips-v1')),before);
 // Switch between routes without a page reload while the selected day is out of range.
 await page.evaluate(()=>{location.hash='/trips/bangkok-3';});await page.getByRole('heading',{name:templates[0].name,exact:true}).waitFor();assert.equal(await page.locator('.day-tabs .selected').innerText(),'第 3 天');
 const date=page.getByLabel('預計出發日期',{exact:true});await date.fill('');assert.equal(await page.getByRole('button',{name:'使用此行程並修改',exact:true}).isDisabled(),true);await page.getByRole('alert').filter({hasText:'請輸入完整有效日期'}).waitFor();await date.fill('2026-12-29');assert.equal(await page.getByRole('button',{name:'使用此行程並修改',exact:true}).isEnabled(),true);
 for(const t of templates.filter(t=>t.days>3)){
  await go('/trips/'+t.id);await page.getByLabel('預計出發日期',{exact:true}).fill('2026-12-29');
  await page.getByRole('button',{name:'使用此行程並修改',exact:true}).click();await page.locator('.trip-name-input').waitFor();const trip=(await saved()).find(x=>x.days.length===t.days);validateTrip(trip);assert.equal(trip.start,'2026-12-29');assert.ok(trip.days.flatMap(d=>d.activities).every(a=>!a.placeId||a.snapshot?.fact?.license==='CC0-1.0'));
  const row=page.locator('.editable-activity').first();await row.getByLabel('活動備註',{exact:true}).fill('QA 旅遊提醒，不含個資');await page.getByRole('button',{name:'儲存行程',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.editor-top small')?.textContent==='已正式儲存於此瀏覽器');
  await page.reload();await page.locator('.trip-name-input').waitFor();assert.equal(await page.locator('.editable-activity').first().getByLabel('活動備註',{exact:true}).inputValue(),'QA 旅遊提醒，不含個資');
  await page.getByRole('button',{name:'匯出備份',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByText('查看備份內容',{exact:true}).click();const exported=JSON.parse(await dialog.locator('textarea[readonly]').inputValue());validateTrip(exported);assert.equal(exported.days.length,t.days);await dialog.getByRole('button',{name:'關閉備份視窗',exact:true}).click();report.savedCopies++;
 }
 assert.deepEqual((await saved()).find(t=>t.id===old.id),old);
 await go('/trips?days=7');assert.equal(await page.locator('.trip-card').count(),1);await page.getByRole('link',{name:'查看每日安排',exact:true}).click();await page.getByRole('heading',{name:templates.at(-1).name,exact:true}).waitFor();
 await page.getByRole('button',{name:'第 4 天',exact:true}).click();await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});await page.screenshot({path:`${out}/recommended-${width}.png`});
 await page.getByRole('link',{name:'查看地點來源與初訪指南',exact:true}).click();await page.waitForURL(base+'#/first-visit');await page.locator('main h1').waitFor();
 await go('/trips/bangkok-7');await page.getByRole('link',{name:'查看機場進城與抵離準備',exact:true}).click();await page.waitForURL(base+'#/airport-transfers');await page.locator('main h1').waitFor();
 report.widths.push({width,dailySwitching:true,invalidDateSafe:true,routeSwitchClamped:true,copiesEditable:true,reloadAndExport:true,oldTripUnchanged:true,filtersAndSourceLinks:true});await context.close();
}assert.deepEqual(report.errors,[]);assert.deepEqual(report.unexpectedRequests,[]);await writeFile(out+'/results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}finally{await browser.close();}
