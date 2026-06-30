# UniFAQ — Frontend

SPA React + Vite + TypeScript da plataforma UniFAQ.

Nesta branch, o app roda **standalone**: todo o conteúdo é lido e gravado no **localStorage** do navegador.

## Desenvolvimento

```bash
npm install
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

## Rotas

| Rota | Página |
|------|--------|
| `/` | Home |
| `/faq` | FAQ com busca automática e categorias |
| `/comunicados` | Comunicados |
| `/login` | Login do administrador |
| `/admin` | Painel administrativo (protegido) |

## Credenciais de acesso admin

- E-mail: `admin@senac.local`
- Senha: `admin123`

## Persistência

| Chave | Descrição |
|-------|-----------|
| `unifaq-content` | Conteúdo do site (home, FAQ, comunicados) |
| `unifaq-auth` | Sessão do administrador |

Conteúdo inicial: `src/app/data/defaultContent.ts`.

## Assets estáticos

Arquivos em `public/` são servidos na raiz do site. Exemplo:

- `/images/faq-psg-illustration.png` — ilustração exibida na home

## Busca

- **Home:** busca ao pressionar Enter ou clicar em "Buscar" (redireciona para `/faq?busca=...`)
- **FAQ:** busca automática enquanto digita (debounce de 350 ms), com opção de "Buscar agora"
