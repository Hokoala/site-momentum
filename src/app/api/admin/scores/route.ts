import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// PUT: Mettre à jour un score
export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { scoreId, totalScore, distanceTraveled, survivalTime, collectiblesCollected } = body;

    if (!scoreId) {
      return NextResponse.json(
        { error: "ID de score requis" },
        { status: 400 }
      );
    }

    const updatedScore = await prisma.score.update({
      where: { id: scoreId },
      data: {
        totalScore: totalScore !== undefined ? parseInt(totalScore) : undefined,
        distanceTraveled: distanceTraveled !== undefined ? parseFloat(distanceTraveled) : undefined,
        survivalTime: survivalTime !== undefined ? parseFloat(survivalTime) : undefined,
        collectiblesCollected: collectiblesCollected !== undefined ? parseInt(collectiblesCollected) : undefined,
      },
    });

    return NextResponse.json({ success: true, score: updatedScore });
  } catch (error) {
    console.error("Erreur mise à jour score:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
