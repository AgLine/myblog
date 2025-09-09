// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './components/PostCard';
import './App.css';

function Home() {
  // 1. 게시글 데이터를 저장할 state와 로딩/에러 상태를 관리할 state를 만듭니다.
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. 컴포넌트가 처음 렌더링될 때 API를 호출하기 위해 useEffect를 사용합니다.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 3. 백엔드 API에 GET 요청을 보냅니다.
        // 백엔드 주소는 실제 환경에 맞게 수정해야 할 수 있습니다. (예: http://api.myblog.com/posts)
        const response = await axios.get('http://localhost:9090/posts');
        
        // 4. Spring Boot의 Page 객체 응답에서 실제 데이터는 content 배열에 들어있습니다.
        setPosts(response.data.content);
        
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
      <h1 className="page-title">최신 글</h1>
      <div className="post-grid">
        {/* 5. 더미 데이터 대신 API로 받아온 posts 배열을 사용합니다. */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;