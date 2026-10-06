import React from 'react';
import {useSearchParams} from 'react-router-dom';
import {places,areas} from '../data/catalog.js';
import {filterFood,realFoodPlaces} from '../data/food-guides.js';
import {PageHead,Notice,Field,PlaceCard,Empty} from './shared.jsx';
export function PlacesDirectory({food=false}){
 const [params,setParams]=useSearchParams();
 const q=params.get('q')??'',category=params.get('category')??'',area=params.get('area')??'';
 const data=['real','demo','all'].includes(params.get('data'))?params.get('data'):'real';
 const categories=food?['泰式料理','船麵','打拋豬','泰式奶茶','芒果糯米','街頭小吃','米其林推薦','咖啡廳','夜市','購物中心美食']:['寺廟及文化景點','購物中心','夜市','水上市場','文創園區','自然景點','親子景點','按摩及 SPA','一日遊','近郊景點'];
 const filtered=food?filterFood(places,{q,category,area,data}):places.filter(p=>p.type!=='餐廳'&&(p.name+p.area+p.tags.join()).toLowerCase().includes(q.toLowerCase())&&(!category||p.category===category)&&(!area||p.area===area));
 const set=(key,value)=>{const next=new URLSearchParams(params);value?next.set(key,value):next.delete(key);setParams(next,{replace:true});};
 return <div className="container"><PageHead eyebrow={food?'TASTE BANGKOK':'PLACES & STORIES'} title={food?'把喜歡的味道，排進行程':'探索曼谷的不同面貌'} description={food?'從社群指南的店家與餐點參考開始，安排自己的用餐空檔。':'從寺廟文化、河岸散步，到城市裡的綠意。'}/><Notice tone="warning">{food?`新增 ${realFoodPlaces.length} 個指南收錄的店家據點；營運、餐費與座標尚未向店家核實。預設顯示店家參考；原有虛構範例可從資料類型切換。`:'10 個地點已補入 CC0 基本資料與原創介紹；其餘是範例。另補入社群指南的到訪與交通參考；營運仍待核實，預留費用不是售價。'} 照片未取得授權時不顯示。</Notice><div className="filters"><Field label="搜尋名稱或區域"><input value={q} onChange={e=>set('q',e.target.value)} placeholder={food?'店名、餐點、地址或區域':'輸入關鍵字'}/></Field><Field label="分類"><select value={category} onChange={e=>set('category',e.target.value)}><option value="">所有分類</option>{categories.map(c=><option key={c}>{c}</option>)}</select></Field><Field label="區域"><select value={area} onChange={e=>set('area',e.target.value)}><option value="">所有區域</option>{[...areas,'近郊'].map(c=><option key={c}>{c}</option>)}</select></Field>{food&&<Field label="資料類型"><select value={data} onChange={e=>set('data',e.target.value)}><option value="real">店家參考（營運待確認）</option><option value="demo">虛構操作範例</option><option value="all">全部（含虛構範例）</option></select></Field>}<button className="button secondary" onClick={()=>setParams({})}>重設</button></div><div className="result-count">找到 {filtered.length} 個{food?'用餐地點':'地點'}</div><div className="grid three">{filtered.map(p=><PlaceCard key={p.id} place={p}/>)}</div>{filtered.length===0&&<Empty><p>此分類尚未收錄符合條件的資料，可調整篩選。</p></Empty>}</div>;
}
