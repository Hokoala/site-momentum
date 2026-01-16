import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * GET /api/scores/leaderboard - Classement mondial avec filtres avancés
 * Query params:
 *   - limit: nombre max de scores (défaut: 50)
 *   - offset: pagination (défaut: 0)
 *   - mapName: filtre par carte
 *   - sortBy: champ de tri (totalScore, survivalTime, distanceTraveled, collectiblesCollected) - défaut: totalScore
 *   - order: asc ou desc (défaut: desc)
 *   - hasFinished: true/false - filtre les joueurs qui ont terminé ou non
 *   - minScore: score minimum
 *   - maxScore: score maximum
 *   - playerName: recherche par nom de joueur (partiel)
 *   - period: today, week, month, all (défaut: all)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Paramètres de pagination
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Paramètres de tri
    const sortBy = searchParams.get("sortBy") || "totalScore";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    // Filtres
    const mapName = searchParams.get("mapName");
    const hasFinished = searchParams.get("hasFinished");
    const minScore = searchParams.get("minScore");
    const maxScore = searchParams.get("maxScore");
    const playerName = searchParams.get("playerName");
    const period = searchParams.get("period") || "all";

    // Construire le filtre
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Filtre par map
    if (mapName) {
      where.gameSession = { mapName };
    }

    // Filtre par hasFinished
    if (hasFinished !== null && hasFinished !== undefined) {
      where.hasFinished = hasFinished === "true";
    }

    // Filtre par score min/max
    if (minScore || maxScore) {
      where.totalScore = {};
      if (minScore) where.totalScore.gte = parseInt(minScore);
      if (maxScore) where.totalScore.lte = parseInt(maxScore);
    }

    // Recherche par nom de joueur
    if (playerName) {
      where.playerName = { contains: playerName };
    }

    // Filtre par période
    if (period !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }

      where.createdAt = { gte: startDate };
    }

    // Champs de tri valides
    const validSortFields = ["totalScore", "survivalTime", "distanceTraveled", "collectiblesCollected", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "totalScore";

    // Récupérer les scores
    const scores = await prisma.score.findMany({
      where,
      orderBy: { [sortField]: order },
      skip: offset,
      take: limit,
      include: {
        gameSession: {
          select: {
            sessionId: true,
            mapName: true,
            finishedAt: true,
            player1Pseudo: true,
            player2Pseudo: true,
          },
        },
      },
    });

    // Compter le total pour la pagination
    const total = await prisma.score.count({ where });

    // Calculer le rang global pour chaque score
    const rankedScores = await Promise.all(
      scores.map(async (s, index) => {
        // Calculer le rang réel basé sur le nombre de scores supérieurs
        const betterScores = await prisma.score.count({
          where: {
            ...where,
            totalScore: { gt: s.totalScore },
          },
        });

        return {
          rank: betterScores + 1,
          globalRank: offset + index + 1, // Position dans la liste actuelle
          playerName: s.playerName,
          playerNumber: s.playerNumber,
          totalScore: s.totalScore,
          distanceTraveled: s.distanceTraveled,
          survivalTime: s.survivalTime,
          collectiblesCollected: s.collectiblesCollected,
          hasFinished: s.hasFinished,
          mapName: s.gameSession.mapName,
          sessionId: s.gameSession.sessionId,
          timestamp: s.createdAt.toISOString(),
        };
      })
    );

    // Statistiques globales
    const stats = await prisma.score.aggregate({
      where,
      _avg: {
        totalScore: true,
        survivalTime: true,
        distanceTraveled: true,
        collectiblesCollected: true,
      },
      _max: {
        totalScore: true,
        survivalTime: true,
        distanceTraveled: true,
      },
      _count: true,
    });

    return NextResponse.json(
      {
        success: true,
        leaderboard: rankedScores,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
        stats: {
          totalPlayers: stats._count,
          averageScore: Math.round(stats._avg.totalScore || 0),
          averageSurvivalTime: Math.round(stats._avg.survivalTime || 0),
          averageDistance: Math.round(stats._avg.distanceTraveled || 0),
          highestScore: stats._max.totalScore || 0,
          longestSurvival: stats._max.survivalTime || 0,
          longestDistance: stats._max.distanceTraveled || 0,
        },
        filters: {
          mapName,
          hasFinished: hasFinished === "true" ? true : hasFinished === "false" ? false : null,
          period,
          sortBy: sortField,
          order,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur récupération leaderboard:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
