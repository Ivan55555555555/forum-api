import type { IPost } from '../domain/post/entity.js';
import type { CreatePostDto } from '../transport/dto/post.js';

export interface IPostService {
  getPosts(category?: string, take?: string | number): Promise<IPost[]>;
  getPostById(id: string): Promise<IPost>;
  createPost(postData: CreatePostDto): Promise<IPost>;
}