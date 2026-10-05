import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Pages 專案網址有資料夾前綴；本機與一般靜態建置保留原本路徑。
  base: mode === 'pages' ? '/bangkok-travel-guide/' : '/',
  build: { outDir: mode === 'pages' ? 'dist-pages' : 'dist' },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
}));
