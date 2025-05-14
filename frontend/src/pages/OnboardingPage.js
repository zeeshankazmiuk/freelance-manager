import React, { useState } from 'react';
import { register } from '../services/apiService';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mentee');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      await register(username, password, role, email);
      setMessage('User successfully created!');
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (err) {
      setMessage('Failed to create user.');
    }
  };

  return (
    <div className="content-inner flex justify-center items-center min-h-[80vh]">
      <div className="onboarding-card w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">Admin Onboarding</h2>
        <p className="mb-5 text-sm text-gray-600">
          This page is only visible to admins. Use this to register new users.
        </p>
  
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="input-field"
          />
  
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-field"
          />
  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-field"
          />
  
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="input-field"
          >
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
  
          <button
            onClick={handleRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full font-medium transition"
          >
            Create User
          </button>
  
          {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}
        </div>
      </div>
    </div>
  );  
};

export default OnboardingPage;
