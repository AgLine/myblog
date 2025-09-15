import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';


function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 일반 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        const token = response.data.token;
        const userId = response.data.userId
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', JSON.stringify({ email }));
        onLogin({ email }); // 상태 즉시 반영
        navigate('/');
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      alert('로그인 실패: 이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  // Google 로그인 성공 처리
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const response = await axios.post('http://localhost:9090/auth/google', {
        token: credential,
      });

      if (response.data.token) {
        const token = response.data.token;
        const emailFromServer = response.data.email; // 백엔드에서 이메일 내려줌
        localStorage.setItem('token', token);
        localStorage.setItem('email', JSON.stringify({ email: emailFromServer }));
        onLogin({ email: emailFromServer }); // 상태 즉시 반영
        navigate('/');
      } else {
        alert('Google 로그인 실패');
      }
    } catch (err) {
      alert('Google 로그인 중 오류가 발생했습니다');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>로그인</h2>
        <form onSubmit={handleLogin}>
          <label style={styles.label}>이메일</label>
          <input type="email" placeholder="you@example.com" required style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label style={styles.label}>비밀번호</label>
          <input type="password" placeholder="••••••••" required style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit" style={styles.loginButton}>로그인</button>
        </form>

        <div style={styles.separator}>또는</div>

        {/* Google 로그인 버튼 추가 */}
        <GoogleOAuthProvider clientId="433451591816-rt2olvmo0ghreepvil468pikvp38c2dp.apps.googleusercontent.com">
          <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => alert('Google 로그인 실패')}
        />
        </GoogleOAuthProvider>

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
