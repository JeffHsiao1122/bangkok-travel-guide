import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
const base='/bangkok-travel-guide/';
const html=readFileSync('dist-pages/index.html','utf8');
const localAssets=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match=>match[1]).filter(url=>url.startsWith('/'));
assert.ok(localAssets.length>=3,'缺少入口資源');
for(const url of localAssets){
  assert.ok(url.startsWith(base),`資源沒有專案前綴：${url}`);
  assert.ok(existsSync(`dist-pages/${url.slice(base.length)}`),`缺少建置資源：${url}`);
}
assert.ok(existsSync('dist-pages/images/bangkok-hero.png'),'缺少主視覺');
const js=readdirSync('dist-pages/assets').filter(name=>name.endsWith('.js')).map(name=>readFileSync(`dist-pages/assets/${name}`,'utf8')).join('\n');
assert.ok(js.includes(`${base}images/bangkok-hero.png`),'主視覺路徑未套用 Pages 前綴');
assert.ok(!existsSync('dist-pages/.env'),'不可發布環境變數檔');
assert.ok(!existsSync('dist-pages/src') && !existsSync('dist-pages/node_modules'),'不可發布開發資料夾');
console.log('GitHub Pages 建置資源與主視覺路徑檢查通過。頁面導覽、重新整理及儲存另以瀏覽器驗證。');
