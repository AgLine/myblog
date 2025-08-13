import React from 'react';
import '../App.css';

function PostCard({ post }) {
  return (
    <div className="post-card">
      <h2 className="post-title">{post.title}</h2>
      <p className="post-summary">{post.summary}</p>
      <div className="post-footer">
        <span>{post.author}</span>
        <span>{post.date}</span>
      </div>
    </div>
  );
}

export default PostCard;