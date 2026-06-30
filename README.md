# UniFAQ

Plataforma de perguntas frequentes da **Faculdade Senac Palhoça** para candidatos do **Programa Senac de Gratuidade (PSG)**.

O sistema reúne FAQ por categorias, comunicados oficiais e um painel administrativo para editar o conteúdo exibido nas páginas públicas.

> **Branch `local`:** versão standalone que roda só com o frontend. Todo o conteúdo é persistido no **localStorage** do navegador — não há backend nem Docker.

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

**Credenciais de acesso:**

| Campo | Valor |
|-------|-------|
| E-mail | `admin@senac.local` |
| Senha | `admin123` |

## Estrutura do repositório

```
faqsenac/
├── dev.sh        # Sobe o frontend
├── frontend/     # React 18 + Vite + TypeScript (SPA)
├── guidelines/   # Documentação técnica do projeto
└── fixtures/     # Materiais de referência acadêmica
```

## Como rodar

**Requisitos:** Node.js (npm).

### Opção rápida (recomendada)

Na raiz do repositório:

```bash
./dev.sh
```

### Opção manual

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em **http://localhost:5173**.

Pressione **Ctrl+C** para encerrar.

## Persistência de dados

| Chave localStorage | Conteúdo |
|--------------------|----------|
| `unifaq-content` | Home, categorias FAQ, perguntas e comunicados |
| `unifaq-auth` | Sessão do administrador |

Na primeira visita, o app carrega o conteúdo padrão de `frontend/src/app/data/defaultContent.ts`. Alterações feitas no painel admin ficam salvas no navegador.

Para resetar os dados, limpe o localStorage do site em DevTools → Application → Local Storage.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router 7 |
| Dados | localStorage (sem backend) |

## Documentação adicional

- [frontend/README.md](frontend/README.md) — scripts e desenvolvimento do SPA
- [guidelines/Guidelines.md](guidelines/Guidelines.md) — contexto técnico e decisões de arquitetura
