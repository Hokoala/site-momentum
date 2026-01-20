"use client";

import SlideDown from "@/components/SlideDown";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  History,
  Settings,
  ChevronDown,
  Trophy,
  Medal,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  globalRank: number;
  playerName: string;
  playerNumber: number;
  totalScore: number;
  distanceTraveled: number;
  survivalTime: number;
  collectiblesCollected: number;
  hasFinished: boolean;
  mapName: string | null;
  sessionId: string;
  timestamp: string;
}

interface LeaderboardStats {
  totalPlayers: number;
  averageScore: number;
  averageSurvivalTime: number;
  averageDistance: number;
  highestScore: number;
  longestSurvival: number;
  longestDistance: number;
}

interface GameSession {
  sessionId: string;
  status: string;
  mapName: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  player1Pseudo: string | null;
  player2Pseudo: string | null;
  player1Joined: boolean;
  player2Joined: boolean;
  winner: {
    playerName: string;
    playerNumber: number;
    totalScore: number;
  } | null;
}

interface Filters {
  mapName: string;
  period: string;
  sortBy: string;
  hasFinished: string;
  playerName: string;
}

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "history">(
    "leaderboard"
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [filters, setFilters] = useState<Filters>({
    mapName: "",
    period: "all",
    sortBy: "totalScore",
    hasFinished: "",
    playerName: "",
  });

  const maps = [
    { name: "", displayName: "Toutes les cartes" },
    { name: "main", displayName: "Main Arena" },
  ];

  const periods = [
    { value: "all", label: "Tout le temps" },
    { value: "today", label: "Aujourd'hui" },
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
  ];

  const sortOptions = [
    { value: "totalScore", label: "Score" },
    { value: "survivalTime", label: "Temps de survie" },
    { value: "distanceTraveled", label: "Distance" },
    { value: "collectiblesCollected", label: "Collectibles" },
  ];

  useEffect(() => {
    if (activeTab === "leaderboard") {
      fetchLeaderboard();
    } else {
      fetchRecentGames();
    }
  }, [activeTab, filters]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("sortBy", filters.sortBy);
      params.set("order", "desc");

      if (filters.mapName) params.set("mapName", filters.mapName);
      if (filters.period !== "all") params.set("period", filters.period);
      if (filters.hasFinished) params.set("hasFinished", filters.hasFinished);
      if (filters.playerName) params.set("playerName", filters.playerName);

      const response = await fetch(`/api/scores/leaderboard?${params}`);
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.leaderboard);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentGames = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/game/history?limit=20&status=finished");
      const data = await response.json();
      if (data.success) {
        setRecentGames(data.sessions);
      }
    } catch (error) {
      console.error("Error fetching recent games:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return (
          <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs">
            En attente
          </span>
        );
      case "playing":
        return (
          <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-xs">
            En cours
          </span>
        );
      case "finished":
        return (
          <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">
            Terminée
          </span>
        );
      default:
        return null;
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "text-yellow-400 text-2xl";
    if (rank === 2) return "text-gray-300 text-xl";
    if (rank === 3) return "text-amber-600 text-xl";
    return "text-white/70";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return `#${rank}`;
  };

  const resetFilters = () => {
    setFilters({
      mapName: "",
      period: "all",
      sortBy: "totalScore",
      hasFinished: "",
      playerName: "",
    });
  };

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      <section
        id="Statistics"
        className="relative w-full min-h-screen bg-black py-20 px-6 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <SlideDown>
            <h2 className="text-4xl md:text-7xl text-white font-bold uppercase mb-8">
              Statistiques
            </h2>
          </SlideDown>

          {/* Onglets */}
          <SlideDown delay={0.1}>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                  activeTab === "leaderboard"
                    ? "bg-[#C0FE04] text-black"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <Globe className="w-5 h-5" />
                Classement Mondial
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                  activeTab === "history"
                    ? "bg-[#C0FE04] text-black"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <History className="w-5 h-5" />
                Historique
              </button>
            </div>
          </SlideDown>

          {/* Contenu Classement Mondial */}
          {activeTab === "leaderboard" && (
            <>
              {/* Stats globales */}
              {stats && (
                <SlideDown delay={0.15}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#C0FE04]/20 to-[#C0FE04]/5 border border-[#C0FE04]/30 rounded-xl p-4">
                      <div className="text-white/50 text-xs uppercase mb-1">
                        Joueurs
                      </div>
                      <div className="text-3xl font-bold text-[#C0FE04]">
                        {stats.totalPlayers}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-white/50 text-xs uppercase mb-1">
                        Meilleur Score
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {stats.highestScore.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-white/50 text-xs uppercase mb-1">
                        Score Moyen
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {stats.averageScore.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-white/50 text-xs uppercase mb-1">
                        Plus longue survie
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(stats.longestSurvival)}s
                      </div>
                    </div>
                  </div>
                </SlideDown>
              )}

              {/* Filtres */}
              <SlideDown delay={0.2}>
                <div className="mb-6">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Filtres</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showFilters && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Recherche joueur */}
                        <div>
                          <label className="block text-white/50 text-xs uppercase mb-2">
                            Rechercher un joueur
                          </label>
                          <input
                            type="text"
                            value={filters.playerName}
                            onChange={(e) =>
                              setFilters({ ...filters, playerName: e.target.value })
                            }
                            placeholder="Nom du joueur..."
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:border-[#C0FE04] focus:outline-none transition-colors"
                          />
                        </div>

                        {/* Carte */}
                        <div>
                          <label className="block text-white/50 text-xs uppercase mb-2">
                            Carte
                          </label>
                          <select
                            value={filters.mapName}
                            onChange={(e) =>
                              setFilters({ ...filters, mapName: e.target.value })
                            }
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#C0FE04] focus:outline-none transition-colors"
                          >
                            {maps.map((map) => (
                              <option key={map.name} value={map.name}>
                                {map.displayName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Période */}
                        <div>
                          <label className="block text-white/50 text-xs uppercase mb-2">
                            Période
                          </label>
                          <select
                            value={filters.period}
                            onChange={(e) =>
                              setFilters({ ...filters, period: e.target.value })
                            }
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#C0FE04] focus:outline-none transition-colors"
                          >
                            {periods.map((period) => (
                              <option key={period.value} value={period.value}>
                                {period.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Trier par */}
                        <div>
                          <label className="block text-white/50 text-xs uppercase mb-2">
                            Trier par
                          </label>
                          <select
                            value={filters.sortBy}
                            onChange={(e) =>
                              setFilters({ ...filters, sortBy: e.target.value })
                            }
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#C0FE04] focus:outline-none transition-colors"
                          >
                            {sortOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* A terminé */}
                        <div>
                          <label className="block text-white/50 text-xs uppercase mb-2">
                            Statut
                          </label>
                          <select
                            value={filters.hasFinished}
                            onChange={(e) =>
                              setFilters({ ...filters, hasFinished: e.target.value })
                            }
                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#C0FE04] focus:outline-none transition-colors"
                          >
                            <option value="">Tous</option>
                            <option value="true">Terminé ✓</option>
                            <option value="false">Non terminé ✗</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={resetFilters}
                          className="text-white/50 hover:text-white text-sm transition-colors"
                        >
                          Réinitialiser les filtres
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SlideDown>

              {/* Tableau du classement */}
              <SlideDown delay={0.25}>
                {loading ? (
                  <div className="text-white text-center py-10">
                    Chargement...
                  </div>
                ) : leaderboard.length > 0 ? (
                  <div className="bg-white/5 border border-white/20 rounded-xl overflow-hidden">
                    {/* En-têtes */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/50 font-bold text-xs uppercase">
                      <div className="col-span-1">Rang</div>
                      <div className="col-span-3">Joueur</div>
                      <div className="col-span-2 text-right">Score</div>
                      <div className="col-span-2 text-right">Distance</div>
                      <div className="col-span-2 text-right">Temps</div>
                      <div className="col-span-1 text-center">Fini</div>
                      <div className="col-span-1 text-center">Détails</div>
                    </div>

                    {/* Lignes */}
                    {leaderboard.map((entry) => (
                      <div
                        key={`${entry.sessionId}-${entry.playerNumber}`}
                        className={`grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center ${
                          entry.rank <= 3 ? "bg-white/[0.02]" : ""
                        }`}
                      >
                        {/* Rang */}
                        <div
                          className={`col-span-1 font-bold ${getRankStyle(
                            entry.rank
                          )}`}
                        >
                          {getRankIcon(entry.rank)}
                        </div>

                        {/* Joueur */}
                        <div className="col-span-3">
                          <div className="font-bold text-white">
                            {entry.playerName}
                          </div>
                          <div className="text-white/40 text-xs">
                            {entry.mapName || "Default"}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="col-span-2 text-right">
                          <span
                            className={`font-bold ${
                              entry.rank <= 3 ? "text-[#C0FE04]" : "text-white"
                            }`}
                          >
                            {entry.totalScore.toLocaleString()}
                          </span>
                        </div>

                        {/* Distance */}
                        <div className="col-span-2 text-right text-white/70">
                          {Math.round(entry.distanceTraveled)}m
                        </div>

                        {/* Temps */}
                        <div className="col-span-2 text-right text-white/70">
                          {Math.round(entry.survivalTime)}s
                        </div>

                        {/* Fini */}
                        <div className="col-span-1 flex justify-center">
                          {entry.hasFinished ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>

                        {/* Lien détails */}
                        <div className="col-span-1 flex justify-center">
                          <Link
                            href={`/statistiques/${entry.sessionId}`}
                            className="text-white/30 hover:text-[#C0FE04] transition-colors"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/50 text-center py-10 border border-white/10 rounded-xl">
                    Aucun score trouvé avec ces filtres.
                  </div>
                )}
              </SlideDown>
            </>
          )}

          {/* Contenu Historique */}
          {activeTab === "history" && (
            <SlideDown delay={0.2}>
              {loading ? (
                <div className="text-white text-center py-10">Chargement...</div>
              ) : recentGames.length > 0 ? (
                <div className="space-y-4">
                  {recentGames.map((game) => (
                    <Link
                      key={game.sessionId}
                      href={`/statistiques/${game.sessionId}`}
                      className="block"
                    >
                      <div className="bg-white/5 border border-white/20 rounded-lg p-6 hover:border-[#C0FE04] transition-all cursor-pointer group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Info principale */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusBadge(game.status)}
                              <span className="text-white/50 text-sm">
                                {formatDate(game.createdAt)}
                              </span>
                            </div>
                            <h3 className="text-xl text-white font-bold group-hover:text-[#C0FE04] transition-colors">
                              {game.mapName || "Default Map"}
                            </h3>
                          </div>

                          {/* Joueurs */}
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-white/50 text-xs uppercase mb-1">
                                Joueur 1
                              </div>
                              <div
                                className={`font-bold flex items-center gap-1 ${
                                  game.winner?.playerNumber === 1
                                    ? "text-[#C0FE04]"
                                    : "text-white"
                                }`}
                              >
                                {game.player1Pseudo || "—"}
                                {game.winner?.playerNumber === 1 && (
                                  <Trophy className="w-4 h-4" />
                                )}
                              </div>
                            </div>

                            <div className="text-white/30 text-2xl font-bold">
                              VS
                            </div>

                            <div className="text-center">
                              <div className="text-white/50 text-xs uppercase mb-1">
                                Joueur 2
                              </div>
                              <div
                                className={`font-bold flex items-center gap-1 ${
                                  game.winner?.playerNumber === 2
                                    ? "text-[#C0FE04]"
                                    : "text-white"
                                }`}
                              >
                                {game.player2Pseudo || "—"}
                                {game.winner?.playerNumber === 2 && (
                                  <Trophy className="w-4 h-4" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Score gagnant */}
                          {game.winner && (
                            <div className="text-right">
                              <div className="text-white/50 text-xs uppercase mb-1">
                                Score gagnant
                              </div>
                              <div className="text-2xl font-bold text-[#C0FE04]">
                                {game.winner.totalScore.toLocaleString()}
                              </div>
                            </div>
                          )}

                          {/* Flèche */}
                          <div className="text-white/30 group-hover:text-[#C0FE04] transition-colors">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-white/50 text-center py-10 border border-white/10 rounded-lg">
                  Aucune partie enregistrée pour le moment.
                </div>
              )}
            </SlideDown>
          )}
        </div>
      </section>
    </main>
  );
}
