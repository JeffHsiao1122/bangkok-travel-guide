import React,{useState} from 'react';
import {Link,useParams,useNavigate} from 'react-router-dom';
import {createRecommendedTrip} from '../services/recommended-trip.js';
import {recommendedPlans} from '../data/recommended-plans.js';
import {templates,places} from '../data/catalog.js';
import {clone,uid,validDate} from '../services/planner.js';
import {PageHead,Notice,Field,MapView,useApp} from '../components/shared.jsx';
import {Budget,DayTimeline} from './Trips.jsx';
import {NotFound} from './Information.jsx';
export default function RecommendedDetail(){
 const {id}=useParams();const template=templates.find(t=>t.id===id);const app=useApp(),navigate=useNavigate();
 const [start,setStart]=useState('2026-11-01'),[dateInput,setDateInput]=useState('2026-11-01'),[day,setDay]=useState(0);
 const trip=template?createRecommendedTrip(template,{start,people:2,mode:'transit',dailyBudget:3000,shoppingBudget:0},places):null;
 if(!template)return <NotFound/>;
 const selectedDay=Math.min(day,trip.days.length-1),plan=recommendedPlans[template.days][selectedDay];
 const dateError=!validDate(dateInput)||dateInput!==start;
 return <div className="container"><PageHead eyebrow="RECOMMENDED JOURNEY" title={template.name} description={`${template.days} 天 ${template.days-1} 夜 · ${template.tags.join('、')}`}/>
 <Notice tone="warning">真實地點的原創動線；基本名稱與座標來自 CC0 開放資料。時段、交通與費用仍是預留估算，0 不代表免費；營運公告請出發前核對。{template.days>=6?'首尾兩天保留抵離空檔；提醒時刻不是實際航班安排。':'以可遊覽日為規劃起點，請依航班刪減第一天與最後一天。'}</Notice>
 <p className="fine">動線編輯日期：{template.updatedAt}；各地點基本來源版本與日期另列。此安排不包含已查證的餐廳、即時路線或完整旅行總價。</p>
 <div className="filters"><Field label="預計出發日期"><input type="date" required value={dateInput} aria-invalid={dateError} onChange={e=>{const value=e.target.value;setDateInput(value);if(validDate(value)&&Number(value.slice(0,4))<=9998)setStart(value);}}/></Field>
 <button className="button" disabled={dateError} onClick={()=>{const copy=clone(trip);copy.id=uid();if(app.save(copy)!==false)navigate(`/my-trips/${copy.id}/edit`);}}>使用此行程並修改</button></div>
 {dateError&&<p className="error" role="alert">請輸入完整有效日期（年份不超過 9998）；目前保留上次有效日期的預覽。</p>}
 <div className="day-tabs">{trip.days.map((d,i)=><button key={d.id} className={selectedDay===i?'selected':''} onClick={()=>setDay(i)}>第 {i+1} 天</button>)}</div>
 <div className="detail-grid"><div><div className="panel"><h2>{plan.title}</h2><p>{plan.reason}</p><p>{plan.transport}</p><div className="actions"><Link className="text-link" to="/first-visit">查看地點來源與初訪指南</Link><Link className="text-link" to="/airport-transfers">查看機場進城與抵離準備</Link></div></div><DayTimeline day={trip.days[selectedDay]} options={trip.options}/></div><aside><Budget trip={trip} dayIndex={selectedDay}/><MapView day={trip.days[selectedDay]}/></aside></div></div>;
}
