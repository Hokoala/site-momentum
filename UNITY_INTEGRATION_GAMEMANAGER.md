# Intégration API dans votre GameManager

## GameManager.cs modifié

Voici votre `GameManager.cs` avec l'intégration de l'API :

```csharp
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.EventSystems;
using System.Collections;
using TMPro;

public class GameManager : MonoBehaviour
{
    // --- Singleton Pattern ---
    public static GameManager Instance { get; private set; }

    [Header("UI")]
    public GameObject countdownOverlay;
    public GameObject gameOverPanel;

    [Header("Game Settings")]
    public int countdownDuration = 3;

    [Header("API Integration")]
    private GameAPIClient apiClient;
    private AuthManager authManager;
    private float gameStartTime;
    private bool gameInProgress = false;

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
        }
        else
        {
            Instance = this;
        }
    }

    void Start()
    {
        Time.timeScale = 1f;

        // Initialize API components
        authManager = FindObjectOfType<AuthManager>();
        apiClient = FindObjectOfType<GameAPIClient>();

        // Ensure the game over panel is hidden at the start
        if (gameOverPanel != null)
        {
            gameOverPanel.SetActive(false);
        }

        StartCoroutine(StartCountdownCoroutine());
    }

    IEnumerator StartCountdownCoroutine()
    {
        // --- PREPARE FOR COUNTDOWN ---
        // Disable player controls
        PlayerInput[] allPlayerInputs = FindObjectsOfType<PlayerInput>();
        foreach (PlayerInput input in allPlayerInputs)
        {
            input.enabled = false;
        }

        // Activate the countdown UI and find the text component
        TextMeshProUGUI countdownText = null;
        if (countdownOverlay != null)
        {
            countdownOverlay.SetActive(true);
            countdownText = countdownOverlay.GetComponentInChildren<TextMeshProUGUI>();
        }

        // --- COUNTDOWN ---
        for (int i = countdownDuration; i > 0; i--)
        {
            if (countdownText != null)
            {
                countdownText.text = i.ToString();
            }
            yield return new WaitForSeconds(1f);
        }

        // --- GO! ---
        if (countdownText != null)
        {
            countdownText.text = "GO!";
        }
        yield return new WaitForSeconds(1f);

        // Deactivate the entire countdown overlay
        if (countdownOverlay != null)
        {
            countdownOverlay.SetActive(false);
        }

        // --- START THE GAME ---
        // Record game start time
        gameStartTime = Time.time;
        gameInProgress = true;

        // Enable player controls
        foreach (PlayerInput input in allPlayerInputs)
        {
            input.enabled = true;
        }

        // Start timers
        PlayerTimer[] allPlayerTimers = FindObjectsOfType<PlayerTimer>();
        foreach (PlayerTimer timer in allPlayerTimers)
        {
            timer.StartTimer();
        }
    }

    /// <summary>
    /// Call this method when a player wins the game
    /// </summary>
    /// <param name="playerName">Name of the winning player</param>
    /// <param name="playerScore">Final score</param>
    public void OnPlayerWin(string playerName, int playerScore)
    {
        if (!gameInProgress) return;

        gameInProgress = false;
        float completionTime = Time.time - gameStartTime;

        Debug.Log($"Player {playerName} won with score {playerScore} in {completionTime:F2} seconds!");

        // Send score to API
        if (apiClient != null && authManager != null && authManager.HasValidToken())
        {
            StartCoroutine(apiClient.SaveScore(playerName, playerScore, completionTime));
        }
        else
        {
            Debug.LogWarning("API Client not ready or no token available. Score not sent.");
        }

        // Show game over panel
        ShowGameOver(playerName, playerScore, completionTime);
    }

    /// <summary>
    /// Call this method when the game ends (time's up, all players finished, etc.)
    /// </summary>
    /// <param name="playerName">Name of the player</param>
    /// <param name="finalScore">Final score</param>
    public void OnGameFinished(string playerName, int finalScore)
    {
        if (!gameInProgress) return;

        gameInProgress = false;
        float completionTime = Time.time - gameStartTime;

        Debug.Log($"Game finished for {playerName}. Score: {finalScore}, Time: {completionTime:F2}s");

        // Send score to API
        if (apiClient != null && authManager != null && authManager.HasValidToken())
        {
            StartCoroutine(apiClient.SaveScore(playerName, finalScore, completionTime));
        }

        ShowGameOver(playerName, finalScore, completionTime);
    }

    private void ShowGameOver(string playerName, int score, float time)
    {
        if (gameOverPanel != null)
        {
            gameOverPanel.SetActive(true);

            // Update game over panel text (if you have TextMeshPro components)
            TextMeshProUGUI[] texts = gameOverPanel.GetComponentsInChildren<TextMeshProUGUI>();
            foreach (var text in texts)
            {
                if (text.name == "WinnerText")
                {
                    text.text = $"{playerName} wins!";
                }
                else if (text.name == "ScoreText")
                {
                    text.text = $"Score: {score}";
                }
                else if (text.name == "TimeText")
                {
                    text.text = $"Time: {time:F2}s";
                }
            }
        }

        Time.timeScale = 0f; // Pause the game
    }

    public void RestartGame()
    {
        Time.timeScale = 1f;
        gameInProgress = false;
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }
}
```

## Modifications apportées :

### 1. Nouvelles variables
```csharp
[Header("API Integration")]
private GameAPIClient apiClient;
private AuthManager authManager;
private float gameStartTime;
private bool gameInProgress = false;
```

### 2. Initialisation dans Start()
```csharp
// Initialize API components
authManager = FindObjectOfType<AuthManager>();
apiClient = FindObjectOfType<GameAPIClient>();
```

### 3. Enregistrement du temps de départ
```csharp
// Dans StartCountdownCoroutine(), après "GO!"
gameStartTime = Time.time;
gameInProgress = true;
```

### 4. Nouvelles méthodes publiques

**OnPlayerWin()** - Appeler quand un joueur gagne :
```csharp
GameManager.Instance.OnPlayerWin("Player 1", 1000);
```

**OnGameFinished()** - Appeler quand le jeu se termine :
```csharp
GameManager.Instance.OnGameFinished("Player 1", 850);
```

## Exemples d'utilisation

### Depuis votre script de victoire :

```csharp
public class FinishLine : MonoBehaviour
{
    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            string playerName = other.GetComponent<PlayerController>().playerName;
            int playerScore = other.GetComponent<PlayerScore>().GetScore();

            // Envoyer le score à l'API
            GameManager.Instance.OnPlayerWin(playerName, playerScore);
        }
    }
}
```

### Depuis votre PlayerTimer quand le temps est écoulé :

```csharp
public class PlayerTimer : MonoBehaviour
{
    public void OnTimeUp()
    {
        string playerName = GetComponent<PlayerController>().playerName;
        int finalScore = GetComponent<PlayerScore>().GetScore();

        GameManager.Instance.OnGameFinished(playerName, finalScore);
    }
}
```

### Si vous collectez des pièces/points :

```csharp
public class Coin : MonoBehaviour
{
    public int value = 10;

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            PlayerScore score = other.GetComponent<PlayerScore>();
            score.AddScore(value);
            Destroy(gameObject);
        }
    }
}
```

## Setup dans Unity

### 1. Hiérarchie de scène recommandée :

```
Scene
├── GameManager (avec GameManager.cs)
├── AuthManager (avec AuthManager.cs)
├── GameAPIClient (avec GameAPIClient.cs)
├── Players
│   ├── Player1
│   └── Player2
└── UI
    ├── CountdownOverlay
    └── GameOverPanel
```

### 2. Configuration du GameOverPanel :

Ajoutez ces TextMeshProUGUI dans votre GameOverPanel :
- `WinnerText` - Affichera le nom du gagnant
- `ScoreText` - Affichera le score final
- `TimeText` - Affichera le temps

### 3. Ne pas oublier :

```csharp
// Dans AuthManager.cs, changez l'URL :
private const string API_BASE_URL = "http://localhost:3000"; // En dev
// Ou
private const string API_BASE_URL = "https://votre-domaine.com"; // En prod
```

## Flux complet dans votre jeu

```
1. Scène charge
   ↓
2. AuthManager obtient un token automatiquement
   ↓
3. GameManager lance le countdown
   ↓
4. Joueur joue (gameInProgress = true)
   ↓
5. Joueur franchit la ligne d'arrivée
   ↓
6. OnPlayerWin() est appelé
   ↓
7. Score envoyé à l'API automatiquement
   ↓
8. GameOverPanel s'affiche
   ↓
9. Joueur clique "Restart"
   ↓
10. Scène recharge → retour à l'étape 1
```

## Debug / Logs

Pour vérifier que tout fonctionne :

```csharp
// Dans la console Unity, vous verrez :
"Token anonyme obtenu avec succès!"
"Player Player 1 won with score 1000 in 45.23 seconds!"
"Score sauvegardé! UserId: anonymous_xxx, Anonymous: True"
```

## Points importants

1. **AuthManager se lance automatiquement** au Start()
2. **Le token est sauvegardé** dans PlayerPrefs
3. **Si le token expire**, il est regénéré automatiquement
4. **Les scores sont envoyés** dès qu'un joueur gagne
5. **Pas besoin de compte** pour que ça fonctionne

---

**Votre GameManager est maintenant prêt pour l'API !** 🎮✨
