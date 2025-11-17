export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "secret-key",
  jwtExpiresIn: "1h",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  bcryptSaltRounds: 10,
} as const;
