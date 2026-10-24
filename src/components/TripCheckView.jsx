import React,{lazy,Suspense} from 'react';
const TripChecks=lazy(()=>import('./TripChecks.jsx'));
export function TripCheckView(props){return <Suspense fallback={<p role="status">正在整理行程提醒…</p>}><TripChecks {...props}/></Suspense>;}
