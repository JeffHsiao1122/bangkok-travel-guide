import test from 'node:test';
import assert from 'node:assert/strict';
import {findingsFor} from '../scripts/security-check.mjs';
test('上傳檢查會攔截憑證、私密檔案、個人路徑，輸出不含憑證值',()=>{
 const credential=['gh','p_', 'a'.repeat(36)].join('');
 const path=['/Us','ers/person/project/file'].join('');
 const results=findingsFor('src/example.js',Buffer.from(`const token = '${credential}';\n${path}`));
 assert.equal(results.length,2);
 assert.ok(!JSON.stringify(results).includes(credential));
 assert.equal(findingsFor('.env.production',Buffer.from('x=1'))[0].type,'禁止上傳的私密檔案類型');
 assert.equal(findingsFor('backups/trip.json',Buffer.from('{}')).length,1);
 assert.equal(findingsFor('bangkok-trips-backup.json',Buffer.from('{}')).length,1);
 assert.equal(findingsFor('src/example.js',Buffer.from('const note = "範例資料";')).length,0);
});
