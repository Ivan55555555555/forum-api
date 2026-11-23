import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined`);
  }
  return value;
}

function positiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") {
    return fallback;
  }
  const value = Number(raw);
  if (value <= 0 || !Number.isSafeInteger(value)) {
    throw new Error(`${name} must be positive integer`);
  }
  return value;
}

export const config = {
  port: positiveInt("PORT", 8000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  databaseUrl: required("DATABASE_URL"),
  passwordPepper: Buffer.from(required("PASSWORD_PEPPER"), "hex"),
  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
  },
};

export type Config = typeof config;