import React, { useState, useEffect } from 'react';
import { fetchAllTasks, assignTask } from '../services/apiService';
//import fetchAllTasks from '../services/apiService';
import UserButton from '../components/UserButton';
import './TasksPage.css';

function TasksPage({ user, onStartDM }) {
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    fetchAllTasks()
      .then(response => {
        setAllTasks(response.data);
        setFilteredTasks(response.data);
      })
      .catch(() => console.error('Failed to fetch tasks'));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = allTasks.filter(task => 
      task.description.toLowerCase().includes(query) ||
      (task.title && task.title.toLowerCase().includes(query)) ||
      (task.tags && task.tags.toLowerCase().includes(query))
    );

    setFilteredTasks(filtered);
  };

  const handleUserClick = (username) => {
    if (user.username !== username && onStartDM) {
      onStartDM(username);
    }
  };

  const handleTaskClick = (task) => {
    if (user.role === 'mentee') {
      setSelectedTask(task);
      setShowPrompt(true);
    }
  };

  const handleConfirmTask = () => {
    if (selectedTask) {
      assignTask(selectedTask.id, user.username)
        .then(() => {
          alert('Task assigned successfully!');
          setShowPrompt(false);
          setSelectedTask(null);

          const updatedTasks = allTasks.map(t =>
            t.id === selectedTask.id ? { ...t, assigned_to: user.username } : t
          );
          setAllTasks(updatedTasks);
          setFilteredTasks(updatedTasks);
        })
        .catch(() => alert('Failed to assign task'));
    }
  };

  const handleCancelTask = () => {
    setShowPrompt(false);
    setSelectedTask(null);
  };

  return (
    <div className="TasksPage">
      <h1>Tasks</h1>

      <input 
        type="text" 
        value={searchQuery} 
        onChange={handleSearch} 
        placeholder="Search tasks by title, description, or tags..." 
      />
      
      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} onDoubleClick={() => handleTaskClick(task)}>
            <strong>Title:</strong> {task.title || 'No Title'} <br />
            <strong>Description:</strong> {task.description || 'No Description'} <br />
            <strong>Tags:</strong> {task.tags || 'No tags provided'} <br />
            {task.assigned_to && (
              <>
                Assigned to: 
                <UserButton 
                  username={task.assigned_to} 
                  onClick={handleUserClick}
                />
              </>
            )}
          </li>
        ))}
      </ul>

      {showPrompt && (
        <div className="TaskPrompt">
          <p>Are you sure you want to commit to the following task?</p>
          <strong>{selectedTask.title || selectedTask.description}</strong>
          <div>
            <button onClick={handleConfirmTask}>Yes</button>
            <button onClick={handleCancelTask}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;

