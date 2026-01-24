# Intégration Unity - Authentification Anonyme

Guide complet pour intégrer votre jeu Unity avec l'API Momentum sans système de compte utilisateur.

## Vue d'ensemble

Ce système permet à votre jeu Unity d'envoyer des données (scores, progression, etc.) à l'API de manière sécurisée **sans créer de compte utilisateur**.

### Architecture

```
Unity (au démarrage)
    ↓
POST /api/unity/auth
    { deviceId: "unique-device-id" }
    ↓
Reçoit JWT Token (valide 24h)
    ↓
Unity stocke le token
    ↓
Pour chaque requête API:
POST /api/game
    Authorization: Bearer <token>
    { action: "save_score", scores: [...] }
    ↓
API valide le token et sauvegarde les données
```

## 1. Génération du Token

### Endpoint : `POST /api/unity/auth`

**URL complète** : `http://your-domain.com/api/unity/auth`

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "deviceId": "unique-device-id",
  "gameVersion": "1.0.0"
}
```

**Réponse (200 OK)** :
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "message": "Anonymous token generated successfully"
}
```

**Le `deviceId` doit être unique et persistant** pour chaque installation du jeu :
- Sur mobile : `SystemInfo.deviceUniqueIdentifier`
- Sur PC/Mac : Générer un GUID et le sauvegarder dans PlayerPrefs
- Sur WebGL : Utiliser un UUID stocké dans localStorage

## 2. Code Unity C#

### AuthManager.cs

```csharp
using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class AnonymousAuthRequest
{
    public string deviceId;
    public string gameVersion;
}

[Serializable]
public class AnonymousAuthResponse
{
    public bool success;
    public string token;
    public int expiresIn;
    public string message;
}

public class AuthManager : MonoBehaviour
{
    private const string API_BASE_URL = "http://localhost:3000";
    private const string TOKEN_PREFS_KEY = "AnonymousToken";
    private const string DEVICE_ID_KEY = "DeviceId";

    private string authToken;

    void Start()
    {
        // Charger le token sauvegardé s'il existe
        authToken = PlayerPrefs.GetString(TOKEN_PREFS_KEY, "");

        if (string.IsNullOrEmpty(authToken))
        {
            // Pas de token, en générer un nouveau
            StartCoroutine(GetAnonymousToken());
        }
        else
        {
            Debug.Log("Token chargé depuis PlayerPrefs");
        }
    }

    private string GetOrCreateDeviceId()
    {
        string deviceId = PlayerPrefs.GetString(DEVICE_ID_KEY, "");

        if (string.IsNullOrEmpty(deviceId))
        {
            // Générer un nouveau deviceId unique
#if UNITY_ANDROID || UNITY_IOS
            deviceId = SystemInfo.deviceUniqueIdentifier;
#else
            deviceId = Guid.NewGuid().ToString();
#endif
            PlayerPrefs.SetString(DEVICE_ID_KEY, deviceId);
            PlayerPrefs.Save();
        }

        return deviceId;
    }

    public IEnumerator GetAnonymousToken()
    {
        string deviceId = GetOrCreateDeviceId();

        AnonymousAuthRequest request = new AnonymousAuthRequest
        {
            deviceId = deviceId,
            gameVersion = Application.version
        };

        string jsonData = JsonUtility.ToJson(request);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);

        using (UnityWebRequest www = new UnityWebRequest(API_BASE_URL + "/api/unity/auth", "POST"))
        {
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                AnonymousAuthResponse response = JsonUtility.FromJson<AnonymousAuthResponse>(www.downloadHandler.text);

                if (response.success)
                {
                    authToken = response.token;
                    PlayerPrefs.SetString(TOKEN_PREFS_KEY, authToken);
                    PlayerPrefs.Save();

                    Debug.Log("Token anonyme obtenu avec succès!");
                    Debug.Log($"Device ID: {deviceId}");
                    Debug.Log($"Token expire dans: {response.expiresIn}s");
                }
                else
                {
                    Debug.LogError("Erreur lors de l'obtention du token");
                }
            }
            else
            {
                Debug.LogError($"Erreur réseau: {www.error}");
                Debug.LogError($"Code: {www.responseCode}");
            }
        }
    }

    public string GetToken()
    {
        return authToken;
    }

    public bool HasValidToken()
    {
        return !string.IsNullOrEmpty(authToken);
    }
}
```

### GameAPIClient.cs

```csharp
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class ScoreData
{
    public string pseudo;
    public int score;
    public float timeCompleted;
}

[Serializable]
public class SaveScoreRequest
{
    public string action = "save_score";
    public List<ScoreData> scores;
}

[Serializable]
public class APIResponse
{
    public bool success;
    public string message;
    public string userId;
    public bool isAnonymous;
}

public class GameAPIClient : MonoBehaviour
{
    private const string API_BASE_URL = "http://localhost:3000";
    private AuthManager authManager;

    void Start()
    {
        authManager = FindObjectOfType<AuthManager>();
    }

    public IEnumerator SaveScore(string playerName, int score, float time)
    {
        if (!authManager.HasValidToken())
        {
            Debug.LogError("Pas de token d'authentification!");
            yield break;
        }

        SaveScoreRequest request = new SaveScoreRequest
        {
            scores = new List<ScoreData>
            {
                new ScoreData
                {
                    pseudo = playerName,
                    score = score,
                    timeCompleted = time
                }
            }
        };

        string jsonData = JsonUtility.ToJson(request);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);

        using (UnityWebRequest www = new UnityWebRequest(API_BASE_URL + "/api/game", "POST"))
        {
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");
            www.SetRequestHeader("Authorization", "Bearer " + authManager.GetToken());

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                APIResponse response = JsonUtility.FromJson<APIResponse>(www.downloadHandler.text);

                if (response.success)
                {
                    Debug.Log($"Score sauvegardé! UserId: {response.userId}, Anonymous: {response.isAnonymous}");
                }
                else
                {
                    Debug.LogError("Erreur lors de la sauvegarde du score");
                }
            }
            else if (www.responseCode == 401)
            {
                Debug.LogWarning("Token expiré, regénération...");
                yield return authManager.GetAnonymousToken();
                // Réessayer après avoir obtenu un nouveau token
                yield return SaveScore(playerName, score, time);
            }
            else
            {
                Debug.LogError($"Erreur réseau: {www.error}");
                Debug.LogError($"Response: {www.downloadHandler.text}");
            }
        }
    }
}
```

### Exemple d'utilisation

```csharp
using UnityEngine;

public class GameManager : MonoBehaviour
{
    private GameAPIClient apiClient;

    void Start()
    {
        apiClient = FindObjectOfType<GameAPIClient>();
    }

    public void OnGameFinished(string playerName, int finalScore, float completionTime)
    {
        // Sauvegarder le score
        StartCoroutine(apiClient.SaveScore(playerName, finalScore, completionTime));
    }
}
```

## 3. Flux d'utilisation

### Au démarrage du jeu :

1. Unity vérifie s'il a déjà un token stocké
2. Si non → appelle `/api/unity/auth` avec le deviceId
3. Stocke le token dans PlayerPrefs

### Pendant le jeu :

4. Le joueur joue normalement
5. À la fin de la partie → appelle `/api/game` avec le token
6. Les scores sont sauvegardés côté serveur

### Gestion de l'expiration :

7. Si l'API retourne 401 (Unauthorized) → le token a expiré
8. Unity demande un nouveau token automatiquement
9. Réessaye la requête avec le nouveau token

## 4. Endpoints API disponibles

### `/api/game` (GET)

Lecture publique des paramètres du jeu (pas de token requis) :

```http
GET /api/game?parametre=lecture
```

### `/api/game` (POST)

Sauvegarde de données (token requis) :

**Action : save_score**
```json
{
  "action": "save_score",
  "scores": [
    {
      "pseudo": "Player1",
      "score": 1000,
      "timeCompleted": 45.5
    }
  ]
}
```

**Action : save_player_data**
```json
{
  "action": "save_player_data",
  "playerData": {
    "level": 5,
    "coins": 250,
    "powerups": ["speed", "shield"]
  }
}
```

## 5. Sécurité

### ✅ Ce qui est sécurisé :

- Tokens JWT signés cryptographiquement
- Impossible de forger un token sans le secret
- Tokens avec expiration (24h)
- CORS activé pour toutes les origines

### ⚠️ Limitations :

- Pas de compte utilisateur → les données sont liées au deviceId
- Si l'utilisateur change d'appareil → nouvelles données
- Pas de synchronisation multi-appareils

### 💡 Recommandations :

Pour plus de sécurité en production :
1. Utilisez HTTPS obligatoirement
2. Limitez CORS aux domaines autorisés
3. Ajoutez du rate limiting
4. Validez les données côté serveur

## 6. Test avec cURL

```bash
# 1. Obtenir un token
curl -X POST http://localhost:3000/api/unity/auth \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test-device-123","gameVersion":"1.0.0"}'

# Réponse : {"success":true,"token":"eyJhbGc...","expiresIn":86400}

# 2. Utiliser le token pour sauvegarder un score
curl -X POST http://localhost:3000/api/game \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "action":"save_score",
    "scores":[{"pseudo":"TestPlayer","score":1000,"timeCompleted":45.5}]
  }'
```

## 7. Troubleshooting

### Erreur 401 (Unauthorized)

- Le token a expiré (>24h)
- Le token est invalide
- **Solution** : Redemander un nouveau token

### Erreur 400 (Bad Request)

- Le `deviceId` est manquant ou invalide
- Le format JSON est incorrect
- **Solution** : Vérifier le format des données

### Erreur CORS

- Le navigateur bloque la requête
- **Solution** : CORS est déjà configuré côté serveur, vérifiez votre build Unity

### Token vide

- PlayerPrefs pas sauvegardé
- **Solution** : Appeler `PlayerPrefs.Save()` après avoir stocké le token

## 8. Migration vers un système avec comptes

Si plus tard vous voulez ajouter des comptes utilisateurs :

1. Les tokens anonymes continueront de fonctionner
2. Vous pourrez proposer une "conversion" : lier le deviceId à un compte
3. Better Auth supporte déjà l'email/password, OAuth, etc.

**L'API supporte les deux types de tokens en parallèle !**

---

**Votre jeu Unity peut maintenant communiquer avec l'API de manière sécurisée, sans système de compte !** 🎮🚀
