import type { Category } from "../category/entity.js";

export interface Post {
    id: number;
    title: string;
    content: string | null;
    categoryId: number;
}

export type PostWithCategory = Post & { category: Category };

export interface CreatePostRepository {
    getAll(category?: string, take?: number): Promise<PostWithCategory[]>;
    getById(id: string): Promise<PostWithCategory | null>;
    addPost(postData: any): Promise<PostWithCategory>;
}