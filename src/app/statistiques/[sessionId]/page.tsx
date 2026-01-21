"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SlideDown from "@/components/SlideDown";
import Image from "next/image";
import { Trophy, Check, X, ArrowLeft } from "lucide-react";

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
    title: "Main Arena",
    image: "/assets/map.png",
    description: "L'arène principale avec des néons et des courses à haute vitesse",
  },
  default: {
    title: "Default Map",
    image: "/assets/screen1.png",
    description: "La carte par défaut du jeu",
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
        `/api/game/details?sessionId=${encodeURIComponent(sessionId)}`
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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "waiting":
        return { label: "En attente", color: "text-yellow-500" };
      case "playing":
        return { label: "En cours", color: "text-blue-500" };
      case "finished":
        return { label: "Terminée", color: "text-green-500" };
      default:
        return { label: status, color: "text-white" };
    }
  };

  const getMapInfo = (mapName: string | null) => {
    if (!mapName) return mapConfig.default;
    return mapConfig[mapName] || mapConfig.default;
  };

  if (loading) {
    return (
      <main className="relative w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="relative w-full min-h-screen bg-black py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl text-red-500 font-bold mb-4">Erreur</h1>
          <p className="text-white/70 mb-8">{error || "Session non trouvée"}</p>
          <button
            onClick={() => router.push("/statistiques")}
            className="text-[#C0FE04] hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" /> Retour aux statistiques
          </button>
        </div>
      </main>
    );
  }

  const mapInfo = getMapInfo(session.mapName);
  const statusInfo = getStatusLabel(session.status);

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      <section className="relative w-full min-h-screen bg-black py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Bouton retour */}
          <button
            onClick={() => router.push("/statistiques")}
            className="mb-8 text-white hover:text-[#C0FE04] transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Retour aux statistiques
          </button>

          {/* Header avec image de la map */}
          <SlideDown>
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={mapInfo.image}
                alt={mapInfo.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 bg-white/10 ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
                <h1 className="text-4xl md:text-6xl text-white font-bold">
                  {mapInfo.title}
                </h1>
                <p className="text-white/70 mt-2">{mapInfo.description}</p>
              </div>
            </div>
          </SlideDown>

          {/* Infos de la session */}
          <SlideDown delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 border border-white/20 rounded-lg p-6">
                <h3 className="text-white/50 text-sm uppercase mb-2">
                  Session ID
                </h3>
                <p className="text-white font-mono text-sm">
                  {session.sessionId.substring(0, 16)}...
                </p>
              </div>
              <div className="bg-white/5 border border-white/20 rounded-lg p-6">
                <h3 className="text-white/50 text-sm uppercase mb-2">
                  Date de création
                </h3>
                <p className="text-white">{formatDate(session.createdAt)}</p>
              </div>
              <div className="bg-white/5 border border-white/20 rounded-lg p-6">
                <h3 className="text-white/50 text-sm uppercase mb-2">Durée</h3>
                <p className="text-white">
                  {session.duration
                    ? formatDuration(session.duration)
                    : "N/A"}
                </p>
              </div>
            </div>
          </SlideDown>

          {/* Joueurs */}
          <SlideDown delay={0.2}>
            <h2 className="text-2xl text-white font-bold mb-6">Joueurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Joueur 1 */}
              <div
                className={`bg-white/5 border rounded-lg p-6 ${
                  session.winner?.playerNumber === 1
                    ? "border-[#C0FE04]"
                    : "border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/50 text-sm uppercase">
                    Joueur 1
                  </span>
                  {session.winner?.playerNumber === 1 && (
                    <span className="bg-[#C0FE04] text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> GAGNANT
                    </span>
                  )}
                </div>
                <h3 className="text-2xl text-white font-bold mb-2">
                  {session.players.player1.pseudo || "Non défini"}
                </h3>
                <span
                  className={`text-sm flex items-center gap-1 ${
                    session.players.player1.joined
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {session.players.player1.joined ? (
                    <>
                      <Check className="w-4 h-4" /> Connecté
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" /> Non connecté
                    </>
                  )}
                </span>
                {/* Score du joueur 1 */}
                {session.scores.find((s) => s.playerNumber === 1) && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-3xl text-[#C0FE04] font-bold">
                      {session.scores
                        .find((s) => s.playerNumber === 1)
                        ?.totalScore.toLocaleString()}
                    </div>
                    <div className="text-white/50 text-sm">points</div>
                  </div>
                )}
              </div>

              {/* Joueur 2 */}
              <div
                className={`bg-white/5 border rounded-lg p-6 ${
                  session.winner?.playerNumber === 2
                    ? "border-[#C0FE04]"
                    : "border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/50 text-sm uppercase">
                    Joueur 2
                  </span>
                  {session.winner?.playerNumber === 2 && (
                    <span className="bg-[#C0FE04] text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> GAGNANT
                    </span>
                  )}
                </div>
                <h3 className="text-2xl text-white font-bold mb-2">
                  {session.players.player2.pseudo || "Non défini"}
                </h3>
                <span
                  className={`text-sm flex items-center gap-1 ${
                    session.players.player2.joined
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {session.players.player2.joined ? (
                    <>
                      <Check className="w-4 h-4" /> Connecté
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" /> Non connecté
                    </>
                  )}
                </span>
                {/* Score du joueur 2 */}
                {session.scores.find((s) => s.playerNumber === 2) && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-3xl text-[#C0FE04] font-bold">
                      {session.scores
                        .find((s) => s.playerNumber === 2)
                        ?.totalScore.toLocaleString()}
                    </div>
                    <div className="text-white/50 text-sm">points</div>
                  </div>
                )}
              </div>
            </div>
          </SlideDown>

          {/* Tableau des scores détaillés */}
          {session.scores.length > 0 && (
            <SlideDown delay={0.3}>
              <h2 className="text-2xl text-white font-bold mb-6">
                Détails des scores
              </h2>
              <div className="bg-white/5 border border-white/20 rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 text-white/50 font-bold text-sm uppercase">
                  <div>Joueur</div>
                  <div className="text-right">Score</div>
                  <div className="text-right">Distance</div>
                  <div className="text-right">Temps</div>
                  <div className="text-right">Collectibles</div>
                  <div className="text-center">Terminé</div>
                </div>
                {session.scores.map((score, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 p-4 border-b border-white/5 text-white hover:bg-white/5 transition-colors items-center"
                  >
                    <div className="font-bold flex items-center gap-2">
                      {score.playerName}
                      {session.winner?.playerNumber === score.playerNumber && (
                        <Trophy className="w-4 h-4 text-[#C0FE04]" />
                      )}
                    </div>
                    <div className="text-right text-[#C0FE04] font-bold">
                      {score.totalScore.toLocaleString()}
                    </div>
                    <div className="text-right">
                      {Math.round(score.distanceTraveled)}m
                    </div>
                    <div className="text-right">
                      {Math.round(score.survivalTime)}s
                    </div>
                    <div className="text-right">
                      {score.collectiblesCollected}
                    </div>
                    <div className="flex justify-center">
                      {score.hasFinished ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SlideDown>
          )}
        </div>
      </section>
    </main>
  );
}
