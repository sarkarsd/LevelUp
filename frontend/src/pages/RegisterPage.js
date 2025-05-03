import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/auth/register', null, {
        params: { name, email, password },
      });
      setSuccess('Registration successful. You can now login.');
      setTimeout(() => navigate('/'), 2000); // Redirect to login after 2s
    } catch (err) {
      setError('Email already registered.');
      setSuccess('');
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Register</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <p className="link-text">Already have an account? <a href="/">Login</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;
