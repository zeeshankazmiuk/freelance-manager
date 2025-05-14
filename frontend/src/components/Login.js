import React, { useState } from 'react';
import { login, requestPasswordResetCode, verifyResetCode, resetPasswordWithCode } from '../services/apiService';
import './Login.css';

function Login({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetStage, setResetStage] = useState('email'); // 'email' | 'code' | 'password'
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');


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

  
  const handleSendCode = async () => {
    try {
      const response = await requestPasswordResetCode(resetEmail);
      setResetMessage('Code sent to your email.');
      setResetStage('code');
    } catch (error) {
      setResetMessage('Failed to send code');
    }
  };
  

  const handleVerifyCode = async () => {
    try {
      const response = await verifyResetCode(resetEmail, resetCode);
      setResetMessage('✅ Code verified! Enter your new password.');
      setResetStage('password');
    } catch (error) {
      setResetMessage('Invalid or expired code');
    }
  };
  
  
  const handleResetPassword = async () => {
    try {
      const response = await resetPasswordWithCode(resetEmail, newPassword);
      setResetMessage('Password reset successfully. You can now log in.');
      setResetStage('email');
      setShowReset(false);
      setNewPassword('');
      setResetEmail('');
      setResetCode('');
    } catch (error) {
      setResetMessage('Failed to reset password');
    }
  };
  
  


  return (
    <div className="login-wrapper">
    <div className="login-container">
      <h1>Login</h1>
      <div>
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      <div>
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      <button onClick={handleLoginClick}>Login</button>
      {errorMsg && <p className="error-text">{errorMsg}</p>}

      <p
        className="forgot-link"
        onClick={() => setShowReset(!showReset)}
        style={{ cursor: 'pointer', color: '#0077cc', marginTop: '10px', textDecoration: 'underline' }}
      >
        Forgot Password?
      </p>

      {showReset && (
    <div style={{ marginTop: '15px' }}>
    {resetStage === 'email' && (
      <>
        <label>Email</label>
        <input
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button onClick={handleSendCode}>Send Code</button>
      </>
    )}

    {resetStage === 'code' && (
      <>
        <label>Enter the 6-digit code sent to your email</label>
        <input
          type="text"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          placeholder="Enter code"
        />
        <button onClick={handleVerifyCode}>Verify Code</button>
      </>
    )}

    {resetStage === 'password' && (
      <>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <button onClick={handleResetPassword}>Reset Password</button>
      </>
    )}

    {resetMessage && <p style={{ marginTop: '8px' }}>{resetMessage}</p>}
  </div>
  
)}

    </div>
    </div>
  );
}

export default Login;
