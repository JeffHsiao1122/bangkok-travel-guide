// Station entity fields: CC0. Place-to-station guide references retain their existing CC BY-SA attribution.
import facts from './station-facts.json' with {type:'json'};
export const stationReviewDate='2026-10-23';
const metadata={
 Q19794088:['sanam-chai','Sanam Chai','MRT'],Q1030167:['national-stadium','National Stadium','BTS'],
 Q1016037:['siam','Siam','BTS'],Q4924120:['asok','Asok','BTS'],Q1036841:['sukhumvit','Sukhumvit','MRT'],
 Q6633149:['chit-lom','Chit Lom','BTS'],Q1036816:['si-lom','Si Lom','MRT'],Q873641:['mo-chit','Mo Chit','BTS'],
};
export const stations=facts.map(fact=>{
 const [id,name,network]=metadata[fact.id],coordinate=fact.props.P625.find(p=>p.rank!=='deprecated')?.value;
 const coarse=!coordinate||coordinate.precision>0.001;
 const code=fact.id==='Q1036841'?null:fact.props.P296.find(p=>p.rank!=='deprecated')?.value??null;
 return {id,name,network,fact,code,codeStatus:code?'開放資料參考':'待確認',codeReason:code?null:'來源代碼疑似舊制，未核實現行編碼，暫不採用。',coordinate:coarse?null:{lat:coordinate.latitude,lng:coordinate.longitude},coordinateReason:coarse?'來源座標精度較粗，暫不提供定位；請用站名核對。':'車站概略位置，不是出口、電梯或無障礙入口。',status:'開放資料／營運待確認',confirmedAt:null,fare:null,hours:null,exit:null,walkingMinutes:null};
});
export const stationById=Object.fromEntries(stations.map(s=>[s.id,s]));
// Curated association follows the transit field already attributed in content-references.js.
export const stationAccess={
 'grand-palace':['sanam-chai'],'wat-pho':['sanam-chai'],'wat-arun':[],
 'siam-paragon':['siam'],'art-center':['national-stadium'],'jim-thompson':['national-stadium'],
 lumphini:['si-lom'],centralworld:['chit-lom'],terminal21:['asok','sukhumvit'],'chatuchak-park':['mo-chit'],
};
export function stationsForPlace(id){return (Object.hasOwn(stationAccess,id)?stationAccess[id]:[]).map(key=>stationById[key]).filter(Boolean);}
export function stationMapUrl(station){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.fact.labels.en+' Bangkok')}`;}
