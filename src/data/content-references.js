// Adapted reference fields are CC BY-SA 4.0. See public/content-licenses.txt.
// Keep these references outside scheduler fields: a guide is not an operating announcement.
export const referenceDate='2026-10-05';
export const referenceLicense='https://creativecommons.org/licenses/by-sa/4.0/';
export const guideSources=Object.fromEntries([
 ['bangkok','Bangkok',5359262],
 ['old-city','Bangkok/Rattanakosin',5348590],
 ['thonburi','Bangkok/Thonburi',5348594],
 ['siam','Bangkok/Siam_Square',5359263],
 ['silom','Bangkok/Silom',5369519],
 ['north','Bangkok/Phahonyothin',5348586],
 ['sukhumvit','Bangkok/Sukhumvit',5374176],
].map(([id,title,revision])=>[id,{id,title:title.replaceAll('_',' '),url:`https://en.wikivoyage.org/wiki/${title}`,historyUrl:`https://en.wikivoyage.org/w/index.php?title=${encodeURIComponent(title)}&action=history`,revision,authors:'Wikivoyage contributors（作者詳見原文與編輯歷史）',license:'CC-BY-SA-4.0',licenseUrl:referenceLicense,reviewedAt:referenceDate,modified:'僅整理部分欄位並翻譯、刪節；改寫欄位維持 CC BY-SA 4.0。未使用照片、地圖、評價或官方網站內容。'}]));
const field=(value,sourceId,section,sourceUpdatedAt=null)=>({value,sourceId,section,status:'社群指南參考',sourceUpdatedAt,reviewedAt:referenceDate,confirmedAt:null});
const unknown=reason=>({value:null,status:'待確認',reason,confirmedAt:null});
export const placeReferences={
 'grand-palace':{
  location:field('舊城大皇宮一帶；完整泰文地址另見下方 CC0 基本資料。','old-city','Grand Palace'),
  transit:field('舊城可先查 MRT Sanam Chai，再核對前往入口的路線。','old-city','Get in'),
  hours:field('指南記載每日 08:30–16:30；售票至 15:30。','old-city','Grand Palace'),
  admission:field('指南列價 500 THB；適用資格、附帶項目與當期價格待確認。','old-city','Grand Palace'),
 },
 'wat-pho':{
  location:field('Chetuphon Road 一側入口；此為街道位置，非完整郵寄地址。','old-city','Wat Pho'),
  transit:field('可先查 MRT Sanam Chai，並核對當日入口。','bangkok','Metro'),
  hours:field('指南記載 08:00–19:30；未載明休館日。','old-city','Wat Pho'),
  admission:field('指南列價 300 THB；入場資格與當期價格待確認。','old-city','Wat Pho'),
 },
 'wat-arun':{
  location:field('昭披耶河西岸；完整地址及入口待確認。','thonburi','Wat Arun'),
  transit:field('指南提到 Tha Tien 與寺廟間的渡船；請先查碼頭是否營運。','thonburi','By boat'),
  hours:unknown('社群紀錄缺少時效依據，暫不採用營業時段。'),
  admission:unknown('社群列價缺少適用日期，暫不採用；渡船資料亦有互相矛盾的費用。'),
 },
 'siam-paragon':{
  location:field('Rama I Road；完整泰文地址另見下方 CC0 基本資料。','siam','Siam Square'),
  transit:field('可先查 BTS Siam，再核對商場入口。','siam','Siam Square'),
  hours:field('指南記載每日 10:00–22:00；個別店家另查。','siam','Siam Square'),
  admission:unknown('沒有可採用的統一入場價格；購物、餐飲與館內收費設施分別計算。'),
 },
 'art-center':{
  location:field('939 Rama I Road','siam','See'),
  transit:field('可先查 BTS National Stadium，再核對入口。','siam','See'),
  hours:unknown('社群時段與查核時見到的其他紀錄不同，暫不採用關館時間；休館日需另核對。'),
  admission:unknown('常設空間、特展與活動分開查價，不把一般免費記載套用至所有活動。'),
 },
 'jim-thompson':{
  location:field('6 Soi Kasemsan 2','siam','See','2024-08'),
  transit:field('可先查 BTS National Stadium，再核對步行入口。','siam','See','2024-08'),
  hours:unknown('指南條目標示 2024-08，營業與導覽時段可能過時，暫不採用。'),
  admission:unknown('2024-08 的列價不能代表目前售價，暫不採用。'),
 },
 'lumphini':{
  location:field('公園西南側可先查 MRT Si Lom；此為入口方向，非完整地址。','silom','Parks and monuments'),
  transit:field('可先查 MRT Si Lom、Lumphini 或 BTS Sala Daeng。','silom','Parks and monuments'),
  hours:unknown('不同來源的關園時段不同，暫不採用營業時間。'),
  admission:unknown('一般入園、租借與活動分開核對，不保證所有服務免費。'),
 },
 'centralworld':{
  location:field('999/9 Rama I Road','siam','Ratchaprasong'),
  transit:field('可先查 BTS Chit Lom，再核對步行入口。','siam','Ratchaprasong'),
  hours:field('指南記載每日 10:00–22:00；個別店家另查。','siam','Ratchaprasong'),
  admission:unknown('購物、餐飲、展覽與其他設施分別核對價格。'),
 },
 'chatuchak-park':{
  location:field('Phahonyothin Road 一側；此為街道位置，非完整地址。','north','Parks'),
  transit:field('可先查 MRT Chatuchak Park 或 BTS Mo Chit；不要與週末市集混為一談。','north','Parks'),
  hours:unknown('指南的關園時間與其他紀錄有差異，暫不採用。'),
  admission:unknown('入園與個別活動、租借分別核對，不保證所有服務免費。'),
 },
 'terminal21':{
  location:field('Sukhumvit Soi 19（Asok 據點）；門牌及入口待確認。','sukhumvit','Malls and department stores'),
  transit:field('可先查 BTS Asok；MRT Sukhumvit 可轉接 Asok 一帶。','sukhumvit','Malls and department stores / Metro'),
  hours:field('指南記載每日 10:00–22:00；僅指 Asok，個別店家另查。','sukhumvit','Malls and department stores'),
  admission:unknown('購物、餐飲與館內設施分別核對，不套用至其他分店。'),
 },
};
export const railReferences={
 bts:{name:'BTS：暹羅與沿線購物',route:field('Sukhumvit 與 Silom 線在 Siam 轉乘；跨系統車票分開核對。','bangkok','Skytrain'),fare:unknown('本站尚無可採用的當期 BTS 票價。'),hours:unknown('各站首末班待確認。'),sourceId:'bangkok',planning:['先選目的地車站，查看搭乘方向與轉乘點。','在站內核對當期票價與付款方式，再購票。','依月台指示搭車；轉乘時重新核對方向。','核對出口及最後一段步行，不把車站當成景點入口。']},
 mrt:{name:'MRT：舊城與公園',route:field('Sanam Chai 可作為臥佛寺方向的起點；Si Lom／Lumphini 可作為倫披尼公園方向的起點。','bangkok','Metro'),fare:unknown('本站尚無可採用的當期 MRT 票價。'),hours:unknown('各站首末班待確認。'),sourceId:'bangkok',planning:['先找目的地與車站，再核對實際步行入口。','確認路線、月台方向與當期票價。','BTS 與 MRT 轉乘站可能名稱不同，勿只比站名。','到站後查出口；行李、無障礙與末班另核對。']},
 arl:{name:'BKK：Airport Rail Link',route:field('BKK → Makkasan（接 Phetchaburi MRT）或 Phaya Thai（接 BTS）。','bangkok','State Railway of Thailand'),fare:field('指南列價：到 Makkasan 35 THB、Phaya Thai 45 THB／人／單程；不含轉乘。','bangkok','State Railway of Thailand'),hours:unknown('各站首末班及當日停駛待確認；不以一般時段推算最後可搭車時間。'),sourceId:'bangkok',planning:['依機票確認 BKK；抵達後跟隨機場列車指示。','先選 Makkasan 或 Phaya Thai，確認住宿最後一段。','站內查當期票價、首末班與付款方式，再購票。','抵達市區後依指示轉乘，另計轉乘票價與步行。']},
 'red-line':{name:'DMK：深紅線候選方案',route:field('Don Mueang → Bang Sue 方向；先核對機場至車站接續。','bangkok','State Railway of Thailand'),fare:unknown('紅線票價與接續費用待確認。'),hours:unknown('首末班、車站步行接續與當日服務待確認。'),sourceId:'bangkok',planning:['確認機票為 DMK；不要使用 BKK 的 Airport Rail Link 路線。','先查到 Don Mueang 車站的接續，確認行李與體力可負擔。','查列車方向、市區轉乘與住宿最後一段。','本站來源對 DMK 的鐵路描述不一致，只列候選方案；搭乘前再核對。']},
};
export function referenceSourcesFor(record){return [...new Set(Object.values(record).filter(v=>v?.value&&v.sourceId).map(v=>v.sourceId))].map(id=>guideSources[id]).filter(Boolean);}
