import type { IPost } from '../domain/post/entity.js';
import type { CreatePostDto } from '../transport/dto/post.js';

export interface IPostService {
  getPosts(category?: string, take?: string | number): IPost[];
  getPostById(id: string): IPost;
  createPost(postData: CreatePostDto): Promise<IPost>;
}
