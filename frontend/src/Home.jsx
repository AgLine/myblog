// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그인 상태 초기화 로직 추가 (예: localStorage 토큰 삭제)
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>환영합니다!</h1>
      <p style={styles.text}>로그인에 성공했습니다. 이제 서비스를 이용하실 수 있어요.</p>
      <button onClick={handleLogout} style={styles.button}>로그아웃</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '10%',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#333',
  },
  text: {
    fontSize: '1.2rem',
    marginTop: '1rem',
    color: '#666',
  },
  button: {
    marginTop: '2rem',
    padding: '0.8rem 1.6rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
  }
};

export default Home;