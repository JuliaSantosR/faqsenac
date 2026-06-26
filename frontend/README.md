# UniFAQ — Frontend

SPA React + Vite + TypeScript da plataforma UniFAQ.

## Desenvolvimento

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

Certifique-se de que o backend está rodando em `http://localhost:3000` (veja [backend/README.md](../backend/README.md)).

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

## Rotas

| Rota | Página |
|------|--------|
| `/` | Home |
| `/faq` | FAQ com busca automática e categorias |
| `/comunicados` | Comunicados |
| `/login` | Login do administrador |
| `/admin` | Painel administrativo (protegido) |

## Credenciais de acesso admin (backend seed)

- E-mail: `admin@senac.local`
- Senha: `admin123`

## Assets estáticos

Arquivos em `public/` são servidos na raiz do site. Exemplo:

- `/images/faq-psg-illustration.png` — ilustração exibida na home

## Busca

- **Home:** busca ao pressionar Enter ou clicar em "Buscar" (redireciona para `/faq?busca=...`)
- **FAQ:** busca automática enquanto digita (debounce de 350 ms), com opção de "Buscar agora"
