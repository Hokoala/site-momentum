import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { jwtVerify } from "jose";

/**
 * Route API pour la communication avec Unity
 * Gère la lecture et l'écriture des données du jeu
 *
 * GET avec parametre=lecture (PUBLIC) :
 *   /api/game?parametre=lecture
 *   Retourne les paramètres du jeu
 *
 * GET avec parametre=ecriture (SÉCURISÉ PAR CLEFSECU) :
 *   /api/game?parametre=ecriture&clefsecu=VOTRE_CLE&valeur=contenuAecrire
 *   Écrit des données (requiert une clé de sécurité)
 *
 * POST - Sécurisé par JWT Bearer token (Better Auth ou Anonymous)
 *   Header "Authorization: Bearer <jwt_token>"
 *   Token obtenu via :
 *     - /api/auth/token (avec compte utilisateur)
 *     - /api/unity/auth (anonyme pour Unity)
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Route GET - Lecture/Écriture des paramètres du jeu
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parametre = searchParams.get("parametre");
  const clefsecu = searchParams.get("clefsecu");
  const valeur = searchParams.get("valeur");

  // Vérifier la clé de sécurité pour les opérations d'écriture
  const SECURITY_KEY = process.env.GAME_API_SECURITY_KEY;

  // Mode lecture (PUBLIC)
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

  // Mode écriture (SÉCURISÉ PAR CLEFSECU)
  if (parametre === "ecriture") {
    // Vérifier la clé de sécurité
    if (!clefsecu || clefsecu !== SECURITY_KEY) {
      return NextResponse.json(
        {
          error: "Clé de sécurité invalide ou manquante",
          message: "Vous devez fournir une clé de sécurité valide pour l'écriture"
        },
        { status: 401, headers: corsHeaders }
      );
    }

    // Vérifier que la valeur est fournie
    if (!valeur) {
      return NextResponse.json(
        {
          error: "Valeur manquante",
          message: "Le paramètre 'valeur' est requis pour l'écriture"
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // TODO: Sauvegarder la valeur dans MySQL
    console.log(`[API] Écriture de données: ${valeur}`);

    return NextResponse.json(
      {
        success: true,
        message: "Données écrites avec succès",
        valeurEcrite: valeur,
      },
      { headers: corsHeaders }
    );
  }

  return NextResponse.json(
    {
      error: "Paramètre invalide",
      message: "Le paramètre doit être 'lecture' ou 'ecriture'"
    },
    { status: 400, headers: corsHeaders }
  );
}

// Route POST - Écriture des scores (SÉCURISÉE PAR JWT BEARER)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Vérifier le token (Better Auth ou Anonymous)
    let userId: string;
    let userIdentifier: string;
    let isAnonymous = false;

    // Essayer d'abord l'authentification Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      // Utilisateur authentifié avec Better Auth
      userId = session.user.id;
      userIdentifier = session.user.email || session.user.id;
    } else {
      // Vérifier si c'est un token anonyme Unity
      const authHeader = request.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            error: "Authentification requise",
            message: "Fournissez un JWT Bearer token dans le header Authorization",
          },
          { status: 401, headers: corsHeaders }
        );
      }

      const token = authHeader.substring(7);
      try {
        const secret = new TextEncoder().encode(
          process.env.BETTER_AUTH_SECRET || "fallback-secret-key"
        );
        const { payload } = await jwtVerify(token, secret);

        if (payload.type === "anonymous") {
          // Token anonyme valide
          userId = `anonymous_${payload.deviceId}`;
          userIdentifier = payload.deviceId as string;
          isAnonymous = true;
        } else {
          throw new Error("Invalid token type");
        }
      } catch (error) {
        return NextResponse.json(
          {
            error: "Token invalide",
            message: "Le token JWT fourni n'est pas valide ou a expiré",
          },
          { status: 401, headers: corsHeaders }
        );
      }
    }

    const { action, scores, playerData } = body;

    if (action === "save_score") {
      // TODO: Sauvegarder les scores dans MySQL
      console.log(
        `[${isAnonymous ? "Anonymous" : "Authenticated"}] Sauvegarde des scores pour ${userIdentifier}:`,
        scores
      );

      return NextResponse.json(
        {
          success: true,
          message: "Scores sauvegardés avec succès",
          userId,
          isAnonymous,
          data: scores,
        },
        { headers: corsHeaders }
      );
    }

    if (action === "save_player_data") {
      // TODO: Sauvegarder les données joueur dans MySQL
      console.log(
        `[${isAnonymous ? "Anonymous" : "Authenticated"}] Sauvegarde des données pour ${userIdentifier}:`,
        playerData
      );

      return NextResponse.json(
        {
          success: true,
          message: "Données joueur sauvegardées",
          userId,
          isAnonymous,
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
