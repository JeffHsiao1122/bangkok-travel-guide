import React from 'react';
import {Link} from 'react-router-dom';
import {dayTransportEntries,unpairedActivityCount} from '../services/day-transport.js';
import {stationMapUrl,stationReviewDate} from '../data/station-access.js';
import {placeReferences,guideSources} from '../data/content-references.js';
import {Notice} from './shared.jsx';
import {ReferenceCredit} from './ContentReference.jsx';
const Outside=({href,children})=><a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
export default function DayTransport({day}){
 const entries=dayTransportEntries(day),missing=unpairedActivityCount(day);
 const sources=[...new Set(entries.map(e=>placeReferences[e.placeId].transit.sourceId))].map(id=>guideSources[id]);
 const stations=[...new Map(entries.flatMap(e=>e.stations).map(s=>[s.id,s])).values()];
 return <section aria-label="當日交通準備"><h2>{day.date} · 交通查路起點</h2><Notice>依當天活動順序對照原收錄地點，提供候選車站；不是已算好的站到站路線，也不保證最近、最快或可無障礙通行。若你已改址或匯入不同位置，請先核對地點。展開此區不會變更行程、交通估算或費用。</Notice>
 {entries.length===0&&<p>當天尚無可對照的已收錄景點；不會替自訂或範例活動編造車站。</p>}
 {entries.map(e=><article className="info-card" key={e.activityIndex}><p className="eyebrow">行程第 {e.activityIndex+1} 項</p><h3>{e.name}</h3>{e.stations.length?<ul>{e.stations.map(s=><li key={s.id}><b>{s.network} {s.name}</b> · 代碼 {s.code??'待確認'}<p><Outside href={stationMapUrl(s)}>開啟 {s.network} {s.name} 車站地圖</Outside></p></li>)}</ul>:<p>尚未收錄可配對車站，不代表沒有大眾運輸。船運碼頭、方向與當日服務仍需另外核對。</p>}
 {e.placeId==='terminal21'&&<p className="fine">Asok（BTS）與 Sukhumvit（MRT）分屬不同系統；車票、轉乘與出口需分別核對。</p>}
 <Link className="text-link" to={`/travel/transportation?destination=${e.placeId}`}>核對 {e.name} 的車站與來源</Link></article>)}
 {missing>0&&<p className="fine">另有 {missing} 項活動沒有本站車站對照，請依實際位置查路；用餐與抵離留白不當成已定位地點。</p>}
 <h3>出發前再核對</h3><ul><li>先確認實際入口、出口、步行環境及電梯，不能把概略車站位置當成景點入口。</li><li>跨區與跨系統接續需重新查路；車站順序不代表可以直達，票價、首末班與等候時間仍待確認。</li><li>機場與飯店往返未由此區計算，請另外保留時間及費用。</li></ul>
 <Link className="text-link" to="/airport-transfers">查看機場進城與抵離準備</Link>
 {entries.length>0&&<details><summary>查看這一天的交通來源與授權</summary><p className="fine">車站基本資料讀取：{stationReviewDate}，採 CC0；不是官方營運確認。景點對照另沿用以下 Wikivoyage 交通欄位，授權分開保留。</p><ul>{stations.map(s=><li key={s.id}><Outside href={s.fact.url}>{s.network} {s.name} · {s.fact.id}</Outside> · 版本 {s.fact.revision} · 讀取 {s.fact.retrievedAt}</li>)}</ul><p><Outside href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</Outside> · <Link to="/sources">全站來源說明</Link></p><ReferenceCredit sources={sources}/></details>}
 </section>;
}
