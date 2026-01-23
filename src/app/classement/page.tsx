"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Trophy,
  ArrowRight,
  Crosshair,
  ChevronLeft,
  ChevronRight,
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

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "history">(
    "leaderboard",
  );

  // Data States
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameSession[]>([]);

  // UI States
  const [loading, setLoading] = useState(false);

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 20;

  // Filters
  const [filters, setFilters] = useState<Filters>({
    mapName: "",
    period: "all",
    sortBy: "totalScore",
    hasFinished: "",
    playerName: "",
  });

  const maps = [
    { name: "", displayName: "ALL MAPS" },
    { name: "main", displayName: "MAIN ARENA" },
  ];

  const periods = [
    { value: "all", label: "TOUT LE TEMPS" },
    { value: "today", label: "AUJOURD'HUI" },
    { value: "week", label: "CETTE SEMAINE" },
    { value: "month", label: "CE MOIS" },
  ];

  const sortOptions = [
    { value: "totalScore", label: "SCORE" },
    { value: "survivalTime", label: "SURVIVAL" },
    { value: "distanceTraveled", label: "DISTANCE" },
    { value: "collectiblesCollected", label: "COLLECTIBLES" },
  ];

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, activeTab]);

  useEffect(() => {
    if (activeTab === "leaderboard") {
      fetchLeaderboard();
    } else {
      fetchRecentGames();
    }
  }, [activeTab, filters, page]);

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const offset = (page - 1) * LIMIT;
        
        params.set("limit", LIMIT.toString());
        params.set("offset", offset.toString());
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
          if (data.pagination) {
              setTotalPages(Math.ceil(data.pagination.total / LIMIT) || 1);
          }
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
      // Note: Assuming similar pagination logic could be applied to history later
      const response = await fetch(
        `/api/game/history?limit=${LIMIT}&status=finished`,
      );
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
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resetFilters = () => {
    setFilters({
      mapName: "",
      period: "all",
      sortBy: "totalScore",
      hasFinished: "",
      playerName: "",
    });
    setPage(1);
  };

  return (
    <main className="relative w-full bg-black text-white font-sans overflow-x-hidden pt-15">
      {/* HEADER TECHNIQUE */}
      <div className="border-b border-white/20 bg-neutral-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[200px]">
          {/* Titre */}
          <div className="lg:col-span-8 p-8 md:p-12 flex flex-col justify-end border-b lg:border-b-0 lg:border-r border-white/20 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-[10px] font-mono text-white/30">
              PAGE_ID: LEADERBOARD
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-2">
              GLOBAL <br /> <span className="text-primary">RANKING</span>
            </h1>
          </div>

          {/* Stats Rapides */}
          <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-primary text-black">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest">
                Global Stats
              </span>
              <Crosshair className="w-5 h-5 animate-spin-slow" />
            </div>

            <div className="space-y-4 mt-8">
              <div>
                <p className="text-[10px] font-mono opacity-60 uppercase">
                  Total Players
                </p>
                <p className="text-4xl font-black tracking-tight">
                  {stats?.totalPlayers || 0}
                </p>
              </div>
              <div className="w-full h-px bg-black/20"></div>
              <div>
                <p className="text-[10px] font-mono opacity-60 uppercase">
                  Best Score
                </p>
                <p className="text-4xl font-black tracking-tight">
                  {stats?.highestScore.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* SIDEBAR FILTRES */}
        <div className="lg:col-span-3 border-r border-white/20 bg-neutral-900/20 p-6">
          <div className="sticky top-24 space-y-8">
            {/* Onglets */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`w-full py-4 px-6 text-left border text-xs font-bold uppercase tracking-widest transition-all duration-0 ${
                  activeTab === "leaderboard"
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/20 hover:border-white"
                }`}
              >
                [ Ranking ]
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`w-full py-4 px-6 text-left border text-xs font-bold uppercase tracking-widest transition-all duration-0 ${
                  activeTab === "history"
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/20 hover:border-white"
                }`}
              >
                [ History ]
              </button>
            </div>

            {/* Filtres Avancés */}
            {activeTab === "leaderboard" && (
              <div className="space-y-6 pt-6 border-t border-white/10">
                <h3 className="text-xs font-mono text-primary uppercase tracking-widest flex items-center gap-2">
                  <Settings className="w-3 h-3" /> Filters
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={filters.playerName}
                      onChange={(e) =>
                        setFilters({ ...filters, playerName: e.target.value })
                      }
                      placeholder="PLAYER NAME..."
                      className="w-full bg-black border border-white/20 p-3 text-xs text-white placeholder-white/20 focus:border-primary focus:outline-none uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-2">
                      Map
                    </label>
                    <select
                      value={filters.mapName}
                      onChange={(e) =>
                        setFilters({ ...filters, mapName: e.target.value })
                      }
                      className="w-full bg-black border border-white/20 p-3 text-xs text-white focus:border-primary focus:outline-none uppercase font-mono"
                    >
                      {maps.map((map) => (
                        <option key={map.name} value={map.name}>
                          {map.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({ ...filters, sortBy: e.target.value })
                      }
                      className="w-full bg-black border border-white/20 p-3 text-xs text-white focus:border-primary focus:outline-none uppercase font-mono"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="text-[10px] font-mono text-white/40 hover:text-white underline decoration-white/20 underline-offset-4"
                >
                  RESET_FILTERS
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TABLEAU */}
        <div className="lg:col-span-9 bg-black flex flex-col">
          <div className="flex-1">
            {activeTab === "leaderboard" ? (
              <div className="w-full">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/20 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Player / Map</div>
                  <div className="col-span-2 text-right">Score</div>
                  <div className="col-span-2 text-right">Stats</div>
                  <div className="col-span-2 text-right">Status</div>
                  <div className="col-span-1 text-center">Info</div>
                </div>

                {loading ? (
                  <div className="p-20 text-center text-white/30 font-mono text-xs animate-pulse">
                    LOADING_DATA...
                  </div>
                ) : leaderboard.length > 0 ? (
                  <>
                    {leaderboard.map((entry, index) => (
                      <div
                        key={`${entry.sessionId}-${entry.playerNumber}`}
                        className={`group grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-white/10 items-center transition-colors duration-0 hover:bg-white cursor-default ${index < 3 && page === 1 ? "bg-white/[0.02]" : ""}`}
                      >
                        {/* Rank */}
                        <div className="col-span-1 md:col-span-1 text-xl md:text-2xl font-black italic text-white/20 group-hover:text-black/20">
                          {entry.globalRank < 10
                            ? `0${entry.globalRank}`
                            : entry.globalRank}
                        </div>

                        {/* Joueur */}
                        <div className="col-span-6 md:col-span-4">
                          <div className="font-bold text-white group-hover:text-black uppercase text-sm md:text-lg flex items-center gap-2">
                            {entry.playerName}
                            {entry.rank === 1 && (
                              <Trophy className="w-4 h-4 text-primary group-hover:text-black" />
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-white/40 group-hover:text-black/50 uppercase mt-1">
                            {entry.mapName || "UNKNOWN_MAP"}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="col-span-3 md:col-span-2 text-right">
                          <span
                            className={`font-black text-lg md:text-xl group-hover:text-black ${entry.rank <= 3 && page === 1 ? "text-primary" : "text-white"}`}
                          >
                            {entry.totalScore.toLocaleString()}
                          </span>
                        </div>

                        {/* Stats (Hidden on mobile) */}
                        <div className="hidden md:block col-span-2 text-right font-mono text-xs text-white/60 group-hover:text-black/60">
                          {Math.round(entry.distanceTraveled)}m /{" "}
                          {Math.round(entry.survivalTime)}s
                        </div>

                        {/* Status (Hidden on mobile) */}
                        <div className="hidden md:flex col-span-2 justify-end items-center gap-2">
                          {entry.hasFinished ? (
                            <span className="text-[10px] font-bold text-black bg-primary px-2 py-1 uppercase">
                              Terminé
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-white/30 group-hover:text-black/30 uppercase">
                              Échoué
                            </span>
                          )}
                        </div>

                        {/* Link */}
                        <div className="col-span-2 md:col-span-1 flex justify-center">
                          <Link
                            href={`/classement/${entry.sessionId}`}
                            className="text-white/20 group-hover:text-black hover:scale-110 transition-transform"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-20 text-center text-white/30 font-mono text-xs border-b border-white/10">
                    NO DATA FOUND
                  </div>
                )}
              </div>
            ) : (
              // HISTORIQUE VIEW
              <div className="w-full">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/20 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-4">Map</div>
                  <div className="col-span-4">Joueurs</div>
                  <div className="col-span-2 text-right">Vainqueur</div>
                </div>

                {recentGames.map((game) => (
                  <Link
                    key={game.sessionId}
                    href={`/classement/${game.sessionId}`}
                    className="block group"
                  >
                    <div className="grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-white/10 items-center hover:bg-white transition-colors duration-0">
                      <div className="col-span-3 md:col-span-2 text-xs font-mono text-white/50 group-hover:text-black/50">
                        {formatDate(game.createdAt)}
                      </div>
                      <div className="col-span-9 md:col-span-4 font-bold text-white group-hover:text-black uppercase">
                        {game.mapName || "DEFAULT_MAP"}
                      </div>
                      <div className="hidden md:block col-span-4 text-xs font-mono text-white/70 group-hover:text-black/70">
                        {game.player1Pseudo || "P1"}{" "}
                        <span className="text-white/20 group-hover:text-black/20 mx-2">
                          VS
                        </span>{" "}
                        {game.player2Pseudo || "P2"}
                      </div>
                      <div className="hidden md:block col-span-2 text-right font-black text-primary group-hover:text-black">
                        {game.winner
                          ? game.winner.totalScore.toLocaleString()
                          : "-"}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {activeTab === "leaderboard" && totalPages > 1 && (
            <div className="p-6 border-t border-white/20 flex items-center justify-between bg-black">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                PAGE {page} / {totalPages}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-3 border border-white/20 hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-3 border border-white/20 hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
