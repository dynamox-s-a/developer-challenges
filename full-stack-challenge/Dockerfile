# API
FROM node:22-alpine AS api
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api ./apps/api
COPY libs ./libs
COPY tsconfig.base.json nx.json ./
COPY .npmrc ./
RUN npm ci --legacy-peer-deps
RUN npx prisma generate --schema apps/api/prisma/schema.prisma
WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3001/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npx", "tsx", "src/main.ts"]

# Web build
FROM node:22-alpine AS web-build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web ./apps/web
COPY libs ./libs
COPY tsconfig.base.json nx.json ./
COPY .npmrc ./
RUN npm ci --legacy-peer-deps
WORKDIR /app/apps/web
RUN npx vite build

FROM nginx:1.27-alpine AS web
COPY --from=web-build /app/apps/web/dist /usr/share/nginx/html
COPY deploy/nginx-web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Edge load balancer
FROM nginx:1.27-alpine AS lb
COPY deploy/nginx-lb.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
