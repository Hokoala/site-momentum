"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  totalScore: number;
  mapName: string | null;
}

const MOCK_LEADERS: LeaderboardEntry[] = [
    { rank: 1, playerName: "NEON_RUNNER", totalScore: 125000, mapName: "Main Arena" },
    { rank: 2, playerName: "GHOST_X", totalScore: 98400, mapName: "Night City" },
    { rank: 3, playerName: "SPEED_DEMON", totalScore: 85200, mapName: "Main Arena" },
    { rank: 4, playerName: "PIXEL_ARTIST", totalScore: 72100, mapName: "Sector 7" },
    { rank: 5, playerName: "MOMENTUM_DEV", totalScore: 64000, mapName: "Debug Room" },
];

export default function HomeLeaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch("/api/scores/leaderboard?limit=5&order=desc&sortBy=totalScore");
        const data = await res.json();
        if (data.success && data.leaderboard.length > 0) {
          setLeaders(data.leaderboard);
        } else {
          setLeaders(MOCK_LEADERS);
        }
      } catch (error) {
        setLeaders(MOCK_LEADERS);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <section className="relative z-20 w-full bg-black border-t border-white/20">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* SIDEBAR - 03 // WORLD RANKING */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/20 p-6 md:p-8 flex flex-col bg-neutral-900/20">
            <div className="mb-auto">
                <span className="block text-primary text-[10px] font-mono mb-2 tracking-[0.2em] uppercase">
                    03 // Ranking
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase leading-none tracking-tighter text-white">
                    Hall of Fame
                </h2>
            </div>
            
            <div className="mt-12">
                <p className="text-white/40 text-[10px] font-mono leading-relaxed uppercase mb-6">
                    Data synchronization: active <br/>
                    Global node: stable
                </p>
                <Link 
                    href="/classement" 
                    className="inline-flex items-center gap-2 text-white border-b border-white/20 hover:border-primary hover:text-primary transition-all pb-1 text-[10px] font-bold uppercase tracking-widest group"
                >
                    Full Leaderboard <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>

        {/* LIST - TOP 5 */}
        <div className="lg:col-span-9 bg-black divide-y divide-white/10">
            {loading ? (
                <div className="p-12 text-white/20 font-mono text-[10px] animate-pulse uppercase">Syncing_Records...</div>
            ) : (
                leaders.map((entry, index) => (
                    <div 
                        key={index} 
                        className="group flex items-center justify-between p-4 md:p-6 hover:bg-white transition-colors duration-0"
                    >
                        <div className="flex items-center gap-6 md:gap-10">
                            <span className={`text-xl md:text-2xl font-black italic ${
                                index === 0 ? "text-primary group-hover:text-black" : "text-white/10 group-hover:text-black/20"
                            }`}>
                                0{index + 1}
                            </span>
                            <div>
                                <h3 className="text-sm md:text-lg font-bold uppercase text-white group-hover:text-black transition-colors flex items-center gap-2">
                                    {entry.playerName}
                                    {index === 0 && <Crown className="w-4 h-4 text-primary group-hover:text-black" />}
                                </h3>
                                <p className="text-[9px] font-mono text-white/30 group-hover:text-black/40 uppercase tracking-widest">
                                    NODE: {entry.mapName || "MAIN_ARENA"}
                                </p>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <span className="block text-sm md:text-xl font-black text-white group-hover:text-black tracking-tight">
                                {entry.totalScore.toLocaleString()}
                            </span>
                            <span className="text-[9px] font-mono text-primary group-hover:text-black/60 uppercase tracking-widest">POINTS</span>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </section>
  );
}