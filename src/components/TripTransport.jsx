import React,{lazy,Suspense,useState} from 'react';
const DayTransport=lazy(()=>import('./DayTransport.jsx'));
export function TripTransport({day}){
 const [open,setOpen]=useState(false);
 return <details className="panel no-print trip-transport" onToggle={e=>setOpen(e.currentTarget.open)}><summary>查看當日交通準備</summary>{open&&<Suspense fallback={<p role="status">正在開啟交通參考…</p>}><DayTransport day={day}/></Suspense>}</details>;
}
