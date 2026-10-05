#!/bin/zsh
set -eu
cd -- "$(dirname -- "$0")"
TASK_NODE_PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if [[ ! -x "$TASK_NODE_PATH" ]]; then
  TASK_NODE_PATH="$(command -v node || true)"
fi
if [[ -z "$TASK_NODE_PATH" || ! -f node_modules/vite/bin/vite.js ]]; then
  print '缺少網站執行工具。請讓 Codex 檢查此專案。'
  read '?按 Enter 關閉。'
  exit 1
fi
print '執行本機自動測試，接著產生網站發布檔案；不會部署。'
"$TASK_NODE_PATH" --test tests/*.test.js
"$TASK_NODE_PATH" node_modules/vite/bin/vite.js build
print '檢查完成。網站尚未發布。'
read '?按 Enter 關閉。'
