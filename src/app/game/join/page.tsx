"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Terminal, Shield, Cpu, ChevronRight, AlertTriangle, Loader2, Zap, Users } from "lucide-react";
import { normalizeGameCode, isValidGameCode } from "@/lib/game-code";

type Mode = "create" | "join";

export default function MultiplayerEntryPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("create");
  const [pseudo, setPseudo] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validatePseudo(): string | null {
    const trimmed = pseudo.trim();
    if (trimmed.length < 1 || trimmed.length > 24) {
      setError("Le pseudo doit faire entre 1 et 24 caractères.");
      return null;
    }
    return trimmed;
  }

  async function createGame() {
    const trimmedPseudo = validatePseudo();
    if (!trimmedPseudo) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lobby/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo: trimmedPseudo }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      sessionStorage.setItem(`token-${data.sessionId}`, data.player1Token);
      sessionStorage.setItem(`pseudo-${data.sessionId}`, trimmedPseudo);
      router.push(`/lobby/${data.sessionId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  }

  async function joinGame() {
    const trimmedPseudo = validatePseudo();
    if (!trimmedPseudo) return;
    const normalized = normalizeGameCode(code);
    if (!isValidGameCode(normalized)) {
      setError("Le code doit faire 6 caractères (lettres et chiffres).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/lobby/${normalized}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo: trimmedPseudo }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 404) throw new Error("Cette partie n'existe pas.");
      if (res.status === 409 || res.status === 400) {
        if (data.error === "session-full") throw new Error("Cette partie est déjà complète.");
        if (data.error === "session-not-joinable") throw new Error("Cette partie n'est pas disponible.");
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      // Server returns sessionId + player2Token. Stash the token so /play can
      // pick it up just like the host flow does.
      sessionStorage.setItem(`token-${data.sessionId}`, data.player2Token);
      sessionStorage.setItem(`pseudo-${data.sessionId}`, trimmedPseudo);
      router.push(`/play/${data.sessionId}?role=join`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (mode === "create") createGame();
    else joinGame();
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      {/* Decorative left panel — desktop only */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 border-r border-white/10">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image src="/assets/screen1.png" alt="Background" fill className="object-cover grayscale mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary font-mono text-xs mb-4">
            <Terminal className="w-4 h-4" /> MULTIPLAYER_LOBBY
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.9]">
            JOIN THE <br />
            <span className="text-transparent stroke-white text-stroke">PROTOCOL</span>
          </h1>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 text-xs font-mono text-white/60"><Shield className="w-4 h-4" /> SECURE CONNECTION</div>
          <div className="flex items-center gap-4 text-xs font-mono text-white/60"><Cpu className="w-4 h-4" /> SYNC READY</div>
          <div className="h-px w-24 bg-primary mt-4"></div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#111_10px,#111_11px)] opacity-20 -z-10"></div>
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-primary block"></span>
              MULTIJOUEUR
            </h2>
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest pl-4">
              Crée une partie ou rejoins avec un code
            </p>
          </div>

          {/* Mode tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 border border-white/10 bg-white/5">
            <button
              type="button"
              onClick={() => { setMode("create"); setError(""); }}
              className={`px-4 py-3 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                mode === "create"
                  ? "bg-primary text-black font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Zap className="w-3 h-3" /> Créer
            </button>
            <button
              type="button"
              onClick={() => { setMode("join"); setError(""); }}
              className={`px-4 py-3 text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                mode === "join"
                  ? "bg-primary text-black font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Users className="w-3 h-3" /> Rejoindre
            </button>
          </div>

          <form onSubmit={submit} className="space-y-6">
            {mode === "join" && (
              <div className="space-y-2">
                <label htmlFor="code" className="text-[10px] font-mono text-primary uppercase tracking-widest">
                  CODE DE LA PARTIE
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="A4F2X9"
                  className="w-full bg-black border border-white/20 p-4 text-2xl text-white placeholder-white/20 focus:border-primary focus:outline-none uppercase font-mono tracking-[0.3em] text-center"
                  maxLength={10}
                  required
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="pseudo" className="text-[10px] font-mono text-primary uppercase tracking-widest">
                TON PSEUDO
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="pseudo"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  placeholder="ex: SpeedRunner"
                  className="w-full bg-black border border-white/20 p-4 text-sm text-white placeholder-white/20 focus:border-primary focus:outline-none font-mono transition-all group-hover:border-white/40"
                  maxLength={24}
                  minLength={1}
                  required
                  autoFocus={mode === "create"}
                  autoComplete="off"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 text-xs font-mono flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black uppercase text-sm p-4 hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> CONNEXION...</>
              ) : mode === "create" ? (
                <>CRÉER UNE PARTIE <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              ) : (
                <>REJOINDRE <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/30">
            <span>{mode === "create" ? "NEW_SESSION" : "JOIN_SESSION"}</span>
            <span>BUILD_2026.01</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .text-stroke { -webkit-text-stroke: 1px rgba(255,255,255,0.5); color: transparent; }
      `}</style>
    </div>
  );
}
