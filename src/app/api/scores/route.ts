import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * GET /api/scores - Récupère les scores depuis la base de données
 * Query params:
 *   - mapName: filtre par nom de carte
 *   - limit: nombre max de scores à retourner (défaut: 10)
 *   - sessionId: filtre par session de jeu
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mapName = searchParams.get("mapName");
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Construire le filtre
    const where: {
      gameSession?: {
        mapName?: string;
        sessionId?: string;
      };
    } = {};

    if (mapName || sessionId) {
      where.gameSession = {};
      if (mapName) where.gameSession.mapName = mapName;
      if (sessionId) where.gameSession.sessionId = sessionId;
    }

    // Récupérer les scores triés par score décroissant
    const scores = await prisma.score.findMany({
      where,
      orderBy: { totalScore: "desc" },
      take: limit,
      include: {
        gameSession: {
          select: {
            sessionId: true,
            mapName: true,
            finishedAt: true,
          },
        },
      },
    });

    const total = await prisma.score.count({ where });

    return NextResponse.json(
      {
        success: true,
        scores: scores.map((s, index) => ({
          rank: index + 1,
          playerName: s.playerName,
          playerNumber: s.playerNumber,
          totalScore: s.totalScore,
          distanceTraveled: s.distanceTraveled,
          survivalTime: s.survivalTime,
          collectiblesCollected: s.collectiblesCollected,
          hasFinished: s.hasFinished,
          mapName: s.gameSession.mapName,
          timestamp: s.createdAt.toISOString(),
        })),
        total,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur récupération scores:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * POST /api/scores - Sauvegarde un score directement (sans session de jeu)
 * Utile pour les tests ou les parties solo
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
        { success: false, error: "playerName et totalScore requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Créer une session temporaire pour ce score
    const tempSession = await prisma.gameSession.create({
      data: {
        sessionId: `solo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        player1Token: "solo",
        player2Token: "solo",
        player1Pseudo: data.playerName,
        player1Joined: true,
        player2Joined: false,
        status: "finished",
        mapName: data.mapName || "default",
        startedAt: new Date(),
        finishedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Créer le score
    const score = await prisma.score.create({
      data: {
        playerName: data.playerName,
        playerNumber: 1,
        totalScore: data.totalScore,
        distanceTraveled: data.distanceTraveled || 0,
        survivalTime: data.survivalTime || 0,
        collectiblesCollected: data.collectiblesCollected || 0,
        hasFinished: data.hasFinished || false,
        gameSessionId: tempSession.id,
      },
    });

    // Calculer le rang
    const betterScores = await prisma.score.count({
      where: { totalScore: { gt: score.totalScore } },
    });
    const rank = betterScores + 1;

    const totalScores = await prisma.score.count();

    console.log(`✅ Score sauvegardé! Rang: ${rank}/${totalScores}`);

    return NextResponse.json(
      {
        success: true,
        message: "Score sauvegardé avec succès",
        rank,
        totalScores,
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
 * OPTIONS /api/scores - Gère les requêtes CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
