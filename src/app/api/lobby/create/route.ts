import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

function generateSessionId(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const pseudo: string = (body?.pseudo ?? session.user.name ?? "Player1").toString().slice(0, 24);

  const gameSession = await prisma.gameSession.create({
    data: {
      sessionId: generateSessionId(),
      player1Token: generateToken(),
      player2Token: generateToken(),
      player1Pseudo: pseudo,
      status: "waiting",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  return NextResponse.json({
    sessionId: gameSession.sessionId,
    player1Token: gameSession.player1Token,
    inviteUrl: `/play/${gameSession.sessionId}?role=join`,
    playUrl: `/play/${gameSession.sessionId}?role=host`,
  });
}
