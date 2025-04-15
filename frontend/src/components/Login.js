import React, { useState } from 'react';
import { login } from '../services/apiService';
import './Login.css';

function Login({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginClick = async () => {
    try {
      const response = await login(username, password);
      if (response.status === 200) {
        onAuth(username, response.data.role);
      }
    } catch (error) {
      setErrorMsg('Invalid credentials or server error');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>
      <button onClick={handleLoginClick}>Login</button>
      {errorMsg && <p className="error-text">{errorMsg}</p>}
    </div>
  );
}

export default Login;
