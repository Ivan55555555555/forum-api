import type { Response } from "express";
import type { UserTokens } from "../../services/user/user.types.js";
import { AUTH_COOKIE } from "../../shared/constants/auth.js";
import { ROUTES } from "../../shared/constants/routes.js";

export function setUserCookies(res: Response, tokens: UserTokens) {
  res.cookie(AUTH_COOKIE.ACCESS_TOKEN, tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });
  res.cookie(AUTH_COOKIE.REFRESH_TOKEN, tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: ROUTES.AUTH,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(AUTH_COOKIE.ACCESS_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  res.clearCookie(AUTH_COOKIE.REFRESH_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: ROUTES.AUTH,
  });
}