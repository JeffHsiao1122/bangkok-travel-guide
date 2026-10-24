import {normaliseOptions,recalculateTrip,parseTime} from './planner.js';
// Derive a planning checklist without changing the trip, its snapshot or stored totals.
export function tripChecks(trip){
 const current=recalculateTrip({...trip,options:normaliseOptions(trip.options)});
 const days=current.days.map((day,index)=>{
  const timing=[];let previousEnd=day.startMinute;
  for(const [at,a] of day.activities.entries()){
   const travel=at?(day.segments[at-1]?.minutes??0):0;
   if(a.start<previousEnd+travel)timing.push({activityId:a.id,name:a.name,reason:at?'與前一活動及交通預留時間衝突':'早於當日可安排時間'});
   if(a.end>day.endMinute)timing.push({activityId:a.id,name:a.name,reason:'超出當日可安排時間'});
   previousEnd=a.end;
  }
  return {index,date:day.date,activities:day.activities.length,empty:day.activities.length===0,timing,
   unknownCosts:day.activities.filter(a=>!Number.isFinite(a.cost)).length,
   unknownLocations:day.activities.filter(a=>!a.localPause&&(!Number.isFinite(a.snapshot?.lat)||!Number.isFinite(a.snapshot?.lng))).length,
   unverified:day.activities.filter(a=>a.snapshot&&(a.snapshot.status!=='已確認'||!a.snapshot.confirmedAt)).length,
   examples:day.activities.filter(a=>a.snapshot?.status==='範例資料').length,
   selfMeals:day.activities.filter(a=>a.localPause&&/餐/.test(a.name)).length,
   dailyOverBudget:current.options.dailyBudget!==null&&day.perPerson+Number(current.options.shoppingBudget??0)>current.options.dailyBudget,
   perPerson:day.perPerson,warnings:day.warnings};
 });
 return {days,unassigned:current.unassigned??[],missingArrival:!Number.isFinite(parseTime(current.options.arrivalTime)),missingDeparture:!Number.isFinite(parseTime(current.options.departureTime)),missingFlightCost:current.options.flightBudget===null,missingHotelCost:current.options.hotelBudget===null,totalOverBudget:current.options.totalBudget!==null&&current.totalPerPerson>current.options.totalBudget,total:current.totalPerPerson,unknownCosts:days.reduce((n,d)=>n+d.unknownCosts,0),timingIssues:days.reduce((n,d)=>n+d.timing.length,0)};
}
