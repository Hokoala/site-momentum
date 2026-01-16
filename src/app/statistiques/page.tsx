"use client";

import SlideDown from "@/components/SlideDown";
import { useState, useEffect } from "react";

interface ScoreEntry {
  playerName: string;
  playerID: number;
  mapName: string;
  totalScore: number;
  distanceTraveled: number;
  survivalTime: number;
  collectiblesCollected: number;
  hasFinished: boolean;
  timestamp: string;
}

export default function StatisticsPage() {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(false);

  /*

  changer de true a false pour pouvoir faire en sorte que ce soit cliquable

  */
  const maps = [
    { id: "map1", name: "Cyber City", description: "Neon lights and high speed chases", available: true },
    { id: "map2", name: "MAP 2", description: "Coming soon...", available: false },
    { id: "map3", name: "MAP 3", description: "Coming soon...", available: false },
  ];

  useEffect(() => {
    if (selectedMap) {
      fetchScores(selectedMap);
    }
  }, [selectedMap]);

  const fetchScores = async (mapName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/scores?mapName=${encodeURIComponent(mapName)}&limit=50`);
      const data = await response.json();
      if (data.success) {
        setScores(data.scores);
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      {/* Section Statistics */}
      <section id="Statistics" className="relative w-full min-h-screen bg-black py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <SlideDown>
            <h2 className="text-4xl md:text-7xl text-white font-bold uppercase mb-16">
              Statistiques
            </h2>
          </SlideDown>

          {!selectedMap ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {maps.map((map, index) => (
                <SlideDown key={map.id} delay={index * 0.1}>
                  <div 
                    onClick={() => map.available && setSelectedMap(map.name)}
                    className={`bg-white/5 border border-white/20 p-8 transition-all duration-300 h-full group ${
                      map.available 
                        ? "hover:border-[#C0FE04] cursor-pointer" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <h3 className={`text-2xl font-bold transition-colors ${
                      map.available 
                        ? "text-white group-hover:text-[#C0FE04]" 
                        : "text-white/50"
                    }`}>
                      {map.name}
                    </h3>
                    <p className="text-white/70 mt-2">{map.description}</p>
                    <div className="mt-6 flex justify-end">
                      {map.available ? (
                        <span className="text-[#C0FE04] opacity-0 group-hover:opacity-100 transition-opacity">Voir les scores →</span>
                      ) : (
                        <span className="text-white/30 text-sm uppercase font-bold tracking-wider">Bientôt disponible</span>
                      )}
                    </div>
                  </div>
                </SlideDown>
              ))}
            </div>
          ) : (
            <div className="w-full">
              <button 
                onClick={() => setSelectedMap(null)}
                className="mb-8 text-white hover:text-[#C0FE04] transition-colors flex items-center gap-2"
              >
                ← Retour aux cartes
              </button>
              
              <h3 className="text-3xl text-[#C0FE04] font-bold mb-8">Scores pour {selectedMap}</h3>

              {loading ? (
                <div className="text-white text-center py-10">Chargement...</div>
              ) : scores.length > 0 ? (
                <div className="bg-white/5 border border-white/20 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/50 font-bold text-sm uppercase">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Joueur</div>
                    <div className="col-span-2 text-right">Score</div>
                    <div className="col-span-2 text-right">Distance</div>
                    <div className="col-span-2 text-right">Temps</div>
                    <div className="col-span-2 text-center">Fini</div>
                  </div>
                  
                  {scores.map((score, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-white hover:bg-white/5 transition-colors items-center">
                      <div className="col-span-1 font-bold text-[#C0FE04]">{index + 1}</div>
                      <div className="col-span-3 font-bold">{score.playerName}</div>
                      <div className="col-span-2 text-right text-[#C0FE04]">{score.totalScore.toLocaleString()}</div>
                      <div className="col-span-2 text-right">{Math.round(score.distanceTraveled)}m</div>
                      <div className="col-span-2 text-right">{Math.round(score.survivalTime)}s</div>
                      <div className="col-span-2 text-center">
                        {score.hasFinished ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/50 text-center py-10 border border-white/10 rounded-lg">
                  Aucun score enregistré pour cette carte.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
