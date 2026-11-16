import type { RefreshRepository } from "../../domain/refresh-session/repository";
import type { UserRepositoryContract } from "../../domain/user/repository";
import type {
    PasswordHasher,
    TokenSigner,
    UserService,
    TokenVerifier,
    RefreshTokenHasher,
} from "./user.types";

export function createAuthService(
    repository: UserRepositoryContract,
    passwordHasher: PasswordHasher,
    tokenSigner: TokenSigner,
    tokenVerifier: TokenVerifier,
    tokens: RefreshTokenHasher,
    sessions: RefreshRepository
): UserService {
    return {
        async register(input) {
            const { email, password } = input;
            const passwordHash = await passwordHasher.hash(password);
            const user = await repository.createUser({
                email: email.trim().toLowerCase(),
                hashPassword: passwordHash,
            });
            return {
                id: user.id,
                email: user.email,
            };
        },
        async login(input) {
            const { email, password } = input;
            const user = await repository.getUserByEmail(email.trim().toLowerCase());
            if (!user || !(await passwordHasher.verify(user.hashPassword, password))) {
                throw new Error("Invalid credentials");
            }
            const refreshToken = tokenSigner.signRefreshToken(user.id);
            await sessions.create({
                userId: user.id,
                tokenHash: tokens.hash(refreshToken),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            return {
                user: {
                    id: user.id,
                    email: user.email,
                },
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: refreshToken,
            };
        },
        async refresh(refreshToken) {
            const userId = tokenVerifier.verifyRefreshToken(refreshToken);
            const oldHash = tokens.hash(refreshToken);
            const session = await sessions.getByHash(oldHash);
            if (!session || session.userId !== userId || session.expiresAt <= new Date()) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }
            const user = await repository.getUserById(userId);
            if (!user) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }
            const newRefreshToken = tokenSigner.signRefreshToken(user.id);
            const isChanged = await sessions.rotate(
                oldHash,
                tokens.hash(newRefreshToken),
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            );
            if (!isChanged) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }
            return {
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: newRefreshToken,
            };
        },
        async logout(refreshToken) {
            if (!refreshToken) return;
            await sessions.deleteByHash(tokens.hash(refreshToken));
        },
        async me(id) {
            const user = await repository.getUserById(id);
            if (!user) {
                throw new Error("UNAUTHORIZED");
            }
            return {
                id: user.id,
                email: user.email,
            };
        },
    };
}