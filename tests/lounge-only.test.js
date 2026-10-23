import test from 'node:test';
import assert from 'node:assert/strict';
import * as catalog from '../src/data/catalog.js';

test('現行資料與網站地圖不再提供銀行、卡片或權益功能',()=>{
 for(const key of ['banks','cards','benefits'])assert.equal(key in catalog,false);
 for(const [path,title] of catalog.publicRoutes){assert.doesNotMatch(path,/credit-cards|lounge-finder/);assert.doesNotMatch(title,/信用卡|銀行/);}
 assert.equal(catalog.guideTitles.length,5);
 assert.ok(catalog.guideTitles.every(title=>! /信用卡|銀行/.test(title)));
});

test('所有主要頁面及貴賓室攻略沒有指向已移除功能的入口',async()=>{
 const {createServer}=await import('vite');
 const server=await createServer({optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',logLevel:'error'});
 try{
  const React=await import('react'),{MemoryRouter}=await import('react-router-dom'),{renderToStaticMarkup}=await import('react-dom/server');
  const {default:App}=await server.ssrLoadModule('/src/App.jsx');
  const urls=[...catalog.publicRoutes.map(([path])=>path),...catalog.lounges.map(l=>`/lounges/${l.id}`),'/lounges/demo-lounge-0',...['bkk-guide','miracle-coral','first-lounge','low-cost-lounge','booking'].map(slug=>`/guides/${slug}`)];
  for(const url of urls){
   const html=renderToStaticMarkup(React.createElement(MemoryRouter,{initialEntries:[url]},React.createElement(App)));
   assert.doesNotMatch(html, /href="[^"]*(?:credit-cards|lounge-finder|taiwan-cards|check-benefits)/,url);
   assert.doesNotMatch(html,/國泰世華|中國信託|玉山銀行|台新銀行|永豐銀行|富邦銀行|示範銀行|免費上限|消費門檻/,url);
   assert.ok(html.includes('<main'),url);
  }
 }finally{await server.close();}
});
