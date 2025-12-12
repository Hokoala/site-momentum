"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState({
    difficulte: "normal",
    vitesseJeu: 1.0,
    dureeJour: 30,
    dureeNuit: 15,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Rediriger si non connecté
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-lime-400 text-xl">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
        credentials: "include",
      });

      if (response.ok) {
        setMessage("Paramètres mis à jour avec succès !");
      } else {
        setMessage("Erreur lors de la mise à jour");
      }
    } catch (error) {
      setMessage("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-lime-400">
            Back-Office - Momentum
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>

        <div className="bg-white/5 border border-lime-400/20 p-6 rounded-lg mb-6">
          <p className="text-white/70">
            Connecté en tant que : <span className="text-lime-400">{session.user.email}</span>
          </p>
        </div>

        <div className="bg-white/5 border border-lime-400/20 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">
            Paramètres du jeu
          </h2>

          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.includes("succès")
                ? "bg-lime-400/10 border border-lime-400/50 text-lime-400"
                : "bg-red-500/10 border border-red-500/50 text-red-500"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/70 mb-2">Difficulté</label>
              <select
                value={settings.difficulte}
                onChange={(e) =>
                  setSettings({ ...settings, difficulte: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-lime-400"
              >
                <option value="facile">Facile</option>
                <option value="normal">Normal</option>
                <option value="difficile">Difficile</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-2">
                Vitesse du jeu: {settings.vitesseJeu}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.vitesseJeu}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    vitesseJeu: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2">
                Durée du jour (secondes)
              </label>
              <input
                type="number"
                value={settings.dureeJour}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dureeJour: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-lime-400"
                min="10"
                max="120"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2">
                Durée de la nuit (secondes)
              </label>
              <input
                type="number"
                value={settings.dureeNuit}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dureeNuit: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-lime-400"
                min="5"
                max="60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 text-black font-bold py-3 rounded hover:bg-lime-300 transition-colors disabled:opacity-50"
            >
              {loading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
