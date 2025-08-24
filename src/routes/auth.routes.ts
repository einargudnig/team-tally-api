import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AuthController } from "../modules/auth/auth.controller";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../modules/auth/auth.schema";

const authController = new AuthController();
const authRoutes = new Hono();

// Register routes
authRoutes.post("/register", zValidator("json", registerSchema), (c) =>
  authController.register(c),
);
authRoutes.post("/login", zValidator("json", loginSchema), (c) =>
  authController.login(c),
);
authRoutes.post("/refresh", zValidator("json", refreshTokenSchema), (c) =>
  authController.refresh(c),
);
authRoutes.post("/logout", zValidator("json", logoutSchema), (c) =>
  authController.logout(c),
);

export default authRoutes;
