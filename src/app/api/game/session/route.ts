import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Stockage temporaire en mémoire (en production, utilise Redis ou MySQL)
const gameSessions = new Map<
  string,
  {
    sessionId: string;
    player1: { pseudo: string | null; token: string; hasJoined: boolean };
    player2: { pseudo: string | null; token: string; hasJoined: boolean };
    createdAt: number;
    expiresAt: number;
  }
>();

// Nettoie les sessions expirées toutes les minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of gameSessions.entries()) {
    if (session.expiresAt < now) {
      gameSessions.delete(sessionId);
    }
  }
}, 60000);

export async function POST(request: NextRequest) {
  try {
    // Générer un ID de session unique
    const sessionId = randomBytes(16).toString("hex");

    // Générer des tokens uniques pour chaque joueur
    const player1Token = randomBytes(16).toString("hex");
    const player2Token = randomBytes(16).toString("hex");

    // Créer la session (expire dans 30 minutes)
    const session = {
      sessionId,
      player1: { pseudo: null, token: player1Token, hasJoined: false },
      player2: { pseudo: null, token: player2Token, hasJoined: false },
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
    };

    // Sauvegarder la session
    gameSessions.set(sessionId, session);

    console.log(`Nouvelle session créée: ${sessionId}`);

    // Générer les URLs
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const player1JoinUrl = `${baseUrl}/game/join?session=${sessionId}&player=1&token=${player1Token}`;
    const player2JoinUrl = `${baseUrl}/game/join?session=${sessionId}&player=2&token=${player2Token}`;

    const player1QRCodeUrl = `${baseUrl}/api/game/qrcode?url=${encodeURIComponent(
      player1JoinUrl
    )}`;
    const player2QRCodeUrl = `${baseUrl}/api/game/qrcode?url=${encodeURIComponent(
      player2JoinUrl
    )}`;

    return NextResponse.json(
      {
        success: true,
        sessionId,
        player1Url: player1JoinUrl,
        player2Url: player2JoinUrl,
        player1QRCode: player1QRCodeUrl,
        player2QRCode: player2QRCodeUrl,
        expiresIn: 1800,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur création session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Export pour utilisation par d'autres routes
export { gameSessions };
