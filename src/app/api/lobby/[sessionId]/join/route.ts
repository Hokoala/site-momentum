import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function validatePseudo(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed.length < 1 || trimmed.length > 24) return null;
  return trimmed;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const pseudo = validatePseudo(body?.pseudo);
  if (!pseudo) {
    return NextResponse.json({ error: "invalid-pseudo" }, { status: 400 });
  }

  const gs = await prisma.gameSession.findUnique({ where: { sessionId } });
  if (!gs) {
    return NextResponse.json({ error: "session-not-found" }, { status: 404 });
  }
  if (gs.status !== "waiting") {
    return NextResponse.json({ error: "session-not-joinable" }, { status: 400 });
  }
  if (gs.player2Joined) {
    return NextResponse.json({ error: "session-full" }, { status: 400 });
  }

  const updateResult = await prisma.gameSession.updateMany({
    where: {
      id: gs.id,
      status: "waiting",
      player2Joined: false,
    },
    data: {
      player2Pseudo: pseudo,
      player2Joined: true,
    },
  });

  if (updateResult.count === 0) {
    return NextResponse.json({ error: "session-full" }, { status: 409 });
  }

  return NextResponse.json({
    sessionId: gs.sessionId,
    player2Token: gs.player2Token,
  });
}
