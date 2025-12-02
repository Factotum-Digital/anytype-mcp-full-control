import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("31009"),
  ANYTYPE_API_URL: z.string().default("http://localhost:31009/v1"),
  ANYTYPE_API_KEY: z.string().min(1, "ANYTYPE_API_KEY is required"),
  ANYTYPE_API_VERSION: z.string().default("2025-05-20"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  RATE_LIMIT_WINDOW_MS: z.string().default("900000"), // 15 minutes
  RATE_LIMIT_MAX: z.string().default("100"),
});

// Validate environment variables
const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error("❌ Invalid environment variables:", envVars.error.format());
  process.exit(1);
}

// Export config
export const config = {
  env: envVars.data.NODE_ENV,
  port: parseInt(envVars.data.PORT, 10),
  anytype: {
    apiUrl: envVars.data.ANYTYPE_API_URL,
    apiKey: envVars.data.ANYTYPE_API_KEY,
    apiVersion: envVars.data.ANYTYPE_API_VERSION,
  },
  logger: {
    level: envVars.data.LOG_LEVEL,
  },
  rateLimit: {
    windowMs: parseInt(envVars.data.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(envVars.data.RATE_LIMIT_MAX, 10),
  },
} as const;
