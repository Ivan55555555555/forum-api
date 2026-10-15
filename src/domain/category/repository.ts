import type { Category } from './entity.ts';

export interface CategoryRepository {
    getAllCategories: () => Promise<Category[]>;
    findCategoryById: (id: number) => Promise<Category | null>;
    createCategory: (name: string) => Promise<Category>;
}