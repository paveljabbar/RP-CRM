import { env } from "./env";

export const config = {
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: "1h",
  clientUrl: env.CLIENT_URL,
  bcryptSaltRounds: 10,
  nodeEnv: env.NODE_ENV,
} as const;
