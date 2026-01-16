import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * POST /api/game/start - Démarre une partie
 * Body: { sessionId, mapName? }
 *
 * Vérifie que les deux joueurs ont rejoint, puis passe la session en status "playing"
 * Retourne les infos de la session (pseudos des joueurs)
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

    // Vérifier que les deux joueurs ont rejoint
    if (!session.player1Joined || !session.player2Joined) {
      return NextResponse.json(
        {
          error: "Les deux joueurs doivent rejoindre avant de démarrer",
          player1Joined: session.player1Joined,
          player2Joined: session.player2Joined,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Vérifier que la partie n'est pas déjà démarrée
    if (session.status !== "waiting") {
      return NextResponse.json(
        {
          error: "La partie a déjà été démarrée ou est terminée",
          status: session.status,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Démarrer la partie
    const updatedSession = await prisma.gameSession.update({
      where: { sessionId },
      data: {
        status: "playing",
        mapName: mapName || "default",
        startedAt: new Date(),
      },
    });

    console.log(`🎮 Partie démarrée: ${sessionId}`);
    console.log(`   Joueur 1: ${updatedSession.player1Pseudo}`);
    console.log(`   Joueur 2: ${updatedSession.player2Pseudo}`);
    console.log(`   Map: ${updatedSession.mapName}`);

    return NextResponse.json(
      {
        success: true,
        message: "Partie démarrée",
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
    console.error("Erreur démarrage partie:", error);
    return NextResponse.json(
      { error: "Erreur lors du démarrage de la partie" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
