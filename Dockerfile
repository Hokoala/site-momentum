# syntax=docker/dockerfile:1.7

# Multi-stage build for Next.js standalone output. Produced image is
# ~150 MB, runs as a non-root user, and only contains the runtime
# files Next.js actually needs.

FROM node:20-alpine AS base

# --- deps: install with cache-friendly layer -----------------------------
FROM base AS deps
WORKDIR /app
# libc6-compat: Next.js native deps on Alpine. openssl: prisma engines.
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# --- builder: generate prisma client + next build -----------------------
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# DATABASE_URL is not needed for `prisma generate` / `next build`, only at
# runtime. Dokploy injects it via env when running the container.
RUN npx prisma generate
RUN npm run build

# --- runner: minimal runtime image --------------------------------------
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Standalone output already bundles a minimal node_modules. We additionally
# copy:
#   - public/ (static assets, including the Unity WebGL build under /webgl)
#   - .next/static (Next's own static chunks, not in standalone by default)
#   - node_modules/.prisma (prisma client + native query engine binary)
#   - prisma/ (schema, needed if migrations run at deploy time)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
