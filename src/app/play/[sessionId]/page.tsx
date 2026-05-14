"use client";
import { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";

export default function PlayPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role"); // "host" or "join"
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Unity → parent bridge: when the player clicks "Quitter" in the WebGL build,
  // the .jslib helper posts { type: 'momentum-quit', sessionId } and we route
  // to the recap page that already exists at /classement/[sessionId].
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.data !== "object" || e.data === null) return;
      if (e.data.type === "momentum-quit") {
        const sid = e.data.sessionId || sessionId;
        router.push(`/classement/${encodeURIComponent(sid)}`);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router, sessionId]);

  // Joiner pseudo flow
  const [pseudo, setPseudo] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    // The new code-based flow has /game/join acquire the token before
    // navigating here, so try sessionStorage first regardless of role.
    const stored = sessionStorage.getItem(`token-${sessionId}`);
    if (stored) {
      setToken(stored);
      return;
    }
    if (role === "host") {
      setError("Token manquant — retour au lobby pour recréer la partie");
    }
    // role=join with no token: fall through to the legacy in-page pseudo input
    // (kept so old QR/URL invites stay functional).
  }, [sessionId, role]);

  async function submitJoin() {
    const trimmed = pseudo.trim();
    if (trimmed.length < 1 || trimmed.length > 24) {
      setError("Le pseudo doit faire entre 1 et 24 caractères");
      return;
    }
    setError("");
    setJoining(true);
    try {
      const r = await fetch(`/api/lobby/${sessionId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo: trimmed }),
      });
      if (r.status === 404) throw new Error("Cette partie n'existe pas");
      if (r.status === 409 || r.status === 400) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error ?? "Cette partie est complète");
      }
      if (!r.ok) throw new Error(await r.text());
      const d = await r.json();
      setToken(d.player2Token);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setJoining(false);
    }
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-4">
            ERREUR // CONNEXION
          </p>
          <p className="font-mono text-red-400 text-sm border border-red-500/30 bg-red-500/10 rounded px-4 py-3 mb-6">
            {error}
          </p>
          {role === "join" && !token && (
            <Button
              onClick={() => {
                setError("");
              }}
              size="lg"
              variant="lime"
            >
              Réessayer
            </Button>
          )}
        </div>
      </main>
    );
  }

  // Joiner pseudo input (only when role=join and we don't have a token yet)
  if (role === "join" && !token) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#C0FE04] mb-4">
            REJOINDRE // PARTIE {sessionId}
          </p>
          <h1 className="text-3xl md:text-4xl font-black uppercase leading-none mb-6">
            ENTRE TON <span className="text-[#C0FE04]">PSEUDO</span>
          </h1>
          <p className="text-white/60 font-mono text-sm mb-8">
            Tu es sur le point de rejoindre une partie en cours.
          </p>

          <label className="flex flex-col gap-2 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
              TON PSEUDO
            </span>
            <input
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !joining) submitJoin();
              }}
              placeholder="ex: SpeedRunner"
              maxLength={24}
              autoFocus
              className="bg-white/5 border border-white/20 rounded px-4 py-3 font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#C0FE04] transition"
            />
          </label>

          <Button
            onClick={submitJoin}
            disabled={joining || pseudo.trim().length === 0}
            size="lg"
            variant="lime"
            className="gap-2 w-full"
          >
            {joining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Rejoindre la partie
              </>
            )}
          </Button>
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
      className="block w-screen h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] mt-14 md:mt-16 border-0"
      allow="autoplay; gamepad; fullscreen"
    />
  );
}
