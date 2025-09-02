import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 import

// 마크다운 변환을 위한 showdown 라이브러리를 사용합니다.
// 이 라이브러리는 여전히 public/index.html 파일에 추가해주셔야 합니다.
// <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js"></script>

const Tag = ({ label, onRemove }) => (
  <div style={styles.tag}>
    {label}
    <button onClick={onRemove} style={styles.tagRemoveButton}>&times;</button>
  </div>
);

function App() {
  const [title, setTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [converter, setConverter] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    if (window.showdown) {
      setConverter(new window.showdown.Converter());
    } else {
      console.error("Showdown library is not loaded. Please include it in your HTML file.");
    }
  }, []);

  useEffect(() => {
    if (converter) {
      setHtmlContent(converter.makeHtml(content));
    }
  }, [content, converter]);

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // --- '임시저장' API 연동 ---
  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const postData = {
      title: title,
      tags: [...tags],
      content: content,
      status: "draft"
    };

    try {
      const response = await fetch('/api/posts/draft', { // 임시저장용 API 엔드포인트
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('게시글이 임시 저장되었습니다.');
        // 임시저장 후에는 페이지 이동 없이 현재 페이지에 머무름
      } else {
        alert('임시 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('임시 저장 중 오류 발생:', error);
      alert('임시 저장 중 오류가 발생했습니다.');
    }
  };

  // --- '출판하기' API 연동 ---
  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const postData = {
      title: title,
      tags: [...tags],
      content: content,
      status: "PUBLISHED"
    };

    try {
      const response = await fetch('http://localhost:9090/post/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('게시글이 성공적으로 등록되었습니다:', result);
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate('/'); // 성공 후 홈으로 이동
      } else {
        console.error('게시글 등록에 실패했습니다:', response.statusText);
        alert('게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 등록 중 오류가 발생했습니다:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.editorWrapper}>
        <h1 style={styles.header}>새 글 작성하기</h1>

        <div style={styles.section}>
          <label htmlFor="title" style={styles.label}>제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={styles.input}
          />
        </div>

        <div style={styles.section}>
          <label htmlFor="tags" style={styles.label}>태그</label>
          <div style={styles.tagContainer}>
            {tags.map((tag, index) => (
              <Tag key={index} label={tag} onRemove={() => removeTag(tag)} />
            ))}
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="태그를 입력하고 Enter를 누르세요"
              style={styles.tagInput}
            />
          </div>
        </div>

        <div style={styles.editorLayout}>
          <div style={styles.editorColumn}>
            <label htmlFor="content" style={styles.label}>내용 (Markdown)</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 마크다운 형식으로 작성하세요..."
              style={styles.textarea}
            />
          </div>
          <div style={styles.editorColumn}>
            <label style={styles.label}>미리보기</label>
            <div
              id="preview"
              style={styles.preview}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleSaveDraft}
            style={{ ...styles.button, ...styles.draftButton }}
          >
            임시저장
          </button>
          <button
            onClick={handlePublish}
            style={{ ...styles.button, ...styles.publishButton }}
          >
            출판하기
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 스타일 정의 ---
const styles = {
  container: {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'sans-serif',
  },
  editorWrapper: {
    maxWidth: '1280px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    padding: '1.5rem',
  },
  header: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem',
  },
  section: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    boxSizing: 'border-box',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
  },
  tagInput: {
    flexGrow: 1,
    padding: '0.25rem',
    border: 'none',
    outline: 'none',
  },
  editorLayout: {
    display: 'flex',
    gap: '1.5rem',
    height: '600px',
  },
  editorColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  textarea: {
    width: '100%',
    height: '100%',
    padding: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    resize: 'none',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
  },
  preview: {
    width: '100%',
    height: '100%',
    padding: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: '#f9fafb',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem 1.5rem',
    fontWeight: '600',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
  },
  draftButton: {
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
  },
  publishButton: {
    backgroundColor: '#2563eb',
    color: 'white',
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontSize: '0.875rem',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
  },
  tagRemoveButton: {
    marginLeft: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#1e40af',
    fontWeight: 'bold',
  }
};

export default App;
