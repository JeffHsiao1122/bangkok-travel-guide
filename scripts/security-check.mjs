import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, relative, sep } from 'node:path';

// 只檢查此專案，輸出檔名與問題類別，不顯示可能的憑證內容。
export const rules = [
  ['GitHub Token', /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{30,})\b/],
  ['API 金鑰', /\b(?:sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}|AIza[A-Za-z0-9_-]{30,})\b/],
  ['AWS 存取金鑰', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['私鑰', /[-]{5}BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY[-]{5}/],
  ['含帳密的網址', /https?:\/\/[^\s/@:]+:[^\s/@]+@/],
  ['明文憑證欄位', /(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd)\s*["']?\s*[:=]\s*["'][A-Za-z0-9_+/=.-]{12,}["']/i],
  ['個人電腦路徑', /\/(?:Users|home)\/[A-Za-z0-9._-]+\//],
];
const forbidden = /(?:^|\/)(?:\.env[^/]*|\.npmrc|\.pnpmrc|\.netrc|\.git-credentials|credentials[^/]*\.json|service-account[^/]*\.json|[^/]+\.(?:pem|key|p12|pfx|keystore))$/i;
const privateFolders = /(?:^|\/)(?:\.aws|\.ssh|\.codex|\.agents|\.secrets|private|backups|exports)(?:\/|$)/;
const tripBackups = /(?:^|\/)bangkok-(?:trips-backup.*|recovery.*|[a-f0-9]{8}-[a-f0-9-]{27,})\.json$/i;
export function findingsFor(name, buffer) {
  const findings = [];
  if (forbidden.test(name) || privateFolders.test(name) || tripBackups.test(name)) findings.push({file:name, type:'禁止上傳的私密檔案類型'});
  if (buffer.includes(0)) return findings; // 二進位檔另由素材人工審查，不當作文字解讀。
  const lines = buffer.toString('utf8').split(/\r?\n/);
  for (let i=0; i<lines.length; i++) for (const [type,pattern] of rules) if (pattern.test(lines[i])) findings.push({file:name,line:i+1,type});
  return findings;
}
function walk(dir, root) {
  const skipped = new Set(['.git','node_modules','dist','dist-pages','test-results','local']);
  return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    if(skipped.has(entry.name)) return [];
    const path=resolve(dir,entry.name);
    if(entry.isDirectory()) return walk(path,root);
    return [relative(root,path).split(sep).join('/')];
  });
}
export function audit({root=process.cwd(),staged=false}={}) {
  let files;
  if(staged) files=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
  else files=walk(root,root);
  const findings=[];
  let textFiles=0;
  for(const name of files) {
    const path=resolve(root,name);
    if(!staged && lstatSync(path).isSymbolicLink()){findings.push({file:name,type:'需人工審查的符號連結'});continue;}
    const content=staged?execFileSync('git',['show',`:${name}`],{cwd:root,maxBuffer:10*1024*1024}):readFileSync(path);
    if(!content.includes(0)) textFiles++;
    findings.push(...findingsFor(name,content));
  }
  return {scope:staged?'Git 暫存區（預計提交的版本）':'專案工作檔案',files:files.length,textFiles,findings};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const result=audit({staged:process.argv.includes('--staged')});
    console.log(JSON.stringify(result,null,2));
    console.log('此檢查可攔截常見格式，不能保證辨識所有密碼、個資或素材權利。發布前仍需檢視檔案清單。');
    if(result.findings.length) process.exitCode=1;
  } catch {console.error('安全檢查未完成；請先檢查 Git 暫存區或檔案讀取問題，勿推送。');process.exitCode=1;}
}
