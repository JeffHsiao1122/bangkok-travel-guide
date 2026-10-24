import {firstVisitPlaces} from '../data/first-visit.js';
import {stationAccess,stationsForPlace} from '../data/station-access.js';
// Read-only lookup against the site's fixed catalog, never against notes or imported URLs.
export function dayTransportEntries(day){
 return (day?.activities??[]).flatMap((activity,index)=>{
  if(!Object.hasOwn(stationAccess,activity.placeId??''))return [];
  const place=firstVisitPlaces.find(p=>p.id===activity.placeId);if(!place)return [];
  return [{activityIndex:index,placeId:place.id,name:place.name,stations:stationsForPlace(place.id)}];
 });
}
export function unpairedActivityCount(day){return (day?.activities??[]).filter(a=>!a.localPause&&!Object.hasOwn(stationAccess,a.placeId??'')).length;}
