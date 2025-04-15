import React, { useState, useEffect } from 'react';
import { fetchYourTasks, deleteTask } from '../services/apiService';
import UserButton from '../components/UserButton';
import './YourTasksPage.css';

function YourTasksPage({ user, onStartDM }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      fetchYourTasks(user.username)
        .then(response => setTasks(response.data))
        .catch(() => console.error('Failed to load your tasks'));
    }
  }, [user]);

  const handleUserClick = (username) => {
    if (user.username !== username && onStartDM) {
      onStartDM(username);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
  
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId)); // remove from UI
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Failed to delete task.");
    }
  };
  

  return (
    <div className="YourTasksPage">
      <h1>Your Tasks</h1>
      <ul>
  {tasks.map(task => (
    <li
      key={task.id}
      style={{ position: 'relative', paddingRight: '30px' }}
    >
      {user.role === 'admin' && (
  <button
    onClick={() => handleDeleteTask(task.id)}
    style={{
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'transparent',
      border: 'none',
      color: '#999',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
    title="Delete Task"
  >
    ✖
  </button>
)}

      <h2>{task.title || 'Untitled Task'}</h2>
      <p>{task.description || 'No description provided.'}</p>

      {task.assigned_to && (
        <p>
          <UserButton 
            username={task.assigned_to} 
            onClick={handleUserClick}
            onStartDM={onStartDM}
          />
        </p>
      )}
    </li>
  ))}
</ul>

    </div>
  );
}

export default YourTasksPage;
