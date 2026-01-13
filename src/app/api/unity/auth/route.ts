import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

/**
 * Endpoint d'authentification anonyme pour Unity
 * Génère un token JWT temporaire sans nécessiter de compte utilisateur
 *
 * POST /api/unity/auth
 * Body: { deviceId: string, gameVersion?: string }
 *
 * Returns: { token: string, expiresIn: number }
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, gameVersion } = body;

    // Validation
    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json(
        { error: "deviceId is required and must be a string" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Générer un token JWT pour la session anonyme
    const secret = new TextEncoder().encode(
      process.env.BETTER_AUTH_SECRET || "fallback-secret-key"
    );

    const token = await new SignJWT({
      deviceId,
      gameVersion: gameVersion || "unknown",
      type: "anonymous",
      iat: Math.floor(Date.now() / 1000),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Token valide 24h
      .setIssuer(process.env.BETTER_AUTH_URL || "http://localhost:3000")
      .setAudience(process.env.BETTER_AUTH_URL || "http://localhost:3000")
      .sign(secret);

    return NextResponse.json(
      {
        success: true,
        token,
        expiresIn: 24 * 60 * 60, // 24 heures en secondes
        message: "Anonymous token generated successfully",
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error generating anonymous token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500, headers: corsHeaders }
    );
  }
}
