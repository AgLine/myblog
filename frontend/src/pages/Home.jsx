// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';

function Home() {
  // 1. 게시글 데이터를 저장할 state와 로딩/에러 상태를 관리할 state를 만듭니다.
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. 컴포넌트가 처음 렌더링될 때 API를 호출하기 위해 useEffect를 사용합니다.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 3. 백엔드 API에 GET 요청을 보냅니다.
        const [popularRes, latestRes] = await Promise.all([
          axios.get('http://localhost:9090/post/popular'), // 인기글 API
          axios.get('http://localhost:9090/posts'),         // 최신글 API
        ]);
        
        // 4. Spring Boot의 Page 객체 응답에서 실제 데이터는 content 배열에 들어있습니다.
        setPopularPosts(popularRes.data);
        setPosts(latestRes.data.content);
        
      } catch (e) {
        // 에러 발생 시 에러 상태를 업데이트합니다.
        setError(e);
      } finally {
        // 성공하든 실패하든 로딩 상태를 false로 변경합니다.
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // []를 넣어주어 최초 1회만 실행되도록 합니다.

  // 로딩 중일 때 보여줄 UI
  if (loading) {
    return <div className="container"><h2>로딩 중...</h2></div>;
  }

  // 에러 발생 시 보여줄 UI
  if (error) {
    return <div className="container"><h2>에러가 발생했습니다: {error.message}</h2></div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">인기 글</h1>
      <div className="post-grid">
        {popularPosts.map((post) => (
          // key는 map으로 렌더링하는 가장 바깥 요소에 있어야 함
          <Link key={post.id} to={`/post/${post.id}`} className="post-link">
            <PostCard post={post} />
          </Link>
        ))}
      </div>

      <h1 className="page-title">최신 글</h1>
      <div className="post-grid">
        {posts.map((post) => (
          // key는 map으로 렌더링하는 가장 바깥 요소에 있어야 함
          <Link key={post.id} to={`/post/${post.id}`} className="post-link">
            <PostCard post={post} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;