import { Router } from "express";
import type { UserHandler } from "../handlers/user/user.types";
import type { RequestHandler } from "express"

export function createUserRouter(userHandler: UserHandler, requireAuth: RequestHandler){
    const userRouter = Router()

    userRouter.post('/register', userHandler.register)
    userRouter.post('/login', userHandler.login)
    userRouter.post('/refresh', userHandler.refresh)
    userRouter.get('/me', requireAuth, userHandler.me)

    return userRouter
}