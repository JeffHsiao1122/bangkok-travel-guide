# 五篇原創貴賓室指南：正式發布紀錄

日期：2026-10-23。使用者在檢視五篇指南及明確的發布確認問題後回覆「請繼續下一步」，據此確認本批 GitHub 上傳與 Pages 公開發布。

## 版本與部署

- 程式版本：`cff68e539dda1f13a5479ddc71b0b2e77a8317b9`。
- [GitHub Actions](https://github.com/JeffHsiao1122/bangkok-travel-guide/actions/runs/39919661579)：build 與 deploy 均成功。GitHub 執行安全檢查、鎖定套件安裝、47 項測試、建置與資源路徑檢查。
- [第一次使用貴賓室指南](https://jeffhsiao1122.github.io/bangkok-travel-guide/#/guides/first-lounge)、[所有指南](https://jeffhsiao1122.github.io/bangkok-travel-guide/#/guides)。
- 上傳前暫存區掃描 144 個檔案（105 個文字檔）未發現常見敏感格式；差異與 Pages 資源檢查通過。安全掃描不能保證辨識所有秘密、個資或素材權利。

## 內容範圍

五篇原創一般指南、逐節文章目錄、FAQ、相關閱讀、Miracle／Coral 原創比較問題表，以及貴賓室與網站地圖的閱讀入口。沒有新增營運事實、即時價格、預約收款、外部 API、銀行或信用卡功能。來源處置、規範及本機測試見 lounge-guides-review.md。原有 CC BY-SA 名稱概覽署名與公開授權檔保留。

## 正式網址驗證

使用隔離 Chrome，只允許本站網域，不讀取使用者登入、行程或瀏覽器歷史，也不點擊第三方服務。

- 8 頁（貴賓室、攻略列表、網站地圖、五篇指南）×390／768／1280，共 24 次檢查通過；每頁一個主標題、無整頁水平溢出或銀行功能入口，文章目錄在手機亦可見。
- 16 項互動通過：三種尺寸文章目錄與焦點、五篇逐節目錄且網址不變、五篇 FAQ 與相關文章入口、比較文章限制、貴賓室閱讀入口與網站地圖。
- 無 JavaScript 頁面錯誤。
- HTML、favicon、JS、CSS、主視覺、程式授權、內容授權 7 個資源均 HTTP 200，SHA-256 全部與本機發布檔相同。

首次公開瀏覽器檢查沿用本機 7 秒導覽等待而逾時，調整至公開網路適用的 30 秒導覽等待並以 DOM 載入後開始檢查，重跑整套後通過，沒有更動網站或略過功能檢查。

結果：lounge-guides-live-browser-checks.json、lounge-guides-live-assets.json；截圖：lounge-guides-live-preview-390.png、lounge-guides-live-preview-768.png、lounge-guides-live-preview-1280.png。

## 限制

指南為一般使用建議，非特定營運方公告、設備承諾、評分或真實入場認證。逐據點位置、營業、費用及設備仍待取得可重用來源並核實。這是相關頁面與有限操作的驗證，不代表所有網站功能、瀏覽器或實體裝置的全面認證。

後續文件提交只保存發布結果，不會自動觸發再部署；已部署程式版本保持上述版本。
