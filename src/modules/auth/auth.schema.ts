import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type LogoutInput = z.infer<typeof logoutSchema>;
