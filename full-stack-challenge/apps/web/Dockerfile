# Web image. Build from the workspace root:
#   docker build -f apps/web/Dockerfile --build-arg VITE_API_URL=http://localhost:3333/api/v1 -t dynapredict-web .

ARG NODE_IMAGE=node:24-alpine

# --- deps: full workspace install, cached until the lockfile changes ---
FROM ${NODE_IMAGE} AS deps
WORKDIR /workspace
# Skip the Cypress binary (~835 MB, glibc-only, unused here) and husky's git
# hooks; the binary download alone can exhaust a small build host.
ENV CYPRESS_INSTALL_BINARY=0 \
    HUSKY=0
COPY package.json package-lock.json ./
# Builds need devDependencies even if NODE_ENV=production is passed in.
RUN npm ci --include=dev

# --- build: Vite inlines VITE_* variables at build time ---
FROM ${NODE_IMAGE} AS build
WORKDIR /workspace
ARG VITE_API_URL=http://localhost:3333/api/v1
ENV NX_DAEMON=false \
    NX_NO_CLOUD=true \
    VITE_API_URL=${VITE_API_URL}
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .
RUN npx nx build web

# --- runtime: static files served by unprivileged nginx on port 8080 ---
FROM nginxinc/nginx-unprivileged:alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist/apps/web /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
