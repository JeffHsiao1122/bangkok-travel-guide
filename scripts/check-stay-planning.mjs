// Local-only QA. Isolated synthetic storage; no hotel or other external requests.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {stayGuides} from '../src/data/stay-guides.js';
import {blankTrip} from '../src/services/planner.js';
const base=process.env.BANGKOK_QA_URL??'http://127.0.0.1:4175/bangkok-travel-guide/';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname));
const {chromium}=await import(process.env.BANGKOK_BROWSER_MODULE??'playwright');
const browser=await chromium.launch({headless:true,...(process.env.BANGKOK_BROWSER_EXECUTABLE?{executablePath:process.env.BANGKOK_BROWSER_EXECUTABLE}:{})});
const out='docs/local/stay-planning-qa';await mkdir(out,{recursive:true});
const report={widths:[],errors:[],unexpectedRequests:[]};
try{for(const width of [390,768,1280]){
 const context=await browser.newContext({viewport:{width,height:1000}});
 const raw=JSON.stringify({version:1,trips:[blankTrip({start:'2026-11-01',days:3,people:2})]});
 await context.addInitScript(raw=>{if(!localStorage.getItem('bangkok-trips-v1'))localStorage.setItem('bangkok-trips-v1',raw);},raw);
 await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 context.on('request',r=>{if(new URL(r.url()).origin!==new URL(base).origin||!['GET','HEAD'].includes(r.method()))report.unexpectedRequests.push(r.method());});
 const page=await context.newPage();page.setDefaultTimeout(8000);page.on('pageerror',e=>report.errors.push(e.message));
 const go=async path=>{await page.goto(base+'#'+path);await page.reload();await page.locator('main h1').waitFor();};
 const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 for(const stay of stayGuides){
  await go('/travel/accommodation/'+stay.id);await page.getByRole('heading',{name:'這間住宿怎麼評估',exact:true}).waitFor();
  const text=await page.locator('main').innerText();for(const marker of ['本站原創選房建議','2026-10-25','2026-10-23','CC BY-SA 4.0','作者與編輯歷史','房價／房型／入住人數','訂房代碼'])assert.ok(text.includes(marker));
  assert.equal(await page.locator('main input, main textarea').count(),0);await noOverflow();
  await page.getByRole('link',{name:'查看'+stay.area+'選房指南',exact:true}).click();await page.getByRole('heading',{name:stay.area+'住宿區域',exact:true}).waitFor();await noOverflow();
  await go('/travel/accommodation/'+stay.id);await page.getByRole('link',{name:'查看機場進城準備',exact:true}).click();await page.waitForURL('**#/airport-transfers');await page.getByRole('heading',{name:'落地曼谷，先把進城這一段安排好',exact:true}).waitFor();await noOverflow();
 }
 await go('/travel/accommodation?data=real');await page.getByRole('combobox',{name:'沿線交通',exact:true}).selectOption('船運');
 const cards=page.locator('main article.info-card');assert.equal(await cards.count(),2);const text=await page.locator('main').innerText();assert.match(text,/Mandarin Oriental/);assert.match(text,/Shangri-La/);assert.ok(!text.includes('Novotel'));
 await cards.nth(0).getByRole('button',{name:'加入比較',exact:true}).click();await cards.nth(1).getByRole('button',{name:'加入比較',exact:true}).click();await page.getByRole('link',{name:'比較已選住宿（2）',exact:true}).click();await page.locator('table').waitFor();await noOverflow();
 const table=await page.locator('table').innerText();assert.match(table,/Mandarin Oriental/);assert.match(table,/Shangri-La/);assert.match(table,/待確認/);await page.reload();await page.locator('table').waitFor();
 await go('/travel/accommodation?data=real&rail='+encodeURIComponent('船運')+'&area='+encodeURIComponent('暹羅'));assert.equal(await page.locator('main article.info-card').count(),0);await page.getByRole('button',{name:'重設',exact:true}).click();await page.waitForURL('**#/travel/accommodation');await page.locator('main article.info-card').first().waitFor();assert.equal(await page.locator('main article.info-card').count(),4);
 await go('/travel/accommodation/hotel-novotel-siam');const section=page.locator('section[aria-labelledby="stay-planning-title"]');await section.screenshot({path:`${out}/stay-planning-${width}.png`,style:'header,.skip{visibility:hidden!important}'});
 assert.equal(await page.evaluate(()=>localStorage.getItem('bangkok-trips-v1')),raw);
 report.widths.push({width,fourDetails:true,originalAdviceAndOldSourceDates:true,noIdentityInputs:true,areaAndAirportLinks:true,boatFilterTwoReferences:true,comparisonAndReload:true,combinedFilterAndReset:true,noOverflow:true,existingTripUnchanged:true});await context.close();
}assert.deepEqual(report.errors,[]);assert.deepEqual(report.unexpectedRequests,[]);await writeFile(out+'/results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}finally{await browser.close();}
