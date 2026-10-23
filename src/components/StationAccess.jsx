import React from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {firstVisitPlaces} from '../data/first-visit.js';
import {placeReferences,guideSources} from '../data/content-references.js';
import {stations as allStations,stationAccess,stationsForPlace,stationMapUrl,stationReviewDate} from '../data/station-access.js';
import {Field,Notice} from './shared.jsx';
import {ReferenceValue,ReferenceCredit} from './ContentReference.jsx';
const Outside=({href,children})=><a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
export function StationAccess({placeId}){
 const [params,setParams]=useSearchParams();const requested=placeId??params.get('destination');
 const place=firstVisitPlaces.find(p=>p.id===requested&&Object.hasOwn(stationAccess,p.id))??firstVisitPlaces[0];
 if(placeId&&!Object.hasOwn(stationAccess,placeId))return null;
 const field=placeReferences[place.id].transit,stations=stationsForPlace(place.id);
 return <section className="panel station-access" aria-label="景點與候選車站對照"><h2>去這個景點，可以先查哪個車站？</h2><p>先找到車站與景點，再核對實際出口和最後一段。這裡提供查路起點，沒有從你的所在位置計算路線。</p>
 {!placeId&&<Field label="選擇想去的景點"><select aria-label="選擇想去的景點" value={place.id} onChange={e=>{const next=new URLSearchParams(params);next.set('destination',e.target.value);setParams(next,{replace:true});}}>{firstVisitPlaces.filter(p=>Object.hasOwn(stationAccess,p.id)).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>}
 <h3>{place.name}</h3><ReferenceValue field={field}/>
 {stations.length?<div className="grid two station-cards">{stations.map(station=><article className="info-card" key={station.id}><span className="badge">{station.network} · 開放資料參考</span><h3>{station.network} {station.name}</h3><p lang="en">{station.fact.labels.en}</p>{station.fact.labels.th&&<p lang="th">{station.fact.labels.th}</p>}<dl className="detail-list"><dt>車站代碼</dt><dd>{station.code??'待確認'}{station.codeReason&&<p className="fine">{station.codeReason}</p>}</dd><dt>概略位置</dt><dd>{station.coordinate?`${station.coordinate.lat.toFixed(6)}, ${station.coordinate.lng.toFixed(6)}`:'待確認'}<p className="fine">{station.coordinateReason}</p></dd><dt>出口／步行時間</dt><dd>待確認；不把直線距離換算為實際步行時間。</dd><dt>票價／首末班</dt><dd>待確認；請查當日站內指示。</dd></dl><p><Outside href={stationMapUrl(station)}>外部地圖查車站</Outside></p><details><summary>查看車站資料來源與版本</summary><p className="fine">名稱、代碼與座標來自 <Outside href={station.fact.url}>Wikidata {station.fact.id}</Outside>，結構化欄位採 <Outside href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</Outside>。<Outside href={`https://www.wikidata.org/w/index.php?title=${station.fact.id}&oldid=${station.fact.revision}`}>來源版本 {station.fact.revision}</Outside>。</p><p className="fine">資料讀取：{station.fact.retrievedAt}；來源最後編輯：{station.fact.sourceModifiedAt?.slice(0,10)??'未提供'}。讀取或編輯日期不代表營運方核實，官方核實：尚未確認。</p></details></article>)}</div>:<Notice tone="warning">這個景點尚未收錄可配對的車站基本資料；不是沒有大眾運輸。上方指南提到的船運仍需核對碼頭、方向與當日服務，不提供虛構車站或班次。</Notice>}
 {(!placeId||place.id==='terminal21')&&<Notice>Asok（BTS）與 Sukhumvit（MRT）分別列示，不能把站名相近或可接續當成同一個系統。車票、站內外接續、電梯與出口仍需個別核對。這份候選清單不是完整交通方案，也不保證最近或最快。</Notice>}
 <div className="button-row">{!placeId&&<Link className="button secondary small" to={`/travel/attractions/${place.id}`}>查看景點與加入行程</Link>}<Link className="text-link" to={placeId?`/travel/transportation?destination=${place.id}`:'/planner'}>{placeId?'查看其他景點交通':'設定偏好並規劃旅程'}</Link></div>
 <p className="fine">對照整理：{stationReviewDate}。車站基本欄位與下方社群交通文字的授權分開保留。</p><ReferenceCredit sources={[guideSources[field.sourceId]]}/>
 </section>;
}

export function StationSourceSummary(){return <section><h2>景點對應車站：Wikidata 基本資料</h2><p>8 個車站的名稱、可採用代碼與概略座標採 CC0，讀取於 {stationReviewDate}；不是車站官方公告。Sukhumvit 的代碼與較粗座標未採用。景點與車站的對照另保留既有 Wikivoyage 交通欄位及 CC BY-SA 署名。</p><details><summary>查看八個車站的來源版本</summary><ul>{allStations.map(s=><li key={s.id}><Outside href={s.fact.url}>{s.network} {s.name} · {s.fact.id}</Outside> · 版本 {s.fact.revision} · 來源編輯 {s.fact.sourceModifiedAt?.slice(0,10)??'未提供'} · 讀取 {s.fact.retrievedAt}</li>)}</ul></details><p className="fine">僅使用結構化欄位，不使用照片、業者文章或路線圖；未加入即時 API、定位或班次資料。<Outside href="https://www.wikidata.org/wiki/Wikidata:Licensing">Wikidata 授權說明</Outside> · <Outside href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</Outside></p></section>;}
