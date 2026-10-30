import type { Response } from "express";
import type { UserService, UserTokens } from "../../../services/user/user.types";
import type { UserHandler } from "./user.types";

function setUserTokens(res: Response, tokens: UserTokens) {
    res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        path: "/"
    });
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/auth"
    });
}

export function createUserHandler(service: UserService): UserHandler {
    return {
        async register(req, res) {
            try {
                const { email, password } = req.body;
                const user = await service.register({
                    email,
                    password
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
                    password
                });
                
                setUserTokens(res, {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                });

                res.status(200).json(result.user);
            } catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        },

        async refresh(req, res) {
            const refreshToken = req.cookies?.refreshToken;
            if (typeof refreshToken !== "string") {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            try {
                const tokens = await service.refresh(refreshToken);
                setUserTokens(res, tokens);
                res.status(200).json({ message: "Tokens updated" });
            } catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        },

        async me(req, res) {
            try {
                const userId = res.locals.userId;
                const user = await service.me(userId);
                res.status(200).json(user);
            } catch (error) {
                res.status(500).json({ message: "Internal server error!" });
            }
        }
    };
}