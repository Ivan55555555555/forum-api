export interface CommentAuthorResponse {
    id: number;
    email: string;
}

export interface CommentResponse {
    id: number;
    content: string;
    postId: number;
    authorId: number;
    createdAt: Date;
    author: CommentAuthorResponse;
}