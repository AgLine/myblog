// myblog-frontend/src/pages/PostView.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // API 통신을 위해 axios를 사용한다고 가정

const PostView = () => {
    // 1. URL 파라미터에서 postId 가져오기
    const { postId } = useParams();
    const navigate = useNavigate();

    // 2. 컴포넌트 상태 관리
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        // 3. 백엔드로부터 게시글 데이터 가져오기
        const fetchPost = async () => {
            try {
                // 백엔드 API 엔드포인트에 맞게 수정해야 해
                const response = await axios.get(`http://localhost:9090/posts/${postId}`);
                const fetchedPost = response.data.data; // 내 코드를 보니 데이터가 data 객체에 한번 더 감싸여 있더라
                setPost(fetchedPost);

                // 4. 로그인된 사용자와 작성자 정보 비교
                // 실제 프로젝트에서는 Context API나 Redux 같은 상태관리 라이브러리를 사용하는 것이 좋아.
                // 지금은 간단하게 localStorage를 기준으로 할게.
                const loggedInUserNickname = localStorage.getItem('userNickname');

                if (loggedInUserNickname && loggedInUserNickname === fetchedPost.authorNickname) {
                    setIsAuthor(true);
                }

            } catch (err) {
                setError('게시글을 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]); // postId가 바뀔 때마다 다시 데이터를 불러옴

    // 수정 페이지로 이동하는 함수
    const handleEdit = () => {
        navigate(`/edit/${postId}`); // 수정 페이지 경로는 프로젝트에 맞게 설정
    };

    // 게시글 삭제 함수 (API 호출 필요)
    const handleDelete = async () => {
        if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
            try {
                // JWT 토큰을 헤더에 담아서 보내야 인증이 될 거야
                const token = localStorage.getItem('accessToken');
                await axios.delete(`/api/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('게시글이 삭제되었습니다.');
                navigate('/'); // 삭제 후 홈으로 이동
            } catch (err) {
                alert('삭제에 실패했습니다. 권한을 확인해주세요.');
                console.error(err);
            }
        }
    };

    // 로딩 및 에러 상태 처리
    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!post) return <div>게시글이 없습니다.</div>;

    // 5. 화면 렌더링
    return (
        <div className="post-view">
            <h1>{post.title}</h1>
            <div className="post-meta">
                <span>작성자: {post.authorNickname}</span>
                {/* <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span> */}
            </div>

            {/* isAuthor가 true일 때만 수정/삭제 버튼을 보여줌 */}
            {isAuthor && (
                <div className="author-actions">
                    <button onClick={handleEdit}>수정</button>
                    <button onClick={handleDelete}>삭제</button>
                </div>
            )}

            <hr />

            <div className="post-content">
                {/* 마크다운 뷰어를 사용한다면 여기에 적용 */}
                {post.content}
            </div>
        </div>
    );
};

export default PostView;