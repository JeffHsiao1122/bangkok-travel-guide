import {validDate} from './planner.js';
export function evaluateBenefit(card,benefit,lounge,date,answers={}) {
 if(!card||!benefit||!lounge||!benefit.loungeIds.includes(lounge.id)) return {status:'資料不足',free:false,message:'目前未收錄此卡片與據點的合作資料。'};
 if(!validDate(date))return {status:'待確認',free:false,message:'請提供有效使用日期。'};
 const demo=card.status==='範例資料';const prefix=demo?'示範結果｜':'';
 if(date<benefit.start||date>benefit.end)return {status:'已到期或尚未生效',free:false,message:`${prefix}不在公告適用期間內。`};
 if(!demo&&(card.status!=='已確認'||!benefit.verified||lounge.status!=='已確認'))return {status:'待確認',free:false,message:'合作或條件尚未查證，不能判定免費。'};
 if(!Number.isInteger(benefit.quota)||benefit.quota<=0)return {status:'資料不足',free:false,message:'免費次數為零或尚未確認，請向發卡銀行核對。'};
 if(answers.zone==='domestic')return {status:'動線與合作範圍待確認',free:false,message:'這組資料未確認國內或抵達旅客適用，不判定可入場。'};
 if(answers.activated==='no'||answers.qualified==='no')return {status:'未符合條件',free:false,message:`${prefix}未滿足啟用或刷卡條件；付費資訊請另行確認。`};
 if(answers.activated!=='yes'||answers.qualified!=='yes')return {status:'需核對條件',free:false,message:`${prefix}有相關方案，請確認會籍啟用、刷卡門檻與個人剩餘次數。`};
 return {status:demo?'示範條件符合':'可能符合資格',free:!demo,message:demo?'虛構資料僅供操作測試，不能用於真實入場。':'依填寫條件可能符合，以銀行與現場核對為準。'};
}
