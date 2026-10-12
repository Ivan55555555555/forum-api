import React from 'react';
import type { IPost } from '../data/posts.js';

interface PostCardProps {
  post: IPost;
}

export const PostCard: React.FC<PostCardProps> = (props) => {
  const { post } = props;

  return (
    <article className="post-card">
      <div className="post-meta">
        <span className={`post-category category-${post.category}`}>
          {post.category.toUpperCase()}
        </span>
        <span className="post-author">Опубликовал: <b>{post.author}</b></span>
      </div>
      <h2 className="post-title">{post.title}</h2>
      <p className="post-content">{post.content}</p>
    </article>
  );
};
