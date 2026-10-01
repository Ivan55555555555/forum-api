import type { IPostRepository } from '../domain/post/repository.js';
import type { IPost } from '../domain/post/entity.js';
import type { CreatePostDto } from '../transport/dto/post.js';
import type { IPostService } from './post.types.js';

export function createPostService(postRepository: IPostRepository): IPostService {
  return {
    getPosts(category?: string, take?: string | number): IPost[] {
      const parsedTake = typeof take === 'string' ? parseInt(take, 10) : take;
      return postRepository.getAll(
        category, 
        parsedTake !== undefined && !isNaN(parsedTake) ? parsedTake : undefined
      );
    },

    getPostById(id: string): IPost {
      const post = postRepository.getById(id);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    },

    async createPost(postData: CreatePostDto): Promise<IPost> {
      return await postRepository.addPost(postData);
    }
  };
}
