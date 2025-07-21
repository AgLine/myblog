import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:9090/api/posts', {
        title,
        content,
      });

      alert('글 등록 성공: ' + response.data.id); // 백엔드에서 ID 반환한다고 가정
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('글 등록 실패:', error);
      alert('글 등록 실패');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: 10, fontSize: 16 }}
          />
        </div>
        <div>
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', height: 200, marginTop: 10, padding: 10, fontSize: 16 }}
          />
        </div>
        <button type="submit" style={{ marginTop: 10, padding: 10, fontSize: 16 }}>
          등록
        </button>
      </form>
    </div>
  );
}

export default App;
