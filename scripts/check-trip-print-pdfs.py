from pathlib import Path
import json,logging,unicodedata
import pdfplumber
logging.getLogger('pdfminer').setLevel(logging.ERROR)
import argparse
parser=argparse.ArgumentParser(description='Validate local synthetic trip print PDFs with existing pdfplumber.')
parser.add_argument('--directory',default='docs/local/pdf-qa')
root=Path(parser.parse_args().directory)
manifest=json.loads((root/'manifest.json').read_text())
def norm(text):return ''.join(unicodedata.normalize('NFKC',text).split())
results=[]
for case in manifest['cases']:
 with pdfplumber.open(root/(case['id']+'.pdf')) as pdf:
  pages=[norm(page.extract_text() or '') for page in pdf.pages]
  content=''.join(pages)
  assert all(norm(date) in content for date in case['dates']),case['id']+' 缺日期'
  assert all(norm(name) in content for name in case['activities']),case['id']+' 缺活動'
  if case['requiredWarning']:assert norm(case['requiredWarning']) in content,case['id']+' 缺必要提醒'
  if case['longEnd']:
   assert case['longEnd'] in content,case['id']+' 長備註尾端遺失'
   assert content.count(norm('長備註測試'))==900,case['id']+' 長備註文字遺失'
  if case['credits']:
   for label in ['Wikivoyagecontributors','CCBY-SA4.0','作者與編輯歷史','閱讀版本']:
    assert norm(label) in content,case['id']+' 缺署名 '+label
  for text in ['跳至主要內容','參考匯率：','不使用即時匯率','列印／另存PDF']:
   assert norm(text) not in content,case['id']+' 混入操作文字 '+text
  for budget in case['dailyBudgets']:
   assert norm(f'{round(budget):,} THB') in content,case['id']+' 缺每日費用'
  assert all(len(text)>15 for text in pages),case['id']+' 空白頁'
  assert all(f'{index+1}/{len(pages)}' in text for index,text in enumerate(pages)),case['id']+' 缺頁碼'
  outside=[]
  for index,page in enumerate(pdf.pages):
   for char in page.chars:
    if char['text'].strip() and (char['x0'] < -1 or char['x1'] > page.width+1 or char['top'] < -1 or char['bottom'] > page.height+1):outside.append({'page':index+1,'text':char['text']})
  assert not outside,(case['id'],outside[:5])
  results.append({'case':case['id'],'days':len(case['dates']),'pages':len(pdf.pages),'allDatesAndActivities':True,'warningsAndNotes':True,'dailyBudgets':True,'noControlsOrBlankPages':True,'noTextOutsidePaper':True,'creditsChecked':case['credits']})
(root/'text-checks.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(results,ensure_ascii=False,indent=2))
