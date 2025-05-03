import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/auth/login', null, {
        params: { email, password },
      });
  
      if (res.data.userId) { 
        const { userId } = res.data;
        navigate(`/dashboard/${userId}`);
      } else if (res.data.error) {
        setError(res.data.error); // e.g., "Invalid email or password"
      } else {
        setError("Unexpected response from server");
      }
  
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="link-text">Don’t have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
