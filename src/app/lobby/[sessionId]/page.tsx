"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";

interface StatusResponse {
  status: string;
  player1Joined: boolean;
  player2Joined: boolean;
  player1Pseudo: string | null;
  player2Pseudo: string | null;
}

export default function WaitingRoom({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState<"waiting" | "ready">("waiting");
  const [info, setInfo] = useState<StatusResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let stopped = false;
    const poll = async () => {
      try {
        const r = await fetch(`/api/lobby/${sessionId}/status`);
        if (!r.ok) return;
        const data: StatusResponse = await r.json();
        if (stopped) return;
        setInfo(data);
        if (data.player2Joined || data.status === "playing") {
          setStatus("ready");
          stopped = true;
          setTimeout(() => router.push(`/play/${sessionId}?role=host`), 1000);
        }
      } catch {
        /* network blip — ignore */
      }
    };
    poll();
    const i = setInterval(poll, 2000);
    return () => {
      stopped = true;
      clearInterval(i);
    };
  }, [sessionId, router]);

  function copyCode() {
    navigator.clipboard.writeText(sessionId.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      {/* HUD line */}
      <div className="fixed top-14 md:top-16 left-0 w-full z-40 flex justify-between items-center px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-[#C0FE04] pointer-events-none">
        <span>SYS.STATUS: ONLINE</span>
        <span className="hidden md:inline">LOBBY // WAITING ROOM</span>
        <span>SESSION_{sessionId.slice(0, 8).toUpperCase()}</span>
      </div>

      <div className="w-full max-w-2xl">
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#C0FE04] mb-4">
          PARTIE // EN ATTENTE
        </p>

        <h1 className="text-4xl md:text-5xl font-black uppercase leading-none mb-8">
          SALLE D&apos;<span className="text-[#C0FE04]">ATTENTE</span>
        </h1>

        <p className="text-white/60 font-mono text-sm mb-6">
          Partage ce code avec ton ami pour qu&apos;il rejoigne la partie :
        </p>

        {/* Code box — big, copy-friendly */}
        <div className="border border-[#C0FE04]/30 rounded-lg p-6 mb-8 flex items-center justify-between gap-4 bg-[#C0FE04]/5">
          <div className="flex-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#C0FE04] mb-2">
              CODE DE PARTIE
            </p>
            <code className="font-mono text-4xl md:text-5xl font-black tracking-[0.2em] text-white select-all">
              {sessionId.toUpperCase()}
            </code>
          </div>
          <Button
            onClick={copyCode}
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="Copier le code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#C0FE04]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Status */}
        <div className="border border-white/10 rounded-lg p-6 text-center">
          {status === "waiting" ? (
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 text-[#C0FE04] animate-spin" />
                <span className="font-mono uppercase tracking-widest text-sm text-white/70">
                  En attente du 2e joueur...
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="border border-white/10 rounded p-3 text-center">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#C0FE04] mb-1">
                    JOUEUR 1
                  </p>
                  <p className="text-white font-mono text-sm">
                    {info?.player1Pseudo ?? "—"}
                  </p>
                  <div className="mt-2 w-2 h-2 rounded-full bg-[#C0FE04] mx-auto" />
                </div>
                <div className="border border-white/10 rounded p-3 text-center opacity-40">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                    JOUEUR 2
                  </p>
                  <p className="text-white/40 font-mono text-sm">En attente</p>
                  <div className="mt-2 w-2 h-2 rounded-full bg-white/20 mx-auto animate-pulse" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#C0FE04] animate-ping" />
              <span className="font-mono uppercase tracking-widest text-[#C0FE04] font-bold">
                Lancement de la partie...
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
