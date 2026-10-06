import { uid, clone, validDate, dayCount, normaliseOptions, addDays, recalculateTrip } from './planner.js';
export const STORE_KEY='bangkok-trips-v1';
export const DRAFT_KEY='bangkok-drafts-v1';
export const MAX_BYTES=2000000;
function text(value,max=5000){return typeof value==='string'&&value.length<=max;}
function byteLength(value){return new TextEncoder().encode(value).byteLength;}
function parseJson(raw){try{return JSON.parse(raw);}catch{throw Error('內容不是完整有效的 JSON，請使用本網站匯出的完整備份。');}}
function minute(value){return Number.isInteger(value)&&value>=0&&value<=1440;}
function stringList(value){return Array.isArray(value)&&value.length<=100&&value.every(v=>text(v,500));}
function validCoordinates(p){return p.lat===null&&p.lng===null || Number.isFinite(p.lat)&&Math.abs(p.lat)<=90&&Number.isFinite(p.lng)&&Math.abs(p.lng)<=180;}
function validSnapshot(p){return text(p.name,200)&&text(p.id,100)&&text(p.area,200)&&text(p.type,100)&&validCoordinates(p)&&minute(p.open)&&minute(p.close)&&p.close>=p.open&&Array.isArray(p.weekdays)&&p.weekdays.every(n=>Number.isInteger(n)&&n>=0&&n<=6)&&stringList(p.tags)&&text(p.status,50)&&(p.lastEntry==null||minute(p.lastEntry));}
export function validateTrip(trip) {
 if(!trip||trip.schemaVersion!==1)throw Error('不支援的行程版本。');
 if(!text(trip.id,100)||!trip.id||!text(trip.name,120)||!trip.name.trim()||!validDate(trip.start)||!validDate(trip.end)||!Array.isArray(trip.days)||trip.days.length<1||trip.days.length>14||dayCount(trip.start,trip.end)!==trip.days.length)throw Error('行程日期、名稱或天數格式不正確。');
 const options=normaliseOptions(trip.options);if(options.start!==trip.start||options.days!==trip.days.length||trip.timezone!=='Asia/Bangkok'||!text(trip.origin,200)||!text(trip.createdAt,100)||!Number.isFinite(Date.parse(trip.createdAt))||!text(trip.updatedAt,100)||!Number.isFinite(Date.parse(trip.updatedAt))||!stringList(trip.reasons??[])||!Array.isArray(trip.unassigned??[])||(trip.unassigned??[]).length>100||(trip.unassigned??[]).some(x=>!x||!text(x.id,100)||!text(x.name,200)||!text(x.reason,1000)))throw Error('行程設定格式不正確。');const ids=new Set(),dayIds=new Set();
 for(const [i,d]of trip.days.entries()){
  if(d.date!==addDays(trip.start,i)||!Array.isArray(d.activities)||d.activities.length>50||!text(d.id,100)||dayIds.has(d.id)||!minute(d.startMinute)||!minute(d.endMinute)||!stringList(d.reasons??[]))throw Error('每日行程格式不正確。');dayIds.add(d.id);
  for(const a of d.activities){if(!text(a.id,100)||ids.has(a.id)||!text(a.name,200)||!minute(a.start)||!Number.isInteger(a.duration)||a.duration<5||a.duration>1440||a.cost!==null&&(!Number.isFinite(a.cost)||a.cost<0)||!['person','group'].includes(a.unit)||!text(a.note??'',5000)||a.placeId!=null&&!text(a.placeId,100)||['fixed','locked','localPause'].some(key=>a[key]!=null&&typeof a[key]!=='boolean'))throw Error('活動資料不正確或編號重複。');ids.add(a.id);if(a.snapshot&&!validSnapshot(a.snapshot))throw Error('地點資料格式不正確。');}
 }
 return trip;
}
export function readTrips(storage) { const raw=storage.getItem(STORE_KEY);if(!raw)return [];if(byteLength(raw)>MAX_BYTES)throw Error('儲存資料過大。請先備份再清除。');const envelope=parseJson(raw);if(!envelope||envelope.version!==1||!Array.isArray(envelope.trips)||envelope.trips.length>100)throw Error('本機資料格式損壞或版本不支援，原資料仍保留。');return envelope.trips.map(validateTrip); }
export function writeTrips(storage,trips){if(!Array.isArray(trips)||trips.length>100)throw Error('最多保存 100 份行程。');trips.forEach(validateTrip);const raw=JSON.stringify({version:1,trips});if(byteLength(raw)>MAX_BYTES)throw Error('行程儲存空間上限已達，請匯出備份。');storage.setItem(STORE_KEY,raw);}
export function duplicateTrip(trip){const t=clone(trip);t.id=uid();t.name=`${t.name}（副本）`.slice(0,120);t.createdAt=t.updatedAt=new Date().toISOString();t.days=t.days.map(d=>({...d,id:uid(),activities:d.activities.map(a=>({...a,id:uid()}))}));return t;}
export function importTrips(raw){if(typeof raw!=='string'||byteLength(raw)>MAX_BYTES)throw Error('檔案過大，請使用 2 MB 以下的行程備份。');const parsed=parseJson(raw);const list=parsed?.version===1&&Array.isArray(parsed.trips)?parsed.trips:parsed?.schemaVersion===1?[parsed]:null;if(!list||list.length===0||list.length>100)throw Error('請選擇本網站匯出的有效行程 JSON。');return list.map(t=>duplicateTrip(recalculateTrip(validateTrip(t))));}
export function readDraft(storage,id){try{const d=JSON.parse(storage.getItem(DRAFT_KEY)||'{}')[id];return d?validateTrip(d):null;}catch{return null;}}
export function writeDraft(storage,trip){let list=JSON.parse(storage.getItem(DRAFT_KEY)||'{}');if(!list||Array.isArray(list)||typeof list!=='object')throw Error('草稿資料異常。');list[trip.id]=validateTrip(trip);const keys=Object.keys(list);while(keys.length>10)delete list[keys.shift()];const raw=JSON.stringify(list);if(byteLength(raw)>MAX_BYTES)throw Error('草稿太大，請手動儲存或匯出。');storage.setItem(DRAFT_KEY,raw);}
export function removeDraft(storage,id){const list=JSON.parse(storage.getItem(DRAFT_KEY)||'{}');delete list[id];storage.setItem(DRAFT_KEY,JSON.stringify(list));}
