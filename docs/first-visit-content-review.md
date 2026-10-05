# 首次曼谷內容：來源、授權與測試紀錄

核對日期：2026-10-05。狀態：使用者確認後已推送並公開發布；後續正式驗證見 [發布紀錄](first-visit-release.md)。

## 本批收錄內容

- 首次曼谷指南、兩座機場辨識及行前準備。
- 四種進城選擇的原創比較方法、七個住宿區域的原創選房建議。
- 十個真實地點的基本來源、原創介紹與安排注意事項。
- 可修改、儲存及備份的原創三日動線；午餐由使用者自行選店。

此批不包含已查證的票價、營業時間、交通班次、真實飯店／餐廳推薦、信用卡入場資格或貴賓室營運公告。其他原有範例仍明確標示。

## 使用前核對的規範

| 依據 | 對本次使用的意義 |
|---|---|
| [Wikidata Licensing](https://www.wikidata.org/wiki/Wikidata:Licensing)、[Copyright](https://www.wikidata.org/wiki/Wikidata:Copyright) | 結構化實體資料採 CC0；說明頁等其他內容不套用此授權。未重製其說明文章。 |
| [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)、[法律文本](https://creativecommons.org/publicdomain/zero/1.0/legalcode.en) | 允許本批基本欄位再利用及公開展示，包含商用；不保證資料正確、其他人的權利或商標權。未使用營運方標誌或暗示合作。 |
| [Wikimedia 使用條款](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use) | 再利用遵循個別內容授權；條款不能被解讀為可任意複製外站內容。 |
| [Data access](https://www.wikidata.org/wiki/Wikidata:Data_access) | 使用官方實體 JSON 提供方式，取得目前版本後保存版本號。 |
| [API 使用規範](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_API_Usage_Guidelines)、[User-Agent 規範](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy/en) | 少量循序請求、可辨識的工具名稱與公開專案網址；不假扮瀏覽器、不繞過限制。 |
| [API Etiquette](https://www.mediawiki.org/wiki/API:Etiquette)、[Robot policy](https://wikitech.wikimedia.org/wiki/Robot_policy)、[robots.txt](https://www.wikidata.org/robots.txt) | 先查看存取規範；選擇明示允許的 EntityData 格式化路徑。robots 只處理存取，不代替內容授權。 |

核對結論僅適用本批 CC0 基本欄位、所述存取方式及網站用途，不能承諾任何情境下「完全合法」或所有來源未來均可使用。權利或條款有疑慮時，停止對應資料擷取，另找具明確授權的來源或保留待確認。

## 實際取得方式、費用與隱私

1. 在告知使用者來源、方式、授權、費用與限制後，讀取官方 `https://www.wikidata.org/wiki/Special:EntityData/Q識別碼.json`。
2. 共 12 個實體，循序請求，不併發、不大量下載。User-Agent 為 `BangkokTravelGuideContentBot/1.0` 並附此專案 GitHub 網址，要求 gzip 與 JSON。遇錯停止，無登入、驗證繞過或持續重試。
3. 原先搜尋 API 路徑的本機嘗試因 DNS 問題未取得任何資料；檢視 robots 後不採用該路徑，改用明示允許的 EntityData 格式。
4. 無金鑰、訂閱或 API 費用；沒有向來源傳送使用者備註、行程、信用卡選項、帳密或個資。請求一般會讓提供者看到連線 IP 與 User-Agent，依其服務政策處理。
5. 完整原始 JSON 僅保存在被 `.gitignore` 排除的 `docs/local/content-research/`，作為本機核對紀錄。預計公開的檔案僅保留所需英文名稱、P625 座標、P856 網站、P238 機場碼與來源／版本／授權等欄位。
6. 網站使用離線資料檔，訪客載入網站不會自動請求 Wikidata；沒有定期爬蟲。未來更新同樣先核對來源規範，再少量讀取、測試並經發布程序。

替代方案：保留未核實的原創規劃建議、僅提供外部連結，或取得營運方對特定欄位／素材的明確授權。沒有導入條款不明的旅遊平台擷取工具。

## 逐筆來源與版本

每個來源網址均對應相同 Q 識別碼的 EntityData JSON。取得日期均為 2026-10-05，基本欄位授權均為 CC0-1.0。

| 網站地點／機場 | 來源 | 資料版本 |
|---|---|---|
| 大皇宮 | [Q873769](https://www.wikidata.org/wiki/Q873769) | 2543941912 |
| 臥佛寺 | [Q1059910](https://www.wikidata.org/wiki/Q1059910) | 2543256727 |
| 鄭王廟 | [Q724970](https://www.wikidata.org/wiki/Q724970) | 2513533803 |
| Siam Paragon | [Q972334](https://www.wikidata.org/wiki/Q972334) | 2545977656 |
| BACC | [Q1130188](https://www.wikidata.org/wiki/Q1130188) | 2413717226 |
| Jim Thompson House | [Q2916351](https://www.wikidata.org/wiki/Q2916351) | 2487167554 |
| 倫披尼公園 | [Q977437](https://www.wikidata.org/wiki/Q977437) | 2442775722 |
| CentralWorld | [Q3270302](https://www.wikidata.org/wiki/Q3270302) | 2523937405 |
| Terminal 21 | [Q3278033](https://www.wikidata.org/wiki/Q3278033) | 2552097508 |
| 洽圖洽公園 | [Q1936390](https://www.wikidata.org/wiki/Q1936390) | 2465689580 |
| BKK 素萬那普機場 | [Q194316](https://www.wikidata.org/wiki/Q194316) | 2547988545 |
| DMK 廊曼機場 | [Q1046755](https://www.wikidata.org/wiki/Q1046755) | 2547975895 |

已逐筆比對本機原始回應的版本及取用欄位，12 筆一致。基本資料是社群維護，部分主張沒有參考來源；此檢查不是營運方事實驗證。

## 展示與準確性限制

- 來源核對日期與營運查證日期分開；10 個地點的 `confirmedAt` 保持未知，營業時間、票價及無障礙設施待確認。
- 座標為概略位置，不是入口、碼頭、機場乘車處或已驗證步行路線。
- Wikidata 所列網站只作外部連結，未擷取其內容，未保證連結現況、身分或營運公告最新。Terminal 21 項目也描述品牌系列；本站僅取其曼谷座標作為 Asok 規劃點，不能推論其他分店。
- 沒有讀取 TAT、機場、景點、銀行或旅遊平台的文章、價格、照片、旅客評價等作為這批資料。沒有下載外站照片或使用照片冒充據點。
- 地點介紹、選房方法、準備清單與三日編排由專案使用 Codex 協助撰寫，不是引用官方介紹或營運方背書。
- 費用、交通時間與停留長度是本站預留估算；0 不代表免費。原有示範排程區間仍會顯示未核實提醒，不作為官方營業資訊展示。
- 三日安排是三個可遊覽日的起點；三天兩夜需依航班縮減。餐廳自選，不讓虛構餐廳出現在這份原創行程中。機票、住宿、機場往返及未知項目不視為零成本。
- 名稱與來源標示不構成對第三方商標、照片或其他未用素材的授權。日後官方營業與價格資料需逐站核對條款及使用方式；不因公開可讀就推論可自動擷取。

## 已驗證項目

- 34 項自動測試：既有日期、排程、預算、存取、權益判斷等 31 項，加上基本來源狀態、三日動線及備份相容、來源缺漏拒絕共 3 項。
- 本機 31 個相關頁面，1280、768、390 三種寬度，共 93 次頁面檢查：單一主標題、可顯示、無頁面橫向溢出、無損壞圖片。手機長連結溢出曾發現並修復，相關頁面複測通過。詳見 [頁面紀錄](first-visit-route-checks.json)。
- 實際互動：指南分段定位、推薦日期變更及日切換、三日副本進入編輯器、新公園加入、儲存及重新整理後保留、備份保留 CC0 與資料版本、從詳細頁加入測試行程指定天數、地圖顯示。
- 本機 GitHub Pages 建置版另檢查相同 31 個路由、指南分段按鈕及景點頁重新整理；均可開啟，沒有頁面橫向溢出或瀏覽器錯誤。分段定位不會改寫 Pages 路由。此項不等於已發布後的正式網址驗證。
- 測試只改動新的本機 QA 行程，不清除原有資料、不向第三方傳送備份。新增測試行程名稱為「QA｜首次內容三日測試」，保留供檢查。
- 一般建置與 GitHub Pages 建置、Pages 路徑檢查、工作檔案常見機密檢查及 Git 格式檢查於本批完成時執行。正式公開網址仍為舊版，本批發布後的正式站驗證需另行完成。

畫面： [本機預覽](first-visit-preview.png)、[手機預覽](first-visit-mobile-preview.png)。本次未安裝新套件、未變更帳號權限、未加入付費服務。

先完成本機可查看結果；使用者於 2026-10-05 回覆「同意」後，已推送並啟動 Pages 發布。正式版本為 `718f61c`，流程與正式網址驗證見 [發布紀錄](first-visit-release.md)。本文件上方的本機測試是發布前紀錄，不替代正式測試。
