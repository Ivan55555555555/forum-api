import type { Request, Response } from 'express';
import type { IPostService } from '../../services/post.types.js';
import type { GetPostsQueryDto, GetPostParamsDto, CreatePostDto } from '../dto/post.js';

export interface IPostHandler {
  getPosts(req: Request<{}, {}, {}, GetPostsQueryDto>, res: Response): Response;
  getPostById(req: Request<GetPostParamsDto>, res: Response): Response;
  createPost(req: Request<{}, {}, CreatePostDto>, res: Response): Promise<Response>;
}

export function createPostHandler(postService: IPostService): IPostHandler {
  return {
    getPosts(req: Request<{}, {}, {}, GetPostsQueryDto>, res: Response): Response {
      try {
        const { category, take } = req.query;
        const posts = postService.getPosts(category, take);
        return res.status(200).json(posts);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    },

    getPostById(req: Request<GetPostParamsDto>, res: Response): Response {
      try {
        const { id } = req.params;
        if (!id || id.trim() === '') {
          return res.status(400).json({ error: 'ID parameter is required' });
        }
        const post = postService.getPostById(id);
        return res.status(200).json(post);
      } catch (error: any) {
        if (error.message === 'Post not found') {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
    },

    async createPost(req: Request<{}, {}, CreatePostDto>, res: Response): Promise<Response> {
      try {
        const { title, content, author, category } = req.body;
        if (!title || !content || !author || !category) {
          return res.status(400).json({ 
            error: 'Fields validation failed. title, content, author, and category are required' 
          });
        }
        const newPost = await postService.createPost({ title, content, author, category });
        return res.status(201).json(newPost);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }
  };
}
