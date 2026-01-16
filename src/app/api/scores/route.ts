import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Interface pour typer les scores
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

// Stockage en mémoire des scores
// IMPORTANT: Pour la production, remplace ça par une vraie base de données (Prisma, MongoDB, etc.)
const scores: ScoreEntry[] = [];

/**
 * POST /api/scores - Sauvegarde un nouveau score
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("📊 Nouveau score reçu:", {
      joueur: data.playerName,
      score: data.totalScore,
      map: data.mapName,
    });

    // Validation des données
    if (!data.playerName || data.totalScore === undefined) {
      return NextResponse.json(
        { success: false, error: "Données invalides" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Crée l'entrée de score avec timestamp
    const scoreEntry: ScoreEntry = {
      playerName: data.playerName,
      playerID: data.playerID,
      mapName: data.mapName,
      totalScore: data.totalScore,
      distanceTraveled: data.distanceTraveled,
      survivalTime: data.survivalTime,
      collectiblesCollected: data.collectiblesCollected,
      hasFinished: data.hasFinished,
      timestamp: new Date().toISOString(),
    };

    // Ajoute le score
    scores.push(scoreEntry);

    // Trie les scores par ordre décroissant (meilleur score en premier)
    scores.sort((a, b) => b.totalScore - a.totalScore);

    console.log(`✅ Score sauvegardé! Total scores: ${scores.length}`);

    return NextResponse.json(
      {
        success: true,
        message: "Score sauvegardé avec succès",
        rank: scores.findIndex((s) => s === scoreEntry) + 1,
        totalScores: scores.length,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("❌ Erreur sauvegarde score:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * GET /api/scores - Récupère les scores
 * Query params:
 *   - mapName: filtre par nom de carte
 *   - limit: nombre max de scores à retourner (défaut: 10)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mapName = searchParams.get("mapName");
  const limit = parseInt(searchParams.get("limit") || "10");

  let filteredScores = scores;

  // Filtre par carte si spécifié
  if (mapName) {
    filteredScores = scores.filter((s) => s.mapName === mapName);
  }

  // Limite le nombre de résultats
  const limitedScores = filteredScores.slice(0, limit);

  return NextResponse.json(
    {
      success: true,
      scores: limitedScores,
      total: filteredScores.length,
    },
    { headers: corsHeaders }
  );
}

/**
 * OPTIONS /api/scores - Gère les requêtes CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
