# UniFAQ

Plataforma de perguntas frequentes da Faculdade Senac Palhoça para candidatos do Programa Senac de Gratuidade (PSG).

## Estrutura do repositório

```
faqsenac/
├── frontend/     # React 18 + Vite + TypeScript (SPA)
├── backend/      # NestJS + Prisma + PostgreSQL (API REST)
├── guidelines/   # Documentação técnica do projeto
└── fixtures/     # Materiais de referência acadêmica
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação web sobe em `http://localhost:5173`.

## Backend

```bash
cd backend
docker compose up --build
```

A API REST sobe em `http://localhost:3000`.

Consulte [backend/README.md](backend/README.md) para endpoints, credenciais do seed e exemplos de uso.
