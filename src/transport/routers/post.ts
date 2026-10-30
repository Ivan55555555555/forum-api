import { Router } from 'express';
import type { IPostHandler } from '../handlers/post/post.js';

export const postsRouter = Router();

export function createPostRouter(handler: IPostHandler) {
    postsRouter.get('/', handler.getPosts);
    postsRouter.get('/:id', handler.getPostById);
    postsRouter.post('/', handler.createPost);

    return postsRouter
}