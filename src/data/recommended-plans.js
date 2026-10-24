import {curatedDays} from './first-visit.js';
// 本站原創安排；來源日期依各地點 fact 保留，不代表營運已查證。
const oldTown=curatedDays[0];
const riverside={title:'河岸文化：鄭王廟',reason:'只安排一個主要地點，為過河、入口核對與休息留下時間。',transport:'先核對鄭王廟當日入口與接續交通；沒有預設可搭的船班。',stops:[['wat-arun',600],['meal',750]]};
const art={title:'暹羅藝文：金湯普森之家與 BACC',reason:'兩個藝文地點集中同一天，保留午餐與移動；需各自核對開放日與預約規定。',transport:'依實際出入口選擇步行或搭車，本站交通時間僅為距離估算。',stops:[['jim-thompson',600],['meal',750],['art-center',900]]};
const shopping={title:'暹羅購物：Siam Paragon 與 CentralWorld',reason:'集中暹羅一帶，購物以自行瀏覽為主，消費不包含在門票預留額內。',transport:'核對商場入口與沿途步行環境，不把地圖上的短距離視為無障礙路線。',stops:[['siam-paragon',660],['meal',810],['centralworld',960]]};
const green={title:'綠地與城市：倫披尼、Terminal 21 Asok',reason:'早上以公園為主，下午到 Asok 一帶；跨區之間保留用餐與交通。',transport:'需另查捷運站入口與轉乘；Terminal 21 此處指 Asok 規劃點，非所有分店。',stops:[['lumphini',540],['meal',690],['terminal21',840]]};
const north={title:'北曼谷留白：洽圖洽公園',reason:'以公園與休息為主；洽圖洽公園不是週末市集，這份安排不包含市場開放日判斷。',transport:'出發前核對公園出入口、天氣及交通公告，下午可自行縮短或休息。',stops:[['chatuchak-park',540],['meal',720]]};
const arrival={title:'抵達日：進城與休息',reason:'尚未知道航班時間，整天保留彈性，不硬排景點；下方時段只是可移動的提醒。',transport:'依抵達機場查看進城指南，入境、行李、交通與住宿接待時間均需自行核對。',stops:[['arrival',840]]};
const departure={title:'回程日：整理行李與前往機場',reason:'不安排新的景點，按航空公司要求預留報到、安檢與進機場交通時間。',transport:'下方不是建議出發時刻；請按實際起飛時間修改，也不代表機場交通費已納入。',stops:[['departure',600]]};
export const recommendedPlans={
 3:curatedDays,
 4:[oldTown,riverside,art,{...shopping,title:'暹羅購物：Siam Paragon',transport:'以單一商場為主；請核對回程航班與前往機場的時間，不預設購物後仍趕得上飛機。',stops:[['siam-paragon',660],['meal',810]],reason:'最後一天只安排一個商場，若是回程日請依起飛時間刪除活動。'}],
 5:[oldTown,riverside,art,shopping,green],
 6:[arrival,oldTown,riverside,art,shopping,departure],
 7:[arrival,oldTown,riverside,art,green,north,departure]
};
export const recommendationDate='2026-10-24';
