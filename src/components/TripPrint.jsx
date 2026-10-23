import React from 'react';
import {money} from './shared.jsx';
import {timeText} from '../services/planner.js';
const value=(input,fallback='未提供')=>typeof input==='string'?input:fallback;
export function TripPrint({trip}){
 const unknown=trip.days.flatMap(day=>day.activities).filter(activity=>activity.cost===null).length;
 const sources=[...new Map(trip.days.flatMap(day=>day.activities).map(activity=>activity.snapshot?.foodGuide?.source).filter(source=>source&&typeof source.url==='string').map(source=>[source.url,source])).values()];
 return <div className="print-only trip-print" aria-label="全部行程列印內容">
  <section className="print-budget"><h2>每日預算摘要</h2><p>以下為每人 THB 的已填金額與估算，不是即時報價。未知費用、未填機票住宿不視為零成本。</p>{unknown>0&&<p className="print-warning">{unknown} 項活動費用待確認，合計不完整。</p>}
   <table><thead><tr><th scope="col">日期</th><th scope="col">活動與交通／人</th><th scope="col">待確認活動費用</th></tr></thead><tbody>{trip.days.map((day,index)=><tr key={day.id}><th scope="row">第 {index+1} 天 · {day.date}</th><td>{money(day.perPerson)}</td><td>{day.activities.filter(activity=>activity.cost===null).length} 項</td></tr>)}</tbody></table>
   <dl className="print-totals"><dt>每人已填／估算合計</dt><dd>{money(trip.totalPerPerson)}</dd><dt>全部活動與交通／人</dt><dd>{money(trip.estimatedPerPerson)}</dd><dt>購物預留／人</dt><dd>{money(trip.shoppingTotal)}</dd><dt>自填機票／人</dt><dd>{trip.options.flightBudget==null?'尚未填寫':money(trip.options.flightBudget)}</dd><dt>自填住宿／人</dt><dd>{trip.options.hotelBudget==null?'尚未填寫':money(trip.options.hotelBudget)}</dd></dl>
   <p>地點間交通為估算；機場與飯店往返、兒童差價及尚未提供的費用，不保證包含在合計中。</p>
  </section>
  {trip.days.map((day,index)=><section className="print-day" key={day.id}><h2>第 {index+1} 天 · {day.date}</h2><p>曼谷當地時間 · 當日活動與交通 {money(day.perPerson)}／人（估算）</p>{!day.activities.length&&<p>這一天保留空檔。</p>}{day.activities.map((activity,at)=><React.Fragment key={activity.id}>{at>0&&<p className="print-transport">交通估算：{trip.options.mode==='taxi'?'計程車':'大眾運輸'} · {day.segments?.[at-1]?.minutes??'待確認'} 分鐘 · {money(day.segments?.[at-1]?.cost)}／{day.segments?.[at-1]?.unit??'單位待確認'}</p>}<div className="print-activity"><div className="print-time">{timeText(activity.start)}<br/>{timeText(activity.end)}</div><div><h3>{activity.name}</h3><p>{activity.duration} 分鐘 · {activity.snapshot?.area??'自訂活動'} · {money(activity.cost)}／{activity.unit==='group'?'全團':'人'}（範例／預估）</p>{activity.note&&<p className="print-note">{activity.note}</p>}<p className="print-source">資料狀態：{value(activity.snapshot?.status,'自訂活動')}。來源：{value(activity.snapshot?.source,'使用者自行安排；未經營運方核實。')}</p></div></div></React.Fragment>)}{day.warnings?.length>0&&<div className="print-reminders"><h3>資料與時間提醒</h3><ul>{day.warnings.map((warning,at)=><li key={at}>{warning}</li>)}</ul></div>}{day.reasons?.length>0&&<div className="print-reasons"><h3>安排理由</h3><ul>{day.reasons.map((reason,at)=><li key={at}>{reason}</li>)}</ul></div>}</section>)}
  {trip.options.note&&<section className="print-trip-note"><h2>特殊需求備註</h2><p className="print-note">{trip.options.note}</p></section>}
  {trip.reasons?.length>0&&<section><h2>整趟行程說明</h2><ul>{trip.reasons.map((reason,index)=><li key={index}>{reason}</li>)}</ul></section>}
  {trip.unassigned?.length>0&&<section><h2>尚未安排的必去地點</h2><ul>{trip.unassigned.map(item=><li key={item.id}>{item.name}：{item.reason}</li>)}</ul></section>}
  {sources.length>0&&<section className="print-credits"><h2>社群指南來源與授權</h2><p>Wikivoyage contributors。相關店名與區域參考經繁體中文翻譯及刪節，改寫採 CC BY-SA 4.0；非營運方核實資訊。保留在活動快照中的來源如下。</p>{sources.map(source=><div key={source.url}><h3>{value(source.title)}</h3><p>來源：{source.url}</p><p>作者與編輯歷史：{value(source.historyUrl)}</p><p>閱讀版本：{Number.isInteger(source.revision)?source.revision:'未提供'} · 閱讀日期：{value(source.reviewedAt)}</p></div>)}<p>授權：https://creativecommons.org/licenses/by-sa/4.0/</p></section>}
  <p className="print-final">Bangkok Travel Guide · 本機行程列印，非訂單或入場憑證。資料建立、來源閱讀及列印日期不等於營業或價格已核實；請出發前核對。此 PDF 不能取代可重新編輯的 JSON 備份。</p>
 </div>;
}
