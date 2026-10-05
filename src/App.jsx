import React from 'react';
import {Routes,Route,Link} from 'react-router-dom';
import {AppProvider,Layout,PageHead} from './components/shared.jsx';
import FirstVisit from './pages/FirstVisit.jsx';
import Home,{Sitemap} from './pages/Home.jsx';
import {TravelOverview,PlacesList,PlaceDetail,Flights,Airport,Airline,Accommodation,AccommodationDetail,Area,Transportation,TransportDetail,NotFound} from './pages/Information.jsx';
import {Lounges,LoungeDetail,CreditCards,CreditDetail,LoungeFinder} from './pages/Lounges.jsx';
import {Guides,Guide,StaticPage} from './pages/Static.jsx';
import {Planner,RecommendedTrips,RecommendedDetail,MyTrips,TripDetail,TripEditor} from './pages/Trips.jsx';
function Pending(){return <div className="container"><PageHead title="功能開發中" description="此頁正在依 Phase 1 規劃製作。"/><Link className="button" to="/">回首頁</Link></div>;}
export default function App(){return <AppProvider><Layout><Routes>
 <Route path="/" element={<Home/>}/><Route path="/sitemap" element={<Sitemap/>}/>
 <Route path="/first-visit" element={<FirstVisit/>}/><Route path="/travel" element={<TravelOverview/>}/><Route path="/travel/flights" element={<Flights/>}/><Route path="/travel/airports/:id" element={<Airport/>}/><Route path="/travel/airlines/:id" element={<Airline/>}/>
 <Route path="/travel/accommodation" element={<Accommodation/>}/><Route path="/travel/accommodation/compare" element={<Accommodation compare/>}/><Route path="/travel/accommodation/:id" element={<AccommodationDetail/>}/><Route path="/travel/areas/:id" element={<Area/>}/>
 <Route path="/travel/transportation" element={<Transportation/>}/><Route path="/travel/transportation/:id" element={<TransportDetail/>}/><Route path="/travel/food" element={<PlacesList food/>}/><Route path="/travel/food/:id" element={<PlaceDetail/>}/><Route path="/travel/attractions" element={<PlacesList/>}/><Route path="/travel/attractions/:id" element={<PlaceDetail/>}/>
 <Route path="/lounges" element={<Lounges/>}/><Route path="/lounges/compare" element={<Lounges compare/>}/><Route path="/lounges/:id" element={<LoungeDetail/>}/><Route path="/credit-cards" element={<CreditCards/>}/><Route path="/credit-cards/compare" element={<CreditCards compare/>}/><Route path="/credit-cards/:id" element={<CreditDetail/>}/><Route path="/lounge-finder" element={<LoungeFinder/>}/>
 <Route path="/guides" element={<Guides/>}/><Route path="/guides/:slug" element={<Guide/>}/>{['about','faq','contact','privacy','disclaimer','sources'].map(kind=><Route key={kind} path={`/${kind}`} element={<StaticPage kind={kind}/>}/>)}
 <Route path="/planner" element={<Planner/>}/><Route path="/trips" element={<RecommendedTrips/>}/><Route path="/trips/:id" element={<RecommendedDetail/>}/><Route path="/my-trips" element={<MyTrips/>}/><Route path="/my-trips/new" element={<Planner blank/>}/><Route path="/my-trips/:id/edit" element={<TripEditor/>}/><Route path="/my-trips/:id" element={<TripDetail/>}/><Route path="*" element={<NotFound/>}/>
 </Routes></Layout></AppProvider>;}
