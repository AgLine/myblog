import React, { useState, useEffect } from 'react';
// 🔔 1. useParams와 useNavigate를 react-router-dom에서 함께 import 합니다.
import { useNavigate, useParams } from 'react-router-dom';

// 마크다운 변환을 위한 showdown 라이브러리를 사용합니다.
// <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js"></script>

const Tag = ({ label, onRemove }) => (
  <div style={styles.tag}>
    {label}
    <button onClick={onRemove} style={styles.tagRemoveButton}>&times;</button>
  </div>
);

// 컴포넌트 이름을 App에서 역할에 맞게 WritePage 등으로 변경하는 것이 좋습니다.
function WritePage() {
  // 🔔 2. useParams 훅을 사용하여 URL에서 postId를 가져옵니다.
  // 예: /write/123 -> postId는 "123"이 됩니다.
  const { postId } = useParams();
  const navigate = useNavigate();

  // 🔔 3. postId의 존재 여부로 '수정 모드'인지 판별하는 변수를 만듭니다.
  const isEditMode = !!postId;

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
  
  // 🔔 4. 수정 모드일 때, 기존 게시글 데이터를 불러오는 useEffect를 추가합니다.
  useEffect(() => {
    // isEditMode가 true일 때만 실행됩니다.
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          // 백엔드의 단일 게시글 조회 API를 호출합니다. (엔드포인트는 실제 API에 맞게 수정)
          const response = await fetch(`http://localhost:9090/post/${postId}`, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
          if (response.ok) {
            const postData = await response.json();
            // 서버에서 받은 데이터로 상태를 업데이트합니다.
            setTitle(postData.title);
            setTags(postData.tags || []); // tags가 null일 경우를 대비
            setContent(postData.content);
          } else {
            alert('게시글을 불러오는 데 실패했습니다.');
            navigate('/'); // 실패 시 홈으로 이동
          }
        } catch (error) {
          console.error('게시글 로딩 중 오류:', error);
          alert('게시글을 불러오는 중 오류가 발생했습니다.');
          navigate('/');
        }
      };
      fetchPost();
    }
  }, [postId, isEditMode, navigate]); // 의존성 배열에 필요한 값들을 명시합니다.

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
      status: "DRAFT"
    };
    
    // 🔔 5. 수정 모드와 작성 모드에 따라 다른 API를 호출하도록 로직을 수정합니다.
    try {
      let response;
      if (isEditMode) {
        // 수정 모드: PUT 요청으로 게시글을 업데이트합니다. (엔드포인트는 실제 API에 맞게 수정)
        response = await fetch(`http://localhost:9090/post/updatePost/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(postData),
        });
      } else {
        // 작성 모드: 기존 로직과 동일하게 POST 요청으로 새 글을 생성합니다.
        response = await fetch('http://localhost:9090/post/createPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(postData),
        });
      }

      if (response.ok) {
        alert('게시글이 임시 저장되었습니다.');
        // 수정 모드일 때는 해당 게시글 상세 페이지로, 새 글일 때는 홈으로 이동시킬 수 있습니다.
        if (isEditMode) {
          navigate(`/post/${postId}`); 
        } else {
          navigate('/'); 
        }
      } else {
        alert('임시 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('임시 저장 중 오류 발생:', error);
      alert('임시 저장 중 오류가 발생했습니다.');
    }
  };

  // --- '출판하기' 또는 '수정하기' API 연동 ---
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
    
    // 🔔 6. 출판하기 함수도 수정 모드와 작성 모드를 구분합니다.
    try {
      let response;
      if (isEditMode) {
        // 수정 모드: PUT 요청 (엔드포인트는 실제 API에 맞게 수정)
        response = await fetch(`http://localhost:9090/post/updatePost/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(postData),
        });
      } else {
        // 작성 모드: POST 요청
        response = await fetch('http://localhost:9090/post/createPost', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(postData),
        });
      }

      if (response.ok) {
        const result = await response.json();
        const message = isEditMode ? '게시글이 성공적으로 수정되었습니다.' : '게시글이 성공적으로 등록되었습니다.';
        alert(message);
        // 성공 후에는 해당 게시글의 상세 페이지로 이동하는 것이 사용자 경험에 좋습니다.
        // 새 글일 경우 백엔드에서 반환해주는 ID를 사용하고, 수정 글일 경우 기존 postId를 사용합니다.
        const targetPostId = isEditMode ? postId : result.id; // 백엔드 응답 형식에 따라 result.id는 조정 필요
        navigate(`/post/${targetPostId}`);
      } else {
        const errorText = isEditMode ? '게시글 수정에 실패했습니다.' : '게시글 등록에 실패했습니다.';
        console.error(errorText, response.statusText);
        alert(errorText);
      }
    } catch (error) {
      console.error('게시글 처리 중 오류가 발생했습니다:', error);
      alert('게시글 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.editorWrapper}>
        {/* 🔔 7. 페이지 제목(h1)을 isEditMode에 따라 동적으로 변경합니다. */}
        <h1 style={styles.header}>{isEditMode ? '게시글 수정' : '새 글 작성하기'}</h1>

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
            {/* 🔔 8. 버튼 텍스트도 isEditMode에 따라 동적으로 변경합니다. */}
            {isEditMode ? '수정하기' : '출판하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 스타일 정의 ---
// (기존 스타일 코드는 변경 없이 그대로 사용)
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

export default WritePage;