import React, { useState, useEffect } from 'react';
import './App.css';

/* login */
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginClick = () => {
    if (username === 'testlogin' && password === 'testlogin') {
      onLogin();
    } else {
      setErrorMsg('Incorrect username or password.');
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // jobs and chat //
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/jobs')
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch jobs');
        setLoading(false);
      });
  }, []);



  // show login screen
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // loading after login
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      {/* left sidebar */}
      <div className="sidebar">
        <button
          className={activeTab === 'jobs' ? 'active' : ''}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
      </div>

      {/* main */}
      <div className="main-content">
        {activeTab === 'jobs' && (
          <div>
            <h1>Job Listings</h1>
            {jobs.length > 0 ? (
              <ul>
                {jobs.map((job) => (
                  <li key={job.id}>
                    <h2>{job.title}</h2>
                    <p>{job.description}</p>
                    <p><strong>Budget:</strong> ${job.budget}</p>
                    <p><strong>Skills:</strong> {job.skills}</p>
                    <p><strong>Client Rating:</strong> {job.client_rating}</p>
                    <p><strong>Posted Date:</strong> {job.posted_date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No jobs available</p>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <h1>Chat</h1>
            <p>Chat functionality to be added later</p>
          </div>
        )}
      </div>

      {/* right sidebar */}
      <div className="user-sidebar">
        <h3>Online Users</h3>
        <ul>
          {/* single user, special class for black text */}
          <li className="currentUser">testlogin (You)</li>
          {/* note to self: test users here or array of users mapped over here*/}
        </ul>
      </div>
    </div>
  );
}

export default App;
