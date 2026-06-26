# UniFAQ

Plataforma de perguntas frequentes da **Faculdade Senac Palhoça** para candidatos do **Programa Senac de Gratuidade (PSG)**.

O sistema reúne FAQ por categorias, comunicados oficiais e um painel administrativo para editar o conteúdo exibido nas páginas públicas.

## Funcionalidades

### Páginas públicas

| Rota | Descrição |
|------|-----------|
| `/` | Home com busca, categorias do FAQ e comunicados em destaque |
| `/faq` | Perguntas frequentes com busca automática e filtro por categoria |
| `/comunicados` | Mural de avisos e comunicados do PSG |

### Painel admin (`/admin`)

- Edição dos textos da home
- Gerenciamento de categorias e perguntas do FAQ
- Suporte a **imagem** e **vídeo** (YouTube/Vimeo) nas respostas
- Publicação e edição de comunicados

**Credenciais do seed:**

| Campo | Valor |
|-------|-------|
| E-mail | `admin@senac.local` |
| Senha | `admin123` |

## Estrutura do repositório

```
faqsenac/
├── dev.sh        # Sobe backend e frontend de uma vez
├── frontend/     # React 18 + Vite + TypeScript (SPA)
├── backend/      # NestJS + Prisma + PostgreSQL (API REST)
├── guidelines/   # Documentação técnica do projeto
└── fixtures/     # Materiais de referência acadêmica
```

## Como rodar

**Requisitos:** Docker, Docker Compose e Node.js (npm).

### Opção rápida (recomendada)

Na raiz do repositório:

```bash
./dev.sh
```

O script sobe o backend (Docker), aguarda a API ficar pronta, inicia o frontend e cria `frontend/.env` automaticamente, se necessário.

| Serviço  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API      | http://localhost:3000 |

Pressione **Ctrl+C** para encerrar frontend e backend. Logs do Docker: `cd backend && docker compose logs -f`.

### Opção manual (dois terminais)

**1. Backend (API + banco)**

```bash
cd backend
docker compose up --build
```

Na primeira execução, o container aplica as migrações, popula o banco (se vazio) e sobe a API em `http://localhost:3000`.

**2. Frontend**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O arquivo `.env` do frontend deve apontar para a API:

```env
VITE_API_URL=http://localhost:3000
```

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router 7 |
| Backend | NestJS, Prisma ORM, PostgreSQL, JWT |
| Infra | Docker Compose (PostgreSQL + API) |

## Documentação adicional

- [frontend/README.md](frontend/README.md) — scripts, variáveis de ambiente e desenvolvimento do SPA
- [backend/README.md](backend/README.md) — endpoints REST, seed, migrações e exemplos com `curl`
- [guidelines/Guidelines.md](guidelines/Guidelines.md) — contexto técnico e decisões de arquitetura

