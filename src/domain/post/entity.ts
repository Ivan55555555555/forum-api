import type { Category } from "../category/entity.js";

export interface IPost {
    id: string;
    title: string;
    content: string;
    author: string;
    categoryId: number;
}

export type PostWithCategory = IPost & { category: Category };