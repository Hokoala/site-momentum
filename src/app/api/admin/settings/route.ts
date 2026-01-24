import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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

  try {
    let settings = await prisma.globalSettings.findUnique({
      where: { id: 1 }
    });

    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: { id: 1, registrationsOpen: true }
      });
    }

    return NextResponse.json({
      settings
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur récupération paramètres" },
      { status: 500 }
    );
  }
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
    const { registrationsOpen } = body;

    const settings = await prisma.globalSettings.upsert({
      where: { id: 1 },
      update: {
        registrationsOpen: registrationsOpen
      },
      create: {
        id: 1,
        registrationsOpen: registrationsOpen !== undefined ? registrationsOpen : true
      }
    });

    console.log("Paramètres globaux mis à jour par", session.user.email, settings);

    return NextResponse.json({
      message: "Paramètres mis à jour avec succès",
      settings
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des paramètres" },
      { status: 500 }
    );
  }
}
