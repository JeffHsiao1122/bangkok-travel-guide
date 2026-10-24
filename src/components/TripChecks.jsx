import React from 'react';
import {tripChecks} from '../services/trip-checks.js';
import {Notice,money} from './shared.jsx';
export default function TripChecks({trip,onDay}){
 const check=tripChecks(trip);
 return <section aria-label="行程檢查"><div className="panel"><h2>出發前，先看哪些地方需要補齊</h2><Notice>這是依目前行程整理的規劃提醒，不是營業、班次、入場或安全認證。沒有提醒也不代表行程已查證可執行；所有估算與各筆來源仍需核對。查看不會修改你的資料。</Notice><dl className="detail-list"><dt>時間安排</dt><dd>{check.timingIssues} 項衝突或超出時段</dd><dt>未安排必去</dt><dd>{check.unassigned.length} 個</dd><dt>未知活動費用</dt><dd>{check.unknownCosts} 項，未知不代表免費</dd><dt>已填／估算合計</dt><dd>{money(check.total)}／人，未必完整</dd></dl>
 {(check.missingArrival||check.missingDeparture)&&<p className="fine">{check.missingArrival?'尚未填第一天抵達時間。 ':''}{check.missingDeparture?'尚未填最後一天起飛時間。':''}請依航班修改首尾兩天與進出機場緩衝。</p>}
 {(check.missingFlightCost||check.missingHotelCost)&&<p className="fine">{check.missingFlightCost?'機票費用尚未估算。 ':''}{check.missingHotelCost?'住宿費用尚未估算。':''}活動合計不等於整趟旅行總價。</p>}
 {check.totalOverBudget&&<p className="error">目前已填與估算合計超過你設定的總預算。</p>}
 {check.unassigned.length>0&&<><h3>未安排的必去地點</h3><ul>{check.unassigned.map((p,i)=><li key={i}>{p.name}：{p.reason}</li>)}</ul></>}
 </div><div className="grid two">{check.days.map(day=><article className="panel" key={day.index}><h2>第 {day.index+1} 天 · {day.date}</h2>
 {day.empty?<p>這一天保留空檔，可以刻意留白，也可以自行加入活動。</p>:<><p>{day.activities} 項活動 · 活動與交通約 {money(day.perPerson)}／人</p><ul>
 {day.timing.map((a,i)=><li className="error" key={i}>{a.name}：{a.reason}（依本站交通估算）。</li>)}
 {day.unknownCosts>0&&<li>{day.unknownCosts} 項活動費用待確認，當日合計可能不完整。</li>}
 {day.unknownLocations>0&&<li>{day.unknownLocations} 項活動缺少可用座標，地圖與接續交通可能只有預留估算。</li>}
 {day.unverified>0&&<li>{day.unverified} 項地點的營業與費用未經核實；有基本來源也不代表當日營運。</li>}
 {day.examples>0&&<li>{day.examples} 項活動使用範例地點資料，不能作為實際旅遊資訊。</li>}
 {day.selfMeals>0&&<li>{day.selfMeals} 段用餐留白仍需自行選店。</li>}
 </ul></>}
 {day.dailyOverBudget&&<p className="error">當日已填與估算加購物預留超過每日預算。</p>}
 {day.warnings.length>0&&<details><summary>查看這一天的全部資料提醒</summary><ul>{day.warnings.map((w,i)=><li key={i}>{w}</li>)}</ul></details>}
 <button className="button secondary small" onClick={()=>onDay(day.index)}>查看第 {day.index+1} 天</button>
 </article>)}</div><p className="fine">編輯器內的檢查依目前修改顯示；「查看已儲存版」則依正式儲存內容。請在修改後按「儲存行程」。</p></section>;
}
