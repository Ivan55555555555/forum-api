import type { IPost } from '../domain/post/entity.js';

export interface IPostRepository {
  getAll(category?: string, take?: number): Promise<IPost[]>;
  getById(id: string): Promise<IPost | null>;
  addPost(postData: Omit<IPost, 'id'>): Promise<IPost>;
}

export function createPostRepository(db: any): IPostRepository {
  return {
    async getAll(category?: string, take?: number): Promise<IPost[]> {
      const queryOptions: any = {};
      
      if (category) {
        queryOptions.where = { category: category };
      }
      
      if (take !== undefined && !isNaN(take)) {
        queryOptions.take = take;
      }
      
      return await db.post.findMany(queryOptions);
    },

    async getById(id: string): Promise<IPost | null> {
      return await db.post.findUnique({
        where: { id: id }
      });
    },

    async addPost(postData: Omit<IPost, 'id'>): Promise<IPost> {
      return await db.post.create({
        data: postData
      });
    }
  };
}
