import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 처리
    console.log('로그인 시도');
  };

  const handleGoogleLogin = () => {
    // 구글 로그인 연동
    console.log('Google 로그인 시도');
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>로그인</h2>
        <form onSubmit={handleLogin}>
          <label style={styles.label}>이메일</label>
          <input type="email" placeholder="you@example.com" required style={styles.input}/>
          <label style={styles.label}>비밀번호</label>
          <input type="password" placeholder="••••••••" required style={styles.input} />
          <button type="submit" style={styles.loginButton}>로그인</button>
        </form>

        <div style={styles.separator}>또는</div>

        <button onClick={handleGoogleLogin} style={styles.googleButton}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={styles.googleLogo}/>Google로 로그인
        </button>

        <div style={styles.signup}>
          계정이 없으신가요?{' '}
          <button onClick={() => navigate('/signup')} style={styles.signupLink}>회원가입</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '24px',
    color: '#333',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '18px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  loginButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '10px',
    boxSizing: 'border-box',
  },
  separator: {
    textAlign: 'center',
    margin: '20px 0',
    color: '#666',
    fontSize: '14px',
  },
  googleButton: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  googleLogo: {
    width: '20px',
    height: '20px',
  },
  signup: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#333',
  },
  signupLink: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: 'bold',
    cursor: 'pointer',
    paddingLeft: '4px',
  },
};
export default Login;