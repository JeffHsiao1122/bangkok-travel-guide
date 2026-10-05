import {banks,cards} from '../data/catalog.js';

// 查詢只接受資料庫識別碼，不接收使用者輸入的卡名或卡號。
export function cardOptions(bank) {
  return banks.includes(bank) ? cards.filter(card=>card.bank===bank) : [];
}
export function selectedCard(bank,id) {
  return cardOptions(bank).find(card=>card.id===id) ?? null;
}
