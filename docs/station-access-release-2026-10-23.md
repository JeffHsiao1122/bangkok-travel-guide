# 景點與車站第一批正式發布（2026-10-23）

使用者於檢視本機預覽及發布確認問題後回覆「請繼續下一階段」，依本次確認提交、推送與手動發布本批。

- 程式版本：db184ddd6ad46623c1467087081e2fe6db775f0a。
- GitHub Pages 流程：https://github.com/JeffHsiao1122/bangkok-travel-guide/actions/runs/39939272503 ，build 與 deploy 均成功。
- 正式頁面：https://jeffhsiao1122.github.io/bangkok-travel-guide/#/travel/transportation?destination=terminal21 。
- 暫存區 191 檔常見憑證規則掃描無發現；差異檢查通過。GitHub 執行 55 項測試、建置及資源路徑檢查通過。

## 正式網站驗證

獨立 Chrome 測試環境，先建立合成三日行程；不讀取使用者的瀏覽器行程。在 390、768、1280px：

- 十個景點選項共 30 次切換，候選車站、待確認與來源內容正確。
- 十個景點詳情共 30 次頁面檢查，區塊存在且無水平溢出。
- 選項重整保留；交通頁與景點詳情往返保留選擇；無效或特殊 query 回復安全預設，不產生不存在的車站。
- 來源頁呈現八個車站的 CC0 來源版本，既有 Wikivoyage 文字的 CC BY-SA 作者／版本保留。
- 合成行程的本機原始保存字串完全不變；沒有程式錯誤、背景外站或非讀取請求。

正式 HTML 保留 no-referrer；主 JavaScript、CSS 及 content-licenses.txt 三個檔案與本機建置 SHA-256 全部一致。原始合成驗證與截圖留在忽略上傳的 docs/local/station-live-qa/results.json、assets.json 及對應圖片。

## 範圍與限制

沒有更改原帳號名稱、組織、其他專案或原網站網址。沒有導入新套件、費用、帳號、執行期旅遊 API、定位或銀行功能。

來源取用方式的更正完整保留於 station-access-review-2026-10-23.md；發布不代表對過程或所有資料提供全面法律保證。正式展示採用允許的 EntityData JSON 最小結構化欄位，沒有把搜尋回傳的敘述文字或業者圖片納入內容。

八個站點不是完整曼谷交通資料庫。票價、首末班、出口、步行時間、無障礙與當日營運仍待確認；來源日期不等於官方核實。Sukhumvit 疑義代碼與粗座標不採用，Asok／Sukhumvit 分列，鄭王廟不虛構候選車站。瀏覽器尺寸模擬不代表所有實機或 Safari 都已驗證。
