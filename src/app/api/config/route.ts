import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.globalSettings.findUnique({
      where: { id: 1 }
    });

    // Initialiser si n'existe pas
    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: {
          id: 1,
          registrationsOpen: true
        }
      });
    }

    return NextResponse.json({ 
      registrationsOpen: settings.registrationsOpen 
    });
  } catch (error) {
    console.error("Erreur récupération config:", error);
    // Par défaut on ouvre si erreur db pour éviter blocage total, ou l'inverse selon politique de sécurité.
    // Ici on ferme par sécurité.
    return NextResponse.json({ registrationsOpen: false });
  }
}
