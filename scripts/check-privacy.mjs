// Local-only privacy QA. Uses an existing Playwright installation; no packages installed.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.BANGKOK_QA_URL??'http://127.0.0.1:4175/bangkok-travel-guide/';
const origin=new URL(base).origin;
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname));
const {chromium}=await import(process.env.BANGKOK_BROWSER_MODULE??'playwright');
const browser=await chromium.launch({headless:true,...(process.env.BANGKOK_BROWSER_EXECUTABLE?{executablePath:process.env.BANGKOK_BROWSER_EXECUTABLE}:{})});
const context=await browser.newContext({viewport:{width:390,height:844}});
const marker='QA_OPTIONAL_TRAVEL_NOTE_20261023';
const violations=[],errors=[];let requests=0;
await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
context.on('request',r=>{requests++;if(new URL(r.url()).origin!==origin)violations.push('external request');if(!['GET','HEAD'].includes(r.method()))violations.push('non-read request');if((r.url()+(r.postData()??'')).includes(marker))violations.push('custom content transmitted');});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
const go=async path=>{await page.goto(base+'#'+path);await page.locator('main h1').waitFor();};
const noIdentityFields=async()=>assert.equal(await page.locator('input[type=email],input[type=tel],input[type=password],input[autocomplete=name],input[autocomplete="cc-number"]').count(),0);
try{
 await go('/planner');await noIdentityFields();assert.equal(await page.locator('meta[name=referrer]').getAttribute('content'),'no-referrer');
 assert.match(await page.locator('.privacy-note').innerText(),/請勿/);
 // No free-text entry: accept the supplied travel defaults at every step.
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'下一步',exact:true}).click();
 await page.getByRole('button',{name:'產生行程並編輯',exact:true}).click();await page.locator('.trip-name-input').waitFor();await noIdentityFields();
 assert.ok(await page.locator('.editable-activity').count()>0);
 const note=page.locator('.editable-activity').first().getByLabel('活動備註',{exact:true});
 assert.equal(await note.getAttribute('autocomplete'),'off');await note.fill(marker);
 await page.getByRole('button',{name:'儲存行程',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.editor-top small')?.textContent==='已正式儲存於此瀏覽器');
 await page.reload();await page.locator('.trip-name-input').waitFor();assert.equal(await page.locator('.editable-activity').first().getByLabel('活動備註',{exact:true}).inputValue(),marker);
 await page.getByRole('button',{name:'匯出備份',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByText('查看備份內容',{exact:true}).click();
 const raw=await dialog.locator('textarea[readonly]').inputValue();assert.ok(raw.includes(marker));await dialog.getByRole('button',{name:'關閉備份視窗',exact:true}).click();
 await go('/my-trips');assert.match(await page.locator('.privacy-note').innerText(),/請勿/);
 await page.getByLabel('匯入 JSON 備份',{exact:true}).setInputFiles({name:'synthetic-privacy.json',mimeType:'application/json',buffer:Buffer.from(raw)});
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('bangkok-trips-v1')).trips.length===2);
 await go('/contact');await noIdentityFields();assert.equal(await page.locator('main form,main input,main textarea').count(),0);
 await go('/privacy');assert.match(await page.locator('main').innerText(),/IP/);
 for(const path of ['/privacy','/planner','/my-trips']){await go(path);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.deepEqual(violations,[]);assert.deepEqual(errors,[]);
 const report={date:'2026-10-23',scope:'isolated localhost browser, synthetic travel text only',checks:{noIdentityEntryRequired:true,defaultPlannerCompletes:true,optionalTextPreservedLocally:true,exportAndImportLocal:true,noObservedExternalOrWriteRequests:true,noCustomTextInRequests:true,noReferrerMeta:true,mobileOverflowAbsent:true},requests,errors,limitations:'Only tested flows; optional text can contain accidental personal data. Hosting and external sites have their own policies.'};
 await mkdir('docs/local/privacy-qa',{recursive:true});await writeFile('docs/local/privacy-qa/results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await context.close();await browser.close();}
