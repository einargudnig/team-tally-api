import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env";

export interface JWTPayload {
  sub: string; // UserId
  email: string;
  name: string;
  iat?: number; // Issued at timestamp
  exp?: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export async function generateTokens(payload: JWTPayload): Promise<Tokens> {
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const iat = Math.floor(Date.now() / 1000);

  // Generate access token (short-lived)
  const accessToken = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(env.JWT_ACCESS_EXPIRY)
    .sign(secret);

  // Generate refresh token (long-lived)
  const refreshToken = await new SignJWT({ sub: payload.sub })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(env.JWT_REFRESH_EXPIRY)
    .sign(secret);

  return { accessToken, refreshToken };
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function refreshTokens(refreshToken: string): Promise<Tokens> {
  try {
    // Verify the refresh token
    const payload = await verifyToken(refreshToken);

    if (!payload.sub) {
      throw new Error("Invalid refresh token");
    }

    // Fetch user from database to get fresh data
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate new token pair
    return generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    throw new Error("Failed to refresh tokens");
  }
}
