import type { Comment, CommentAuthor } from "./entity.js";

export interface CommentInput {
    content: string;
    postId: number;
    authorId: number;
}

export interface CommentRepository {
    postExists: (postId: number) => Promise<boolean>;
    getPostById: (postId: number) => Promise<CommentAuthor[]>;
    create: (data: CommentInput) => Promise<CommentAuthor>;
    findById: (commentId: number) => Promise<Comment | null>;
    deleteById: (commentId: number) => Promise<void>
}