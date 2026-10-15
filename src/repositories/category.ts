import type { CategoryRepository } from "../domain/category/repository.js";
import type { Category } from "../domain/category/entity.js";
import { db } from "../prisma/db.js";

export function createCategoryRepository(db: any): CategoryRepository {
    async function getAllCategories() {
        return await db.orm.public.Category
            .orderBy((category: any) => category.id.asc())
            .all();
    }

    async function findCategoryById(id: number) {
        return await db.orm.public.Category
            .where({ id })
            .first();
    }

    async function findCategoryByName(name: string) {
        return await db.orm.public.Category
            .where({ name })
            .first();
    }

    async function createCategory(name: string) {
        try {
            return await db.orm.public.Category.create({ name });
        } catch (error) {
            if (error instanceof Error && "sqlState" in error) {
                if (error.sqlState === "23505") {
                    throw new Error("CATEGORY_ALREADY_EXISTS");
                }
            }
            throw error;
        }
    }

    return {
        getAllCategories,
        findCategoryById,
        createCategory,
    };
}