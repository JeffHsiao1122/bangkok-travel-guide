import {blankTrip,makeActivity,recalculateTrip,uid,addDays} from './planner.js';
import {createFirstTrip} from './first-trip.js';
import {recommendedPlans} from '../data/recommended-plans.js';
export function createRecommendedTrip(template,options,database){
 if(!Number.isInteger(template?.days)||!recommendedPlans[template.days])throw Error('尚無此天數的原創推薦行程。');
 const days=template.days;
 const settings={...options,dataMode:'real',days,end:addDays(options.start,days-1),name:template.name};
 if(days===3)return createFirstTrip(settings,database);
 const trip=blankTrip(settings);
 trip.origin=`原創 ${days} 日動線（基本資料 CC0，營運待確認）`;
 trip.reasons=['本站原創安排，使用既有地點基本資料；沒有新增外站內容擷取。','抵達與離開時間尚未填寫；請依航班縮短首尾兩天，或移除不適用的活動。','時間、停留與費用均為預留估算，非即時報價；購物、機場與飯店往返及未填費用不算已涵蓋。'];
 trip.days=trip.days.map((day,index)=>{const plan=recommendedPlans[days][index];return {...day,startMinute:540,endMinute:1200,reasons:[plan.reason,plan.transport],activities:plan.stops.map(([id,start])=>{
  if(['meal','arrival','departure'].includes(id))return {id:uid(),placeId:null,snapshot:null,name:id==='meal'?'午餐與休息（自行選店）':id==='arrival'?'抵達、進城與休息（請依航班修改）':'整理行李與前往機場（請依航班修改）',start,duration:id==='meal'?90:120,cost:id==='meal'?250:null,unit:'person',fixed:true,locked:false,localPause:true,note:id==='meal'?'每人預留 250 THB 為本站估算，非餐廳報價；其他餐次需另外安排。':'時段僅為提醒，不是航班或交通安排；交通費待確認，未納入已填金額合計。'};
  const place=database.find(p=>p.id===id);if(!place?.fact)throw Error(`推薦內容缺少已收錄的基本來源：${id}`);
  return {...makeActivity(place,start),fixed:true,note:'抵達時間、停留與預留費用是本站估算；基本資料與營運確認狀態依地點來源保留。'};
 })};});
 return recalculateTrip(trip,database);
}
