import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// webscrape api
export const fetchScrapedJobs = async (query) => {
  const response = await api.get(`/scrape-jobs?query=${encodeURIComponent(query)}`);
  return response.data;
};

// login apis
export const login = (username, password) =>
  api.post('/login', { username, password });

export const register = (username, password, role, email) =>
  api.post('/register', { username, password, role, email });

export const requestPasswordReset = (email) =>
  api.post('/forgot-password', { email });

// send password reset code
export const requestPasswordResetCode = (email) =>
  api.post('/forgot-password', { email });

// verify code
export const verifyResetCode = (email, code) =>
  api.post('/verify-code', { email, code });

// set new password
export const resetPasswordWithCode = (email, newPassword) =>
  api.post('/reset-password', { email, newPassword });


// job apis
export const fetchJobs = () => api.get('/jobs');

export const fetchTasksByJobId = (jobId) => api.get(`/tasks/${jobId}`);

export const claimJob = (title, description, claimed_by) => {
  return api.post('/jobs', { title, description, claimed_by });
};

export const fetchClaimedJobs = (username) =>
  api.get(`/jobs`, { params: { claimed_by: username } });

export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);


// task apis
export const fetchAllTasks = () => api.get('/all-tasks');

export const assignTask = (taskId, username) =>
  api.post('/assign-task', { taskId, username });

export const fetchYourTasks = (username) =>
  api.get(`/your-tasks/${username}`);

export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);


// user apis
export const fetchUsers = () => api.get('/users');

// DM apis
export const getMessagesByRoom = (room) => 
  api.get(`/messages/${room}`).then(res => res.data);
export const postMessage = (room, sender, content) =>
  api.post('/postmessage', { room, sender, content });

// task creation apis (previous version)
export const createTaskWithAxios = (jobId, title, description, tags, createdBy) => {
  const safeTitle = String(title);    
  const safeTags = tags ? String(tags) : null;  
  return api.post('/create-task', 
    {
      job_id: jobId,
      title: safeTitle,
      description,
      tags: safeTags,
      created_by: createdBy
    }, 
    {
      headers: { 'Content-Type': 'application/json' }  
    }
  );  
};

// task creationg apis
export const createTask = async (jobId, title, description, tags, createdBy) => {
  const safeTitle = String(title);    
  const safeTags = tags ? String(tags) : null;  

  const data = {
    job_id: jobId,
    title: safeTitle,
    description: String(description),
    tags: safeTags,
    created_by: String(createdBy)
  };


  try {
    const response = await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Fetch Request Failed:", errorData);
      throw new Error('Failed to create task');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("❌ Error in Fetch request:", error.message);
    throw error;
  }
};

