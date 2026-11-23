import type {
    AuthServiceDependencies,
    UserService,
} from "./user.types.js";

export function createAuthService({
    users,
    sessions,
    passwords,
    tokens,
}: AuthServiceDependencies): UserService {
    return {
        async register(input) {
            const { email, password } = input;
            const passwordHash = await passwords.hash(password);
            const user = await users.createUser({
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
            const user = await users.getUserByEmail(email.trim().toLowerCase());
            if (!user || !(await passwords.verify(user.hashPassword, password))) {
                throw new Error("Invalid credentials");
            }
            const refreshToken = tokens.signRefreshToken(user.id);
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
                accessToken: tokens.signAccessToken(user.id),
                refreshToken: refreshToken,
            };
        },
        async refresh(refreshToken) {
            const userId = tokens.verifyRefreshToken(refreshToken);
            const oldHash = tokens.hash(refreshToken);
            const session = await sessions.getByHash(oldHash);
            if (!session || session.userId !== userId || session.expiresAt <= new Date()) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }
            const user = await users.getUserById(userId);
            if (!user) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }
            const newRefreshToken = tokens.signRefreshToken(user.id);
            const isChanged = await sessions.rotate(
                oldHash,
                tokens.hash(newRefreshToken),
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            );
            if (!isChanged) {
                throw new Error("INVALID_REFRESH_TOKEN");
            }
            return {
                accessToken: tokens.signAccessToken(user.id),
                refreshToken: newRefreshToken,
            };
        },
        async logout(refreshToken) {
            if (!refreshToken) return;
            await sessions.deleteByHash(tokens.hash(refreshToken));
        },
        async me(id) {
            const user = await users.getUserById(id);
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