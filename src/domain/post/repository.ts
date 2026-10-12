import type { IPost } from './entity.js';

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
      
      const result = await db.post.findMany(queryOptions);
      return result;
    },

    async getById(id: string): Promise<IPost | null> {
      const searchOptions = {
        where: { id: id }
      };
      
      const post = await db.post.findUnique(searchOptions);
      return post;
    },

    async addPost(postData: Omit<IPost, 'id'>): Promise<IPost> {
      const createOptions = {
        data: postData
      };
      
      const createdPost = await db.post.create(createOptions);
      return createdPost;
    }
  };
}
