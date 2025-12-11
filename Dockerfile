# --- Étape 1: Le "Builder" ---
# On reste sur node:20 qui corrige le bug npm/oxc-parser
FROM node:20-bookworm AS builder

WORKDIR /app

# 2. Installer les paquets système (pour better-sqlite3)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. Copier package.json et package-lock.json
COPY package.json package-lock.json ./

# 4. Installer SANS les scripts postinstall (corrige le bug nuxt prepare)
RUN npm ci --ignore-scripts

# --- NOUVELLE ÉTAPE ---
# 5. Re-compiler manuellement 'better-sqlite3'
#    C'est la correction : on force la compilation du module natif
#    qu'on a sauté à l'étape 4.
RUN npm rebuild better-sqlite3 --release

# 6. Copier TOUT le reste du code
COPY . .

# 7. Lancer 'nuxt prepare' MANUELLEMENT (maintenant oxc-parser est là)
RUN npx nuxt prepare

# 8. Construire l'application (maintenant better_sqlite3.node est là)
RUN npm run build


# --- Étape 2.5: Installation production ---
FROM node:20-bookworm AS prod-deps

WORKDIR /app

# Installer les paquets système (pour better-sqlite3)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier package files
COPY package.json package-lock.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev --ignore-scripts

# Recompiler better-sqlite3 pour la production
RUN npm rebuild better-sqlite3 --release


# --- Étape 3: Le "Runner" (Image de production) ---
FROM node:20-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Installer la librairie runtime pour SQLite
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de build depuis le builder
COPY --from=builder /app/.output .output
COPY --from=builder /app/package.json ./package.json

# Copier les node_modules de production depuis prod-deps
COPY --from=prod-deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]