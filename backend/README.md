# UniFAQ — Backend

Backend REST da plataforma UniFAQ (Faculdade Senac Palhoça), desenvolvido com NestJS, Prisma ORM e PostgreSQL.

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) instalados na máquina.

## Subir o ambiente completo

```bash
cd backend
docker compose up --build
```

Na primeira execução, o container:
1. Constrói a imagem da API.
2. Aguarda o PostgreSQL ficar pronto.
3. Executa as migrações com `prisma migrate deploy`.
4. Executa o seed (apenas se o banco estiver vazio).
5. Inicia a aplicação na porta **3000**.

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores antes de subir em produção:

```bash
cp .env.example .env
```

| Variável        | Descrição                              | Padrão (docker-compose) |
|-----------------|----------------------------------------|-------------------------|
| `DATABASE_URL`  | Connection string do PostgreSQL        | `postgresql://unifaq:unifaq123@db:5432/unifaq` |
| `JWT_SECRET`    | Chave secreta para assinar os tokens   | `unifaq-jwt-secret-...` |
| `JWT_EXPIRES_IN`| Tempo de expiração do JWT              | `8h` |
| `PORT`          | Porta da aplicação                     | `3000` |

## Credenciais do seed

| Campo  | Valor                |
|--------|----------------------|
| E-mail | `admin@senac.local`  |
| Senha  | `admin123`           |

## Endpoints

### Auth
| Método | Rota           | Acesso  | Descrição              |
|--------|----------------|---------|------------------------|
| POST   | `/auth/login`  | Público | Retorna JWT            |

### Users
| Método | Rota         | Acesso        | Descrição                     |
|--------|--------------|---------------|-------------------------------|
| GET    | `/users/me`  | Autenticado   | Perfil do usuário logado      |

### FAQ — Categorias
| Método | Rota                    | Acesso      | Descrição           |
|--------|-------------------------|-------------|---------------------|
| GET    | `/faq/categories`       | Público     | Lista categorias    |
| POST   | `/faq/categories`       | Admin (JWT) | Cria categoria      |
| PATCH  | `/faq/categories/:id`   | Admin (JWT) | Atualiza categoria  |
| DELETE | `/faq/categories/:id`   | Admin (JWT) | Remove categoria    |

### FAQ — Entradas

Campos de criação/edição (`POST` / `PATCH`):

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `question` | Sim | Mínimo 10 caracteres |
| `answer` | Sim | Mínimo 10 caracteres |
| `categoryId` | Sim | UUID da categoria |
| `imageUrl` | Não | URL pública da imagem |
| `videoUrl` | Não | URL do vídeo (YouTube ou Vimeo) |

| Método | Rota               | Acesso      | Descrição                          |
|--------|--------------------|-------------|------------------------------------|
| GET    | `/faq/entries`     | Público     | Lista todas as entradas            |
| GET    | `/faq/search?q=`   | Público     | Busca por substring em pergunta/resposta |
| POST   | `/faq/entries`     | Admin (JWT) | Cria entrada                       |
| PATCH  | `/faq/entries/:id` | Admin (JWT) | Atualiza entrada                   |
| DELETE | `/faq/entries/:id` | Admin (JWT) | Remove entrada                     |

### Comunicados
| Método | Rota                  | Acesso      | Descrição           |
|--------|-----------------------|-------------|---------------------|
| GET    | `/announcements`      | Público     | Lista comunicados   |
| POST   | `/announcements`      | Admin (JWT) | Cria comunicado     |
| PATCH  | `/announcements/:id`  | Admin (JWT) | Atualiza comunicado |
| DELETE | `/announcements/:id`  | Admin (JWT) | Remove comunicado   |

## Exemplo de uso

### 1. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@senac.local","password":"admin123"}'
```

Resposta:
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### 2. Busca de FAQ

```bash
curl "http://localhost:3000/faq/search?q=renda"
```

### 3. Criar pergunta do FAQ com mídia (autenticado)

```bash
curl -X POST http://localhost:3000/faq/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "question": "Como comprovar minha renda familiar?",
    "answer": "Apresente holerites, contracheques ou declaração de renda dos últimos 3 meses.",
    "categoryId": "<UUID_DA_CATEGORIA>",
    "imageUrl": "https://exemplo.com/imagem.jpg",
    "videoUrl": "https://www.youtube.com/watch?v=exemplo"
  }'
```

### 4. Criar comunicado (autenticado)

```bash
curl -X POST http://localhost:3000/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Novo comunicado","description":"Descrição do comunicado."}'
```

## Desenvolvimento local (sem Docker)

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com DATABASE_URL apontando para PostgreSQL local

# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Popular banco
npm run prisma:seed

# Iniciar em modo desenvolvimento
npm run start:dev
```

## Estrutura do projeto

```
backend/
├── prisma/
│   ├── schema.prisma      # Modelos do banco de dados
│   └── seed.ts            # Dados iniciais PSG
└── src/
    ├── main.ts            # Bootstrap da aplicação
    ├── app.module.ts      # Módulo raiz
    ├── prisma/            # PrismaService global
    ├── auth/              # Login JWT + guard
    ├── users/             # Perfil do usuário
    ├── faq/               # Categorias + entradas + busca
    └── announcements/     # Mural de comunicados
```
