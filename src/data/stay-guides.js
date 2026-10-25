// Adapted listing fields: CC BY-SA 4.0; see public/content-licenses.txt.
export const staySources=Object.fromEntries([['siam','Bangkok/Siam_Square',5394404],['silom','Bangkok/Silom',5397789]].map(([id,title,revision])=>[id,{id,title,url:`https://en.wikivoyage.org/wiki/${title}`,historyUrl:`https://en.wikivoyage.org/w/index.php?title=${encodeURIComponent(title)}&action=history`,revision,reviewedAt:'2026-10-23',license:'CC-BY-SA-4.0',authors:'Wikivoyage contributors',modified:'店名、店址與交通起點經刪節及翻譯；改寫欄位採 CC BY-SA 4.0。'}]));
export const stayGuides=[
 ['hotel-novotel-siam','Novotel｜Siam Square 據點','暹羅','392/44 Siam Square Soi 6','BTS Siam','siam'],
 ['hotel-grand-hyatt','Grand Hyatt Erawan','暹羅','494 Ratchadamri Road','BTS Chit Lom','siam'],
 ['hotel-mandarin-oriental','Mandarin Oriental｜Oriental Road 據點','是隆','48 Oriental Road','Oriental 碼頭','silom'],
 ['hotel-shangri-la','Shangri-La｜Wat Suan Phlu 據點','是隆','89 Soi Wat Suan Phlu','BTS Saphan Taksin／Sathorn 碼頭','silom'],
].map(([id,name,area,address,transport,sourceId])=>({id,name,area,address,transport,kind:'住宿指南參考',price:null,family:null,official:null,sourceUpdatedAt:null,confirmedAt:null,updatedAt:'2026-10-23',status:'社群指南／營運待確認',description:'先以參考店址核對確切據點，再確認入住日期、總價、取消與房型條件。',source:'Wikivoyage（CC BY-SA 4.0）；非飯店營運核實',stayGuide:staySources[sourceId]}));
export function filterStays(entries,{q='',area='',kind='',rail='',data='all'}={}){const term=q.trim().toLowerCase();return entries.filter(p=>(data==='all'||(data==='real'?!!p.stayGuide:!p.stayGuide))&&(!area||p.area===area)&&(!kind||p.kind===kind)&&(!rail||(rail==='船運'?/船運|碼頭/.test(p.transport):p.transport.includes(rail)))&&`${p.name} ${p.address??''} ${p.area} ${p.transport}`.toLowerCase().includes(term));}
