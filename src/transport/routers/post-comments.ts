import { Router, type RequestHandler } from "express";
import type { CommentHandler } from "../handlers/comment/comment.types";

export function createPostCommentsRouter(handler: CommentHandler, requireAuth: RequestHandler){
    const router = Router({ mergeParams: true })
    router.get("/", handler.getByPost),
    router.post("/", requireAuth, handler.create)
    return router
}