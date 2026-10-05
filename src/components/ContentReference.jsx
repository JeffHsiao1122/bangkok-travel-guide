import React from 'react';
import {Link} from 'react-router-dom';
import {Notice} from './shared.jsx';
import {guideSources,placeReferences,railReferences,referenceSourcesFor,referenceLicense} from '../data/content-references.js';

const Outside=({href,children})=><a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
export function ReferenceValue({field}){
 if(!field?.value)return <><span className="badge pending">待確認</span><p className="fine">{field?.reason??'尚無可採用的資料。'}</p></>;
 const source=guideSources[field.sourceId];
 return <><span className="badge">社群指南參考</span><p>{field.value}</p><p className="fine">欄位資料日期：{field.sourceUpdatedAt??'來源未提供'} · 官方核實：尚未確認<br/><Outside href={source.url}>{source.title}</Outside> · 章節：{field.section} · 來源閱讀：{field.reviewedAt}</p></>;
}
export function ReferenceCredit({sources}){return <div className="evidence"><b>這一區的來源與授權</b>{sources.map(s=><p className="fine" key={s.id}>改寫自 <Outside href={s.url}>Wikivoyage：{s.title}</Outside> · <Outside href={s.historyUrl}>作者與編輯歷史</Outside> · 閱讀版本 {s.revision}，日期 {s.reviewedAt}。</p>)}<p className="fine">欄位經繁體中文翻譯與刪節，改寫內容採 <Outside href={referenceLicense}>CC BY-SA 4.0</Outside>，可依相同授權重用。原文另有 CC BY-SA 3.0 相容內容及作者歷史說明；沒有使用照片。<Outside href={`${import.meta.env.BASE_URL}content-licenses.txt`}>完整內容授權清單</Outside></p></div>;}
export function PlaceReference({place}){
 const record=placeReferences[place.id];if(!record)return null;
 const address=place.fact?.props.P6375?.[0]?.value;
 return <section className="panel visit-reference"><h2>到訪資訊與交通參考</h2><Notice>這裡整理社群旅遊指南，不是景點官方公告。地址及車站可作為查路起點；時段與列價未經營運方核實，不會自動套用到行程費用或營業限制。</Notice><dl className="detail-list"><dt>參考位置</dt><dd><ReferenceValue field={record.location}/></dd>{address&&<><dt>泰文地址（CC0）</dt><dd lang={address.language}>{address.text}<p className="fine">來自 Wikidata {place.fact.id} 的地址欄位；基本資料來源版本 {place.fact.revision}，核對 {place.fact.retrievedAt}。地址仍需對照實際入口。</p></dd></>}<dt>怎麼去</dt><dd><ReferenceValue field={record.transit}/><p><Link className="text-link" to="/travel/transportation">查看鐵路與機場交通指南</Link></p></dd><dt>入口／無障礙</dt><dd>待確認；車站與概略座標不代表可使用的入口。</dd></dl><details className="reference-details"><summary>查看參考時段與列價（非當期已確認）</summary><p className="fine">來源閱讀日期不是欄位最後更新日期；來源未提供日期時，不能保證內容仍適用。</p><dl className="detail-list"><dt>時段／休館日</dt><dd><ReferenceValue field={record.hours}/></dd><dt>指南列價</dt><dd><ReferenceValue field={record.admission}/></dd></dl></details><ReferenceCredit sources={referenceSourcesFor(record)}/></section>;
}
export function RailReference({id,steps=true}){
 const rail=railReferences[id];if(!rail)return null;
 return <section className="panel rail-reference"><h2>{rail.name}</h2><Notice>社群指南參考，非即時交通資料。沒有取得你的定位、呼叫交通 API 或下載路線圖。</Notice><dl className="detail-list"><dt>路線與轉乘起點</dt><dd><ReferenceValue field={rail.route}/></dd><dt>票價參考</dt><dd><ReferenceValue field={rail.fare}/></dd><dt>首末班</dt><dd><ReferenceValue field={rail.hours}/></dd></dl>{steps&&<><h3>出發前與搭乘時怎麼做？</h3><ol>{rail.planning.map(s=><li key={s}>{s}</li>)}</ol><p className="fine">步驟為本站規劃建議。轉乘、出口、步行與費用請依當日站內指示核對。</p></>}<ReferenceCredit sources={referenceSourcesFor(rail)}/></section>;
}
export function RailOverview(){return <section className="panel"><h2>先看四種鐵路選擇</h2><p>按目的地挑查路起點，再核對完整路程。本站尚無已核實的當期首末班與完整票價表。</p><div className="grid two">{Object.entries(railReferences).map(([id,r])=><article className="info-card" key={id}><h3>{r.name}</h3><p>{r.route.value}</p><p className="fine">社群指南參考 · 官方營運待確認</p><Link className="button secondary small" to={`/travel/transportation/${id}`}>查看轉乘與搭乘準備</Link></article>)}</div><ReferenceCredit sources={[guideSources.bangkok]}/></section>;}
export function ContentSources(){return <><h2>新增旅遊參考：Wikivoyage</h2><p>10 個地點的到訪欄位與 4 種鐵路指南，採具署名及相同授權要求的社群資料。日期、列價與時段分別呈現；資料缺漏、衝突或過時時保留待確認。閱讀來源不代表已向營運方確認。</p><ReferenceCredit sources={Object.values(guideSources)}/><h2>沒有採用的來源</h2><p>大皇宮官方網站要求書面授權後才可重用資料；本站沒有擷取或重製其營運內容。BTS 官方條款亦限制資料使用與網站連結，本站沒有建立指向 BTS 網域的連結。景點與交通指南中的參考值來自上方獨立授權的社群指南。</p><p>泰國政府公園資料候選集未標明授權，沒有匯入。其他業者網站尚未確認可重用條款，不擷取其圖片、文章、評價、營業時間或票價。純連結與資料重用的核對方式分開處理。</p></>;}
