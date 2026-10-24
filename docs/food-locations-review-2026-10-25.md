# 餐廳概略定位：來源與本機審查

日期：2026-10-25。狀態：本機完成，尚未發布本批。

## 結果與範圍

為既有六個據點補充位置資料：Thip Samai（313 Maha Chai Rd）、Mont Nomsod（160/1-3 Dinso Rd）、Prachak（1415 Charoen Krung Rd）、Roong Roeng（10/3 Sukhumvit Soi 26）及 Wattana Panich（336 338 Ekkamai Rd）五筆有社群指南概略座標；Som Tam Nua（392/14 Siam Square Soi 5）來源沒有座標，維持成對 null。

資料不代表店家現在營業、實際入口、無障礙、最近車站或已查到的道路路線。餐費、營業時間、官方網站及設施仍未知，不採用舊列價、時段、評價、獎項或照片。餐廳仍 planningEligible:false，無 CC0 fact，也不因有位置就自動安排；手動新加入可繪入位置示意，交通仍只是本站距離估算。

舊店名／店址／餐點欄位保留 2026-10-06 原參考日期與原版本；新定位閱讀於 2026-10-25，分別記錄版本。Wattana 定位條目標示 2025-01-02，是來源條目的日期，不宣稱座標或營業當日獨立核實。其他來源沒有條目日期，保留未知。

## 取用前條款核對與方法

先重新檢視 Wikidata Licensing、Data access、robots、Wikimedia Terms、API Usage Guidelines 與 User-Agent Policy。候選 Thipsamai Q130535616 的公開搜尋線索不足以可靠確認特定分店，沒有取用實體 JSON 或匯入其座標；其他搜尋結果未作為網站欄位或複製文章。

改採已在本網站使用的 Wikivoyage，正式實作前向使用者說明範圍及相同授權條件，先檢視：

- [Copyleft](https://en.wikivoyage.org/wiki/Wikivoyage:Copyleft)、[重用規則](https://en.wikivoyage.org/wiki/Wikivoyage:How_to_re-use_Wikivoyage_guides)。
- [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 及 [法律條文](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en)：重用／改寫需保留署名、來源、修改及授權，不施加額外限制；不暗示背書或保證其他權利。
- [robots](https://en.wikivoyage.org/robots.txt)：一般 /wiki/ 文章可低頻閱讀；本批不存取 /w/、/api/ 或 Special 路徑。
- [Wikimedia Terms](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use)、[API Usage Guidelines](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_API_Usage_Guidelines)、[User-Agent Policy](https://foundation.wikimedia.org/wiki/Policy:User-Agent_policy)。

使用明確識別專案與 bot 的 User-Agent，對四個預選一般文章依序讀取，頁面請求間隔 31 秒；沒有並行擷取、搜尋 API、歷史頁請求或繞過限制。只從文章內的 listing 名稱、街道及 lat／long 欄位對照六個既有據點，不抓取外部官方網站、地圖圖磚、Special:Map、照片或其他資產。沒有錯誤後換身分或限制規避。

文章 HTML 僅供解析；本機研究證據已縮減為採用／缺漏依據的名稱、街道、座標及版本，不保存全文或不採用的營運、價格、聯絡與描述欄位。公開檔案只有最小結構與授權元資料。沒有爬蟲排程、資料庫鏡像或訪客端查詢。

本批無金鑰、帳號、費用或新套件。合法替代方式是原有店名／街道外部地圖搜尋及原創用餐規劃；權利或據點身分不明時保留未知。授權清楚不等於內容正確、現況有效或全面法律保證，未採用業者文章與評論補缺。

## 來源版本與署名

| 來源文章 | 新定位版本 | 對應據點 | 狀態 |
|---|---:|---|---|
| [Rattanakosin](https://en.wikivoyage.org/wiki/Bangkok/Rattanakosin) | 5394401 | Thip Samai、Mont Nomsod | 店名、街道相符，採概略座標 |
| [Siam Square](https://en.wikivoyage.org/wiki/Bangkok/Siam_Square) | 5397669 | Som Tam Nua | 明確無座標，不猜測 |
| [Silom](https://en.wikivoyage.org/wiki/Bangkok/Silom) | 5398299 | Prachak | 店名、街道相符，採概略座標 |
| [Sukhumvit](https://en.wikivoyage.org/wiki/Bangkok/Sukhumvit) | 5397702 | Roong Roeng、Wattana Panich | 店名、街道相符，採概略座標 |

作者為 Wikivoyage contributors，保留原文及作者歷史連結，最小摘錄與重組欄位維持 CC BY-SA 4.0，保留原有相容授權／既有修改及無保證說明，沒有將內容改授權成 CC0 或將網站整體改授權。來源版本均從當次一般頁面元資料記錄，不自動抓取限制的歷史網址。

餐廳詳細頁分開兩批署名；新地圖點有座標來源授權；JSON 快照帶新舊元資料，列印按網址加版本區分，避免相同文章的新舊版相互覆蓋。公開 `content-licenses.txt` 已加入四篇版本。外部地圖仍僅使用官方 URLs 格式，沒有改用 API 或擷取結果。

## 相容與驗證

不變更 schemaVersion、識別碼、既有行程或草稿。舊行程有 null 座標時仍維持未知，不自動用新資料更新；只有新手動加入活動取得新快照。新定位會改變新活動的距離交通估算，仍非實際路線，餐費保持 null 並顯示合計不完整。

- 82 項程式測試通過；原有未知座標測試改用明確舊版快照繼續驗證，沒有移除該能力。新測試涵蓋五筆定位／一筆未知、分別日期與來源、備份及舊版並存、仍不自動安排、實際頁面與雙版本列印署名。
- Chrome 390／768／1280px：六個詳情及來源、逐筆手動加入、5 個地圖點與 1 個未知提示、未知餐費、重載、JSON、列印及舊行程完全保留均通過。無頁面錯誤或背景外站請求。
- 六組核心流程與 118 網址三種尺寸共 354 次檢查通過；Pages 建置與資源前綴通過。餐廳詳情與定位署名按需載入，初始程式小於 500 kB。
- 來源檔與測試資料沒有電話、Email、卡號、帳密或私人資料；交付前另做常見敏感資訊及差異檢查。

見 [測試摘要](food-locations-checks-2026-10-25.json)。詳細合成行程、來源最小證據與畫面保留本機忽略目錄；沒有操作使用者目前的瀏覽器。尺寸為 Chrome 模擬，不等於全部實機／Safari 驗證。
