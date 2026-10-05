# GitHub 與 GitHub Pages｜初學者部署說明

更新：2026-10-05。**目前只有本機準備，尚未推送或公開部署。** 不需要使用者輸入 Git 指令。

## 三個名稱的意思

- **Git**：在電腦中保存網站程式的版本紀錄。commit 就是一次有名稱的版本存檔。
- **GitHub Repository**：存放程式與版本紀錄的網路專案資料夾。
- **GitHub Pages**：把建置好的網站檔案變成可以開啟的公開網站。

本機 Git 初始化不等於上傳；推送到公開 Repository 會讓程式、文件、圖片及提交作者資訊對外公開。Pages 發布後，網站任何人皆可瀏覽。訪客保存在自己瀏覽器中的行程不會隨程式上傳。

## 為什麼適合目前版本

React + Vite 產生靜態檔案，不需要後端、登入資料庫、API 金鑰或即時 AI。規則排程、卡片查詢與 Local Storage 在訪客瀏覽器中運作。未來若加入必須保密的 API 金鑰或會員後端，需另行規劃，不能把金鑰放進前端。

預計專案名稱：`bangkok-travel-guide`。

公開網址格式：`https://你的帳號.github.io/bangkok-travel-guide/`。目前沒有實際公開網址。

頁面網址範例：`https://你的帳號.github.io/bangkok-travel-guide/#/trips/bangkok-4`。`#/` 讓瀏覽器處理各頁面，直接貼網址與重新整理也能開啟。需要從舊頁面的完整網址移轉時，可提供新網址；未建立站外自動重導。

一般本機預覽保留 `http://127.0.0.1:5173/trips/bangkok-4`。Pages 建置輸出 `dist-pages/`，一般建置輸出 `dist/`，互不覆蓋。

## 第一步：由使用者建立或登入帳號

現在先做這一步即可，其餘步驟由 Codex 在後續逐步協助。

1. 開啟 [GitHub 首頁](https://github.com)。已有帳號選 **Sign in**；沒有帳號選 **Sign up**。
2. 自己完成帳號、信箱驗證、密碼、驗證碼與服務條款。先選免費方案，不需要填信用卡或購買 Copilot。
3. 右上角頭像 → **Settings** → 左側 **Emails**。建議勾選 **Keep my email addresses private** 與 **Block command line pushes that expose my email**。
4. 記下此頁提供、以 `@users.noreply.github.com` 結尾的位址。這是提交程式用的替代信箱，可以避免真實信箱出現在公開版本紀錄。
5. 回覆 GitHub 使用者名稱、希望 commit 顯示的作者名稱（可用使用者名稱），以及 GitHub 提供的 noreply 位址。不要提供密碼、Token 或驗證碼。

Codex 收到作者資訊後，只對這個專案設定 Git 作者，不改全電腦的 Git 設定，並建立第一個本機 commit。若不想提供作者資訊，可以先停在本機準備狀態。

## 第二步：確認公開範圍，再建立 Repository

**先確認再操作，尚未取得公開建立／上傳的確認。**

免費 GitHub Pages 適用公開 Repository；公開代表程式與版本紀錄也可以被他人查看、下載。若希望程式不公開，先告訴 Codex，由你決定符合方案的私有 Pages 或其他主機；不自動付費。

本專案含自行建立的範例、待確認資料、AI 插畫、原創 SVG 與測試文件。真實信用卡入場權益已查證 0 筆；網站適合功能示範，尚不宜當作已查證的旅遊權益資料庫。素材公開權利、對外聯絡管道與公開說明仍需在正式發布前核對。不會替你任意加入開源授權。

取得公開範圍確認後，Repository 建立畫面：

1. 右上角 **＋** → **New repository**。
2. Owner 選自己的帳號；名稱填 `bangkok-travel-guide`。
3. 選已確認的公開／私有範圍。要使用免費 Pages 時選 **Public**。
4. 不勾選 README、.gitignore 或 License 的自動新增，這些檔案已有本機版本。
5. 確認後由你按 **Create repository**，把產生的 Repository 網址提供給 Codex。

如果同名 Repository 已存在或已經有內容，Codex 先檢查，不覆蓋、不刪除、不 Force Push。

## 第三步：安全推送

Codex 會核對遠端網址屬於你、檔案清單與安全檢查結果，並在取得確認後推送。需要登入授權時交由你本人完成官方 GitHub 畫面。還未決定授權方式；不會要求你把 PAT、密碼、SSH 私鑰或一次性驗證碼貼進聊天／專案。

`.gitignore` 排除套件、建置輸出、環境變數、私密設定、憑證與行程備份；掃描另外檢查 Git 暫存區的實際內容，不僅依靠忽略清單。掃描不能保證找出任意格式的秘密或個資，仍需人工核對。

## 第四步：Pages 權限與發布

取得正式公開發布確認後，Repository → **Settings** → **Pages** → **Build and deployment** → **Source** 選 **GitHub Actions**。

已準備 `.github/workflows/pages.yml`，只在手動啟動時執行；第一次推送與之後修改不會自動發布。開啟 **Actions** →「發布 Bangkok Travel Guide 至 GitHub Pages」→ **Run workflow** → 選 `main`，確認公開範圍後勾選確認欄位再執行。

流程只讀取程式、檢查、測試、產生 `dist-pages/`、上傳網站產物及發布。發布工作需要 `pages: write` 與 `id-token: write`，用途是讓 GitHub 自己的工作流程取得 Pages 發布許可；沒有設定自己的 Token 或永久 API Key。這是程式設定，尚未登入或實際授權。GitHub Actions 執行時會安裝 Node.js 24、pnpm 11.19.0 及鎖定版本的專案套件，只影響 GitHub 執行環境，不替這台 Mac 安裝新軟體。

使用免費公開方案；若畫面要求方案升級、付款、預算設定或額外授權，先停止確認。GitHub 網域不用購買自訂網域；自訂網域不在本次範圍。

## 第五步：正式網址測試

部署成功後 Codex 會用實際網址檢查首頁、詳細頁直接開啟／重新整理、導覽與返回、圖片、404 顯示、手機／平板／電腦、示範信用卡查詢、自動排程、編輯、保存、重新開啟、備份與匯入。GitHub Actions 成功或本機測試通過都不能取代正式網址驗證。

本機與正式網站是不同儲存來源；需要在本機先匯出，再在正式網址匯入。GitHub Pages 同一帳號的其他專案通常共用 `帳號.github.io` 網域，請不要把敏感資料存在行程。本站沒有雲端同步，不會將行程自動上傳 Repository。

## 官方依據

- [GitHub Pages 與公開／私有方案](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Vite 的 GitHub Pages 資源前綴與 Actions 設定](https://vite.dev/guide/static-deploy.html)
- [HashRouter 頁面網址處理方式](https://reactrouter.com/api/declarative-routers/HashRouter)
- [GitHub commit 信箱與 noreply](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)
- [GitHub 隱私聲明](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)

條款、方案與操作畫面會變動，正式操作時再次核對；沒有導入外部資料擷取。
