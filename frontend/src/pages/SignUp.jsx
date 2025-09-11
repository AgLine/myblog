import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);

  const [userId, setUserId] = useState('');
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:9090/auth/validateEmail`, {
        params: { email },
      });
      setIsEmailChecked(true);
      setIsEmailAvailable(response.data.available);
    } catch (error) {
      console.error('이메일 중복 확인 중 오류:', error);
    }
  };

  const handleUserIdCheck = async () => {
    // userId가 비어있는 경우 요청을 보내지 않음
    if (!userId) {
        alert('아이디를 입력해주세요.');
        return;
    }
    try {
      // 실제 백엔드 API 엔드포인트로 수정해야 합니다.
      const response = await axios.get(`http://localhost:9090/auth/validateUserId`, {
        params: { userId },
      });
      setIsUserIdChecked(true);
      setIsUserIdAvailable(response.data.available);
    } catch (error) {
      console.error('아이디 중복 확인 중 오류:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailAvailable) {
      alert('이메일 중복 확인이 필요하거나 이미 사용 중입니다.');
      return;
    }

    if (!isUserIdAvailable) {
      alert('아이디 중복 확인이 필요하거나 이미 사용 중입니다.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9090/auth/signup', {
        email,
        userId,
        password,
      });
      if (response.data === 'success') {
        alert('회원가입 성공!');
        navigate('/Login'); // 로그인 페이지로 이동
      } else {
        alert('회원가입 실패: ' + response.data);
      }
    } catch (error) {
      alert('회원가입 실패');
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 이메일 입력 및 중복 확인 */}
        <div style={styles.fieldWrapper}>
          <label style={styles.label}>이메일</label>
          <div style={styles.responsiveRow}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailChecked(false);
                setIsEmailAvailable(null);
              }}
              style={styles.input}
              placeholder="example@email.com"
              required
            />
            <button type="button" onClick={handleEmailCheck} style={styles.checkButton}>중복 확인</button>
          </div>
          {isEmailChecked && (
            <div
              style={{
                color: isEmailAvailable ? 'green' : 'red',
                marginTop: '4px',
                fontSize: '0.9rem',
              }}
            >
              {isEmailAvailable ? '사용 가능한 이메일입니다.' : '이미 사용 중입니다.'}
            </div>
          )}
        </div>

        {/* 아이디 입력 및 중복 확인 */}
        <div style={styles.fieldWrapper}>
          <label style={styles.label}>아이디</label>
          <div style={styles.responsiveRow}>
            <input
              type="text"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setIsUserIdChecked(false);
                setIsUserIdAvailable(null);
              }}
              style={styles.input}
              placeholder="사용할 아이디를 입력하세요"
              required
            />
            <button type="button" onClick={handleUserIdCheck} style={styles.checkButton}>중복 확인</button>
          </div>
          {isUserIdChecked && (
            <div
              style={{
                color: isUserIdAvailable ? 'green' : 'red',
                marginTop: '4px',
                fontSize: '0.9rem',
              }}
            >
              {isUserIdAvailable ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.'}
            </div>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div style={styles.fieldWrapper}>
          <label style={styles.label}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* 비밀번호 확인 */}
        <div style={styles.fieldWrapper}>
          <label style={styles.label}>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          {confirmPassword && (
            <div style={styles.passwordMatchMessage(password === confirmPassword)}>
              {password === confirmPassword ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
            </div>
          )}
        </div>

        <button type="submit" style={styles.submitButton}>가입하기</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    fontFamily: 'sans-serif',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1.8rem',
  },
  fieldWrapper: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  responsiveRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    flexWrap: 'wrap', // 모바일에서 줄 바꿈
  },
  input: {
    flex: '1 1 200px',
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minWidth: '0',
  },
  checkButton: {
    padding: '12px 16px',
    fontSize: '0.9rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  passwordMatchMessage: (isMatch) => ({
    color: isMatch ? 'green' : 'red',
    marginTop: '4px',
    fontSize: '0.9rem',
  }),
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginTop: '20px',
  },
};

export default SignUp;