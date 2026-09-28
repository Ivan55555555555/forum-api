export interface GetPostsQueryDto {
  category?: string;
  take?: string;
}

export interface GetPostParamsDto {
  id: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  author: string;
  category: string;
}
