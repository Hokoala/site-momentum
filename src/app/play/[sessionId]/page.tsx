"use client";
import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PlayPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const searchParams = useSearchParams();
  const role = searchParams.get("role"); // "host" or "join"
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (role === "host") {
      const stored = sessionStorage.getItem(`token-${sessionId}`);
      if (stored) {
        setToken(stored);
      } else {
        setError("Token manquant — retour au lobby pour recréer la partie");
      }
    } else {
      // join: claim the P2 slot
      fetch(`/api/lobby/${sessionId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
        .then(async (r) => {
          if (r.status === 401) throw new Error("Tu dois te connecter");
          if (r.status === 409) throw new Error("Cette partie est complète");
          if (!r.ok) throw new Error(await r.text());
          return r.json();
        })
        .then((d) => setToken(d.player2Token))
        .catch((e) => setError(e.message));
    }
  }, [sessionId, role]);

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-4">
            ERREUR // CONNEXION
          </p>
          <p className="font-mono text-red-400 text-sm border border-red-500/30 bg-red-500/10 rounded px-4 py-3">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-white/60">
          <Loader2 className="w-4 h-4 text-[#C0FE04] animate-spin" />
          Connexion à la partie...
        </div>
      </main>
    );
  }

  const iframeSrc = `/webgl/index.html?sessionId=${encodeURIComponent(
    sessionId
  )}&token=${encodeURIComponent(token)}`;

  return (
    <iframe
      src={iframeSrc}
      className="w-screen h-screen border-0"
      allow="autoplay; gamepad; fullscreen"
    />
  );
}
