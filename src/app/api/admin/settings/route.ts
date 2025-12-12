import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Route protégée pour le back-office
 * Permet de modifier les paramètres du jeu
 * Nécessite une authentification
 */

export async function GET(request: NextRequest) {
  // Vérifier l'authentification
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Authentification requise" },
      { status: 401 }
    );
  }

  // TODO: Récupérer les paramètres depuis MySQL
  const gameSettings = {
    difficulte: "normal",
    vitesseJeu: 1.0,
    dureeJour: 30,
    dureeNuit: 15,
  };

  return NextResponse.json({
    message: "Paramètres du jeu",
    settings: gameSettings,
    user: session.user,
  });
}

export async function POST(request: NextRequest) {
  // Vérifier l'authentification
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé - Authentification requise" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { difficulte, vitesseJeu, dureeJour, dureeNuit } = body;

    // TODO: Sauvegarder les nouveaux paramètres dans MySQL
    console.log("Modification des paramètres par", session.user.email, body);

    return NextResponse.json({
      message: "Paramètres mis à jour avec succès",
      settings: { difficulte, vitesseJeu, dureeJour, dureeNuit },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des paramètres" },
      { status: 500 }
    );
  }
}
