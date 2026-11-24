import type { CommentAuthor } from "../../domain/comment/entity";

export interface CreateCommentServiceInput{
    content: string,
    postId: number,
    authorId: number,
}

export interface CommentService{
    getPostComments: (postId: number) => Promise<CommentAuthor[]>;
    createComment: (input: CreateCommentServiceInput) => Promise<CommentAuthor>;
    deleteComment: (commentId: number, authorId: number) => Promise<void>;
}