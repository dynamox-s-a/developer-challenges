FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3001

CMD ["npm", "run", "start"]