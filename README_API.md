# API Momentum - Documentation Complète

## Vue d'ensemble

API Next.js 15 avec Better Auth pour le jeu Unity "Momentum". Fournit l'authentification, la gestion des scores et la configuration du jeu.

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Base de données** : MySQL avec Prisma ORM
- **Authentification** : Better Auth avec plugins officiels
- **Sécurité** : JWT, Bearer Tokens, HMAC
- **Documentation** : OpenAPI 3.0 (Scalar)

## Plugins Better Auth installés

### 1. **JWT Plugin**
Génération et vérification de tokens JWT avec rotation automatique des clés.

**Endpoints fournis** :
- `POST /api/auth/token` - Obtenir un JWT
- `GET /api/auth/jwks` - Récupérer les clés publiques JWKS

**Configuration** :
- Algorithme : EdDSA (Ed25519)
- Expiration : 7 jours
- Rotation : 30 jours avec période de grâce

### 2. **Bearer Plugin**
Support des tokens Bearer pour l'authentification API (Unity).

**Utilisation** :
```
Authorization: Bearer <jwt_token>
```

### 3. **OpenAPI Plugin**
Documentation interactive générée automatiquement.

**Accès** :
```
http://localhost:3000/api/auth/reference
```

## Structure du projet

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts    # Better Auth (auto)
│   │   ├── game/route.ts             # API jeu (GET public, POST sécurisé)
│   │   ├── admin/settings/route.ts   # Back-office (protégé)
│   │   └── token/
│   │       ├── generate/route.ts     # Génération tokens admin
│   │       └── public/route.ts       # Tokens anonymes Unity
│   ├── login/page.tsx                # Page connexion
│   ├── admin/page.tsx                # Back-office
│   └── api-docs/page.tsx             # Viewer OpenAPI
├── lib/
│   ├── auth.ts                       # Config Better Auth
│   ├── auth-client.ts                # Client Better Auth React
│   ├── hmac.ts                       # Validation HMAC (legacy)
│   └── token-manager.ts              # Gestion tokens custom
└── components/
    └── ...
```

## Endpoints disponibles

### Authentification Better Auth

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/auth/sign-in/email` | POST | Connexion | Public |
| `/api/auth/sign-up/email` | POST | Inscription | Public |
| `/api/auth/sign-out` | POST | Déconnexion | Session |
| `/api/auth/session` | GET | Récupérer session | Session |
| `/api/auth/token` | POST | Obtenir JWT | Session/Bearer |
| `/api/auth/jwks` | GET | Clés publiques JWKS | Public |
| `/api/auth/reference` | GET | Doc OpenAPI (Scalar) | Public |

### API Jeu

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/game?parametre=lecture` | GET | Lire paramètres | Public |
| `/api/game` | POST | Sauvegarder scores | **Bearer JWT** ou HMAC |

### API Admin

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/admin/settings` | GET | Lire config | Session |
| `/api/admin/settings` | POST | Modifier config | Session |
| `/api/token/generate` | POST | Générer token custom | Session |

### API Tokens Custom

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/token/public` | POST | Token anonyme Unity | gameSecret |

## Méthodes d'authentification

### 1. **JWT Bearer** (Recommandé ⭐)

**Flux** :
```
1. Unity se connecte ou obtient un token public
2. Unity reçoit un JWT (valide 7 jours)
3. Unity envoie le JWT dans chaque requête :
   Authorization: Bearer <token>
```

**Avantages** :
- ✅ Standard OAuth 2.0
- ✅ Signature cryptographique
- ✅ Pas de calcul à chaque requête
- ✅ Révocable via rotation de clés

### 2. **HMAC** (Legacy)

**Flux** :
```
1. Unity génère une signature HMAC du body + timestamp
2. Unity envoie :
   X-Signature: <hmac_sha256>
   X-Timestamp: <unix_timestamp>
```

**Avantages** :
- ⚠️ Rétrocompatibilité
- ⚠️ Plus complexe
- ⚠️ Protection replay attacks (5 min)

### 3. **Session Cookie** (Web uniquement)

Pour le back-office admin et les utilisateurs web.

## Intégration Unity

### Option A : Authentification utilisateur

Chaque joueur a un compte. Voir `BETTER_AUTH_UNITY.md`.

```csharp
// 1. Connexion
yield return authManager.SignIn(email, password, onSuccess, onError);

// 2. Récupérer JWT
yield return authManager.GetJwtToken(onSuccess, onError);

// 3. Utiliser JWT
www.SetRequestHeader("Authorization", $"Bearer {token}");
```

### Option B : Token anonyme

Un token par instance du jeu (sans compte utilisateur).

```csharp
// 1. Obtenir token public
POST /api/token/public
{
  "gameSecret": "12345",
  "deviceId": "unique-device-id"
}

// 2. Utiliser le token reçu
www.SetRequestHeader("Authorization", $"Bearer {token}");
```

## Configuration

### Variables d'environnement (`.env.local`)

```env
# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# MySQL
DATABASE_URL="mysql://sae501user:password@51.178.85.130:3306/sae501"

# API Security
API_SECRET_KEY=12345
```

### Schéma MySQL

Better Auth utilise Prisma avec ces tables :

**`user`** - Utilisateurs
```typescript
{
  id: string
  email: string
  name: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

**`session`** - Sessions
```typescript
{
  id: string
  userId: string
  expiresAt: Date
  token: string
}
```

**`jwks`** - Clés JWT
```typescript
{
  id: string
  publicKey: string
  privateKey: string  // Chiffré AES256
  createdAt: Date
  alg: string
  crv: string?
}
```

## Documentation

### 1. Documentation interactive (Scalar)
```
http://localhost:3000/api/auth/reference
```
Interface Swagger pour tester tous les endpoints.

### 2. Documentation Unity
- `BETTER_AUTH_UNITY.md` - Guide intégration Unity avec Better Auth
- `JWT_BEARER_GUIDE.md` - Guide JWT Bearer (approche custom)
- `UNITY_INTEGRATION.md` - Guide HMAC (legacy)

### 3. Configuration
- `AUTH_SETUP.md` - Setup initial Better Auth

## Démarrage

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer MySQL

Assurez-vous que MySQL est accessible et exécutez la migration :
```bash
npx prisma migrate deploy
```

### 3. Lancer le serveur

```bash
npm run dev
```

### 4. Accéder à l'application

- **Site** : http://localhost:3000
- **Connexion** : http://localhost:3000/login
- **Admin** : http://localhost:3000/admin
- **Doc API** : http://localhost:3000/api/auth/reference
- **OpenAPI JSON** : http://localhost:3000/openapi.json (custom)

## Tests

### Tester avec curl

#### 1. Inscription
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'
```

#### 2. Connexion
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  -v
```

#### 3. Obtenir JWT
```bash
# Récupérer le cookie de session depuis la réponse précédente
curl -X POST http://localhost:3000/api/auth/token \
  -H "Cookie: better-auth.session_token=<session_token>"
```

#### 4. Utiliser le JWT
```bash
curl -X POST http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"action":"save_score","scores":[{"pseudo":"Player1","score":1000,"timeCompleted":45.5}]}'
```

### Tester avec Postman

1. Importer `public/openapi.json`
2. Tester les endpoints
3. Les tokens sont gérés automatiquement

## Sécurité

### En développement
- ✅ CORS activé pour `*`
- ✅ Cookies HttpOnly
- ✅ Clés privées chiffrées AES256
- ✅ Rotation automatique des clés JWT

### En production
1. **Changez tous les secrets** :
   ```bash
   openssl rand -base64 32  # BETTER_AUTH_SECRET
   ```

2. **Utilisez HTTPS** obligatoirement

3. **Configurez CORS** pour votre domaine uniquement

4. **Activez la vérification d'email**

5. **Ajoutez du rate limiting**

6. **Surveillez les logs** pour détecter les abus

## Performance

### Optimisations implémentées
- ✅ Cache session (5 min)
- ✅ Validation JWT sans DB (JWKS)
- ✅ Rotation automatique des clés
- ✅ Headers CORS mis en cache

### Recommandations
- Utiliser Redis pour le cache de session
- CDN pour servir JWKS
- Load balancer pour scalabilité

## Dépannage

### Erreur "Token invalide"
- Vérifiez que le token n'est pas expiré (7 jours)
- Vérifiez que BETTER_AUTH_URL correspond
- Consultez les logs serveur

### Erreur CORS
- Vérifiez que les headers CORS sont corrects
- Utilisez le proxy si nécessaire (voir cours)

### MySQL connexion échouée
- Vérifiez l'URI MySQL dans `.env.local`
- Vérifiez que MySQL est accessible
- Exécutez `npx prisma migrate deploy` pour créer les tables

### JWKS non trouvé
- Attendez que Better Auth génère la première clé
- Vérifiez que la table `jwks` existe dans MySQL
- Exécutez `npx prisma db push` si nécessaire

## Support

- [Better Auth Docs](https://www.better-auth.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [MySQL Docs](https://dev.mysql.com/doc/)

## Licence

Projet éducatif - SAE501 - BUT MMI Troyes
