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
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/30 bg-white/5 backdrop-blur-sm">
          {/* Icône de succès avec animation */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#C0FE04]/20 rounded-full animate-ping"></div>
            </div>
            <svg
              className="w-20 h-20 text-[#C0FE04] mx-auto relative z-10"
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

          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue, <span className="text-[#C0FE04]">{pseudo}</span>!
          </h1>

          <div className="bg-white/10 rounded-xl p-4 mt-6 mb-6">
            <p className="text-white/80 mb-1">
              Tu es maintenant connecté en tant que
            </p>
            <span className="text-2xl font-bold text-[#C0FE04]">
              Joueur {playerNumber}
            </span>
          </div>

          <p className="text-white/60 text-sm mb-6">
            Attends que l'autre joueur se connecte pour commencer la partie...
          </p>

          {/* Spinner d'attente */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-white/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#C0FE04] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <span className="text-white/40 text-xs uppercase tracking-wider">
              En attente...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/30 bg-white/5 backdrop-blur-sm">
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

        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center justify-center gap-2 text-white/60">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="text-sm font-mono">
              Session: {sessionId?.substring(0, 8)}...
            </span>
          </div>
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
