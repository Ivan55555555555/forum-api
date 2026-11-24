import { Router, type RequestHandler } from "express";
import type { CommentHandler } from "../handlers/comment/comment.types";

export function createCommentsRouter(handler: CommentHandler, requireAuth: RequestHandler){
    const router = Router()
    router.delete("/:commentId", requireAuth, handler.delete)
    return router
}