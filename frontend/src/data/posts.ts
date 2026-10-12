export interface IPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
}

export const staticPosts: IPost[] = [
  {
    id: "1",
    title: "11",
    content: "111",
    author: "Ваня",
    category: "1111"
  },
  {
    id: "2",
    title: "22",
    content: "222",
    author: "Анна",
    category: "2222"
  },
  {
    id: "3",
    title: "33",
    content: "333",
    author: "Игорь",
    category: "3333"
  },
  {
    id: "4",
    title: "44",
    content: "444",
    author: "Мария",
    category: "4444"
  },
  {
    id: "5",
    title: "55",
    content: "555",
    author: "Алексей",
    category: "5555"
  }
];
