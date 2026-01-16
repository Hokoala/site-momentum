import { prisma } from "./prisma";

export interface GameSessionData {
  sessionId: string;
  player1: { pseudo: string | null; token: string; hasJoined: boolean };
  player2: { pseudo: string | null; token: string; hasJoined: boolean };
  createdAt: Date;
  expiresAt: Date;
}

export async function createGameSession(
  sessionId: string,
  player1Token: string,
  player2Token: string,
  expiresAt: Date
): Promise<GameSessionData> {
  const session = await prisma.gameSession.create({
    data: {
      sessionId,
      player1Token,
      player2Token,
      expiresAt,
    },
  });

  return {
    sessionId: session.sessionId,
    player1: {
      pseudo: session.player1Pseudo,
      token: session.player1Token,
      hasJoined: session.player1Joined,
    },
    player2: {
      pseudo: session.player2Pseudo,
      token: session.player2Token,
      hasJoined: session.player2Joined,
    },
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  };
}

export async function getGameSession(
  sessionId: string
): Promise<GameSessionData | null> {
  const session = await prisma.gameSession.findUnique({
    where: { sessionId },
  });

  if (!session) return null;

  return {
    sessionId: session.sessionId,
    player1: {
      pseudo: session.player1Pseudo,
      token: session.player1Token,
      hasJoined: session.player1Joined,
    },
    player2: {
      pseudo: session.player2Pseudo,
      token: session.player2Token,
      hasJoined: session.player2Joined,
    },
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  };
}

export async function updatePlayerPseudo(
  sessionId: string,
  playerNumber: 1 | 2,
  pseudo: string
): Promise<GameSessionData | null> {
  const updateData =
    playerNumber === 1
      ? { player1Pseudo: pseudo, player1Joined: true }
      : { player2Pseudo: pseudo, player2Joined: true };

  const session = await prisma.gameSession.update({
    where: { sessionId },
    data: updateData,
  });

  return {
    sessionId: session.sessionId,
    player1: {
      pseudo: session.player1Pseudo,
      token: session.player1Token,
      hasJoined: session.player1Joined,
    },
    player2: {
      pseudo: session.player2Pseudo,
      token: session.player2Token,
      hasJoined: session.player2Joined,
    },
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  };
}

export async function deleteGameSession(sessionId: string): Promise<void> {
  await prisma.gameSession.delete({
    where: { sessionId },
  });
}

export async function cleanExpiredSessions(): Promise<number> {
  const result = await prisma.gameSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
}
