import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";

const app = new Hono();

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors());

app.route("/auth", authRoutes);

// Health check endpoint
app.get("/", (c) =>
  c.json({ status: "ok", message: "Team Tally API is running" }),
);

// Start server
console.log(`Starting server in ${env.NODE_ENV}
mode on port ${env.PORT}`);

export default {
  port: env.PORT,
  fetch: app.fetch,
};
