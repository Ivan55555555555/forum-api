import type { CategoryRepository } from "../../domain/category/repository.js";

export function createCategoryService(repository: CategoryRepository) {
    async function getCategories() {
        return await repository.getAllCategories();
    }

    async function findCategory(id: number) {
        return await repository.findCategoryById(id);
    }

    async function createCategory(name: string) {
        return await repository.createCategory(name);
    }

    return {
        getCategories,
        findCategory,
        createCategory,
    };
}

export type CategoryService = ReturnType<typeof createCategoryService>;