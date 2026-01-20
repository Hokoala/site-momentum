import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * GET /api/game/history - Récupère l'historique des parties
 * Query params:
 *   - limit: nombre de parties à retourner (défaut: 10)
 *   - status: filtre par statut (waiting, playing, finished)
 *   - mapName: filtre par nom de carte
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const mapName = searchParams.get("mapName");

    // Construire le filtre
    const where: {
      status?: string;
      mapName?: string;
    } = {};

    if (status) where.status = status;
    if (mapName) where.mapName = mapName;

    // Récupérer les sessions avec leurs scores
    const sessions = await prisma.gameSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        scores: {
          orderBy: { totalScore: "desc" },
          take: 2,
        },
      },
    });

    const total = await prisma.gameSession.count({ where });

    return NextResponse.json(
      {
        success: true,
        sessions: sessions.map((s) => {
          // Trouver le gagnant
          const winner =
            s.scores.length > 0
              ? s.scores.reduce((prev, current) =>
                  prev.totalScore > current.totalScore ? prev : current
                )
              : null;

          return {
            sessionId: s.sessionId,
            status: s.status,
            mapName: s.mapName,
            createdAt: s.createdAt.toISOString(),
            startedAt: s.startedAt?.toISOString() || null,
            finishedAt: s.finishedAt?.toISOString() || null,
            player1Pseudo: s.player1Pseudo,
            player2Pseudo: s.player2Pseudo,
            player1Joined: s.player1Joined,
            player2Joined: s.player2Joined,
            winner: winner
              ? {
                  playerName: winner.playerName,
                  playerNumber: winner.playerNumber,
                  totalScore: winner.totalScore,
                }
              : null,
          };
        }),
        total,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur récupération historique:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
