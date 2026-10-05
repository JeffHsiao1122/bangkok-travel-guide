import {blankTrip,makeActivity,recalculateTrip,uid} from './planner.js';
import {curatedDays} from '../data/first-visit.js';
export function createFirstTrip(options,database){
 const trip=blankTrip({...options,days:3,name:'初訪曼谷・文化與城市三日'});
 trip.origin='原創三日動線（基本資料 CC0，營運待確認）';
 trip.reasons=['依真實地點的概略座標與本站原創建議安排；不代表營業時間或交通班次已確認。','以三個可遊覽日為規劃起點；若是三天兩夜，請依航班縮短第一天與最後一天。','費用是預留額；0 不等於免費。用餐自選，未提供已查證的餐廳。'];
 trip.days=trip.days.map((day,index)=>({...day,startMinute:540,endMinute:1200,reasons:[curatedDays[index].reason,curatedDays[index].transport],activities:curatedDays[index].stops.map(([id,start])=>{
  if(id==='meal')return {id:uid(),placeId:null,snapshot:null,name:'午餐與休息（自行選店）',start,duration:90,cost:250,unit:'person',fixed:true,locked:false,localPause:true,note:'每人預留 250 THB（本站估算），非特定餐廳報價；此段包含休息與選店餘裕。'};
  const place=database.find(p=>p.id===id);if(!place?.fact)throw Error(`三日內容缺少已收錄的基本來源：${id}`);
  return {...makeActivity(place,start),fixed:true,note:'抵達時間、停留與預留費用是本站估算；請先核對營運公告。'};
 })}));
 return recalculateTrip(trip,database);
}
