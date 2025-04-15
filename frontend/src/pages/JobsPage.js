import React, { useState, useEffect } from 'react';
import { fetchClaimedJobs, fetchTasksByJobId, createTaskWithAxios, deleteJob } from '../services/apiService';
import { deleteTask } from '../services/apiService';
import './JobsPage.css';

function JobsPage({ user }) {
  const [jobs, setJobs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTags, setTaskTags] = useState('');

  useEffect(() => {
    fetchClaimedJobs(user.username)
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(() => setError('Failed to load jobs'));
  }, [user.username]);
  

  const handleJobDoubleClick = (job) => {
    if (user.role !== 'admin') return;  // Prevent mentees from double-clicking jobs

    setSelectedJob(job);
    fetchTasksByJobId(job.id)
      .then(response => setTasks(response.data))
      .catch(() => console.error('Failed to load tasks'));
  };

  const handleTaskSubmit = (e) => {
    console.log('log from JobsPage.js: handleTaskSubmit was run');

    e.preventDefault();

    if (!taskTitle.trim() || !taskDescription.trim() || !selectedJob) {
      alert("Title, Description, and Selected Job are required.");
      return;
    }

    const safeTags = taskTags.trim() === '' ? '' : taskTags.trim();

    createTaskWithAxios(selectedJob.id, taskTitle, taskDescription, safeTags, user.username)
      .then(response => {
        console.log('log from JobsPage.js: createTaskWithAxios was run');
        setTasks([...tasks, response.data]);
        setTaskTitle('');
        setTaskDescription('');
        setTaskTags('');
      })
      //.catch((error) => console.error('Failed to create task', error));
      .catch((error) => {
        console.log('log from JobsPage.js: createTaskWithAxios failed');
        if (error.response) {
          // The request was made and the server responded with a status code that is not 2xx
          console.error('❌ Failed to create task - Server responded with an error:');
          console.error('Status Code:', error.response.status);
          console.error('Response Data:', error.response.data);
          console.error('Response Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('❌ Failed to create task - No response received from server:');
          console.error('Request Data:', error.request);
        } else {
          // Something went wrong in setting up the request
          console.error('❌ Failed to create task - Error setting up request:', error.message);
        }
    
        console.error('❌ Full Error Object for debugging:', error.toJSON ? error.toJSON() : error);
      });    
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
  
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(null); // Clear selected job if deleted
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Failed to delete job.");
    }
  };  

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
  
    try {
      await deleteTask(taskId);  // This function will come from your apiService
      setTasks(tasks.filter(task => task.id !== taskId)); // remove from UI
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Failed to delete task.");
    }
  };
  
  

  return (
    <div className="JobsPage">
      <h1>Job Listings</h1>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        <ul>
        {jobs.map(job => (
          <li
            key={job.id}
            onDoubleClick={() => handleJobDoubleClick(job)}
            style={{ position: 'relative', paddingRight: '30px' }}
          >
            {user.role === 'admin' && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent double-click triggering
                  handleDeleteJob(job.id);
                }}
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
                title="Delete Job"
              >
                ✖
              </button>
            )}
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            {job.link && (
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0077cc', textDecoration: 'underline', fontWeight: 'bold' }}
              >
                View on Upwork
              </a>
            )}
          </li>
        ))}
      </ul>      
      )}

      {selectedJob && (
        <div className="TaskCreation">
          <h2>Tasks for {selectedJob.title}</h2>
          {user.role === 'admin' && (
              <form onSubmit={handleTaskSubmit}>
                <div>
                  <label>Task Title:</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label>Task Description:</label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Enter task description"
                  />
                </div>
                <button type="submit">Add Task</button>
              </form>
          )}

<ul>
  {tasks.map(task => (
    <li
      key={task.id}
      style={{
        marginBottom: '10px',
        position: 'relative',
        paddingRight: '30px'
      }}
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
      <strong>Title:</strong> {task.title || 'No Title'} <br />
      <strong>Description:</strong> {task.description || 'No Description'} <br />
      <strong>Tags:</strong> {task.tags || 'No tags provided'}
    </li>
  ))}
</ul>

        </div>
      )}
    </div>
  );
  }

export default JobsPage;

