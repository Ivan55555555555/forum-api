import type { IPost } from '../domain/post/entity.js';

export interface IPostRepository {
  getAll(category?: string, take?: number): Promise<IPost[]>;
  getById(id: string): Promise<IPost | null>;
  addPost(postData: any): Promise<IPost>;
}

export function createPostRepository(db: any): IPostRepository {
  return {
    async getAll(category?: string, take?: number): Promise<IPost[]> {
      let query = db.orm.public.Post.include("author");

      try {
        query = query.include("category");
      } catch (e) {
      }

      if (category) {
        query = query.where({ category: { name: category } });
      }

      query = query.orderBy((post: any) => post.id.asc());

      if (take === undefined || isNaN(take)) {
        return await query.all();
      }
      return await query.limit(take).all();
    },

    async getById(id: string): Promise<IPost | null> {
      return await db.orm.public.Post
        .where({ id: Number(id) })
        .include("category")
        .include("author")
        .first();
    },

    async addPost(postData: any): Promise<IPost> {
      const { categoryId, authorId, ...fields } = postData;
      
      return await db.orm.public.Post.create({
        ...fields,
        author: (author: any) => author.connect({ id: Number(authorId) })
      });
    }
  };
}