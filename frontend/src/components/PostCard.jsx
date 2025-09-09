import React from 'react';
import '../App.css';

function PostCard({ post }) {
  return (
    <div className="post-card">
      <h2 className="post-title">{post.title}</h2>
      <div className="post-footer">
        <span>{post.userNickname}</span>
        <span>{post.updatedAt}</span>
      </div>
    </div>
  );
}

export default PostCard;