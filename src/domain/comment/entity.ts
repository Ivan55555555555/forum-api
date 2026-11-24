import type { PublicUser } from "../user/entity.js";

export interface Comment {
    id: number;
    content: string;
    postId: number;
    authorId: number;
    createdAt: Date;
}

export interface CommentAuthor {
    id: number;
    content: string;
    postId: number;
    authorId: number;
    createdAt: Date;
    author: PublicUser;
}