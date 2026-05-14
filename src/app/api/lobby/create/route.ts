import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { generateGameCode } from "@/lib/game-code";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function validatePseudo(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed.length < 1 || trimmed.length > 24) return null;
  return trimmed;
}

// Retry on collision. With a 31^6 keyspace and a few concurrent sessions this
// should virtually never loop more than once, but the retry is cheap insurance
// against a unique-constraint failure surfacing to the player.
const MAX_CODE_GENERATION_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pseudo = validatePseudo(body?.pseudo);
  if (!pseudo) {
    return NextResponse.json({ error: "invalid-pseudo" }, { status: 400 });
  }

  for (let attempt = 0; attempt < MAX_CODE_GENERATION_ATTEMPTS; attempt++) {
    const code = generateGameCode();
    try {
      const gameSession = await prisma.gameSession.create({
        data: {
          sessionId: code,
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
        playUrl: `/play/${gameSession.sessionId}?role=host`,
      });
    } catch (err: unknown) {
      // Prisma surfaces unique-constraint violations as P2002; retry with a
      // fresh code. Rethrow anything else.
      const prismaCode = (err as { code?: string })?.code;
      if (prismaCode !== "P2002") throw err;
    }
  }

  return NextResponse.json(
    { error: "code-generation-failed" },
    { status: 500 }
  );
}
