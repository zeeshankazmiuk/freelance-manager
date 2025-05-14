import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import './App.css';
import JobsPage from './pages/JobsPage';
import TasksPage from './pages/TasksPage';
import YourTasksPage from './pages/YourTasksPage';
import DMsPage from './pages/DMsPage';
import FindJobsPage from './pages/FindJobsPage';
import OnboardingPage from './pages/OnboardingPage';
import Login from './components/Login';
import UserButton from './components/UserButton';
import { fetchUsers } from './services/apiService';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [users, setUsers] = useState([]);
  const [dmRooms, setDmRooms] = useState(JSON.parse(localStorage.getItem('dmRooms')) || []);
  const [showLogout, setShowLogout] = useState(false);
  const dmsRef = useRef();


  const handleLogin = (username, role) => setUser({ username, role });

  const handleLogout = () => {
    localStorage.removeItem('user');  
    window.location.reload();       
  };

  useEffect(() => {
    if (user) {
      fetchUsers()
        .then(response => setUsers(response.data))
        .catch(() => console.error("Failed to load users"));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('dmRooms', JSON.stringify(dmRooms));
  }, [dmRooms]);

  const handleUserClick = (username) => {
    if (user.username !== username) {
      handleStartDM(username);
    }
  };

  const generateRoomName = (user1, user2) => {
    return [user1, user2].sort().join('-');
  };

  const handleStartDM = (otherUsername) => {
    const roomName = generateRoomName(user.username, otherUsername);
  
    if (!dmRooms.includes(roomName)) {
      const updatedRooms = [...dmRooms, roomName];
      setDmRooms(updatedRooms);
    }
  
    setActiveTab('dms');
    setTimeout(() => {
      if (dmsRef.current && dmsRef.current.addDMRoom) {
        dmsRef.current.addDMRoom(roomName);
      }
    }, 0);
  };  
  

  const renderUsers = () => (
    <div className="user-sidebar">
      <h3>Online Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.username}>
            <UserButton 
              username={u.username} 
              onClick={handleUserClick}
              currentUsername={user.username}
              onStartDM={handleStartDM}
            /> 
          </li>
        ))}
      </ul>
    </div>
  );

  if (!user) {
    return <Login onAuth={handleLogin} />;
  }

  return (
    <div className="App">
      <div className="sidebar">
        <button className={activeTab === 'find-jobs' ? 'active' : ''} onClick={() => setActiveTab('find-jobs')}>Find Jobs</button>
        <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>Jobs</button>
        {user.role === 'mentee' && (
          <button className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}>Tasks</button>
        )}
        {(user.role === 'admin' || user.role === 'mentor') && (
          <button className={activeTab === 'your-tasks' ? 'active' : ''} onClick={() => setActiveTab('your-tasks')}>Your Tasks</button>
        )}
        <button className={activeTab === 'dms' ? 'active' : ''} onClick={() => setActiveTab('dms')}>DMs</button>
        {user.role === 'admin' && (
          <button
            className={activeTab === 'onboarding' ? 'active' : ''}
            onClick={() => setActiveTab('onboarding')}
          >
            Onboarding
          </button>
        )}

        <div className="user-info" onClick={() => setShowLogout(!showLogout)}>
          <span>{user.username}</span>
          {showLogout && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="content">
        {activeTab === 'jobs' && <JobsPage user={user} />}
        {activeTab === 'tasks' && <TasksPage user={user} onStartDM={handleStartDM} />}
        {activeTab === 'your-tasks' && <YourTasksPage user={user} onStartDM={handleStartDM} />}
        {activeTab === 'dms' && <DMsPage ref={dmsRef} user={user} dmRooms={dmRooms} setDmRooms={setDmRooms} />}
        {activeTab === 'onboarding' && <OnboardingPage />}
        {activeTab === 'find-jobs' && (
          <div className="w-full flex justify-center">
            <FindJobsPage user={user} />
          </div>
        )}
      </div>

      {renderUsers()}
    </div>
  );
}

export default App;
