"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function JoinGameForm() {
  const searchParams = useSearchParams();
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sessionId = searchParams.get("session");
  const playerNumber = searchParams.get("player");
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pseudo || pseudo.trim().length < 3) {
      setError("Le pseudo doit faire au moins 3 caractères");
      return;
    }

    if (!sessionId || !token) {
      setError("Paramètres manquants dans l'URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/game/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          playerToken: token,
          pseudo: pseudo.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="w-20 h-20 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bienvenue, {pseudo}!
          </h1>
          <p className="text-gray-600 mb-2">
            Tu es maintenant connecté en tant que{" "}
            <span className="font-bold">Joueur {playerNumber}</span>
          </p>
          <p className="text-gray-500 text-sm">
            Attends que l'autre joueur se connecte pour commencer la partie...
          </p>
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Momentum Game</h1>
          <p className="text-white">Joueur {playerNumber}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="pseudo"
              className="block text-sm font-medium text-white mb-2"
            >
              Entre ton pseudo
            </label>
            <input
              type="text"
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ton pseudo de joueur"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-white"
              maxLength={12}
              minLength={3}
              required
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">3-12 caractères</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            variant="default"
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connexion...
              </span>
            ) : (
              "REJOINDRE LA PARTIE"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Session: {sessionId?.substring(0, 8)}...</p>
        </div>
      </div>
    </div>
  );
}

export default function JoinGamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      }
    >
      <JoinGameForm />
    </Suspense>
  );
}
