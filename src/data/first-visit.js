import facts from './open-place-facts.json' with {type:'json'};
export const contentDate='2026-10-05';
export const licenseUrl='https://creativecommons.org/publicdomain/zero/1.0/';
export const wikidataPolicy='https://www.wikidata.org/wiki/Wikidata:Licensing';
export const openFacts=Object.fromEntries(facts.map(f=>[f.id,f]));
// Only CC0 entity fields are reused. Descriptions below are original editorial guidance.
export const firstVisitPlaces=[
 ['grand-palace','Q873769','大皇宮','宮殿建築與文化探索','初次來曼谷，可把大皇宮作為舊城文化日的主要停留點。建議先確認當日能參觀的區域，再決定是否銜接臥佛寺，避免同一天塞入太多大型景點。','出發前查服裝要求、售票方式、最後入場與臨時活動；不要以本站預留費用當作票價。'],
 ['wat-pho','Q1059910','臥佛寺 Wat Pho','寺廟文化','適合和大皇宮放在同一個區域日，讓交通安排集中。第一次逛寺廟可以放慢步調，預留參觀、喝水與休息時間，別只安排拍照後立刻離開。','參觀與按摩服務分開規劃；按摩營運、預約與費用未收錄，不保證到場即可使用。'],
 ['wat-arun','Q724970','鄭王廟 Wat Arun','寺廟與河岸動線','想把寺廟與河岸安排在同一天，可將鄭王廟作為另一個停留點。與大皇宮、臥佛寺之間的移動請先在地圖核對，再選擇過河船或陸路。','座標不是碼頭或入口；查明乘船方向、服務時間與天氣，不把直線距離當成搭船路程。'],
 ['siam-paragon','Q972334','Siam Paragon 暹羅百麗宮','購物與用餐安排','喜歡購物、希望保留室內休息時間，可以把這裡排在暹羅區域日。先列出真正想買的物品，再把其餘時間留給用餐，避免購物日變成趕場。','店家、餐飲與特定設施各有自己的營業與收費；本頁不保證館內所有設施免費或開放。'],
 ['art-center','Q1130188','曼谷藝術文化中心 BACC','藝文探索','可和暹羅一帶的購物安排搭配，讓一天有不同節奏。出發前先看你有興趣的展覽，再決定停留多久；若展覽不合偏好，可以把時間留給別的地點。','展覽檔期、休館日及個別活動票價待確認；請先開啟來源所列網站核對。'],
 ['jim-thompson','Q2916351','Jim Thompson House 湯普生博物館','博物館參觀','想在暹羅區域日加入一段博物館參觀，可把這裡當成主要文化停留點。安排時留出進場或等候的餘裕，不把所有時間都算成館內參觀。','導覽語言、是否需跟團、入場方式與最後場次待確認；不能用本站停留建議代替預約。'],
 ['lumphini','Q977437','倫披尼公園 Lumphini Park','公園散步','如果不想每天都逛室內景點，可安排一段公園散步作為休息。依天氣與體力調整時間；帶小孩同行時，先約定集合點，再決定步行範圍。','公園座標是概略位置，不是指定入口；開放時段、設施與無障礙路線仍需核對。'],
 ['centralworld','Q3270302','CentralWorld','購物行程','可以作為暹羅區域日的另一個購物選項。若同行的人購物偏好不同，建議約定集合時間，保留彈性，而不是把所有百貨都排成必去。','特展、店家、餐飲與活動費用另查；購物與餐費不含在本站景點預留費用中。'],
 ['terminal21','Q3278033','Terminal 21（Asok 規劃點）','購物與休息','適合作為素坤逸區域日的室內停留點。地圖與行程請指明 Asok，避免和同名品牌的其他據點混淆；用餐店家由你依現場與預算選擇。','Wikidata 項目亦描述品牌系列；此處僅使用其曼谷座標作為規劃點，不能推論所有分店資訊。'],
 ['chatuchak-park','Q1936390','洽圖洽公園 Chatuchak Park','公園與彈性休息','可以作為曼谷北側安排中的休息選項。若想另外逛洽圖洽市集，請把市集當成另一個地點核對，分別安排交通與停留。','公園與週末市集不是同一個地點，不共用營業時間；本頁不提供已查證的市集營業公告。']
].map(([id,qid,name,focus,description,caution])=>({id,qid,name,focus,description,caution,fact:openFacts[qid],status:'開放資料／營運待確認',updatedAt:contentDate,confirmedAt:null,source:`Wikidata ${qid}（CC0）；本站原創規劃建議。僅核對基本資料來源，未核實營運。`}));
export const firstVisitById=Object.fromEntries(firstVisitPlaces.map(p=>[p.id,p]));
export function enrichPlace(p){const guide=firstVisitById[p.id];if(!guide)return p;const c=guide.fact.props.P625[0]?.value;return {...p,...guide,lat:c?.latitude??p.lat,lng:c?.longitude??p.lng,coordinateStatus:'開放資料座標；非入口定位',hoursStatus:'待確認',ticketStatus:'待確認',planningCost:p.cost,description:guide.description};}
export const airportGuides={
 bkk:{name:'BKK 素萬那普機場',qid:'Q194316',rail:'Airport Rail Link',railAdvice:'查詢 Airport Rail Link 的市區下車與轉乘方案，再加上車站到住宿的最後一段。不要只比較列車時間，還要計算等車、轉乘與搬行李。',note:'只看 Bangkok 城市名稱不夠，機票上的 BKK 才是你要確認的機場碼。'},
 dmk:{name:'DMK 廊曼機場',qid:'Q1046755',rail:'紅線鐵路候選方案',railAdvice:'從機場官方交通頁核對紅線車站的步行接續、行車方向與轉乘方案。不要套用 BKK 的 Airport Rail Link 乘車位置或費用。',note:'去程與回程可能使用不同機場；每張機票都要獨立核對 DMK／BKK。'}
};
export const areaGuides={
 '暹羅':{focus:'以購物與市中心活動作為選房起點',why:'如果三日安排有 BACC、Siam Paragon 與 CentralWorld，可先搜尋這一帶住宿。先把飯店和景點放到地圖，再比較步行與轉乘。',check:'核對實際車站、出口、步行路面與行李寄放；「暹羅區」不代表每間飯店都在車站旁。'},
 '素坤逸':{focus:'以 Terminal 21 規劃點及個人晚間安排作為起點',why:'如果偏好購物與自由用餐，可先從 Asok 一帶搜尋，再依你想去的地點縮小範圍。不要因地址寫 Sukhumvit 就認定位置相同。',check:'道路範圍大；確認巷道、步行距離、晚間環境與是否需多次轉乘。'},
 '是隆':{focus:'想把公園散步放進行程',why:'若你的主要安排包含倫披尼公園，可將附近住宿列入比較。選房仍以實際位置為準，不能只依區域名稱。',check:'核對旅館與公園入口的距離；沿線車站與步行路線需逐間確認。'},
 '舊城河岸':{focus:'把寺廟與舊城文化集中安排',why:'如果大皇宮、臥佛寺是重點，可搜尋舊城附近住宿，減少當天跨區。另一天若要去購物區，需一起比較交通成本。',check:'確認接送與大眾運輸選項，不能假設所有舊城住宿都有步行可達的鐵路車站。'},
 '唐人街':{focus:'喜歡街區散步與自行探索用餐',why:'可作為街區探索的搜尋起點；本批尚未收錄可推薦的真實餐廳，選房時先看住宿本身與交通。',check:'核對噪音、行李上下車位置、晚間步行與店家當日營業。'},
 '河岸':{focus:'重視河岸活動與住宿體驗',why:'先確認你想住的是哪一側河岸，再比較到寺廟、購物區的路程；河岸景觀與交通方便是不同條件。',check:'核對接駁是否實際提供、營運時段、費用與碼頭，不把宣傳的河景當成交通保證。'},
 '洽圖洽':{focus:'以曼谷北側活動作為搜尋起點',why:'若打算去洽圖洽公園或另外核對週末市集，可將北側住宿列入比較。三日安排若集中舊城與暹羅，先算每天跨區成本。',check:'公園與市集分開核對；飯店名稱、車站及區域分類不能互相代替。'}
};
export const airportTransferChoices=[
 {name:'軌道交通',for:'希望先比較沿線轉乘，行李能自行搬運',steps:'先查機場官方交通選項 → 確認市區下車站 → 計算到住宿的最後一段 → 查當日服務時段',cost:'官方票價待核對，不以本站示範金額代替',risk:'夜間抵達、轉乘或帶大型行李時，先確認是否仍適合。'},
 {name:'機場計程車',for:'希望減少搬運，或多人一起移動',steps:'依機場現場正式乘車指示排隊 → 核對車牌與目的地 → 確認計價及附加項目 → 保留乘車憑據',cost:'車資、機場附加費、過路費及行李費逐項核對',risk:'按全車總額比較；不要把按車費用當成每人費用。'},
 {name:'應用程式叫車',for:'希望在叫車前看到該次報價',steps:'依應用程式與機場指示選上車點 → 核對車牌 → 核對是否含附加費 → 再決定是否下單',cost:'以當次顯示報價為準，本站不取得即時價格',risk:'不同車種、人數與行李限制需自行核對。'},
 {name:'預約接送',for:'需要事先安排接機或特殊車輛需求',steps:'提供航班與住宿 → 核對人數、行李與集合點 → 檢查等待、取消及延誤條款 → 再預約',cost:'向業者確認完整總價，本站不代訂或收費',risk:'兒童座椅與無障礙車輛需取得業者明確確認。'}
];
export const curatedDays=[
 {title:'舊城文化：大皇宮與臥佛寺',reason:'基本座標相近，集中在同一天，保留中午休息及彈性。',stops:[['grand-palace',540],['meal',720],['wat-pho',840]],transport:'大皇宮 → 午餐與休息 → 臥佛寺。短距離也需核對實際入口與步行路況，可依體力改搭車。'},
 {title:'寺廟與公園：鄭王廟、倫披尼',reason:'上午以寺廟為主，下午只安排一個公園，留足跨區與休息。',stops:[['wat-arun',540],['meal',690],['lumphini',960]],transport:'鄭王廟 → 用餐休息 → 倫披尼公園。下午是跨區移動，請用實際地圖確認船班或陸路接續，不視為直達。'},
 {title:'暹羅藝文與購物：BACC、Siam Paragon',reason:'以藝文與購物搭配，減少一天往返多個區域；不塞滿三家商場。',stops:[['art-center',600],['meal',720],['siam-paragon',840]],transport:'BACC → 午餐 → Siam Paragon。博物館或展館未開放時可替換為 CentralWorld；先核對兩者各自公告。'}
];
