# Guide d'intégration Unity avec Better Auth

## Vue d'ensemble

Votre API Momentum utilise **Better Auth** avec les plugins officiels :
- **JWT** : Génération et vérification de tokens JWT
- **Bearer** : Support des tokens Bearer pour Unity
- **OpenAPI** : Documentation interactive Swagger

## Architecture

```
Unity au démarrage
    ↓
POST /api/auth/token
    (avec session cookie ou Bearer token existant)
    ↓
Reçoit JWT Token (valide 7 jours)
    ↓
Unity stocke le token
    ↓
Pour chaque requête à votre API de jeu :
POST /api/game
    Authorization: Bearer <jwt_token>
    { action, data }
    ↓
Votre API valide le JWT avec JWKS
    ↓
Succès ou erreur
```

## Endpoints Better Auth disponibles

### Authentification
- `POST /api/auth/sign-in/email` - Connexion
- `POST /api/auth/sign-up/email` - Inscription
- `POST /api/auth/sign-out` - Déconnexion
- `GET /api/auth/session` - Récupérer la session

### JWT & Tokens
- `POST /api/auth/token` - Obtenir un JWT token
- `GET /api/auth/jwks` - Récupérer les clés publiques (JWKS)
- Header `set-auth-jwt` - JWT automatique dans la réponse `getSession`

### Documentation
- `GET /api/auth/reference` - Documentation OpenAPI interactive

## Option 1 : Authentification utilisateur (Recommandé)

Si vos joueurs ont des comptes individuels :

### Flux d'authentification

```
1. Joueur se connecte dans Unity
2. Unity obtient une session
3. Unity récupère un JWT depuis la session
4. Unity utilise le JWT pour les requêtes API
```

### Code Unity C#

#### AuthManager.cs

```csharp
using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class SignInRequest
{
    public string email;
    public string password;
}

[Serializable]
public class SignInResponse
{
    public User user;
    public Session session;
}

[Serializable]
public class User
{
    public string id;
    public string email;
    public string name;
}

[Serializable]
public class Session
{
    public string id;
    public string token;
}

[Serializable]
public class TokenResponse
{
    public string token;
}

public class AuthManager : MonoBehaviour
{
    private const string API_BASE_URL = "http://localhost:3000/api/auth";
    private string jwtToken;
    private string sessionToken;

    /// <summary>
    /// Connexion du joueur
    /// </summary>
    public IEnumerator SignIn(string email, string password,
                             Action<User> onSuccess, Action<string> onError)
    {
        SignInRequest request = new SignInRequest
        {
            email = email,
            password = password
        };

        string jsonData = JsonUtility.ToJson(request);

        using (UnityWebRequest www = new UnityWebRequest($"{API_BASE_URL}/sign-in/email", "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                // Récupérer le JWT depuis le header
                string authJwt = www.GetResponseHeader("set-auth-jwt");
                if (!string.IsNullOrEmpty(authJwt))
                {
                    jwtToken = authJwt;
                    Debug.Log("JWT Token obtenu depuis header: " + jwtToken.Substring(0, 20) + "...");
                }

                // Récupérer le session token depuis les cookies
                string setCookie = www.GetResponseHeader("set-cookie");
                if (!string.IsNullOrEmpty(setCookie))
                {
                    sessionToken = ExtractSessionToken(setCookie);
                    Debug.Log("Session token obtenu");
                }

                SignInResponse response = JsonUtility.FromJson<SignInResponse>(www.downloadHandler.text);
                onSuccess?.Invoke(response.user);
            }
            else
            {
                Debug.LogError("Erreur connexion: " + www.error);
                onError?.Invoke(www.error);
            }
        }
    }

    /// <summary>
    /// Obtenir un JWT token depuis la session
    /// </summary>
    public IEnumerator GetJwtToken(Action<string> onSuccess, Action<string> onError)
    {
        using (UnityWebRequest www = new UnityWebRequest($"{API_BASE_URL}/token", "POST"))
        {
            www.downloadHandler = new DownloadHandlerBuffer();

            // Ajouter le session token ou Bearer token existant
            if (!string.IsNullOrEmpty(sessionToken))
            {
                www.SetRequestHeader("Cookie", $"better-auth.session_token={sessionToken}");
            }
            else if (!string.IsNullOrEmpty(jwtToken))
            {
                www.SetRequestHeader("Authorization", $"Bearer {jwtToken}");
            }

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                TokenResponse response = JsonUtility.FromJson<TokenResponse>(www.downloadHandler.text);
                jwtToken = response.token;
                Debug.Log("JWT Token obtenu: " + jwtToken.Substring(0, 20) + "...");
                onSuccess?.Invoke(jwtToken);
            }
            else
            {
                Debug.LogError("Erreur obtention token: " + www.error);
                onError?.Invoke(www.error);
            }
        }
    }

    /// <summary>
    /// Retourne le token JWT actuel
    /// </summary>
    public string GetToken()
    {
        return jwtToken;
    }

    /// <summary>
    /// Vérifie si l'utilisateur est authentifié
    /// </summary>
    public bool IsAuthenticated()
    {
        return !string.IsNullOrEmpty(jwtToken) || !string.IsNullOrEmpty(sessionToken);
    }

    private string ExtractSessionToken(string setCookieHeader)
    {
        // Parse le cookie pour extraire le session token
        string[] cookies = setCookieHeader.Split(';');
        foreach (string cookie in cookies)
        {
            if (cookie.Trim().StartsWith("better-auth.session_token="))
            {
                return cookie.Trim().Substring("better-auth.session_token=".Length);
            }
        }
        return null;
    }
}
```

#### GameApiClient.cs

```csharp
using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class SaveScoreRequest
{
    public string action = "save_score";
    public ScoreEntry[] scores;
}

[Serializable]
public class ScoreEntry
{
    public string pseudo;
    public int score;
    public float timeCompleted;
}

public class GameApiClient : MonoBehaviour
{
    private const string GAME_API_URL = "http://localhost:3000/api/game";
    private AuthManager authManager;

    void Start()
    {
        authManager = FindObjectOfType<AuthManager>();
        if (authManager == null)
        {
            authManager = gameObject.AddComponent<AuthManager>();
        }
    }

    /// <summary>
    /// Sauvegarder un score (authentifié par JWT)
    /// </summary>
    public IEnumerator SaveScore(string pseudo, int score, float timeCompleted,
                                 Action onSuccess, Action<string> onError)
    {
        if (!authManager.IsAuthenticated())
        {
            onError?.Invoke("Non authentifié");
            yield break;
        }

        SaveScoreRequest request = new SaveScoreRequest
        {
            scores = new ScoreEntry[]
            {
                new ScoreEntry
                {
                    pseudo = pseudo,
                    score = score,
                    timeCompleted = timeCompleted
                }
            }
        };

        string jsonData = JsonUtility.ToJson(request);
        string token = authManager.GetToken();

        using (UnityWebRequest www = new UnityWebRequest(GAME_API_URL, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");
            www.SetRequestHeader("Authorization", $"Bearer {token}");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("Score sauvegardé: " + www.downloadHandler.text);
                onSuccess?.Invoke();
            }
            else
            {
                Debug.LogError("Erreur: " + www.error);
                onError?.Invoke(www.error);
            }
        }
    }
}
```

#### Utilisation dans GameManager

```csharp
public class GameManager : MonoBehaviour
{
    private AuthManager authManager;
    private GameApiClient apiClient;

    void Start()
    {
        authManager = gameObject.AddComponent<AuthManager>();
        apiClient = gameObject.AddComponent<GameApiClient>();

        // Connexion du joueur au démarrage
        StartCoroutine(authManager.SignIn(
            email: "player@example.com",
            password: "password123",
            onSuccess: (user) => {
                Debug.Log($"Connecté: {user.name}");
                // Optionnel : récupérer un JWT frais
                StartCoroutine(authManager.GetJwtToken(
                    onSuccess: (token) => Debug.Log("JWT prêt !"),
                    onError: (err) => Debug.LogError(err)
                ));
            },
            onError: (error) => {
                Debug.LogError($"Erreur connexion: {error}");
            }
        ));
    }

    public void OnGameEnd(string playerName, int finalScore, float time)
    {
        StartCoroutine(apiClient.SaveScore(
            pseudo: playerName,
            score: finalScore,
            timeCompleted: time,
            onSuccess: () => Debug.Log("Score envoyé !"),
            onError: (err) => Debug.LogError(err)
        ));
    }
}
```

## Option 2 : Token de jeu anonyme

Si vous n'avez pas de système de comptes utilisateurs, vous pouvez utiliser votre route custom `/api/token/public` que nous avons créée :

```csharp
// Utiliser TokenManager.cs du guide JWT_BEARER_GUIDE.md
// Il appelle POST /api/token/public avec gameSecret + deviceId
```

## Vérification JWT côté serveur

Votre API de jeu peut vérifier les JWT avec JWKS :

```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL('http://localhost:3000/api/auth/jwks')
)

const { payload } = await jwtVerify(bearerToken, JWKS, {
  issuer: 'http://localhost:3000',
  audience: 'http://localhost:3000',
})

// payload contient : userId, email, name, sessionId
console.log(payload.userId)
```

## Documentation API

### OpenAPI Interactive (Scalar)
```
http://localhost:3000/api/auth/reference
```

### Tester avec curl

```bash
# 1. Se connecter
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -v

# 2. Récupérer le JWT depuis le header set-auth-jwt
# ou depuis /token avec le cookie de session

# 3. Utiliser le JWT
curl -X POST http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"action":"save_score","scores":[...]}'
```

## Schéma MySQL

Le plugin JWT ajoute automatiquement une table `jwks` dans MySQL :

```typescript
{
  id: string              // ID unique de la clé
  publicKey: string       // Clé publique
  privateKey: string      // Clé privée (chiffrée avec AES256)
  createdAt: Date        // Date de création
  alg: string            // Algorithme (EdDSA)
  crv: string?           // Courbe (Ed25519)
}
```

## Configuration en production

1. **Changez les secrets** dans `.env.local` :
   ```bash
   openssl rand -base64 32  # Pour BETTER_AUTH_SECRET
   ```

2. **Utilisez HTTPS** pour chiffrer les communications

3. **Configurez la rotation des clés** (déjà configurée : 30 jours)

4. **Activez la vérification d'email** en production

5. **Stockez les tokens Unity de manière sécurisée** (PlayerPrefs chiffré)

## Avantages de cette approche

✅ **Sécurité** : JWT signé cryptographiquement avec rotation des clés
✅ **Performance** : Pas besoin de requête DB pour chaque validation
✅ **Standard** : OpenID Connect compatible
✅ **Documentation** : OpenAPI interactive intégrée
✅ **Flexible** : Support cookies ET Bearer tokens
✅ **Scalable** : JWKS peut être mis en cache

## Ressources

- [Better Auth Documentation](https://www.better-auth.com/)
- [JWT Plugin](https://www.better-auth.com/docs/plugins/jwt)
- [Bearer Plugin](https://www.better-auth.com/docs/plugins/bearer)
- [OpenAPI Plugin](https://www.better-auth.com/docs/plugins/open-api)
