"use client";

import SlideDown from "@/components/SlideDown";
import { useState, useEffect, useMemo } from "react";

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

// Configuration du tri
interface SortConfig {
    key: keyof ScoreEntry;
    direction: 'asc' | 'desc';
}

export default function StatisticsPage() {
    const [selectedMap, setSelectedMap] = useState<string | null>(null);
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(false);

    // État par défaut : trié par totalScore en descendant
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'totalScore',
        direction: 'desc'
    });

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
                // Réinitialiser le tri par défaut lors du chargement d'une nouvelle map
                setSortConfig({ key: 'totalScore', direction: 'desc' });
            }
        } catch (error) {
            console.error("Error fetching scores:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour gérer le clic sur un en-tête
    const handleSort = (key: keyof ScoreEntry) => {
        let direction: 'asc' | 'desc' = 'desc';

        // Si on clique sur la colonne déjà active, on inverse l'ordre
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }

        setSortConfig({ key, direction });
    };

    // Calcul des scores triés (utilise useMemo pour optimiser)
    const sortedScores = useMemo(() => {
        const sorted = [...scores];

        sorted.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    }, [scores, sortConfig]);

    // Petit composant helper pour afficher la flèche de tri
    const SortIcon = ({ columnKey }: { columnKey: keyof ScoreEntry }) => {
        if (sortConfig.key !== columnKey) return <span className="text-white/20 ml-1">↕</span>;
        return <span className="text-[#C0FE04] ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    // Helper pour rendre un header cliquable
    const TableHeader = ({ label, sortKey, align = "left" }: { label: string, sortKey: keyof ScoreEntry, align?: string }) => (
        <div
            onClick={() => handleSort(sortKey)}
            className={`col-span-2 text-${align} cursor-pointer hover:text-[#C0FE04] transition-colors select-none flex items-center justify-${align === 'right' ? 'end' : align === 'center' ? 'center' : 'start'}`}
        >
            {label}
            <SortIcon columnKey={sortKey} />
        </div>
    );

    return (
        <main className="relative w-full bg-black overflow-x-hidden">
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
                                    {/* En-têtes du tableau avec tri */}
                                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/50 font-bold text-sm uppercase">
                                        <div className="col-span-1">#</div>
                                        <div className="col-span-3">Joueur</div>

                                        {/* Colonnes triables */}
                                        <TableHeader label="Score" sortKey="totalScore" align="right" />
                                        <TableHeader label="Distance" sortKey="distanceTraveled" align="right" />
                                        <TableHeader label="Temps" sortKey="survivalTime" align="right" />
                                        <TableHeader label="Fini" sortKey="hasFinished" align="center" />
                                    </div>

                                    {/* Liste des scores triés */}
                                    {sortedScores.map((score, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-white hover:bg-white/5 transition-colors items-center">
                                            <div className="col-span-1 font-bold text-[#C0FE04]">
                                                {/* Note: L'index affiché est basé sur le tri actuel.
                            Si tu veux garder le rang "absolu", il faudrait le calculer avant le tri */}
                                                {index + 1}
                                            </div>
                                            <div className="col-span-3 font-bold">{score.playerName}</div>
                                            <div className="col-span-2 text-right text-[#C0FE04]">{score.totalScore.toLocaleString()}</div>
                                            <div className="col-span-2 text-right">{Math.round(score.distanceTraveled)}m</div>
                                            <div className="col-span-2 text-right">{Math.round(score.survivalTime)}s</div>
                                            <div className="col-span-2 text-center">
                                                {score.hasFinished ? (
                                                    <span className="text-green-500 font-bold" title="Terminé">✓</span>
                                                ) : (
                                                    <span className="text-red-500 font-bold" title="Échoué">✗</span>
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