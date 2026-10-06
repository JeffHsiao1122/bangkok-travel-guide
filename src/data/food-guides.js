// Wikivoyage-derived fields below are CC BY-SA 4.0; see public/content-licenses.txt.
import {guideSources,referenceLicense} from './content-references.js';
export const foodDate='2026-10-06';
export const foodSources=Object.fromEntries(['old-city','siam','silom','sukhumvit'].map(id=>[id,{...guideSources[id],reviewedAt:foodDate,modified:'店名、位置、餐點與交通起點經翻譯及刪節；改寫內容採 CC BY-SA 4.0。沒有使用照片、評價或營運方文章。'}]));
export const foodGuides=[
 {id:'food-thip-samai',name:'Thip Samai｜Maha Chai 據點',aliases:['Thipsamai','ทิพย์สมัย'],category:'泰式料理',area:'舊城河岸',address:'313 Maha Chai Road',dishes:'泰式炒河粉（pad thai）',transit:'指南以 Panfa Leelard 碼頭為查路起點；到店接續待核對。',sourceId:'old-city',section:'Eat / Thip Samai',sourceUpdatedAt:null,duration:60,planning:'可作為舊城活動之後的用餐候選，先確認此據點仍營運及當日供餐。'},
 {id:'food-mont-nomsod',name:'Mont Nomsod｜Dinso 據點',aliases:['มนต์นมสด'],category:'街頭小吃',area:'舊城河岸',address:'160/1–3 Dinso Road',dishes:'甜味配料烤吐司',transit:'指南提到 Panfa Leelard 碼頭與市政廳對面一帶；實際入口待核對。',sourceId:'old-city',section:'Eat / Mont Nomsod',sourceUpdatedAt:null,duration:45,planning:'可先保留點心與休息空檔，再依當天食量決定是否到訪。'},
 {id:'food-som-tam-nua',name:'Som Tam Nua｜Siam Square 據點',aliases:['Som Tam Paradise','Papaya Salad Restaurant'],category:'泰式料理',area:'暹羅',address:'392/14 Siam Square Soi 5',dishes:'青木瓜沙拉、烤雞、糯米飯',transit:'指南列 BTS Siam；出口與步行接續待核對。',sourceId:'siam',section:'Eat / Mid-range / Som Tam Nua',sourceUpdatedAt:null,duration:60,planning:'可以和暹羅的藝文或購物活動一起考慮；用餐時間、辣度與份量先自行核對。'},
 {id:'food-prachak',name:'Prachak Restaurant｜Charoen Krung 據點',aliases:['Prachak Pet Yang','ประจักษ์เป็ดย่าง'],category:'泰式料理',area:'是隆',address:'1415 Charoen Krung Road',dishes:'烤鴨、豬肉與湯麵',transit:'指南列 BTS Saphan Taksin 或 Sathorn 碼頭；到店接續待核對。',sourceId:'silom',section:'Eat / Budget / Prachak Restaurant',sourceUpdatedAt:null,duration:60,planning:'將交通站與實際店址分開核對；不要把同名或其他分店直接套入行程。'},
 {id:'food-roong-roeng',name:'Roong Roeng｜Sukhumvit 26 據點',aliases:['รุ่งเรืองก๋วยเตี๋ยวหมู'],category:'街頭小吃',area:'素坤逸',address:'10/3 Sukhumvit Soi 26',dishes:'酸辣豬肉麵（tom yum pork noodles）',transit:'指南列 BTS Phrom Phong；出口與步行接續待核對。',sourceId:'sukhumvit',section:'Eat / Budget / Roong Roeng',sourceUpdatedAt:null,duration:60,planning:'先以完整店名及街道查路，再核對實際店家，不只搜尋中文音譯。'},
 {id:'food-wattana-panich',name:'Wattana Panich｜Ekkamai 據點',aliases:[],category:'泰式料理',area:'素坤逸',address:'336–338 Ekkamai Road, Khlong Tan Nuea',dishes:'燉牛肉（neua tune）',transit:null,sourceId:'sukhumvit',section:'Eat / Mid-range / Thai / Wattana Panich',sourceUpdatedAt:'2025-01',duration:60,planning:'此條目標示 2025-01，先核對店址與現況；最後一段交通目前沒有可採用的資訊。'},
];
export const realFoodPlaces=foodGuides.map(g=>({
 id:g.id,name:g.name,type:'餐廳',category:g.category,area:g.area,
 lat:null,lng:null,duration:g.duration,cost:null,open:0,close:1440,
 weekdays:[0,1,2,3,4,5,6],tags:['美食',g.category,g.dishes,...g.aliases],
 status:'社群指南／營運待確認',source:`Wikivoyage ${foodSources[g.sourceId].title}（CC BY-SA 4.0）；非營運方核實`,
 updatedAt:foodDate,confirmedAt:null,accessibility:null,lastEntry:null,
 address:g.address,description:g.planning,coordinateStatus:'待確認；不填入猜測座標',
 hoursStatus:'待確認',ticketStatus:'餐費待確認',planningEligible:false,
 foodGuide:{...g,source:foodSources[g.sourceId],reviewedAt:foodDate,license:'CC-BY-SA-4.0',licenseUrl:referenceLicense,price:null,hours:null,official:null},
}));
export function filterFood(entries,{q='',category='',area='',data='real'}={}){
 const term=q.trim().toLocaleLowerCase();
 return entries.filter(p=>p.type==='餐廳'&&(data==='all'||(data==='demo'?!p.foodGuide:!!p.foodGuide))&&(!category||p.category===category)&&(!area||p.area===area)&&`${p.name} ${p.category} ${p.area} ${p.address} ${p.tags.join(' ')}`.toLocaleLowerCase().includes(term));
}
