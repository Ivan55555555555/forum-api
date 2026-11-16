import type { UserRepositoryContract } from "../domain/user/repository.js";

type Database = typeof import("../prisma/db.js").db;

export function createUserRepository(database: Database): UserRepositoryContract {
    return {
        async createUser(data) {
            try {
                return await database.orm.public.User.create(data);
            } catch (error) {
                if (error instanceof Error && 'sqlState' in error && error.sqlState === "23505") {
                    throw new Error('Email already exists');
                }
                throw error;
            }
        },
        async getUserByEmail(email) {
            return await database.orm.public.User.where({ email }).first();
        },
        async getUserById(id) {
            return database.orm.public.User.where({ id }).first();
        },
    };
}