import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 스타일 객체를 컴포넌트 내부에 직접 정의
const styles = {
    container: {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'sans-serif',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e9ecef',
        paddingBottom: '15px',
        marginBottom: '30px',
    },
    meta: {
        fontSize: '0.9rem',
        color: '#868e96',
    },
    metaSpan: {
        marginLeft: '10px',
    },
    actions: {
        // author-actions
    },
    button: {
        background: 'none',
        border: '1px solid #868e96',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '0.8rem',
        color: '#868e96',
        cursor: 'pointer',
        marginLeft: '8px',
    },
    tagsContainer: {
        marginBottom: '20px',
    },
    tagItem: {
        display: 'inline-block',
        backgroundColor: '#f1f3f5',
        color: '#555',
        borderRadius: '15px',
        padding: '5px 12px',
        marginRight: '10px',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    content: {
        fontSize: '1.1rem',
        lineHeight: '1.7',
        color: '#343a40',
        minHeight: '300px',
    },
};

const PostView = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/post/${postId}`);
                const fetchedPost = response.data;
                setPost(fetchedPost);

                // ✅ (중요) localStorage의 userId(문자열)와 게시글의 userId(숫자)를 비교하는 버그 수정
                const loggedInUserId = localStorage.getItem('userId');
                if (loggedInUserId === fetchedPost.userId) {
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
    }, [postId]);

    const handleEdit = () => {
        navigate(`/write/${postId}`);
    };

    const handleDelete = async () => {
        if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:9090/post/${postId}`, { // API 주소 수정
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('게시글이 삭제되었습니다.');
                navigate('/');
            } catch (err) {
                alert('삭제에 실패했습니다. 권한을 확인해주세요.');
                console.error(err);
            }
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!post) return <div>게시글이 없습니다.</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{post.title}</h1>

            <div style={styles.header}>
                <div style={styles.meta}>
                    <span>작성자: {post.userId}</span>
                    <span style={styles.metaSpan}>작성일: {new Date(post.updatedAt).toLocaleDateString()}</span>
                </div>
                {isAuthor && (
                    <div style={styles.actions}>
                        <button style={styles.button} onClick={handleEdit}>수정</button>
                        <button style={styles.button} onClick={handleDelete}>삭제</button>
                    </div>
                )}
            </div>

            <div style={styles.tagsContainer}>
                {post.tags && post.tags.map((tag, index) => (
                    <span key={index} style={styles.tagItem}>
                        {tag}
                    </span>
                ))}
            </div>

            <div style={styles.content}>
                {post.content}
            </div>
        </div>
    );
};

export default PostView;