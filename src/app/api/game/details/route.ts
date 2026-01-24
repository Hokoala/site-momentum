import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * GET /api/game/details?sessionId=xxx - Récupère les détails complets d'une session de jeu
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Récupérer la session avec ses scores
    const session = await prisma.gameSession.findUnique({
      where: { sessionId },
      include: {
        scores: {
          orderBy: { totalScore: "desc" },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Calculer la durée de la partie
    let duration = null;
    if (session.startedAt && session.finishedAt) {
      duration = Math.round(
        (session.finishedAt.getTime() - session.startedAt.getTime()) / 1000
      );
    }

    // Déterminer le gagnant
    const winner =
      session.scores.length > 0
        ? session.scores.reduce((prev, current) =>
            prev.totalScore > current.totalScore ? prev : current
          )
        : null;

    return NextResponse.json(
      {
        success: true,
        session: {
          sessionId: session.sessionId,
          status: session.status,
          mapName: session.mapName,
          createdAt: session.createdAt.toISOString(),
          startedAt: session.startedAt?.toISOString() || null,
          finishedAt: session.finishedAt?.toISOString() || null,
          duration,
          players: {
            player1: {
              pseudo: session.player1Pseudo,
              joined: session.player1Joined,
            },
            player2: {
              pseudo: session.player2Pseudo,
              joined: session.player2Joined,
            },
          },
          scores: session.scores.map((s, index) => ({
            rank: index + 1,
            playerName: s.playerName,
            playerNumber: s.playerNumber,
            totalScore: s.totalScore,
            distanceTraveled: s.distanceTraveled,
            survivalTime: s.survivalTime,
            collectiblesCollected: s.collectiblesCollected,
            hasFinished: s.hasFinished,
          })),
          winner: winner
            ? {
                playerName: winner.playerName,
                playerNumber: winner.playerNumber,
                totalScore: winner.totalScore,
              }
            : null,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur récupération détails session:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
