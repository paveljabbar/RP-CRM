import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface EnvConfig {
  PORT: number;
  JWT_SECRET: string;
  CLIENT_URL: string;
  DATABASE_URL: string;
  NODE_ENV: string;
}

/**
 * Validate and parse environment variables
 */
export function validateEnv(): EnvConfig {
  const requiredVars = ["DATABASE_URL", "JWT_SECRET"];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
      "Please create a .env file with all required variables."
    );
  }

  return {
    PORT: parseInt(process.env.PORT || "4000", 10),
    JWT_SECRET: process.env.JWT_SECRET!,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV || "development",
  };
}

/**
 * Validated environment configuration
 */
export const env = validateEnv();
