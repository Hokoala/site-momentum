"use client";

import { useState } from "react";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Si déjà connecté, rediriger
  if (session) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Inscription
        const result = await signUp.email({
          email,
          password,
          name,
        });

        if (result.error) {
          setError(result.error.message || "Erreur lors de l'inscription");
        } else {
          router.push("/admin");
        }
      } else {
        // Connexion
        const result = await signIn.email({
          email,
          password,
        });

        if (result.error) {
          setError(result.error.message || "Erreur lors de la connexion");
        } else {
          router.push("/admin");
        }
      }
    } catch (err) {
      setError("Une erreur est survenue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/5 border border-lime-400/20 p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-lime-400 mb-6 text-center">
          {isSignUp ? "Créer un compte" : "Connexion"}
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-white/70 mb-2">
                Nom
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-lime-400"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-white/70 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-lime-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white/70 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-lime-400"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-400 text-black font-bold py-3 rounded hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Chargement..."
              : isSignUp
              ? "S'inscrire"
              : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-lime-400 hover:underline"
          >
            {isSignUp
              ? "Déjà un compte ? Se connecter"
              : "Pas de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}
