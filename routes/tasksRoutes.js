const express = require('express');
const router = express.Router();


const db = require('../db');

router.get('/test', (req, res) => {
  res.json({ message: "tasksRoutes.js is working properly." });
});

// fetch tasks
router.get('/all-tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// assign task to mentee
router.post('/assign-task', (req, res) => {
  const { taskId, username } = req.body;

  if (!taskId || !username) {
    return res.status(400).json({ error: 'Task ID and username are required.' });
  }

  const query = 'UPDATE tasks SET assigned_to = ? WHERE id = ?';
  db.query(query, [username, taskId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task successfully assigned.' });
  });
});

// fetch tasks created by a specific admin o rmentor
router.get('/your-tasks/:username', (req, res) => {
  const { username } = req.params;

  const query = "SELECT * FROM tasks WHERE created_by = ?";
  db.query(query, [username], (err, results) => {
      if (err) {
          console.error("Database Error: ", err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});


// add new task to a job
router.post('/create-task', (req, res) => {

  const { job_id, title, description, tags, created_by } = req.body;

  if (!job_id || !title || !description || !created_by) {
    console.error("Missing required fields:", { job_id, title, description, created_by });
    return res.status(400).json({ error: 'Job ID, Title, Description, and Creator are required.' });
  }

  const finalTitle = String(title);
  const finalTags = tags ? String(tags) : null;

  const query = 'INSERT INTO tasks (job_id, title, description, tags, created_by) VALUES (?, ?, ?, ?, ?)';
  const values = [
    parseInt(job_id),                     
    String(finalTitle),                   
    String(description),                  
    finalTags ? String(finalTags) : null, 
    String(created_by)                    
  ];

  db.query(query, values, (err, result) => {
    if (err) {      
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.status(201).json({ id: result.insertId, job_id, title: finalTitle, description, tags: finalTags, created_by });
  });
});

router.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});


module.exports = router;