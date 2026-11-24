import type { CommentRepository } from "../../domain/comment/repository";
import type { CommentService, CreateCommentServiceInput } from "./comment.types";

export function validateAndTrimContent(content: unknown): string {
    if(typeof content !== "string"){
        throw new Error("Контент повинен бути рядком")
    }
    const trimmed = content.trim()
    if(trimmed.length === 0  || trimmed.length > 200){
        throw new Error("Контент не може бути порожнім")
    }
    return trimmed;
}

export function createCommentService(repository: CommentRepository): CommentService {
    return {
        async getPostComments(postId: number) {
            const postExists = await repository.postExists(postId);
            if(!postExists){
                throw new Error("Пост не був знайдений")
            }
            return await repository.getPostById(postId);
        },
        async createComment(input: CreateCommentServiceInput) {
            const exists = await repository.postExists(input.postId)
            if (!exists){
                throw new Error("Пост не був знайдений")
            }
            const trimmedContent = validateAndTrimContent(input.content)
            return await repository.create({
                content: trimmedContent,
                postId: input.postId,
                authorId: input.authorId
            })
        },
        async deleteComment(commentId: number, authorId: number){
            const comment = await repository.findById(commentId);
            if (!comment){
                throw new Error("Комментарій не був знайдений")
            }
            if (comment.authorId !== authorId){
                throw new Error("FORBIDDEN")
            }
        }
    }
}