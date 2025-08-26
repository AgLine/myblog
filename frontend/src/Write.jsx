import React, { useState, useEffect } from 'react';

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

  const handleSaveDraft = () => {
    console.log({ title, tags, content });
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      console.log("제목과 내용을 모두 입력해주세요.");
      return;
    }
    console.log({ title, tags, content });
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

// 마크다운 변환을 위한 showdown 라이브러리를 사용합니다.
// 이 라이브러리는 여전히 public/index.html 파일에 추가해주셔야 합니다.
// <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js"></script>

// --- 스타일 정의 ---
// Tailwind CSS 대신 사용할 CSS 스타일을 여기에 객체로 정의합니다.
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
