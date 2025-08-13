// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import './App.css';

function Header({ user, onLogout }) {
  const navigate = useNavigate();

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
          <>
            <span className="username">{user.email}님</span>
            <button className="btn" onClick={handleLogoutClick}>로그아웃</button>
          </>
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
      </Routes>
    </Router>
  );
}

export default App;
