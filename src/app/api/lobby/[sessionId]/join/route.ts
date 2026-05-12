import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await ctx.params;
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const pseudo: string = (body?.pseudo ?? session.user.name ?? "Player2").toString().slice(0, 24);

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

  await prisma.gameSession.update({
    where: { id: gs.id },
    data: { player2Pseudo: pseudo },
  });

  return NextResponse.json({
    sessionId: gs.sessionId,
    player2Token: gs.player2Token,
  });
}
