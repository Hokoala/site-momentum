"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SlideDown from "@/components/SlideDown";
import Image from "next/image";
import {
  Trophy,
  Check,
  X,
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";

interface PlayerScore {
  rank: number;
  playerName: string;
  playerNumber: number;
  totalScore: number;
  distanceTraveled: number;
  survivalTime: number;
  collectiblesCollected: number;
  hasFinished: boolean;
}

interface SessionDetails {
  sessionId: string;
  status: string;
  mapName: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  duration: number | null;
  players: {
    player1: { pseudo: string | null; joined: boolean };
    player2: { pseudo: string | null; joined: boolean };
  };
  scores: PlayerScore[];
  winner: {
    playerName: string;
    playerNumber: number;
    totalScore: number;
  } | null;
}

// Configuration des maps avec images et descriptions
const mapConfig: Record<
  string,
  { title: string; image: string; description: string }
> = {
  main: {
    title: "MAIN ARENA",
    image: "/assets/map.png",
    description: "ZONE PRINCIPALE - HIGH SPEED TRACK",
  },
  default: {
    title: "DEFAULT SECTOR",
    image: "/assets/screen1.png",
    description: "ZONE D'ENTRAÎNEMENT STANDARD",
  },
};

export default function SessionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/game/details?sessionId=${encodeURIComponent(sessionId)}`,
      );
      const data = await response.json();

      if (data.success) {
        setSession(data.session);
      } else {
        setError(data.error || "Session non trouvée");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors du chargement des détails");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}M ${secs}S`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "waiting":
        return { label: "EN ATTENTE", color: "text-yellow-500" };
      case "playing":
        return { label: "EN COURS", color: "text-blue-500" };
      case "finished":
        return { label: "TERMINÉE", color: "text-primary" };
      default:
        return { label: status.toUpperCase(), color: "text-white" };
    }
  };

  const getMapInfo = (mapName: string | null) => {
    if (!mapName) return mapConfig.default;
    return mapConfig[mapName] || mapConfig.default;
  };

  if (loading) {
    return (
      <main className="relative w-full min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-white/30 font-mono text-xs animate-pulse">
          LOADING_SESSION_DATA...
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="relative w-full min-h-screen bg-black pt-20 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-red-500 font-black uppercase mb-4">
          ERREUR CRITIQUE
        </h1>
        <p className="text-white/50 font-mono text-sm mb-8">
          {error || "SESSION_NOT_FOUND"}
        </p>
        <button
          onClick={() => router.push("/classement")}
          className="border border-white/20 px-6 py-3 text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors"
        >
          Retour au classement
        </button>
      </main>
    );
  }

  const mapInfo = getMapInfo(session.mapName);
  const statusInfo = getStatusLabel(session.status);

  return (
    <main className="relative w-full bg-black text-white font-sans overflow-x-hidden pt-20">
      {/* HEADER NAVIGATION */}
      <div className="border-b border-white/20 bg-neutral-950 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/classement")}
          className="group flex items-center gap-2 text-[10px] font-mono uppercase text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à la base
        </button>
        <div className="h-4 w-px bg-white/10"></div>
        <span className="text-[10px] font-mono text-primary">
          SESSION_ID: {session.sessionId}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* SIDEBAR GAUCHE - INFO MAP & SESSION */}
        <div className="lg:col-span-4 border-r border-white/20 bg-neutral-900/20 flex flex-col">
          {/* Map Image Header */}
          <div className="relative h-64 lg:h-80 w-full overflow-hidden border-b border-white/20">
            <Image
              src={mapInfo.image}
              alt={mapInfo.title}
              fill
              className="object-cover transition-all duration-700 opacity-60 hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span
                className={`inline-block px-2 py-1 text-[9px] font-bold uppercase mb-2 border border-current ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
              <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-1">
                {mapInfo.title}
              </h1>
              <p className="text-[10px] font-mono text-white/50 uppercase max-w-xs">
                {mapInfo.description}
              </p>
            </div>
          </div>

          {/* Session Meta Data */}
          <div className="p-8 space-y-8 flex-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono text-white/40 uppercase flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> DATE
                </span>
                <span className="text-sm font-bold">
                  {formatDate(session.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono text-white/40 uppercase flex items-center gap-2">
                  <Clock className="w-3 h-3" /> DURÉE
                </span>
                <span className="text-sm font-bold">
                  {session.duration ? formatDuration(session.duration) : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono text-white/40 uppercase flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> SECTEUR
                </span>
                <span className="text-sm font-bold">SECTOR_01</span>
              </div>
            </div>

            {/* Vainqueur Highlight */}
            {session.winner && (
              <div className="bg-primary p-6 text-black mt-8">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest block mb-2">
                  VAINQUEUR DE LA SESSION
                </span>
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-black uppercase leading-none">
                      {session.winner.playerName}
                    </h2>
                    <p className="text-xs font-mono opacity-80">
                      {session.winner.totalScore.toLocaleString()} PTS
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENU PRINCIPAL - SCORES */}
        <div className="lg:col-span-8 bg-black p-8 lg:p-12">
          <SlideDown>
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/20">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                RAPPORT <span className="text-white/30">DE COURSE</span>
              </h2>
              <span className="text-[10px] font-mono text-white/40 uppercase">
                {session.scores.length} PARTICIPANTS ENREGISTRÉS
              </span>
            </div>

            {/* Tableau des scores */}
            <div className="w-full">
              <div className="grid grid-cols-6 gap-4 p-4 text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10">
                <div className="col-span-2">Pilote</div>
                <div className="text-right">Score Total</div>
                <div className="text-right">Distance</div>
                <div className="text-right">Survie</div>
                <div className="text-center">Statut</div>
              </div>

              {session.scores.map((score, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-6 gap-4 p-4 lg:p-6 border-b border-white/10 items-center hover:bg-white transition-colors duration-0 group ${session.winner?.playerNumber === score.playerNumber ? "bg-white/[0.02]" : ""}`}
                >
                  {/* Joueur */}
                  <div className="col-span-2 flex items-center gap-4">
                    <span
                      className={`text-lg font-black italic ${session.winner?.playerNumber === score.playerNumber ? "text-primary group-hover:text-black" : "text-white/20 group-hover:text-black/20"}`}
                    >
                      0{score.rank}
                    </span>
                    <div>
                      <div className="font-bold text-white group-hover:text-black uppercase text-sm lg:text-lg flex items-center gap-2">
                        {score.playerName}
                        {session.winner?.playerNumber ===
                          score.playerNumber && (
                          <Trophy className="w-3 h-3 text-primary group-hover:text-black" />
                        )}
                      </div>
                      <div className="text-[9px] font-mono text-white/40 group-hover:text-black/50 uppercase">
                        P{score.playerNumber} //{" "}
                        {score.rank === 1 ? "ALPHA" : "BETA"}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right font-black text-lg text-primary group-hover:text-black">
                    {score.totalScore.toLocaleString()}
                  </div>

                  {/* Stats */}
                  <div className="text-right font-mono text-xs text-white/70 group-hover:text-black/70">
                    {Math.round(score.distanceTraveled)}m
                  </div>
                  <div className="text-right font-mono text-xs text-white/70 group-hover:text-black/70">
                    {Math.round(score.survivalTime)}s
                  </div>

                  {/* Statut */}
                  <div className="flex justify-center">
                    {score.hasFinished ? (
                      <div className="w-6 h-6 bg-green-500/20 flex items-center justify-center border border-green-500/50">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-500/20 flex items-center justify-center border border-red-500/50">
                        <X className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SlideDown>
        </div>
      </div>
    </main>
  );
}
