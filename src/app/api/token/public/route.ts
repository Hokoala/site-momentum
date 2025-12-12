import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Route publique pour obtenir un token JWT anonyme
 * Permet à Unity d'obtenir un token sans créer de compte utilisateur
 *
 * ATTENTION : Cette approche crée un utilisateur temporaire pour chaque device
 * Pour un vrai projet, préférez l'authentification utilisateur classique
 */
export async function POST(request: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const body = await request.json();
    const { gameSecret, deviceId } = body;

    // Vérifier la clé secrète du jeu
    if (gameSecret !== process.env.API_SECRET_KEY) {
      return NextResponse.json(
        { error: "Clé secrète invalide" },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!deviceId) {
      return NextResponse.json(
        { error: "deviceId requis" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Créer ou récupérer un utilisateur anonyme pour ce device
    const anonymousEmail = `unity_${deviceId}@anonymous.local`;
    const anonymousPassword = `${gameSecret}_${deviceId}`;

    try {
      // Tenter de se connecter avec cet utilisateur
      const signInResponse = await auth.api.signInEmail({
        body: {
          email: anonymousEmail,
          password: anonymousPassword,
        },
      });

      // Obtenir le JWT depuis la session
      const token = signInResponse?.token;

      if (!token) {
        throw new Error("Pas de token dans la réponse");
      }

      console.log(`Token réutilisé pour device: ${deviceId}`);

      return NextResponse.json(
        {
          success: true,
          token,
          expiresIn: 7 * 24 * 60 * 60, // 7 jours
          message: "Token obtenu avec succès",
          deviceId,
        },
        { headers: corsHeaders }
      );

    } catch (signInError) {
      // L'utilisateur n'existe pas, le créer
      try {
        const signUpResponse = await auth.api.signUpEmail({
          body: {
            email: anonymousEmail,
            password: anonymousPassword,
            name: `Unity Device ${deviceId.substring(0, 8)}`,
          },
        });

        const token = signUpResponse?.token;

        if (!token) {
          throw new Error("Pas de token dans la réponse signup");
        }

        console.log(`Nouvel utilisateur anonyme créé pour device: ${deviceId}`);

        return NextResponse.json(
          {
            success: true,
            token,
            expiresIn: 7 * 24 * 60 * 60,
            message: "Token créé avec succès",
            deviceId,
            newUser: true,
          },
          { headers: corsHeaders }
        );

      } catch (signUpError) {
        console.error("Erreur création utilisateur anonyme:", signUpError);
        throw signUpError;
      }
    }

  } catch (error) {
    console.error("Erreur génération token public:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la génération du token",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
