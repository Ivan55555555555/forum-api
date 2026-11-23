import jwt from "jsonwebtoken";
import { randomUUID, createHash } from "node:crypto";
import type { TokenService } from "../services/user/user.types.js";

interface JwtSecrets {
  accessSecret: string;
  refreshSecret: string;
}

export function createTokenService(secrets: JwtSecrets): TokenService {
  return {
    signAccessToken(userId: number): string {
      return jwt.sign({}, secrets.accessSecret, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: "15m",
      });
    },

    signRefreshToken(userId: number): string {
      return jwt.sign({ type: "refresh" }, secrets.refreshSecret, {
        algorithm: "HS256",
        subject: String(userId),
        jwtid: randomUUID(),
        expiresIn: "7d",
      });
    },

    verifyAccessToken(token: string): number {
      try {
        const payload = jwt.verify(token, secrets.accessSecret, {
          algorithms: ["HS256"],
        });
        if (typeof payload === "string" || typeof payload.sub !== "string") {
          throw new Error();
        }
        return Number(payload.sub);
      } catch {
        throw new Error("INVALID_ACCESS_TOKEN");
      }
    },

    verifyRefreshToken(token: string): number {
      try {
        const payload = jwt.verify(token, secrets.refreshSecret, {
          algorithms: ["HS256"],
        });
        if (
          typeof payload === "string" ||
          typeof payload.sub !== "string" ||
          payload.type !== "refresh"
        ) {
          throw new Error();
        }
        return Number(payload.sub);
      } catch {
        throw new Error("INVALID_REFRESH_TOKEN");
      }
    },

    hash(token: string): string {
      return createHash("sha256").update(token).digest("hex");
    },
  };
}