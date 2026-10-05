import test from 'node:test';
import assert from 'node:assert/strict';
import {cardOptions,selectedCard} from '../src/services/card-selection.js';
import {banks,cards} from '../src/data/catalog.js';

test('信用卡查詢只接受所選銀行的資料庫卡片，拒絕卡號、卡名及跨銀行識別碼',()=>{
  for(const bank of banks)assert.ok(cardOptions(bank).every(card=>card.bank===bank));
  for(const card of cards)assert.equal(selectedCard(card.bank,card.id)?.id,card.id);
  assert.equal(cardOptions('未列出的銀行').length,0);
  for(const value of ['1234567890123456','1234 5678 9012 3456',cards[0].name,'<script>alert(1)</script>'])assert.equal(selectedCard('示範銀行',value),null);
  for(const bank of banks.filter(bank=>bank!=='示範銀行')){
    assert.equal(cardOptions(bank).length,0);
    assert.equal(selectedCard(bank,cards[0].id),null);
  }
});

test('實際信用卡頁面渲染不含自由文字輸入，未知網址參數不回顯為卡片',async()=>{
  const {createServer}=await import('vite');
  const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',logLevel:'error'});
  try {
    const {LoungeFinder,CreditCards}=await server.ssrLoadModule('/src/pages/Lounges.jsx');
    const {AppProvider}=await server.ssrLoadModule('/src/components/shared.jsx');
    const React=await import('react');
    const {MemoryRouter}=await import('react-router-dom');
    const {renderToStaticMarkup}=await import('react-dom/server');
    const render=(component,url)=>renderToStaticMarkup(React.createElement(MemoryRouter,{initialEntries:[url]},React.createElement(AppProvider,null,React.createElement(component))));
    const unknown=render(LoungeFinder,'/lounge-finder?card=1234567890123456');
    assert.match(unknown,/<select[^>]*disabled=""/);
    assert.ok(!unknown.includes('1234567890123456'));
    const demo=render(LoungeFinder,'/lounge-finder?card=demo-card-0');
    assert.match(demo,/<option value="demo-card-0" selected="">/);
    for(const html of [unknown,demo,render(CreditCards,'/credit-cards')]){
      const inputs=[...html.matchAll(/<input\b[^>]*>/g)].map(match=>match[0]);
      assert.ok(inputs.every(input=>/type="(?:date|checkbox)"/.test(input)), '信用卡頁面仍有自由文字欄位');
    }
  } finally {await server.close();}
});
