import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

function generateSessionId(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function validatePseudo(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed.length < 1 || trimmed.length > 24) return null;
  return trimmed;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pseudo = validatePseudo(body?.pseudo);
  if (!pseudo) {
    return NextResponse.json({ error: "invalid-pseudo" }, { status: 400 });
  }

  const gameSession = await prisma.gameSession.create({
    data: {
      sessionId: generateSessionId(),
      player1Token: generateToken(),
      player2Token: generateToken(),
      player1Pseudo: pseudo,
      status: "waiting",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  return NextResponse.json({
    sessionId: gameSession.sessionId,
    player1Token: gameSession.player1Token,
    inviteUrl: `/play/${gameSession.sessionId}?role=join`,
    playUrl: `/play/${gameSession.sessionId}?role=host`,
  });
}
