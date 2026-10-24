# BKK／DMK 機場進城指南（2026-10-24）

狀態：本機完成後已依使用者確認發布，見 [正式紀錄](airport-transfer-release-2026-10-24.md)。原帳號名稱、組織、遠端及正式網址未更改。

## 本批內容

新頁面 `/airport-transfers`，以機場、抵達時段及行李／協助需求三種選單顯示原創準備提醒。沒有要求航班、住址、飯店名稱或身分資料，不讀定位、不查班次、不代訂。

- BKK：ARL Suvarnabhumi → Phaya Thai ARL → Phaya Thai BTS，或 ARL Suvarnabhumi → Makkasan ARL → Phetchaburi MRT，均列候選順序，不是當日已確認導航。
- DMK：Don Mueang 深紅線車站候選及市區後續接續核對；保留既有社群指南對 DMK 描述不一致的限制，不保證機場步行接續或當期服務。
- 車輛方案比較計程車、應用程式叫車、預約接送的核對項目與費用拆項，沒有價格、訂車表單或付款。
- 抵達四階段的時間拆解；五項準備清單只在頁面記憶體暫存，切換機場或重新整理重設。勾選不認證班次、訂位或設施。
- 首頁、首次指南、交通頁、兩個機場頁及 Sitemap 加入可操作入口。新增頁面按需載入，來源摘要獨立共用，未新增套件。

## 來源與存取方式核對

核對日期：2026-10-24。政策／條款由官方頁面查閱，不搬用政策全文。

| 來源／規範 | 本次採用方式與限制 |
|---|---|
| https://www.wikidata.org/wiki/Wikidata:Licensing | 主實體的結構化名稱、代碼、座標與站點關聯採 CC0；不包含圖片、文章或營運方授權。 |
| https://www.wikidata.org/wiki/Wikidata:Data_access | 官方明示 EntityData `.json` 的單實體資料介面；本次只有六個已選實體。 |
| https://www.wikidata.org/robots.txt | `/wiki/Special:EntityData/*.` 的格式化允許路徑；沒有使用 `/w/api.php` 搜尋或一般 `/w/` 抓取。 |
| https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use | 授權與 API／存取政策分開遵守，不視為全網資料重用許可。 |
| https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_API_Usage_Guidelines | 逐筆、低頻、保存快照；遇拒絕／限流即停止，不繞過。 |
| https://foundation.wikimedia.org/wiki/Policy:User-Agent_policy | 標示專案 ContentReviewBot、版本及公開專案網址，接受 gzip/deflate，未冒用瀏覽器。 |

實體識別先由網頁搜尋與公開實體關聯連結定位；沒有沿用上一批已停止的 Wikidata 搜尋 API。之後六個 JSON 逐筆取用、每筆間隔至少 1 秒，沒有併發、重試繞過、帳號、金鑰或付費服務。沒有擷取業者文章、路線圖、評價、票價、時刻表或照片。

完整原始回應僅存於被忽略的 `docs/local/airport-transfer-research`。公開 `src/data/airport-station-facts.json` 只保留選定結構化欄位與版本、來源編輯時間及讀取日期，不含圖像、描述全文或使用者資料。資料採 CC0 可保存與公開重用，保留來源為追溯措施；不主張所有存取方式、營運資訊或第三方內容一併可用。

新欄位來源版本如下：

- Suvarnabhumi Station：https://www.wikidata.org/wiki/Q6633190，版本 2538367698，來源編輯 2026-08-30T22:50:53Z，讀取 2026-10-24。
- Phaya Thai Airport Link Station：https://www.wikidata.org/wiki/Q13021649，版本 2461764757，來源編輯 2026-02-08T14:21:19Z，讀取 2026-10-24。
- Phaya Thai BTS Station：https://www.wikidata.org/wiki/Q15139351，版本 2466218838，來源編輯 2026-02-24T05:16:32Z，讀取 2026-10-24。
- Makkasan station：https://www.wikidata.org/wiki/Q11340409，版本 2497064259，來源編輯 2026-05-25T03:03:14Z，讀取 2026-10-24。
- Phetchaburi MRT Station：https://www.wikidata.org/wiki/Q4921013，版本 2257871612，來源編輯 2024-10-08T14:53:15Z，讀取 2026-10-24。
- Don Mueang station：https://www.wikidata.org/wiki/Q35596136，版本 2436073846，來源編輯 2025-11-30T14:40:32Z，讀取 2026-10-24。

機場名稱與機場碼沿用先前 Wikidata CC0 快照（原讀取 2026-10-05），沒有本批重抓或更新日期。路線文字沿用 `railReferences` 的 Bangkok 社群指南欄位，仍保留原讀取 2026-10-05、原版本、作者歷史與 CC BY-SA 4.0；不把新站點日期套到舊路線。公開 `content-licenses.txt` 更新清單維護日期、分開註明兩種資料授權；來源頁可查看六個新站點的版本。

## 未採用與正確性界線

- Phaya Thai ARL 與 BTS 各自使用不同實體，不合併同名站，不假設同票、同閘門或無障礙接續。
- Makkasan 的 `CAT`、Phetchaburi 的 `PET` 未核實當期適用，暫不採用；Phaya Thai BTS 來源沒有代碼，不自行填入猜測值。
- Phetchaburi 座標 precision 約 0.00925 度，暫不提供定位；其他座標也只為概略站點，不是航廈樓層、入口或電梯。
- Don Mueang 採 Q35596136，來源列出取代 Q6585967 的關聯；不使用同名舊站的座標。仍不聲稱當日營運或航廈接續已由官方核實。
- 車站代碼 A1、A8、RN08 是來源欄位，不是機場碼、票價或即時狀態。車票、出口、時間、無障礙、天候與路況仍待核對。
- 沒有新增價格、完整通車時刻、步行分鐘數或當日可搭判斷，未知不視為零成本。所有選擇提醒為本站原創一般建議。
- 新頁面的來源欄位不進入使用者行程、排程限制或預算；沒有自動改寫既有資料。

替代方式為列出原創比較方法、可查路的站點名稱與待確認項目。未來要取用其他來源、申請授權、登入、付費或金鑰，仍先說明再處理。這份核對記錄不提供全面法律保證。

## 驗證結果

- 60 項測試通過；新增五項涵蓋 CC0 追溯、轉乘實體與舊站排除、18 組選擇條件、外部查站與排程隔離、實際元件授權與無個資欄位。
- Pages 建置、資源前綴與差異檢查通過。機場指南 JS 約 8.42 KB 按需載入；初始主程式約 497.24 KB，無本批造成的 500 KB 區塊警告。未調高警告門檻。
- 新指南在 390、768、1280px 共 54 組選單情境通過；清單全勾、切換機場重設、重整重設、無效 query 安全預設皆通過。
- 兩機場頁與鐵路頁、首頁、首次指南、交通頁、網站地圖、六站來源展開與 lazy 模組載入均實際操作通過。
- 瀏覽器中原始合成三日行程保存字串完全不變，無背景外站或非讀取請求，無頁面程式錯誤，無整頁水平溢出。
- 既有六組主要操作流程與 118 個網址三種尺寸共 354 次檢查通過；正常下載／匯入、草稿、確認視窗與日期撤銷保持可用。
- 首次瀏覽器執行因隔日預覽服務未啟動而連線失敗，已由開發者啟動本機服務後重跑全部情境，沒有跳過失敗項目。
- 已目視檢查手機／電腦頁首與手機鐵路卡片；局部鐵路截圖僅在截圖期間暫隱固定導覽，以便閱讀完整區塊，不改產品導航。

公開合成結果：`airport-transfer-checks-2026-10-24.json`；代表圖：`airport-transfer-preview-390.png`、`airport-transfer-preview-1280.png`。詳細資料位於忽略上傳的 `docs/local/airport-transfer-qa`、`docs/local/airport-transfer-core`。

本批已依使用者確認公開發布。瀏覽器尺寸模擬不代表所有實機／Safari／讀屏均已驗證；發布確認也不是第三方授權或保證來源永遠正確。
