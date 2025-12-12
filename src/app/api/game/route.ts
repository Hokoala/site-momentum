import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Route API pour la communication avec Unity
 * Gère la lecture et l'écriture des données du jeu
 *
 * GET  - Public : lecture des paramètres et stats
 * POST - Sécurisé par JWT Bearer token
 *f
 * Authentification POST :
 * Header "Authorization: Bearer <jwt_token>"
 * Token obtenu via /api/auth/token ou /api/token/public
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Route GET - Lecture des paramètres du jeu (PUBLIC)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parametre = searchParams.get("parametre");

  if (parametre === "lecture") {
    // TODO: Récupérer les paramètres depuis MySQL
    const gameSettings = {
      difficulte: "normal",
      vitesseJeu: 1.0,
      dureeJour: 30,
      dureeNuit: 15,
    };

    return NextResponse.json(
      {
        message: "Lecture des paramètres du jeu",
        parametres: gameSettings,
      },
      { headers: corsHeaders }
    );
  }

  return NextResponse.json(
    { error: "Paramètre invalide" },
    { status: 400, headers: corsHeaders }
  );
}

// Route POST - Écriture des scores (SÉCURISÉE PAR JWT BEARER)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation JWT Bearer avec Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        {
          error: "Authentification requise",
          message:
            "Fournissez un JWT Bearer token dans le header Authorization",
        },
        { status: 401, headers: corsHeaders }
      );
    }

    const { action, scores, playerData } = body;
    const userId = session.user.id;
    const userEmail = session.user.email;

    if (action === "save_score") {
      // TODO: Sauvegarder les scores dans MySQL
      console.log(
        `[JWT Bearer] Sauvegarde des scores pour user ${userEmail}:`,
        scores
      );

      return NextResponse.json(
        {
          success: true,
          message: "Scores sauvegardés avec succès",
          userId,
          data: scores,
        },
        { headers: corsHeaders }
      );
    }

    if (action === "save_player_data") {
      // TODO: Sauvegarder les données joueur dans MySQL
      console.log(
        `[JWT Bearer] Sauvegarde des données pour ${userEmail}:`,
        playerData
      );

      return NextResponse.json(
        {
          success: true,
          message: "Données joueur sauvegardées",
          userId,
          data: playerData,
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Action invalide" },
      { status: 400, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur POST /api/game:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Route OPTIONS pour CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
