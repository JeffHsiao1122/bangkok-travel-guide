# BKK／DMK 機場進城指南正式發布（2026-10-24）

使用者在本批預覽與發布確認問題後回覆「請繼續下一階段」，依本次確認提交、推送、手動部署及驗證本批。

- 程式版本：eb0bad5a77913a322e9cbf04f47a949debd6af7d。
- GitHub Pages：https://github.com/JeffHsiao1122/bangkok-travel-guide/actions/runs/40079666917 ，build 與 deploy 均成功。
- 正式頁面：https://jeffhsiao1122.github.io/bangkok-travel-guide/#/airport-transfers?airport=bkk 。
- 上傳前 202 檔暫存內容通過常見憑證規則掃描及差異檢查；GitHub 執行 60 項測試與 Pages 建置／資源檢查通過。

## 正式網站驗證

獨立 Chrome 環境，使用合成三日行程，不讀取或修改使用者瀏覽器資料。

390、768、1280px：BKK／DMK × 三種抵達時段 × 三種行李需求，共 54 組情境全部通過，無整頁水平溢出。

- BKK 的兩種候選轉乘與 DMK 深紅線候選分開；Phaya Thai ARL／BTS 分站顯示。
- 清單可勾選，切換機場及重新整理會重設，不把勾選當成已訂位或班次可搭。
- 無效機場 query 回到 BKK 安全預設，不產生假站點或錯誤連結。
- 兩機場資訊頁、鐵路頁、首頁、首次指南、交通頁與 Sitemap 入口均實際點選通過；按需載入頁面模組正常。
- 來源頁可展開六個站點版本，CC0 與既有 Wikivoyage CC BY-SA 日期／作者分開呈現。
- 合成行程保存原始字串完全不變，無頁面程式錯誤、背景外站或非讀取請求。

正式 HTML 保留 no-referrer；主程式、新頁面模組、CSS 與 content-licenses.txt 四個檔案 SHA-256 均與本機已測建置一致。詳細合成結果與截圖保留在忽略上傳的 docs/local/airport-transfer-live-qa/results.json、assets.json 及對應圖片。

本機另有既有六組流程與 354 次網址尺寸回歸通過；不把該數字冒充正式網站重新全站巡檢次數。

## 範圍與限制

原帳號名稱、組織、遠端及網址不變；沒有搬移或刪除其他專案、改變使用者行程保存方式、新增套件、費用、登入、定位或銀行功能。

來源只新增六個 Wikidata CC0 最小結構化快照，逐筆取用允許的 EntityData JSON；未使用搜尋 API、業者文章、照片、時刻表或即時報價。完整條款、來源版本、未採用欄位與限制見 airport-transfer-review-2026-10-24.md，發布不構成全面法律或正確性保證。

Makkasan／Phetchaburi 疑義代碼、Phaya Thai BTS 缺漏代碼及 Phetchaburi 粗座標未採用；舊 Don Mueang 站不作為候選定位。當日票價、首末班、航廈接續、出口、步行時間與無障礙仍待確認，不因本批上線變成已核實。

此為 Chrome 尺寸模擬，未宣稱所有實機、Safari 或讀屏皆完成驗證。
