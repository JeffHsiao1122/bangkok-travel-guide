# 鍵盤操作改善正式發布（2026-10-23）

使用者於本批發布確認問題後回覆「請繼續下一步」，據此提交及發布。

- 程式版本：5118b38e1796b07b30804cf64fe83df86a2daaeb。
- GitHub Pages 流程：https://github.com/JeffHsiao1122/bangkok-travel-guide/actions/runs/39929222829 ，build 與 deploy 均成功。
- 網站：https://jeffhsiao1122.github.io/bangkok-travel-guide/ 。
- 上傳前暫存區共 175 檔常見憑證規則掃描無發現，差異格式檢查通過。GitHub 建置過程再次執行 48 項測試與 Pages 資源檢查並通過。

## 正式網站驗證

獨立 Chrome 環境與合成三日行程，390 與 1280px 共 10 組鍵盤檢查全部通過，沒有頁面程式錯誤：

- Tab／Enter 跳至主要內容、鍵盤導覽跨頁後焦點到主要內容。
- 確認視窗開啟時焦點在取消；Tab 不到背景控制項；Escape 及取消保留原始行程內容並把焦點還給刪除按鈕。
- 備份視窗按 Escape 關閉並回到匯出按鈕。
- 手機選單 Escape 關閉回到選單按鈕；點選目前頁面也能收起並移到內容。

正式 HTML 保留 no-referrer，主 JavaScript 與 CSS 的 SHA-256 均與本機已測建置完全一致。詳細合成結果只存於忽略上傳的 docs/local/keyboard-qa/live-results.json 與 live-assets.json；未讀取或改動使用者的瀏覽器儲存。

沒有新增外部資料、API、套件或個人資訊欄位。這是 Chrome 鍵盤驗證，沒有宣稱完成讀屏、Safari、實機觸控或完整無障礙認證。
