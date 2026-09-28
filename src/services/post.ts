import postRepository from '../repositories/post.js';
import type { IPost } from '../repositories/post.js';
import type { CreatePostDto } from '../transport/dto/post.js';

class PostService {
  public getPosts(category?: string, take?: string | number): IPost[] {
    const parsedTake = typeof take === 'string' ? parseInt(take, 10) : take;
    
    return postRepository.getAll(category, isNaN(parsedTake as number) ? undefined : parsedTake);
  }

  public getPostById(id: string): IPost {
    const post = postRepository.getById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  public async createPost(postData: CreatePostDto): Promise<IPost> {
    return await postRepository.addPost(postData);
  }
}

export default new PostService();
