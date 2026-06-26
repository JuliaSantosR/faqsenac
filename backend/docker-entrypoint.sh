#!/bin/sh
set -e

echo "Executando migrações do banco de dados..."
npx prisma migrate deploy

echo "Verificando se o seed é necessário..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  prisma.\$disconnect();
  process.exit(count === 0 ? 0 : 1);
}).catch(() => { process.exit(0); });
" && npx ts-node -r tsconfig-paths/register prisma/seed.ts || true

echo "Iniciando a aplicação..."
exec node dist/src/main
