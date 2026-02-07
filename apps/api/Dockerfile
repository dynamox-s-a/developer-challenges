FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx nx build api

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist/apps/api ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN npm ci --omit=dev
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main.js"]
