import type { UserService } from "../../../services/user/user.types.js";
import { AUTH_COOKIE } from "../../../shared/constants/auth.js";
import {
    clearAuthCookies,
    setUserCookies,
} from "../../cookies/auth-cookies.js";
import type { UserHandler } from "./user.types.js";

export function createUserHandler(service: UserService): UserHandler {
    return {
        async register(req, res) {
            try {
                const { email, password } = req.body;
                const user = await service.register({
                    email,
                    password,
                });
                res.status(201).json(user);
            } catch (error) {
                res.status(500).json(error);
            }
        },

        async login(req, res) {
            try {
                const { email, password } = req.body;
                const result = await service.login({
                    email,
                    password,
                });

                setUserCookies(res, {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                });

                res.status(200).json(result.user);
            } catch {
                res.status(500).json({ message: "Internal server error" });
            }
        },

        async refresh(req, res) {
            const refreshToken = req.cookies?.[AUTH_COOKIE.REFRESH_TOKEN];
            if (typeof refreshToken !== "string") {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            try {
                const tokens = await service.refresh(refreshToken);
                setUserCookies(res, tokens);
                res.status(200).json({ message: "Tokens updated" });
            } catch {
                res.status(401).json({ message: "Unauthorized" });
            }
        },

        async logout(req, res) {
            try {
                const token = req.cookies?.[AUTH_COOKIE.REFRESH_TOKEN];
                await service.logout(typeof token === "string" ? token : undefined);
                clearAuthCookies(res);
                res.status(200).json("Logged out!");
            } catch {
                res.status(500).json("Internal server error");
            }
        },

        async me(req, res) {
            try {
                const userId = res.locals.userId;
                if (!userId) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                const user = await service.me(userId);
                res.status(200).json(user);
            } catch {
                res.status(500).json({ message: "Internal server error!" });
            }
        },
    };
}