import type { User } from "./entity.js";

export type NewUser = Omit<User, "id">;

export interface UserRepositoryContract{
    createUser: (data: NewUser) => Promise<User> 
    getUserByEmail: (email: string) => Promise<User | null>
    getUserById: (id: number) => Promise<User | null>
}