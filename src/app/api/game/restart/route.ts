import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * POST /api/game/restart - Relance une partie sur la même session
 * Garde les mêmes pseudos mais remet le status à "playing"
 * Body: { sessionId, mapName? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, mapName } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Récupérer la session
    const session = await prisma.gameSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Vérifier si la session a expiré
    if (session.expiresAt < new Date()) {
      await prisma.gameSession.delete({ where: { sessionId } });
      return NextResponse.json(
        { error: "Session expirée" },
        { status: 410, headers: corsHeaders }
      );
    }

    // On peut relancer une partie terminée ou en cours
    if (session.status !== "playing" && session.status !== "finished") {
      return NextResponse.json(
        {
          error: "La session doit être en cours ou terminée pour être relancée",
          status: session.status,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Relancer la partie (remet le status à "playing")
    const updatedSession = await prisma.gameSession.update({
      where: { sessionId },
      data: {
        status: "playing",
        mapName: mapName || session.mapName || "default",
        startedAt: new Date(),
        finishedAt: null,
      },
    });

    console.log(`🔄 Partie relancée: ${sessionId}`);
    console.log(`   Joueur 1: ${updatedSession.player1Pseudo}`);
    console.log(`   Joueur 2: ${updatedSession.player2Pseudo}`);
    console.log(`   Map: ${updatedSession.mapName}`);

    return NextResponse.json(
      {
        success: true,
        message: "Partie relancée",
        session: {
          sessionId: updatedSession.sessionId,
          status: updatedSession.status,
          mapName: updatedSession.mapName,
          startedAt: updatedSession.startedAt,
          player1: {
            pseudo: updatedSession.player1Pseudo,
          },
          player2: {
            pseudo: updatedSession.player2Pseudo,
          },
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur relance partie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la relance de la partie" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
