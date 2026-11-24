import type { Request, Response } from "express"

export interface CommentHandler {
    getByPost: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}