export const env = {
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/teamtally",

  JWT_SECRET:
    process.env.JWT_SECRET || "your-default-jwt-secret-key-for-development",
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
};

if (env.NODE_ENV === "production") {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET environment variable is required in production",
    );
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required in production",
    );
  }
}
