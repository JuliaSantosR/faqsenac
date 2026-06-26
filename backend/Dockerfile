FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json nest-cli.json ./

RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
RUN npm run build


FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev
RUN npm install ts-node tsconfig-paths

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY tsconfig.json ./
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "docker-entrypoint.sh"]
