"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Zap } from "lucide-react";

export default function LobbyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createGame() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lobby/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.status === 401) {
        setError("Tu dois te connecter pour créer une partie");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      sessionStorage.setItem(`token-${data.sessionId}`, data.player1Token);
      router.push(`/lobby/${data.sessionId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* HUD line */}
      <div className="fixed top-14 md:top-16 left-0 w-full z-40 flex justify-between items-center px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-[#C0FE04] pointer-events-none">
        <span>SYS.STATUS: ONLINE</span>
        <span className="hidden md:inline">MULTIPLAYER // PROTOCOL V.0.9</span>
        <span>MOMENTUM_BUILD_2026</span>
      </div>

      <div className="w-full max-w-2xl">
        {/* Label */}
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#C0FE04] mb-4">
          MODE // MULTIJOUEUR EN LIGNE
        </p>

        <h1 className="text-5xl md:text-6xl font-black uppercase leading-none mb-6">
          JOUER À{" "}
          <span className="text-[#C0FE04]">DEUX</span>
        </h1>

        <p className="text-white/60 font-mono text-sm mb-10 max-w-lg">
          Crée une session, partage le lien d&apos;invitation à un ami, et
          affrontez-vous en temps réel dans le navigateur.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start mb-8">
          <Button
            onClick={createGame}
            disabled={loading}
            size="lg"
            variant="lime"
            className="gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                Création...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Créer une partie
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="border border-red-500/30 bg-red-500/10 rounded px-4 py-3 font-mono text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Info cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", label: "Crée une partie" },
            { step: "02", label: "Partage le lien" },
            { step: "03", label: "Jouez ensemble" },
          ].map(({ step, label }) => (
            <div
              key={step}
              className="border border-white/10 rounded p-4 flex items-center gap-3"
            >
              <span className="text-[#C0FE04] font-mono text-xs">{step}</span>
              <Users className="w-4 h-4 text-white/30" />
              <span className="text-white/70 text-sm font-mono uppercase tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
