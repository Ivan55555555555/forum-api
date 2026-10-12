import React from 'react';
import type { IPost } from '../data/posts.js';
import { PostCard } from './PostCard.tsx';

interface PostListProps {
  posts: IPost[];
}

export const PostList: React.FC<PostListProps> = (props) => {
  const { posts } = props;

  return (
    <div className="post-list">
      {posts.map((currentPost) => (
        <PostCard key={currentPost.id} post={currentPost} />
      ))}
    </div>
  );
};
