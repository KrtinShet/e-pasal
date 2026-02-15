FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

RUN pnpm --filter @baazarify/shared build
RUN pnpm --filter @baazarify/api build

FROM base AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile --prod

FROM node:20-alpine AS runner

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

WORKDIR /app

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=prod-deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY package.json pnpm-workspace.yaml ./

USER appuser

WORKDIR /app/apps/api

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]
