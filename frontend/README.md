# UniFAQ — Frontend

SPA React + Vite + TypeScript da plataforma UniFAQ.

## Desenvolvimento

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run typecheck` | Verificação de tipos TypeScript |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API NestJS (ex.: `http://localhost:3000`) |

## Credenciais de acesso admin (backend seed)

- E-mail: `admin@senac.local`
- Senha: `admin123`
