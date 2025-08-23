import { Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AuthService } from "./auth.service";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "./auth.schema";

const authService = new AuthService();

export class AuthController {
  async register(c: Context): Promise<Response> {
    try {
      const input = c.req.valid("json");
      const { user, tokens } = await authService.registerUser(input);

      return c.json({ user, ...tokens }, 201);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }

  async login(c: Context): Promise<Response> {
    try {
      const input = c.req.valid("json");
      const { user, tokens } = await authService.loginUser(input);
      return c.json({ user, ...tokens }, 200);
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }

  async refresh(c: Context): Promise<Response> {
    try {
      const { refreshToken } = c.req.valid("json");
      const tokens = await authService.refreshTokens(refreshToken);
      return c.json(tokens, 200);
    } catch (error) {
      return c.json({ error: error.message }, 401);
    }
  }

  async logout(c: Context): Promise<Response> {
    try {
      const { refreshToken } = c.req.valid("json");
      await authService.logoutUser(refreshToken);

      return c.json({ message: "Logout successful" });
    } catch (error) {
      return c.json({ error: error.message }, 400);
    }
  }
}
