#!/bin/zsh
set -eu
cd -- "$(dirname -- "$0")"
TASK_NODE_PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if [[ ! -x "$TASK_NODE_PATH" ]]; then
  TASK_NODE_PATH="$(command -v node || true)"
fi
if [[ -z "$TASK_NODE_PATH" || ! -f node_modules/vite/bin/vite.js ]]; then
  print '缺少網站執行工具。請讓 Codex 檢查此專案，不需要自行安裝。'
  read '?按 Enter 關閉。'
  exit 1
fi
print '正在啟動 Bangkok Travel Guide。請保留這個視窗。'
print '預覽網址：http://127.0.0.1:5173；不會部署或上傳個人行程。'
exec "$TASK_NODE_PATH" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort
