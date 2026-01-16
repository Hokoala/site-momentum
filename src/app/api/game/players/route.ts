import { NextRequest, NextResponse } from "next/server";
import { gameSessions } from "../session/route";

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

  const session = gameSessions.get(sessionId);

  if (!session) {
    return NextResponse.json(
      { error: "Session non trouvée ou expirée" },
      { status: 404, headers: corsHeaders }
    );
  }

  // Vérifier si la session a expiré
  if (session.expiresAt < Date.now()) {
    gameSessions.delete(sessionId);
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

    const session = gameSessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session non trouvée ou expirée" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Vérifier le token et mettre à jour le pseudo
    if (session.player1.token === playerToken) {
      session.player1.pseudo = pseudo.trim();
      session.player1.hasJoined = true;
      console.log(`Joueur 1 a rejoint: ${pseudo}`);
    } else if (session.player2.token === playerToken) {
      session.player2.pseudo = pseudo.trim();
      session.player2.hasJoined = true;
      console.log(`Joueur 2 a rejoint: ${pseudo}`);
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
          session.player1.pseudo !== null && session.player2.pseudo !== null,
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
