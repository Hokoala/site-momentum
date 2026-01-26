import { NextRequest, NextResponse } from "next/server";
import {
  getGameSession,
  updatePlayerPseudo,
  deleteGameSession,
} from "@/lib/game-sessions";
import { validatePseudo, getErrorMessage } from "@/lib/pseudo-validator";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// GET - Unity récupère les pseudos
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId requis" },
      { status: 400, headers: corsHeaders }
    );
  }

  const session = await getGameSession(sessionId);

  if (!session) {
    return NextResponse.json(
      { error: "Session non trouvée ou expirée" },
      { status: 404, headers: corsHeaders }
    );
  }

  // Vérifier si la session a expiré
  if (session.expiresAt < new Date()) {
    await deleteGameSession(sessionId);
    return NextResponse.json(
      { error: "Session expirée" },
      { status: 410, headers: corsHeaders }
    );
  }

  return NextResponse.json(
    {
      success: true,
      player1: {
        pseudo: session.player1.pseudo,
        hasJoined: session.player1.hasJoined,
      },
      player2: {
        pseudo: session.player2.pseudo,
        hasJoined: session.player2.hasJoined,
      },
      bothReady:
        session.player1.pseudo !== null && session.player2.pseudo !== null,
    },
    { headers: corsHeaders }
  );
}

// POST - Le joueur entre son pseudo depuis le site web
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, playerToken, pseudo } = body;

    if (!sessionId || !playerToken || !pseudo) {
      return NextResponse.json(
        { error: "sessionId, playerToken et pseudo requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validation du pseudo (mots inappropriés, XSS, caractères spéciaux)
    const validation = validatePseudo(pseudo);
    if (!validation.isValid) {
      const errorMessage = validation.errors
        .map((err) => getErrorMessage(err, "fr"))
        .join(", ");
      console.log(`[VALIDATION] Pseudo rejeté: "${pseudo}" - Raisons: ${validation.errors.join(", ")}`);
      return NextResponse.json(
        { error: errorMessage, codes: validation.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Utiliser le pseudo sanitisé
    const safePseudo = validation.sanitizedPseudo;

    const session = await getGameSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session non trouvée ou expirée" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Vérifier le token et mettre à jour le pseudo
    let updatedSession;
    if (session.player1.token === playerToken) {
      updatedSession = await updatePlayerPseudo(sessionId, 1, safePseudo);
      console.log(`Joueur 1 a rejoint: ${safePseudo}`);
    } else if (session.player2.token === playerToken) {
      updatedSession = await updatePlayerPseudo(sessionId, 2, safePseudo);
      console.log(`Joueur 2 a rejoint: ${safePseudo}`);
    } else {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 401, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pseudo enregistré avec succès",
        bothReady:
          updatedSession?.player1.pseudo !== null &&
          updatedSession?.player2.pseudo !== null,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur sauvegarde pseudo:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde du pseudo" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
