# UniFAQ — Contexto Técnico para Desenvolvimento

Documento de referência para assistentes de IA e desenvolvedores. Priorize **decisões de código alinhadas ao domínio PSG** e **ao estado atual do repositório**.

---

## 1. Domínio (mínimo necessário)

**UniFAQ** é plataforma web da Faculdade Senac Palhoça para **candidatos do Programa Senac de Gratuidade (PSG)** — não para alunos já matriculados.

**PSG** engloba as modalidades: Jovem Aprendiz, Jovem Programador, Ensino Médio.

**Critério central de elegibilidade:** renda familiar mensal per capita ≤ **2 salários mínimos federais**.

O sistema orienta sobre triagem, editais, documentação (autodeclaração de renda, termo de compromisso) e prazos. **Não substitui** a análise oficial da secretaria.

---

## 2. Estado atual vs. alvo

| Camada | Estado atual | Alvo |
|--------|--------------|------|
| Front-end | React 18 + Vite + TypeScript, funcional | Manter |
| Roteamento | React Router 7 (`frontend/src/app/routes.ts`) | Manter |
| UI | Tailwind 4 + Radix/shadcn (`frontend/src/app/components/ui/`) | Manter padrão existente |
| Dados | `localStorage` via contexts | Migrar para API NestJS |
| Auth | Login mock em `AuthContext` (admin hardcoded) | JWT + perfis (candidato / admin) |
| Back-end | **NestJS em `backend/`** | Manter e integrar com o front |
| Infra | **Docker Compose em `backend/`** | Estender para incluir `frontend` |

Ao implementar features novas, **prefira não acoplar mais lógica ao localStorage** se a feature claramente pertence ao back-end (auth real, persistência, busca server-side).

---

## 3. Estrutura do repositório

```
faqsenac/
├── frontend/
│   ├── src/
│   │   ├── main.tsx                 # AuthProvider + ContentProvider
│   │   └── app/
│   │       ├── App.tsx              # RouterProvider
│   │       ├── routes.ts            # Rotas públicas e /admin protegida
│   │       ├── types/content.ts     # Tipos de domínio (FAQ, avisos, home)
│   │       ├── data/defaultContent.ts   # Seed inicial (⚠ legado escolar — migrar para PSG)
│   │       ├── context/
│   │       │   ├── AuthContext.tsx      # Auth mock (localStorage)
│   │       │   └── ContentContext.tsx   # CRUD de conteúdo (localStorage)
│   │       ├── pages/               # Home, FAQ, Comunicados, Login, Admin
│   │       └── components/          # Layout, Header, Footer, SearchBar, ui/*
│   ├── package.json
│   └── vite.config.ts
├── backend/                         # NestJS + Prisma + PostgreSQL
├── guidelines/Guidelines.md         # Este arquivo
└── fixtures/                        # Documentação acadêmica (referência de negócio)
```

**Comandos (frontend):** `cd frontend && npm i` · `npm run dev` · `npm run build`

**Comandos (backend):** `cd backend && docker compose up --build`

---

## 4. Rotas e fluxos

| Rota | Componente | Acesso |
|------|------------|--------|
| `/` | `Home` | Público |
| `/faq` | `FAQ` | Público; query `?busca=termo` |
| `/comunicados` | `Comunicados` | Público |
| `/login` | `Login` | Público |
| `/admin` | `Admin` via `ProtectedAdminPage` | Autenticado |

**Proteção de rota:** `ProtectedRoute` redireciona para `/login` se `!isAuthenticated`.

---

## 5. Modelo de dados (`frontend/src/app/types/content.ts`)

```ts
SiteContent {
  home: HomeContent           // textos da landing
  faqCategories: FAQCategory[]
  announcements: Announcement[]
}

FAQCategory { id, label, description, icon, items[] }
FAQEntry    { id, question, answer, imageUrl, videoUrl }
Announcement { id, date, category, priority, title, description, details }
```

**Ícones permitidos hoje:** `FileText | Clock | DollarSign | Calendar` — ao migrar para PSG, estender o union se necessário (ex.: `FileCheck`, `Users`).

**Categorias alvo do FAQ (PSG):** Renda · Editais · Documentação · Inscrições · Critérios de seleção.

**Conteúdo legado a substituir:** `defaultContent.ts` ainda usa categorias escolares (Matrícula, Horários, Financeiro). Novos textos e seeds devem refletir **triagem PSG**.

---

## 6. Contextos e persistência

### ContentContext (`school-help-center-content`)

- CRUD completo de home, categorias FAQ, entries e comunicados.
- Persiste em `localStorage` a cada alteração.
- IDs gerados com `crypto.randomUUID()` ou fallback `Date.now()`.

### AuthContext (`school-help-center-auth`)

- Auth **apenas para admin** hoje; credenciais em `ADMIN_CREDENTIALS` (mock).
- Candidato PSG com login próprio é **requisito de negócio (RF04)**, ainda **não implementado**.

Ao evoluir auth: separar perfis `candidate` | `admin`, remover credenciais hardcoded, integrar JWT do NestJS.

---

## 7. Busca (RF01/RF03) — implementação atual

- Componente: `SearchBar` (controlled, submit dispara callback).
- Lógica: `FAQ.tsx` filtra client-side com `.includes()` case-insensitive sobre `label`, `description`, `question`, `answer`.
- Query string: `/faq?busca=renda` sincronizada via `useSearchParams`.

**Restrições:**

- **Não** implementar chatbot, LLM ou respostas generativas.
- Busca é **determinística** por substring; sem fuzzy match, sinônimos ou NLP no escopo atual.
- Quando existir back-end: mover filtro para endpoint `GET /faq/search?q=` mantendo o mesmo contrato de UX.

---

## 8. Funcionalidades por requisito

| RF | Feature | Status |
|----|---------|--------|
| RF01 | Busca por palavra-chave | ✅ Client-side em `FAQ.tsx` |
| RF02 | FAQ categorizado | ✅ Tabs + Accordion |
| RF03 | Lupa (busca avançada) | ✅ Mesma busca; sem chatbot |
| RF04 | Login candidato PSG | ⚠ Apenas admin mock |
| RF05 | Mural de avisos | ✅ `Comunicados` + destaque na Home |
| RF06 | Painel admin (CRUD) | ✅ `Admin.tsx` + ContentContext |
| RF07 | WhatsApp secretaria | ❌ FAQ tem só e-mail; Footer genérico |

**RF07 pendente:** adicionar link `https://wa.me/55...` (WhatsApp institucional) na seção "Não encontrou?" do FAQ e/ou Footer.

---

## 9. Restrições de escopo (não implementar)

### Fora do domínio PSG

Não adicionar features de aluno matriculado:

- Notas, frequência, disciplinas, calendário escolar, horários de aula, matrícula acadêmica, mensalidades.

Remover ou não expandir referências legadas: "Portal do Aluno", "Área do Responsável", "Calendário Acadêmico" no Footer.

### Fora do escopo técnico atual

- Chatbot / IA generativa na busca
- NLP, correção ortográfica, embeddings

---

## 10. UI e identidade visual

- **Mobile-first**, responsivo (Tailwind breakpoints `sm`, `md`, `lg`).
- Cores institucionais Senac: **azul** e **laranja** (RNF05). Home usa gradiente `from-blue-600 to-blue-800`; alinhar acentos laranja onde fizer sentido.
- Reutilizar componentes em `frontend/src/app/components/ui/` (shadcn/Radix) — não introduzir outra lib de componentes sem necessidade.
- Ícones: `lucide-react`.
- Textos voltados a **candidatos de baixa renda**: linguagem simples, objetiva, sem jargão burocrático desnecessário.

---

## 11. Segurança e LGPD (RNF04)

Ao implementar back-end e auth real:

- Minimizar coleta de dados pessoais/socioeconômicos.
- Rotas com dados sensíveis (renda, editais direcionados) exigem autenticação.
- Não logar dados sensíveis; não commitar credenciais ou `.env`.
- JWT em header `Authorization: Bearer`; refresh/expiração conforme NestJS guards.

---

## 12. Back-end alvo (NestJS — a criar)

Módulos sugeridos alinhados ao front:

```
auth/          # login, JWT, perfis candidate | admin
faq/           # categories, entries, search
announcements/ # mural de avisos
users/         # candidatos PSG (dados mínimos)
```

Endpoints REST consumidos pelo React; validação de regras PSG no server-side.

**Docker Compose:** serviços `frontend`, `api`, `db` — ambiente reproduzível para a equipe.

---

## 13. Convenções de código

- TypeScript estrito; tipos de domínio em `frontend/src/app/types/`.
- Componentes de página em `pages/`, reutilizáveis em `components/`.
- Estado global só via contexts (ou futuro React Query + API); evitar prop drilling desnecessário.
- Manter diffs focados; não refatorar arquivos não relacionados à tarefa.
- Ao alterar `SiteContent`, garantir compatibilidade com JSON já persistido em `localStorage` ou tratar migração.
- Comentários apenas para lógica não óbvia (regras PSG, edge cases de busca).

---

## 14. Débitos técnicos conhecidos

1. `defaultContent.ts` — conteúdo escolar, não PSG.
2. `AuthContext` — só admin mock; sem fluxo de candidato.
3. `Home.tsx` — SearchBar removida/não renderizada no hero (busca só em `/faq`).
4. `Footer.tsx` — placeholders genéricos; links escolares; sem WhatsApp.
5. Chaves `localStorage` com prefixo `school-help-center-*` (legado do protótipo Figma).
6. Back-end NestJS em `backend/`; Docker Compose disponível para a API.

Priorize correções que alinham **domínio PSG** e **preparam migração para API** quando a tarefa pedir.

---

## 15. Checklist rápido antes de entregar código

- [ ] Feature está no escopo PSG (candidato), não escolar (aluno matriculado)?
- [ ] Busca permanece determinística (sem IA)?
- [ ] UI responsiva e consistente com componentes existentes?
- [ ] Textos/copy refletem triagem, editais, documentação, renda?
- [ ] Dados sensíveis protegidos (ou preparados para auth real)?
- [ ] Não expandiu acoplamento desnecessário ao localStorage se a feature é de back-end?
