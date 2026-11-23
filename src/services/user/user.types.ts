import type { RefreshRepository } from "../../domain/refresh-session/repository.js";
import type { PublicUser } from "../../domain/user/entity.js";
import type { UserRepositoryContract } from "../../domain/user/repository.js";

export interface AuthInput {
  email: string;
  password: string;
}

export interface PasswordHasher {
  hash: (password: string) => Promise<string>;
  verify: (hash: string, password: string) => Promise<boolean>;
}

export interface TokenService {
  signAccessToken: (userId: number) => string;
  signRefreshToken: (userId: number) => string;
  verifyAccessToken: (token: string) => number;
  verifyRefreshToken: (token: string) => number;
  hash: (token: string) => string;
}

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthServiceDependencies {
  users: UserRepositoryContract;
  sessions: RefreshRepository;
  passwords: PasswordHasher;
  tokens: TokenService;
}

export interface UserService {
  register: (input: AuthInput) => Promise<PublicUser>;
  login: (input: AuthInput) => Promise<{ user: PublicUser } & UserTokens>;
  refresh: (refreshToken: string) => Promise<UserTokens>;
  me: (userId: number) => Promise<PublicUser>;
  logout: (refreshToken?: string) => Promise<void>;
}