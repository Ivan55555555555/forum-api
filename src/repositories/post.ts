export interface IPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
}

const posts: IPost[] = [
  { 
    id: "0", 
    title: "First Post", 
    content: "Hello World1", 
    author: "John", 
    category: "tech" 
  },
  { 
    id: "1", 
    title: "Second Post", 
    content: "Hello World2", 
    author: "Anna", 
    category: "food" 
  },
  { 
    id: "2", 
    title: "Thirst Post", 
    content: "Hello World3", 
    author: "John", 
    category: "tech"
  }
];

class PostRepository {
  public getAll(category?: string, take?: number): IPost[] {
    let filteredPosts = [...posts];

    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    if (take !== undefined && !isNaN(take)) {
      filteredPosts = filteredPosts.slice(0, take);
    }

    return filteredPosts;
  }

  public getById(id: string): IPost | null {
    return posts.find(post => post.id === id) || null;
  }

  public addPost(postData: Omit<IPost, 'id'>): Promise<IPost> {
    return new Promise((resolve) => {
      const newPost: IPost = {
        id: Date.now().toString(),
        ...postData
      };
      posts.push(newPost);
      resolve(newPost);
    });
  }
}

export default new PostRepository();
