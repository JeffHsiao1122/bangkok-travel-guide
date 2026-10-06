export const uid = () => globalThis.crypto.randomUUID();
export const clone = value => structuredClone(value);
export const timeText = minutes => `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
export const parseTime = value => { const match = /^(\d{2}):(\d{2})$/.exec(value??''); if(!match || +match[1]>23 || +match[2]>59) return NaN; return +match[1]*60 + +match[2]; };
export function validDate(value) { return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0,10)===value; }
export function addDays(date,n) { const d=new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate()+n); return d.toISOString().slice(0,10); }
export function dayCount(start,end) { if(!validDate(start)||!validDate(end)) return 0; return Math.round((Date.parse(end)-Date.parse(start))/86400000)+1; }
export function distance(a,b) { if(![a?.lat,a?.lng,b?.lat,b?.lng].every(Number.isFinite)) return null; const r=x=>x*Math.PI/180; return 6371*2*Math.asin(Math.sqrt(Math.sin(r(b.lat-a.lat)/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(r(b.lng-a.lng)/2)**2)); }
export function travelEstimate(a,b,mode='transit') { const km=distance(a,b); if(km===null) return {minutes:30,cost:mode==='taxi'?250:50,unit:mode==='taxi'?'車':'人',unknown:true}; const minutes=Math.ceil((km/(mode==='taxi'?22:18)*60+15)/5)*5; return {minutes,cost:mode==='taxi'?Math.ceil((60+km*15)/10)*10:Math.ceil((30+km*3)/10)*10,unit:mode==='taxi'?'車':'人',unknown:false}; }
export function normaliseOptions(raw) {
 const o={...raw}; o.days=Number(o.days??dayCount(o.start,o.end)); if(!validDate(o.start)||!Number.isInteger(o.days)||o.days<1||o.days>14) throw Error('請設定有效出發日期，行程天數為 1–14 天。');
 if(o.end&&dayCount(o.start,o.end)!==o.days) throw Error('起迄日期與旅遊天數不一致。');
 o.startMinute=parseTime(o.startTime??'09:00');o.endMinute=parseTime(o.endTime??'20:00');
 if(!Number.isFinite(o.startMinute)||!Number.isFinite(o.endMinute)||o.endMinute-o.startMinute<120) throw Error('每日結束時間至少需比開始時間晚 2 小時。');
 o.people=Number(o.people??1);o.children=Number(o.children??0); if(!Number.isInteger(o.people)||o.people<1||o.people>20||!Number.isInteger(o.children)||o.children<0||o.children>o.people) throw Error('同行總人數需為 1–20，兒童人數不得超過總人數。');
 for(const key of ['totalBudget','dailyBudget','foodBudget','transportBudget','ticketBudget','shoppingBudget','flightBudget','hotelBudget']) { if(o[key]==null||o[key]==='') o[key]=null; else {o[key]=Number(o[key]);if(!Number.isFinite(o[key])||o[key]<0) throw Error('預算必須為零或正數。');} }
 o.must=o.must??[];o.excluded=o.excluded??[];o.prefs=o.prefs??[];
 for(const key of ['must','excluded','prefs'])if(!Array.isArray(o[key])||o[key].length>100||o[key].some(v=>typeof v!=='string'||v.length>100))throw Error('偏好與地點清單格式不正確。');
 if(o.must.some(id=>o.excluded.includes(id))) throw Error('必去與排除清單有相同地點，請先移除衝突。');
 o.mode=o.mode??'transit';o.pace=o.pace??'normal';if(!['transit','taxi'].includes(o.mode)||!['relaxed','normal','busy'].includes(o.pace))throw Error('交通方式或旅遊步調格式不正確。');return o;
}
export function makeActivity(place,start=540) {return {id:uid(),placeId:place.id,name:place.name,snapshot:clone(place),start,duration:place.duration,cost:place.cost,unit:'person',locked:false,fixed:false,note:''};}
export function recalculateDay(day,options={people:1,mode:'transit'},database=[]) {
 const warnings=[];const segments=[];let cost=0; let cursor=day.startMinute??540;let previous=null;
 const activities=day.activities.map((item,index)=>{const a=clone(item);const p=a.snapshot??database.find(p=>p.id===a.placeId); const t=index&&!a.localPause?travelEstimate(previous,p,options.mode):{minutes:0,cost:0,unit:'人'};
 if(index){segments.push({from:day.activities[index-1].id,to:a.id,...t,mode:options.mode,status:'預估資料'});cost+=t.cost*(t.unit==='車'?1:Number(options.people??1));if(t.unknown)warnings.push(`${a.name}：接續交通缺少位置資料，時間與車資只是預留估算，並非已查到的路線。`);}
 if(a.fixed||a.locked) {if(a.start<cursor+t.minutes)warnings.push(`${a.name}：固定時間與前一活動／交通衝突。`);} else a.start=Math.max(cursor+t.minutes,p?.open??0);
 a.end=a.start+a.duration;cursor=a.end;if(!a.localPause)previous=p;
 if(!Number.isFinite(a.cost)){warnings.push(`${a.name}：費用待確認。`);}else cost+=a.cost*(a.unit==='group'?1:Number(options.people??1));
 const weekday=new Date(`${day.date}T12:00:00Z`).getUTCDay();
 if(p){if(p.status!=='已確認')warnings.push(`${a.name}：${p.status??'待確認'}，營業時段待確認，費用為預留估算。`);if(p.weekdays&&!p.weekdays.includes(weekday))warnings.push(`${a.name}：排程設定不包含此日；非營運公告。`);if(Number.isFinite(p.open)&&a.start<p.open||Number.isFinite(p.close)&&a.end>p.close)warnings.push(`${a.name}：超出排程設定時段；實際營業時間需另核對。`);if(p.lastEntry!=null&&a.start>p.lastEntry)warnings.push(`${a.name}：超過最後入場時間。`);}else warnings.push(`${a.name}：無營業時間，請自行確認。`);
 if(a.end>(day.endMinute??1200))warnings.push(`${a.name}：超出當日可安排時間。`);return a;});
 const perPerson=cost/Number(options.people??1);
 if(options.dailyBudget!=null&&perPerson+Number(options.shoppingBudget??0)>options.dailyBudget)warnings.push('當日預估支出加購物預留額超過每日預算。');
 return {...day,activities,segments,cost,perPerson,warnings:[...new Set(warnings)]};
}
export function recalculateTrip(trip,database=[]) {const result=clone(trip);result.days=result.days.map(d=>recalculateDay(d,result.options,database));result.estimatedGroup=result.days.reduce((n,d)=>n+d.cost,0);result.estimatedPerPerson=result.estimatedGroup/result.options.people;result.shoppingTotal=Number(result.options.shoppingBudget??0)*result.days.length;result.totalPerPerson=result.estimatedPerPerson+result.shoppingTotal+Number(result.options.flightBudget??0)+Number(result.options.hotelBudget??0);result.warnings=[];if(result.options.totalBudget!=null&&result.totalPerPerson>result.options.totalBudget)result.warnings.push('總預估支出超過總預算，請刪減活動或調整條件。');return result;}
export function generateTrip(raw,database,blocked=[]) {
 const options=normaliseOptions(raw);const used=new Set(blocked);const reasons=[];const unassigned=[];const days=[];let totalSpent=0;
 const eligible=database.filter(p=>p.planningEligible!==false&&!options.excluded.includes(p.id)&&(!options.accessible||p.accessibility===true));
 for(const id of options.must)if(!eligible.some(p=>p.id===id))unassigned.push({id,name:database.find(p=>p.id===id)?.name??id,reason:database.find(p=>p.id===id)?.planningEligible===false?'當期營業時段、餐費與位置不足，暫不自動安排；可核對後手動加入。':'必要條件、無障礙資料或地點資料不符，無法確認安排。'});
 for(let i=0;i<options.days;i++) {
  const date=addDays(options.start,i);const weekday=new Date(`${date}T12:00:00Z`).getUTCDay();let start=options.startMinute,end=options.endMinute;
  if(i===0&&options.arrivalTime){const time=parseTime(options.arrivalTime);if(!Number.isFinite(time))throw Error('抵達時間格式錯誤。');start=Math.min(1440,Math.max(start,time+150));}
  if(i===options.days-1&&options.departureTime){const time=parseTime(options.departureTime);if(!Number.isFinite(time))throw Error('起飛時間格式錯誤。');end=Math.max(0,Math.min(end,time-240));}
  let day={id:uid(),date,startMinute:start,endMinute:end,activities:[],segments:[],reasons:[]};let cursor=start;let previous=null;const target={relaxed:2,normal:3,busy:4}[options.pace]??3;
  const pool=eligible.filter(p=>!used.has(p.id)&&p.weekdays.includes(weekday));
  const rank=p=>(options.must.includes(p.id)?10000:0)+(p.tags.filter(t=>options.prefs.includes(t)).length*100)+(p.area===options.area?40:0)-(previous?(distance(previous,p)??50)*10:0);
  let stops=0,meal=false;
  while(cursor<end&&day.activities.length<10) {
   const remaining=pool.filter(p=>!used.has(p.id));remaining.sort((a,b)=>rank(b)-rank(a));
   const wantMeal=!meal&&cursor>=660;
   let candidates=remaining.filter(p=>wantMeal?p.type==='餐廳':p.type!=='餐廳'&&(options.prefs.length===0||p.tags.some(t=>options.prefs.includes(t))||options.must.includes(p.id)));
   if(stops>=target&&!wantMeal)break;
   let choice=null;
   for(const p of candidates){const t=previous?travelEstimate(previous,p,options.mode):{minutes:0,cost:0,unit:'人'};const arrival=Math.max(cursor+t.minutes,p.open); const unitCost=p.cost+t.cost/(t.unit==='車'?options.people:1); const shopping=Number(options.shoppingBudget??0); const existing=day.activities.reduce((n,a)=>n+Number(a.cost??0),0)+(day.segments??[]).reduce((n,s)=>n+s.cost/(s.unit==='車'?options.people:1),0);
    if(arrival+p.duration>end||arrival+p.duration>p.close||p.lastEntry!=null&&arrival>p.lastEntry)continue;
    if(options.dailyBudget!=null&&existing+unitCost+shopping>options.dailyBudget)continue;
    if(options.totalBudget!=null&&totalSpent+unitCost+shopping*options.days+Number(options.flightBudget??0)+Number(options.hotelBudget??0)>options.totalBudget)continue;
    if(p.type==='餐廳'&&options.foodBudget!=null&&p.cost>options.foodBudget)continue;
    if(p.type!=='餐廳'&&options.ticketBudget!=null&&p.cost>options.ticketBudget)continue;
    const transportSoFar=(day.segments??[]).reduce((n,s)=>n+s.cost/(s.unit==='車'?options.people:1),0);
    if(options.transportBudget!=null&&transportSoFar+t.cost/(t.unit==='車'?options.people:1)>options.transportBudget)continue;
    choice={p,arrival,unitCost};break;
   }
   if(!choice){if(wantMeal){const a={id:uid(),name:'用餐與休息（自行選擇）',placeId:null,snapshot:null,localPause:true,start:cursor,duration:60,cost:options.foodBudget??150,unit:'person',fixed:true,locked:false,note:'尚未指定餐廳；費用為預估。'};const mealCost=Number(a.cost); const dayCost=day.perPerson??day.activities.reduce((n,a)=>n+Number(a.cost??0),0);if(cursor+60<=end&&(options.dailyBudget==null||dayCost+mealCost+Number(options.shoppingBudget??0)<=options.dailyBudget)&&(options.totalBudget==null||totalSpent+mealCost+Number(options.shoppingBudget??0)*options.days+Number(options.flightBudget??0)+Number(options.hotelBudget??0)<=options.totalBudget)){day.activities.push(a);day=recalculateDay(day,options,database);cursor+=60;totalSpent+=mealCost;}meal=true;continue;}break;}
   const {p,arrival,unitCost}=choice; const a=makeActivity(p,arrival);a.fixed=true;day.activities.push(a);used.add(p.id);totalSpent+=unitCost;cursor=arrival+p.duration+20;previous=p;
   if(p.type==='餐廳')meal=true;else stops++;
   day=recalculateDay(day,options,database);day.reasons.push(`${p.name}：${options.must.includes(p.id)?'優先安排必去地點':`符合偏好，依${p.area}與交通距離安排`}；預留交通與休息。`);
  }
  if(day.activities.length===0)day.reasons.push(start>=end?'抵達／起飛緩衝後沒有可安排時間。':'符合必要條件、營業時間與預算的範例不足，保留空檔。');
  days.push(recalculateDay(day,options,database));
 }
 for(const id of options.must)if(!used.has(id)&&!unassigned.some(x=>x.id===id))unassigned.push({id,name:database.find(p=>p.id===id)?.name??id,reason:'受可用日期、時間、交通或預算限制，無法安排。'});
 if(!options.arrivalTime||!options.departureTime)reasons.push('未完整填寫航班時間；第一天與最後一天請自行核對可用時段。');
 if(options.accessible)reasons.push('僅選擇已標示可無障礙使用的資料；範例資料不足時不安排。');
 return recalculateTrip({schemaVersion:1,id:uid(),name:raw.name??`${options.days} 天曼谷旅程`,start:options.start,end:addDays(options.start,options.days-1),timezone:'Asia/Bangkok',origin:raw.origin??'規則排程',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),options,days,unassigned,reasons},database);
}
export function blankTrip(raw) {const options=normaliseOptions(raw);return recalculateTrip({schemaVersion:1,id:uid(),name:raw.name||'我的曼谷旅程',start:options.start,end:addDays(options.start,options.days-1),timezone:'Asia/Bangkok',origin:'手動建立',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),options,unassigned:[],reasons:[],days:Array.from({length:options.days},(_,i)=>({id:uid(),date:addDays(options.start,i),startMinute:options.startMinute,endMinute:options.endMinute,activities:[],reasons:[]}))});}
export function regenerateDay(trip,index,database) {
 const original=clone(trip),day=original.days[index]; const locked=day.activities.filter(a=>a.locked).sort((a,b)=>a.start-b.start);
 const blocked=original.days.filter((_,i)=>i!==index).flatMap(d=>d.activities.map(a=>a.placeId)).filter(Boolean);const required=original.options.must.filter(id=>!blocked.includes(id)&&!locked.some(a=>a.placeId===id));
 const options={...original.options,start:day.date,end:day.date,days:1,must:required,arrivalTime:index===0?original.options.arrivalTime:'',departureTime:index===original.days.length-1?original.options.departureTime:''};
 const produced=generateTrip(options,database,[...blocked,...locked.map(a=>a.placeId).filter(Boolean)]);
 if(locked.length){
  const pending=produced.days[0].activities.filter(a=>!locked.some(l=>l.id===a.id));const combined=[...locked];
  for(const candidate of pending){const proposed=[...combined,candidate].sort((a,b)=>a.start-b.start);const fits=proposed.every((a,i)=>{if(!i)return a.start>=day.startMinute;const prev=proposed[i-1];const t=travelEstimate(prev.snapshot,a.snapshot,original.options.mode);return prev.start+prev.duration+t.minutes<=a.start;});if(fits)combined.push(candidate);}
  produced.days[0]={...produced.days[0],activities:combined.sort((a,b)=>a.start-b.start),reasons:[...produced.days[0].reasons,'保留鎖定活動的名稱、時間與費用，只補入可銜接的活動。']};
 }
 original.days[index]=produced.days[0];original.unassigned=required.filter(id=>!original.days[index].activities.some(a=>a.placeId===id)).map(id=>({id,name:database.find(p=>p.id===id)?.name??id,reason:'單日可用時段、鎖定活動、預算或交通不足。'}));original.reasons=[...original.reasons,...produced.reasons];return recalculateTrip(original,database);
}
