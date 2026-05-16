import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface PlayerScore {
  playerNumber: 1 | 2;
  totalScore: number;
  distanceTraveled?: number;
  survivalTime?: number;
  collectiblesCollected?: number;
  hasFinished?: boolean;
}

/**
 * POST /api/game/end - Termine une partie et sauvegarde les scores
 * Body: {
 *   sessionId: string,
 *   scores: [
 *     { playerNumber: 1, totalScore: number, ... },
 *     { playerNumber: 2, totalScore: number, ... }
 *   ]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, scores } = body as {
      sessionId: string;
      scores: PlayerScore[];
    };

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!scores || !Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json(
        { error: "scores requis (tableau)" },
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

    // En multijoueur le flux ne passe jamais par /api/game/start côté client — c'est
    // le serveur Colyseus qui pousse la session en "playing" via markGameSessionPlaying.
    // Si pour une raison quelconque ce passage n'a pas eu lieu (process pas redémarré,
    // race condition, erreur Prisma silencieuse), on refuse d'enregistrer les scores
    // ici ce qui est plus dommageable que d'accepter une session "waiting" qui s'est
    // visiblement bien déroulée jusqu'au end-of-match. L'identité de la session est
    // déjà validée par le findUnique sur sessionId ; le status sert juste à distinguer
    // les sessions en cours/terminées des sessions explicitement annulées.
    if (session.status === "cancelled" || session.status === "expired") {
      return NextResponse.json(
        {
          error: "La partie n'est plus active",
          status: session.status,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Rematch-safe + concurrency-safe : une session peut rejouer plusieurs parties et
    // les deux clients POSTent en fin de match quasi simultanément. On efface puis
    // recrée les scores et on marque la session terminée dans une seule transaction
    // pour éviter tout entrelacement delete/create entre deux requêtes concurrentes.
    const [createdScores, updatedSession] = await prisma.$transaction(async (tx) => {
      await tx.score.deleteMany({ where: { gameSessionId: session.id } });

      const created = await Promise.all(
        scores.map(async (score) => {
          const playerName =
            score.playerNumber === 1
              ? session.player1Pseudo
              : session.player2Pseudo;

          return tx.score.create({
            data: {
              playerName: playerName || `Joueur ${score.playerNumber}`,
              playerNumber: score.playerNumber,
              totalScore: score.totalScore,
              distanceTraveled: score.distanceTraveled || 0,
              survivalTime: score.survivalTime || 0,
              collectiblesCollected: score.collectiblesCollected || 0,
              hasFinished: score.hasFinished || false,
              gameSessionId: session.id,
            },
          });
        })
      );

      const updated = await tx.gameSession.update({
        where: { sessionId },
        data: { status: "finished", finishedAt: new Date() },
      });

      return [created, updated] as const;
    });

    console.log(`🏁 Partie terminée: ${sessionId}`);
    console.log(`   Scores sauvegardés: ${createdScores.length}`);

    // Calculer le classement des joueurs pour cette partie
    const sortedScores = createdScores.sort(
      (a, b) => b.totalScore - a.totalScore
    );
    const winner = sortedScores[0];

    return NextResponse.json(
      {
        success: true,
        message: "Partie terminée et scores sauvegardés",
        session: {
          sessionId: updatedSession.sessionId,
          status: updatedSession.status,
          mapName: updatedSession.mapName,
          startedAt: updatedSession.startedAt,
          finishedAt: updatedSession.finishedAt,
          player1Pseudo: updatedSession.player1Pseudo,
          player2Pseudo: updatedSession.player2Pseudo,
        },
        scores: createdScores.map((s) => ({
          playerName: s.playerName,
          playerNumber: s.playerNumber,
          totalScore: s.totalScore,
          distanceTraveled: s.distanceTraveled,
          survivalTime: s.survivalTime,
          collectiblesCollected: s.collectiblesCollected,
          hasFinished: s.hasFinished,
        })),
        winner: {
          playerName: winner.playerName,
          playerNumber: winner.playerNumber,
          totalScore: winner.totalScore,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur fin de partie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la fin de la partie" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
