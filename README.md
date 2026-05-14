# Momentum — Site web

Site officiel et hub multijoueur du jeu **Momentum**. Lobby de création/partage de partie par code, page de partie embarquant le build Unity WebGL, classement persistant, et compte joueur.

## Démo

[![Momentum — Démo gameplay](https://img.youtube.com/vi/bgXhLfmgvyg/maxresdefault.jpg)](https://youtu.be/bgXhLfmgvyg)

## Architecture

Momentum est composé de trois dépôts :

| Composant | Rôle | Repo |
|---|---|---|
| **Site web** (ce repo) | Next.js · lobby, partage de code, classement, héberge le build WebGL | — |
| **Game Server** | Colyseus + Prisma · matchmaking, état partagé, scores | (privé) |
| **Jeu Unity** | Unity 2022.3 WebGL · gameplay | [AloneDay-91/unity-ws501-momentum-v2](https://github.com/AloneDay-91/unity-ws501-momentum-v2) |

Le site et le serveur Colyseus partagent la même base MySQL via Prisma.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS · Radix UI · shadcn/ui
- Prisma 6 (MySQL) · Better Auth
- Hébergement du build Unity WebGL sous `/public/webgl/`

## Démarrage local

```bash
npm install
cp .env.example .env.local  # DATABASE_URL, NEXT_PUBLIC_URL, BETTER_AUTH_*
npx prisma migrate dev
npm run dev                 # http://localhost:3000
```

## Flux multijoueur

1. **Joueur 1** ouvre `/game/join`, choisit l'onglet *Créer*, saisit son pseudo → reçoit un **code à 6 caractères** (`A4F2X9`).
2. Il partage le code par message/voix.
3. **Joueur 2** ouvre `/game/join`, onglet *Rejoindre*, entre le code + pseudo → rejoint la partie.
4. Les deux clients sont redirigés vers `/play/[code]?role=…` qui embarque le build Unity WebGL dans une iframe.
5. À la fin du match, Unity poste les scores sur `/api/game/end` et le parent navigue vers `/classement/[code]`.

## Routes principales

| Route | Rôle |
|---|---|
| `/` | Landing page |
| `/game/join` | Entrée unique multijoueur (créer / rejoindre) |
| `/lobby/[code]` | Salle d'attente affichant le code à partager |
| `/play/[code]` | Iframe Unity WebGL · param `role=host` ou `role=join` |
| `/classement/[code]` | Récap d'une partie · `/classement` liste l'historique |
| `/scores` · `/admin` | Leaderboard global · admin |

## Build & déploiement

### Build local
```bash
npm run build
npm start
```

### Image Docker (production)

Le workflow `.github/workflows/docker-publish.yml` pousse l'image vers GHCR à chaque push sur `main` / `feature/auth`.

```bash
docker pull ghcr.io/hokoala/site-momentum:latest
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://... \
  -e NEXT_PUBLIC_URL=https://momentum.example.com \
  ghcr.io/hokoala/site-momentum:latest
```

Déploiement géré par [Dokploy](https://dokploy.com/) — il suit le tag `latest` et redéploie automatiquement.

### Variables d'env

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chaîne MySQL Prisma |
| `NEXT_PUBLIC_URL` | URL publique du site (utilisée pour générer les invitations) |
| `BETTER_AUTH_SECRET` · `BETTER_AUTH_URL` | Better Auth |
| Autres | voir `.env.example` |

## Mise à jour du build Unity

Le build Unity WebGL réside sous `public/webgl/`. Pour le rafraîchir :

```bash
# Depuis Unity: File → Build Settings → Build vers le dossier de votre choix
# Puis copier le contenu dans public/webgl/
# Le next.config.ts gère déjà les headers Content-Encoding pour les fichiers gz/br
```
