#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "Encerrando serviços..."
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if ! command -v npm >/dev/null 2>&1; then
  echo "Erro: npm não encontrado. Instale o Node.js antes de continuar."
  exit 1
fi

if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "Instalando dependências do frontend..."
  (cd "$ROOT/frontend" && npm install)
fi

echo "Subindo frontend..."
(cd "$ROOT/frontend" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "Projeto rodando:"
echo "  Frontend: http://localhost:5173"
echo ""
echo "Dados persistidos no localStorage do navegador."
echo "Pressione Ctrl+C para encerrar."
echo ""

wait "$FRONTEND_PID"
