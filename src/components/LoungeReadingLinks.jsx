import React from 'react';
import {Link} from 'react-router-dom';
import {loungeGuides} from '../data/lounge-guides.js';
export function LoungeReadingLinks({slugs,title='休息之前，先讀一篇實用指南',compact=false}){
 const entries=slugs?slugs.map(slug=>loungeGuides.find(guide=>guide.slug===slug)).filter(Boolean):loungeGuides;
 return <section className={`lounge-reading ${compact?'panel':''}`}><div className="section-heading"><div><div className="eyebrow">LOUNGE ESSENTIALS</div><h2>{title}</h2><p>本站原創使用建議；各據點營運資訊另行核對。</p></div></div><div className={compact?'guide-shortcuts':'grid two'}>{entries.map(guide=><Link className={compact?'editorial-row':'info-card'} to={`/guides/${guide.slug}`} key={guide.slug}><div><span className="badge">原創指南</span><h3>{guide.title}</h3><p>{guide.summary}</p>{!compact&&<small>更新 {guide.updatedAt}</small>}<span className="text-link">閱讀指南 →</span></div></Link>)}</div></section>;
}
