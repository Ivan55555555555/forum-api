import type { PostWithCategory } from '../../domain/post/entity.js';
import type { IPostRepository } from '../../repositories/post.js';

export function createPostService(postRepository: IPostRepository) {
  return {
    async getPosts(category?: string, take?: string | number): Promise<PostWithCategory[]> {
      const parsedTake = typeof take === 'string' ? parseInt(take, 10) : take;
      const posts = await postRepository.getAll(
        category, 
        parsedTake !== undefined && !isNaN(parsedTake) ? parsedTake : undefined
      );
      return posts as unknown as PostWithCategory[];
    },

    async getPostById(id: string): Promise<PostWithCategory> {
      const numericId = Number(id);
      if (isNaN(numericId) || numericId <= 0) {
        throw new Error('INVALID_ID'); 
      }

      const post = await postRepository.getById(id);
      if (!post) {
        throw new Error('POST_NOT_FOUND'); 
      }
      return post as unknown as PostWithCategory;
    },

    async createPost(postData: any): Promise<PostWithCategory> {
      const { title, content, categoryId, authorId } = postData;
      
      if (!title || typeof title !== 'string' || !title.trim()) {
        throw new Error('UNPROCESSABLE_FIELDS');
      }

      const parsedCategoryId = Number(categoryId);
      if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
        throw new Error('INVALID_CATEGORY_ID'); 
      }

      const parsedAuthorId = Number(authorId);
      if (isNaN(parsedAuthorId) || parsedAuthorId <= 0) {
        throw new Error('INVALID_AUTHOR_ID'); 
      }

      try {
        const result = await postRepository.addPost({ 
          title, 
          content, 
          categoryId: parsedCategoryId, 
          authorId: parsedAuthorId 
        });
        return result as unknown as PostWithCategory;
      } catch (error: any) {
        if (error.message?.includes('not found') || error.sqlState === '23503') {
          throw new Error('RELATION_NOT_FOUND'); 
        }
        if (error.sqlState === '23505') {
          throw new Error('CONFLICT'); 
        }
        throw error;
      }
    }
  };
}

export type PostService = ReturnType<typeof createPostService>;