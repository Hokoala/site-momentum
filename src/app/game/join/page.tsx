"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import { Terminal, Shield, Cpu, ChevronRight, CheckCircle2, AlertTriangle, Loader2, Play } from "lucide-react";
import { validatePseudo, getErrorMessage } from "@/lib/pseudo-validator";

function JoinGameForm() {
  const searchParams = useSearchParams();
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [gameReady, setGameReady] = useState(false);

  const sessionId = searchParams.get("session");
  const playerNumber = searchParams.get("player");
  const token = searchParams.get("token");

  // Polling pour vérifier si les deux joueurs sont prêts
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (success && sessionId) {
      console.log(`[POLLING] Démarrage pour la session: ${sessionId}`);
      
      intervalId = setInterval(async () => {
        try {
          // Force no-cache pour éviter les données périmées
          const response = await fetch(`/api/game/details?sessionId=${sessionId}`, {
            cache: 'no-store',
            headers: {
              'Pragma': 'no-cache',
              'Cache-Control': 'no-cache'
            }
          });
          const data = await response.json();

          if (data.success && data.session) {
            const p1 = data.session.players.player1;
            const p2 = data.session.players.player2;

            console.log(`[POLLING] P1(${p1.pseudo}): ${p1.joined}, P2(${p2.pseudo}): ${p2.joined}`);

            if (p1.joined && p2.joined) {
              console.log("[POLLING] Les deux joueurs sont connectés !");
              setGameReady(true);
              clearInterval(intervalId);
            }
          }
        } catch (err) {
          console.error("[POLLING] Erreur:", err);
        }
      }, 2000);
    }

    return () => {
      if (intervalId) {
        console.log("[POLLING] Arrêt de l'intervalle");
        clearInterval(intervalId);
      }
    };
  }, [success, sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client avec le validateur
    const validation = validatePseudo(pseudo);
    if (!validation.isValid) {
      const errorMessage = validation.errors
        .map((err) => getErrorMessage(err, "en"))
        .join(" | ");
      setError(`ERROR: ${errorMessage.toUpperCase()}`);
      return;
    }

    if (!sessionId || !token) {
      setError("ERROR: MISSING SESSION SETTINGS");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(`[JOIN] Tentative de connexion pour ${validation.sanitizedPseudo}...`);
      const response = await fetch("/api/game/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          playerToken: token,
          pseudo: validation.sanitizedPseudo,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("[JOIN] Connexion réussie");
        setSuccess(true);
      } else {
        setError(`ERROR: ${data.error || "ACCESS DENIED"}`);
      }
    } catch (err) {
      setError("ERROR: SERVER CONNECTION FAILED");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className={`relative z-10 w-full max-w-lg border ${gameReady ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.2)]' : 'border-primary shadow-[0_0_50px_rgba(192,254,4,0.1)]'} bg-black/90 p-8 transition-all duration-500`}>
            <div className="flex flex-col items-center text-center space-y-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border animate-pulse transition-colors duration-500 ${gameReady ? 'bg-green-500/10 border-green-500' : 'bg-primary/10 border-primary'}`}>
                    {gameReady ? <Play className="w-10 h-10 text-green-500 ml-1" /> : <CheckCircle2 className="w-10 h-10 text-primary" />}
                </div>
                
                <div className="space-y-2">
                    <h1 className={`text-3xl font-black tracking-tighter transition-colors duration-500 ${gameReady ? 'text-green-500' : 'text-primary'}`}>
                        {gameReady ? "SYSTEM READY" : "ACCESS GRANTED"}
                    </h1>
                    <p className="text-white/60 text-xs tracking-widest uppercase">
                        {gameReady ? "LANCEMENT IMMINENT" : "AUTHENTIFICATION RÉUSSIE"}
                    </p>
                </div>

                <div className="w-full bg-white/5 border border-white/10 p-6 text-left space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-[10px] text-white/40 uppercase">IDENTIFIANT</span>
                        <span className="text-sm font-bold text-white uppercase">{pseudo}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-[10px] text-white/40 uppercase">UNITÉ</span>
                        <span className="text-sm font-bold text-primary uppercase">JOUEUR {playerNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white/40 uppercase">STATUT</span>
                        <span className="text-xs font-bold text-green-500 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            EN LIGNE
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 mt-4">
                    {gameReady ? (
                        <>
                            <div className="text-green-500 font-bold uppercase tracking-widest animate-bounce">
                                TOUS LES JOUEURS CONNECTÉS
                            </div>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest text-center px-4">
                                LA PARTIE VA COMMENCER SUR L'ÉCRAN PRINCIPAL DANS QUELQUES INSTANTS
                            </p>
                        </>
                    ) : (
                        <>
                            <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
                            <p className="text-[10px] text-white/30 uppercase tracking-widest blink">
                                En attente du second joueur...
                            </p>
                        </>
                    )}
                </div>
            </div>
            
            <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t transition-colors duration-500 ${gameReady ? 'border-green-500' : 'border-primary'}`}></div>
            <div className={`absolute top-0 right-0 w-2 h-2 border-r border-t transition-colors duration-500 ${gameReady ? 'border-green-500' : 'border-primary'}`}></div>
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-l border-b transition-colors duration-500 ${gameReady ? 'border-green-500' : 'border-primary'}`}></div>
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b transition-colors duration-500 ${gameReady ? 'border-green-500' : 'border-primary'}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      <div className="relative hidden lg:flex flex-col justify-between p-12 border-r border-white/10">
          <div className="absolute inset-0 z-0 opacity-40">
              <Image src="/assets/screen1.png" alt="Background" fill className="object-cover grayscale mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black"></div>
          </div>
          <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary font-mono text-xs mb-4">
                  <Terminal className="w-4 h-4" /> SYSTEM_LOGIN
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.9]">JOIN THE <br/> <span className="text-transparent stroke-white text-stroke">PROTOCOL</span></h1>
          </div>
          <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4 text-xs font-mono text-white/60"><Shield className="w-4 h-4" /> SECURE CONNECTION</div>
              <div className="flex items-center gap-4 text-xs font-mono text-white/60"><Cpu className="w-4 h-4" /> SYNC READY</div>
              <div className="h-px w-24 bg-primary mt-4"></div>
          </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 relative">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#111_10px,#111_11px)] opacity-20 -z-10"></div>
          <div className="w-full max-w-md space-y-8">
              <div className="space-y-2">
                  <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><span className="w-2 h-6 bg-primary block"></span>AUTHENTICATION</h2>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest pl-4">Please log in to access the lobby</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                      <label htmlFor="pseudo" className="text-[10px] font-mono text-primary uppercase tracking-widest">PLAYER_IDENTIFIER</label>
                      <div className="relative group">
                          <input
                            type="text"
                            id="pseudo"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value.toUpperCase())}
                            placeholder="ENTER YOUR USERNAME..."
                            className="w-full bg-black border border-white/20 p-4 text-sm text-white placeholder-white/20 focus:border-primary focus:outline-none uppercase font-mono transition-all group-hover:border-white/40"
                            maxLength={12} minLength={3} required autoFocus autoComplete="off"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      </div>
                  </div>
                  {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 text-xs font-mono flex items-start gap-3"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}
                  <button type="submit" disabled={loading} className="w-full bg-white text-black font-black uppercase text-sm p-4 hover:bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> TRAITEMENT...</> : <>INITIALIZE CONNECTION <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
              </form>
              <div className="pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/30">
                  <span>SESSION_ID: {sessionId?.substring(0, 8) || "UNKNOWN"}...</span>
                  <span>BUILD_2026.01</span>
              </div>
          </div>
      </div>

      <style jsx global>{`
        .text-stroke { -webkit-text-stroke: 1px rgba(255,255,255,0.5); color: transparent; }
        .blink { animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

export default function JoinGamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-primary font-mono text-xs animate-pulse">LOADING_INTERFACE...</div></div>}>
      <JoinGameForm />
    </Suspense>
  );
}