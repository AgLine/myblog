import React from 'react';
import PostCard from './components/PostCard';
import { dummyPosts } from './data/dummyPosts';
import './App.css';

function Home() {
  return (
    <div className="container">
      <h1 className="page-title">최신 글</h1>
      <div className="post-grid">
        {dummyPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;