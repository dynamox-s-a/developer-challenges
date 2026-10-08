# API image. Build from the workspace root:
#   docker build -f apps/api/Dockerfile -t dynapredict-api .

ARG NODE_IMAGE=node:24-alpine

# --- deps: full workspace install, cached until the lockfile changes ---
FROM ${NODE_IMAGE} AS deps
WORKDIR /workspace
# Skip the Cypress binary (~835 MB, glibc-only, unused here) and husky's git
# hooks; the binary download alone can exhaust a small build host.
ENV CYPRESS_INSTALL_BINARY=0 \
    HUSKY=0
COPY package.json package-lock.json ./
# The build needs devDependencies (nx, prisma, typescript) even when the
# platform passes NODE_ENV=production as a build arg, which makes npm skip them.
RUN npm ci --include=dev

# --- build: generate the Prisma client and compile the API with Nx ---
FROM ${NODE_IMAGE} AS build
WORKDIR /workspace
ENV NX_DAEMON=false \
    NX_NO_CLOUD=true
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .
# The build emits a pruned package.json/package-lock.json and compiles the
# workspace libraries the API imports into dist (resolved by the main.js shim).
RUN npx prisma generate && npx nx build api
# Nx can't see imports of the gitignored generated client, so @prisma/client
# is missing from the pruned package.json; the prisma CLI is a devDependency
# but the entrypoint needs it for `migrate deploy`. Pin both to the root versions.
RUN node -p "const pkg = require('./package.json'); \
    ['prisma', '@prisma/client'] \
      .map((name) => name + '@' + (pkg.dependencies[name] ?? pkg.devDependencies[name])) \
      .join(' ')" > /workspace/runtime-extra-deps

# --- runtime: production dependencies only, non-root user ---
FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NPM_CONFIG_UPDATE_NOTIFIER=false
COPY --from=build /workspace/dist/apps/api ./
COPY --from=build /workspace/runtime-extra-deps /tmp/runtime-extra-deps
RUN npm ci --omit=dev \
    && npm install --no-save $(cat /tmp/runtime-extra-deps) \
    && npm cache clean --force \
    && rm /tmp/runtime-extra-deps
# prisma.config.ts resolves the schema and migrations relative to /app.
COPY prisma.config.ts ./
COPY apps/api/prisma/schema.prisma ./apps/api/prisma/schema.prisma
COPY apps/api/prisma/migrations ./apps/api/prisma/migrations
COPY apps/api/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node
EXPOSE 3333
# /health answers 503 when the database is unreachable, and busybox wget exits
# non-zero on it. start-period covers `migrate deploy` in the entrypoint.
HEALTHCHECK --interval=15s --timeout=3s --start-period=30s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT:-3333}/api/v1/health" || exit 1
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "main.js"]
