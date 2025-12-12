# Migration vers MySQL avec Prisma

Ce document décrit les étapes effectuées pour migrer de MongoDB vers MySQL avec Prisma.

## Changements effectués

### 1. Installation des dépendances

Les packages suivants ont été installés :

- `prisma` (dev dependency)
- `@prisma/client`
- `mysql2`

Le package `mongodb` a été supprimé.

### 2. Configuration de Prisma

- Initialisation de Prisma avec le provider MySQL
- Création du schéma Prisma dans `prisma/schema.prisma`
- Configuration de la connexion dans `prisma.config.ts`

### 3. Schéma Prisma

Le schéma Prisma inclut les tables nécessaires pour Better Auth :

- `user` - Utilisateurs
- `session` - Sessions d'authentification
- `account` - Comptes liés (email/password, OAuth, etc.)
- `verification` - Tokens de vérification
- `jwks` - Clés JWT pour le plugin JWT

### 4. Mise à jour de Better Auth

Le fichier `src/lib/auth.ts` a été mis à jour pour utiliser le Prisma adapter au lieu de MongoDB.

### 5. Variables d'environnement

Le fichier `.env.local` a été mis à jour avec les variables MySQL :

## Prochaines étapes

### 1. Vérifier la connexion à la base de données

Assurez-vous que la base de données MySQL est accessible depuis votre environnement :

### 2. Appliquer la migration

Une fois la connexion vérifiée, appliquez la migration :

```bash
npx prisma migrate deploy
```

Ou si vous êtes en développement :

```bash
npx prisma migrate dev
```

### 3. Générer le client Prisma

Le client Prisma a déjà été généré, mais si vous modifiez le schéma, régénérez-le :

```bash
npx prisma generate
```

### 4. Vérifier l'application

Testez l'authentification pour vous assurer que tout fonctionne :

1. Démarrez le serveur de développement : `npm run dev`
2. Accédez à `/api/auth/reference` pour voir la documentation OpenAPI
3. Testez l'inscription et la connexion

## Migration SQL manuelle

Si vous préférez exécuter la migration SQL manuellement, le fichier se trouve dans :
`prisma/migrations/init/migration.sql`

Vous pouvez l'exécuter directement dans votre base de données MySQL.

## Structure des tables

### Table `user`

Stocke les informations des utilisateurs.

### Table `session`

Stocke les sessions actives avec support JWT Bearer.

### Table `account`

Stocke les comptes liés (email/password, OAuth providers, etc.).

### Table `verification`

Stocke les tokens de vérification pour l'email, reset password, etc.

### Table `jwks`

Stocke les clés de signature JWT pour le plugin JWT de Better Auth.

## Plugins Better Auth configurés

- **Email/Password** : Authentification par email et mot de passe
- **Bearer Token** : Support des tokens Bearer pour Unity
- **JWT** : Génération et validation de JWT avec JWKS
- **OpenAPI** : Documentation interactive à `/api/auth/reference`

## Résolution de problèmes

### Le client Prisma n'est pas trouvé

Si vous obtenez une erreur d'import du client Prisma, régénérez-le :

```bash
npx prisma generate
```

### Erreurs de migration

Si la migration échoue, vous pouvez :

1. Vérifier l'état : `npx prisma migrate status`
2. Réinitialiser : `npx prisma migrate reset` (⚠️ efface les données)
3. Appliquer manuellement le SQL depuis `prisma/migrations/init/migration.sql`
