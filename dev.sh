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
  (cd "$ROOT/backend" && docker compose down) 2>/dev/null || true
}

trap cleanup EXIT INT TERM

if ! command -v docker >/dev/null 2>&1; then
  echo "Erro: Docker não encontrado. Instale o Docker antes de continuar."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Erro: Docker Compose não encontrado. Instale o Docker Compose antes de continuar."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Erro: npm não encontrado. Instale o Node.js antes de continuar."
  exit 1
fi

if [ ! -f "$ROOT/frontend/.env" ]; then
  cp "$ROOT/frontend/.env.example" "$ROOT/frontend/.env"
  echo "Arquivo frontend/.env criado a partir de .env.example"
fi

if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "Instalando dependências do frontend..."
  (cd "$ROOT/frontend" && npm install)
fi

echo "Subindo backend (PostgreSQL + API)..."
(cd "$ROOT/backend" && docker compose up --build -d)

echo "Aguardando API ficar pronta em http://localhost:3000 ..."
ready=0
for _ in $(seq 1 60); do
  if curl -sf "http://localhost:3000/faq/categories" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 2
done

if [ "$ready" -ne 1 ]; then
  echo "Aviso: a API ainda não respondeu. O frontend será iniciado mesmo assim."
  echo "Verifique os logs com: cd backend && docker compose logs -f api"
fi

echo "Subindo frontend..."
(cd "$ROOT/frontend" && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "Projeto rodando:"
echo "  Frontend: http://localhost:5173"
echo "  API:      http://localhost:3000"
echo ""
echo "Logs do backend: cd backend && docker compose logs -f"
echo "Pressione Ctrl+C para encerrar tudo."
echo ""

wait "$FRONTEND_PID"
