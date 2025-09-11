// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Write from './pages/Write';
import PostView from './pages/PostView';

import './App.css';

function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLoginClick = () => navigate('/login');
  const handleLogoutClick = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    onLogout(null);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>📘 My Blog</h2>
      </div>
      <div className="header-right">
        {user ? (
          <div 
            className="user-menu"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className="username">{user.email}님</span>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate('/mypage')}>마이페이지</li>
                <li onClick={() => navigate('/write')}>글작성</li>
                <li onClick={() => navigate('/tempPost')}>임시글</li>
                <li onClick={handleLogoutClick}>로그아웃</li>
              </ul>
            )}
          </div>
        ) : (
          <button className="btn" onClick={handleLoginClick}>로그인</button>
        )}
      </div>
    </header>
  );
}

function App() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('email');
    if (stored) setEmail(JSON.parse(stored));
  }, []);

  return (
    <Router>
      <Header user={email} onLogout={setEmail} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={setEmail} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/write" element={<Write />} />
        <Route path="/post/:postId" element={<PostView />} />
      </Routes>
    </Router>
  );
}

export default App;
