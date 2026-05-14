import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await ctx.params;
  const gs = await prisma.gameSession.findUnique({
    where: { sessionId },
    select: {
      status: true,
      player1Joined: true,
      player2Joined: true,
      player1Pseudo: true,
      player2Pseudo: true,
    },
  });
  if (!gs) {
    return NextResponse.json({ error: "session-not-found" }, { status: 404 });
  }
  return NextResponse.json(gs);
}
