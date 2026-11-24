import type { CommentService } from "../../../services/comment/comment.types";
import type { Request, Response } from "express"
import type { CommentHandler } from "./comment.types";

export function parsePositiveId(raw: string): number | null {
    const num = Number(raw)
    if(!Number.isInteger(num) || num <= 0 ){
        return null
    }
    return num
}


export function createCommentHandler(service: CommentService): CommentHandler{
    return {
        async getByPost(req: Request, res: Response) {

            const rawPostId = req.params.commentId
            if(typeof rawPostId !== "string"){
                res.status(400).json({message: "INVALID COMMENT ID"})
                return
            }
            const postId = parsePositiveId(rawPostId)
            if(!postId){
                res.status(400).json({ message: "INVALID POST ID"})
                return
            }

            try{
                const comments = await service.getPostComments(postId) 
                res.status(200).json(comments)
            }catch(error){
                if (error instanceof Error && error.message === "POST NOT FOUND") {
                    res.status(404).json({ message: "POST NOT FOUND "})
                    return 
                }
                res.status(500).json({ message: "INTERNAL SERVER ERROR"})
            }
        },
        async create(req: Request, res: Response){

             const rawPostId = req.params.commentId
            if(typeof rawPostId !== "string"){
                res.status(400).json({message: "INVALID COMMENT ID"})
                return
            }
            const postId = parsePositiveId(rawPostId)
            if(!postId){
                res.status(400).json({ message: "INVALID POST ID"})
                return
            }
            const authorId = res.locals.userId
            if(typeof authorId !== "number"){
                res.status(401).json({ message: "NOT AUTHORIZED"})
                return
            }
            try{
                const { content } = req.body ?? {}
                const created = await service.createComment({ content, postId, authorId })
                res.status(201).json(created)
            }catch(error){
                if(error instanceof Error){
                    if(error.message === "INVALID CONTENT"){
                        res.status(400).json({ message: "CONTENT NEED TO BE BETWEEN 1 TO 500 ELEMENTS AFTER TRIM" })
                        return
                    }
                }
                res.status(500).json({ message: "INTERNAL SERVER ERROR" })
            }
        },
        async delete(req: Request, res: Response){

            const rawCommentId = req.params.commentId
            if(typeof rawCommentId !== "string"){
                res.status(400).json({message: "INVALID COMMENT ID"})
                return
            }
            const commentId = parsePositiveId(rawCommentId)
            if(!commentId){
                res.status(400).json({ message: "INVALID COMMENT ID"})
                return
            }
            const userId = res.locals.userId
            if(typeof userId !== "number"){
                res.status(401).json({ message: "NOT AUTHORIZED"})
                return
            }
            try{
                await service.deleteComment(commentId, userId)
                res.status(204).set
            }catch(error){
                if(error instanceof Error){
                    if(error.message === "COMMENT NOT FOUND"){
                        res.status(404).json({ message: "COMMENT NOT FOUND" })
                        return
                    }
                    if(error.message === "FORBIDDEN"){
                        res.status(403).json({ message: "FORBIDDEN" })
                        return
                    }
                }
                res.status(500).json({ message: "INTERNAL SERVER ERROR" })
            }
        }
    }
}
