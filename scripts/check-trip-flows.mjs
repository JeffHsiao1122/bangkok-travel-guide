// Optional developer QA: uses an existing Playwright installation and an isolated browser.
// Set BANGKOK_BROWSER_MODULE and BANGKOK_BROWSER_EXECUTABLE when using bundled tools.
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {places,accommodations,transport,airlines,areas,lounges,demoLounges,templates,publicRoutes} from '../src/data/catalog.js';
import {STORE_KEY,DRAFT_KEY,validateTrip} from '../src/services/trip-storage.js';
const base=process.env.BANGKOK_QA_URL??'http://127.0.0.1:4175/bangkok-travel-guide/';
const origin=new URL(base).origin;
assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname),'此測試只允許本機網站，以免誤操作正式網站資料。');
const output=resolve(process.env.BANGKOK_QA_OUTPUT??'docs/local/core-acceptance');
await mkdir(output,{recursive:true});
const {chromium}=await import(process.env.BANGKOK_BROWSER_MODULE??'playwright');
const browser=await chromium.launch({headless:true,...(process.env.BANGKOK_BROWSER_EXECUTABLE?{executablePath:process.env.BANGKOK_BROWSER_EXECUTABLE}:{})});
const report={scope:'本機隔離瀏覽器／合成測試行程',cases:[],routes:[],errors:[]};
const go=async(page,path)=>{await page.goto(base+'#'+path,{waitUntil:'domcontentloaded'});await page.waitForURL(base+'#'+path);await page.locator('main h1').waitFor({state:'attached'});};
const trips=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{"version":1,"trips":[]}').trips,STORE_KEY);
const count=async(page,selector,n)=>page.waitForFunction(({selector,n})=>document.querySelectorAll(selector).length===n,{selector,n});
const waitTrips=async(page,n)=>page.waitForFunction(({key,n})=>JSON.parse(localStorage.getItem(key)||'{"trips":[]}').trips.length===n,{key:STORE_KEY,n});
const waitEditor=async page=>page.locator('.trip-name-input').waitFor();
const saveEditor=async page=>{await page.getByRole('button',{name:'儲存行程',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.editor-top small')?.textContent==='已正式儲存於此瀏覽器');};
const recommended=async page=>{await go(page,'/trips/bangkok-3');await page.getByRole('button',{name:'使用此行程並修改',exact:true}).click();await waitEditor(page);return (await trips(page))[0];};
async function check(name,fn,width=1280){
 const context=await browser.newContext({viewport:{width,height:900},acceptDownloads:true});
 await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
 const page=await context.newPage();page.setDefaultTimeout(8000);const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 // Only synthetic data is present; a reload must not get stuck on beforeunload prompts.
 page.on('dialog',dialog=>dialog.accept());
 try{await fn(page);assert.deepEqual(errors,[]);report.cases.push({name,width,pass:true});console.log(name+'：通過');}
 catch(e){report.cases.push({name,width,pass:false,error:e.message});console.log(name+'：失敗／'+e.message);}
 finally{report.errors.push(...errors.map(message=>({name,message})));await context.close();}
}
try{
 for(const width of [390,1280])await check(`日期延長後撤銷不會停在已移除的日期（${width}）`,async page=>{
  const original=await recommended(page);
  await page.getByRole('button',{name:'行程設定與日期',exact:true}).click();await page.getByLabel('回程日期',{exact:true}).fill('2026-11-04');
  await page.getByRole('button',{name:/^第 4 天/}).click();await page.getByRole('button',{name:'撤銷上次修改',exact:true}).click();
  await count(page,'.trip-name-input',1);await count(page,'.editor-page > .day-tabs button',3);
  assert.match(await page.locator('.editor-page > .day-tabs .selected').innerText(),/第 3 天/);
  await saveEditor(page);await page.reload();await waitEditor(page);
  const saved=(await trips(page))[0];assert.equal(saved.days.length,3);assert.deepEqual(saved.days,original.days);validateTrip(saved);
  await page.screenshot({path:join(output,`editor-${width}.png`),fullPage:true});
 },width);
 await check('自動排程、必去／排除、活動編輯、排序、跨日、鎖定重排與保存',async page=>{
  await go(page,'/planner');await page.getByLabel('行程名稱',{exact:true}).fill('QA 自動排程');await page.getByRole('combobox',{name:/^旅遊天數/}).selectOption('3');
  await page.getByRole('button',{name:'下一步',exact:true}).click();await page.getByRole('heading',{name:'選擇你喜歡的曼谷',exact:true}).waitFor();
  await page.getByRole('button',{name:'下一步',exact:true}).click();await page.getByRole('heading',{name:'為旅程保留預算',exact:true}).waitFor();
  await page.getByLabel('每日預算上限',{exact:true}).fill('2200');
  await page.getByRole('group',{name:'必去景點與指定餐廳',exact:true}).getByLabel(places.find(p=>p.id==='wat-pho').name,{exact:true}).check();
  await page.getByRole('group',{name:'不想去的地點',exact:true}).getByLabel(places.find(p=>p.id==='grand-palace').name,{exact:true}).check();
  await page.getByRole('button',{name:'下一步',exact:true}).click();await page.getByRole('button',{name:'產生行程並編輯',exact:true}).click();await waitEditor(page);
  let saved=(await trips(page))[0];const activities=saved.days.flatMap(d=>d.activities);
  assert.ok(activities.some(a=>a.placeId==='wat-pho'));assert.ok(!activities.some(a=>a.placeId==='grand-palace'));assert.ok(saved.days.every(d=>d.perPerson<=2200));
  const row=page.locator('.editable-activity').first(),first=await row.locator('h3').innerText(),second=await page.locator('.editable-activity').nth(1).locator('h3').innerText();
  await row.getByRole('button',{name:'下移',exact:true}).click();await page.waitForFunction(text=>document.querySelector('.editable-activity h3')?.textContent===text,second);
  await page.getByRole('button',{name:'撤銷上次修改',exact:true}).click();await page.waitForFunction(text=>document.querySelector('.editable-activity h3')?.textContent===text,first);
  await row.getByRole('combobox',{name:`移動 ${first} 到其他天`,exact:true}).selectOption('1');
  await page.waitForFunction(text=>document.querySelector('.editable-activity h3')?.textContent!==text,first);
  await page.getByRole('button',{name:'撤銷上次修改',exact:true}).click();await page.waitForFunction(text=>document.querySelector('.editable-activity h3')?.textContent===text,first);
  await row.getByLabel('停留分鐘',{exact:true}).fill('75');await row.getByLabel('停留分鐘',{exact:true}).press('Tab');
  await row.getByLabel('活動備註',{exact:true}).fill('QA 活動備註');await row.getByLabel('鎖定',{exact:true}).check();await saveEditor(page);
  const before=(await trips(page))[0],locked=before.days[0].activities[0];assert.equal(locked.duration,75);assert.equal(locked.note,'QA 活動備註');
  await page.getByRole('button',{name:'重新安排這一天',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'確認重新安排',exact:true}).click();
  await page.getByRole('dialog').waitFor({state:'hidden'});await saveEditor(page);saved=(await trips(page))[0];
  assert.deepEqual(saved.days.slice(1),before.days.slice(1));assert.deepEqual(saved.days[0].activities.find(a=>a.id===locked.id),locked);
  await page.getByRole('button',{name:'地圖',exact:true}).click();await page.locator('.map-wrap').waitFor();
  await page.getByRole('button',{name:'預算',exact:true}).click();await page.getByRole('heading',{name:'旅程預算',exact:true}).waitFor();
  await page.reload();await waitEditor(page);saved=(await trips(page))[0];validateTrip(saved);assert.equal(saved.days[0].activities.find(a=>a.id===locked.id).note,'QA 活動備註');
 });
 await check('JSON 真實下載與檔案匯入、錯誤匯入保留資料、複製／刪除／清除確認',async page=>{
  const original=await recommended(page);await page.getByRole('button',{name:'匯出備份',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();
  await dialog.getByText('查看備份內容',{exact:true}).click();const raw=await dialog.locator('textarea[readonly]').inputValue();assert.equal(JSON.parse(raw).id,original.id);
  const [download]=await Promise.all([page.waitForEvent('download'),dialog.getByRole('link',{name:'下載 JSON 檔案',exact:true}).click()]);
  const path=join(output,'synthetic-trip-backup.json');await download.saveAs(path);assert.deepEqual(JSON.parse(await readFile(path,'utf8')),JSON.parse(raw));
  await dialog.getByRole('button',{name:'關閉備份視窗',exact:true}).click();await go(page,'/my-trips');
  await page.getByLabel('匯入 JSON 備份',{exact:true}).setInputFiles({name:'qa-backup.json',mimeType:'application/json',buffer:Buffer.from(raw)});await waitTrips(page,2);await count(page,'.grid > .info-card',2);
  const restored=await trips(page);assert.ok(restored.some(t=>t.id===original.id));const copy=restored.find(t=>t.id!==original.id);validateTrip(copy);assert.notEqual(copy.days[0].activities[0].id,original.days[0].activities[0].id);
  const beforeInvalid=await page.evaluate(key=>localStorage.getItem(key),STORE_KEY);
  await page.getByLabel('匯入 JSON 備份',{exact:true}).setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});await page.getByText(/匯入失敗：/).waitFor();assert.equal(await page.evaluate(key=>localStorage.getItem(key),STORE_KEY),beforeInvalid);
  await page.locator('.info-card').first().getByRole('button',{name:'複製',exact:true}).click();await waitTrips(page,3);await count(page,'.grid > .info-card',3);
  await page.locator('.info-card').first().getByRole('button',{name:'刪除',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'取消，保留原內容',exact:true}).click();assert.equal((await trips(page)).length,3);
  await page.locator('.info-card').first().getByRole('button',{name:'刪除',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'確認刪除',exact:true}).click();await waitTrips(page,2);await page.reload();await count(page,'.grid > .info-card',2);
  await go(page,'/privacy');await page.getByRole('button',{name:'清除本站本機行程與草稿',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'取消，保留原內容',exact:true}).click();assert.equal((await trips(page)).length,2);
  await page.getByRole('button',{name:'清除本站本機行程與草稿',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'確認清除',exact:true}).click();
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),STORE_KEY),null);assert.equal(await page.evaluate(key=>localStorage.getItem(key),DRAFT_KEY),null);
 });
 await check('空白行程、自訂活動、縮短日期確認、撤銷與草稿還原',async page=>{
  await go(page,'/my-trips/new');await page.getByLabel('行程名稱',{exact:true}).fill('QA 空白行程');await page.getByRole('combobox',{name:/^旅遊天數/}).selectOption('2');
  for(const heading of ['選擇你喜歡的曼谷','為旅程保留預算','檢查你的需求']){await page.getByRole('button',{name:'下一步',exact:true}).click();await page.getByRole('heading',{name:heading,exact:true}).waitFor();}
  await page.getByRole('button',{name:'建立空白行程',exact:true}).click();await waitEditor(page);await count(page,'.editable-activity',0);
  await page.getByText('新增自訂活動',{exact:true}).click();await page.getByLabel('自訂活動名稱',{exact:true}).fill('QA 自訂休息');await page.getByRole('button',{name:'加入自訂活動',exact:true}).click();await count(page,'.editable-activity',1);
  await page.getByRole('button',{name:/^第 2 天/}).click();await count(page,'.editable-activity',0);await page.getByLabel('自訂活動名稱',{exact:true}).fill('QA 第二天活動');await page.getByRole('button',{name:'加入自訂活動',exact:true}).click();await count(page,'.editable-activity',1);await saveEditor(page);
  let saved=(await trips(page))[0];assert.equal(saved.days[0].activities[0].cost,null);assert.equal(saved.days[1].activities[0].name,'QA 第二天活動');
  await page.getByRole('button',{name:'行程設定與日期',exact:true}).click();await page.getByLabel('回程日期',{exact:true}).fill('2026-11-01');await page.getByRole('dialog').getByRole('button',{name:'取消，保留原內容',exact:true}).click();await count(page,'.editor-page > .day-tabs button',2);
  await page.getByLabel('回程日期',{exact:true}).fill('2026-11-01');await page.getByRole('dialog').getByRole('button',{name:'確認縮短日期',exact:true}).click();await count(page,'.editor-page > .day-tabs button',1);
  await page.getByRole('button',{name:'撤銷上次修改',exact:true}).click();await count(page,'.editor-page > .day-tabs button',2);await page.getByRole('button',{name:/^第 2 天/}).click();await page.locator('.editable-activity').getByRole('heading',{name:'QA 第二天活動',exact:true}).waitFor();
  await page.getByRole('button',{name:'移除 QA 第二天活動',exact:true}).click();await count(page,'.editable-activity',0);await page.getByRole('button',{name:'撤銷上次修改',exact:true}).click();await count(page,'.editable-activity',1);
  await page.locator('.editable-activity').getByLabel('活動備註',{exact:true}).fill('QA 草稿還原');await page.waitForFunction(()=>document.querySelector('.editor-top small')?.textContent.includes('草稿已保存於此瀏覽器'));
  assert.equal((await trips(page))[0].days[1].activities[0].note,'');await page.reload();await waitEditor(page);await page.getByRole('button',{name:/^第 2 天/}).click();assert.equal(await page.locator('.editable-activity').getByLabel('活動備註',{exact:true}).inputValue(),'QA 草稿還原');await saveEditor(page);
  saved=(await trips(page))[0];assert.equal(saved.days[1].activities[0].note,'QA 草稿還原');validateTrip(saved);
 });
 await check('全站公開頁面、圖片、未知路由與三種螢幕寬度',async page=>{
  const paths=[...new Set([...publicRoutes.map(([path])=>path),...places.map(p=>`/travel/${p.type==='餐廳'?'food':'attractions'}/${p.id}`),...accommodations.map(p=>`/travel/accommodation/${p.id}`),'/travel/accommodation/compare',...transport.map(p=>`/travel/transportation/${p.id}`),...airlines.map(p=>`/travel/airlines/${p.id}`),...areas.map(area=>`/travel/areas/${encodeURIComponent(area)}`),...[...lounges,...demoLounges].map(p=>`/lounges/${p.id}`),...templates.map(p=>`/trips/${p.id}`)])];
  for(const width of [390,768,1280]){
   await page.setViewportSize({width,height:900});
   for(const path of paths){
    await go(page,path);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    assert.equal(await page.locator('main h1').count(),1,path);assert.doesNotMatch(await page.locator('main h1').innerText(),/找不到/,path);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${path} ${width} overflow`);
    await page.waitForFunction(()=>[...document.images].every(img=>img.complete));assert.equal(await page.locator('img').evaluateAll(images=>images.some(img=>img.naturalWidth===0)),false,`${path} 圖片失效`);
    assert.equal(await page.locator('a[href*="credit-cards"],a[href*="lounge-finder"]').count(),0,path);
    report.routes.push({path,width,pass:true});
   }
  }
  await page.setViewportSize({width:390,height:844});await go(page,'/');await page.getByRole('button',{name:'開啟導覽選單',exact:true}).click();await page.getByRole('navigation',{name:'主要導覽'}).getByRole('link',{name:'推薦行程',exact:true}).click();await page.waitForURL(base+'#/trips');assert.equal(await page.getByRole('button',{name:'開啟導覽選單',exact:true}).getAttribute('aria-expanded'),'false');
  await go(page,'/qa-unknown-route');assert.match(await page.locator('main h1').innerText(),/找不到/);
 });
}finally{
 await browser.close();await writeFile(join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({cases:report.cases,routeChecks:report.routes.length,errors:report.errors},null,2));
 if(report.cases.some(test=>!test.pass)||report.errors.length)process.exitCode=1;
}
