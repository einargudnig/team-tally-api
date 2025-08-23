import { PrismaClient } from "@prisma/client";
import { generateTokens, verifyToken, Tokens } from "../../utils/jwt.utils";
import { hashPassword, verifyPassword } from "../../utils/password.utils";
import { RegisterInput, LoginInput } from "./auth.schema";

const prisma = new PrismaClient();

export class AuthService {
  async registerUser(
    userData: RegisterInput,
  ): Promise<{ user: any; tokens: Tokens }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        passwordHash: hashedPassword,
      },
    });

    const tokens = await generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  async loginUser(
    credentials: LoginInput,
  ): Promise<{ user: any; tokens: Tokens }> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordValid = await verifyPassword(
      credentials.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    const tokens = await generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    try {
      return await refreshTokens(refreshToken);
    } catch (error) {
      throw new Error("Invalid refresh tokens");
    }
  }

  async logoutUser(refreshToken: string): Promise<void> {
    try {
      await verifyToken(refreshToken);
    } catch (error) {
      throw new Error("Failed to logout");
    }
  }
}
