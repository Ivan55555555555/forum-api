import type { CommentAuthor } from "../domain/comment/entity.js";
import type { CommentInput, CommentRepository } from "../domain/comment/repository.js";
import type { Database } from "../prisma/db.js";

export function createCommentRepository(database: Database): CommentRepository {
    return {
        async postExists(postId: number){
            const post = await database.orm.public.Post.where({ id: postId }).first();
            return post !== null && post !== undefined
        },
        
        async getPostById(postId: number){
            return await database.orm.public.Comment.where({ postId }).include("author").all();
        },

        async create(data: CommentInput){
            const { content, postId, authorId } = data
            const created = await database.orm.public.Comment.create({ 
                content, 
                post: (post)  => post.connect({ id: postId }), 
                author: (author) => author.connect({ id: authorId })
            });
            const result =  await database.orm.public.Comment.where({ id: created.id }).include("author").first();
            if(!result) throw new Error("Коментарій не був створений")
            return result;
        },

        async findById(commentId: number){
            return await database.orm.public.Comment.where({ id: commentId }).first();
        },

        async deleteById(commentId: number){
            await database.orm.public.Comment.where({ id: commentId }).delete();
        }
    }
}

