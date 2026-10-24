import React from 'react';
export function FoodLocationCredit({activities}){
 const sources=[...new Map(activities.map(a=>a.snapshot?.foodGuide?.coordinateReference?.source).filter(s=>s&&typeof s.url==='string'&&typeof s.title==='string'&&typeof s.historyUrl==='string'&&typeof s.reviewedAt==='string'&&Number.isInteger(s.revision)).map(s=>[`${s.url}@${s.revision}`,s])).values()];
 if(!sources.length)return null;
 return <details className="evidence" style={{margin:16}}><summary>查看餐廳概略定位來源</summary><p className="fine">餐廳座標為社群指南參考，不是店家入口、營運或路線核實；即使可繪入示意圖，餐費仍可能未知。</p>{sources.map(s=><p className="fine" key={`${s.url}@${s.revision}`}>Wikivoyage contributors · <a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> · <a href={s.historyUrl} target="_blank" rel="noopener noreferrer">作者與編輯歷史</a> · 版本 {s.revision} · 閱讀 {s.reviewedAt}。</p>)}<p className="fine">摘錄並重組店名、街道與座標，維持 <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>；原文的既有修改、相容授權及無保證說明仍適用，沒有使用照片。<a href={`${import.meta.env.BASE_URL}content-licenses.txt`} target="_blank" rel="noopener noreferrer">完整授權清單</a></p></details>;
}
