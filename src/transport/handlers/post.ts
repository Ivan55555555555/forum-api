import type { Request, Response } from 'express';
import type { PostService } from '../../services/post.js';
import type { GetPostsQueryDto, GetPostParamsDto, CreatePostDto } from '../dto/post.js';

export interface IPostHandler {
  getPosts(req: Request<{}, {}, {}, GetPostsQueryDto>, res: Response): Promise<Response>;
  getPostById(req: Request<GetPostParamsDto>, res: Response): Promise<Response>;
  createPost(req: Request<{}, {}, CreatePostDto>, res: Response): Promise<Response>;
}

export function createPostHandler(postService: PostService): IPostHandler {
  return {
    async getPosts(req: Request<{}, {}, {}, GetPostsQueryDto>, res: Response): Promise<Response> {
      try {
        const { category, take } = req.query;
        const posts = await postService.getPosts(category, take);
        return res.status(200).json(posts);
      } catch (error: any) {
        return res.status(500).json({ error: error.message || 'Server error' });
      }
    },

    async getPostById(req: Request<GetPostParamsDto>, res: Response): Promise<Response> {
      try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        return res.status(200).json(post);
      } catch (error: any) {
        if (error.message === 'INVALID_ID') {
          return res.status(400).json({ error: 'Некоректний id' });
        }
        if (error.message === 'POST_NOT_FOUND') {
          return res.status(404).json({ error: 'Post не знайдено' });
        }
        return res.status(500).json({ error: error.message || 'Server error' });
      }
    },

    async createPost(req: Request<{}, {}, CreatePostDto>, res: Response): Promise<Response> {
      try {
        const newPost = await postService.createPost(req.body);
        return res.status(201).json(newPost);
      } catch (error: any) {
        if (error.message === 'INVALID_CATEGORY_ID') {
          return res.status(400).json({ error: 'Некоректний categoryId' });
        }
        if (error.message === 'UNPROCESSABLE_FIELDS') {
          return res.status(422).json({ error: 'Недопустимі поля' });
        }
        if (error.message === 'CATEGORY_NOT_FOUND') {
          return res.status(404).json({ error: 'Category не знайдено' });
        }
        if (error.message === 'CONFLICT') {
          return res.status(409).json({ error: 'Повторна назва' });
        }
        return res.status(500).json({ error: error.message || 'Server error' });
      }
    }
  };
}